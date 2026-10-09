export const animationClipsGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animation-clips',
  title: 'Animation Studio: clipes, camadas e curvas',
  description: 'Autore clipes independentes, componha camadas, edite curvas e reduza chaves pela interface ou pelo SDK C#.',
  body: `:::caution[Revisão Dev]
Disponível no Astra Dev **0.2.10-dev.layers.20261009.1**, code **22**, instalado e conferido em aparelho em **09/10/2026**. O download público continua no APK **0.2.3**. Este guia documenta recortes funcionais de B4; B4, IK, retargeting e equivalência com os pacotes de referência continuam abertos.
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
| Formato | Preservar, Quaternion ou Progressivo. Não altera propriedades que não sejam rotação. |
| Redução | Ligada elimina poses redundantes dentro da verificação; desligada mantém as poses amostradas. |
| Aplicar | Publica a trilha convertida em um passo do histórico; exibe chaves antes/depois, poses, maior erro medido e pontos verificados. |

O relatório pertence à revisão e à trilha avaliadas. Mudar a trilha ou usar Undo/Redo remove os números antigos. A taxa é configuração da operação, não uma promessa de FPS nem o número final de chaves. A configuração retorna aos padrões ao reabrir o Studio; o resultado convertido permanece no recurso.

O backend usa o avaliador real da engine, inclui extremos de curvas ponderadas e vizinhanças de degraus, refina rotações com múltiplas voltas, reduz e verifica o candidato antes da publicação. Erro excessivo ou orçamento excedido recusa a operação inteira. **A tolerância é verificada nos pontos amostrados, não certificada matematicamente para todo instante possível.**

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

ClipBakeSettings expõe **SampleRate** (60), **Tolerance** (0,01), **Reduce** (true), **Rotation** (null preserva), **VerificationSteps** (4, entre 2 e 16) e **MaximumFrames** (16384, entre 2 e 65536). ClipBakeReport retorna **InputKeys**, **OutputKeys**, **SampledFrames**, **VerifiedSamples** e **MaximumError**. Os limites de avaliações/comparações continuam efetivos mesmo aumentando MaximumFrames.

Tempo é em segundos, tangentes em valor/segundo e pesos em fração do segmento. PutPose recebe Quaternion XYZW ou Euler em graus; Progressivo deriva seu quinto canal. Morphs têm até 64 componentes. ClipBindingPath.Join codifica nomes com barra para não confundir nome e caminho.

## Lifecycle, persistência e erros

Comandos são síncronos e executam na thread do editor, em Edit. Contexto, rascunhos e clipboards deixam de ser válidos após a invocação; uso tardio ou em outra thread é recusado. Existem até oito rascunhos e oito clipboards, com orçamentos separados de 262144 chaves. Cada criação/extração/Commit é uma transação própria; uma exceção posterior não desfaz publicações já concluídas. Use Undo para revertê-las.

AECLIP conserva IDs e revisão; Undo restaura dados sem fazer o alocador reutilizar identidades. Snapshots são inspeção, não uma segunda fonte de verdade. A ABI de autoria 3 acrescenta SampleComposed e operações de camada, mantendo os prefixos ABI 1/2. Hosts antigos continuam disponíveis para comandos compatíveis e recusam capacidades novas explicitamente. AECLIP 1/2 migra para uma Base única; versões antigas do app não leem AECLIP 3. Preserve backup antes de editar com a revisão nova. APK/SDK devem ser atualizados juntos.

## Evidência e limites

- Host desta revisão: **31/31 cenários direcionados**, incluindo matemática, migração, UI, histórico e consumidor Animator. SDK Release sem erros/avisos e integração C# com ponte nativa ABI 1/2/3.
- Android: code 22 instalado com hash igual ao APK local. Camada/canal por toque, peso, Mudo/Solo, referência, ordem, duplicação, remoção, cópia da Base e Undo/Redo; comando C# compilado, publicado e executado pelo IDE.
- Play: cinco verificações passaram no Animator: posição aditiva Y=20, escala 1,5, outra instância independente, override de clipe e rotação da Base avançando sob as correções. O cenário é um mecanismo genérico; skin/morph têm evidência host.
- Reprodução desta revisão: **909/909 quadros examinados**, em 31 folhas de controles, preview e Play, com PTS/hashes. Gravação curta com transição de compilação não mede FPS sustentado, latência ou temperatura.
- Salvar/reabrir: leitura pelo SDK embarcado confirmou as camadas, metadados e composição após encerrar e reabrir. Fonte GLB e licença preservadas; cena e script anteriores do projeto de aceite foram restaurados ao final, mantendo os clipes produzidos disponíveis.
- Bake da revisão code 21: redução e conversão conferidas anteriormente, com **27/27 cenários host** e **477/477 quadros**. Essa evidência histórica continua separada do aceite de camadas.

Permanecem pendentes: conversão Quaternion/Progressivo → Euler com ramo/eixos explícitos; bake de FK/IK/root motion; jobs de bake com progresso/cancelamento na UI; eventos, markers, drivers e propriedades arbitrárias; gizmos de pose/auto-key/espelho; merge de reimportação e biblioteca de pacotes. SourceOverride isolado não é política completa de merge. Não há equivalência completa com UMotion/FinalIK nem assets desses pacotes convertidos nesta entrega. BoZo permanece excluído.

## Referências e adaptação

[Unity 6000.0: AnimationUtility.SetEditorCurve](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AnimationUtility.SetEditorCurve.html) fundamenta edição por API independente da janela; [Godot 4.5: Animation.optimize](https://docs.godotengine.org/en/4.5/classes/class_animation.html#class-animation-method-optimize) fundamenta redução configurável por precisão. A Astra aplica esses princípios ao recurso revisionado, sampler e histórico próprios, com uma faixa contextual adequada ao toque. [Unity 6000.0: Animation Layers](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationLayers.html) fundamenta máscara e composição; [Godot 4.5: AnimationNodeAdd2](https://docs.godotengine.org/en/4.5/classes/class_animationnodeadd2.html) oferece uma referência de avaliação aditiva. As camadas do clipe ficam separadas das camadas do controller. O manual UMotion Pro 1.29p04 fornecido foi estudado para curvas, modos de rotação e exportação; seu núcleo Unity não é o backend Android.
`,
};
