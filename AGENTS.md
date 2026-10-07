# Astra Docs — manutenção

Este repositório é a fonte de verdade do portal de documentação Astra.

- GitHub: https://github.com/kacerato/AstraDocs
- Domínio principal: https://astraengine.com.br
- Vercel: projeto `astra-docs`, ID `prj_I4UU3minA10YutRfDzpIcz4aWcWa`, equipe `lucas-df5f8b19`.
- Branch de produção: `main`. Push nessa branch publica pela integração Git da Vercel.

Edite guias em `data/editorial.mjs`; Manual, Conceitos e Sistemas ficam em
`data/editor-guides.mjs`, `data/concept-guides.mjs` e `data/system-guides.mjs`.
Exemplos associados ficam em `data/workflow-examples.mjs`. Preserve caminhos
verificados no editor, casos concretos, campos com efeito e diagnóstico nas revisões.
Contratos extraídos ficam em `data/api.json`
e `data/components.json`; os extratores usam um checkout separado da engine.
Não copie fontes privadas da engine, credenciais, caches ou evidências internas.
Não edite páginas geradas: `npm run build` regenera HTML, Markdown, busca e JSON.
Verifique o build e os links após alterar conteúdo/rotas. Para ajustes visuais,
revise os tamanhos afetados e preserve a identidade fornecida em `DESIGN.md`.

Pedidos para atualizar docs incluem atualizar este repositório e sua publicação.
Confirme o commit remoto, o estado READY da Vercel e o domínio antes de afirmar
que uma atualização está publicada. Não faça force push ou substitua histórico.

Toda novidade, correção, mudança de comportamento, migração e ampliação editorial
do app ou das docs precisa de uma nota nova em `data/updates.json`, publicada em
`/atualizacoes/`. Informe origem App/Docs, data, versão, disponibilidade, uso,
validação, migração e links. Preserve notas publicadas; corrija com outra nota.
Após todas as edições, registre a cobertura com
`npm run updates:record -- --entry <id-novo>`. O build bloqueia mudanças nos guias,
componentes do portal, exemplos, assets e configuração sem cobertura atualizada.
Um APK exige também uma nota App/Publicação/APK publicado com `releaseVersion`,
`versionCode` e data iguais ao manifesto. Uma revisão local da engine deve ser
marcada como App em desenvolvimento até a distribuição efetiva. A aba é do site.

A página `/download/` usa `data/release.json`, também exportado em
`/releases/latest.json`. Publique o APK assinado, checksum e manifesto nos
assets de uma Release pública antes de apontar a página para uma nova versão.
Nunca coloque APK, fontes privados, keystore ou senhas no Git deste portal.
Mantenha tags de release e versionCodes únicos, preserve a assinatura de
distribuição e declare separadamente build, assinatura e execução em aparelho.

Mantenha separados: contrato de código, explicação editorial, exemplo compilado
e comportamento validado na engine/dispositivo. Não apresente planos de Astra 2
ou referências de outras engines como recursos comprovados da Astra atual.
