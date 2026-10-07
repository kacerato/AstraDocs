import fs from 'node:fs';
import { validateUpdates, validateReleaseNote } from './updates.mjs';
const r = JSON.parse(fs.readFileSync('data/release.json', 'utf8'));
validateUpdates();
validateReleaseNote(r);
const fail = message => { throw new Error(`Release: ${message}`); };
if (!r.buildVerified || !r.signatureVerified) fail('build and signature evidence are required before publishing');
if (!Number.isSafeInteger(r.bytes) || r.bytes <= 0) fail('invalid APK size');
if (!Number.isSafeInteger(r.versionCode) || r.versionCode <= 0) fail('invalid Android versionCode');
for (const field of ['sha256', 'certificateSha256']) {
  if (!/^[a-f0-9]{64}$/.test(r[field])) fail(`invalid ${field}`);
}
for (const field of ['downloadUrl', 'releaseUrl', 'checksumUrl']) {
  const url = new URL(r[field]);
  if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/kacerato/AstraDocs/releases/')) fail(`unexpected destination: ${field}`);
}
if (!r.downloadUrl.endsWith('/' + r.filename) || !r.filename.endsWith('.apk')) fail('APK filename does not match download URL');
if (r.channel !== 'preview') fail('review device evidence before changing release channel');
console.log(`Release manifest verified: ${r.version}, ${r.bytes} bytes, SHA-256 ${r.sha256}`);
