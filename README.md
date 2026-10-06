# Astra Docs

Documentação da Astra, com Astro, Starlight e busca Pagefind.

- Site: https://astraengine.com.br
- Endereço alternativo: https://astra-docs-opal.vercel.app
- Repositório: https://github.com/kacerato/AstraDocs
- Vercel: projeto `astra-docs`, equipe `lucas-df5f8b19`.
- Produção: branch `main`, publicada automaticamente pela integração Git da Vercel.
- Conteúdo inicial: PT-BR, snapshot de 06/10/2026 da geração atual C#.

## Desenvolvimento

Use Node.js 24 (mesma versão configurada na Vercel):

```sh
npm ci
npm run dev
```

Para gerar e revisar o site:

```sh
npm run build
npm run check:links
npm run preview
```

O build funciona sem o repositório privado da engine. Ele usa os contratos JSON
versionados, os guias e os assets deste repositório. Não exige token ou segredo.

## Atualizar a documentação

1. Edite os guias em `data/editorial.mjs` e os componentes visuais em `src/`.
2. Atualize os contratos JSON quando a API ou os schemas da engine mudarem.
3. Gere o site e confira conteúdo, links e as telas afetadas.
4. Faça commit e push. `main` publica produção; outras branches geram previews.
5. Confira o commit associado e o estado READY da Vercel, além da página pública.

Pedidos para atualizar docs devem atualizar este repositório e a publicação.
Não edite páginas geradas: HTML, Markdown, JSON e busca vêm da mesma fonte.
`src/content/docs/pt-br/`, `data/pages.json`, índices gerados, `dist/`, caches e
`evidence/` não são versionados. `data/generated-files.json` limita a limpeza
aos arquivos criados pelo gerador. Os JSON de contratos são versionados.

## Atualizar contratos a partir da engine

O checkout da engine fica separado. Na raiz deste repositório:

```powershell
npm run sync:api -- C:/caminho/atchengine
```

Também é possível usar `ASTRA_ENGINE_ROOT`. Um segundo argumento opcional aponta
para exemplos a compilar semanticamente, como `dist/examples`. Isso não os executa.
Roslyn/MSBuild carrega o projeto real e interrompe a extração se houver erros.
O resultado contém assinaturas e comentários selecionados, sem corpos de métodos.

Para os componentes, usando g++ C++20 e um checkout local autorizado:

```powershell
$engineRoot = 'C:/caminho/atchengine'
New-Item -ItemType Directory -Force evidence | Out-Null
g++ -std=c++20 -O0 -I "$engineRoot/native" tools/export-components.cpp "$engineRoot/native/resources/asset_registry.cpp" "$engineRoot/native/scene/collision_recipe.cpp" -o evidence/export-components.exe
& ./evidence/export-components.exe | Set-Content data/components.json -Encoding utf8
```

O extrator lê contratos e valores padrão; não inicializa renderer ou gameplay.
Recursos, coleções e operações exigem a API especializada. Revise o recorte público
antes de publicar: não copie código privado, credenciais ou evidências internas.

## Publicação e domínio

Projeto Vercel: `prj_I4UU3minA10YutRfDzpIcz4aWcWa`.
Equipe Vercel: `team_xgLSsAwYwHvhZTqxgAhpsWVl`.
Framework Astro, Node 24, instalação `npm ci`, build `npm run build`, saída `dist`.
O projeto está conectado a `kacerato/AstraDocs`, na raiz do repositório.

O domínio `astraengine.com.br` está associado ao projeto. Em 06/10/2026, a Vercel
solicitou o registro DNS `A`, nome `@`, valor `216.198.79.1`, no Registro.br.
A associação na Vercel não comprova propagação DNS ou emissão do certificado;
consulte o estado atual no painel Domains. Não altere MX/TXT de e-mail.
`SITE_URL` pode sobrescrever a origem dos metadados; o padrão é o domínio próprio.

O histórico inicial foi publicado por upload direto, antes da conexão Git.
`tools/prepare-deploy.mjs` preserva esse caminho de contingência por manifesto,
mas o fluxo normal agora é commit e push neste repositório.

## Cobertura e limites

Veja `DELIVERY.md` para a evidência da primeira publicação. Página existente,
assinatura extraída, guia revisado, exemplo compilado e execução no dispositivo
são evidências distintas. Há aprofundamento editorial pendente em partes da API.
Planos de Astra 2/Luau não são apresentados como suporte da geração atual.

`DESIGN.md` registra a identidade do kit fornecido. A inclusão deste código e
assets em repositório público não concede uma licença da engine Astra.

## Distribuição Android

O estágio geral do projeto e o Discord oficial são mantidos em `data/project.mjs`.
O percentual é uma estimativa fornecida pelo criador sobre a meta final, não
uma contagem automática de capacidades, estabilidade ou cobertura de testes.
O componente compartilhado `ProjectStatus.astro` aparece na home e no download;
o mesmo texto é exportado nos guias de visão geral, estado da versão e Markdown.

`/download/` apresenta a versão descrita em `data/release.json`. A página,
o Markdown exportado e `/releases/latest.json` derivam desse mesmo manifesto.
Os APKs ficam nos assets de Releases deste repositório público, fora do Git e
do pacote da Vercel. Os arquivos de código-fonte que o GitHub gera nessas
Releases são deste portal, não dos fontes privados da engine.

Para atualizar: gere o APK Release assinado no ambiente privado da engine,
verifique assinatura, manifesto Android e hash, publique uma Release com tag
única e assets completos, atualize `data/release.json` e publique o site.
Não sobrescreva um APK publicado: uma nova versão exige nova tag e versionCode.
Preserve a chave de distribuição para manter compatibilidade de atualização;
não inclua keystore, senha ou logs privados neste repositório.

A versão pública inicial é uma prévia. Build, integridade e assinatura são
evidências distintas de validação de execução no dispositivo.
