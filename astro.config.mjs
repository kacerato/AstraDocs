import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { trails } from './data/trilhas/index.mjs';

const base = 'pt-br/snapshot-2026-10-06';
const current = 'snapshot-2026-10-28';
const page = (label, slug) => ({ label, link: `/${base}/${slug}/` });
// Páginas de revisões de desenvolvimento: ficam publicadas, recolhidas no Arquivo.
const development = [
  ['Autoria e biblioteca (10/10)', '2026-10-10/autoria-e-biblioteca'],
  ['Estúdio de animação (11/10)', '2026-10-11/estudio-de-animacao'],
  ['IK e constraints (11/10)', '2026-10-11/ik-e-constraints'],
  ['Efeitos de IK e interação (12/10)', '2026-10-12/ik-efeitos-e-interacao'],
  ['Root motion (12/10)', '2026-10-12/root-motion'],
  ['Locomoção e aparência (12/10)', '2026-10-12/locomocao-e-aparencia'],
  ['Bake e exportação (12/10)', '2026-10-12/bake-e-exportacao'],
  ['Modelos de cena e carregar (13/10)', '2026-10-13/modelos-de-cena-e-carregar'],
  ['UMotion e IK de plano rotativo (13/10)', '2026-10-13/umotion-ik-plano-rotativo-filho-de'],
  ['Terreno e voxel (14/10)', '2026-10-14/terreno-voxel'],
  ['Terreno editável (15/10)', '2026-10-15/terreno-voxel'],
  ['Terreno: caminhos (16/10)', '2026-10-16/terreno-caminhos'],
  ['Terreno: integração (19/10)', '2026-10-19/terreno-integracao'],
  ['Terreno: FX e poças (20/10)', '2026-10-20/terreno-fx-umidade-pocas'],
  ['Terreno: neve e busca (20/10)', '2026-10-20/terreno-neve-qualidade-busca'],
  ['Terreno: estratos (20/10)', '2026-10-20/terreno-estratos-mapas-globais'],
  ['Terreno: variação (20/10)', '2026-10-20/terreno-variacao-superficie'],
  ['Terreno: materiais PBR (20/10)', '2026-10-20/terreno-materiais-pbr'],
  ['Terreno: pintura na GPU (20/10)', '2026-10-20/terreno-pintura-gpu'],
  ['Terreno: mapas (20/10)', '2026-10-20/terreno-mapas-recuperacao'],
];
// Páginas novas de cada trilha (/guia/…), na ordem em que foram escritas.
const guide = dir => (trails.find(t => t.dir === dir)?.pages ?? []).map(p => ({ label: p.title, link: `/${p.route}/` }));
const section = (label, dir) => ({ label, collapsed: true, items: [{ autogenerate: { directory: `${base}/${dir}` } }] });
export default defineConfig({
  site: process.env.SITE_URL || 'https://astraengine.com.br',
  trailingSlash: 'always',
  integrations: [starlight({
    title: 'Astra Docs',
    description: 'Do primeiro objeto ao seu próximo universo. Documentação da Astra, componentes e referência C#.',
    defaultLocale: 'root',
    locales: { root: { label: 'Português', lang: 'pt-BR' } },
    favicon: '/assets/brand/favicon-32.png',
    credits: false,
    editLink: undefined,
    lastUpdated: false,
    customCss: ['./src/styles/astra.css'],
    components: {
      Header: './src/components/Header.astro',
      PageTitle: './src/components/PageTitle.astro',
      Footer: './src/components/Footer.astro',
    },
    head: [
      { tag: 'meta', attrs: { property: 'og:image', content: 'https://astra-docs-opal.vercel.app/assets/social/home-1200x630.png' } },
      { tag: 'meta', attrs: { name: 'theme-color', content: '#D7FF00' } },
      { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/assets/brand/favicon-192.png' } },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/assets/brand/favicon-180.png' } },
    ],
    // Menu por trilhas (26/10/2026). Os URLs antigos continuam publicados; aqui só muda a
    // organização. `current` aponta o catálogo e a API do APK público vigente.
    sidebar: [
      { label: 'Início', link: '/' },
      { label: 'Começar', collapsed: false, items: [
        ...guide('comecar'),
        { label: 'Curso CaixaGira, passo a passo', collapsed: true, items: [
        page('O que é a Astra', 'comece/visao-geral'),
        page('O que dá para criar', 'comece/o-que-posso-criar'),
        page('Antes de instalar', 'comece/requisitos-e-compatibilidade'),
        page('Instalar e primeiro contato', 'comece/instalacao'),
        page('Primeiro projeto', 'comece/primeiro-projeto'),
        page('Primeira cena', 'comece/primeira-cena'),
        page('Primeiro componente', 'comece/primeiro-componente'),
        page('Primeiro script C#', 'comece/primeiro-script-c'),
        page('Play e Stop', 'comece/play-e-stop'),
        page('Salvar e reabrir', 'comece/salvar-e-reabrir'),
        page('Próximos passos', 'comece/proximos-passos'),
        ] },
        { label: 'Ajuda', collapsed: true, items: [
          page('Ajuda por sintoma', 'comece/ajuda-por-sintoma'),
          page('Perguntas frequentes', 'comece/perguntas-frequentes'),
          page('Glossário', 'comece/glossario'),
        ] },
      ] },
      { label: 'Editor', collapsed: true, items: [
        ...guide('editor'),
        { label: 'Manual por tarefa', collapsed: true, items: [
        page('Onde fica cada coisa', 'editor/mapa-de-acesso'),
        page('Encontre pela tarefa', 'comece/conheca-o-editor'),
        page('Projetos e modelos', 'editor/projetos-e-modelos'),
        page('Viewport e navegação', 'editor/viewport-e-navegacao'),
        page('Seleção', 'editor/selecao-e-multisselecao'),
        page('Hierarquia', 'editor/hierarquia-e-parenting'),
        page('Gizmos e coordenadas', 'editor/gizmos-e-coordenadas'),
        page('Inspector', 'editor/inspector'),
        page('Campos do Inspector', 'comece/ler-o-inspector'),
        page('Adicionar componentes', 'editor/adicionar-componentes'),
        page('Dependências e conflitos', 'editor/dependencias-e-conflitos'),
        page('Materiais e texturas', 'editor/materiais-e-texturas'),
        page('Código e compilação', 'editor/codigo-e-compilacao'),
        page('Console', 'editor/console-e-diagnostico'),
        page('Desfazer e refazer', 'editor/undo-e-redo'),
        page('Busca', 'editor/busca-global'),
        page('Gestos', 'editor/atalhos-e-gestos'),
        page('Preferências', 'editor/preferencias'),
        ] },
        { label: 'Animação', collapsed: true, items: [
          { label: 'Animator: grafo e fontes', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-universal/' },
          { label: 'Controllers e overrides', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-controllers/' },
          { label: 'Composição aditiva', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-aditivo/' },
          { label: 'Grupos e interrupções', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-hierarquia/' },
          { label: 'Clipes, curvas e bake', link: '/pt-br/snapshot-2026-10-07/sistemas/animation-clips/' },
        ] },
      ] },
      { label: 'Criar um jogo', collapsed: true, items: [
        ...guide('criar'),
        page('Comece por um resultado', 'sistemas/indice'),
        { label: 'Controle do jogador (U07)', link: '/pt-br/snapshot-2026-10-07/sistemas/posse-de-controle/' },
        page('Personagem', 'sistemas/personagem'),
        page('Câmeras', 'sistemas/cameras'),
        page('Entrada e ações', 'sistemas/input-e-acoes'),
        page('Iluminação', 'sistemas/iluminacao'),
        page('Renderização', 'sistemas/renderizacao'),
        page('Física 3D', 'sistemas/fisica-3d'),
        page('Animação', 'sistemas/animacao'),
        page('Áudio', 'sistemas/audio'),
        { label: 'Guia completo de navegação', link: '/pt-br/snapshot-2026-10-09/sistemas/navegacao/' },
        section('UI de jogo e HUD', 'ui'),
        section('Mais sistemas', 'sistemas'),
      ] },
      { label: 'Importar', collapsed: true, items: [
        ...guide('importar'),
        page('Assets e importação', 'editor/assets-e-importacao'),
        page('Importação GLB', 'sistemas/importacao-glb'),
        page('Materiais', 'sistemas/materiais'),
      ] },
      { label: 'Componentes', collapsed: true, items: [
        ...guide('componentes'),
        { label: 'Catálogo do APK atual', link: `/pt-br/${current}/componentes/` },
        { label: 'Novidades desta versão', link: `/pt-br/${current}/componentes/novidades/` },
        section('Conceitos', 'conceitos'),
      ] },
      { label: 'Scripts C# e Flow', collapsed: true, items: [
        ...guide('scripts'),
        section('Receitas curtas', 'receitas'),
        { label: 'Referência C#', collapsed: true, items: [
          { label: 'Todos os tipos', link: `/pt-br/${current}/api/` },
          ...['Behavior','GameObject','Component','WorldStatus','TimeAccess','InputAccess','SaveStore','ScenesAccess'].map(name => ({label:name,link:`/pt-br/${current}/api/astra-${name.toLowerCase()}/`}))
        ] },
      ] },
      { label: 'Exemplos', collapsed: true, items: [
        ...guide('exemplos'),
        section('Roteiros de código de 06/10', 'exemplos'),
      ] },
      { label: 'Desempenho e qualidade', collapsed: true, items: [
        ...guide('desempenho'),
        section('Desempenho', 'desempenho'),
        section('Diagnóstico por sintoma', 'diagnostico'),
      ] },
      { label: 'Download e versões', collapsed: true, items: [
        { label: 'Baixar Astra', link: '/download/' },
        { label: 'Atualizações', link: '/atualizacoes/' },
        ...guide('download'),
        section('Notas de cada versão', 'versoes'),
        section('Roadmap por função', 'roadmap'),
        { label: 'Arquivo', collapsed: true, items: [
          { label: 'Componentes de 16/10 (0.3.2)', link: '/pt-br/snapshot-2026-10-16b/componentes/' },
          { label: 'Componentes de 09/10 (0.3.0)', link: '/pt-br/snapshot-2026-10-09/componentes/' },
          { label: 'Componentes de 07/10 (0.2.3)', link: '/pt-br/snapshot-2026-10-07/componentes/' },
          { label: 'Componentes de 06/10', link: `/${base}/componentes/` },
          { label: 'Histórico de desenvolvimento', collapsed: true, items: development.map(([label, route]) => ({ label, link: `/pt-br/desenvolvimento/${route}/` })) },
        ] },
      ] },
      section('Para IA', 'ia'),
    ],
    expressiveCode: { themes: ['github-dark', 'github-light'], styleOverrides: { borderRadius: '0.65rem', codeFontFamily: '"Cascadia Code", Consolas, monospace', codeFontSize: '0.875rem' } },
  })],
});
