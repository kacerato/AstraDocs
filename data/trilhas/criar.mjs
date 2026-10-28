import { trail, badge, shot, to } from './tools.mjs';

const t = (slug, title, description, body) => trail('criar', slug, title, description, body);
const current = '/pt-br/snapshot-2026-10-28';
const ficha = (id, label) => `[${label}](${current}/componentes/${id.replaceAll('.', '-').replaceAll('_', '-')}/)`;
const codeNote = '> O código abaixo foi conferido contra a fachada C# do APK; a execução no aparelho desta receita ainda não foi registrada.';

export const createTrail = [
t('cena-luz-ceu-clima', 'Cena, luz, céu, dia e noite e clima', 'Do projeto vazio a uma cena com sol que anda, céu que muda de cor, lua à noite, nuvens e chuva.', `
${badge('device', 'cada recurso conferido no POCO F7 na Vila Astra entre 19 e 27/10')}

Você vai montar o céu de uma cena: o sol que anda com a hora, a noite com lua e estrelas, nuvens que fazem sombra e um clima que chove ou neva.

## 1. Sol com dia e noite

**+** › **Luzes › Sol com dia e noite**. Ele cria duas luzes direcionais, o **Sol** (com o componente **Hora do dia**) e a **Lua**.

${shot('criar/sol-dia-noite.webp', 'Inspector do Sol com a Hora do dia e a Vila ao entardecer', 'Hora do dia no Inspector do Sol.')}

No Inspector do Sol, em **Hora do dia**:

| Campo | Experimente | O que acontece |
| --- | --- | --- |
| Hora | 12, depois 17,4, depois 22 | Meio-dia azul; poente avermelhado com sombras longas; noite com a Lua e estrelas |
| Duração do dia | 24 | Um dia inteiro passa em 24 minutos no Play (0 deixa a hora parada) |
| Latitude, Dia do ano, Norte | -15, 172, 0 | Onde e quando o sol nasce; a fase da lua sai da data |

A Hora do dia gira o objeto do sol de verdade: a rotação aparece no Inspector. A **Lua** da receita segue a própria órbita: nasce um pouco mais tarde a cada dia, e a lua cheia fica no céu do anoitecer ao amanhecer. Ficha completa: ${ficha('astra.render.time_of_day', 'Hora do dia')}.

## 2. Exposição para a noite ficar escura

Num ciclo inteiro, a imagem precisa se ajustar como o olho. **+** › **Volume e céu › Ambiente** cria o Volume da cena; no cartão **Exposição**, deixe o Modo **Automática** (é o padrão de um Ambiente novo). Com Exposição Fixa, o poente fica escuro demais e a noite clara demais.

Para a noite não virar dia cinza, ponha **Exposição › Limite mínimo** perto de **−5,5 EV100** (como o Volume noturno da Unity). Na Vila Astra, assim, a lua cheia fica 3,6 EV abaixo do meio-dia e a lua nova 7,6 EV: céu quase preto, só postes, janelas e estrelas.

## 3. Nuvens

**+** › **Volume e céu › Volume de nuvens** cria um Volume que só mexe nas nuvens. No cartão **Nuvens**, escolha o **Tipo**:

| Tipo | Como fica | Custo no POCO F7 |
| --- | --- | --- |
| Camada 2D | uma camada pintada no céu, com vento e sombra no chão | cerca de +0,7 ms de GPU |
| Volumétricas | cúmulos com volume até o horizonte, como as Volumetric Clouds do HDRP | cerca de +1,5 ms de GPU |

${shot('criar/nuvens-volumetricas.webp', 'Vila Astra com nuvens volumétricas douradas no fim de tarde', 'Nuvens volumétricas na hora dourada.')}

Campos para começar: **Cobertura** 0,6 (0 céu limpo, 1 encoberto; perto de 0,7 as nuvens ficam separadas), **Velocidade do vento** 20 km/h, **Projetar sombras** ligado. Nas Volumétricas aparecem também:

| Campo | Padrão | O que faz |
| --- | --- | --- |
| Espessura | 900 m | altura dos cúmulos acima da base; 0 vira folha plana |
| Fator de forma | 0,8 | quanto o ruído recorta a cobertura; mais alto, nuvens mais separadas |
| Erosão | 0,6 | corrói as bordas em rolos finos |
| Passos | 24 | amostras por raio; mais passos, mais detalhe e mais custo |

Com Hora do dia, a cor acompanha o sol: no fim de tarde o lado do sol fica dourado e a sombra cinza-arroxeada; depois do crepúsculo a luz passa para a Lua. Com a câmera parada, as volumétricas tremem pouco (a diferença entre quadros caiu 56% nesta versão).

## 4. Clima

**+** › **Volume e céu › Clima** cria um Ambiente com o componente **Clima** e os filhos **Chuva**, **Neve**, **Chão da chuva** e **Respingos**.

${shot('criar/clima-chuva.webp', 'Vila Astra com chuva, chão molhado e poças', 'Clima com Tipo Chuva no Play.')}

1. No Inspector do Clima, **Tipo = Chuva**, **Intensidade = 0,7**.
2. Aperte **Play**: as gotas caem acompanhando a câmera, o chão escurece em uns 20 s e empoça nos pisos planos.
3. Troque para **Neve**: céu aberto, sol e neve acumulando nos telhados. **Tempestade** acrescenta relâmpagos.

**Variação natural** faz a chuva engrossar e afinar sozinha. Ficha completa: ${ficha('astra.environment.weather', 'Clima')}.

## 5. Mudar o clima por script

${codeNote}

Ponha este script no objeto do Clima: a cada minuto ele alterna entre chuva e tempo limpo, e a **Transição** do Clima suaviza a troca.

\`\`\`csharp
using Astra;
using Astra.Components;

[ComponentId("meujogo.clima-alternado")]
public sealed class ClimaAlternado : Behavior
{
    private float tempo;

    public override void Update(float seconds)
    {
        tempo += seconds;
        if (tempo < 60) return;
        tempo = 0;
        if (Object.GetComponent<Weather>() is not { } clima) return;
        clima.Kind = clima.Kind == Weather.KindOption.Chuva
            ? Weather.KindOption.Limpo
            : Weather.KindOption.Chuva;
    }
}
\`\`\`

## Limites

- A chuva ainda entra sob telhados; raio desenhado e trovão não existem.
- Cenas com Exposição Fixa herdada não acompanham o dia e a noite: troque para Automática e ponha o Limite mínimo.
- A sombra das nuvens no chão segue a camada 2D, mesmo com as Volumétricas.
- Custo medido no POCO F7: nuvens 2D cerca de +0,7 ms de GPU, volumétricas cerca de +1,5 ms; chuva cerca de +0,8 ms.
`),

t('particulas', 'Partículas: fogo, faíscas e chuva', 'Crie um fogo animado e faíscas que iluminam o chão, ajuste os módulos e controle pelo script.', `
${badge('device', 'Folha de textura, Material do projeto e Luzes das faíscas vistos no POCO F7 em 24/10')}

## 1. Criar o efeito

**+** › **Efeitos › Partículas** cria um emissor com o componente **Sistema de partículas**. **Efeitos › Faíscas** já vem com trilha e luzes.

${shot('criar/particulas-inspector.webp', 'Inspector do Sistema de partículas com os módulos empilhados', 'Módulos do Sistema de partículas.')}

Os módulos ficam empilhados na ordem da Unity, cada um com interruptor no cabeçalho. O cartão **Prévia** tem o botão ▶, que reinicia a prévia no editor.

## 2. Um fogo

| Módulo | Campo | Valor |
| --- | --- | --- |
| Principal | Vida inicial | 1,2 s |
| Principal | Tamanho inicial | 0,6 |
| Emissão | Taxa por segundo | 40 |
| Forma | Forma / Ângulo | Cone / 15° |
| Tamanho no tempo | ligado | curva que cai de 1 a 0 |
| Cor no tempo | ligado | amarelo → laranja → vermelho transparente |

Para a chama animada, crie um Material do projeto com shader **Particles Unlit**, Surface **Aditivo** e uma imagem de folha de quadros; escolha-o em **Material** e ligue **Folha de textura** com Colunas 4, Linhas 4.

## 3. Faíscas que iluminam

**Efeitos › Faíscas** cria um sistema com **Trilhas** e **Luzes** e um filho desativado **Luz modelo**: cada faísca escolhida pela **Proporção** copia essa luz. Numa cena noturna, o chão em volta acende e muda conforme as faíscas sobem e caem. O **Máximo de luzes** limita quantas acendem.

## 4. Controlar pelo script

${codeNote}

\`\`\`csharp
using Astra;
using Astra.Components;

[ComponentId("meujogo.explosao")]
public sealed class Explosao : Behavior
{
    private float espera;

    public override void Update(float seconds)
    {
        espera += seconds;
        if (espera < 3) return;
        espera = 0;
        if (Object.GetComponent<ParticleSystem>() is { } fx)
            fx.Emit(30);   // 30 partículas de uma vez, a cada 3 s
    }
}
\`\`\`

Também existem \`Play()\`, \`Stop()\`, \`StopAndClear()\`, \`Pause()\`, \`Clear()\` e \`IsPlaying()\`. Ficha completa: ${ficha('astra.effects.particle_system', 'Sistema de partículas')}.

## Limites e custo

- Colisão: **Planos** (até dois objetos escolhidos) ou **Mundo** (os colisores da física do Play, com um raio por partícula e teto por quadro).
- Custo no POCO F7: 1.000 faíscas ~0,26 ms de GPU; quads grandes cobrindo a tela custam mais pelo preenchimento.
- Em aparelho sem descritores bindless, o Material do projeto cai para a textura própria.
`),

t('lightmap', 'Lightmap: assar a luz de um interior', 'Asse a luz das lanternas num interior, com rebote colorido, e use sondas para o que se move.', `
${badge('device', 'Sponza e Vila Astra assadas no POCO F7 em 24 e 25/10')}

O lightmap guarda numa textura a luz que não muda (das lâmpadas e do rebote nas paredes). O aparelho deixa de calcular essas luzes a cada quadro: na Sponza com 8 luzes, a GPU caiu de 18,58 para 13,18 ms.

## 1. Preparar os objetos

1. Selecione as paredes, o chão e os objetos que não se movem. No Inspector, toque **Objeto · Tag / Layer / Static** e ligue **Static**.
2. No **Mesh Renderer › Iluminação**, deixe **Contribuir para iluminação global** ligado e **Receber iluminação global = Lightmaps**.
3. Os objetos precisam de **UV2**. Ao importar um modelo, ligue **Gerar UV de lightmap** no Perfil. Na janela Iluminação, o contador **Sem UV2** seleciona quem falta.

## 2. Escolher as luzes assadas

Em cada lâmpada, **Luz › Modo**:

| Modo | O que vai para o lightmap | No quadro |
| --- | --- | --- |
| Tempo real | nada | luz e sombra calculadas sempre |
| Misto | só o rebote | a luz direta continua em tempo real |
| Assado | luz direta e rebote | sai do tempo real, inclusive a sombra |

O sol e a lua da Hora do dia nunca são assados: o céu de cada hora reescala o lightmap.

## 3. Gerar

${shot('criar/lightmap-gerar.webp', 'Aba Lightmaps durante o bake, com o progresso', 'Gerar iluminação em andamento.')}

**☰ › Iluminação › Lightmaps › Gerar iluminação**. O bake roda em segundo plano (Cancelar preserva o lightmap anterior). Na Sponza levou 156 s; a Vila Astra, 32 s. As **sondas de luz** da cena são assadas no mesmo passo.

Ajustes em **Configurações de iluminação**: Resolução (texels por metro), Rebotes, Amostras, Remover ruído, Intensidade indireta. Ficha completa: ${ficha('astra.render.lighting_settings', 'Iluminação da cena')}.

## 4. Conferir

No viewport, a seta de **Sky/Fog/Post** tem o modo **Lightmap assado**: mostra só o que o lightmap guardou, sem textura de cor.

### Por que o assado parece mais escuro?

Como na Unity, o lightmap guarda a luz **difusa** e o rebote; o **brilho especular** das lâmpadas (o reflexo da luz em superfícies lisas) fica só no tempo real. Em tempo real, só duas luzes pontuais por quadro fazem sombra; assadas, todas fazem. Comparando igual com igual (mesma sombra dos dois lados e sem o especular), o assado da Sponza ficou 5% acima do tempo real.

## 5. O que se move

Personagens e objetos móveis não usam lightmap. Ponha um **Grupo de sondas de luz** (**+ › Luzes**) cobrindo onde eles andam; o Gerar iluminação assa as sondas com as mesmas luzes. No Mesh Renderer deles, **Sondas de luz = Misturar sondas**.

## Limites

- Ainda não validado no aparelho: a comparação com o ambiente zerado e a caminhada de 24 h.
- Malhas com skin ou blend shape não recebem UV2 gerada.
`),

t('volume-e-pos', 'Volume e pós-processamento: o visual da cena', 'Use o Volume para mudar a cor, o brilho, o desfoque e o clima de uma área, com perfis compartilhados.', `
${badge('device', 'Volume, overrides e 12 efeitos medidos no POCO F7 em 22 e 23/10')}

O **Volume** (componente Ambiente) guarda num **perfil** os efeitos de imagem: exposição, cor, bloom, desfoque, vinheta… Um Volume global vale na cena inteira; um em caixa ou esfera vale só com a câmera dentro.

## 1. O Volume global

**+** › **Volume e céu › Volume global**. Ele nasce sem sobrescrever nada.

${shot('editor/volume-overrides.webp', 'Inspector de um Volume com cartões de override e o menu Adicionar override', 'Cartões de override do Volume.')}

1. Toque **Adicionar override** › **Pós-processamento › Bloom**. O cartão entra com os parâmetros desmarcados.
2. Marque **Intensidade do bloom** e ponha 0,5; marque **Limiar do bloom** e ponha 0,9. As luzes fortes ganham brilho.
3. **ALL** marca todos; um parâmetro desmarcado vem do Volume de baixo.

## 2. Visuais prontos

No cartão **Cor**, toque num dos sete visuais: Neutro, Cinemático, Dia quente, Entardecer, Noite azul, Tempestade, Fantasia. O **Ajuste fino** mexe em balanço de branco, Lift/Gamma/Gain e Sombras/Médios/Realces.

## 3. Uma área com outro clima de imagem

1. **+** › **Volume e céu › Volume em caixa**. Ajuste a caixa em volta de uma caverna.
2. Ponha **Prioridade** maior que a do Volume global.
3. Adicione **Ajustes de cor** (Pós-exposição -1, Saturação 0,6) e **Vinheta** (Intensidade 0,4).

Ao entrar na caixa, a imagem escurece e dessatura; ao sair, volta. A mistura começa a 1 m da borda.

## 4. Perfil compartilhado

Em **Perfil**, **Novo** cria um perfil vazio e **Clonar** copia o atual. Dois Volumes com o mesmo perfil mudam juntos.

## 5. Efeitos e custo no POCO F7

| Efeito | Custo medido |
| --- | --- |
| Profundidade de campo (Gaussian ou Bokeh) | 2 a 3,5 ms a mais; não roda com o ampliador temporal |
| Desfoque de movimento, aberração cromática, distorção de lente, vinheta, curvas | dentro do ruído da medição |
| Gradação de cor por LUT | +0,09 ms |

Ficha completa: ${ficha('astra.render.environment', 'Ambiente (Volume)')}.

## Limites

- A sujeira da lente, a edição das curvas pelo toque e Novo/Clonar pelo toque não foram testados no aparelho.
- A Câmera escolhe os Volumes pela **Máscara de volume** (camadas do objeto).
`),

t('publicar-o-jogo', 'Publicar o jogo (Exportar APK)', 'Gere o APK do seu jogo, assinado, a partir da tela de Projetos. Função experimental.', `
${badge('partial', 'Exportar APK continua experimental')}

O seu jogo vira um APK próprio, que roda sem o editor.

## 1. Salve o projeto

O exportador usa o projeto **salvo**: salve no editor antes ("Salve no editor antes de exportar").

## 2. Exportar

Na tela de **Projetos**, no cartão do projeto, toque **Exportar APK**.

${shot('criar/exportar-apk.webp', 'Tela Exportar APK com identidade e assinatura', 'Exportar APK.')}

1. **Identidade:** Nome no Android, Identificador exclusivo (por exemplo \`com.meunome.meujogo\`), Versão visível e Número da versão.
2. **Assinatura:** **Criar chave** ou **Importar chave .p12**. Depois de criar, toque **Guardar cópia da chave**: sem a mesma chave, você não consegue atualizar o jogo instalado.
3. **Gerar APK.** Ao terminar ("APK assinado e verificado…"), toque **Salvar APK**.

## O que vai e o que não vai no APK

- Vai: as cenas, recursos e scripts do projeto.
- Não vai: telemetria. O exportador tira a permissão de internet e recusa o APK se ela sobrar.

## Limites

- Função experimental: teste o APK gerado antes de distribuir.
- Não há publicação direta em lojas.
`),
];
