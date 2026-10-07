import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { contentFiles, requireCoverage } from './updates.mjs';
requireCoverage();
// Keep API uploads and Git deployments on the same covered source set.
const files = [...contentFiles().filter(f => !['data/api.json','data/components.json'].includes(f)), 'data/updates.json', 'data/update-coverage.json'];
fs.mkdirSync('evidence/deploy',{recursive:true});
const manifest=files.map(file=>({file,local:path.resolve(file)}));
for(const name of ['api','components']){
 const local=path.resolve(`evidence/deploy/${name}.json.gz`);fs.writeFileSync(local,zlib.gzipSync(fs.readFileSync(`data/${name}.json`),{level:9}));manifest.push({file:`data/${name}.json.gz`,local});
}
for(const entry of manifest){const bytes=fs.readFileSync(entry.local);entry.size=bytes.length;entry.sha=crypto.createHash('sha1').update(bytes).digest('hex');}
fs.writeFileSync('evidence/deploy-files.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({files:manifest.length,bytes:manifest.reduce((n,f)=>n+f.size,0)}));
