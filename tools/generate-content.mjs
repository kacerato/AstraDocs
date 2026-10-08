import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { pages } from '../data/editorial.mjs';
import { projectStatusMarkdown } from '../data/project.mjs';
import { componentGuide as archivedComponentGuide, propertyUsage as archivedPropertyUsage, componentFamilies } from '../data/component-guides.mjs';
import { apiContext, memberGuide } from '../data/api-guides.mjs';
import { roadmapPages } from '../data/roadmap-guides.mjs';
import { updates, requireCoverage, markdown as updatesMarkdown } from './updates.mjs';
import { currentComponentGuide, currentPropertyUsage } from '../data/current-component-guides.mjs';
import { validateSnapshot } from './check-snapshot.mjs';
import { motorControlGuide } from '../data/motor-control-guide.mjs';
import { animatorWorkspaceGuide } from '../data/animator-workspace-guide.mjs';
import { animatorControllerGuide } from '../data/animator-controller-guide.mjs';
import { animatorAdditiveGuide } from '../data/animator-additive-guide.mjs';
import { animatorHierarchyGuide } from '../data/animator-hierarchy-guide.mjs';
const root = path.resolve('src/content/docs');
let version = 'snapshot-2026-10-06';
const legacyVersion = version;
const currentVersion = 'snapshot-2026-10-07';
const isCurrent = () => version === currentVersion;
const componentGuide = c => isCurrent() ? currentComponentGuide(c) : archivedComponentGuide(c);
const propertyUsage = (c,p) => isCurrent() ? currentPropertyUsage(c,p) : archivedPropertyUsage(c,p);
let base = `pt-br/${version}`;
const readJson = p => JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
// Deployment uploads compressed public contracts, never engine source.
for(const name of ['api','components'])if(!fs.existsSync(`data/${name}.json`)&&fs.existsSync(`data/${name}.json.gz`))fs.writeFileSync(`data/${name}.json`,zlib.gunzipSync(fs.readFileSync(`data/${name}.json.gz`)));
let api = readJson('data/api.json');
requireCoverage();
let components = readJson('data/components.json');
const release = readJson('data/release.json');
const roadmap = readJson('data/roadmap.json');
let componentMemberMap = readJson('data/component-member-map.json');
const archived = {api,components,componentMemberMap};
const currentSource = validateSnapshot();
const snapshots = [legacyVersion,currentVersion];
const referenceIndexes = {};
const guideBase = `pt-br/${legacyVersion}`;
const slug = s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const cell = s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = s=>String(s??'').replace(/<(?!\/?(?:br|code)\b)/g,'&lt;');
const quote = JSON.stringify;
const apiPath = t=>`/${base}/api/${slug(t.fullName)}/`;
const componentPath = t=>`/${base}/componentes/${slug(t.typeId)}/`;
const manifest=[];
const generated=[];
const guideLinks = body => isCurrent() ? body.replaceAll(`/${base}/roadmap/`,`/${guideBase}/roadmap/`).replaceAll(`/${base}/ui/`,`/${guideBase}/ui/`).replaceAll(`/${base}/editor/`,`/${guideBase}/editor/`).replaceAll(`/${base}/conceitos/`,`/${guideBase}/conceitos/`) : body;
function write(route,title,description,body,options={}) {
  const file=path.join(root,`${route}.${options.mdx?'mdx':'md'}`);
  const front={title,description,version,kind:options.kind||'guide',status:options.status||'source-reviewed',reviewedAt:version.slice(9),runtimeVerified:false,editUrl:false,...(isCurrent()?{appRelease:currentSource.releaseVersion}: {}),...options.front};
  body=guideLinks(body);
  const source=`---\n${Object.entries(front).map(([k,v])=>`${k}: ${quote(v)}`).join('\n')}\n---\n\n${body}\n`;
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);
  generated.push(path.relative(root,file).replaceAll('\\','/'));
  const id=route.replace(/\/index$/,'');
  manifest.push({id,title,description,version:front.version,kind:front.kind,status:front.status,reviewedAt:front.reviewedAt,runtimeVerified:front.runtimeVerified,...(front.appRelease?{appRelease:front.appRelease}:{}),platformEvidence:options.platformEvidence||[],url:route==='index'?'/':`/${id}/`,markdown:`/markdown/${id}.md`,body:guideLinks(options.markdown||body)});
}
// Delete only files recorded by the previous generation, never authored content.
const previous=fs.existsSync('data/generated-files.json')?readJson('data/generated-files.json'):[];
for(const file of previous) { const full=path.resolve(root,file);if(!full.startsWith(root+path.sep))throw Error('Invalid generated path'); if(fs.existsSync(full))fs.unlinkSync(full); }
write('index','Você joga. Agora, você cria.','Documentação da Astra. Comece a criar, explore os componentes e consulte a API C#.',`import Home from '../../components/Home.astro';\n\n<Home />`,{mdx:true,kind:'index',status:'editorial',front:{template:'splash',title:'Astra Docs',tableOfContents:false},markdown:`# Astra Docs\n\n${projectStatusMarkdown}\n\nVocê joga. Agora, você cria.\n\n- [Baixar Astra](/download/)\n- [Atualizações](/atualizacoes/)\n- [Comece do zero](/${base}/comece/indice/)\n- [Componentes do APK 0.2.3](/pt-br/${currentVersion}/componentes/)\n- [API C# do APK 0.2.3](/pt-br/${currentVersion}/api/)\n- [Exemplos](/${base}/exemplos/como-executar-exemplos/)`});
write('download','Baixar Astra para Android','Baixe a prévia pública da Astra para Android. APK assinado, requisitos, instruções de instalação e verificação de integridade.',`import Download from '../../components/Download.astro';\n\n<Download />`,{mdx:true,kind:'release',status:'editorial',front:{template:'splash',tableOfContents:false},markdown:`${projectStatusMarkdown}\n\n## Astra ${release.version}\n\nPrévia pública de ${release.dateLabel}. Android 8.0+, ARM64, GPU com Vulkan 1.1. APK de ${release.sizeLabel}.\n\n[Baixar APK](${release.downloadUrl}) · [Notas da versão](${release.releaseUrl})\n\nSHA-256: \`${release.sha256}\`\n\nBaixe e abra o APK, autorize a instalação pelo navegador quando solicitado e abra a Astra. Preserve projetos antes de atualizar: instalações com outra assinatura exigem reinstalação. A compilação e a assinatura foram verificadas; no POCO F7/Android 16 esta versão atualizou a Astra anterior sem apagar projetos e executou o aceite da câmera virtual; mixer de áudio e Animator foram aceitos na instalação de desenvolvimento com a mesma biblioteca nativa. Isso não garante todas as cenas/aparelhos. [O que mudou na 0.2.3](/${base}/versoes/preview-0-2-3/). Dispositivos com páginas de memória de 16 KB não são suportados nesta distribuição.\n\n[Primeiro projeto](/${base}/comece/primeiro-projeto/)\n\n[Manifesto](/releases/latest.json)`});
write('atualizacoes','Atualizações','Tudo que entrou no aplicativo e nas docs, com versão, disponibilidade, uso e migração.',`import Updates from '../../components/Updates.astro';\n\n<Updates />`,{mdx:true,kind:'release',status:'editorial',front:{reviewedAt:updates.updatedAt,tableOfContents:false,prev:false,next:false},markdown:updatesMarkdown()});
for(const [order,page] of pages.entries())write(`${base}/${page.route}`,page.route==='versoes/changelog'?'Histórico de atualizações':page.title,page.route==='versoes/changelog'?'Novidades do app e das docs, com versão e disponibilidade.':page.description,page.route==='versoes/changelog'?updatesMarkdown():page.body.replaceAll('$BASE',`/${base}`),{...page.options,front:{sidebar:{order},...page.options?.front,...(page.route==='versoes/changelog'?{reviewedAt:updates.updatedAt}:{})}});
for(const page of roadmapPages(components,roadmap))write(`${base}/${page.route}`,page.title,page.description,page.body.replaceAll('$BASE',`/${base}`),{kind:'roadmap',status:'source-reviewed',front:{tableOfContents:{maxHeadingLevel:2}}});

for (const snapshot of snapshots) {
  version=snapshot; base=`pt-br/${version}`;
  const dataDir=isCurrent()?`data/snapshots/${version}`:'data';
  api=isCurrent()?readJson(`${dataDir}/api.json`):archived.api;
  components=isCurrent()?readJson(`${dataDir}/components.json`):archived.components;
  componentMemberMap=isCurrent()?readJson(`${dataDir}/component-member-map.json`):archived.componentMemberMap;
const apiIndex=[];
for(const type of api.types) {
  const context=apiContext(type,components);
  if(isCurrent() && context.component?.typeId === 'astra.animation.animator') context.family='animation';
  if(isCurrent() && type.ns==='Astra' && /^Animator/.test(type.name)) {
    context.family='animation';
    context.access='Cena → raiz do modelo → Animator → Abrir grafo. No Behavior desse objeto, **Object.Animator()** fornece AnimatorController para parâmetros/estados. AnimatorStateInfo é a leitura retornada por GetCurrentState; construir o record não muda a animação. [Ficha do Animator](/'+base+'/componentes/astra-animation-animator/).';
  }
  if(isCurrent() && type.ns==='Astra' && /^Motor(Control|Motion)/.test(type.name)) {
    context.family='physics';
    context.access='Cena → objeto com Personagem ou Motor dinâmico → Posse de controle. No Behavior, **Object.MotorControl()** fornece o acesso da instância existente; State/MotionState são leituras do passo consumido, não outro motor. [Uso, arbitragem e diagnóstico](/pt-br/snapshot-2026-10-07/sistemas/posse-de-controle/).';
  }
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
    const guidance=memberGuide(type,m,context,componentMemberMap,propertyUsage);
    lines.push(`<h3 id="${id}" class="astra-member">${cell(m.name)}</h3>`,`\`\`\`csharp\n${m.signature}${m.constant!==null?` = ${m.constant}`:''}\n\`\`\``);
    if(m.docs.summary)lines.push(text(m.docs.summary));
    if(m.docs.remarks)lines.push(text(m.docs.remarks));
    lines.push(`**Caminho:** ${guidance.path}`,`**Uso:** ${text(guidance.usage)}`,`**Roadmap deste membro:** [${componentFamilies[context.family].title}](/${base}/${guidance.roadmapRoute}/). Contrato existente neste snapshot; sem tarefa individual/datada registrada nesta referência.`);
    if(m.parameters?.length)lines.push('| Parâmetro | Tipo | Contrato |\n|---|---|---|\n'+m.parameters.map(p=>`| \`${cell(p.name)}\` | \`${cell(p.type)}\` | ${cell(m.docs.parameters.find(d=>d.name===p.name)?.description||'')}${p.optional?` · Opcional: \`${cell(p.defaultValue??'null')}\``:''}${p.modifier!=='None'?` · ${p.modifier}`:''} |`).join('\n'));
    if(m.docs.returns)lines.push(`**Retorno:** ${text(m.docs.returns)}`);
    if(m.docs.exceptions?.length)lines.push('**Exceções documentadas:**\n\n'+m.docs.exceptions.map(e=>`- \`${e.type}\`: ${text(e.description)}`).join('\n'));
    apiIndex.push({uid:m.uid,signature:m.signature,kind:m.kind,version,engineGeneration:'astra-current',language:'C#',url:apiPath(type)+`#${id}`,summary:m.docs.summary,access:guidance.path,usage:guideLinks(guidance.usage),roadmap:`/${isCurrent()?guideBase:base}/${guidance.roadmapRoute}/`,documentationStatus:guidance.editorialReviewed?'source-reviewed-usage':'individual-review-pending',runtimeVerified:false,platformEvidence:[]});
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
    guidance.extra, guidance.related?`**Guia relacionado:** ${guidance.related}`:'', '## Exemplo de uso',guidance.example,
    c.typeId==='astra.ui.canvas'?`[HUD de corações completo](/${base}/ui/hud-coracoes/) · [Image e seus campos](/${base}/ui/image/) · [Onde fica a UI](/${base}/ui/comece-aqui/)`:'',
    '## Dependências',ruleList(c.requirements),'## Conflitos',ruleList(c.conflicts),
    '## Edição e ciclo de vida',`| Operação | Contrato |\n|---|---|\n| Adicionar/remover em Play | ${c.structuralInPlay} |\n| Alterar propriedades em Play | ${c.propertiesInPlay} |\n| Múltiplas instâncias | ${c.allowMultiple?'Sim':'Não'} |\n| Versão do payload | ${c.schemaVersion} |`,
    'Alterações em ponto seguro são aplicadas entre passos da simulação. Um componente exigido por outro não pode ser removido enquanto a dependência existir. Salvar a cena autoral e modificar o mundo de Play são operações distintas; veja [Play e cena autoral](/'+base+'/conceitos/play-e-cena-autoral/).',
    '## Propriedades',
    c.properties.length?'Valores abaixo são resolvidos pelo descritor de um componente recém-criado. Campos por slot dependem dos recursos atribuídos. Um campo sem padrão significa que o descritor não fornece um valor independente de contexto.':'O componente não expõe propriedades numéricas, booleanas, enumerações ou referências de objeto neste extrator. Recursos e operações especializadas devem ser consultados na API.'];
  const groups=[...new Set(c.properties.map(p=>p.group||'Geral'))];
  if(isCurrent() && c.resources?.length) lines.push('### Recursos do projeto','Estes seletores ficam no componente e não entram na contagem dos campos numéricos. Use recursos registrados do projeto; nome ou caminho externo não substitui uma referência válida.','| Recurso | Onde | Tipo | Uso |\n|---|---|---|---|\n'+c.resources.map(r=>`| **${cell(r.name)}** · \`${r.id}\` | Inspector → ${cell(c.name)} → ${cell(r.group||'Recursos')} | ${cell(r.kind)} | ${cell(r.help)||'Escolha um recurso compatível no seletor.'}${r.inheritable?' Pode herdar da fonte; herdar e limpar são estados diferentes.':''} |`).join('\n'));
  for(const group of groups){lines.push(`### ${group}`,'| Propriedade | Tipo / unidade | Padrão | Domínio |\n|---|---|---|---|\n'+c.properties.filter(p=>(p.group||'Geral')===group).map(p=>`| [**${cell(p.name)}**](#field-${slug(p.id)})<br/>\`${p.id}\` | ${cell(p.kind)}${p.unit?` · ${cell(p.unit)}`:''}${p.perSlot?'<br/>Por slot':''} | ${cell(p.default)||'Depende do contexto'} | ${cell(p.domain)} |`).join('\n'));
    for(const p of c.properties.filter(p=>(p.group||'Geral')===group))lines.push(`<h4 id="field-${slug(p.id)}">${cell(p.name)} · <code>${p.id}</code></h4>`,`**Onde:** Inspector → **${c.name}** → **${group}** → **${p.name}**${p.perSlot?' → escolha o slot/recurso':''}.`,`**Uso e efeito:** ${text(propertyUsage(c,p))}`,`**Valor:** ${cell(p.default)||'dependente do contexto'} · **Tipo:** ${p.kind}${p.unit?` · **Unidade:** ${p.unit}`:''} · **Domínio:** ${cell(p.domain)}.`,`${p.conditional?'Campo condicional: o modo/forma/recurso selecionado controla a disponibilidade. ':''}${p.restrictedWrite?'Escrita condicionada pelo descritor; trate recusa e verifique autoridade/runtime. ':''}${p.tweenable?'Aceita tween numérico via contrato de propriedade. ':''}${text(p.limitation)}${p.capability?` Capacidade necessária: \`${p.capability}\`; veja [estado do renderer](/${base}/roadmap/capacidades-do-renderer/).`:''}`.trim());
  }
  lines.push('## Roadmap deste componente',`[${guidance.title}](/${base}/${guidance.route}/). ${guidance.next}`, 'Os campos acima pertencem ao contrato existente; novas funções dependem do fechamento da família. Não há datas individuais prometidas para cada propriedade.', '## Conferir na sua cena',`1. Crie **${c.name}** pelo fluxo indicado e resolva as dependências.\n2. Altere uma propriedade por vez e observe o efeito esperado na cena.\n3. Salve, reabra e confira os valores autorais.\n4. Entre em Play e verifique o comportamento com os recursos reais do projeto.\n5. Pare o Play e confira a cena autoral.\n\nEste é um roteiro de conferência; não representa um teste executado nesta publicação.`,
    '## Limitações da referência','A tabela cobre os tipos de propriedade disponíveis no descritor de reflexão. Não presume persistência de campos transitórios, equivalência com outras engines ou suporte em todos os aparelhos. Recursos, coleções e operações podem exigir APIs específicas.',
    c.reference?`**Referência de arquitetura registrada pela engine:** [documentação oficial](${c.reference}). Essa referência não representa paridade funcional.`:'');
  if(isCurrent()) {
    const params=ps=>ps.length?ps.map(p=>`${p.name}: ${p.kind}${p.unit?' ('+p.unit+')':''}`).join('; '):'Nenhum';
    if(c.methods?.length) lines.push('## Comandos e leituras em Play','Os IDs abaixo são operações nativas do componente existente. Não são novos botões de autoria. Use a fachada C# correspondente para nomes e assinaturas; Conexão de evento oferece as ações compatíveis no seletor. Confira o componente e o mundo vivos antes de chamar.','| Operação / ID | Uso e efeito | Argumentos | Retorno |\n|---|---|---|---|\n'+c.methods.map(m=>`| **${cell(m.name)}** · \`${m.id}\` | ${cell(m.help)} | ${cell(params(m.parameters))} | ${cell(m.result)} |`).join('\n'),type?`[Assinaturas da fachada ${type.name}](${apiPath(type)}#membros)`:'');
    if(c.events?.length) lines.push('## Eventos do componente','No Behavior, a fachada permite inscrever um receptor usando o owner vivo; a inscrição pertence ao lifecycle daquela execução. Uma Conexão de evento precisa de emissor, evento, receptor e ação: adicionar a conexão não define a regra do jogo.','| Evento / ID | Quando ocorre | Dados enviados |\n|---|---|---|\n'+c.events.map(e=>`| **${cell(e.name)}** · \`${e.id}\` | ${cell(e.help)} | ${cell(params(e.payload))} |`).join('\n'));
  }
  write(`${base}/componentes/${slug(c.typeId)}`,c.name,c.description,lines.join('\n\n'),{kind:'component',front:{pagination:false,tableOfContents:{maxHeadingLevel:2}}});
}
for(const kind of ['component','api']) {
  const isApi=kind==='api';const title=isApi?'Referência C#':'Componentes';const route=`${base}/${isApi?'api':'componentes'}/index`;
  const records=isApi?api.types:components;
  write(route,title,isApi?'Encontre tipos, propriedades e métodos da API C# deste snapshot.':'Encontre o componente, entenda suas propriedades e componha sua cena.',`import Catalog from '../../../../../components/Catalog.astro';\n\n${isApi?`${api.types.length} tipos e ${api.types.reduce((n,t)=>n+t.members.length,0)} membros extraídos com Roslyn/MSBuild.`:`${components.length} registros e ${components.reduce((n,c)=>n+c.properties.length,0)} campos de componentes, com uso e caminho; mais 13 elementos de UI documentados separadamente.`}\n\n[Mapa de acesso](/${base}/editor/mapa-de-acesso/) · [Image / UiImage](/${base}/ui/image/) · [HUD de corações funcional](/${base}/ui/hud-coracoes/)\n\n${isCurrent()?`Recorte do APK **${currentSource.releaseVersion}**, commit **${currentSource.sourceCommit.slice(0,8)}**. [Novos componentes e mudanças](/${base}/componentes/novidades/) · [Histórico de 06/10](/${guideBase}/componentes/)`:`[Catálogo do APK 0.2.3](/pt-br/${currentVersion}/componentes/). Este recorte de 06/10 é histórico.`}\n\nOs registros abaixo são contratos de fonte. A validação funcional por plataforma permanece separada.\n\n<Catalog kind="${kind}" snapshot="${version}" />`,{kind:'index',mdx:true,front:{tableOfContents:false,pagination:false},markdown:`# ${title}\n\nContratos de fonte; execução por plataforma não validada nesta publicação.\n\n[UI de jogo](/${base}/ui/elementos/) · [Image](/${base}/ui/image/) · [HUD de corações](/${base}/ui/hud-coracoes/)\n\n`+records.map(t=>`- [${isApi?t.fullName:t.name}](${isApi?apiPath(t):componentPath(t)})`).join('\n')});
}
if(isCurrent()) {
  const added=components.filter(c=>!archived.components.some(o=>o.typeId===c.typeId));
  const changed=components.filter(c=>{const old=archived.components.find(o=>o.typeId===c.typeId);const {methods,events,resources,...contract}=c;return old && JSON.stringify(contract)!==JSON.stringify(old);});
  const list=records=>records.map(c=>`| [${c.name}](${componentPath(c)}) | ${c.family} | ${c.properties.length} |`).join('\n');
  const body=`O catálogo de **07/10** acompanha o APK **${currentSource.releaseVersion}**, versionCode ${currentSource.versionCode}, commit **${currentSource.sourceCommit.slice(0,8)}**. São ${components.length} contratos e ${components.reduce((n,c)=>n+c.properties.length,0)} campos; essa contagem não mede conclusão da engine.\n\n[Buscar componentes](/${base}/componentes/) · [API desta versão](/${base}/api/) · [Baixar APK](/download/) · [Histórico de 06/10](/${guideBase}/componentes/)\n\n## ${added.length} componentes que ganharam ficha\n\nCada ficha reúne caminho no editor, receita, campos, dependências, API e limites. Recursos/coleções especializados são explicados junto do componente, fora da tabela numérica.\n\n| Componente | Família | Campos |\n|---|---|---|\n${list(added)}\n\n## Componentes existentes revisados\n\nO schema completo destes componentes mudou desde 06/10: campos, payload, regras ou metadados. Consulte as fichas atuais em vez de usar padrões históricos.\n\n| Componente | Família | Campos |\n|---|---|---|\n${list(changed)}\n\n## Evidência e lacunas\n\nContratos nativos compilados e API C# extraída semanticamente sem erros. A extração deste catálogo não executou Play nem testes no aparelho. As evidências do APK estão nas [notas 0.2.3](/${guideBase}/versoes/preview-0-2-3/#evidências-e-limites). Membros da API sem explicação especializada continuam identificados como revisão individual pendente. O aviso nativo herdado sobre mistura de clipes é explicado na ficha do Animator.\n\n## Compatibilidade\n\nGuarde cópia do projeto antes de atualizar. Os novos payloads podem exigir esta versão; downgrade não converte a cena automaticamente. Guias gerais e UI continuam no recorte de 06/10 e são identificados pelo endereço. Suas ligações para contratos antigos preservam a referência histórica. As fichas de 07/10 usam a API de 07/10.\n\n## Dados para ferramentas\n\n[Componentes e campos JSON](/${version}/component-index.json) · [API JSON](/${version}/api-index.json) · [Cobertura](/${version}/coverage.json) · [Origem da extração](/${version}/source.json).`;
  write(`${base}/componentes/novidades`,'O que entrou no catálogo de 07/10','Fichas dos componentes novos e mudanças de contratos no APK 0.2.3.',body,{kind:'guide'});
}
const coverage={version,engineGeneration:'astra-current',language:'C#',pages:manifest.filter(p=>p.version===version).length,editorialPages:isCurrent()?1:pages.length,componentTypes:components.length,componentProperties:components.reduce((n,c)=>n+c.properties.length,0),componentPropertiesWithUsage:components.reduce((n,c)=>n+c.properties.length,0),apiTypes:api.types.length,apiMembers:api.types.reduce((n,t)=>n+t.members.length,0),apiMembersWithAccessAndRoadmap:apiIndex.filter(m=>m.access).length,apiMembersRequiringIndividualReview:apiIndex.filter(m=>m.documentationStatus==='individual-review-pending').length,roadmapFamilies:roadmap.families.length,rendererCapabilities:roadmap.capabilities.length,runtimeVerified:false,platformEvidence:[]};
referenceIndexes[version]={apiIndex,coverage};
if(!isCurrent()){fs.writeFileSync('data/coverage.json',JSON.stringify(coverage,null,2));fs.writeFileSync('data/api-index.json',JSON.stringify(apiIndex,null,2));}
console.log(JSON.stringify(coverage));
}
version=legacyVersion; base=guideBase;
fs.writeFileSync('data/reference-indexes.json',JSON.stringify(referenceIndexes,null,2));
write(motorControlGuide.route,motorControlGuide.title,motorControlGuide.description,motorControlGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-07',runtimeVerified:true,appRelease:release.version},platformEvidence:['host: 12 targeted scenarios, 121 editor regressions in final retry, 7 ProjectStore scenarios, real ProjectCompiler','Android 16 / POCO F7: public APK update, user project preservation, save/cold reopen/Play; 527 motion/camera frames reviewed in validation with identical native library','Public APK 0.2.2-preview.20261007 / baseline 2e6ea408; physical Android gamepad, universal scene/device behavior and sustained performance not measured']});
write(animatorWorkspaceGuide.route,animatorWorkspaceGuide.title,animatorWorkspaceGuide.description,animatorWorkspaceGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-08',runtimeVerified:true,appRelease:'development'},platformEvidence:['Host: 9/9 focused Animator runtime/editor scenarios; SDK Release without errors or warnings','POCO F7 / Android 16: Dev 0.2.5 installed in place; separate physics source on non-skinned mechanism, manual live parameters, trigger, pinch, scrolling, undo/redo, save/cold reopen; 717 motion frames reviewed','Public 0.2.3 keeps prior workspace; root motion, retargeting, IK, arbitrary property tracks and sustained performance are not validated or completed by this review']});
write(animatorControllerGuide.route,animatorControllerGuide.title,animatorControllerGuide.description,animatorControllerGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-08',runtimeVerified:true,appRelease:'development'},platformEvidence:['Dev 0.2.6: POCO F7 Android 16, six runtime checks and authoring/cold reopen; host 11/11; 537 frames reviewed; public APK 0.2.3 unchanged']});
write(animatorAdditiveGuide.route,animatorAdditiveGuide.title,animatorAdditiveGuide.description,animatorAdditiveGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-08',runtimeVerified:true,appRelease:'development'},platformEvidence:['Development 0.2.7/code 15: 16 focused host scenarios, 8 C# device checks, authored values preserved after cold reopen, all 417 video frames reviewed. Skin/morph verified on host; Android fixture uses mechanisms without skin. Public APK 0.2.3 unchanged.']});
write(animatorHierarchyGuide.route,animatorHierarchyGuide.title,animatorHierarchyGuide.description,animatorHierarchyGuide.body,{front:{version:'snapshot-2026-10-07',reviewedAt:'2026-10-08',runtimeVerified:true,appRelease:'development'},platformEvidence:['Dev 0.2.8/code 16: 25 focused host scenarios, 15 C# device checks, touch authoring and cold reopen, all 598 frames reviewed in 20 sheets; skin/morph host evidence, physical mechanisms without skin. Public APK 0.2.3 unchanged.']});
fs.writeFileSync('data/generated-files.json',JSON.stringify(generated,null,2));
fs.writeFileSync('data/pages.json',JSON.stringify(manifest,null,2));
