import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const updates = JSON.parse(fs.readFileSync('data/updates.json', 'utf8'));
export const scopeLabels = { app: 'App', docs: 'Docs' };
export const kindLabels = { feature: 'Novidade', improvement: 'Melhoria', fix: 'Correção', release: 'Publicação', migration: 'Migração' };
export const availabilityLabels = { development: 'App em desenvolvimento', distributed: 'APK publicado', documentation: 'Docs publicadas' };
export const availabilityLabel = e => e.availability === 'development' && e.scopes.includes('docs') ? 'Docs publicadas · app em desenvolvimento' : availabilityLabels[e.availability];
function publishedFeed(ref = 'HEAD') {
  try { return JSON.parse(execFileSync('git', ['show', `${ref}:data/updates.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch { return null; }
}
function previousFeed() {
  const head = publishedFeed();
  // After commit, CI must compare with the parent rather than with itself.
  return JSON.stringify(head) === JSON.stringify(updates) ? publishedFeed('HEAD^') : head;
}
export function validateUpdates(feed = updates, old = previousFeed()) {
  if (feed.schemaVersion !== 1 || feed.generation !== 'astra-current-csharp' || !Array.isArray(feed.entries) || !feed.entries.length) throw Error('Invalid updates feed');
  const ids = new Set(); let previous = '9999-99-99';
  for (const e of feed.entries) {
    if (!/^[a-z0-9-]{5,100}$/.test(e.id) || ids.has(e.id)) throw Error(`Invalid update ID: ${e.id}`);
    ids.add(e.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || e.date > previous || !Array.isArray(e.scopes) || !e.scopes.length || e.scopes.length > 2 || new Set(e.scopes).size !== e.scopes.length || e.scopes.some(s => !scopeLabels[s]) || !kindLabels[e.kind] || !availabilityLabels[e.availability]) throw Error(`Invalid update: ${e.id}`);
    previous = e.date;
    if (new Date(`${e.date}T00:00:00Z`).toISOString().slice(0,10) !== e.date) throw Error(`Invalid calendar date: ${e.id}`);
    if ((e.availability === 'documentation' && !e.scopes.includes('docs')) || (e.availability !== 'documentation' && !e.scopes.includes('app'))) throw Error(`Availability contradicts scope: ${e.id}`);
    if (e.availability === 'distributed' && (e.kind !== 'release' || !e.releaseVersion || !Number.isSafeInteger(e.versionCode) || e.versionCode < 1)) throw Error(`Missing APK release identity: ${e.id}`);
    for (const key of ['title', 'summary', 'version', 'validation', 'migration']) if (typeof e[key] !== 'string' || !e[key].trim() || e[key].length > 1200) throw Error(`Missing ${key}: ${e.id}`);
    if (!Array.isArray(e.details) || !e.details.length || e.details.length > 10 || e.details.some(s => typeof s !== 'string' || !s.trim() || s.length > 1200)) throw Error(`Invalid details: ${e.id}`);
    if (!Array.isArray(e.links) || e.links.length > 8) throw Error(`Invalid links: ${e.id}`);
    for (const link of e.links) {
      const u = new URL(link.url, 'https://astraengine.com.br');
      if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443') || !['astraengine.com.br', 'github.com'].includes(u.hostname) || (u.hostname === 'github.com' && !u.pathname.startsWith('/kacerato/AstraDocs/'))) throw Error(`Invalid public link: ${e.id}`);
      if (typeof link.label !== 'string' || !link.label.trim() || link.label.length > 1200) throw Error(`Missing link label: ${e.id}`);
    }
  }
  if (feed.updatedAt !== feed.entries[0].date) throw Error('Invalid feed revision');
  // Retain historical items. Corrections are a new entry rather than a silent
  // rewrite of already published history. Bootstrap works before the first commit.
  if (old) for (const e of old.entries) if (JSON.stringify(e) !== JSON.stringify(feed.entries.find(n => n.id === e.id))) throw Error(`Published update altered or removed: ${e.id}`);
}

export function validateReleaseNote(release, feed = updates) {
  if (!feed.entries.some(e => e.scopes.includes('app') && e.kind === 'release' && e.availability === 'distributed' && e.releaseVersion === release.version && e.versionCode === release.versionCode && e.date === release.date)) throw Error('APK release has no matching App update with version, versionCode and date.');
}

export function contentFiles() {
  const files = [];
  function walk(dir) { for (const item of fs.readdirSync(dir, { withFileTypes: true })) { const f = `${dir}/${item.name}`; if (item.isDirectory()) walk(f); else if (!f.endsWith('.gz') && !/(updates|update-coverage|generated-files|pages|api-index|reference-indexes|coverage)\.json$/.test(f)) files.push(f); } }
  walk('data'); walk('src/components'); walk('src/styles'); walk('public');
  files.push('tools/check-update-notice.mjs');
  files.push('tools/check-snapshot.mjs', 'tools/sync-snapshot.mjs', 'tools/export-components.cpp', 'tools/export-api/Program.cs', 'tools/sync-member-map.mjs');
  files.push('astro.config.mjs', 'package.json', 'package-lock.json', 'tsconfig.json', 'vercel.json', 'src/content.config.ts', 'src/content/docs/404.md', 'tools/generate-content.mjs', 'tools/export-docs.mjs', 'tools/updates.mjs', 'tools/check-release.mjs', 'tools/pack-heart-example.mjs', 'tools/prepare-deploy.mjs');
  return files.sort();
}
export function contentHash() {
  const hash = crypto.createHash('sha256');
  const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
  for (const f of contentFiles()) {
    const bytes = fs.readFileSync(f);
    // Vercel rewrites its config formatting before executing the build.
    // Compare every configuration value, preserving order in routing arrays.
    const content = f === 'vercel.json' ? JSON.stringify(canonical(JSON.parse(bytes.toString('utf8')))) : /\.(json|mjs|astro|css|ts|md|txt|csv|svg|webmanifest|cs|cpp)$/.test(f) ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
    hash.update(f + '\0').update(content).update('\0');
  }
  return hash.digest('hex');
}
export function requireCoverage() {
  validateUpdates();
  const c = JSON.parse(fs.readFileSync('data/update-coverage.json', 'utf8'));
  if (c.contentHash !== contentHash() || !updates.entries.some(e => e.id === c.entry && e.scopes.includes('docs'))) throw Error('Docs changed without an update entry. Add data/updates.json entry, then npm run updates:record -- --entry <new-id>.');
}
export function markdown() {
  return `App e documentação compartilham este histórico. Uma mudança em desenvolvimento não significa que está no APK público.\n\n[Central de atualizações](/atualizacoes/) · [Download](/download/) · [Feed JSON](/updates/feed.json)\n\n` + updates.entries.map(e => `<h2 id="${e.id}">${e.title}</h2>\n\n${e.date} · ${e.scopes.map(s => scopeLabels[s]).join(' + ')} · ${kindLabels[e.kind]} · ${availabilityLabel(e)}\n\n**Versão:** ${e.version}\n\n${e.summary}\n\n${e.details.map(s => '- ' + s).join('\n')}\n\n**Validação:** ${e.validation}\n\n**Migração:** ${e.migration}\n\n${e.links.map(l => `[${l.label}](${l.url})`).join(' · ')}`).join('\n\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('tools/updates.mjs')) {
  validateUpdates();
  if (process.argv.includes('--record')) {
    const id = process.argv[process.argv.indexOf('--entry') + 1];
    if (!updates.entries.some(e => e.id === id && e.scopes.includes('docs'))) throw Error('Choose a docs entry with --entry');
    const old = publishedFeed();
    if (old?.entries.some(e => e.id === id)) throw Error('Use a new entry for this revision');
    fs.writeFileSync('data/update-coverage.json', JSON.stringify({ entry: id, contentHash: contentHash() }, null, 2) + '\n');
  } else requireCoverage();
  console.log(`Updates validated: ${updates.entries.length} entries; content covered.`);
}
