import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { examples } from '../data/editorial.mjs';
import { componentGuide, propertyUsage } from '../data/component-guides.mjs';
import { currentComponentGuide, currentPropertyUsage } from '../data/current-component-guides.mjs';
const version='snapshot-2026-10-06';
const site=process.env.SITE_URL||'https://astraengine.com.br';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const pages=read('data/pages.json');
const write=(p,data)=>{const file=path.join('dist',p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const json=(p,data)=>write(p,JSON.stringify(data,null,2));
json('releases/latest.json',read('data/release.json'));
json('updates/feed.json',read('data/updates.json'));
const full=[];
for(const page of pages){
  const text=`---\ntitle: ${JSON.stringify(page.title)}\nversion: ${page.version || version}\nengineGeneration: astra-current\nlanguage: C#\nstatus: ${page.status}\nreviewedAt: ${page.reviewedAt || '2026-10-06'}\n${page.appRelease?`appRelease: ${JSON.stringify(page.appRelease)}\n`:''}runtimeVerified: ${page.runtimeVerified === true}\nplatformEvidence: ${JSON.stringify(page.platformEvidence || [])}\nurl: ${site}${page.url}\n---\n\n# ${page.title}\n\n${page.description}\n\n${page.body}\n`;
  write(page.markdown.slice(1),text);full.push(text);
}
for(const [snapshot,index] of Object.entries(read('data/reference-indexes.json'))) {
  const current=snapshot!==version, dir=current?`data/snapshots/${snapshot}`:'data';
  const guide=current?currentComponentGuide:componentGuide, usage=current?currentPropertyUsage:propertyUsage;
  const source=current?read(`${dir}/source.json`):null;
  json(`${snapshot}/api-index.json`,index.apiIndex);
  json(`${snapshot}/coverage.json`,index.coverage);
  if(source)json(`${snapshot}/source.json`,source);
  json(`${snapshot}/component-index.json`,{version:snapshot,...(source?{appRelease:source.releaseVersion,sourceCommit:source.sourceCommit}:{}),engineGeneration:'astra-current',runtimeVerified:false,platformEvidence:[],coverage:'numeric-boolean-enum-object-reference descriptors with editorial access and usage; specialized resources and collections in individual guides',components:read(`${dir}/components.json`).map(c=>({...c,guide:guide(c),properties:c.properties.map(p=>({...p,usage:usage(c,p),url:`/pt-br/${snapshot}/componentes/${c.typeId.replace(/[^a-z0-9]+/g,'-')}/#field-${p.id.replace(/[^a-z0-9]+/g,'-')}`}))}))});
}
json(`${version}/roadmap.json`,read('data/roadmap.json'));
json(`${version}/coverage.json`,read('data/coverage.json'));
for(const snapshot of new Set(pages.map(p=>p.version||version)))
  json(`${snapshot}/markdown-index.json`,pages.filter(p=>(p.version||version)===snapshot).map(({body,...p})=>p));
const exampleManifest=examples.map(e=>{
  const content=e.code+'\n';const url=`/examples/${e.id}/${e.filename}`;write(url.slice(1),content);
  const sha256=crypto.createHash('sha256').update(content).digest('hex');
  const evidence=fs.existsSync('data/example-evidence.json')?read('data/example-evidence.json').find(v=>v.sha256===sha256):null;
  return {id:e.id,description:e.description,prerequisites:e.prerequisites,version,url,bytes:Buffer.byteLength(content),sha256,compilationVerified:evidence?.compilationVerified===true,compilationMethod:evidence?.method||null,runtimeVerified:false,platformEvidence:[],license:'Not specified; no engine license granted'};
});
json(`${version}/examples.json`,exampleManifest);
await import('./pack-heart-example.mjs');
write('llms-full.txt',full.join('\n\n---\n\n'));
write('llms.txt',`# Astra Docs\n\n> Astra atual, C#: catálogo snapshot-2026-10-09 do APK 0.3.0; guias gerais e arquivo ${version}.\n\nAssinaturas conferidas em fonte não comprovam execução no Android. Não misture com planos de Astra 2/Luau.\n\n- [Download Android](${site}/download/)\n- [Atualizações do app e das docs](${site}/atualizacoes/)\n- [Feed de atualizações](${site}/updates/feed.json)\n- [Manifesto do APK](${site}/releases/latest.json)\n- [Versão e limites](${site}/pt-br/${version}/versoes/estado-da-versao/)\n- [Índice Markdown](${site}/${version}/markdown-index.json)\n- [Catálogo atual](${site}/pt-br/snapshot-2026-10-09/componentes/)\n- [Novas fichas e limites](${site}/pt-br/snapshot-2026-10-09/componentes/novidades/)\n- [Índice Markdown atual](${site}/snapshot-2026-10-09/markdown-index.json)\n- [API JSON atual](${site}/snapshot-2026-10-09/api-index.json)\n- [Componentes JSON atuais](${site}/snapshot-2026-10-09/component-index.json)\n- [Origem do catálogo atual](${site}/snapshot-2026-10-09/source.json)\n- [Navegação: malha, agentes, obstáculos e links](${site}/pt-br/snapshot-2026-10-09/sistemas/navegacao/)\n- [Catálogo do APK 0.2.3 (07/10)](${site}/pt-br/snapshot-2026-10-07/componentes/)\n- [API JSON histórica](${site}/${version}/api-index.json)\n- [Componentes JSON históricos](${site}/${version}/component-index.json)\n- [Exemplos](${site}/${version}/examples.json)\n- [Texto completo](${site}/llms-full.txt)\n`);
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${site}${p.url}</loc><lastmod>${p.reviewedAt || '2026-10-06'}</lastmod></url>`).join('')}</urlset>`);
console.log(`Exported ${pages.length} Markdown pages, JSON indexes and ${examples.length} examples.`);
