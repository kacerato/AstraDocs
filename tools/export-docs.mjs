import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { examples } from '../data/editorial.mjs';
import { componentGuide, propertyUsage } from '../data/component-guides.mjs';
const version='snapshot-2026-10-06';
const site=process.env.SITE_URL||'https://astraengine.com.br';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const pages=read('data/pages.json');
const write=(p,data)=>{const file=path.join('dist',p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const json=(p,data)=>write(p,JSON.stringify(data,null,2));
json('releases/latest.json',read('data/release.json'));
const full=[];
for(const page of pages){
  const text=`---\ntitle: ${JSON.stringify(page.title)}\nversion: ${version}\nengineGeneration: astra-current\nlanguage: C#\nstatus: ${page.status}\nreviewedAt: ${page.reviewedAt || '2026-10-06'}\nruntimeVerified: false\nplatformEvidence: []\nurl: ${site}${page.url}\n---\n\n# ${page.title}\n\n${page.description}\n\n${page.body}\n`;
  write(page.markdown.slice(1),text);full.push(text);
}
json(`${version}/api-index.json`,read('data/api-index.json'));
json(`${version}/component-index.json`,{version,engineGeneration:'astra-current',runtimeVerified:false,platformEvidence:[],coverage:'numeric-boolean-enum-object-reference descriptors with editorial access and usage',components:read('data/components.json').map(c=>({...c,guide:componentGuide(c),properties:c.properties.map(p=>({...p,usage:propertyUsage(c,p),url:`/pt-br/${version}/componentes/${c.typeId.replace(/[^a-z0-9]+/g,'-')}/#field-${p.id.replace(/[^a-z0-9]+/g,'-')}`}))}))});
json(`${version}/roadmap.json`,read('data/roadmap.json'));
json(`${version}/coverage.json`,read('data/coverage.json'));
json(`${version}/markdown-index.json`,pages.map(({body,...p})=>p));
const exampleManifest=examples.map(e=>{
  const content=e.code+'\n';const url=`/examples/${e.id}/${e.filename}`;write(url.slice(1),content);
  const sha256=crypto.createHash('sha256').update(content).digest('hex');
  const evidence=fs.existsSync('data/example-evidence.json')?read('data/example-evidence.json').find(v=>v.sha256===sha256):null;
  return {id:e.id,description:e.description,prerequisites:e.prerequisites,version,url,bytes:Buffer.byteLength(content),sha256,compilationVerified:evidence?.compilationVerified===true,compilationMethod:evidence?.method||null,runtimeVerified:false,platformEvidence:[],license:'Not specified; no engine license granted'};
});
json(`${version}/examples.json`,exampleManifest);
await import('./pack-heart-example.mjs');
write('llms-full.txt',full.join('\n\n---\n\n'));
write('llms.txt',`# Astra Docs\n\n> Documentação da Astra atual, C#, ${version}.\n\nAssinaturas conferidas em fonte não comprovam execução no Android. Não misture com planos de Astra 2/Luau.\n\n- [Download Android](${site}/download/)\n- [Manifesto do APK](${site}/releases/latest.json)\n- [Versão e limites](${site}/pt-br/${version}/versoes/estado-da-versao/)\n- [Índice Markdown](${site}/${version}/markdown-index.json)\n- [API JSON](${site}/${version}/api-index.json)\n- [Componentes JSON](${site}/${version}/component-index.json)\n- [Exemplos](${site}/${version}/examples.json)\n- [Texto completo](${site}/llms-full.txt)\n`);
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${site}${p.url}</loc><lastmod>${p.reviewedAt || '2026-10-06'}</lastmod></url>`).join('')}</urlset>`);
console.log(`Exported ${pages.length} Markdown pages, JSON indexes and ${examples.length} examples.`);
