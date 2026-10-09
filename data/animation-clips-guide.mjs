export const animationClipsGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animation-clips',
  title: 'Animation Studio: clipes, curvas e bake',
  description: 'Autore clipes independentes, edite curvas e reduza chaves pela interface ou pelo SDK C#.',
  body: `:::caution[Revisão Dev]
Disponível no Astra Dev **0.2.9-dev.bake.20261008.5**, code **21**, instalado e conferido em aparelho em **09/10/2026**. O download público continua no APK **0.2.3**. Este guia documenta um recorte funcional de B4; B4, IK, retargeting e equivalência com os pacotes de referência continuam abertos.
:::

## Um recurso para objetos animáveis

Um clipe **AECLIP 2** pertence ao projeto, separado do modelo importado. Bindings identificam o dono, caminhos relativos e, quando disponível, o GUID do nó importado. Trilhas tipadas animam **posição, rotação, escala e morphs**. Mecanismos, objetos e hierarquias com skin usam o mesmo avaliador; não é necessário ser um jogador.

O preview do Studio é temporário. Fechar ou trocar de contexto restaura a pose autorada; salvar o clipe não grava a pose de preview como transformação da cena. Um recurso novo não é atribuído automaticamente a um estado do Animator: escolha-o no estado que deve reproduzi-lo.

## Criar, editar e conferir

1. Selecione o objeto e abra o **Animation Studio** pelo atalho de animação do viewport.
2. Em **Clipe**, crie um recurso editável ou use **Extrair da fonte**. Extração mantém o arquivo importado intacto.
3. Escolha alvo e propriedade; insira poses/chaves. **Chaves** mostra tempos; **Curvas** mostra valores e tangentes.
4. Selecione uma ou várias chaves para mover, escalar no tempo, copiar, recortar, colar, inserir ou excluir. Rotações agrupadas preservam os componentes da pose.
5. Use scrub e reprodução para conferir; Undo/Redo restaura operações de autoria. Salve, encerre e reabra para conferir os recursos persistidos.

Curvas oferecem interpolação constante/linear/cúbica, tangentes e pesos. Euler conserva voltas por eixo; Quaternion interpola orientações; Progressivo acrescenta progressão angular derivada das poses. Converter sem bake só é permitido quando a operação preserva o comportamento suportado; perda de voltas/curvas é recusada.

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
| Sample / SampleCurve | Avaliação nativa compartilhada com runtime; rotação retorna Quaternion XYZW. |
| Bake / Commit / Dispose | Bake altera o rascunho; Commit publica; Dispose descarta o não publicado. |

ClipBakeSettings expõe **SampleRate** (60), **Tolerance** (0,01), **Reduce** (true), **Rotation** (null preserva), **VerificationSteps** (4, entre 2 e 16) e **MaximumFrames** (16384, entre 2 e 65536). ClipBakeReport retorna **InputKeys**, **OutputKeys**, **SampledFrames**, **VerifiedSamples** e **MaximumError**. Os limites de avaliações/comparações continuam efetivos mesmo aumentando MaximumFrames.

Tempo é em segundos, tangentes em valor/segundo e pesos em fração do segmento. PutPose recebe Quaternion XYZW ou Euler em graus; Progressivo deriva seu quinto canal. Morphs têm até 64 componentes. ClipBindingPath.Join codifica nomes com barra para não confundir nome e caminho.

## Lifecycle, persistência e erros

Comandos são síncronos e executam na thread do editor, em Edit. Contexto, rascunhos e clipboards deixam de ser válidos após a invocação; uso tardio ou em outra thread é recusado. Existem até oito rascunhos e oito clipboards, com orçamentos separados de 262144 chaves. Cada criação/extração/Commit é uma transação própria; uma exceção posterior não desfaz publicações já concluídas. Use Undo para revertê-las.

AECLIP conserva IDs e revisão; Undo restaura dados sem fazer o alocador reutilizar identidades. Snapshots são inspeção, não uma segunda fonte de verdade. A ABI de autoria 2 acrescenta Bake mantendo o prefixo da ABI 1; um host antigo pode usar os comandos anteriores e recusa Bake com diagnóstico. APK/SDK devem ser atualizados juntos.

## Evidência e limites

- Host: **27/27 cenários direcionados**, build SDK Release e integração C# com ponte nativa ABI 1/2.
- Android: code 21 instalado com hash igual ao APK local; edição por toque, bake, redução, Undo/Redo e comando C# publicados pelo IDE.
- Reprodução: **477/477 quadros examinados** em 16 folhas ordenadas, com PTS/hashes; mecanismo A animado e B imóvel. Preview curto não mede FPS sustentado, latência ou temperatura.
- Salvar/reabrir: os recursos produzidos pela UI e pela API permaneceram byte a byte iguais após encerrar e reabrir. Fonte GLB preservada.

Permanecem pendentes: conversão Quaternion/Progressivo → Euler com ramo/eixos explícitos; bake de FK/IK/root motion; jobs de bake com progresso/cancelamento na UI; camadas de autoria/mute/solo; eventos, markers, drivers e propriedades arbitrárias; gizmos de pose/auto-key/espelho; merge de reimportação e biblioteca de pacotes. SourceOverride isolado não é política completa de merge. Não há equivalência completa com UMotion/FinalIK nem assets desses pacotes convertidos nesta entrega. BoZo permanece excluído.

## Referências e adaptação

[Unity 6000.0: AnimationUtility.SetEditorCurve](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AnimationUtility.SetEditorCurve.html) fundamenta edição por API independente da janela; [Godot 4.5: Animation.optimize](https://docs.godotengine.org/en/4.5/classes/class_animation.html#class-animation-method-optimize) fundamenta redução configurável por precisão. A Astra aplica esses princípios ao recurso revisionado, sampler e histórico próprios, com uma faixa contextual adequada ao toque. O manual UMotion Pro 1.29p04 fornecido foi estudado para curvas, modos de rotação e exportação; seu núcleo Unity não é o backend Android.
`,
};
