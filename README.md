# Astra Docs

Documentação da Astra, com Astro, Starlight e busca Pagefind.

- Site: https://astraengine.com.br

- Repositório: https://github.com/kacerato/AstraDocs
- Vercel: projeto `astra-docs`, equipe `lucas-df5f8b19`.
- Produção: branch `main`, publicada automaticamente pela integração Git da Vercel.
- Conteúdo inicial: PT-BR, snapshot de 06/10/2026 da geração atual C#.

## Registro obrigatório de atualizações

Toda novidade, correção, mudança de comportamento e ampliação editorial deve ter
um item novo em `data/updates.json`, fonte comum da aba `/atualizacoes/`, do
changelog antigo, do Markdown e de `/updates/feed.json`. A aba existe apenas no site.
Informe App/Docs, data, versão, disponibilidade, impacto, uso, validação e migração.
Não marque uma revisão local como disponível no APK publicado. Preserve o histórico;
correções de uma nota publicada entram como uma nota nova.

Depois de editar o conteúdo e adicionar a nota, execute
`npm run updates:record -- --entry <id-novo>` e `npm run build`.
O build recusa conteúdo, exemplos, assets e configuração alterados sem cobertura.
Um novo APK exige uma nota App com disponibilidade `distributed`, tipo `release`,
`releaseVersion`, `versionCode` e data iguais aos de `data/release.json`.
Ao trocar o pacote na página Download, use `scopes: ["app", "docs"]` na nota
para registrar também a mudança do portal, ou acrescente uma nota Docs separada.
Confira links/fluxo, faça commit/push
na main e confirme o deploy. Mudanças da engine também precisam ser registradas
nessa página antes de anunciar ou distribuir a revisão; o site não modifica o APK.

## Catálogo de componentes por distribuição

O catálogo principal agora é `snapshot-2026-10-07`, extraído do APK 0.2.3
(commit af1d9981). O snapshot de 06/10 permanece intacto em seus contratos, rotas,
JSON e assinaturas. Guias gerais e UI ainda usam as rotas de 06/10; as fichas
de 07/10 ligam explicitamente a esses guias e à API de 07/10.

Para extrair a referência da fonte exata do manifesto:

```powershell
npm run sync:snapshot -- C:/caminho/checkout-git-da-engine snapshot-2026-10-07
```

O comando usa o commit de `data/release.json`, cria uma cópia privada isolada
em `evidence/` (ignorado), compila o extrator nativo e faz a compilação semântica
Roslyn. Exige Git, tar, g++ e .NET. Publica somente contratos sanitizados em
`data/snapshots/<versão>/`: campos, recursos, métodos, eventos, API e mapa das
fachadas. Não publica arquivos privados nem executa testes da engine.

`source.json` registra APK, commit, contagens e hashes. O build recusa catálogo
que não corresponda ao APK do manifesto, identidades duplicadas, fachada ausente
e componente novo sem orientação especializada. Uma release posterior requer
novo recorte e rotas, mantendo os anteriores: não sobrescreva um snapshot
publicado com outra versão. Atualize os registros de versão do gerador, catálogo
e navegação, acrescente orientação individual e registre a nota em Atualizações.
As instruções de uso atuais ficam em `data/current-component-guides.mjs`.

Antes de publicar: `updates:record`, `build`, `check:links`, revisão visual
das fichas/busca em desktop e celular, commit/push e Vercel READY. HTML, Markdown
e JSON saem do mesmo contrato. Coleções especializadas (como grafo Animator)
não entram na contagem dos campos numéricos e são explicadas nas fichas.
