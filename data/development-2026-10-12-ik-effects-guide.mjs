export const developmentOctober12IkEffectsGuide = {
  route: 'pt-br/desenvolvimento/2026-10-12/ik-efeitos-e-interacao',
  title: 'Desenvolvimento: efeitos de IK, interação e corpo inteiro (N04 pacote C)',
  description: 'Reação a impacto, recuo, inércia, amplificador, inclinação do corpo, poser de mão, evitar penetração, sistema e objeto de interação, IK de corpo inteiro, FABRIK em árvore e Corpo por alvos (VRIK) como componentes que rodam em Play; prioridade entre IKs e assistente que lê esqueletos sem nomes. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **12/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como **Astra Dev**. Não é um APK público; o download público continua **0.3.0-preview.20261009/code 28**.
:::

Continua o guia [IK e constraints](/pt-br/desenvolvimento/2026-10-11/ik-e-constraints/). Os doze componentes novos ficam em **Adicionar componente → Lógica → IK**, salvam na cena, têm ícone próprio, aparecem na API C# gerada e rodam no mesmo passo do IK em Play.

## Componentes

| Componente | Vai no objeto | O que faz | Como dispara |
|---|---|---|---|
| Reação a impacto | osso atingido (peito, cabeça, braço) | Gira o osso e N ossos acima para longe do golpe e volta no tempo de **Recuperação**. | Colisão sólida do objeto (opção **Reagir a colisões**), método \`hit(direção, força)\` ou, sem script, Conexão de evento **Impacto: golpear de frente** (contra a **Frente do osso**). |
| Recuo | ponta da arma ou mão | Levanta a cadeia no eixo do cano e recua a base; disparos se somam. | Método \`fire(intensidade)\` ou Conexão de evento **Recuo: disparar**. |
| Inércia | osso com filho (cauda, orelha, antena) | A ponta segue a pose por uma mola (**Rigidez**, **Amortecimento**, **Desvio máximo**). | Contínuo em Play. |
| Amplificador | qualquer osso | Exagera a rotação animada em relação à pose do início do Play. | Contínuo. |
| Inclinação do corpo | coluna ou pelve | Inclina para dentro da curva conforme a velocidade de giro do personagem. | Contínuo. |
| Poser de mão | mão, garra, pinça | Copia as rotações locais de uma hierarquia de referência, casando filhos pela ordem. | Contínuo; também usado pela interação. |
| Evitar penetração | ponta com IK de dois ossos ou de cadeia | Raio da raiz do membro ao alvo; havendo colisor no caminho, o alvo para na superfície com a **Folga**. | Contínuo, pela física real do Play. |
| Objeto interagível | o objeto (caixa, alavanca, arma) | **Ponto de pegada**, **Pose da mão**, tempos de alcançar/soltar e **Pegar ao alcançar**. | Lido pelo sistema de interação. |
| Sistema de interação | raiz do personagem | Leva a mão até o objeto (braço de 2 a 8 ossos em **Ossos do braço**), aplica a pose da mão e, se configurado, pega o objeto: objeto comum passa a ser filho da mão; objeto com corpo físico vira cinemático, segue a mão e volta ao movimento original ao soltar. | Métodos \`start(mão, objeto)\` e \`stop(mão)\`; eventos **Alcançou** e **Soltou** (também nas Conexões de evento). |
| IK de corpo inteiro | raiz do personagem | Até quatro pontas com alvo; alvo além do alcance puxa a **Pelve** (limitada), o **Peito** curva o tronco e os membros (2 a 8 ossos) são resolvidos. | Contínuo. |
| FABRIK em árvore | raiz comum (base de garra, corpo de aranha, polvo) | Até quatro cadeias saindo da mesma raiz; a raiz se move para todas alcançarem (**Fixar raiz** controla quanto). | Contínuo. |
| Corpo por alvos (VRIK) | raiz do personagem | Cabeça e mãos seguem alvos (quaisquer objetos: controles, âncoras); a pelve acompanha a cabeça, o peito curva, a cabeça copia a rotação do alvo e os braços são resolvidos. | Contínuo; com XR, os alvos podem ser os controles. |

**Ordem por quadro:** amplificador → corpo por alvos → grounder do corpo → corpo inteiro → FABRIK em árvore → membros e pés (com evitar penetração) → interação → poser → mira → olhar → inclinação → inércia → golpes e recuos → dedos → torção → limites. Dentro de cada etapa, a **Prioridade** (IK de dois ossos, de cadeia, Look At e Aim) decide a ordem: maior resolve primeiro e quem resolve por último tem a palavra final nos ossos comuns. Tudo parte da pose do quadro; desativar devolve a pose anterior na hora.

## Estúdio

- **Assistente de IK** reconhece mãos, pés, pelve e cabeça pelos nomes; sem nomes reconhecíveis, lê a **estrutura** do esqueleto (primeira bifurcação = pelve, folhas mais baixas = pés, folha mais alta = cabeça, demais folhas = mãos) e informa "Pela estrutura".
- **Fixar ponta** agora reavalia o clipe gravado quadro a quadro e corrige o que saiu do lugar (até 3 passes); o resumo mostra o desvio máximo medido.

## Exemplo em C#

\`\`\`csharp
// owner: o GameObject do personagem; rightHand e crate: ObjectReference.
var interaction = owner.GetComponent<InteractionSystem>();
interaction.Start(rightHand, crate);   // true se a mão e o objeto servem
interaction.OnReached(this, e => { /* a mão chegou */ });
interaction.Stop(rightHand);           // solta e larga a caixa
weapon.GetComponent<Recoil>().Fire(1); // um disparo com os valores autorados
\`\`\`

## Observações

- Uma interação por mão; segurar com as duas mãos são duas chamadas \`start\`, uma por mão.
- Cenas salvas antes desta revisão abrem com Prioridade 0, Ossos do braço 2, Frente do osso +Z e sem Peito no corpo inteiro (mesmo comportamento anterior).
`,
};
