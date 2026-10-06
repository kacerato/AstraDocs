# Astra Docs — manutenção

Este repositório é a fonte de verdade do portal de documentação Astra.

- GitHub: https://github.com/kacerato/AstraDocs
- Domínio principal: https://astraengine.com.br
- Vercel: projeto `astra-docs`, ID `prj_I4UU3minA10YutRfDzpIcz4aWcWa`, equipe `lucas-df5f8b19`.
- Branch de produção: `main`. Push nessa branch publica pela integração Git da Vercel.

Edite guias em `data/editorial.mjs`. Contratos extraídos ficam em `data/api.json`
e `data/components.json`; os extratores usam um checkout separado da engine.
Não copie fontes privadas da engine, credenciais, caches ou evidências internas.
Não edite páginas geradas: `npm run build` regenera HTML, Markdown, busca e JSON.
Verifique o build e os links após alterar conteúdo/rotas. Para ajustes visuais,
revise os tamanhos afetados e preserve a identidade fornecida em `DESIGN.md`.

Pedidos para atualizar docs incluem atualizar este repositório e sua publicação.
Confirme o commit remoto, o estado READY da Vercel e o domínio antes de afirmar
que uma atualização está publicada. Não faça force push ou substitua histórico.

A página `/download/` usa `data/release.json`, também exportado em
`/releases/latest.json`. Publique o APK assinado, checksum e manifesto nos
assets de uma Release pública antes de apontar a página para uma nova versão.
Nunca coloque APK, fontes privados, keystore ou senhas no Git deste portal.
Mantenha tags de release e versionCodes únicos, preserve a assinatura de
distribuição e declare separadamente build, assinatura e execução em aparelho.

Mantenha separados: contrato de código, explicação editorial, exemplo compilado
e comportamento validado na engine/dispositivo. Não apresente planos de Astra 2
ou referências de outras engines como recursos comprovados da Astra atual.
