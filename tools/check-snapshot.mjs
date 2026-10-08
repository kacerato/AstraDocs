import fs from 'node:fs';
import crypto from 'node:crypto';
import { reviewedNewComponentIds } from '../data/current-component-guides.mjs';
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
export function validateSnapshot() {
  const version='snapshot-2026-10-07', dir=`data/snapshots/${version}`;
  const source=read(`${dir}/source.json`), release=read('data/release.json');
  if(source.version!==version || source.releaseVersion!==release.version || source.versionCode!==release.versionCode || source.sourceCommit!==release.source.baselineCommit) throw Error('Current catalog must be extracted from the published APK source; refresh the snapshot before publishing another release.');
  for(const [file,hash] of Object.entries(source.sha256)) {
    if(!['api.json','components.json','component-member-map.json'].includes(file)) throw Error('Invalid snapshot contract path');
    const actual=crypto.createHash('sha256').update(fs.readFileSync(`${dir}/${file}`)).digest('hex');
    if(actual!==hash) throw Error(`Snapshot extraction changed without provenance: ${file}`);
  }
  const api=read(`${dir}/api.json`), components=read(`${dir}/components.json`), old=read('data/components.json');
  if(api.version!==version || source.componentTypes!==components.length || source.componentProperties!==components.reduce((n,c)=>n+c.properties.length,0) || source.apiTypes!==api.types.length || source.apiMembers!==api.types.reduce((n,t)=>n+t.members.length,0)) throw Error('Invalid extraction version or counts');
  if(new Set(components.map(c=>c.typeId)).size!==components.length) throw Error('Duplicate component identity');
  for(const c of components) {
    if(new Set(c.properties.map(p=>p.id)).size!==c.properties.length) throw Error(`Ambiguous property: ${c.typeId}`);
    if(!old.some(o=>o.typeId===c.typeId) && !reviewedNewComponentIds.includes(c.typeId)) throw Error(`New component needs individual guidance: ${c.typeId}`);
    if(c.api && !api.types.some(t=>t.ns==='Astra.Components' && t.name===c.api)) throw Error(`Missing facade: ${c.api}`);
  }
  return source;
}
