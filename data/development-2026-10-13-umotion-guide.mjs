export const developmentOctober13UMotionGuide = {
  route: 'pt-br/desenvolvimento/2026-10-13/umotion-ik-plano-rotativo-filho-de',
  title: 'Desenvolvimento: projetos UMotion Pro, IK de plano rotativo, Filho de animado e ordens Euler',
  description: 'Importa um projeto UMotion Pro (.asset) como rig editável: clipes com as curvas originais, alvos de IK, IK de plano rotativo de dois ossos e de cadeia, Filho de com pai animado, mistura FK/IK, camadas e eventos. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **13/10/2026** na branch de desenvolvimento, instalada no aparelho do proprietário como Astra Dev. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## Importar um projeto UMotion Pro

Os projetos do UMotion Pro (\`.asset\` de projeto, não o \`.anim\` exportado) guardam o rig como foi animado: FK de cada osso com as curvas originais, alvos de IK, IK e Child-Of. A Astra lê esse arquivo e monta o mesmo rig com os próprios componentes.

1. **Cena → Biblioteca de pacotes → Importar pasta** e escolha a pasta do pacote (por exemplo, \`UMotionExamples\`). Os projetos UMotion aparecem como clipes, com a ação **Aplicar**.
2. Prepare o modelo do personagem (o \`Robot Kyle.fbx\` do pacote entra direto) e coloque-o na cena.
3. Selecione a **raiz do personagem** na cena.
4. Abra o projeto UMotion na Biblioteca. A engine cria:
   - um **clipe por clipe do projeto** em \`Clipes/\`, com as chaves do UMotion convertidas uma a uma (quaternion progressivo, quaternion, Euler; tangentes e pesos). Rotações em modo Euler entram como trilha **Euler ZXY** com os ângulos originais;
   - os **objetos auxiliares** que não existem no modelo (alvos de IK, objetos de cena como a caixa);
   - **IK de plano rotativo** no osso da ponta de cada cadeia;
   - **Filho de** nos objetos com Child-Of, com o pai como canal animado;
   - canais de **mistura FK/IK** e **rotação do polo**, camadas e eventos (como cues);
   - o componente **Animation** no personagem, tocando o primeiro clipe. Outras animações do personagem que tocavam sozinhas (o take embutido de um FBX) deixam de iniciar sozinhas, para não disputar os mesmos ossos.

A conversão do espaço da Unity para o da Astra (espelho, escala, ordem dos eixos e o referencial de cada osso) é estimada pela pose de repouso. Se o modelo não corresponder ao rig do projeto, a importação recusa e informa o erro.

## IK de plano rotativo

**IK de dois ossos → Solver: Plano rotativo** e **IK de cadeia → Solver: Plano rotativo**. É o solver do UMotion (e do RP solver do Maya):

- **Referência**: a cadeia parte da *Pose de repouso* ou da *Animação*.
- **Ângulo do plano**: gira o plano da dobra em torno do eixo raiz→ponta. O zero é perpendicular ao segundo osso no repouso.
- **Direção da dobra** (opcional): o plano aponta para esse objeto.
- **Rotação do polo**: gira a cadeia resolvida em torno do eixo raiz→alvo.
- **Peso**: mistura cada osso da animação para o IK por rotação.
- **Zero do plano** (X, Y, Z): direção do zero do ângulo no espaço do osso raiz. Zerado, usa a perpendicular do osso do meio no repouso. A importação grava a direção exata do UMotion, independente dos eixos locais do modelo (FBX ou GLB).
- **Desvio da rotação do alvo** (X, Y, Z): rotação somada à do alvo quando a ponta segue o alvo, como o *Maintain Target Offset* da Unity.
- **Ponta segue rotação do alvo**: copia a rotação do alvo; desligado, a ponta usa a rotação da animação.

Cadeias de três ossos usam a solução analítica; cadeias maiores, um CCD restrito ao plano. Todos os números dos componentes de IK passaram a ser **animáveis** em clipes.

## Fluxo completo pelo editor (tutorial)

A mesma cena do PickUp sai inteira da interface, sem arquivos preparados fora do app:

1. **Projetos → Novo projeto** e digite o nome. O "Concluído" do teclado já cria o projeto.
2. **Cena → Biblioteca de pacotes → Importar pasta** e escolha a pasta do pacote. Scripts da Unity que vierem no pacote ficam preservados na Biblioteca, fora da compilação do projeto.
3. **Robot Kyle.fbx → Na cena.** O FBX entra com o nome do arquivo e com as texturas do pacote ligadas (cor base e normal), procuradas ao lado da fonte e pelo nome dentro do pacote.
4. **PickUpAnimation.asset → Aplicar.** Sem seleção, o projeto vai para o único personagem da cena.
5. **Criar objeto → Geometria → Chão** e **Básicos → Câmera**.
6. Enquadre a vista e use **Alinhar** no componente Câmera, ou **Alinhar com a vista** no menu de ações de qualquer objeto. **Prévia** mostra o que o Play vai ver.
7. **Play.**

O editor mantém a tela acesa enquanto está aberto.

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

- **FBX texturizado** não podia ser publicado: o histórico recusava qualquer modelo FBX com textura. Agora as texturas entram na conta de memória do histórico.
- **FBX com skin dual quaternion** (o \`Robot Kyle.fbx\` do pacote) era recusado. Agora é deformado em mistura linear com os mesmos pesos, como na Unity, com aviso no relatório. O preparo de modelo no Android também não manda mais FBX para o empacotador de glTF, que exibia "O JSON do glTF está mal formado".

## Validação

- Teste sintético no host (sem arquivos privados): rig espelhado, alvo de IK animado, troca de pai e evento. Um segundo cenário importa uma rotação Euler do UMotion e confere as chaves originais, a ordem ZXY e a pose igual à da Unity espelhada (abaixo de 0,05°).
- As seis ordens Euler compõem as rotações de eixo na sequência declarada e voltam aos mesmos ângulos. O bake ZXY → XYZ preserva a orientação.
- Robot Kyle com o projeto **PickUp** do UMotion Pro de exemplo: repouso corresponde com erro de 0,00004%. A caixa segue a curva exportada pelo próprio UMotion com décimos de milímetro fora das mãos e até 9 mm enquanto presa a uma mão.

### Limite conhecido

O PickUp é um projeto **Humanoid**: a curva exportada passou pelo retargeting por músculos da Unity, que distribui a torção do antebraço (\`armTwist\`/\`foreArmTwist\` = 0,5). O espaço de músculos da Unity (Avatar Humanoid) é o próximo bloco; com ele vêm também os clipes \`.anim\` humanoides dos pacotes.
`,
};
