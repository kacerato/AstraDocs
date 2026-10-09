export const animationClipsGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animation-clips',
  title: 'Animation Studio: clipes, camadas, curvas e consolidação',
  description: 'Autore clipes independentes, componha camadas, edite curvas e reduza chaves pela interface ou pelo SDK C#.',
  body: `:::note[Disponível no APK público 0.3.0]
Clipes editáveis, curvas, bake, camadas e consolidação, aceitos no Astra Dev até o code 23 (09/10/2026), estão no APK público **0.3.0-preview.20261009**, versionCode 28, em [Download](/download/). B4, IK, retargeting e equivalência com os pacotes de referência continuam abertos.
:::

:::caution[Revisão Dev 0.3.1]
Rascunhos de pose e gizmos estão no Astra Dev **0.3.1-dev.pose.20261009.1** (pacote de desenvolvimento, code 28 desse pacote), conferido em aparelho em **09/10/2026**. Essa revisão ainda não está no APK público 0.3.0.
:::

## Um recurso para objetos animáveis

Um clipe **AECLIP 3** pertence ao projeto, separado do modelo importado. Bindings identificam o dono, caminhos relativos e, quando disponível, o GUID do nó importado. Trilhas tipadas animam **posição, rotação, escala e morphs**. Mecanismos, objetos e hierarquias com skin usam o mesmo avaliador; não é necessário ser um jogador.

O preview do Studio é temporário. Fechar ou trocar de contexto restaura a pose autorada; salvar o clipe não grava a pose de preview como transformação da cena. Um recurso novo não é atribuído automaticamente a um estado do Animator: escolha-o no estado que deve reproduzi-lo.

## Criar, editar e conferir

1. Selecione o objeto e abra o **Animation Studio** pelo atalho de animação do viewport.
2. Em **Clipe**, crie um recurso editável ou use **Extrair da fonte**. Extração mantém o arquivo importado intacto.
3. Escolha alvo e propriedade; insira poses/chaves. **Chaves** mostra tempos; **Curvas** mostra valores e tangentes.
4. Selecione uma ou várias chaves para mover, escalar no tempo, copiar, recortar, colar, inserir ou excluir. Rotações agrupadas preservam os componentes da pose.
5. Use scrub e reprodução para conferir; Undo/Redo restaura operações de autoria. Salve, encerre e reabra para conferir os recursos persistidos.

Curvas oferecem interpolação constante/linear/cúbica, tangentes e pesos. Euler conserva voltas por eixo; Quaternion interpola orientações; Progressivo acrescenta progressão angular derivada das poses. Converter sem bake só é permitido quando a operação preserva o comportamento suportado; perda de voltas/curvas é recusada.

## Pose, preview e gravação

A revisão de autoria **ABI 5** acrescenta um rascunho de pose independente do arquivo. No code 28 instalado, a conferência física cobriu rascunho numérico sem escrita, Cancelar, translação pelo gizmo, Gravar, Undo/Redo, confirmação numérica com Auto-key e reabertura após encerrar o processo. O projeto privado de aceite reúne Kyle e Viking Idle/Walk/Run com materiais e skin; não é uma biblioteca integral dos pacotes.

1. Escolha um canal e abra **Pose**. O alvo e a propriedade selecionados definem o gizmo: posição, anéis de rotação ou escala local. Morphs usam os campos numéricos.
2. **Auto-key**, ligado inicialmente, grava ao concluir a edição numérica ou soltar o gizmo. Um arraste completo cria um passo de Undo; os movimentos intermediários não escrevem o recurso.
3. Desligue Auto-key para experimentar. **Sem gravar** identifica o rascunho. **Gravar** publica as propriedades preparadas no mesmo tempo em uma transação; **Cancelar** recompõe o clipe sem alterar a cena original.
4. **Camada** alterna a inspeção isolada e o resultado composto. Os gizmos aparecem na camada isolada, onde seu movimento corresponde aos valores crus editados. Isso evita tratar uma correção aditiva com peso 0,5 como se fosse a pose final.
5. Buscar outro tempo ou fechar o clipe descarta a pose não gravada. Cancelar um gesto restaura o rascunho que existia antes dele; cancelar a pose inteira descarta esse rascunho.

Translação converte o deslocamento no mundo para o espaço do pai; rotação conserva a continuidade Euler ou o grupo Quaternion; escala segue os eixos locais projetados. Uma transformação que exigiria shear é recusada com diagnóstico. A edição não modifica transforms nem bytes do modelo fonte. Este recorte não é clipboard de rig completo, espelho, retargeting ou IK.

### Preview e gravação pela API

~~~csharp
using System.Linq;
using Astra.Editor;

public static class PoseDoObjeto
{
    [EditorCommand("Preparar uma pose")]
    public static void Preparar(EditorContext editor)
    {
        var clip = editor.Clips[0];
        var track = editor.InspectClip(clip).Tracks.First(t =>
            t.Property == ClipProperty.Translation && t.Layer == 0);
        editor.PreviewClip(clip, editor.SelectedObject, 0);
        editor.StagePose(track.Id, new float[] { 0, 1, 0 });
        // Use CancelPose para descartar ou RecordPose para publicar.
        editor.RecordPose();
        editor.CloseClipPreview();
    }
}
~~~

Escolha uma raiz que resolva os bindings do clipe; o exemplo pressupõe um canal de posição na Base e um objeto selecionado compatível. StagePose aceita uma propriedade por chamada, acumula alterações no rascunho e sempre exige RecordPose, independentemente do Auto-key da interface. SeekClipPreview descarta a pose pendente ao mudar o tempo; CancelPose e CloseClipPreview são explícitos. Valores nativos usam Quaternion **XYZW**, Euler em **graus** e morph em fração **0–1**. A ABI 5 mantém os prefixos 1–4; hosts anteriores recusam estes comandos.

## Camadas de autoria

**Camadas** abre uma faixa sob a timeline. O seletor com nome/ordem abre a lista; setas navegam e **Nome** renomeia. **+** cria uma camada vazia, duplicar copia seus canais com IDs novos e remover exclui camada/canais em uma transação reversível. Subir/descer muda a ordem de composição; a Base permanece em primeiro lugar.

![Camada de correção criada por toque no Android, com peso e canais próprios.](/assets/animation-layers-dev.png)

Uma camada vazia oferece **Adicionar canal**: escolha objeto e propriedade. Só os canais adicionados entram na máscara. A autoria é válida para mecanismos, objetos, ossos e morphs; não exige player. O campo Pose e as curvas exibem valores da camada selecionada; o viewport mostra o resultado composto. **Da base** substitui explicitamente as curvas da propriedade selecionada por uma cópia da Base, com Undo.

| Ajuste | Efeito real |
|---|---|
| Substituir | Interpola a pose anterior em direção à pose da camada. |
| Aditiva | Soma diferenças em posição/morph; aplica razão de escala e delta local de rotação à direita. |
| Peso | Fração de 0 a 1; padrão 1. Base tem peso fixo 1. |
| Ref. neutra | Usa posição/morph zero, escala um e rotação identidade como referência aditiva. |
| Ref. tempo | Usa a pose da própria camada no tempo configurado; não aparece como ajuste efetivo em Substituir. |
| Mudo | Exclui a camada da avaliação; prevalece sobre Solo. |
| Solo | Avalia somente camadas Solo não silenciadas. Uma Base excluída conserva sua pose inicial, sem reproduzir seu movimento. |

Mudo/Solo são dados do clipe: salvam e afetam também Animation/Animator em Play. Não são apenas opções temporárias de visualização. Há até **32 camadas incluindo Base**, 16384 trilhas e 262144 chaves por clipe; morphs têm até 64 componentes. A máscara é por propriedade inteira (posição, rotação, escala ou vetor de morphs), com curvas independentes dentro dela.

Cortar um intervalo que exclui a referência temporal recusa a operação inteira. Retime, reverse e inserção global ajustam essa referência junto das curvas. Inserção parcial recusa deslocar uma referência compartilhada com canais que ficariam imóveis. Colar entre clipes exige Base ou nome/modo único da camada; nomes ambíguos são diagnosticados.

### Camadas pela API

~~~csharp
using System.Linq;
using Astra.Editor;

public static class Correcao
{
    [EditorCommand("Adicionar correção")]
    public static void Criar(EditorContext editor)
    {
        var guid = editor.Clips[0];
        using var edit = editor.BeginClip(guid);
        var source = edit.Snapshot.Tracks.First(t => t.Layer == 0 &&
            t.Property == ClipProperty.Translation);
        var layer = edit.AddLayer("Correção", ClipLayerBlend.Additive);
        var track = edit.AddLayerTrack(layer, source.Id);
        edit.PutPose(track, 0, new float[] { 0, 1, 0 });
        edit.PutPose(track, edit.Snapshot.Duration, new float[] { 0, 1, 0 });
        edit.ConfigureLayer(layer, "Correção", weight: .5f);
        var raw = edit.Sample(track, 0);
        var final = edit.SampleComposed(track, 0);
        edit.Commit();
    }
}
~~~

AddLayerTrack aceita copiar curvas ou inicializar uma propriedade; o argumento opcional rotation escolhe Quaternion/Euler/Progressivo em um canal novo. Copiar curvas entre formatos diferentes exige conversão/bake explícito. ConfigureLayer expõe nome, mistura, peso, referência nullable, muted e solo. MoveLayer, DuplicateLayer e RemoveLayer usam IDs estáveis; CopyBaseToTrack substitui explicitamente as curvas de um canal de correção pelas da Base, preservando a identidade do canal. Snapshot.Layers informa ordem e todos os campos; ClipTrack.Layer identifica a máscara. Sample é o canal cru; SampleComposed é o resultado final daquela propriedade. Nenhuma operação exige abrir o Studio.

## Bake e redução

Selecione uma trilha e abra **Edição → Bake e redução**. A faixa inferior substitui temporariamente o transporte e mantém viewport e curva visíveis. Feche no **×** inferior para voltar à reprodução.

![Redução real no Android: 605 para 15 chaves, erro medido e pontos verificados.](/assets/animation-bake-dev.png)

| Ajuste | Efeito |
|---|---|
| Amostras/s | Grade inicial de 1 a 240; tempos autorados, extremos e refinamento também entram na amostragem. Padrão 60. |
| Erro | Tolerância finita e positiva; graus para rotação e unidades do canal nos demais casos. Padrão 0,01. |
| Formato | Preservar, Quaternion, Progressivo ou Euler XYZ. Não altera propriedades que não sejam rotação. |
| Canal / Clipe novo | Canal altera uma trilha; Clipe novo consolida todas as propriedades compostas em outro recurso. |
| XYZ / Ramo XYZ | Alterna os ajustes com a referência XYZ inicial; confirme o ramo e edite graus por eixo para converter para Euler. |
| Redução | Ligada elimina poses redundantes dentro da verificação; desligada mantém as poses amostradas. |
| Aplicar | Publica a trilha convertida em um passo do histórico; exibe chaves antes/depois, poses, maior erro medido e pontos verificados. |

O relatório pertence à revisão e à trilha avaliadas. Mudar a trilha ou usar Undo/Redo remove os números antigos. A taxa é configuração da operação, não uma promessa de FPS nem o número final de chaves. A configuração retorna aos padrões ao reabrir o Studio; o resultado convertido permanece no recurso.

O backend usa o avaliador real da engine, inclui extremos de curvas ponderadas e vizinhanças de degraus, refina rotações com múltiplas voltas, reduz e verifica o candidato antes da publicação. Erro excessivo ou orçamento excedido recusa a operação inteira. **A tolerância é verificada nos pontos amostrados, não certificada matematicamente para todo instante possível.**

### Converter rotações e consolidar camadas

![Consolidação real no Android: recurso novo, Base única e relatório de verificação.](/assets/animation-consolidation-dev.png)

Para **Quaternion/Progressivo → Euler**, escolha Euler XYZ, abra XYZ, confirme Ramo XYZ e configure a referência inicial em graus. A engine segue o representante equivalente mais próximo da pose anterior, incluindo o gimbal. A ordem é XYZ fixa, na convenção Rz·Ry·Rx; não há seletor de outras ordens. A referência distingue representantes equivalentes, como 0°/360°, mas não recupera voltas que a fonte já perdeu.

**Clipe novo → Criar** amostra a composição real de posição, rotação, escala e morphs, respeitando peso, ordem, referência, Mudo e Solo. Publica outro GUID/arquivo com uma única Base; conserva bindings e a dependência da fonte importada. Preservar usa Quaternion para rotações compostas. O original permanece intacto. Undo remove o recurso criado; Redo o recria. Atribua o resultado ao estado do Animator explicitamente.

O relatório de consolidação soma chaves/poses/pontos de todos os canais. O maior erro aparece em **u/°** porque cada propriedade conserva suas unidades; o número não é uma norma física global entre canais. Consolidar não exporta FBX, não resolve IK nem extrai root motion.

~~~csharp
using var edit = editor.BeginClip(editor.Clips[0]);
var rotation = edit.Snapshot.Tracks.First(t => t.Property == ClipProperty.Rotation);
edit.Bake(rotation.Id, new ClipBakeSettings(Rotation: ClipRotation.Euler,
    EulerReference: new ClipEulerReference(0, 360, 0)));
var result = edit.CreateConsolidated("Versão consolidada");
// CreateConsolidated publica só o recurso novo; não faz Commit do rascunho.
~~~

No aparelho, desligar a redução gerou **605 chaves**; ligá-la reduziu para **15**, com **121 poses**, **481 pontos** e erro exibido de aproximadamente **0,0000096°**. Esses números são desse clipe de teste, não de todos os recursos.

## Autoria pela API C#

No IDE: **Modelos de código → Ferramenta de animação → Recompilar projeto → Ferramentas do editor**. Métodos públicos estáticos com assinatura \`void Nome(EditorContext editor)\` e atributo \`[EditorCommand("Rótulo")]\` entram no catálogo da geração compilada/publicada. Falha de compilação mantém a geração anterior. Não exige Behavior nem Play.

~~~csharp
using System.Linq;
using Astra.Editor;

public static class Ferramentas
{
    [EditorCommand("Criar duas voltas")]
    public static void Criar(EditorContext editor)
    {
        var guid = editor.CreateClip(editor.SelectedObject, 2, ClipRotation.Euler);
        using var edit = editor.BeginClip(guid);
        var rotation = edit.Snapshot.Tracks.Single(t => t.Property == ClipProperty.Rotation);
        for (var frame = 0; frame <= 60; ++frame)
            edit.PutPose(rotation.Id, frame / 30f, new float[] { 0, frame * 12, 0 });
        var report = edit.Bake(rotation.Id, new ClipBakeSettings(
            SampleRate: 2, Tolerance: .01, Reduce: true,
            Rotation: ClipRotation.Quaternion));
        edit.SetName("Duas voltas");
        edit.Commit();
    }
}
~~~

O exemplo separa criação, rascunho, operação e publicação. Na sonda executada no Android, **61 poses Euler / 183 chaves escalares** resultaram em **8 poses Quaternion / 32 chaves**, preservando as duas voltas na reprodução.

| API | Contrato |
|---|---|
| EditorContext.SelectedObject, Clips, ImportedClips | Seleção e catálogos reais, sem exigir o painel aberto. |
| CreateClip / ExtractClip | Criação ou extração com GUID e histórico; fonte preservada. |
| BeginClip / InspectClip | Rascunho isolado e snapshot tipado; revisão vencida é recusada. |
| AddTrack / RemoveTrack | Alvo e propriedade tipados; caminhos relativos canônicos. |
| PutKey / SplitKey / EraseKey / PutPose | Valores, IDs, tangentes, pesos e agrupamento de rotação efetivos. |
| Retime / Reverse / Crop / SetRotation | Transformação das curvas, com recusa de conversão incompatível. |
| Copy / Paste / TransformSelection / EraseSelection | Clipboard com ownership e edição de seleção. |
| AddLayer / ConfigureLayer / MoveLayer / DuplicateLayer / RemoveLayer | Pilha autorada com IDs, ordem e parâmetros efetivos. |
| AddLayerTrack / SampleComposed | Máscara esparsa e avaliação da propriedade final. |
| Sample / SampleCurve | Avaliação nativa compartilhada com runtime; rotação retorna Quaternion XYZW. |
| Bake / Commit / Dispose | Bake altera o rascunho; Commit publica; Dispose descarta o não publicado. |
| CreateConsolidated | Publica outro clipe e seu histórico, a partir da composição do rascunho, sem fazer Commit dele. |

ClipBakeSettings expõe **SampleRate** (60), **Tolerance** (0,01), **Reduce** (true), **Rotation** (null preserva; em consolidação gera Quaternion), **VerificationSteps** (4, entre 2 e 16), **MaximumFrames** (16384, entre 2 e 65536 por canal) e **EulerReference** (nullable, XYZ em graus). ClipBakeReport retorna **InputKeys**, **OutputKeys**, **SampledFrames**, **VerifiedSamples** e **MaximumError**. ClipConsolidation retorna **Clip** (GUID novo) e **Report**. Os limites de avaliações/comparações continuam efetivos mesmo aumentando MaximumFrames.

Tempo é em segundos, tangentes em valor/segundo e pesos em fração do segmento. PutPose recebe Quaternion XYZW ou Euler em graus; Progressivo deriva seu quinto canal. Morphs têm até 64 componentes. ClipBindingPath.Join codifica nomes com barra para não confundir nome e caminho.

## Lifecycle, persistência e erros

Comandos são síncronos e executam na thread do editor, em Edit. Contexto, rascunhos e clipboards deixam de ser válidos após a invocação; uso tardio ou em outra thread é recusado. Existem até oito rascunhos e oito clipboards, com orçamentos separados de 262144 chaves. Cada criação/extração/Commit é uma transação própria; uma exceção posterior não desfaz publicações já concluídas. Use Undo para revertê-las.

AECLIP conserva IDs e revisão; Undo restaura dados sem fazer o alocador reutilizar identidades. Snapshots são inspeção, não uma segunda fonte de verdade. A ABI de autoria 4 acrescenta conversão avançada e consolidação, mantendo os prefixos ABI 1/2/3; ABI 3 fornece camadas e SampleComposed. Hosts antigos continuam disponíveis para comandos compatíveis e recusam capacidades novas explicitamente. AECLIP 1/2 migra para uma Base única; versões antigas do app não leem AECLIP 3. Preserve backup antes de editar com a revisão nova. APK/SDK devem ser atualizados juntos.

## Evidência e limites

- Host desta revisão: **35/35 cenários direcionados**, incluindo ramo Euler/gimbal, múltiplas voltas, composição TRS/morph, cancelamento/orçamento, UI, histórico, publicação e reabertura. SDK Release sem erros, com dois avisos CS8981 existentes; integração C# com ponte nativa ABI 1/2/3/4: **1 passou, zero pulados**.
- Android: code 23 instalado com hash igual ao APK local. Conversão com referência explícita, campo Y=360°, Undo/Redo, criação de clipe consolidado, remoção/recriação por histórico, escolha no catálogo e override local no Animator foram conferidos por toque. Comando C# converteu e comparou **401 poses**, publicou outro recurso e confirmou a preservação da origem.
- Play: **cinco verificações passaram**: posição consolidada Y=20, escala 1,5, outra instância independente, estado com override e rotação consolidada avançando. O cenário é um mecanismo genérico; skin/morph têm evidência host.
- Reprodução desta revisão: **1.431/1.431 quadros examinados em 48 folhas**, com PTS/hashes. Os trechos cobrem controles, criação/preview e Play; a gravação de controles contém períodos estáticos e não é, isoladamente, prova da conversão. Não mede FPS sustentado, latência ou temperatura.
- Salvar/reabrir: SDK embarcado conferiu novamente 401 poses após encerrar e reabrir; sete clipes idênticos byte a byte. Fonte GLB, licença, controller e clipe autoral preservados. Cena e script anteriores do projeto de aceite foram restaurados, mantendo os clipes produzidos disponíveis.
- Evidência histórica separada: camadas code 22 tiveram 31/31 cenários host e 909/909 quadros; bake code 21 teve 27/27 cenários host e 477/477 quadros.

Ampliação ABI 5: **38/38 cenários host**, incluindo draft, gesto, cancelamento, Auto-key, composição isolada, histórico, pai girado e reabertura. Integração C# com ponte nativa ABI 1–5: **1 passou, zero pulados**, incluindo acúmulo de duas propriedades e gravação em uma transação. Capturas executáveis de UI em 853×394 e 655×300 foram inspecionadas.

No POCO F7, o APK Dev code **28** foi compilado, instalado e comparado por SHA-256. A conferência física cobriu rascunho numérico sem alterar o arquivo, Cancelar, translação pelo gizmo, Gravar, Undo/Redo, Auto-key numérico e persistência após encerrar/reabrir. O Play mostrou os quatro personagens com skin e materiais. Foram revisados **887 quadros de duas gravações**, sem saltos na extração: 657 do gesto/histórico e 230 do Play. Não foram observadas malhas quebradas nesses trechos; não são medição prolongada de desempenho ou aceite de IK/locomoção. Rotação, escala, morphs e comandos SDK desta revisão têm evidência no host, sem aceite físico equivalente.

Robot Kyle (49 juntas) e Viking Idle/Walk/Run (22 juntas por fonte) foram convertidos dos pacotes fornecidos para GLB com materiais e hierarquia de skin. Importação nativa, amostragem e deformação CPU passaram; os três clipes tiveram 61 amostras por fonte. Walk/Run possuem repousos diferentes do Viking base e permanecem rigs completos separados. Isso não declara retargeting entre eles. Os pacotes privados e seus arquivos não fazem parte do download público.

Permanecem pendentes: aceite físico de rotação/escala/morphs e comandos SDK; outras ordens Euler; bake de FK/IK/root motion; jobs de bake com progresso/cancelamento na UI; eventos, markers, drivers e propriedades arbitrárias; cópia/espelho de rig completo; merge de reimportação e biblioteca completa dos pacotes. SourceOverride isolado não é política completa de merge. Não há equivalência completa com UMotion/FinalIK. A seleção de personagens BoZo foi autorizada posteriormente, mas nenhum personagem desse pacote entra neste recorte.

## Referências e adaptação

[Unity 6000.0: Euler curve import](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationEulerCurveImport.html) distingue representação, resampling e gimbal. O [avaliador/otimizador Godot 4.5-stable](https://github.com/godotengine/godot/blob/4.5-stable/scene/resources/animation.cpp) fundamenta comparação com a avaliação efetiva. A Astra usa levantamento XYZ com referência explícita e publica o compositor em um recurso separado. O tutorial oficial [UMotion: Export Animations](https://www.youtube.com/watch?v=IKjIsIJs5hM) foi estudado nos trechos de escolha de destino e publicação, com transcrição; não é alegação de revisão integral do vídeo nem de exportação FBX implementada.

[Unity 6000.0: AnimationUtility.SetEditorCurve](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AnimationUtility.SetEditorCurve.html) fundamenta edição por API independente da janela; [Godot 4.5: Animation.optimize](https://docs.godotengine.org/en/4.5/classes/class_animation.html#class-animation-method-optimize) fundamenta redução configurável por precisão. A Astra aplica esses princípios ao recurso revisionado, sampler e histórico próprios, com uma faixa contextual adequada ao toque. [Unity 6000.0: Animation Layers](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationLayers.html) fundamenta máscara e composição; [Godot 4.5: AnimationNodeAdd2](https://docs.godotengine.org/en/4.5/classes/class_animationnodeadd2.html) oferece uma referência de avaliação aditiva. As camadas do clipe ficam separadas das camadas do controller. O manual UMotion Pro 1.29p04 fornecido foi estudado para curvas, modos de rotação e exportação; seu núcleo Unity não é o backend Android.
`,
};
