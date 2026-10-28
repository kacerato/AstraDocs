import { trail, badge, shot, to } from './tools.mjs';

const s = (slug, title, description, body) => trail('scripts', slug, title, description, body);
const api = name => `[${name}](/pt-br/snapshot-2026-10-28/api/astra-components-${name.toLowerCase()}/)`;
const codeNote = '> Conferido contra a fachada C# do APK (tipos e membros um a um); a execução desta receita no aparelho ainda não foi registrada.';

export const scriptsTrail = [
s('como-funciona', 'Como um script funciona', 'Criar um componente C#, ligar a um objeto, os métodos que rodam a cada quadro, campos no Inspector e como achar outros componentes.', `
${badge('host', 'API e fluxo de compilação conferidos na fonte')}

Um script da Astra é um **componente C#**: uma classe que herda de \`Behavior\` e é adicionada a um objeto como qualquer outro componente.

## Criar e ligar

1. No painel **Arquivos**, toque o ícone de **código** › **Novo componente C#**.
2. Escreva o código, toque **Salvar tudo** e **Recompilar projeto**. Erros aparecem no console do espaço Código.
3. No objeto, **Adicionar componente** › **Scripts do projeto** › o seu script.

O Play só começa com a compilação em dia ("Aguarde a compilação antes de Play").

## O esqueleto

\`\`\`csharp
using Astra;
using Astra.Components;

[ComponentId("meujogo.girar")]          // identidade única no projeto
public sealed class Girar : Behavior
{
    [PropertyId("graus_por_segundo")]    // aparece no Inspector
    public float GrausPorSegundo = 90;

    public override void Start() { }                 // uma vez, ao começar o Play
    public override void Update(float seconds) { }   // a cada quadro
    public override void FixedUpdate(float seconds) { } // a cada passo da física
    public override void Disable() { }               // quando o componente é desligado
}
\`\`\`

## Achar e mudar componentes

\`Object.GetComponent<T>()\` devolve o componente do mesmo objeto, ou nada:

\`\`\`csharp
if (Object.GetComponent<Light>() is { } luz)
    luz.Intensity = 2;
\`\`\`

Cada componente nativo tem uma fachada com os campos do Inspector (por exemplo ${api('Light')}, ${api('TimeOfDay')}, ${api('Weather')}). A lista completa está na [Referência C#](/pt-br/snapshot-2026-10-28/api/).

## Entrada e registro

- \`Input.Pressed("Saltar")\` diz se a ação está apertada; as ações vêm de **Configurações do projeto › Entrada**.
- \`Scene.Log(ObjectId, "mensagem")\` escreve no console.

Exemplo completo com entrada: ${to('criar', 'fazer-um-player', 'o script Correr do Fazer um player')}.
`),

s('flow-sem-codigo', 'Flow: eventos sem código (Conexão de evento)', 'Ligue um evento de um objeto a uma ação em outro, sem escrever código: porta que abre, efeito que toca, sonda que recaptura.', `
${badge('device', 'Hora do dia, Volume, Malha, Sonda e Entrada rodaram no POCO F7 em Flow em 26/10')}

A **Conexão de evento** escuta um evento deste objeto e aciona outro objeto. Crie por **+** › **Gameplay › Conexão de evento**, ou adicione o componente a um objeto existente.

| Campo | O que escolher |
| --- | --- |
| Evento | o que acontece neste objeto |
| Ação | Ativar, Desativar ou Alternar objeto, ou Chamar método |
| Método | quando a Ação é Chamar método: o comando no receptor |
| Receptor | o objeto que reage |
| Outro objeto | filtra quem provocou (por exemplo, só o jogador) |
| Uma vez | desliga a conexão depois do primeiro disparo |

## Eventos disponíveis

**Hora do dia** (hora mudou, nascer do sol, pôr do sol, dia mudou); **Entrada** (ação executada, ação cancelada, com o filtro **Ação**); Timer, Tween e Sequência; Sensor 3D (entrou, saiu, dentro) e Colisão 3D (começou, terminou), e os mesmos em 2D; Junta quebrou; Personagem bateu num colisor; Cérebro e Câmera virtual; Animator (estado, evento, grupo, mistura interrompida); Agente de navegação (chegou, caminho falhou, entrou num link); eventos de clipe; Interação (mão alcançou, soltou, objeto levantado, gatilho); **Partículas: parou**.

## Comandos (Chamar método)

Áudio (tocar, parar, pausar, retomar), Timer, Tween, Percurso, Sequência, Raio e Varredura (atualizar agora), Câmera virtual (priorizar, encaixar), Snapshot de mixer, Agente (parar, retomar), Personagem: subir/descer, **Sonda de reflexo: capturar agora**, **Partículas: tocar, parar, parar e limpar, pausar, limpar**, **Volume: definir peso** (usa o Valor), **Volume: trocar perfil** e **Volume: usar cópia do perfil** (com o **Perfil** escolhido no próprio cartão) e **Malha: trocar material** (com o **Material** escolhido no cartão).

## Exemplo: postes que acendem ao anoitecer

No Sol (com Hora do dia), duas conexões: **Hora do dia: pôr do sol** → **Ativar objeto** = o grupo Postes; **Hora do dia: nascer do sol** → **Desativar objeto** = Postes. Validado no POCO F7.

## Exemplo: fogueira que acende ao chegar perto

1. Crie o fogo (${to('criar', 'particulas', 'Partículas')}) e desligue **Tocar ao iniciar** se quiser que comece apagado.
2. **+** › **Física › Sensor de caixa** em volta da fogueira.
3. No sensor, **Conexão de evento**: Evento **Sensor 3D: entrou**, Ação **Chamar método**, Método **Partículas: tocar**, Receptor = o fogo, Outro objeto = o jogador.
4. Play: ao entrar na caixa, o fogo acende.

${shot('scripts/conexao-evento.webp', 'Inspector da Conexão de evento com Sensor 3D: entrou e Partículas: tocar', 'Conexão de evento.')}

## Limites

A Conexão liga um evento a uma ação; regras com estado (contar moedas, vida) pedem um script.
`),

s('graficos-por-script', 'Gráficos por script: hora, clima, luz, partículas e sondas', 'Exemplos curtos em C# para mudar a hora do dia, o clima, a luz, o Volume, soltar partículas e recapturar uma sonda.', `
${badge('host', 'fachadas conferidas na fonte do APK')}

${codeNote}

Cada exemplo vai num objeto que tem o componente usado. Os nomes dos campos são os da fachada C# gerada a partir do Inspector.

## Acelerar o dia (Hora do dia)

No objeto do Sol com a ${api('TimeOfDay')}:

\`\`\`csharp
[ComponentId("meujogo.dia-rapido")]
public sealed class DiaRapido : Behavior
{
    public override void Start()
    {
        if (Object.GetComponent<TimeOfDay>() is { } hora)
        {
            hora.Hour = 6;               // começa ao amanhecer
            hora.DayLengthMinutes = 4;   // um dia inteiro em 4 minutos
        }
    }
}
\`\`\`

## Trocar o clima (Clima)

No objeto do ${api('Weather')}:

\`\`\`csharp
if (Object.GetComponent<Weather>() is { } clima)
{
    clima.Kind = Weather.KindOption.Tempestade;
    clima.Intensity = 0.9f;   // a Transição do Clima suaviza a troca
}
\`\`\`

## Piscar uma luz (Luz)

\`\`\`csharp
[ComponentId("meujogo.luz-piscando")]
public sealed class LuzPiscando : Behavior
{
    private float t;
    public override void Update(float seconds)
    {
        t += seconds;
        if (Object.GetComponent<Light>() is { } luz)
            luz.Intensity = t % 1 < 0.1f ? 0 : 3;   // apaga 0,1 s a cada segundo
    }
}
\`\`\`

## Pesar um Volume (Ambiente)

O efeito precisa estar no perfil do Volume (override adicionado). Pelo ${api('EnvironmentVolume')}:

\`\`\`csharp
if (Object.GetComponent<EnvironmentVolume>() is { } volume)
    volume.Weight = 1;   // 0 não influencia, 1 aplica todo o perfil
\`\`\`

## Soltar partículas (Sistema de partículas)

\`\`\`csharp
if (Object.GetComponent<ParticleSystem>() is { } fx)
{
    fx.Emit(30);
    if (!fx.IsPlaying()) fx.Play();
}
\`\`\`

## Recapturar uma sonda (Sonda de reflexo)

Com a sonda em **Tipo** Tempo real e **Atualização** Por script:

\`\`\`csharp
if (Object.GetComponent<ReflectionProbe>() is { } sonda)
    sonda.RenderProbe();
\`\`\`

O fim da recaptura ainda não é avisado ao script.

## Com os nomes da Unity

Os mesmos recursos também têm a API com os nomes e as assinaturas da Unity (Volume.Profile, VolumeProfile.TryGet, TimeOfDay.Current com eventos, Material.SetFloat): veja ${to('scripts', 'api-grafica', 'API gráfica com os nomes da Unity')}.
`),
];
