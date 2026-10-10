export const developmentOctober10Guide = {
  route: 'pt-br/desenvolvimento/2026-10-10/autoria-e-biblioteca',
  title: 'Desenvolvimento: poses, curvas, intervalos e biblioteca',
  description: 'Comparação de curvas, autoria temporal, ciclos e poses ABI 10; biblioteca de fontes, texturas e materiais. Revisão separada dos APKs e do restante do plano N01–N16.',
  body: `:::caution[Revisão em desenvolvimento]
Esta página acompanha a implementação iniciada em **10/10/2026**, na branch de desenvolvimento da engine. **Não é um novo APK** e não amplia o aceite físico da Dev code 33. O APK público continua **0.3.0-preview.20261009/code 28**. ADB e o aceite Android desta revisão aguardam a liberação do proprietário no final da implementação do plano inteiro.
:::

## O que esta revisão permite

Editar um trecho inteiro do clipe e trabalhar com eventos/marcadores em grupo pela timeline. A interface e os comandos C# usam o mesmo recurso, sampler e histórico. Os ícones novos fazem parte do atlas executável; uma imagem conceitual não é evidência de interface implementada.

O plano tem **16 blocos**, o índice UMotion com **75 páginas** e **91 famílias** do atlas. Este pacote amplia partes de N01/N07/N08. Não encerra esses blocos nem anuncia equivalência com UMotion, FinalIK ou BoZo.

## Selecionar e editar vários eventos

1. Abra o clipe no Animation Studio e escolha **Eventos**, na barra inferior.
2. Ative **Seleção**, com o ícone de grupo. Arraste uma caixa pelas linhas Eventos e Marcadores. **Somar** conserva a seleção anterior ao acrescentar pontos. Como alternativa, abra **Editar → Selecionar todos os cues**.
3. Arraste um ponto selecionado para mover o grupo. Soltar publica uma operação de Undo; cancelar restaura o recurso, o grupo e o ponto principal.
4. Na faixa contextual, **Mover · s** desloca o grupo. **Escala** usa o cursor como pivot e exige fator positivo: 2 dobra a distância de cada cue até o cursor. Se algum instante sair do clipe, toda a operação é recusada.
5. Em **Editar**, use Copiar, Recortar e Colar cues no cursor. A colagem conserva as distâncias entre pontos, códigos, valores, sentidos e ativação, atribuindo novas identidades. Não substitui automaticamente outro evento coincidente.
6. **Opções → Duplicar grupo** repete os pontos nos mesmos instantes com novas identidades. Excluir e Ativo atuam no grupo; avanço/reverso têm efeito nos eventos. Undo restaura a operação inteira.

Um cue é um evento ou marcador do clipe. Marcadores não executam gameplay. Preview e scrub continuam sem callbacks; o runtime Animation/Animator mantém os contratos descritos no [guia de clipes](/pt-br/snapshot-2026-10-07/sistemas/animation-clips/).

## Mover e duplicar um trecho, inserir e remover tempo

Abra **Editar → Intervalo**, no cabeçalho da folha. A superfície substitui temporariamente a tarefa de edição; não acrescenta um painel fixo ao viewport.

Defina **Início**, **Fim** e **Destino** em segundos. O intervalo exige início menor que fim, dentro da duração. A faixa realçada aparece também ao alternar entre chaves, curvas e cues.

| Ação | Resultado e fronteira |
|---|---|
| Mover trecho | Desloca as chaves, cues e referências do intervalo para Destino, conservando a duração do clipe. Inclui o ponto final apenas quando Fim é a duração. Recusa cruzamento ou colisão com chaves fora da seleção e qualquer saída dos limites; não apaga nem desloca automaticamente os dados do destino. |
| Duplicar trecho | Recorta as curvas de todas as camadas, incluindo amostras nas fronteiras; copia cues em [início,fim). O cue no fim é incluído quando esse fim é o final do clipe. Insere no destino a duração do trecho mais um quadro da taxa de exibição. |
| Inserir tempo | Insere no destino a duração Fim − Início. Chaves, cues e referências aditivas nesse instante ou depois avançam juntas. Segmentos que cruzam a fronteira ficam mais longos: não é um hold nem bake da pose. |
| Remover [início,fim) | Apaga chaves/cues nesse intervalo; o ponto em Fim sobrevive deslocado para Início. A duração diminui. Recusa cortes que esvaziem um canal ou removam uma referência aditiva. |

Duplicar conserva as curvas autorais de cada camada; não congela o resultado composto. A referência aditiva continua pertencendo à camada. Para obter outro resultado de composição, use o bake/consolidação apropriado.

Exemplo: em um clipe de 4 s a 30 quadros/s, duplicar [0,25;1,25) no destino 3 s acrescenta **1 + 1/30 s** à duração. O quadro de separação conserva a última pose copiada e a pose antiga da fronteira. Todos os dados posteriores acompanham a inserção.

Cada operação é atômica e possui um Undo. Não altera o formato **AECLIP 4**. Salve uma cópia antes de usar uma revisão nova; o APK público antigo não lê esse formato.

## Fechar e repetir ciclos

Na folha **Intervalo**, a tarefa **Ciclo** mantém Início/Fim e oferece quantidade
de cópias e tolerância. **Início → fim** copia a pose inicial de cada canal e
camada para a fronteira final. É uma alteração explícita com Undo, que fecha
valores/pose (continuidade C0); não corrige velocidade, aceleração ou root motion.

**Repetir** exige fronteiras coincidentes em todos os canais, inclusive camadas
silenciadas ou com peso zero. A tolerância usa a unidade da propriedade; em
quaternion, distância angular em graus. Um canal aberto recusa a operação inteira
e informa a diferença. São permitidas de 1 a 64 cópias adicionais, sujeitas aos
limites de duração e quantidade de chaves.

Os ciclos ficam contíguos, sem o quadro extra de Duplicar trecho. Os cues de cada
ciclo usam **[início,fim)**; o cue na fronteira final original acompanha o fim do
último ciclo. Chaves posteriores, duração e referências aditivas avançam juntas.

![Tarefa Ciclo executável em landscape baixo](/assets/development-2026-10-10/timeline-cycle-655.png)

Captura CPU dos controles nativos em 655×300; não demonstra malha Vulkan ou
aceite no Android.

## Alinhar e distribuir uma seleção

Selecione chaves ou cues antes de abrir **Intervalo → Organizar**. Alinhar início,
fim ou centro desloca a seleção de cada canal como um bloco até Destino, mantendo
as distâncias internas. Cues selecionados formam outro bloco. Distribuir ordena
os instantes distintos e os espaça entre Início/Fim; coincidências permanecem
coincidentes. Valores e identidades são preservados, e quaternion mantém seus
componentes sincronizados.

Uma colisão com chave fora da seleção, cruzamento ou saída do clipe recusa toda
a mudança. Essas operações reorganizam o tempo autoral; não são normalização
visual de curvas nem bake da composição.

![Organização temporal pela superfície contextual](/assets/development-2026-10-10/timeline-arrange-655.png)

## Comparar curvas e editar na unidade original

No modo **Curvas**, abra **Vista** no cabeçalho. A folha temporária alterna
**Vista** e **Comparar**. Ela ocupa a região necessária durante a configuração;
fechar devolve o gráfico inteiro, sem acrescentar outro painel permanente.
**Nome** continua permitindo renomear o clipe nesse modo.

Em Comparar, **Fixar ativo** conserva uma referência ao canal selecionado.
É possível fixar até oito canais de camadas diferentes. A lista identifica
camada, alvo e propriedade; toque em uma referência para torná-la editável.
Referências tracejadas não recebem chaves ou handles interativos. **Limpar**
remove os pins; fechar ou trocar o clipe libera esse estado transitório.

![Comparação identificada de posição e escala](/assets/development-2026-10-10/curves-compare-655.png)

Em Vista, **Normalizar visual** apresenta cada canal no eixo **n**, usando sua
própria faixa de valores. Isso permite comparar posição e escala com amplitudes
diferentes. A transformação inversa mantém a edição na unidade original:
o campo numérico continua mostrando metros, graus ou o valor próprio do canal.
**Isolar ativo** esconde temporariamente as referências.

**Enquadrar canais** considera extremos entre chaves, inclusive overshoot de
curvas cúbicas; **Enquadrar seleção** limita o intervalo temporal aos pontos
selecionados. Valor e Tempo têm zoom e deslocamento independentes. Essas ações
não reescrevem o recurso e não acrescentam Undo. Arrastar uma chave ou handle
continua sendo uma edição autoral, com um Undo ao publicar e restauração ao cancelar.

![Navegação independente de tempo e valor](/assets/development-2026-10-10/curves-view-655.png)

![Gráfico normalizado com valor numérico autoral](/assets/development-2026-10-10/curves-normalized-655.png)

As capturas mostram a interface nativa executável em 655×300, rasterizada no
host. Curvas muito densas têm representação gráfica limitada por orçamento;
os dados e a edição numérica conservam todas as chaves. Não são imagens da malha
Vulkan ou aceite físico Android. Pins e faixas visuais não alteram AECLIP 4 ou ABI 10.

## Gravação, travas e reutilização de pose

No modo **Pose**, abra o ícone **Autoria de pose** junto de Gravar e Cancelar.
A folha temporária alterna **Gravação**, **Reutilizar** e **Seleção**; fechar devolve a região
à prévia. O estado sem gravar permanece visível e não modifica o repouso da cena.

![Gravação e política de Auto-key na interface nativa](/assets/development-2026-10-10/pose-tools-record-655.png)

Em Gravação, **Auto-key** controla a publicação automática ao terminar a edição.
**Só canais existentes** recusa a criação implícita; **Criar canais** permite
preparar canais ausentes. Adicionar um canal explicitamente continua sendo uma
ação de autoria distinta. **Intervalo** arma início/fim inclusivos: fora dele,
Auto-key mantém o rascunho e explica a recusa. **Gravar** publica explicitamente,
inclusive fora desse intervalo.

As travas atuam em **XYZ local**. Para rotações quaternion/progressivas são
ângulos locais, nunca componentes XYZW; Euler preserva valores e voltas.
Morph usa índices com paginação a cada três componentes. Todos os eixos
travados recusam a alteração; **Liberar** remove as travas do canal atual.

Em Reutilizar, escolha **Copiar local** ou **Copiar mundial** antes de Copiar.
A ação Colar informa o espaço realmente guardado no clipboard. Cópia local
guarda o canal e sua representação; colagem incompatível exige conversão
explícita. Cópia mundial guarda TRS completo avaliado na Base e resolve o pai
do destino; matriz singular, shear ou política que proíbe canais necessários
recusa a operação inteira. Morph usa cópia local.

![Reutilização de pose e espaço de cópia](/assets/development-2026-10-10/pose-tools-reuse-655.png)

**Referência da cena** lê o transform/pesos autorais; não afirma recuperar a
bind pose do rig. **Identidade local** usa translação/rotação zero, escala um
e pesos zero. Ambos respeitam travas e Auto-key. Cancelar e troca de instante
descartam apenas o rascunho. Trocar projeto limpa o clipboard.

## Seleção de poses e conjuntos

Na tarefa **Seleção**, use **Somar** para alternar membros no viewport ou na
árvore de alvos. A árvore substitui a folha para alcançar juntas sobrepostas.
**Pais**, **Filhos**, **Irmãos** e **Todos** usam relações da hierarquia real.
O alvo principal escolhe o canal e a camada. Um descendente já acompanhado
pelo pai selecionado recebe o movimento uma única vez.

Edição numérica e gizmo aplicam delta local ao grupo: diferença em posição,
Euler e morph, razão em escala e rotação relativa em quaternion. Cada canal
respeita as travas; canais ausentes dependem da política de criação. Dimensão,
representação ou escala incompatíveis recusam a operação inteira. Gravar
publica o grupo em uma revisão e um Undo. Reset de referência usa o valor
próprio de cada membro. Cópia local aplica delta; colar TRS mundial exige uma
única raiz selecionada e explica a recusa de grupos.

**Salvar** cria um conjunto nomeado, com Undo/Redo. Recuperar usa caminhos
relativos ao dono do clipe, incluindo nomes especiais. O mesmo clipe pode
recuperar a seleção em outra instância compatível. Caminho ausente ou ambíguo
preserva a seleção atual e apresenta diagnóstico. Há até 32 conjuntos por
clipe, 1024 por projeto e 256 alvos por conjunto, dentro do limite total de 1 MiB.
São preferências de autoria; não acrescentam estado de UI ao runtime.

**Foco** centraliza as origens selecionadas. **Isolar** na tarefa Seleção filtra
objetos e mantém descendentes e malhas deformadas pelos ossos selecionados.
É independente de inspecionar uma camada isolada. Fechar o preview libera a
seleção transitória e o isolamento; conjuntos salvos continuam no projeto.

![Seleção de poses, relações e conjuntos em 655×300](/assets/development-2026-10-10/pose-selection-655.png)

## SDK C#: o mesmo backend

A ABI de autoria **7** acrescenta InsertTime, RemoveTime, DuplicateRange, MoveRange, CopyCues, PasteCues, TransformCues e EraseCues. A **8** anexa ConfigureClipPoseRecording, ConfigureClipPoseLocks, ResetClipPose, CopyClipPose e PasteClipPose. A **9** anexa ClipPoseTargets, seleção/relações, foco/isolamento e Save/Recall/RemoveClipPoseSelection. A **10** acrescenta ClipArrange, ArrangeSelection, CloseRange e RepeatRange. Os tamanhos dos prefixos ABI 1–9 permanecem disponíveis. O SDK recusa as operações novas em um host antigo.

O exemplo é um comando completo. Exige um clipe com pelo menos 1,25 s; a mensagem de erro explica a pré-condição. A duração da inserção e da remoção é igual, restaurando o relógio antes de publicar a duplicação.

~~~csharp
using System;
using Astra.Editor;

public static class IntervalosDoClipe
{
    [EditorCommand("Duplicar trecho de clipe")]
    public static void Duplicar(EditorContext editor)
    {
        if (editor.Clips.Count == 0)
            throw new InvalidOperationException("Crie ou extraia um clipe primeiro.");
        using var edit = editor.BeginClip(editor.Clips[0]);
        if (edit.Snapshot.Duration < 1.25f)
            throw new InvalidOperationException("O exemplo exige ao menos 1,25 s.");
        edit.InsertTime(1f, .5f);
        edit.RemoveTime(1f, 1.5f);
        edit.DuplicateRange(.25f, 1.25f, 1.25f);
        edit.Commit();
    }
}
~~~

CopyCues recebe IDs do snapshot e devolve um ClipCueClipboard descartável. O clipboard pertence à invocação do editor e conserva double no payload. Dispose libera o handle; outra invocação, thread ou contexto não pode reutilizá-lo. Commit publica o rascunho inteiro; operações sem Commit são descartadas.

## Diagnóstico e recuperação

- **Referência aditiva dentro do corte:** mova explicitamente a referência para um instante que sobreviva ou reveja o corte. A operação recusada não remove dados.
- **Canal ficaria vazio:** conserve uma pose desse canal fora do intervalo ou remova o canal por sua ação própria.
- **Colagem ultrapassa a duração:** escolha outro cursor ou ajuste a duração primeiro. A tentativa não deixa metade do grupo no clipe.
- **Seleção/revisão mudou:** reabra o campo numérico; o contexto capturado já não representa o recurso atual.
- **Precisão ou limite excedido:** diminua a duração/quantidade e mantenha a escala temporal representável. Não há fallback que descarte eventos silenciosamente.

## Biblioteca local de pacotes

Abra **Destinos → Biblioteca → Importar pasta** e escolha a pasta do pacote no
seletor Android. A cópia informa progresso e permite cancelar; ao concluir,
o catálogo navega por pacote e tipo, com busca e filtros. Diagnósticos substituem
a lista quando precisam de espaço. A biblioteca não executa automaticamente
código ou plugins Unity importados.

![Rota nativa da Biblioteca em 655×300](/assets/development-2026-10-10/library.655x300.png)

Cada revisão preserva fontes, metadados e licença. Conteúdo diferente cria outra
revisão, inclusive quando os arquivos Unity conservam os mesmos GUIDs. Texturas
de um material são resolvidas dentro da revisão correspondente. O catálogo
registra origem, hash, receita, conversor, dependências, perdas e diagnóstico.
Estar preservado ou registrado não prova compatibilidade visual ou execução.

Undo de adicionar pacote retira sua entrada do catálogo e conserva os arquivos
e recursos. Redo recoloca a entrada. Um destino ocupado, fonte alterada durante
a cópia ou conflito de metadados recusa a publicação inteira.

A importação de pasta aceita até 4096 arquivos, profundidade 8; o índice aceita
128 pacotes e 65536 itens, limitado a 16 MiB. Esta revisão inclui texturas TGA
RGB/RGBA/grayscale, sem compressão ou RLE, com orientação e alpha respeitados.
As sete TGA fornecidas foram decodificadas no host. TIFF e conversores completos
de FBX, animação, prefab, controller e shader continuam trabalhos distintos.

Texturas abrem o importador focal com prévia preparada, interpretação, limites,
compressão e demais opções divididas em tarefas paginadas. Reimportar uma textura
em uso prepara suas bindings efetivas e publica os novos texels antes de
confirmar fonte, receita, índice e registro. Recusa do publicador restaura o
estado anterior. Undo/Redo conserva a mesma identidade e republica o conteúdo.
Se uma fonte legada foi alterada e sua cópia autoral anterior não está íntegra,
a operação é recusada em vez de prometer um Undo impossível.

![Importador focal com texels TGA e alpha preparados](/assets/development-2026-10-10/tga-focal.655x300.png)

Esta captura combina controles CPU e o atlas preparado pelo importador. O
cenário host verifica publicação/rollback pelos callbacks reais do editor;
isso não é uma captura da imagem Vulkan no Android.

## Material Unity: converter, vincular e reimportar

1. Selecione um arquivo **.mat** no navegador da engine e use **Converter material Unity**. A fonte é conservada; o recurso nativo irmão **.mat.material** abre no Inspector.
2. A conversão suporta **Unity Standard metálico** dentro do contrato declarado. Fatores e texturas compatíveis são convertidos para MaterialAsset. Texturas precisam de referências GUID resolvíveis pelos arquivos **.meta**. Normal e emissão respeitam as opções do material de origem.
3. Selecione o objeto e o slot desejados; no Inspector do recurso, use **Aplicar no slot**. As substituições locais do objeto continuam ativas. Para ver os valores compartilhados, use a ação de herança do slot.
4. **Prévia no objeto** enquadra a geometria real selecionada e seus filhos que usam esse recurso. Usa o caminho PBR existente, com câmera independente e orçamento próprio. Não altera a câmera principal. O ambiente vem da cena; substituições locais também aparecem na prévia.
5. Depois de editar a fonte, reimporte. A operação verifica o material nativo e os metadados antes de publicar. Undo/Redo restaura valores, receita e dependências juntos. Alterações locais ou externas conflitantes são recusadas; a mensagem informa a causa.

Shaders personalizados, Standard especular, mapas empacotados sem conversão equivalente e entradas incompatíveis produzem diagnóstico. Esta revisão não afirma equivalência visual entre os renderers Unity e Astra. Fontes ausentes, GUIDs duplicados e dependências inválidas impedem a publicação do material.

A ação de preview do objeto usa a geometria publicada e suas substituições locais.
O viewer **Material 3D** também permite examinar materiais ainda sem uso, com
esfera, caixa e plano próprios, câmera de órbita/zoom e recursos GPU separados
da cena. Material ou textura ainda não publicados produzem diagnóstico.
O backend de quatro samplers recusa oclusão separada sem equivalente; não
mascara a ausência. Capturas host de controles não demonstram a imagem PBR no
Android. Catálogo integral dos pacotes, FBX genérico e conversão completa de
animações/controllers/prefabs continuam em implementação de N07.

## Plano, rede e limites de aceite

N13 terá **servidor dedicado e sessão hospedada por jogador**, com autoridade do servidor nas duas modalidades. Esta é a decisão de produto registrada, não uma afirmação de implementação de rede neste pacote.

Continuam abertos no plano: regiões de marcadores, ampliação de rotação com consumidor completo, propriedades/drivers, rig/retargeting, IK, movimento, exportação, biblioteca integral, SDK multirrecurso, sequências, UI componível, modelagem, física, save/replay/rede, famílias de render e aceite integrado. Os fluxos desta revisão ainda dependem do aceite final integrado e Android. Os gates host, SDK, pacote, instalação, runtime e dispositivo são registrados separadamente.

## Referências da decisão

[Unity 6000.0: Editing Curves](https://docs.unity3d.com/6000.0/Documentation/Manual/EditingCurves.html)
e o [editor Bézier oficial da Godot 4.5](https://github.com/godotengine/godot/blob/4.5-stable/editor/animation/animation_bezier_editor.cpp)
fundamentam enquadramento e navegação de tempo/valor. A adaptação usa uma folha
temporária para toque, um canal editável e referências identificadas; normalizar
a visualização permanece separado de alterar os valores autorais.

[Unity 6, 6000.0: seleção e manipulação de chaves](https://docs.unity3d.com/6000.0/Documentation/Manual/animeditor-AdvancedKeySelectionAndManipulation.html) fundamenta relações temporais da seleção. [Godot 4.5: Animation](https://docs.godotengine.org/en/4.5/classes/class_animation.html) e o [editor de trilhas oficial](https://github.com/godotengine/godot/blob/4.5/editor/animation/animation_track_editor.cpp) fundamentam identidade de dados e publicação por histórico. A adaptação Astra usa seleção explícita para toque, uma superfície contextual e seus próprios recursos versionados.

[Godot 4.5: EditorSelection](https://docs.godotengine.org/en/4.5/classes/class_editorselection.html)
fundamenta a separação entre grupo e alvo principal e a exclusão de filhos já
transformados pelo pai selecionado. [Unity 2018.4: atalhos oficiais](https://docs.unity3d.com/2018.4/Documentation/uploads/Main/Unity_HotKeys_Win.pdf)
é a referência versionada de conjuntos de seleção; a Astra adapta a criação
para nomes e controles de toque.

[Unity 6000.5: otimização de loop](https://docs.unity.com/en-us/engine/6000.5/manual/animation-section/animation-mecanim/animation-clips/looping-animation-clips)
fundamenta verificar as fronteiras antes de repetir. O fechamento Astra descrito
aqui garante pose C0 dentro da tolerância, sem afirmar continuidade de velocidade.
[Godot 4.5: Asset Library](https://docs.godotengine.org/en/4.5/community/asset_library/using_assetlib.html)
e [Unity 6000.0: manifesto de pacote](https://docs.unity3d.com/6000.0/Documentation/Manual/upm-manifestPkg.html)
fundamentam separar identidade, versão, licença e origem no catálogo local.

[Unity 6, 6000.0: Material Inspector](https://docs.unity3d.com/6000.0/Documentation/Manual/class-Material.html) e [Standard Shader](https://docs.unity3d.com/6000.0/Documentation/Manual/StandardShaderMaterialParameters.html) definem a origem das propriedades convertidas. [Godot 4.5: MeshInstance3D](https://docs.godotengine.org/en/4.5/classes/class_meshinstance3d.html) fundamenta a distinção entre recurso compartilhado e substituição por superfície. A Astra reutiliza seu Inspector, journal e consumidor PBR reais.
`,
};
