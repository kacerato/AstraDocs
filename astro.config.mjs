import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = 'pt-br/snapshot-2026-10-06';
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
    sidebar: [
      { label: 'Início', link: '/' },
      { label: 'Baixar Astra', link: '/download/' },
      { label: 'Atualizações', link: '/atualizacoes/' },
      { label: 'Posse de controle · U07', link: '/pt-br/snapshot-2026-10-07/sistemas/posse-de-controle/' },
      { label: 'Animator universal · Dev', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-universal/' },
      { label: 'Controllers e overrides · Dev', link: '/pt-br/snapshot-2026-10-07/sistemas/animator-controllers/' },
      section('Comece aqui', 'comece'),
      section('Manual do editor', 'editor'),
      section('Conceitos', 'conceitos'),
      { label: 'Componentes · APK 0.2.3', link: '/pt-br/snapshot-2026-10-07/componentes/' },
      { label: 'Novas fichas e mudanças', link: '/pt-br/snapshot-2026-10-07/componentes/novidades/' },
      section('UI de jogo e HUD', 'ui'),
      { label: 'Referência C#', items: [
        { label: 'Todos os tipos · APK 0.2.3', link: '/pt-br/snapshot-2026-10-07/api/' },
        ...['Behavior','GameObject','Component','WorldStatus','TimeAccess','InputAccess','SaveStore','ScenesAccess'].map(name => ({label:name,link:`/pt-br/snapshot-2026-10-07/api/astra-${name.toLowerCase()}/`}))
      ] },
      section('Sistemas', 'sistemas'),
      section('Receitas', 'receitas'),
      section('Exemplos', 'exemplos'),
      section('Desempenho', 'desempenho'),
      section('Diagnóstico', 'diagnostico'),
      section('Versões', 'versoes'),
      section('Roadmap por função', 'roadmap'),
      section('Para IA', 'ia'),
      { label: 'Arquivo · 06/10', collapsed: true, items: [
        { label: 'Componentes históricos', link: `/${base}/componentes/` },
        { label: 'API histórica', link: `/${base}/api/` },
      ] },
    ],
    expressiveCode: { themes: ['github-dark', 'github-light'], styleOverrides: { borderRadius: '0.65rem', codeFontFamily: '"Cascadia Code", Consolas, monospace', codeFontSize: '0.875rem' } },
  })],
});
