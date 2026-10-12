export const developmentOctober12RootMotionGuide = {
  route: 'pt-br/desenvolvimento/2026-10-12/root-motion',
  title: 'Desenvolvimento: root motion (N05)',
  description: 'O passo que a animação dá ao quadril vira movimento do personagem em Play, pelo Personagem, por corpo físico ou pela transformação; o osso fica no lugar e o laço do clipe não dá tranco. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **12/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como **Astra Dev**. Não é um APK público; o download público continua **0.3.0-preview.20261009/code 28**.
:::

## O que é

Clipes de caminhada, corrida ou ataque com avanço movem o **osso raiz** (normalmente o quadril). Com **Root motion** no personagem, esse avanço vira movimento do próprio personagem, e o osso volta ao lugar para o corpo não andar duas vezes.

## Como ligar

- **Estúdio de animação → aba IK → Root motion:** cria o componente no personagem com o osso raiz encontrado pelos nomes (hip, pelvis, quadril, pelve) ou, sem nomes, pela primeira bifurcação do esqueleto. Tocar de novo liga ou desliga. Um **Desfazer** remove.
- **Adicionar componente → Animação → Root motion:** criação manual; escolha o **Osso raiz**.
- Scripts C#: \`RootMotion\` na API gerada.

## Propriedades

| Propriedade | Efeito |
|---|---|
| Osso raiz | Osso cujo passo é medido (dentro do personagem). |
| Andar no plano | Aplica o avanço em X/Z. |
| Subir e descer | Aplica o deslocamento vertical (pulos, escadas animadas). |
| Girar | Aplica o giro do osso em torno do eixo vertical. |
| Frente do osso | Eixo usado para medir o giro. |
| Peso | Fração do passo que vai para o personagem; o resto continua no osso. |
| Osso fica no lugar | Remove do osso o que foi aplicado ao personagem. |
| Salto de laço / Giro de laço | Um passo maior que isso é o clipe voltando ao início: aquele quadro usa o passo anterior. |

## Como o movimento é aplicado

Depois da animação e antes da física, a cada quadro:

1. o passo do osso é medido no espaço do personagem;
2. a rota é escolhida pelo que o objeto já tem: **Personagem** (posiciona o personagem e ajusta a direção), **corpo físico dinâmico** (o passo vira velocidade no plano; a vertical continua com a física) ou **transformação** (objeto sem física);
3. o osso volta ao lugar nos eixos aplicados.

Funciona com **Animação** e **Animator** (inclusive misturas), porque mede a pose final do quadro.
`,
};
