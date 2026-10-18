// Telemetria de desempenho dos testadores do app Astra (plano GT da engine).
// Arquivo com "_": não é rota. Guarda o esquema e o acesso ao Postgres (Neon via
// Vercel Storage). A conexão vem de DATABASE_URL, injetada pela Vercel; o app
// nunca recebe credencial e nenhuma tabela é exposta fora desta função.
import { neon } from "@neondatabase/serverless";

export const SchemaVersion = 1;

// Idempotente: a primeira chamada depois de ligar o banco cria tudo. Nada
// pessoal: id de instalação aleatório (apagável), modelo/GPU e números de quadro.
const Schema = `
create schema if not exists telemetry;
create table if not exists telemetry.meta (key text primary key, value text not null);
create table if not exists telemetry.installations (
  id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  app_package text not null check (length(app_package) <= 128),
  device jsonb not null default '{}'::jsonb
);
create table if not exists telemetry.sessions (
  id uuid primary key,
  installation_id uuid not null references telemetry.installations(id) on delete cascade,
  started_at timestamptz not null,
  received_at timestamptz not null default now(),
  app_version text not null check (length(app_version) <= 64),
  app_code integer not null,
  device_model text not null check (length(device_model) <= 128),
  gpu_name text not null check (length(gpu_name) <= 128),
  tier_recommended text check (tier_recommended in ('c','b','a','s')),
  tier_resolved text check (tier_resolved in ('c','b','a','s'))
);
create table if not exists telemetry.windows (
  id bigint generated always as identity primary key,
  session_id uuid not null references telemetry.sessions(id) on delete cascade,
  received_at timestamptz not null default now(),
  seq integer not null,
  scene text not null check (length(scene) <= 96),
  mode text not null check (mode in ('play','edit')),
  tier text check (tier in ('c','b','a','s')),
  frames integer not null check (frames > 0),
  elapsed_ms real not null,
  fps real not null,
  interval_p50 real, interval_p95 real, interval_p99 real,
  thread_cpu_mean real, thread_cpu_p95 real,
  gpu_mean real, gpu_p95 real,
  render_width integer, render_height integer, render_scale real,
  thermal smallint,
  raw jsonb not null,
  unique (session_id, seq)
);
create index if not exists windows_received_at on telemetry.windows (received_at);
create table if not exists telemetry.events (
  id bigint generated always as identity primary key,
  session_id uuid not null references telemetry.sessions(id) on delete cascade,
  received_at timestamptz not null default now(),
  kind text not null check (kind in ('bench','crash','slow_report')),
  payload jsonb not null check (pg_column_size(payload) <= 16384)
);
create or replace view telemetry.performance_by_gpu as
select s.gpu_name, coalesce(w.tier, s.tier_resolved) as tier, s.app_version, w.scene, w.mode,
       count(*) as windows, count(distinct s.installation_id) as installations,
       percentile_cont(0.5) within group (order by w.fps) as fps_median,
       percentile_cont(0.1) within group (order by w.fps) as fps_p10,
       percentile_cont(0.5) within group (order by w.interval_p95) as interval_p95_median,
       percentile_cont(0.5) within group (order by w.thread_cpu_mean) as cpu_median,
       percentile_cont(0.5) within group (order by w.gpu_mean) as gpu_median,
       max(w.thermal) as thermal_max
from telemetry.windows w join telemetry.sessions s on s.id = w.session_id
group by 1,2,3,4,5;
insert into telemetry.meta (key, value) values ('schema_version', '${SchemaVersion}')
on conflict (key) do update set value = excluded.value;
`;

let client = null;
let schemaReady = false;

export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  if (!client) client = neon(url);
  return client;
}

export async function ensureSchema(sql) {
  if (schemaReady) return;
  const statements = Schema.split(/;\s*\n/).map((statement) => statement.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  schemaReady = true;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value, maximum) => typeof value === "string" && value.length > 0 && value.length <= maximum;
const finite = (value) => typeof value === "number" && Number.isFinite(value);
const tiers = new Set(["c", "b", "a", "s"]);

export function isInstallationId(value) {
  return text(value, 36) && uuid.test(value);
}

// Recusa o lote inteiro em vez de gravar parte dele: um app com bug não deve
// contaminar o agregado com janelas meio preenchidas. Devolve o campo inválido.
export function validateBatch(batch) {
  if (!batch || batch.schema !== "astra.telemetry.batch/1") return "schema";
  if (!isInstallationId(batch.installation)) return "installation";
  const app = batch.app;
  if (!app || !text(app.package, 128) || !text(app.version, 64) || !Number.isInteger(app.code)) return "app";
  const device = batch.device;
  if (!device || !text(device.model, 128)) return "device";
  const session = batch.session;
  if (!session || !isInstallationId(session.id)) return "session";
  if (!text(session.started_at, 40) || Number.isNaN(Date.parse(session.started_at))) return "session.started_at";
  for (const key of ["tier_recommended", "tier_resolved"])
    if (session[key] !== undefined && session[key] !== null && !tiers.has(session[key])) return `session.${key}`;
  const windows = batch.windows;
  if (!Array.isArray(windows) || windows.length > 120) return "windows";
  for (const item of windows) {
    if (!item || item.schema !== "astra.telemetry.window/1") return "window.schema";
    if (!Number.isInteger(item.seq) || !Number.isInteger(item.frames) || item.frames <= 0) return "window.counts";
    if (!finite(item.fps) || !finite(item.elapsed_ms)) return "window.fps";
    if (item.mode !== "play" && item.mode !== "edit") return "window.mode";
    if (!text(item.scene, 96)) return "window.scene";
    if (item.tier !== undefined && item.tier !== null && item.tier !== "" && !tiers.has(item.tier)) return "window.tier";
    for (const key of ["interval_ms", "thread_cpu_ms"]) {
      const distribution = item[key];
      if (!Array.isArray(distribution) || distribution.length !== 5 || !distribution.every(finite)) return `window.${key}`;
    }
    if (item.gpu_ms !== null && item.gpu_ms !== undefined &&
        (!Array.isArray(item.gpu_ms) || item.gpu_ms.length !== 5 || !item.gpu_ms.every(finite))) return "window.gpu_ms";
  }
  const events = batch.events ?? [];
  if (!Array.isArray(events) || events.length > 20) return "events";
  for (const event of events) {
    if (!event || !["bench", "crash", "slow_report"].includes(event.kind)) return "event.kind";
    if (JSON.stringify(event.payload ?? {}).length > 16384) return "event.payload";
  }
  return null;
}

export const Limits = { bodyBytes: 256 * 1024, windowsPerHour: 2000 };
