import { trail, badge, shot, to } from './tools.mjs';

const s = (slug, title, description, body) => trail('scripts', slug, title, description, body);
const api = (ns, name) => `[${name}](/pt-br/snapshot-2026-10-28/api/${`${ns}.${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/)`;

export const scriptsG7Trail = [
s('api-grafica', 'API gráfica com os nomes da Unity', 'Volume e perfil, overrides de pós, RenderSettings, Hora do dia com eventos, materiais por nome da URP e busca no mundo, com exemplos que rodaram no celular.', `
${badge('device', 'os seis exemplos rodaram no POCO F7 em C# e em Flow em 26/10')}

Desde a 0.4.0, o que os componentes gráficos fazem também tem os **nomes e as assinaturas da Unity**, no namespace \`Astra.Rendering\` e nas fachadas de \`Astra.Components\`. Os nomes antigos continuam valendo.

## Volume e perfil

\`\`\`csharp
using Astra;
using Astra.Rendering;

var volume = Volume.Get(objetoDoVolume)!;   // o Volume (componente Ambiente) do objeto
volume.Weight = 1;                          // 0 a 1, como volume.weight
volume.SharedProfile = outroPerfil;         // troca o perfil compartilhado (Volume.sharedProfile)
var perfil = volume.Profile;                // cópia só deste Volume (volume.profile)

if (!perfil.TryGet<Bloom>(out var bloom))
    bloom = perfil.Add<Bloom>(overrides: true);
bloom.Intensity.Override(0.6f);             // marca a caixa e põe o valor
bloom.Threshold.Override(0.9f);
\`\`\`

- ${api('Astra.Rendering', 'Volume')}: \`IsGlobal\`, \`Weight\`, \`Priority\`, \`BlendDistance\`, \`SharedProfile\`, \`Profile\`, \`HasInstantiatedProfile()\`.
- ${api('Astra.Rendering', 'VolumeProfile')}: \`TryGet<T>\`, \`Add<T>\`, \`Remove<T>\`, \`Has<T>\`.
- Cada parâmetro (${api('Astra.Rendering', 'VolumeComponent')}) tem \`Value\`, \`OverrideState\` e \`Override(valor)\`.
- Overrides: Exposure, Tonemapping, ColorAdjustments, Bloom, DepthOfField, MotionBlur, ChromaticAberration, LensDistortion, Vignette, ColorCurves (liga e desliga; as chaves das curvas só no Inspector), WhiteBalance, LiftGammaGain, ShadowsMidtonesHighlights, FilmGrain, AmbientOcclusion, Sky, Celestial, PhysicallyBasedSky, IndirectLightingController, Fog e CloudLayer.

## RenderSettings

Atalho estático sobre o Ambiente da cena (o da janela Iluminação). Cada escrita marca a caixa do parâmetro, como mexer no campo:

\`\`\`csharp
RenderSettings.Fog = true;
RenderSettings.FogMode = FogMode.ExponentialSquared;
RenderSettings.FogDensity = 0.03f;
RenderSettings.AmbientIntensity = 0.8f;
\`\`\`

## Hora do dia

\`\`\`csharp
var hora = TimeOfDay.Current!.Value;   // a primeira Hora do dia da cena
hora.Hour = 18.5f;                     // vale no quadro seguinte
hora.Speed = 60;                       // 1 minuto real = 1 hora de jogo
hora.HourChanged(this, h => Scene.Log(ObjectId, $"{h:00}:00"));
hora.Sunset(this, () => Scene.Log(ObjectId, "Anoiteceu"));
\`\`\`

Também \`Sunrise\` e \`DayChanged\`. Os mesmos quatro eventos existem na ${to('scripts', 'flow-sem-codigo', 'Conexão de evento')}.

## Materiais pelo nome da URP

\`\`\`csharp
var malha = Object.GetComponent<MeshRenderer>()!.Value;
malha.Material.SetColor("_BaseColor", new Color(1, 0.2f, 0.1f));
malha.Material.SetFloat("_Smoothness", 0.9f);
malha.SharedMaterial = outroMaterial;   // troca o material do primeiro slot
\`\`\`

Nomes aceitos: \`_BaseColor\`, \`_Smoothness\`, \`_Metallic\`, \`_BumpScale\`, \`_Cutoff\`, \`_OcclusionStrength\`, \`_EmissionColor\`, \`_BaseMap\`, \`_BumpMap\`, \`_MetallicGlossMap\`, \`_EmissionMap\`, \`_OcclusionMap\` e os do Standard (\`_Color\`, \`_MainTex\`, \`_Glossiness\`). Um nome desconhecido dá erro em vez de sumir.

## Achar componentes no mundo

\`SceneQuery.FindFirstObjectByType<T>()\` e \`SceneQuery.FindObjectsByType<T>()\`, como na Unity.

## Outros nomes da Unity

Light (\`Type\`, \`Shadows\`, \`RenderingLayerMask\`), Camera (\`ClearFlags\`, \`FieldOfView\`, \`Rect\`, \`UsePhysicalProperties\`, \`AllowHDR\`, \`RenderPostProcessing\`, \`VolumeLayerMask\`), MeshRenderer (\`ShadowCastingMode\`, \`LightProbeUsage\`, \`ReflectionProbeUsage\`, \`LightmapScaleOffset\`), ReflectionProbe (\`Mode\`, \`Size\`, \`Center\`, \`BakedTexture\`, \`RenderProbe()\`) e LightProbeGroup (\`GetProbePosition\`, \`SetProbePosition\`, \`ProbeCount()\`).

## Exemplo completo: desfoque ao mirar

Validado no POCO F7. Fica na câmera; segurar a ação **Mirar** fecha o campo de visão e liga a profundidade de campo de um Volume de mira, focada no que está no centro.

\`\`\`csharp
using Astra;
using Astra.Components;
using Astra.Rendering;

[ComponentId("g7.mira_com_desfoque")]
public sealed class MiraComDesfoque : Behavior
{
    [PropertyId("volume_de_mira")] public ObjectReference VolumeDeMira;
    [PropertyId("campo_normal")] public float CampoNormal = 60;
    [PropertyId("campo_mirando")] public float CampoMirando = 30;
    [PropertyId("velocidade")] public float Velocidade = 6;

    private Volume? volume;
    private DepthOfField? desfoque;

    public override void Start()
    {
        volume = Volume.Get(Resolve(VolumeDeMira)!);
        var perfil = volume!.Profile;   // cópia própria, como volume.profile
        desfoque = perfil.TryGet<DepthOfField>(out var existente) ? existente : perfil.Add<DepthOfField>(overrides: true);
        desfoque!.Mode.Override(DepthOfFieldMode.Bokeh);
        volume.Weight = 0;
    }

    public override void Update(float deltaTime)
    {
        var mirando = Input.Pressed("Mirar");
        var camera = Object.GetComponent<Camera>()!.Value;
        volume!.Weight = Mathf.MoveTowards(volume.Weight, mirando ? 1f : 0f, Velocidade * deltaTime);
        camera.FieldOfView = Mathf.Lerp(CampoNormal, CampoMirando, volume.Weight);
        var pose = Object.WorldTransform;
        var frente = System.Numerics.Vector3.Transform(System.Numerics.Vector3.UnitZ, pose.Rotation);
        if (mirando && Physics.RayCast(pose.Position, frente * 50) is { } acerto)
            desfoque!.FocusDistance.Override(acerto.Distance);
    }
}
\`\`\`

Outros exemplos completos em ${to('exemplos', 'api-grafica', 'Exemplos da API gráfica')}.

## Ainda não existe

Trocar o shader do override de um único objeto (troque o Material), editar as chaves das Color Curves por script, saber quando a recaptura de uma sonda terminou e \`Light.lightmapBakeType\`.
`),

s('entrada-do-jogador', 'Entrada do jogador (PlayerInput)', 'Transforme as ações do mapa de entrada em eventos: sem código pela Conexão de evento ou em C# com Performed e Canceled.', `
${badge('device', 'Mirar segurada e solta pelo toque no POCO F7 em C# e em Flow (26/10)')}

O componente **Entrada do jogador** faz o papel do Player Input da Unity em modo *Invoke Unity Events*: cada ação do mapa de entrada vira um evento **executada** (apertou) e **cancelada** (soltou) neste objeto.

## 1. A ação no mapa

**☰** › **Configurações do projeto** › **Entrada** › **+ Ação**: nome \`Mirar\`, Fonte **Botão touch**. No Play aparece o botão **Mirar** na tela.

## 2. O componente

No objeto do jogador: **Adicionar componente** › **Entrada do jogador** (ou **+** › Gameplay). Em **Ações**, marque as ações que este objeto observa.

## 3a. Sem código

**Conexão de evento** no mesmo objeto:

| Campo | Valor |
| --- | --- |
| Evento | Entrada: ação executada |
| Ação (filtro) | Mirar |
| Ação | Chamar método |
| Método | Volume: definir peso |
| Valor | 1 |
| Receptor | o Volume de mira |

Uma segunda conexão com **Entrada: ação cancelada** e Valor 0 devolve o peso.

${shot('scripts/player-input-flow.webp', 'Conexão de evento com Entrada: ação executada filtrada por Mirar', 'Entrada do jogador na Conexão de evento.')}

## 3b. Em C#

\`\`\`csharp
using Astra;
using Astra.Components;

[ComponentId("meujogo.ouve-mirar")]
public sealed class OuveMirar : Behavior
{
    [PropertyId("indice_mirar")] public int IndiceMirar = 4;   // posição da ação no mapa, a partir de 1

    public override void Start()
    {
        if (Object.GetComponent<PlayerInput>() is not { } entrada) return;
        entrada.Performed(this, acao => { if (acao == IndiceMirar) Scene.Log(ObjectId, "Mirando"); });
        entrada.Canceled(this, acao => { if (acao == IndiceMirar) Scene.Log(ObjectId, "Mira solta"); });
    }
}
\`\`\`

O evento entrega o **índice** da ação no mapa (a partir de 1), só no quadro em que ela é apertada ou solta. Para saber se está segurada a cada quadro, continue usando \`Input.Pressed("Mirar")\`.

## Limites

Até 32 ações observadas; o índice depende da ordem no mapa; troca de esquema de controle e vários jogadores locais não existem.
`),
];
