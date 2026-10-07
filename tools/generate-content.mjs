import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { pages } from '../data/editorial.mjs';
import { projectStatusMarkdown } from '../data/project.mjs';
import { componentGuide, propertyUsage, componentFamilies } from '../data/component-guides.mjs';
import { apiContext, memberGuide } from '../data/api-guides.mjs';
import { roadmapPages } from '../data/roadmap-guides.mjs';
import { updates, requireCoverage, markdown as updatesMarkdown } from './updates.mjs';
import { motorControlGuide } from '../data/motor-control-guide.mjs';
const root = path.resolve('src/content/docs');
const version = 'snapshot-2026-10-06';
const base = `pt-br/${version}`;
const readJson = p => JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
// Deployment uploads compressed public contracts, never engine source.
for(const name of ['api','components'])if(!fs.existsSync(`data/${name}.json`)&&fs.existsSync(`data/${name}.json.gz`))fs.writeFileSync(`data/${name}.json`,zlib.gunzipSync(fs.readFileSync(`data/${name}.json.gz`)));
const api = readJson('data/api.json');
requireCoverage();
const components = readJson('data/components.json');
const release = readJson('data/release.json');
const roadmap = readJson('data/roadmap.json');
const componentMemberMap = readJson('data/component-member-map.json');
const slug = s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const cell = s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = s=>String(s??'').replace(/<(?!\/?(?:br|code)\b)/g,'&lt;');
const quote = JSON.stringify;
const apiPath = t=>`/${base}/api/${slug(t.fullName)}/`;
const componentPath = t=>`/${base}/componentes/${slug(t.typeId)}/`;
const manifest=[];
const generated=[];
function write(route,title,description,body,options={}) {
  const file=path.join(root,`${route}.${options.mdx?'mdx':'md'}`);
  const front={title,description,version,kind:options.kind||'guide',status:options.status||'source-reviewed',reviewedAt:'2026-10-06',runtimeVerified:false,editUrl:false,...options.front};
  const source=`---\n${Object.entries(front).map(([k,v])=>`${k}: ${quote(v)}`).join('\n')}\n---\n\n${body}\n`;
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);
  generated.push(path.relative(root,file).replaceAll('\\','/'));
  const id=route.replace(/\/index$/,'');
  manifest.push({id,title,description,version:front.version,kind:front.kind,status:front.status,reviewedAt:front.reviewedAt,runtimeVerified:front.runtimeVerified,platformEvidence:options.platformEvidence||[],url:route==='index'?'/':`/${id}/`,markdown:`/markdown/${id}.md`,body:options.markdown||body});
}
// Delete only files recorded by the previous generation, never authored content.
const previous=fs.existsSync('data/generated-files.json')?readJson('data/generated-files.json'):[];
for(const file of previous) { const full=path.resolve(root,file);if(!full.startsWith(root+path.sep))throw Error('Invalid generated path'); if(fs.existsSync(full))fs.unlinkSync(full); }
write('index','Você joga. Agora, você cria.','Documentação da Astra. Comece a criar, explore os componentes e consulte a API C#.',`import Home from '../../components/Home.astro';\n\n<Home />`,{mdx:true,kind:'index',status:'editorial',front:{template:'splash',title:'Astra Docs',tableOfContents:false},markdown:`# Astra Docs\n\n${projectStatusMarkdown}\n\nVocê joga. Agora, você cria.\n\n- [Baixar Astra](/download/)\n- [Atualizações](/atualizacoes/)\n- [Comece do zero](/${base}/comece/indice/)\n- [Componentes](/${base}/componentes/)\n- [API C#](/${base}/api/)\n- [Exemplos](/${base}/exemplos/como-executar-exemplos/)`});
write('download','Baixar Astra para Android','Baixe a prévia pública da Astra para Android. APK assinado, requisitos, instruções de instalação e verificação de integridade.',`import Download from '../../components/Download.astro';\n\n<Download />`,{mdx:true,kind:'release',status:'editorial',front:{template:'splash',tableOfContents:false},markdown:`${projectStatusMarkdown}\n\n## Astra ${release.version}\n\nPrévia pública de ${release.dateLabel}. Android 8.0+, ARM64, GPU com Vulkan 1.1. APK de ${release.sizeLabel}.\n\n[Baixar APK](${release.downloadUrl}) · [Notas da versão](${release.releaseUrl})\n\nSHA-256: \`${release.sha256}\`\n\nBaixe e abra o APK, autorize a instalação pelo navegador quando solicitado e abra a Astra. Preserve projetos antes de atualizar: instalações com outra assinatura exigem reinstalação. A compilação e a assinatura foram verificadas; esta publicação não inclui nova validação em aparelho físico. Dispositivos com páginas de memória de 16 KB não são suportados nesta distribuição.\n\n[Primeiro projeto](/${base}/comece/primeiro-projeto/)\n\n[Manifesto](/releases/latest.json)`});
write('atualizacoes','Atualizações','Tudo que entrou no aplicativo e nas docs, com versão, disponibilidade, uso e migração.',`import Updates from '../../components/Updates.astro';\n\n<Updates />`,{mdx:true,kind:'release',status:'editorial',front:{reviewedAt:updates.updatedAt,tableOfContents:false,prev:false,next:false},markdown:updatesMarkdown()});
for(const [order,page] of pages.entries())write(`${base}/${page.route}`,page.route==='versoes/changelog'?'Histórico de atualizações':page.title,page.route==='versoes/changelog'?'Novidades do app e das docs, com versão e disponibilidade.':page.description,page.route==='versoes/changelog'?updatesMarkdown():page.body.replaceAll('$BASE',`/${base}`),{...page.options,front:{sidebar:{order},...page.options?.front,...(page.route==='versoes/changelog'?{reviewedAt:updates.updatedAt}:{})}});
for(const page of roadmapPages(components,roadmap))write(`${base}/${page.route}`,page.title,page.description,page.body.replaceAll('$BASE',`/${base}`),{kind:'roadmap',status:'source-reviewed',front:{tableOfContents:{maxHeadingLevel:2}}});

const apiIndex=[];
for(const type of api.types) {
  const context=apiContext(type,components);
  const lines=[`**Namespace:** \`${type.ns}\` · **Assembly:** \`Astra.Scripting\` · **Tipo:** ${type.kind}`,
    `:::note[Sobre esta referência]\nAssinaturas extraídas semanticamente com Roslyn/MSBuild. Isso confirma a superfície do código deste snapshot; não comprova execução no Android. As descrições vêm dos comentários da API. Membros sem explicação ainda exigem revisão editorial.\n:::`,
    '## Declaração',`\`\`\`csharp\n${type.signature}\n\`\`\``];
  if(type.docs.summary)lines.push(text(type.docs.summary));
  if(type.docs.remarks)lines.push(text(type.docs.remarks));
  if(type.baseType && !['object','System.Object','System.ValueType','System.Enum'].includes(type.baseType))lines.push(`**Herda de:** \`${type.baseType}\`.`);
  if(type.interfaces.length)lines.push(`**Interfaces:** ${type.interfaces.map(i=>`\`${i}\``).join(', ')}.`);
  lines.push('## Onde acessar este tipo',context.access,'## Roadmap e uso',`[${componentFamilies[context.family].title}](/${base}/${componentFamilies[context.family].route}/): o membro presente nesta referência pertence ao contrato atual. O roadmap registra a família; não há promessa/data individual de evolução para cada membro. Membros ainda sem explicação especializada são indicados como revisão editorial pendente.`, 'Para ler os campos e recursos pelo caminho do editor, use [mapa de acesso](/'+base+'/editor/mapa-de-acesso/).');
  const comp=components.find(c=>type.ns==='Astra.Components'&&c.api===type.name);
  if(comp)lines.push(`Consulte também [${comp.name}](${componentPath(comp)}) para propriedades, valores iniciais, requisitos e edição em Play.`);
  lines.push('## Membros');
  if(type.members.length)lines.push('| Membro | Categoria |\n|---|---|\n'+type.members.map(m=>`| [${cell(m.name)}](#${anchor(m.uid)}) | ${m.kind} |`).join('\n'));
  else lines.push('Este tipo não declara membros públicos adicionais neste recorte.');
  for(const m of type.members) {
    const id=anchor(m.uid);
    const guidance=memberGuide(type,m,context,componentMemberMap);
    lines.push(`<h3 id="${id}" class="astra-member">${cell(m.name)}</h3>`,`\`\`\`csharp\n${m.signature}${m.constant!==null?` = ${m.constant}`:''}\n\`\`\``);
    if(m.docs.summary)lines.push(text(m.docs.summary));
    if(m.docs.remarks)lines.push(text(m.docs.remarks));
    lines.push(`**Caminho:** ${guidance.path}`,`**Uso:** ${text(guidance.usage)}`,`**Roadmap deste membro:** [${componentFamilies[context.family].title}](/${base}/${guidance.roadmapRoute}/). Contrato existente neste snapshot; sem tarefa individual/datada registrada nesta referência.`);
    if(m.parameters?.length)lines.push('| Parâmetro | Tipo | Contrato |\n|---|---|---|\n'+m.parameters.map(p=>`| \`${cell(p.name)}\` | \`${cell(p.type)}\` | ${cell(m.docs.parameters.find(d=>d.name===p.name)?.description||'')}${p.optional?` · Opcional: \`${cell(p.defaultValue??'null')}\``:''}${p.modifier!=='None'?` · ${p.modifier}`:''} |`).join('\n'));
    if(m.docs.returns)lines.push(`**Retorno:** ${text(m.docs.returns)}`);
    if(m.docs.exceptions?.length)lines.push('**Exceções documentadas:**\n\n'+m.docs.exceptions.map(e=>`- \`${e.type}\`: ${text(e.description)}`).join('\n'));
    apiIndex.push({uid:m.uid,signature:m.signature,kind:m.kind,version,engineGeneration:'astra-current',language:'C#',url:apiPath(type)+`#${id}`,summary:m.docs.summary,access:guidance.path,usage:guidance.usage,roadmap:`/${base}/${guidance.roadmapRoute}/`,documentationStatus:guidance.editorialReviewed?'source-reviewed-usage':'individual-review-pending',runtimeVerified:false,platformEvidence:[]});
  }
  write(`${base}/api/${slug(type.fullName)}`,type.fullName,type.docs.summary||`${type.kind} da API C# da Astra. ${type.members.length} membros declarados neste snapshot.`,lines.join('\n\n').replaceAll('$BASE',`/${base}`),{kind:'api',status:'semantic-reference',front:{pagination:false,tableOfContents:{maxHeadingLevel:2}}});
  apiIndex.push({uid:type.uid,signature:type.signature,kind:type.kind,version,engineGeneration:'astra-current',language:'C#',url:apiPath(type),summary:type.docs.summary,runtimeVerified:false,platformEvidence:[]});
}
function anchor(uid){if(!uid)throw Error('Missing semantic UID');return 'member-'+crypto.createHash('sha256').update(uid).digest('hex').slice(0,16);}
for(const c of components) {
  const guidance=componentGuide(c);
  const type=api.types.find(t=>t.ns==='Astra.Components'&&t.name===c.api);
  const ruleList=rules=>rules.length?rules.map(r=>{const ref=components.find(c=>c.typeId===r.typeId);return `- ${ref?`[${ref.name}](${componentPath(ref)})`:`\`${r.typeId}\``}: ${r.message}`;}).join('\n'):'Nenhuma regra adicional declarada no schema deste componente.';
  const lines=[`**Família:** ${c.family} · **Grupo:** ${c.subfamily||c.family} · **Identificador:** \`${c.typeId}\` · **Payload:** ${c.schemaVersion}`,
    `:::note[Escopo da evidência]\nEste contrato foi extraído dos descritores compilados da engine, incluindo padrões resolvidos. A presença do contrato não substitui a validação do comportamento em um aparelho.\n:::`,
    '## Para que usar',guidance.purpose,guidance.use,'## Criar e configurar',guidance.location,
    `${c.allowMultiple?'O schema permite múltiplas instâncias no mesmo objeto; identifique a instância antes de editar ou remover.':'O schema permite uma única instância desse tipo por objeto.'} ${type?`A fachada C# correspondente é [${type.fullName}](${apiPath(type)}).`:'Não há fachada C# gerada para este tipo; não invente um nome de classe equivalente.'}`,
    guidance.extra, '## Exemplo de uso',guidance.example,
    c.typeId==='astra.ui.canvas'?`[HUD de corações completo](/${base}/ui/hud-coracoes/) · [Image e seus campos](/${base}/ui/image/) · [Onde fica a UI](/${base}/ui/comece-aqui/)`:'',
    '## Dependências',ruleList(c.requirements),'## Conflitos',ruleList(c.conflicts),
    '## Edição e ciclo de vida',`| Operação | Contrato |\n|---|---|\n| Adicionar/remover em Play | ${c.structuralInPlay} |\n| Alterar propriedades em Play | ${c.propertiesInPlay} |\n| Múltiplas instâncias | ${c.allowMultiple?'Sim':'Não'} |\n| Versão do payload | ${c.schemaVersion} |`,
    'Alterações em ponto seguro são aplicadas entre passos da simulação. Um componente exigido por outro não pode ser removido enquanto a dependência existir. Salvar a cena autoral e modificar o mundo de Play são operações distintas; veja [Play e cena autoral](/'+base+'/conceitos/play-e-cena-autoral/).',
    '## Propriedades',
    c.properties.length?'Valores abaixo são resolvidos pelo descritor de um componente recém-criado. Campos por slot dependem dos recursos atribuídos. Um campo sem padrão significa que o descritor não fornece um valor independente de contexto.':'O componente não expõe propriedades numéricas, booleanas, enumerações ou referências de objeto neste extrator. Recursos e operações especializadas devem ser consultados na API.'];
  const groups=[...new Set(c.properties.map(p=>p.group||'Geral'))];
  for(const group of groups){lines.push(`### ${group}`,'| Propriedade | Tipo / unidade | Padrão | Domínio |\n|---|---|---|---|\n'+c.properties.filter(p=>(p.group||'Geral')===group).map(p=>`| [**${cell(p.name)}**](#field-${slug(p.id)})<br/>\`${p.id}\` | ${cell(p.kind)}${p.unit?` · ${cell(p.unit)}`:''}${p.perSlot?'<br/>Por slot':''} | ${cell(p.default)||'Depende do contexto'} | ${cell(p.domain)} |`).join('\n'));
    for(const p of c.properties.filter(p=>(p.group||'Geral')===group))lines.push(`<h4 id="field-${slug(p.id)}">${cell(p.name)} · <code>${p.id}</code></h4>`,`**Onde:** Inspector → **${c.name}** → **${group}** → **${p.name}**${p.perSlot?' → escolha o slot/recurso':''}.`,`**Uso e efeito:** ${text(propertyUsage(c,p))}`,`**Valor:** ${cell(p.default)||'dependente do contexto'} · **Tipo:** ${p.kind}${p.unit?` · **Unidade:** ${p.unit}`:''} · **Domínio:** ${cell(p.domain)}.`,`${p.conditional?'Campo condicional: o modo/forma/recurso selecionado controla a disponibilidade. ':''}${p.restrictedWrite?'Escrita condicionada pelo descritor; trate recusa e verifique autoridade/runtime. ':''}${p.tweenable?'Aceita tween numérico via contrato de propriedade. ':''}${text(p.limitation)}${p.capability?` Capacidade necessária: \`${p.capability}\`; veja [estado do renderer](/${base}/roadmap/capacidades-do-renderer/).`:''}`.trim());
  }
  lines.push('## Roadmap deste componente',`[${guidance.title}](/${base}/${guidance.route}/). ${guidance.next}`, 'Os campos acima pertencem ao contrato existente; novas funções dependem do fechamento da família. Não há datas individuais prometidas para cada propriedade.', '## Conferir na sua cena',`1. Crie **${c.name}** pelo fluxo indicado e resolva as dependências.\n2. Altere uma propriedade por vez e observe o efeito esperado na cena.\n3. Salve, reabra e confira os valores autorais.\n4. Entre em Play e verifique o comportamento com os recursos reais do projeto.\n5. Pare o Play e confira a cena autoral.\n\nEste é um roteiro de conferência; não representa um teste executado nesta publicação.`,
    '## Limitações da referência','A tabela cobre os tipos de propriedade disponíveis no descritor de reflexão. Não presume persistência de campos transitórios, equivalência com outras engines ou suporte em todos os aparelhos. Recursos, coleções e operações podem exigir APIs específicas.',
    c.reference?`**Referência de arquitetura registrada pela engine:** [documentação oficial](${c.reference}). Essa referência não representa paridade funcional.`:'');
  write(`${base}/componentes/${slug(c.typeId)}`,c.name,c.description,lines.join('\n\n'),{kind:'component',front:{pagination:false,tableOfContents:{maxHeadingLevel:2}}});
}
for(const kind of ['component','api']) {
  const isApi=kind==='api';const title=isApi?'Referência C#':'Componentes';const route=`${base}/${isApi?'api':'componentes'}/index`;
  const records=isApi?api.types:components;
  write(route,title,isApi?'Encontre tipos, propriedades e métodos da API C# deste snapshot.':'Encontre o componente, entenda suas propriedades e componha sua cena.',`import Catalog from '../../../../../components/Catalog.astro';\n\n${isApi?`${api.types.length} tipos e ${api.types.reduce((n,t)=>n+t.members.length,0)} membros extraídos com Roslyn/MSBuild.`:`${components.length} registros e ${components.reduce((n,c)=>n+c.properties.length,0)} campos de componentes, com uso e caminho; mais 13 elementos de UI documentados separadamente.`}\n\n[Mapa de acesso](/${base}/editor/mapa-de-acesso/) · [Image / UiImage](/${base}/ui/image/) · [HUD de corações funcional](/${base}/ui/hud-coracoes/)\n\nOs registros abaixo são contratos de fonte. A validação funcional por plataforma permanece separada.\n\n<Catalog kind="${kind}" />`,{kind:'index',mdx:true,front:{tableOfContents:false,pagination:false},markdown:`# ${title}\n\nContratos de fonte; execução por plataforma não validada nesta publicação.\n\n[UI de jogo](/${base}/ui/elementos/) · [Image](/${base}/ui/image/) · [HUD de corações](/${base}/ui/hud-coracoes/)\n\n`+records.map(t=>`- [${isApi?t.fullName:t.name}](${isApi?apiPath(t):componentPath(t)})`).join('\n')});
}
write(motorControlGuide.route,motorControlGuide.title,motorControlGuide.description,motorControlGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-07',runtimeVerified:true},platformEvidence:['host: 8 targeted scenarios, 117 editor regressions, real ProjectCompiler','Android 16 / POCO F7: source arbitration, authoring/save/undo/redo/cold reopen, all 200 recorded orbit/walk frames inspected','Physical Android gamepad and sustained performance not measured; public APK remains 0.2.1-preview.20261007 / baseline 09bd7349']});
fs.writeFileSync('data/generated-files.json',JSON.stringify(generated,null,2));
fs.writeFileSync('data/pages.json',JSON.stringify(manifest,null,2));
fs.writeFileSync('data/api-index.json',JSON.stringify(apiIndex,null,2));
const coverage={version,engineGeneration:'astra-current',language:'C#',pages:manifest.length,editorialPages:pages.length,componentTypes:components.length,componentProperties:components.reduce((n,c)=>n+c.properties.length,0),componentPropertiesWithUsage:components.reduce((n,c)=>n+c.properties.length,0),apiTypes:api.types.length,apiMembers:api.types.reduce((n,t)=>n+t.members.length,0),apiMembersWithAccessAndRoadmap:apiIndex.filter(m=>m.access).length,apiMembersRequiringIndividualReview:apiIndex.filter(m=>m.documentationStatus==='individual-review-pending').length,roadmapFamilies:roadmap.families.length,rendererCapabilities:roadmap.capabilities.length,runtimeVerified:false,platformEvidence:[]};
fs.writeFileSync('data/coverage.json',JSON.stringify(coverage,null,2));
console.log(JSON.stringify(coverage));
