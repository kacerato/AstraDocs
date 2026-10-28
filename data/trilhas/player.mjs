import { trail, badge, shot, to } from './tools.mjs';

const current = '/pt-br/snapshot-2026-10-28';

export const playerPage = trail('criar', 'fazer-um-player', 'Fazer um player', 'Do projeto vazio a um personagem que anda, pula, corre e colide, com câmera em órbita, controles de toque e animação, rodando no Play do celular.', `
${badge('partial', 'roteiro conferido na fonte; o giro do Personagem foi visto no POCO F7 em 27/10; a execução completa entra com a rodada de capturas')}

Ao final você terá um personagem que anda com o joystick de toque e vira para onde anda, olha arrastando o dedo, pula, corre segurando um botão, para nas paredes e troca entre parado e andando.

## O que o Play já dá de graça

No Play do editor, o toque já controla o personagem sem você montar nenhuma interface:

- **metade esquerda da tela:** um joystick aparece onde você encosta o dedo (ação **Mover**);
- **metade direita:** arrastar gira a câmera (ação **Olhar**);
- **botão Saltar:** aparece quando há um personagem com Velocidade do salto maior que zero.

O projeto novo já vem com essas três ações no mapa de entrada. Quem recebe o controle é o personagem ligado à câmera (o alvo da Câmera virtual ou da Câmera seguidora).

## 1. Projeto

Na tela de Projetos, **Novo projeto** › nome \`MeuPlayer\` › **Criar projeto**.

${shot('player/01-novo-projeto.webp', 'Folha Novo projeto vazio com o nome MeuPlayer', 'Projeto novo.')}

## 2. Chão com colisão

Uma malha sozinha não colide: no Play, só têm física os objetos com **Corpo físico** e **Colisor 3D**.

1. **+** › **Geometria › Chão**. Ele nasce como uma caixa de 20 × 0,2 × 20 m com o topo na altura 0.
2. No Inspector, **Adicionar componente** › **Corpo físico** (o padrão é Estático).
3. **Adicionar componente** › **Colisor 3D** (o padrão é Caixa, que acompanha a escala do objeto e cobre o chão inteiro).

${shot('player/02-chao.webp', 'Chão selecionado com Corpo físico Estático e Colisor 3D Caixa no Inspector', 'Chão com Corpo físico e Colisor 3D.')}

## 3. Paredes

- **Parede visível:** **+** › **Geometria › Cubo**, escala 10 × 3 × 0,5, posição Y 1,5, e os mesmos **Corpo físico** e **Colisor 3D** do chão.
- **Parede invisível:** **+** › **Física › Caixa de colisão** (corpo estático sem malha).

## 4. Personagem

**+** › **Física › Personagem cilíndrico** cria a raiz com o componente **Personagem** e um cilindro como visual. Ponha a posição Y em 0,1, logo acima do chão.

No Inspector do Personagem, para começar:

| Campo | Valor | Por quê |
| --- | --- | --- |
| Velocidade | 4 m/s | o padrão (8) é rápido para andar |
| Aceleração | 20 | arranca sem escorregar |
| Frenagem | 25 | para logo ao soltar o joystick |
| Controle no ar | 0,5 | dá para corrigir o salto no ar |
| Velocidade do salto | 5 (padrão) | maior que zero faz o botão Saltar aparecer |
| Fonte de controle | Automático (padrão) | toque, teclado, gamepad e script disputam pela prioridade |
| Girar para a direção do movimento | ligado | o corpo vira para onde anda, suavizado (grupo **Direção**) |
| Relativo à câmera | ligado (padrão) | o joystick para cima anda para onde a câmera olha |

${shot('player/04-personagem.webp', 'Inspector do Personagem com Velocidade 4 e a Posse de controle em Automático', 'Inspector do Personagem.')}

**Com um modelo seu (.glb ou .fbx):** importe o modelo, selecione a malha, segure o dedo na linha da Hierarquia e escolha **Criar raiz Character…**. A cápsula é medida pelo modelo, a malha vira filha, a raiz fica no pé e **Girar para a direção do movimento** já vem ligado.

No grupo **Direção** também ficam **Velocidade do giro** (720 °/s) e **Suavização do giro** (0,12 s, como o Rotation Smooth Time do Third Person Controller da Unity). Em C#: \`Character.FaceMovement\`, \`CameraRelative\`, \`FaceTurnSpeed\` e \`RotationSmoothTime\`.

Ficha completa: [Personagem](${current}/componentes/astra-physics-character/).

## 5. Câmera

1. Selecione o personagem.
2. **+** › **Básicos › Câmera virtual**. Ela já vem em **Órbita**, **Olhar para o alvo**, com **Evitar obstáculos** e **Alvo rastreado** = o personagem. A **Main Camera**, que o projeto novo já traz, ganha um **Cérebro** e passa a seguir a Câmera virtual.
3. Na Câmera virtual, **Raio da órbita** = 4.

**Controlar pela entrada de olhar** já vem ligado: no Play, arrastar na metade direita gira a órbita. A Main Camera já tem a marca **MainCamera**, que define a câmera do jogo; se criar outras câmeras, deixe a marca só nela.

${shot('player/05-camera.webp', 'Câmera virtual com Órbita e Alvo rastreado no personagem', 'Câmera virtual.')}

## 6. Primeiro Play

Toque **▶**. O joystick à esquerda move o personagem relativo à câmera e o corpo vira para onde anda, arrastar à direita gira a câmera, **Saltar** pula e as paredes bloqueiam.

${shot('player/06-play.webp', 'Play com o joystick de toque, o botão Saltar e o personagem perto da parede', 'O personagem no Play.')}

## 7. Botão Correr

1. **☰** › **Configurações do projeto** › **Entrada**.
2. **+ Ação**. Na aba **Ação**, **Nome** = \`Correr\`. Na aba **Vínculos**, confira **Fonte** = **Botão touch** (o código fica em **Avançado**).
3. A seção passa a mostrar 4 ações: Mover, Olhar, Saltar e Correr. No Play aparece o botão **Correr** ao lado de **Saltar**.

${shot('player/07-entrada.webp', 'Configurações do projeto na seção Entrada com as quatro ações', 'Mapa de entrada com a ação Correr.')}

## 8. O script de correr

No painel Arquivos, toque o ícone de **código** › **Novo componente C#**, cole o código, **Salvar tudo** e **Recompilar projeto**. Na raiz do personagem, **Adicionar componente** › **Scripts do projeto** › **Correr**.

> Conferido contra a API C# do APK (tipos e membros um a um); a compilação e o Play no aparelho entram com a rodada de capturas.

\`\`\`csharp
using Astra;
using Astra.Components;

[ComponentId("tutorial.correr")]
public sealed class Correr : Behavior
{
    [PropertyId("acao")] public string Acao = "Correr";
    [PropertyId("multiplicador")] public float Multiplicador = 1.8f;

    private Character personagem;
    private bool pronto;
    private float velocidadeBase;

    public override void Start()
    {
        var encontrado = Object.GetComponent<Character>();
        if (encontrado is null)
        {
            Scene.Log(ObjectId, "Correr: coloque este script no objeto que tem Personagem");
            Enabled = false;
            return;
        }
        personagem = encontrado.Value;
        velocidadeBase = personagem.Speed;
        pronto = true;
        if (!Input.Exists(Acao))
            Scene.Log(ObjectId, "Correr: crie a ação '" + Acao + "' em Configurações do projeto › Entrada");
    }

    public override void Update(float deltaTime)
    {
        if (!pronto || !personagem.IsAlive) return;
        var alvo = Input.Pressed(Acao) ? velocidadeBase * Multiplicador : velocidadeBase;
        if (personagem.Speed != alvo) personagem.Speed = alvo;
    }

    public override void Disable()
    {
        if (pronto && personagem.IsAlive) personagem.Speed = velocidadeBase;
    }
}
\`\`\`

O que cada parte faz:

- \`[ComponentId]\` dá a identidade do componente no projeto; \`[PropertyId]\` faz o campo aparecer no Inspector (dá para trocar o multiplicador sem mexer no código).
- \`Start\` acha o **Personagem** no mesmo objeto e guarda a velocidade original.
- \`Update\`, a cada quadro, usa a velocidade maior enquanto **Correr** está apertado. A física relê a velocidade a cada passo, então muda na hora.
- \`Disable\` devolve a velocidade original.

### Sem script: reagir ao botão com a Entrada do jogador

Para ações que só disparam algo (tocar um som, acender uma luz, ligar um efeito), não precisa de código: no personagem, **Adicionar componente** › **Entrada do jogador**, marque **Correr** em **Ações** e, numa **Conexão de evento**, use **Entrada: ação executada** com o filtro **Ação = Correr**. Detalhes em ${to('scripts', 'entrada-do-jogador', 'Entrada do jogador')}. Para mudar a velocidade enquanto o botão está segurado, o script acima continua sendo o caminho.

## 9. Animação (com um modelo seu)

O cilindro não anima. Com um modelo importado que tenha clipes de parado e andar:

1. Selecione o visual (o filho com a malha) › **+** › **Gameplay › Animator**.
2. No Inspector, **Abrir grafo do Animator** › **Criar recurso**.
3. **+ Float**, nome \`Velocidade\`, **Fonte** = **Velocidade no plano**, **Resposta** 0,1 s. Em **Corpo / motor**, escolha a raiz do personagem.
4. **+Estado** duas vezes: \`Parado\` e \`Andar\`, tipo **Clipe**, cada um com seu clipe. Em Parado, **Definir como padrão**.
5. **Ligar** Parado → Andar com **+ condição** Velocidade **Maior que** 0,2 e **Tempo de saída** desligado; e Andar → Parado com **Menor que** 0,2.

O Animator lê a velocidade do Personagem sozinho, sem script. Alternativa: um estado **Mistura 1D** com o parâmetro Velocidade e os dois clipes.

${shot('player/09-animator.webp', 'Grafo do Animator com Parado e Andar e a condição Velocidade maior que 0,2', 'Grafo do Animator.')}

## 10. Interface de toque própria (opcional)

Para desenhar seus próprios controles: **☰** › **Interface (UI + ImGui)** › composição **HUD / controles touch** (cria um Joystick e o botão Saltar) › **Salvar**. Num objeto, adicione **Canvas UI** com **Documento UI** = o arquivo salvo e **Jogador / receptor** = o personagem. Detalhes na trilha [UI de jogo e HUD](/pt-br/snapshot-2026-10-06/ui/comece-aqui/).

## Limites

- A **Velocidade no plano** do Animator usa a velocidade pedida ao Personagem: contra uma parede, ele pode continuar em Andar.
- Os controles automáticos (joystick, olhar, Saltar) são do Play do editor; no APK exportado, monte a interface de toque do passo 10.
- O que você muda durante o Play volta ao parar.
- Próximo passo: ilumine a cena do seu player em ${to('criar', 'cena-luz-ceu-clima', 'Cena, luz, céu e clima')}.
`);
