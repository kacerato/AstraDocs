import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const files=['package.json','package-lock.json','astro.config.mjs','tsconfig.json','vercel.json','src/content.config.ts','src/content/docs/404.md','data/editorial.mjs','data/example-evidence.json','tools/generate-content.mjs','tools/export-docs.mjs'];
for(const dir of ['src/components','src/styles'])for(const name of fs.readdirSync(dir))files.push(`${dir}/${name}`);
const assets=['brand/astra-lockup-1024.webp','brand/favicon-32.png','brand/favicon-180.png','brand/favicon-192.png','social/home-1200x630.png',...['welcome-256','welcome-512','welcome-768','code-256','build-256','success-256','search-256'].map(n=>`mascot/orbit-${n}.webp`)];
files.push('data/project.mjs','data/release.json','tools/check-release.mjs','public/assets/mascot/orbit-build-512.webp');
files.push('data/ui-guides.mjs','data/component-guides.mjs','data/api-guides.mjs','data/roadmap-guides.mjs','data/roadmap.json','data/component-member-map.json','tools/pack-heart-example.mjs');
files.push('data/editor-guides.mjs','data/concept-guides.mjs','data/system-guides.mjs','data/workflow-guide-tools.mjs','data/workflow-examples.mjs');
for(const file of ['README.txt','UI/hud.aeui','Images/heart-full.png','Images/heart-empty.png'])files.push(`public/examples/heart-hud/${file}`);
files.push(...assets.map(a=>'public/assets/'+a));
fs.mkdirSync('evidence/deploy',{recursive:true});
const manifest=files.map(file=>({file,local:path.resolve(file)}));
for(const name of ['api','components']){
 const local=path.resolve(`evidence/deploy/${name}.json.gz`);fs.writeFileSync(local,zlib.gzipSync(fs.readFileSync(`data/${name}.json`),{level:9}));manifest.push({file:`data/${name}.json.gz`,local});
}
for(const entry of manifest){const bytes=fs.readFileSync(entry.local);entry.size=bytes.length;entry.sha=crypto.createHash('sha1').update(bytes).digest('hex');}
fs.writeFileSync('evidence/deploy-files.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({files:manifest.length,bytes:manifest.reduce((n,f)=>n+f.size,0)}));
