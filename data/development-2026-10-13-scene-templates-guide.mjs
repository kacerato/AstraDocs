export const developmentOctober13SceneTemplatesGuide = {
  route: 'pt-br/desenvolvimento/2026-10-13/modelos-de-cena-e-carregar',
  title: 'Desenvolvimento: modelos de cena de animação e carregar com as duas mãos',
  description: 'Seis cenas prontas para estudar IK, apoio, interação e locomoção; joystick do Play ligado ao Personagem seguido pela câmera; pegada com as duas mãos (agachar, levantar, carregar) em qualquer humanoide importado. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **13/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como Astra Dev. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## Modelos de cena

**Criar objeto → Básicos → Modelo de cena.** Cada modelo monta um cenário completo na cena aberta, já com os componentes reais ligados (os mesmos da autoria manual), as vistas salvas e a exposição do dia. Um único **Desfazer** remove tudo. Os cartões mostram a família, o que o cenário entrega e quantos objetos, componentes e vistas serão criados.

| Modelo | O que testa |
|---|---|
| Cenário de referência | Interior e exterior, escala humana, vistas salvas. |
| Manequim com IK e apoio | Mão até o alvo (IK de dois ossos), olhar, pés apoiados (um sobre o bloco) e pelve ajustada. |
| Quadrúpede com grounder | Quatro patas na rampa, pelve ajustada, cauda com inércia. |
| Braço mecânico com IK de cadeia | Quatro segmentos por FABRIK até o alvo, limite de rotação na base. |
| Interação: pegar a caixa | Sem script: ao dar Play a mão alcança a caixa e a pega. |
| Carregar com as duas mãos | Sem script: agacha, pega a caixa com as duas mãos e a leva junto ao corpo. |
| Personagem jogável | Corpo visível, câmera seguidora, rampa, degraus e passagem baixa. |

Os modelos são feitos de cubos autorais e funcionam num projeto vazio. O painel mostra seis cartões por página, com setas no cabeçalho, entre a barra de ferramentas e a barra de navegação da vista. O modelo "Carregar com as duas mãos" tem ícone próprio no atlas.

## Joystick do Play

No Play do editor, o joystick flutuante aparece onde o dedo pousa (metade esquerda) e o botão **Saltar** fica no canto. O movimento vai para o **Personagem seguido pela câmera** (ancestral da câmera, alvo da Câmera seguidora ou a seleção). Antes, a cena só respondia se o Personagem estivesse selecionado.

## Carregar com as duas mãos

Referência: Final IK 2.2, demo *Interaction Pick Up 2-Handed*. Na Astra tudo é componente:

- **Objeto interagível**: *Ponto de pegada* (primeira mão), **Pegada da 2ª mão**, **Ponto de carregar** e **Tempo para levantar**. Com Ponto de carregar, quando as duas mãos chegam o objeto passa a ser filho do personagem e sobe até o ponto; as mãos ficam presas às pegadas enquanto ele é carregado. Soltar as duas mãos devolve o objeto ao pai original.
- **Sistema de interação**: **Segunda mão ao iniciar** (duas mãos sem script), **Pelve** com **Agachar até** e **Peito** com **Inclinar o tronco**. O corpo agacha só o que falta ao braço para alcançar a pegada; com Apoio do pé nos pés, os joelhos dobram em vez de os pés afundarem.
- Evento novo **Levantou** (*picked*), disponível em Conexões de eventos como "Interação: objeto levantado".

### Ossos humanoides preenchidos ao adicionar o componente

Não existe atalho para uma situação única: a interação é montada com os componentes de sempre, em qualquer personagem. Para poupar a escolha osso a osso, ao **adicionar** Sistema de interação, IK de corpo inteiro ou Grounder do corpo a um humanoide, a engine preenche os campos vazios (pelve, peito, mãos, pés e o número de ossos do braço) reconhecendo os ossos pelo nome, como o *Automap* do Avatar da Unity: Robot Kyle (\`Left_Wrist_Joint_01\`, \`Hip\`, \`Ribs\`), Mixamo (\`LeftHand\`, \`Spine2\`), Blender (\`hand.L\`) e os modelos da Astra. Campos já escolhidos não são trocados.

Montagem manual de uma pegada com as duas mãos: crie a caixa (uma pasta com o visual dentro), duas pastas filhas nas laterais (as pegadas) e uma pasta no personagem (o ponto de carregar). Na caixa, adicione **Objeto interagível** e escolha *Ponto de pegada*, *Pegada da 2ª mão* e *Ponto de carregar*. No personagem, adicione **Sistema de interação** e escolha as duas mãos e o objeto em *Início sem script* (ou chame \`start(mão, objeto)\` duas vezes por script).

### Limites declarados

- A animação **PickUp.anim** do UMotion Pro é *Humanoid* (curvas de músculo). O importador de clipes Unity aceita apenas curvas Transform genéricas e *blend shapes*; a conversão de músculos ainda não existe. O movimento de pegar vem do IK e da pose de corpo descrita acima, sobre a animação que o personagem já toca.
- Dedos não fecham sozinhos ao pegar; use *Pose da mão* do Objeto interagível ou Dobra de dedos.
`,
};
