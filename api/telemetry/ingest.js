// POST /api/telemetry/ingest — lote "astra.telemetry.batch/1" ou pedido de
// apagar "astra.telemetry.delete/1". Só aceita o que o app Astra envia com o
// consentimento do testador; ver _store.js para o esquema e a validação.
import { database, ensureSchema, isInstallationId, Limits, validateBatch } from "./_store.js";

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > Limits.bodyBytes) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function reply(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(body));
}

const column = (distribution, index) => (Array.isArray(distribution) ? distribution[index] : null);

export default async function handler(request, response) {
  if (request.method !== "POST") return reply(response, 405, { error: "método" });
  if (Number(request.headers["content-length"] ?? 0) > Limits.bodyBytes) return reply(response, 413, { error: "tamanho" });
  const raw = await readBody(request);
  if (raw === null) return reply(response, 413, { error: "tamanho" });
  let body;
  try { body = JSON.parse(raw); } catch { return reply(response, 400, { error: "json" }); }

  const sql = database();
  if (!sql) return reply(response, 503, { error: "banco não configurado" });
  try {
    await ensureSchema(sql);
    if (body?.schema === "astra.telemetry.delete/1") {
      if (!isInstallationId(body.installation)) return reply(response, 400, { error: "installation" });
      const removed = await sql`delete from telemetry.installations where id = ${body.installation} returning id`;
      return reply(response, 200, { removed: removed.length });
    }
    const invalid = validateBatch(body);
    if (invalid) return reply(response, 400, { error: `inválido: ${invalid}` });

    const device = body.device;
    await sql`insert into telemetry.installations (id, app_package, device)
              values (${body.installation}, ${body.app.package}, ${JSON.stringify(device)}::jsonb)
              on conflict (id) do update set last_seen = now(), device = excluded.device`;
    const [{ recent }] = await sql`select count(*)::int as recent from telemetry.windows w
              join telemetry.sessions s on s.id = w.session_id
              where s.installation_id = ${body.installation} and w.received_at > now() - interval '1 hour'`;
    if (recent + body.windows.length > Limits.windowsPerHour) return reply(response, 429, { error: "limite" });

    const session = body.session;
    await sql`insert into telemetry.sessions (id, installation_id, started_at, app_version, app_code, device_model,
                                              gpu_name, tier_recommended, tier_resolved)
              values (${session.id}, ${body.installation}, ${session.started_at}, ${body.app.version}, ${body.app.code},
                      ${String(device.model).slice(0, 128)}, ${String(device.gpu?.name ?? "").slice(0, 128)},
                      ${session.tier_recommended || null}, ${session.tier_resolved || null})
              on conflict (id) do nothing`;
    let accepted = 0;
    for (const item of body.windows) {
      const inserted = await sql`insert into telemetry.windows (session_id, seq, scene, mode, tier, frames, elapsed_ms, fps,
                                    interval_p50, interval_p95, interval_p99, thread_cpu_mean, thread_cpu_p95,
                                    gpu_mean, gpu_p95, render_width, render_height, render_scale, thermal, raw)
              values (${session.id}, ${item.seq}, ${item.scene}, ${item.mode}, ${item.tier || null}, ${item.frames},
                      ${item.elapsed_ms}, ${item.fps}, ${column(item.interval_ms, 1)}, ${column(item.interval_ms, 2)},
                      ${column(item.interval_ms, 3)}, ${column(item.thread_cpu_ms, 0)}, ${column(item.thread_cpu_ms, 2)},
                      ${column(item.gpu_ms, 0)}, ${column(item.gpu_ms, 2)}, ${column(item.render, 0)},
                      ${column(item.render, 1)}, ${column(item.render, 2)},
                      ${Number.isInteger(item.thermal) ? item.thermal : null}, ${JSON.stringify(item)}::jsonb)
              on conflict (session_id, seq) do nothing returning id`;
      accepted += inserted.length;
    }
    for (const event of body.events ?? [])
      await sql`insert into telemetry.events (session_id, kind, payload)
                values (${session.id}, ${event.kind}, ${JSON.stringify(event.payload ?? {})}::jsonb)`;
    return reply(response, 200, { accepted });
  } catch (error) {
    console.error("[telemetry] gravação falhou", error?.message);
    return reply(response, 500, { error: "gravação" });
  }
}
