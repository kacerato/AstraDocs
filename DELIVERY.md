# Entrega — 06/10/2026

Produção: https://astra-docs-opal.vercel.app

Deployment final: `dpl_2AxdQ2zN7u7vceGMph5L5sn9rGij`, Vercel `READY`.
Publicação direta no projeto `astra-docs`, sem conexão automática com o Git.

## Conteúdo publicado

- 475 páginas de conteúdo e uma página 404; 124 páginas editoriais.
- 49 componentes, 892 propriedades refletidas.
- 299 tipos e 3.095 membros públicos selecionados da API C#.
- Markdown por página, índices JSON, sitemap, llms.txt e llms-full.txt.
- Quatro exemplos C# baixáveis; hashes dos downloads conferidos em produção.

Os tipos e membros foram extraídos semanticamente do projeto atual com Roslyn.
Os descritores nativos foram extraídos dos contratos reais. Isso não comprova
comportamento da engine: há membros sem explicação editorial aprofundada e
recursos/coleções fora da cobertura de propriedades refletidas. Os jogos
históricos têm páginas de curadoria e não são anunciados como downloads auditados.

## Verificação realizada

Build local e build da Vercel concluídos: 476 HTML e índice Pagefind.
Validador local: 475 páginas, 76.022 links, zero erros de alvo/âncora.
Navegador Chrome em produção, 360, 390, 768 e 1440 px: início, guia, API,
catálogo e componente HTTP 200, sem overflow horizontal da página.
Busca Rotate: 19 resultados; filtro Câmera: três itens; limpeza: 49 itens.
Estado vazio, menu mobile, clipboard, persistência do tema e leitura sem
JavaScript confirmados. Capturas e relatório em `evidence/`, ignorado pelo Git.

Após corrigir os redirects para URLs com barra final, a revisão HTTP de produção
confirmou o atalho `/pt-br/atual/`, página 404, Markdown, JSON, sitemap, arquivos
para IA e hashes dos quatro downloads. O conteúdo da interface não mudou entre
o deploy da revisão visual e o deploy da correção dos redirects.

Os quatro exemplos passaram por compilação semântica contra o projeto real.
Não foram executados; não houve testes da engine, build Android, instalação
nem aceitação física no dispositivo nesta entrega.

## Manutenção

Pedidos futuros de atualização das docs devem atualizar `portal/` e publicar
no mesmo projeto Vercel, conforme `AGENTS.md` e `README.md`. O portal está salvo
no workspace; nenhum commit ou push dos trabalhos paralelos da engine foi feito.
