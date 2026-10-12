export const developmentOctober11IkGuide = {
  route: 'pt-br/desenvolvimento/2026-10-11/ik-e-constraints',
  title: 'Desenvolvimento: IK, grounder e constraints (N04)',
  description: 'Família completa de IK da Astra: dois ossos, cadeia CCD/FABRIK, Look At, Aim, limites de rotação, grounder do corpo, apoio do pé, dedos, offset e torção; assistente de IK, fixar ponta e seguir pai no estúdio. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **11/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como **Astra Dev**. Não é um APK público; o download público continua **0.3.0-preview.20261009/code 28**.
:::

## Onde fica

- **Componentes:** em **Adicionar componente → Lógica → IK**. Todos têm inspector, salvam na cena, aparecem no viewport com ícone próprio e rodam em **Play**.
- **Estúdio de animação:** aba **IK** do inspector (à direita) com IK no viewport, assistente, IK permanente, fixar ponta e seguir pai.
- **Scripts C#:** os mesmos componentes estão na API gerada (\`TwoBoneIk\`, \`ChainIk\`, \`LookAtIk\`, \`AimIk\`, \`RotationLimit\`, \`GrounderBody\`, \`FootGrounding\`, \`FingerCurl\`, \`IkOffset\`, \`TwistRelaxer\`).

## Componentes

| Componente | Vai no objeto | O que faz |
|---|---|---|
| IK de dois ossos | ponta (mão, pé, pinça) | Leva a ponta ao **Alvo** girando os dois ossos acima; **Direção da dobra** escolhe para onde o joelho/cotovelo aponta; opção de a ponta seguir a rotação do alvo. |
| IK de cadeia | ponta de uma cadeia longa | **CCD** ou **FABRIK** em N ossos, com iterações e tolerância; informa quando não converge. |
| Look At IK | cabeça | Coluna e cabeça olham para o alvo; **Peso do corpo** se divide pela coluna, **Peso da cabeça** é próprio; **Ângulo máximo** limita o giro. |
| Aim IK | arma, ferramenta, mão | Gira N ossos para o eixo escolhido apontar ao alvo; a queda do peso deixa a base mais firme. |
| Limite de rotação | qualquer osso | Dobradiça (eixo, mínimo, máximo) ou cone; aplicado depois dos solvers aos ossos que eles escreveram. |
| Apoio do pé | pé ou pata | Raio pela física real apoia o pé, inclina na rampa e resolve a perna; sem chão no alcance, mantém a pose animada (fase aérea). |
| Grounder do corpo | raiz do personagem | Usa os Apoios do pé da hierarquia e desce a **Pelve** o necessário para o pé mais baixo tocar o chão (bípede ou quadrúpede). |
| Curvatura de dedo | base do dedo | Fecha/abre a cadeia do dedo no eixo local (valor animável de −1 a 1). |
| Offset de efetor | ponta com IK | Desloca o alvo do IK desta ponta. |
| Relaxar torção | antebraço | Absorve parte da torção do pulso, mantendo a mão no lugar. |

**Ordem por quadro em Play:** animação → constraints → grounder do corpo → membros e pés → mira → olhar → dedos → torção → limites. O peso sempre parte da pose do quadro (não acumula); desativar devolve a pose anterior na hora. Alvo ausente, cadeia curta, alvo fora do alcance e falta de chão viram diagnóstico, sem NaN e sem esticar osso.

## No estúdio (aba IK)

1. **Assistente de IK:** reconhece mãos, pés, pelve e cabeça pelos nomes da hierarquia (inglês e português, com sufixos numéricos), trata patas dianteiras na altura do chão como pés e cria tudo numa operação — um **Desfazer** remove tudo.
2. **IK de dois ossos no viewport:** selecione a ponta, arraste o alvo âmbar; o losango no joelho define a dobra. Grava com Auto-key.
3. **IK permanente nesta ponta:** cria o componente com alvo e direção como objetos reais.
4. **Fixar ponta no intervalo:** a ponta fica parada no mundo enquanto o corpo se move, gravada como chaves FK a 30 Hz (usa o intervalo da timeline ou o clipe inteiro).
5. **Seguir pai (Child-Of):** **Definir como pai** num osso/objeto, depois selecione outro e toque **Seguir pai** — ele acompanha mantendo a distância, gravado em chaves.

## Atualizado em 12/10/2026

- **Fixar ponta** reavalia o clipe gravado e corrige quadro a quadro (até 3 passes); o resumo mostra o desvio máximo. Com o membro alcançável, o desvio medido fica abaixo de 2 mm.
- **Prioridade** nos IKs de dois ossos, de cadeia, Look At e Aim decide a ordem dentro de cada etapa.
- **Assistente de IK** também lê esqueletos sem nomes pela estrutura.
- Corpo inteiro com tronco, FABRIK em árvore, Corpo por alvos (VRIK), interação e reações estão no guia [Efeitos de IK e interação](/pt-br/desenvolvimento/2026-10-12/ik-efeitos-e-interacao/).
`,
};
