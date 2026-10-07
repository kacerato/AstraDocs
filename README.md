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
