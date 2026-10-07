# Identidade e experiência — ASTRA DOCS

## Direção

O catálogo distingue componentes da cena e elementos do documento UI. A busca
inclui campos, aliases como UiImage/UIIMG e caminhos de autoria. Cada resultado
mostra o caminho real abaixo do propósito. UI de jogo e roadmap são destinos
próprios na navegação; o tutorial de corações usa árvore, tabelas de valores e
uma ilustração pequena dos recursos, sem simular execução da engine no browser.

O estágio de desenvolvimento aparece antes do hero na home e no download,
em uma faixa compartilhada com aviso de limitações, progresso nativo acessível
e link para o Discord oficial. Os 20% são uma estimativa do criador sobre a meta
final, nunca cobertura de testes ou estabilidade. A faixa usa os mesmos tokens
do site e passa de duas colunas a uma no celular, sem animação de carregamento.

**Build your next universe.** A marca convida quem joga a criar. Títulos fortes, composição modular, ilustrações de contorno preto e contraste alto. A primeira referência orienta energia e atitude; a segunda orienta a repetição consistente de símbolo, cor e padrões. Os personagens e marcas dessas referências não são reutilizados.

A logo original Astra foi preservada nos quatro PNGs em `assets/brand`. Não é substituída pelo mascote. O símbolo de estrela e órbita inspira a personalidade e os elementos decorativos do novo kit.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| `accent` | `#D7FF00` | Cor plana proposta a partir do lima da logo; CTA, destaque e campos de marca |
| `ink` | `#11130F` | Texto forte, contornos, fundo escuro |
| `paper` | `#F6F7EE` | Fundo de leitura e olhos/luvas do mascote |
| `surface` | `#20231B` | Cards e blocos escuros |
| `muted` | `#62675A` | Texto secundário no tema claro |
| `line` | `#DADDCE` | Divisores no tema claro |

O PNG original contém variações e antialiasing; `#D7FF00` é um token de interface proposto, não uma alegação de valor único oficial extraído do raster. Cores semânticas adicionais de aviso/erro devem ser acompanhadas de texto. Evitar arco-íris por categoria.

## Tipografia e proporções

Protótipo usa fontes do sistema, sem requisição externa. Display pesado: Arial Black/Segoe UI, caixa alta, entreletra negativa moderada. Texto: Segoe UI/Arial, 17–18 px, entrelinha 1,65. Código: Consolas/Cascadia Code/monospace, 14–15 px. Corpo em 68–78 caracteres por linha. Títulos de referência não usam letras gigantes.

Escala de espaçamento 4/8/12/16/24/32/48/64/96 px. Bordas fortes de 2 px em cards de entrada; divisores de 1 px em conteúdo técnico. Raios 12–24 px em cartões; 8 px em controles; pills apenas em labels curtas. Sombra sólida de 5–8 px em destaques; nunca em cada parágrafo.

## Orbit

Mascote original gerado para esta proposta: estrela arredondada verde-lima, anel preto inclinado na cintura, olhos claros, luvas e tênis. Cinco poses: welcome, code, build, search, success. Os PNGs mestres têm alfa real; WebP e PNG menores são derivados para uso responsivo.

Uso: hero, entradas de trilha, onboarding, busca vazia/404 e conclusão de tutorial. Não usar como avatar de suporte humano ou prometer uma IA de atendimento que não existe. Tamanho recomendado: 240–560 px em hero; 96–180 px em estados vazios. Abaixo de 64 px usar a marca, não reduzir o corpo inteiro até perder expressão.

Não alterar proporções, recolorir, espelhar poses com símbolos assimétricos ou aplicar filtros. O anel preto pode perder contraste no fundo escuro: preferir campo lima/claro ou painel claro delimitado. A roupa/expressão não substitui avisos de erro. Atributo alt vazio quando a ilustração é puramente decorativa.

## Layouts a implementar

1. Home: cabeçalho compacto, manifesto curto e grande, mascote de boas-vindas, três trilhas, atalhos para API, novidades por versão.
2. Guia: breadcrumb, resumo, pré-requisitos, passos, código, verificações e próxima ação.
3. API: sidebar por namespace, assinatura, parâmetros, retorno, erros, exemplo, limitações e sumário lateral.
4. Componente: função + badge de versão; propriedades em tabela; dependências/conflitos; exemplo de composição; ligação à API.
5. Catálogo: busca por nome; filtros combináveis de categoria/estado/plataforma; resultado em lista legível, sem efeito visual pesado.
6. Receita: resultado final, dependências, arquivos, instruções, verificação e variações.

## Leitura operacional — revisão de 07/10/2026

Manual, Conceitos e Sistemas começam por um índice de tarefas: intenção, acesso e
guia correspondente em uma tabela legível. Cada capítulo usa a estrutura que seu
problema exige: sequência de interação, exemplo numérico, composição ou código.
Campos e sintomas ficam junto da montagem, com links ao componente, API e roadmap.
Essa navegação evita obrigar o leitor a conhecer previamente o nome de uma classe.
Preservar rotas existentes, tipografia, largura de leitura e comportamento de
tabelas/código em telas pequenas. Índices são conteúdo editorial, sem acrescentar
uma grade de cartões ou outro sistema visual ao portal.
7. Busca/404: mensagem útil e ações de recuperação com Orbit Search.
8. Release: alterações por impacto, migração e compatibilidade; Orbit Success somente na abertura.

## Estados e interação

Atualizações é um histórico editorial, sem grade de cards: data/origem precedem
título, versão/disponibilidade e resumo; detalhes, validação e migração aparecem
sob demanda. Tudo/App/Docs e busca filtram a mesma lista. Conteúdo permanece legível
sem JavaScript. A aba usa os tokens existentes e links na navegação principal e
lateral; o JSON público e o Markdown representam o mesmo registro.

Foco visível de alto contraste com offset; hover discreto e equivalente por foco; links sublinhados no texto; controles disabled explicam motivo. Menu mobile usa botão semântico com `aria-expanded`. O resultado de copiar código é anunciado em região `aria-live`. Estado de carregamento da busca não bloqueia o artigo. Interações do portal final terão testes de teclado, toque e leitor de tela.

O protótipo entregue permite trocar tema, abrir menu mobile, filtrar o catálogo, abrir busca, copiar código e navegar entre páginas de demonstração. O conteúdo do catálogo é um inventário de fonte, com esse limite visível.

## Assets e desempenho

Logo no cabeçalho usa imagem original otimizada em WebP, com PNG de origem preservado. Ícones vetoriais simples com stroke consistente; versões PNG transparentes de 48 e 96 px para integrações que exigem raster. Padrões são SVG leves, com PNG de exportação. Nenhum texto de interface é achatado em PNG. Imagens sociais são exceção, pois são artefatos de compartilhamento.

Use `width`, `height`, `srcset`, `sizes`, `decoding=async`; apenas a imagem principal acima da dobra recebe prioridade. Ilustrações abaixo da dobra usam lazy loading. Downloads de masters ficam fora do carregamento inicial. A folha de marca e capturas são material de revisão, não fundo de página.

## Definição de completo para o kit visual v1

Logo original em lockup, mark, glyph e wordmark; favicons; cinco poses do mascote; versões raster/web responsivas; vinte ícones em claro/escuro; três padrões; cards sociais para home/API/componentes; tokens CSS/JSON; manifesto com dimensões, hashes e finalidade; folha de identidade e capturas de home, API, catálogo e mobile. Capturas de funcionalidades reais da engine entram na implementação editorial, após executar cada fluxo — não serão fabricadas por geração de imagem.
