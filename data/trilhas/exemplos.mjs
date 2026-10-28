import { trail, badge, shot, to } from './tools.mjs';

// Os 12 projetos de exemplo da API gráfica (G7) entram quando estiverem no APK.
const g7Merged = true;
const x = (slug, title, description, body) => trail('exemplos', slug, title, description, body);

export const examplesTrail = [
x('projetos', 'Projetos de exemplo', 'Os projetos que vêm com a Astra e os que você monta seguindo os tutoriais, com o que cada um mostra.', `
${badge('device', 'U07 aberto e em Play dentro do APK público desde a 0.3.2')}

## Vem com o APK

| Projeto | Mostra | Onde |
| --- | --- | --- |
| ${to('exemplos', 'u07-laboratorio', 'U07 Laboratório de Controle')} | personagem com motor físico, câmera virtual em órbita, joystick e botões de toque, oito clipes de locomoção, posse de controle | tela de Projetos, já instalado |

O Novo projeto sempre começa com uma cena vazia.

## Monte seguindo um tutorial

| Tutorial | Resultado |
| --- | --- |
| ${to('comecar', 'primeiro-projeto', 'Seu primeiro projeto')} | chão, cubo, sol e câmera no Play |
| ${to('criar', 'fazer-um-player', 'Fazer um player')} | personagem que anda, pula, corre e colide |
| ${to('criar', 'cena-luz-ceu-clima', 'Cena, luz, céu e clima')} | dia e noite com lua, nuvens e chuva |
| ${to('criar', 'particulas', 'Partículas')} | fogo animado e faíscas que iluminam |
| ${to('criar', 'lightmap', 'Lightmap')} | interior com luz assada e sondas |
| ${to('criar', 'volume-e-pos', 'Volume e pós')} | visual próprio por área |
${g7Merged ? `\n## Exemplos da API gráfica\n\nSeis receitas, cada uma em C# e em Flow: ${to('exemplos', 'api-grafica', 'Exemplos da API gráfica')}.\n` : ''}
## Exemplos antigos de código

As receitas da documentação de 06/10 (Cristais do Templo, Circuito Neon e outras) continuam em [Exemplos de 06/10](/pt-br/snapshot-2026-10-06/exemplos/como-executar-exemplos/); são roteiros de código, não projetos instalados.
`),

x('u07-laboratorio', 'U07 Laboratório de Controle', 'O projeto que vem com a Astra: o que ele mostra, como jogar e o que olhar no editor.', `
${badge('device', 'aberto e em Play dentro do APK público no POCO F7')}

É o único projeto predefinido do APK. Abra na tela de Projetos e toque **▶**.

${shot('exemplos/u07-play.webp', 'U07 em Play com o personagem, a raposa, o joystick e os botões', 'U07 em Play.')}

## Como jogar

- **Joystick:** anda relativo à câmera; o corpo gira para o lado em que anda.
- **Arrastar na metade direita:** gira a câmera virtual em órbita (uma esfera de 0,25 m evita o chão).
- **Saltar:** impulso, subida, ápice, queda e aterrissagem com clipes reais.
- **Fonte:** alterna a posse de controle (Automático, UI, teclado, gamepad, Script, IA).
- **Script** e **PrioridadeIA:** mostram como duas origens disputam o controle.

## O que olhar no editor

- O jogador usa **Motor dinâmico** com **Corpo físico** e colisores: a física move o corpo.
- A câmera é uma **Câmera virtual** com **Cérebro** na câmera real.
- O **Canvas UI** liga o documento de controles ao jogador.
- \`Scripts/U07Controller.cs\` é editável: gira o corpo para a direção do movimento e escolhe os oito clipes pela velocidade.

## Limites

Sem IK de pés, retargeting ou root motion em Play. O que você muda no Play não é salvo: saia do Play, altere e salve.
`),
];
