export const developmentOctober13UMotionGuide = {
  route: 'pt-br/desenvolvimento/2026-10-13/umotion-ik-plano-rotativo-filho-de',
  title: 'Desenvolvimento: projetos UMotion Pro, IK de plano rotativo, Filho de animado e ordens Euler',
  description: 'Importa um projeto UMotion Pro (.asset) como rig editável: clipes com as curvas originais, alvos de IK, IK de plano rotativo de dois ossos e de cadeia, Filho de com pai animado, mistura FK/IK, camadas e eventos. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **13/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como Astra Dev. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## Importar um projeto UMotion Pro

Os projetos do UMotion Pro (\`.asset\` de projeto, não o \`.anim\` exportado) guardam o rig como foi animado: FK de cada osso com as curvas originais, alvos de IK, IK e Child-Of. A Astra lê esse arquivo e monta o mesmo rig com os próprios componentes.

1. Importe a pasta do pacote na **Biblioteca**; o projeto UMotion aparece como clipe, com o diagnóstico "Projeto UMotion Pro".
2. Selecione a **raiz do personagem** na cena (o modelo já importado).
3. Abra o item. A engine cria:
   - um **clipe por clipe do projeto** em \`Clipes/\`, com as chaves do UMotion convertidas uma a uma (quaternion progressivo, quaternion, Euler; tangentes e pesos). Rotações em modo Euler entram como trilha **Euler ZXY** com os ângulos originais;
   - os **objetos auxiliares** que não existem no modelo (alvos de IK, objetos de cena como a caixa);
   - **IK de plano rotativo** no osso da ponta de cada cadeia;
   - **Filho de** nos objetos com Child-Of, com o pai como canal animado;
   - canais de **mistura FK/IK** e **rotação do polo**, camadas e eventos (como cues);
   - o componente **Animation** no personagem, tocando o primeiro clipe.

A conversão do espaço da Unity para o da Astra (espelho, escala, ordem dos eixos e o referencial de cada osso) é estimada pela pose de repouso. Se o modelo não corresponder ao rig do projeto, a importação recusa e informa o erro.

## IK de plano rotativo

**IK de dois ossos → Solver: Plano rotativo** e **IK de cadeia → Solver: Plano rotativo**. É o solver do UMotion (e do RP solver do Maya):

- **Referência**: a cadeia parte da *Pose de repouso* ou da *Animação*.
- **Ângulo do plano**: gira o plano da dobra em torno do eixo raiz→ponta. O zero é perpendicular ao segundo osso no repouso.
- **Direção da dobra** (opcional): o plano aponta para esse objeto.
- **Rotação do polo**: gira a cadeia resolvida em torno do eixo raiz→alvo.
- **Peso**: mistura cada osso da animação para o IK por rotação.
- **Ponta segue rotação do alvo**: copia a rotação do alvo; desligado, a ponta usa a rotação da animação.

Cadeias de três ossos usam a solução analítica; cadeias maiores, um CCD restrito ao plano. Todos os números dos componentes de IK passaram a ser **animáveis** em clipes.

## Ordem Euler das trilhas de rotação

Trilhas **Euler** guardam um ângulo por eixo (X, Y, Z) e uma **ordem de composição**: XYZ (padrão da cena), XZY, YXZ, YZX, ZXY (a da Unity) ou ZYX. A ordem é nomeada pela aplicação: ZXY gira em Z, depois em X e por último em Y. Cada trilha também pode ter um **referencial**, que é uma orientação fixa antes e depois dos ângulos. A importação UMotion usa o referencial para absorver a diferença entre os espaços da Unity e da Astra, mantendo na curva os mesmos números vistos no UMotion.

- A lista de canais do editor de clipes mostra a ordem quando ela não é XYZ (por exemplo, *Euler ZXY*). O sufixo *· ref.* indica um referencial importado.
- Gizmo, IK de pose, ferramentas de pose, rig e estúdio calculam os ângulos na ordem e no referencial da própria trilha, no ramo mais próximo do valor atual.
- **Bake → Euler → Ordem** troca a ordem: as curvas são reconstruídas pela mesma orientação, com verificação do erro e o referencial mantido.
- Clipes salvos por esta revisão usam o formato **AECLIP 8**. Arquivos anteriores abrem como XYZ, sem referencial.

## Filho de (Child-Of)

Componente **Filho de**: troca o pai do objeto durante a animação, sem mudar a hierarquia. Os canais locais do objeto valem no espaço do **Pai** escolhido. **Fixo no personagem** usa a raiz do personagem (IK pinning). O Pai é um **canal discreto** do clipe (referência de objeto animável), aplicado antes do IK, para alvos fixos, e de novo depois, para objetos presos a uma mão já resolvida.

## Correções desta revisão

- **Enquadrar** um personagem importado com armadura em escala 0,01 (Robot Kyle) afastava a câmera a ~300 m. Os limites da malha deformada aplicavam duas vezes a escala do bind. Agora a câmera fica a ~5 m, centrada no corpo.
- O cubo do projeto de exemplo saía 100× menor, e o visual dele vinha com corpo físico, o que impedia o **Filho de** de mover o objeto. Agora a caixa tem o tamanho do projeto e só aparência.
- Camadas aditivas do UMotion: o delta de rotação é conjugado pelo referencial do osso. Antes era convertido como pose absoluta.
- **IK e Filho de em loop**: a partir do segundo ciclo, a caixa congelava e os braços saltavam até 60 cm. Cada passo do IK decompunha a matriz do osso, e o ruído de ponto flutuante virava uma escala não uniforme que voltava como entrada do quadro seguinte, até a pose ser recusada. Agora a rotação é aplicada como quaternion, com posição e escala locais preservadas. Em 8 ciclos a pose repete a do primeiro com diferença de 0,1 mm.

## Validação

- Teste sintético no host (sem arquivos privados): rig espelhado, alvo de IK animado, troca de pai e evento. Um segundo cenário importa uma rotação Euler do UMotion e confere as chaves originais, a ordem ZXY e a pose igual à da Unity espelhada (abaixo de 0,05°).
- As seis ordens Euler compõem as rotações de eixo na sequência declarada e voltam aos mesmos ângulos. O bake ZXY → XYZ preserva a orientação.
- Robot Kyle com o projeto **PickUp** do UMotion Pro de exemplo: repouso corresponde com erro de 0,00004%. A caixa segue a curva exportada pelo próprio UMotion com décimos de milímetro fora das mãos e até 9 mm enquanto presa a uma mão.

### Limite conhecido

O PickUp é um projeto **Humanoid**: a curva exportada passou pelo retargeting por músculos da Unity, que distribui a torção do antebraço (\`armTwist\`/\`foreArmTwist\` = 0,5). O espaço de músculos da Unity (Avatar Humanoid) é o próximo bloco; com ele vêm também os clipes \`.anim\` humanoides dos pacotes.
`,
};
