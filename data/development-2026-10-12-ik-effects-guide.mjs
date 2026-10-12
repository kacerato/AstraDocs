export const developmentOctober12IkEffectsGuide = {
  route: 'pt-br/desenvolvimento/2026-10-12/ik-efeitos-e-interacao',
  title: 'Desenvolvimento: efeitos de IK, interação e corpo inteiro (N04 pacote C)',
  description: 'Reação a impacto, recuo, inércia, amplificador, inclinação do corpo, poser de mão, evitar penetração, sistema e objeto de interação e IK de corpo inteiro como componentes que rodam em Play. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **12/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como **Astra Dev**. Não é um APK público; o download público continua **0.3.0-preview.20261009/code 28**.
:::

Continua o guia [IK e constraints](/pt-br/desenvolvimento/2026-10-11/ik-e-constraints/). Os dez componentes novos ficam em **Adicionar componente → Lógica → IK**, salvam na cena, têm ícone próprio, aparecem na API C# gerada e rodam no mesmo passo do IK em Play.

## Componentes

| Componente | Vai no objeto | O que faz | Como dispara |
|---|---|---|---|
| Reação a impacto | osso atingido (peito, cabeça, braço) | Gira o osso e N ossos acima para longe do golpe e volta no tempo de **Recuperação**. | Colisão sólida do objeto (opção **Reagir a colisões**) ou método \`hit(direção, força)\`. |
| Recuo | ponta da arma ou mão | Levanta a cadeia no eixo do cano e recua a base; disparos se somam. | Método \`fire(intensidade)\` ou Conexão de evento **Recuo: disparar**. |
| Inércia | osso com filho (cauda, orelha, antena) | A ponta segue a pose por uma mola (**Rigidez**, **Amortecimento**, **Desvio máximo**). | Contínuo em Play. |
| Amplificador | qualquer osso | Exagera a rotação animada em relação à pose do início do Play. | Contínuo. |
| Inclinação do corpo | coluna ou pelve | Inclina para dentro da curva conforme a velocidade de giro do personagem. | Contínuo. |
| Poser de mão | mão, garra, pinça | Copia as rotações locais de uma hierarquia de referência, casando filhos pela ordem. | Contínuo; também usado pela interação. |
| Evitar penetração | ponta com IK de dois ossos ou de cadeia | Raio da raiz do membro ao alvo; havendo colisor no caminho, o alvo para na superfície com a **Folga**. | Contínuo, pela física real do Play. |
| Objeto interagível | o objeto (caixa, alavanca, arma) | **Ponto de pegada**, **Pose da mão**, tempos de alcançar/soltar e **Pegar ao alcançar**. | Lido pelo sistema de interação. |
| Sistema de interação | raiz do personagem | Leva a mão até o objeto com IK de dois ossos, aplica a pose da mão e, se configurado, passa o objeto para a mão. | Métodos \`start(mão, objeto)\` e \`stop(mão)\`; eventos **Alcançou** e **Soltou** (também nas Conexões de evento). |
| IK de corpo inteiro | raiz do personagem | Até quatro pontas com alvo; alvo além do alcance puxa a **Pelve** (limitada) e depois os membros são resolvidos. | Contínuo. |

**Ordem por quadro:** amplificador → grounder do corpo → corpo inteiro → membros e pés (com evitar penetração) → interação → poser → mira → olhar → inclinação → inércia → golpes e recuos → dedos → torção → limites. Tudo parte da pose do quadro; desativar devolve a pose anterior na hora.

## Exemplo em C#

\`\`\`csharp
// owner: o GameObject do personagem; rightHand e crate: ObjectReference.
var interaction = owner.GetComponent<InteractionSystem>();
interaction.Start(rightHand, crate);   // true se a mão e o objeto servem
interaction.OnReached(this, e => { /* a mão chegou */ });
interaction.Stop(rightHand);           // solta e larga a caixa
weapon.GetComponent<Recoil>().Fire(1); // um disparo com os valores autorados
\`\`\`

## Limites conhecidos

- **IK de corpo inteiro** puxa só a pelve (translação) e resolve membros de dois ossos; não há rotação de tronco nem árvore FABRIK genérica (FABRIK Root) — ficam pesquisadas, não implementadas.
- **Interação** usa membros de dois ossos; segurar com as duas mãos exige duas chamadas \`start\`. Objeto com corpo físico dinâmico não pode ser pego (a física é dona da pose) e gera diagnóstico.
- **Reação a impacto** por Conexão de evento não existe (o golpe precisa de direção); use a opção de colisão ou script.
- **VRIK** continua condicionado a tracking XR real (N14).
`,
};
