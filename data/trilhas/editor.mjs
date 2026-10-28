import { trail, badge, shot, to } from './tools.mjs';

const e = (slug, title, description, body) => trail('editor', slug, title, description, body);

export const editorTrail = [
e('mapa-da-tela', 'Mapa da tela do editor', 'O que é cada área da tela do editor no celular deitado: barra superior, viewport, Hierarquia, Arquivos, Inspector e barra de status.', `
${badge('host', 'mapa conferido na fonte do editor; capturas da rodada no POCO F7')}

A Astra abre o editor com o celular **deitado**. A tela tem sempre as mesmas áreas:

${shot('editor/mapa-da-tela.webp', 'Editor da Astra com a Vila Astra aberta: barra superior, Hierarquia e Arquivos à esquerda, viewport no centro e Inspector à direita', 'As cinco áreas do editor, com a Vila Astra aberta.')}

| Área | Onde | Para que serve |
| --- | --- | --- |
| Barra superior | Topo, 52 px | Menu, salvar, desfazer, Play, gráficos, busca e importar |
| Hierarquia | Esquerda, em cima | Lista de objetos da cena, em árvore |
| Arquivos | Esquerda, embaixo da Hierarquia | Arquivos do projeto: código, sons, texturas, modelos |
| Viewport | Centro | A cena em 3D, onde você seleciona e move objetos |
| Inspector | Direita | Propriedades e componentes do objeto selecionado |
| Barra de status | Embaixo do viewport | Última mensagem, contagem de erros e avisos |

Arraste os divisores entre as áreas para mudar o tamanho de cada uma. O botão de **tela cheia** no canto inferior direito do viewport esconde e mostra os dois painéis de uma vez.

## Barra superior

A barra só tem ícones. Da esquerda para a direita:

| Ícone | Nome | O que faz |
| --- | --- | --- |
| ☰ | Menu da cena | Abre o menu **Cena** (veja ${to('editor', 'menus', 'Menus do editor')}) |
| Disquete | Salvar | Salva a cena. A barra de status mostra "Salvo" |
| Setas curvas | Desfazer e Refazer | Toque desfaz um passo; toque longo abre o histórico. Somem durante o Play |
| ▶ / ■ (destaque, no centro) | Play / Stop | Roda a cena como jogo e volta à edição |
| Pausar, Passo, 1×, Inspecionar | Só durante o Play | Pausa, avança um quadro, muda a velocidade e mostra os painéis durante o jogo |
| Pós com selo TAA, ASR ou FSR | Ampliação temporal | Liga e desliga o ampliador de imagem do projeto |
| Controles deslizantes | Gráficos do projeto | Níveis de qualidade, sombras, luz e pós, desempenho e texturas |
| Lupa de diagnóstico | Diagnóstico | Abre o painel Problemas e Registros (só na edição) |
| Lupa | Busca global | Procura objetos, arquivos e comandos |
| Seta para dentro | Importar | Modelo, pasta de pacote, textura, HDRI ou áudio |

## Viewport

${shot('editor/viewport-controles.webp', 'Viewport com os controles sobrepostos marcados', 'Controles sobre o viewport.')}

- **Canto superior esquerdo:** Enquadrar seleção (câmera) e Enquadrar tudo (moldura).
- **Topo:** Iluminação da cena, Efeitos da cena e a seta com **Sky, Fog, Post Processing e Lightmap assado** (o que a vista de edição mostra), Vistas salvas e Camadas visíveis (olho).
- **Canto superior direito:** liga e desliga os gizmos de componente; logo abaixo, **Animar** abre o estúdio de animação do objeto.
- **Borda esquerda:** Selecionar, Mover, Rotacionar e Escalar.
- **Canto inferior esquerdo:** Órbita, Pan e Zoom, e o texto de status.
- **Canto inferior direito:** Grade e Tela cheia.

Gestos: um dedo orbita, dois dedos movem e aproximam. Toque num objeto para selecioná-lo.

## Hierarquia e Arquivos

- **Hierarquia:** "+" cria objetos, "⋮" abre ações, a busca filtra pelo nome. Cada linha tem a seta de dobrar, a caixa de ativo, o ícone, o olho (visível na cena), a mão (selecionável) e o cadeado do Inspector. Veja ${to('editor', 'hierarquia', 'Hierarquia e seleção')}.
- **Arquivos:** toque no cabeçalho para recolher. Os ícones do cabeçalho abrem Código, Áudio (WAV), Textura, Modelo, Pasta e HDRI. Selecionado um arquivo, aparecem as ações do tipo (Instanciar, Reimportar, Converter material Unity, Instanciar prefab…).

## Inspector

Mostra o objeto selecionado: nome, contagem de componentes, ativo e as abas **Inspeção** e **Componentes**, com o "+" para adicionar. Sem seleção, mostra "Nada selecionado". Veja ${to('editor', 'inspector', 'Inspector')}.

## Barra de status e diagnóstico

A barra embaixo do viewport mostra a última mensagem do console (ou "Console vazio") e os contadores de erros e avisos. Toque para abrir o painel de diagnóstico, com as abas **Problemas** e **Registros**. O console completo, com busca e filtros, fica no espaço Código (ícone de código em Arquivos).

## Celular em tela estreita

Se o viewport ficar estreito, aparece o botão **Painéis**, que abre Viewport, Hierarquia, Inspector e Arquivos um de cada vez.

## Durante o Play

Os painéis somem para o jogo ocupar a tela. Toque **Inspecionar** para vê-los; o Inspector mostra a faixa "Em execução · edições voltam ao parar". Tudo que você mudar durante o Play volta ao valor anterior quando parar.
`),

e('menus', 'Menus do editor: Cena, Importar e Gráficos', 'Cada item do menu ☰ Cena, do menu Importar e do painel Gráficos do projeto, e onde ficam Qualidade, Iluminação e Configurações.', `
${badge('host', 'itens conferidos na fonte do editor')}

## Menu ☰ Cena

${shot('editor/menu-cena.webp', 'Menu Cena aberto pelo botão ☰', 'O menu ☰ Cena.')}

| Item | Abre |
| --- | --- |
| Voltar à edição | O espaço Cena (fica desabilitado se você já está nele) |
| Malhas do projeto | A Biblioteca filtrada pelas malhas do projeto |
| Biblioteca de pacotes | A Biblioteca, com os pacotes importados (veja a trilha Importar) |
| Iluminação | A janela Iluminação: Ambiente e Lightmaps (${to('editor', 'janela-iluminacao', 'Janela Iluminação')}) |
| Configurações do projeto | Camadas e colisão, Entrada, Tags e Água da cena (só com água na cena) |
| Interface (UI + ImGui) | O espaço de edição da UI de jogo |
| Layout dos painéis | Layouts prontos, Salvar layout atual (até 12) e Restaurar o padrão |

## Menu Importar

O botão **Importar** da barra superior abre:

| Item | Aceita |
| --- | --- |
| Modelo | GLB ou FBX |
| Pasta de pacote | Uma pasta com modelos, texturas, materiais, prefabs e clipes (por exemplo, um pacote Unity extraído) |
| Textura | PNG, JPEG, TGA, TIFF ou KTX2 (BasisU) |
| Ambiente (HDRI) | Radiance .hdr panorâmico 2:1 |
| Áudio | WAV |

Os limites e o passo a passo estão na trilha Importar.

## Gráficos do projeto

O ícone de **controles deslizantes** na barra superior abre as configurações gráficas do projeto, com as abas **Geral, Sombras, Luz e pós, Desempenho e Texturas**. É aí que fica o **nível de qualidade** (S, A, B, C). Cada nível é um teto: limita Render Scale, sombra do sol, oclusão de ambiente, bloom e luzes por objeto, e o painel mostra o corte no próprio valor (por exemplo 4 → 2). Dentro desse painel também abrem as Estatísticas e o Explorador de luzes.

## Fora do editor: tela de Projetos

Duas funções ficam na tela de **Projetos**, antes de abrir um projeto:

- **Exportar APK**, no cartão de cada projeto (${to('criar', 'publicar-o-jogo', 'Publicar o jogo')}).
- **Configurações** no trilho lateral, com a **Telemetria de desempenho** (Compartilhar desempenho, Enviar agora, Apagar dados).
`),

e('criar', 'Menu Criar: tudo que o + cria', 'Cada categoria e cada receita do menu + Criar, com o que ela põe na cena.', `
${badge('host', 'catálogo de criação conferido na fonte: 108 entradas')}

O **+** da Hierarquia abre o menu Criar com as categorias. **Todas as receitas…** abre a folha **Criar objeto**, com busca, categorias, cartões que mostram os componentes de cada receita, e o destino: **Na raiz** ou **Em <objeto>**, o objeto selecionado. Com um objeto selecionado, o destino volta a ser **Em <objeto>**; para criar na raiz, escolha **Na raiz** na folha.

${shot('editor/criar-objeto.webp', 'Folha Criar objeto com a categoria Volume e céu', 'A folha Criar objeto.')}

Algumas entradas só aparecem quando o projeto tem o que elas precisam: Cubo, Chão, Modelo de cena, Água e Caixa flutuante pedem os recursos do pacote do projeto; Esfera, Cápsula, Cilindro, Plano e Quad pedem as primitivas; a categoria Personagem pede um objeto com esqueleto selecionado.

| Categoria | O que cria |
| --- | --- |
| Básicos | Objeto vazio, Câmera, Câmera seguidora (segue a seleção no Play), Câmera virtual (órbita na seleção, com Cérebro na câmera da cena), Modelo de cena |
| Geometria | Cubo, Chão, Esfera (1 m), Cápsula (2 m), Cilindro (2 m), Plano (10 × 10 m), Quad (1 × 1 m) |
| Água | Superfície de água, Oceano, Rio por pontos |
| Física | Caixa flutuante; juntas (fixa, cone, swing/twist, configurável, mola); cilindros de colisão; caixa, esfera e cápsula de colisão (estáticas, dinâmicas, sensores e cinemáticas); Personagem; Personagem cilíndrico; Cilindro com motor; Sensor conectado e Sensor 2D conectado; Propulsor físico; campos de gravidade, vento, arrasto e radial |
| Luzes | Luz direcional, **Sol com dia e noite** (Sol e Lua com Hora do dia), **Iluminação da cena**, **Sonda de reflexo**, **Grupo de sondas de luz**, Luz pontual, Luz spot |
| Gameplay | Conexão de evento, Gatilho sonoro, Timer, molas e restrições (seguir, mirar, olhar), Tweens, Animator, Caminho Bézier, Seguidor de caminho, Câmera no caminho |
| Áudio | Fonte sonora, Ouvinte, Bus de áudio, Bus de reverberação, Bus com ducking, Snapshot de mixer, Importar WAV |
| Física 2D | Campos 2D, caixas, círculo e cápsula 2D, Sensor 2D, Propulsor 2D, Pivô 2D |
| Navegação | Superfície, Agente perseguidor, Obstáculo, Link |
| Personagem | Olhar para alvo, Mirar com as mãos, Mãos ao alvo, Pés no chão, Corpo inteiro, Carregar caixa (sobre o esqueleto selecionado) |
| Volume e céu | **Volume global**, **Volume em caixa**, **Volume em esfera**, **Ambiente**, **Clima** (com os filhos Chuva, Neve, Chão da chuva e Respingos), **Volume de nuvens** |
| Efeitos | **Partículas**, **Faíscas** (com trilha e luzes) |

O menu também traz **Importar modelo…**, que abre o seletor de arquivos.
`),

e('hierarquia', 'Hierarquia e seleção', 'Como selecionar um ou vários objetos, organizar pais e filhos e o que tem no menu de cada objeto.', `
${badge('host', 'menu conferido na fonte do editor')}

## Selecionar

- Toque na linha do objeto na Hierarquia ou no próprio objeto no viewport.
- **Selecionar vários**, ao lado da busca, entra no modo de soma: cada toque soma ou tira um objeto. Aparecem **Tudo, Filhos, Inverter e Nada**. "Filhos" seleciona as peças de um modelo importado.
- Com vários selecionados, Adicionar componente põe o componente em todos, num único Desfazer, sem apagar o que cada um já tinha.

## Organizar

Arraste uma linha sobre outra para mudar o pai ("Mudar pai"). A seta da linha dobra e desdobra os filhos. O olho esconde só na vista de edição; a mão impede selecionar pelo viewport; o cadeado prende o Inspector naquele objeto.

## Menu do objeto

Toque longo numa linha, ou ⋮ no cabeçalho da Hierarquia:

${shot('editor/menu-objeto.webp', 'Menu de ações de um objeto na Hierarquia', 'Menu do objeto na Hierarquia.')}

Criar filho ▸, Duplicar, Renomear, Enquadrar na vista, **Animar** (abre o estúdio de animação), Mover acima, Mover abaixo, Mudar pai, Mover para a raiz, Abrir em janela, Criar raiz Character… (só em objeto com malha) e Excluir.

O ⋮ do **Inspector** tem mais ações sobre o mesmo objeto (Configurar locomoção, prefabs, copiar e colar transformação): veja ${to('editor', 'inspector', 'Inspector')}.
`),

e('inspector', 'Inspector: propriedades e componentes', 'O cabeçalho do Inspector, as ações do objeto, como adicionar e organizar componentes, os cartões de override do Volume e os seletores de recurso.', `
${badge('host', 'itens conferidos na fonte do editor')}

${shot('editor/inspector.webp', 'Inspector de um objeto com Luz e Hora do dia', 'Inspector do Sol com dia e noite.')}

## Cabeçalho

Ícone, nome (toque para renomear), "N componentes" (perto do teto de 64 aparece "N de 64 componentes"), caixa de ativo, cadeado e ⋮. Embaixo, as abas **Inspeção** (os campos) e **Componentes** (a lista), com o **+** para adicionar.

## Ações do objeto (⋮ do Inspector)

Configurar locomoção… (ou Regenerar colisão…), Criar raiz Character…, Renomear, Duplicar, Excluir, Enquadrar na vista, Alinhar com a vista, Criar filho vazio, Criar prefab da seleção, Desvincular instância de prefab, Comparar com a fonte do prefab, Mover acima/abaixo, Mudar pai, Mover para a raiz, Copiar, Colar e Redefinir transformação, Propriedades (janela), Modo Debug e Ping na Hierarquia.

**Configurar locomoção** gera a colisão a partir da malha (Preservar, Ajustar, Convexo ou Decompor) e aplica num único Desfazer.

## Adicionar componente

Toque **+** no cabeçalho ou **Adicionar componente** no fim da coluna. A folha tem Presets, uma busca que aceita nomes de outras engines ("Buscar por nome, função ou termo de outra engine"), as famílias e um painel com a descrição. Ela recusa com "Já adicionado" o que não pode repetir e para em 64 componentes por objeto.

## Menu de cada componente (⋮ no cartão)

Subir, Descer, Copiar, Colar novo, Colar valores, Redefinir; nos componentes nativos, Presets, Impacto e Referência (abre a ficha nas docs); nos scripts, Abrir código; e Propriedades e Remover.

## Volume: cartões de override

No Ambiente (Volume), cada efeito é um cartão com seta, interruptor, ícone, nome, a contagem "marcados/total" e ⋮ (**Redefinir valores**, **Remover override**). A linha **ALL / NONE** marca ou desmarca todos os parâmetros. Um parâmetro desmarcado fica apagado e vem do Volume de baixo; com o cartão desligado aparece "Desligado: não entra na mistura". **Adicionar override** lista o que o perfil ainda não tem:

- **Céu e luz:** Céu, Sol e lua, Atmosfera física, Luz ambiente, Neblina, Nuvens.
- **Pós-processamento:** Exposição, Tonemapping, Bloom, Vinheta, Ajustes de cor, Cor, Curvas de cor, Grão de filme, Oclusão ambiente, Profundidade de campo, Desfoque de movimento, Aberração cromática, Distorção de lente.

## Seletores de recurso

Campos de recurso abrem um seletor com busca: material (com **Novo material do projeto**), textura por canal, malha, perfil, céu, HDRI, WAV, UI, material físico, controller e clipe. Campos de objeto abrem "Buscar objeto", com Avançado.
`),

e('janela-iluminacao', 'Janela Iluminação', 'Onde editar o céu, a luz ambiente e a neblina da cena e onde gerar o lightmap.', `
${badge('device', 'Ambiente e Lightmaps usados no POCO F7 nas validações de 21 a 25/10')}

Abra por **☰ › Iluminação**. A janela ocupa o lugar do Inspector, à direita, e tem duas abas.

${shot('editor/janela-iluminacao.webp', 'Janela Iluminação na aba Ambiente', 'Janela Iluminação, aba Ambiente.')}

## Ambiente

Edita o **Ambiente da cena**, o Volume global de menor prioridade, sem os cartões de override, como a janela Lighting da Unity. Grupos: **Céu, Atmosfera física, Sol e lua, Luz ambiente, Neblina**.

- Se a cena não tem Ambiente, a janela mostra os padrões e o botão **Personalizar o ambiente da cena**, que cria o Ambiente na raiz.
- Se você selecionou outro objeto, aparece **Abrir o Ambiente da cena · …**.
- **Céu:** Material do céu (um .skybox compartilhado) e o shader Procedural, Panorâmico (HDRI) ou Físico.
- **Luz ambiente:** Fonte Céu, Gradiente ou Cor, e as intensidades.
- **Neblina:** Linear, Exponencial ou Exponencial ao quadrado; cor fixa (o céu fica limpo) ou Acompanhar o céu.

## Lightmaps

${shot('editor/janela-lightmaps.webp', 'Aba Lightmaps com o cartão de estado e o botão Gerar iluminação', 'Janela Iluminação, aba Lightmaps.')}

- Cartão de estado: "Sem iluminação assada", "Lightmaps em dia", "Lightmaps desatualizados" ou "Recurso de lightmap ausente".
- Contadores: **Static**, **Recebem**, **Sem UV2** (toque seleciona esses objetos) e **Assada · Mista**.
- **Gerar iluminação** (ou Gerar de novo), **Limpar** e **Cancelar**. Sem configurações, **Criar configurações de iluminação**.
- O bake roda em segundo plano; pare o Play antes ("Pare o Play para gerar a iluminação").

Passo a passo completo em ${to('criar', 'lightmap', 'Lightmap: assar a luz de um interior')}.
`),
];
