import { trail, badge, shot, to, releaseLabel } from './tools.mjs';

const c = (slug, title, description, body) => trail('comecar', slug, title, description, body);
const old = slug => `/pt-br/snapshot-2026-10-06/comece/${slug}/`;

export const startTrail = [
c('o-que-e', 'O que é a Astra', 'Um editor de jogos 3D que roda no celular Android: o que ele faz, o que dá para criar hoje e o que ainda não dá.', `
A Astra é um **editor de jogos 3D que roda inteiro no celular Android**. Você monta a cena com objetos e componentes, programa em **C#** quando precisa, aperta **Play** para jogar ali mesmo e exporta o jogo como um APK.

${shot('comecar/vila-astra.webp', 'A Vila Astra, projeto de testes da Astra, no editor ao entardecer', 'A Vila Astra, projeto que usamos nas medições, aberta no editor.')}

## Como ela funciona

- **Objetos e componentes.** Tudo na cena é um objeto com uma posição. O que ele faz vem dos **componentes**: uma Luz ilumina, um Personagem anda e colide, um Sistema de partículas solta fogo. É o mesmo modelo da Unity e da Godot.
- **Inspector.** Você muda cada propriedade num painel de campos, sem código.
- **Scripts C#.** Para regras próprias do jogo, um script (Behavior) roda a cada quadro. Muitos eventos também ligam sem código pela **Conexão de evento**.
- **Play.** O jogo roda dentro do editor. Ao parar, a cena volta ao que era.

## O que dá para criar na ${releaseLabel}

| Dá | Ainda não dá, ou é parcial |
| --- | --- |
| Cenas 3D com luz, sombra, céu com dia e noite, nuvens, chuva e neve | Garantia em todo aparelho: as medições foram feitas no POCO F7 |
| Personagem com câmera, controles de toque, animação e física | Multijogador e rede |
| Partículas (fogo, faíscas, chuva), pós-processamento, lightmap assado | Mais de duas câmeras visíveis ao mesmo tempo |
| Importar modelos FBX e glTF, texturas, WAV, clipes e pacotes Unity | Importar scripts e shaders da Unity (são convertidos só os casos conhecidos) |
| Navegação de inimigos, UI de jogo e HUD, áudio com mixer | Exportar APK é experimental |

## Por onde começar

1. ${to('comecar', 'instalar', 'Instale a Astra')}.
2. ${to('comecar', 'primeiro-projeto', 'Crie seu primeiro projeto')} e rode no Play.
3. Conheça a tela em ${to('editor', 'mapa-da-tela', 'Mapa da tela do editor')}.
4. Siga o tutorial ${to('criar', 'fazer-um-player', 'Fazer um player')}.
`),

c('instalar', 'Instalar a Astra no Android', 'Requisitos do aparelho, onde baixar o APK, como conferir e como atualizar sem perder projetos.', `
${badge('device', 'instalação e atualização conferidas no POCO F7 com Android 16')}

## Requisitos

| Item | Mínimo |
| --- | --- |
| Android | 8.0 ou mais novo |
| Processador | 64 bits (arm64-v8a) |
| Gráficos | Vulkan 1.1 |
| Memória | Páginas de 4 KB (aparelhos com páginas de 16 KB ainda não são suportados) |

As medições de desempenho foram feitas num POCO F7 (Adreno 825). Em aparelhos mais fracos, use os níveis de qualidade B ou C.

## Baixar e instalar

1. Abra a página [Baixar Astra](/download/) no celular e toque no botão de download.
2. Abra o arquivo baixado. Se o Android pedir, permita instalar apps desta fonte.
3. Toque **Instalar**. A Astra aparece com o ícone da marca.

Para conferir o arquivo, compare o SHA-256 mostrado na página de download com o do arquivo baixado.

## Atualizar

Instale a versão nova por cima da antiga, sem desinstalar: a chave é a mesma e os **projetos ficam**. Arquivos salvos numa versão nova podem não abrir numa versão mais velha; antes de salvar, copie o projeto se precisar voltar.

## Primeira abertura

A Astra pergunta se você quer compartilhar dados de desempenho (FPS e tempos de quadro, sem nomes nem conteúdo de projetos). Escolha **Agora não** ou **Compartilhar**; dá para mudar depois em **Configurações**, na tela de Projetos.
`),

c('primeiro-projeto', 'Seu primeiro projeto', 'Do projeto vazio a uma cena com chão, cubo, luz e câmera rodando no Play, salva e reaberta.', `
${badge('host', 'fluxo conferido na fonte; capturas da rodada no POCO F7')}

Neste passo a passo você cria um projeto vazio, monta uma cena simples e aperta Play. Leva uns 10 minutos.

## 1. Criar o projeto

Na tela de **Projetos**, toque **Novo projeto**. Digite um nome (por exemplo, \`MeuPrimeiro\`) e toque **Criar projeto**. O projeto começa com uma cena vazia e o editor abre.

${shot('comecar/novo-projeto.webp', 'Folha Novo projeto vazio com o campo de nome', 'Novo projeto vazio.')}

Se aparecer "Já existe um projeto com esse nome.", escolha outro nome.

## 2. Pôr o chão e um cubo

1. Toque **+** na Hierarquia › **Geometria › Chão**.
2. Toque **+** › **Geometria › Cubo**.
3. O Cubo já nasce apoiado no chão (**Posição Y** 0,5) e com **Corpo físico**. Para mudar o lugar, arraste as setas do gizmo ou edite a Posição no Inspector.

${shot('comecar/chao-e-cubo.webp', 'Cena com chão e um cubo selecionado, com o gizmo de mover', 'Chão e cubo na cena.')}

## 3. A câmera e a luz que já vêm

O projeto novo já nasce com duas coisas, como uma cena nova da Unity:

- **Main Camera** em (0, 1, −10), olhando para a origem, com **Câmera** e **Ouvinte de áudio**. É o que o jogador vê e ouve no Play; ela tem a marca MainCamera.
- **Directional Light**, o sol da cena, inclinada 50°.

Elas não entram no Desfazer: o histórico começa vazio.

## 4. Sol que anda com a hora

Para ter dia e noite, troque a luz: apague a **Directional Light** e toque **+** › **Luzes › Sol com dia e noite**. Ele cria o Sol e a Lua ligados à **Hora do dia**. No Inspector do Sol, mude **Hora** para 17: a luz fica alaranjada e as sombras compridas.

## 5. Play

Toque **▶** no centro da barra superior. A cena roda pela câmera. Toque **■** para voltar. O que você mudou durante o Play volta ao valor de antes.

${shot('comecar/primeiro-play.webp', 'Cena rodando no Play pela câmera', 'A cena no Play.')}

## 6. Salvar e reabrir

Toque o **disquete** na barra superior: a barra de status mostra "Salvo". Volte à tela de Projetos e abra o projeto de novo: chão, cubo, Sol e Main Camera continuam lá.

## Próximo passo

- Entenda cada área da tela: ${to('editor', 'mapa-da-tela', 'Mapa da tela do editor')}.
- Faça o cubo girar com um script: [Primeiro script C#](${old('primeiro-script-c')}).
- Faça um personagem jogável: ${to('criar', 'fazer-um-player', 'Fazer um player')}.
`),
];
