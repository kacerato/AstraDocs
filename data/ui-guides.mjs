// Authored public examples. Engine source is used for review, never copied here.
export const heartExamples = [
  { id:'heart-hud', filename:'PlayerHealth.cs', description:'Vida de três corações, dano e cura com limites.', prerequisites:'Anexar PlayerHealth ao objeto Jogador.', code:`using System;
using Astra;

[ComponentId("docs.player-health")]
public sealed class PlayerHealth : Behavior
{
    public const int Capacity = 3;
    public int Current { get; private set; }
    public bool IsDead => Current == 0;

    public override void Awake() => Current = Capacity;

    public void TakeDamage(int amount)
    {
        Current = Math.Max(0, Current - Math.Clamp(amount, 0, Capacity));
    }

    public void Heal(int amount)
    {
        Current = Math.Min(Capacity, Current + Math.Clamp(amount, 0, Capacity));
    }
}` },
  { id:'heart-hud', filename:'HeartHud.cs', description:'Conecta Images autoradas à vida do jogador e a dois botões de demonstração.', prerequisites:'Canvas UI no objeto HUD; documento com Heart1–3, Status, Damage e Heal; referência Player atribuída.', code:`using System;
using Astra;

[ComponentId("docs.heart-hud")]
public sealed class HeartHud : Behavior
{
    [PropertyId("player")]
    public ObjectReference Player;

    private GuiAccess hud = null!;
    private PlayerHealth health = null!;
    private readonly GuiElement[] hearts = new GuiElement[PlayerHealth.Capacity];
    private GuiElement status;
    private int lastHealth = -1;

    public override void Start()
    {
        var player = Resolve(Player)
            ?? throw new InvalidOperationException("Atribua Jogador ao campo Player do HeartHud.");
        health = player.GetBehavior<PlayerHealth>()
            ?? throw new InvalidOperationException("Jogador precisa de PlayerHealth.");
        hud = Gui.ForCanvas(Object);
        for (int i = 0; i < hearts.Length; ++i)
        {
            hearts[i] = hud.Find($"Heart{i + 1}");
            if (hearts[i].Kind != GuiKind.Image)
                throw new InvalidOperationException($"Heart{i + 1} precisa ser Image.");
        }
        status = hud.Find("Status");
        hud.Find("Damage");
        hud.Find("Heal");
        Refresh();
    }

    public override void Update(float deltaTime)
    {
        // Este script é o consumidor da fila deste Canvas.
        while (hud.Poll(out var message))
        {
            if (message.Kind != GuiEventKind.Click) continue;
            if (message.Element.Name == "Damage") health.TakeDamage(1);
            else if (message.Element.Name == "Heal") health.Heal(1);
        }
        if (lastHealth != health.Current) Refresh();
    }

    private void Refresh()
    {
        lastHealth = health.Current;
        for (int i = 0; i < hearts.Length; ++i)
            hearts[i].Visible = i < lastHealth;
        status.Text = $"Vida: {lastHealth}/{PlayerHealth.Capacity}"
            + (health.IsDead ? " | Sem vida" : "");
    }
}` },
  { id:'heart-hud', filename:'HeartDamageTrigger.cs', description:'Uma entrada de trigger retira um coração do objeto com PlayerHealth.', prerequisites:'Zona com sensor/trigger 3D e Behavior anexado; jogador participante da física 3D com PlayerHealth.', code:`using Astra;

[ComponentId("docs.heart-damage-trigger")]
public sealed class HeartDamageTrigger : Behavior
{
    public override void TriggerEnter(ObjectReference other)
    {
        Resolve(other)?.GetBehavior<PlayerHealth>()?.TakeDamage(1);
    }
}` },
];

const api = n => `[${n}]($BASE/api/astra-${n.toLowerCase()}/)`;
const page = (route,title,description,body) => ({route,title,description,body});
const table = rows => '| Campo / API | Efeito e uso |\n|---|---|\n'+rows.map(r=>`| ${r[0]} | ${r[1]} |`).join('\n');
export const uiNodes = [
  ['Panel','Agrupa elementos e oferece fundo opcional.','Fundo, raio e Recortar filhos; os filhos usam seu retângulo como pai.','Caixa de vida com Images por cima.','Layout manual por âncoras; não distribui os filhos como HBox.'],
  ['Text','Mostra uma string alterável em Play.','Texto, Fonte e Texto / Controle; use GuiElement.Text.','Vida: 3/3, pontuação ou instruções.','Texto avançado, localização e fontes completas permanecem no roadmap R6.'],
  ['Button','Entrega Click ao pressionar e soltar no controle.','Texto, Habilitado, Interação, ações e estados.','Botão de dano para experimentar o HUD.','Uma imagem decorativa não vira Button automaticamente; Image pode optar por clique.'],
  ['Toggle','Guarda um valor marcado/desmarcado e emite ValueChanged.','Marcado, Texto e Destaque; GuiElement.Value lê o valor.','Ligar/desligar uma opção do jogo.','A opção precisa de um consumidor no seu script para alterar o gameplay.'],
  ['Slider','Recebe arraste e muda um valor em um intervalo.','Mínimo, Máximo, Valor, Destaque; leia ValueChanged.','Escolher volume ou sensibilidade no menu.','O script aplica o valor ao sistema de áudio/entrada; a barra sozinha não altera esses sistemas.'],
  ['Progress','Apresenta um valor proporcional ao intervalo.','Mínimo, Máximo, Valor e Destaque; escreva GuiElement.Value.','Barra contínua de vida ou carregamento.','Não implementa imagem com preenchimento radial; Image não tem fillAmount nesta versão.'],
  ['Image','Desenha uma imagem do projeto, com transparência. Se você procura UiImage, UIImage ou UIIMG, este é o elemento Image da Astra.','Recurso do projeto, Ajuste, Tinta, Layout, Estado, Interação e Animação.','Coração, retrato, ícone ou painel ilustrado.','Esticar/Conter/Cobrir disponíveis; nine-slice, sprite sheet e hit mask não estão entregues.'],
  ['HBox','Distribui filhos em uma linha.','Padding, Espaçamento, Alinhamento; filhos usam tamanho mínimo/preferido e peso.','Uma fileira de corações com tamanho preferido 48 × 48.','Fora do fluxo retira o filho da distribuição; wrap automático não está documentado como suporte atual.'],
  ['VBox','Distribui filhos em uma coluna.','Padding, Espaçamento e Alinhamento; filhos usam tamanho mínimo/preferido e peso.','Lista de instruções ou opções do menu.','Para arrastar um filho manualmente, use Fora do fluxo; isso muda o contrato do layout.'],
  ['Grid','Distribui filhos em colunas.','Colunas, Espaçamento XY, Padding e tamanho dos filhos.','Grade pequena de itens autorados.','Virtualização, data binding e inventário completo são trabalhos R7/R8.'],
  ['Joystick','Converte o gesto em eixo de ação.','Ação, modo Fixo/Flutuante/Dinâmico, eixo, zona morta, raios e visual.','Mover o jogador ligado ao receptor do Canvas.','Requer ação compatível e receptor; pareamento geral por jogador/hardware continua parcial em R4.'],
  ['ActionButton','Emite uma ação de entrada de botão para o receptor.','Ação de botão, Habilitado, texto e estados.','Saltar ou Atirar; não confundir com Button que entrega eventos de GUI.','Buffer e pareamento gerais continuam parciais; não presume toda ação de gameplay implementada.'],
  ['LookArea','Converte arraste em ação de olhar.','Ação, sensibilidade e área de captura.','Olhar a câmera atribuída ao Canvas.','Depende de câmera/receptor compatíveis; composição de jogadores/viewports segue pendente.'],
].map(([name,purpose,fields,example,limitations])=>({name,purpose,fields,example,limitations,route:`ui/${name.toLowerCase()}`}));

export const uiPages = [
page('ui/comece-aqui','UI de jogo: onde fica e o que é possível','Encontre Canvas UI, Image e os elementos de interface pelo caminho real de autoria.',`## Comece pelo que você quer criar

| Quero criar | Ferramenta de hoje | Tutorial |
|---|---|---|
| HUD de corações com dano e cura | Canvas UI + documento + Image + Behavior C# | [HUD funcional]($BASE/ui/hud-coracoes/) |
| Ícone, retrato ou coração | Image, elemento do documento | [Image]($BASE/ui/image/) |
| Barra contínua | Progress + escrita de Value | [Progress]($BASE/ui/progress/) |
| Botão clicável ilustrado | Image + Clicável + Poll | [Interação e animação]($BASE/ui/interacao-e-animacao/) |
| Menu de botões | Button, Text, VBox | [Catálogo de elementos]($BASE/ui/elementos/) |
| Mover e olhar no touch | Joystick, ActionButton, LookArea + receptor | [Controles e receptores]($BASE/ui/controles-e-receptores/) |

## O nome certo na Astra

**UiImage, UIImage, UIIMG e imagem de UI** são termos úteis de busca. Nesta geração da Astra, o nome exibido é **Image**. Ele é um nó de um documento **.aeui**, manipulado por ${api('GuiElement')}. O componente do objeto é [Canvas UI]($BASE/componentes/astra-ui-canvas/), com fachada **Astra.Components.UiCanvas**. Não há uma classe pública Astra.Components.UiImage neste snapshot.

## Criar e salvar o documento

1. Abra o projeto e, no menu do editor, entre em **Interface (UI + ImGui)**. Essa é a área de autoria de UI; não é o editor de scripts.
2. No campo do recurso, use **UI/hud.aeui**. O caminho deve ficar dentro do projeto e terminar em .aeui. Se já existe um rascunho aberto, salve-o antes de trocar de documento.
3. Crie os elementos pelo menu de criação. No Inspector integrado da cena, a ação equivalente é **+ Elemento**. **Image** aparece nessa lista, junto de Panel, Text e Button.
4. Dê nomes únicos e estáveis aos elementos usados por scripts. Nome resolve a busca; o handle de execução conserva o ID e a instância do Canvas.
5. Use **Salvar** na área Interface ou **Salvar UI** no Inspector integrado. Isso salva e registra o documento no projeto. Salvar apenas a cena não substitui Salvar UI.

## Exibir o documento na cena

1. Crie um objeto vazio chamado **HUD** na Hierarquia da cena.
2. Selecione HUD → **Adicionar componente** → procure **Canvas UI** na família **Renderização**.
3. No Inspector do componente, atribua **UI/hud.aeui** ao recurso **Documento UI**. O arquivo deve ter sido salvo/registrado, não é um GUID inventado.
4. Use **Apresentação = Tela** para HUD. O modo Mundo / objeto é para uma interface presa a um plano na cena.
5. Use **Editar documento UI** para abrir a fonte desse Canvas. Expandir o Canvas na Hierarquia mostra os elementos; selecionar Image abre suas propriedades no mesmo Inspector.
6. A trilha mostra o proprietário e quantos Canvas compartilham o recurso. Editar a fonte altera todos os Canvas autorais ligados a ela. Overrides individuais autorais ainda estão pendentes.

## Editar, Interagir e Play

| Modo | O que faz | O que conferir |
|---|---|---|
| Autoria | Edita o documento e seleciona elementos | Layout, recurso, nomes, Undo/Redo e salvar |
| Interagir | Usa uma cópia para testar hit, ações nativas, estados e animação | Pressionar, soltar, cancelar; não executa o Behavior C# do jogo |
| Play | Executa cena e scripts com uma instância de UI por Canvas | Poll, vida do jogador, controle e alterações por C# |

As escritas do script em Play não modificam o .aeui autoral. Ao parar/reabrir Play, resolva os handles de novo. Não guarde GuiElement entre execuções.

## Contrato e roadmap

Documentos externos, Canvas Tela/Mundo, seleção integrada e cópias de Play estão presentes no código. Esta atualização de docs não executa novamente o APK no aparelho. [Roadmap UI]($BASE/ui/roadmap/) identifica as lacunas de layout, imagem, foco, bindings e autoria por instância.`),
page('ui/elementos','Os 13 elementos da UI de jogo','Escolha o tipo pelo resultado que precisa produzir, com caminho, campos e limites.',`Todos os tipos abaixo são **elementos do documento .aeui**. Use Interface → criar elemento, ou selecione um nó do Canvas na Hierarquia → Inspector → **+ Elemento**. Eles não são 13 componentes adicionais de objetos da cena.

| Tipo | Para que serve | Exemplo |
|---|---|---|
${uiNodes.map(n=>`| [${n.name}]($BASE/${n.route}/) | ${n.purpose} | ${n.example} |`).join('\n')}

Consulte [layout e campos comuns]($BASE/ui/layout-e-campos/) antes de misturar posicionamento manual com containers. O ${api('GuiKind')} enumera esses tipos na API, e ${api('GuiAccess')} cria ou encontra instâncias em Play.`),
page('ui/layout-e-campos','Layout e campos comuns da UI','Entenda âncoras, bordas, containers, estado e aparência antes de ajustar o HUD.',`## Onde editar

Selecione o elemento na Hierarquia sob o Canvas ou na árvore da área Interface. Os grupos **Estado**, **Layout**, **Aparência**, **Composição automática**, **Interação**, **Ações**, **Estados visuais** e **Animação** aparecem conforme o tipo e seu pai. Campos escondidos podem depender do contexto.

## Layout manual: âncoras e bordas

${table([
['Âncora inicial / GuiLayout.AnchorMin','X/Y normalizados do pai: 0 é esquerda/topo, 1 é direita/base. Padrão (0,0).'],
['Âncora final / GuiLayout.AnchorMax','Extremo oposto no pai. Igual à inicial conserva tamanho definido pelas bordas; diferente acompanha o tamanho do pai.'],
['Bordas / GuiLayout.Offsets','Esquerda, topo, direita, base, em pixels relativos às respectivas âncoras. Não são X, Y, largura, altura.'],
['Esticar','Preset com âncoras (0,0)–(1,1) e bordas 16,16,-16,-16; mantém margens no pai.'],
['Centralizar','Coloca as duas âncoras em (0,5;0,5) e bordas simétricas, preservando o tamanho medido.'],
['Recortar filhos / Style.ClipChildren','Restringe desenho/hit dos descendentes ao retângulo. Um filho para fora pode desaparecer.'],
])}

Para um Image 48 × 48 no canto superior esquerdo do pai, use âncoras (0,0) e (0,0), bordas **0,0,48,48**. Para outro 8 px à direita, use **56,0,104,48**. Na raiz, o retângulo do Canvas Tela acompanha o viewport. Não há CanvasScaler por resolução de referência entregue nesta versão.

## Composição automática

${table([
['Tamanho mínimo / Sizing.Minimum','Limite mínimo XY do filho. Padrão (0,0); escolha 48 × 48 para um coração que não deve encolher.'],
['Preferido (0 = medir) / Preferred','Tamanho desejado. Zero usa a medição do conteúdo; Image pode medir a textura inteira, portanto defina 48 × 48 para um PNG grande.'],
['Peso de expansão / Flexible','Distribui espaço extra nos filhos de HBox/VBox. Peso zero conserva o tamanho preferido; não é propriedade de expansão de Grid.'],
['Padding / Padding','Margens internas esquerda, topo, direita, base. Padrão 8 em cada lado.'],
['Espaçamento / Spacing','Distância entre filhos; HBox usa X, VBox usa Y, Grid usa ambos. Padrão 8.'],
['Alinhamento / Alignment','Início, Centro, Fim ou Esticar no espaço do container. Padrão Esticar.'],
['Colunas / Columns','Quantidade de colunas do Grid, 1–64 no editor; padrão 2.'],
['Fora do fluxo / Ignore','Retira esse filho da distribuição; libera âncoras e arraste. Ele ainda pertence à árvore.'],
])}

Quando HBox/VBox/Grid controla o filho, os campos de layout manual ficam bloqueados. Use tamanho, peso e ordem. Um container não é uma lista de objetos da cena e não faz data binding de inventário.

## Estado e aparência

${table([
['Visível / Visible','Esconde o elemento e sua subárvore no runtime; em container, um filho invisível deixa de participar da medição. Use overlay em Panel para conservar o espaço de um coração vazio.'],
['Habilitado / Enabled','Controla a participação na entrada e o estado desabilitado. Pode continuar visível. Ancestrais desabilitados afetam os filhos.'],
['Nome / Name','Busca exata de Find/TryFind; mantenha nomes únicos. Nome não é o ID persistente.'],
['Texto / Text','Conteúdo de Text e controles textuais. Image não desenha texto.'],
['Desenhar fundo / Style.Background','Ativa alpha do fundo; desligado não adiciona uma placa atrás da imagem.'],
['Fundo, Texto / Controle e Destaque','Cores de pintura: fundo, conteúdo e preenchimento de controles. C# usa 0xAARRGGBB.'],
['Fonte / FontSize','Tamanho do texto em pixels; editor 6–128. Não é a resolução do Canvas.'],
['Raio / Radius','Arredondamento do fundo desenhado. Não cria recorte por máscara na imagem.'],
['Valor / Value','Estado numérico de Toggle, Slider e Progress. Image não consome Value como vida/preenchimento.'],
['Mínimo / Máximo','Intervalo autorado do Slider/Progress; Máximo precisa superar Mínimo. Snapshot permite ler o intervalo; o setter Value é separado.'],
])}

## Acesso C# e erros

As propriedades de ${api('GuiLayout')}, ${api('GuiSizing')}, ${api('GuiStyle')} e ${api('GuiImageStyle')} são records. Para preservar os outros campos, use **with**:

\`\`\`csharp
var hud = Gui.ForCanvas(Object);
var heart = hud.Find("Heart1");
heart.Layout = heart.Layout with { Offsets = new System.Numerics.Vector4(0, 0, 48, 48) };
heart.ImageStyle = heart.ImageStyle with { Fit = GuiImageFit.Contain };
\`\`\`

Essas escritas exigem Behavior em Play, no proprietário do Canvas. Alteram a cópia runtime. Consulte [diagnóstico do HUD]($BASE/ui/diagnostico/) para fonte ausente, handles vencidos e layout controlado pelo pai.`),
page('ui/interacao-e-animacao','Interação, ações e animação da Image','Use uma imagem clicável sem criar fundo obrigatório; configure ações, estados e duas poses.',`## Caminho no editor

Image selecionada → **Interação** → **Clicável** → **Ao clicar** → escolha ação e alvo. Uma imagem decorativa do HUD não precisa de Clicável. Button/Toggle/Slider já têm entrada própria. Text, Panel e containers podem optar por clique.

${table([
['Clicável / Interaction.Clickable','Habilita emissão opcional de Click no elemento; padrão falso para Image.'],
['Ao clicar / Action','Notificar, alternar visibilidade/habilitação, definir valor, iniciar ou parar animação. Notificar permite o script consumir Poll.'],
['Alvo / Target','ID estável de outro elemento no mesmo documento; zero representa o próprio elemento. Não aceita objeto da cena ou outro Canvas como se fosse um ID local.'],
['Valor / Value','Argumento de Definir valor; o destino precisa ser Toggle, Slider ou Progress. Não troca a textura de Image.'],
['Ações adicionais / AddAction','Listeners ordenados depois da ação principal. O documento permite até 16 por elemento; Click ou ValueChanged precisam ser emitidos pelo tipo de origem.'],
])}

## Script: ler o clique uma vez

Em **Play**, use Gui.ForCanvas e consuma Poll. Filtre **GuiEventKind.Click**, depois compare ID/elemento ou o nome exato. O exemplo [HeartHud.cs](/examples/heart-hud/HeartHud.cs) faz isso. Poll retira a mensagem da fila: centralize o consumo desse Canvas em um Behavior e repasse a outros sistemas; dois scripts concorrendo pela mesma fila podem perder eventos entre si.

## Estados visuais

O grupo **Estados visuais** configura Normal, Pressionado e Desabilitado, tempo de transição e curva. Cada estado combina deslocamento XY, escala uniforme, opacidade e tinta. Padrão da configuração: desativada, 0,12 s, curva Smooth; pose pressionada 0,94 de escala e desabilitada 0,45 de alpha. A tinta multiplica a imagem, não cria fundo obrigatório.

## Animação de duas poses

${table([
['Ativar / Animation.Enabled','Habilita a transição autorada; padrão falso.'],
['De / Para / From / To','Cada pose tem Position XY (pixels), Scale uniforme e Opacity. Padrão (0,0), 1, 1.'],
['Duração / Duration','Tempo da passagem; padrão 0,3 s. Não é a taxa de quadros.'],
['Atraso / Delay','Espera inicial; padrão zero. Loop não reaplica esse atraso a cada ciclo.'],
['Curva / Easing','Linear, Smooth, EaseIn ou EaseOut.'],
['Autoplay / AutoPlay','Inicia no runtime sem chamada PlayAnimation.'],
['Repetir / Loop','Repete a transição; não existe timeline de múltiplos keyframes aqui.'],
['Ida e volta / PingPong','Executa a ida e depois a volta; pode combinar com loop.'],
['PlayAnimation / StopAnimation','Tocar reinicia; parar restaura a pose autoral. Conclusão sem loop mantém a pose final.'],
])}

Filhos herdam a transformação, alpha e clipping; o hit acompanha a pose. Opacidade efetiva zero rejeita novas capturas. Interagir usa o tempo real do editor; Play acompanha relógio/pausa do mundo. O Inspector tem prévia, mas Interagir não executa scripts C#.

## Roadmap desta função

Ações ordenadas e estados básicos estão presentes na revisão atual. O relatório de Image de 03/10 tratava uma revisão anterior; não use sua limitação de uma ação como limite atual. Timeline/keyframes, rotação/escala por eixo, sprite animation, callbacks de conclusão, pause/resume dedicado e reduced motion completo seguem pendentes no [R10]($BASE/ui/roadmap/#r10-animação). Hit mask e foco/acessibilidade têm trabalho próprio.`),
page('ui/controles-e-receptores','Controles touch e receptores','Diferencie botão de GUI de ação de entrada e atribua jogador/câmera ao Canvas.',`## Caminho completo

1. Configure as ações do projeto no editor de entrada: eixo 2D para Mover/Olhar, botão para Saltar/Atirar. Use os nomes reais do catálogo do seu projeto.
2. Documento UI → **+ Elemento** → **Joystick**, **ActionButton** ou **LookArea**.
3. Nas propriedades do controle, atribua **Ação** compatível. O padrão inicial é Mover, Saltar ou Olhar conforme o tipo; criar esse texto não cria a ação no catálogo.
4. Canvas UI → **Jogador / receptor**: escolha um objeto com Character ou Motor dinâmico ativo.
5. Atribua **Câmera de entrada** e **Espaço do movimento** se o vetor precisa seguir a câmera ou o jogador. Para o HUD visual de corações, receptor/câmera de entrada não são necessários.
6. Execute Play e use ${api('GuiInputAccess')} do contexto retornado por Gui.ForCanvas. Ler ${api('GuiControlSnapshot')} mostra estado bruto; não representa por si só movimento físico.

## Campos de controle

${table([
['Modo','Fixo: origem definida; Flutuante/Dinâmico alteram a origem conforme o gesto. Aplicação depende do tipo de controle.'],
['Eixo e gate','Livre/Horizontal/Vertical restringem o vetor; Círculo/Quadrado escolhem o domínio.'],
['Raio de entrada / InputRadius','Escala espacial do gesto; padrão 80 px. Não confundir com o tamanho visual da base.'],
['BaseRadius / KnobRadius','Raios visuais padrão 80 e 28 px.'],
['Deadzone / OuterDeadzone','Zonas mortas internas/externas; padrões 0,12 e 0.'],
['Exponent / Sensitivity','Curva e ganho do vetor; padrões 1 e 1.'],
['ReturnSeconds','Tempo de retorno visual, padrão 0,12 s.'],
['ShowBase / ShowKnob','Mostra/esconde as partes visuais, sem definir o receptor.'],
['BaseImage / KnobImage','Caminhos de imagens do projeto para base/puxador; não URLs externas.'],
['InputAction','Nome da ação de entrada; distinto de GuiClickAction e do nome do elemento.'],
])}

## Limites e roadmap

O código prevê até 32 capturas por documento e 32 receptores por mundo. Isso não prova gestos simultâneos em cada aparelho. Atribuição de receptor, Character e motor dinâmico possui implementação; pareamento geral de hardware/jogador, buffer de comandos e partes do aceite multitouch seguem parciais em [R4]($BASE/ui/roadmap/#r4-controles-e-receptores). Separação geral por viewport/player e modal scopes não está concluída.`),
page('ui/diagnostico','Diagnóstico de Image e HUD','Localize a etapa que falhou: documento, imagem, elemento, script, evento ou estado de vida.',`| Sintoma | Confira | Correção |
|---|---|---|
| Image não está em Adicionar componente | É elemento do .aeui | Abra Interface ou + Elemento no Inspector da UI; use Image |
| HUD não aparece | Canvas habilitado, Documento UI, Apresentação e estado da fonte | Salve/registre o .aeui e atribua ao Canvas; HUD usa Tela |
| Ícone ausente ou indicação de erro | Recurso do projeto, nome/maiúsculas, diagnóstico da imagem | Importe o PNG para o projeto e use caminho relativo correto |
| Coração branco/esticado/cortado | Tinta, Ajuste, tamanho do retângulo e clipping | Tinta branca, Conter e 48 × 48; revise alpha e Recortar filhos |
| Tamanho muda quando escondo um coração | Ele é filho gerenciado de HBox/VBox/Grid | Use um slot Panel com vazio/cheio ou o overlay manual do tutorial |
| Campo Layout bloqueado | Pai controla composição automática | Altere tamanho/peso/ordem ou use Fora do fluxo |
| Botão funciona em Interagir mas não muda vida | Interagir não executa HeartHud C# | Compile/anexe o script e use Play |
| Find falha | Nome exato, contexto e documento | Confira Heart1–3/Status/Damage/Heal e Gui.ForCanvas no objeto HUD |
| Vida altera, corações não | Player errado, Behavior ausente/desabilitado ou handle vencido | Atribua Player, anexe PlayerHealth; reinicie Play após reload do Canvas |
| Cliques não chegam | Habilitado, sobreposição, captura e consumo de Poll | Um consumidor por fila; filtre Click; confira o Canvas correto |
| Dano contínuo a cada frame | Mecânica usando TriggerStay sem cooldown | O exemplo usa TriggerEnter; defina invulnerabilidade explicitamente se precisar |
| Alteração desapareceu ao reabrir | Editou só a cópia runtime ou não salvou UI | Faça a autoria fora de Play e Salvar UI; salve a cena para referências |
| Duas instâncias alteram a mesma fonte | Documento .aeui compartilhado | Crie outro recurso autoral se precisam divergir; overrides por instância pendentes |

Use **Gui.Diagnostic** do contexto correto para ações/alvos inválidos. GuiElement default não é um handle válido; elementos removidos e handles do Play anterior são rejeitados. O atlas atual limita fontes de imagem e dimensões: [roadmap e limites]($BASE/ui/roadmap/).`),
page('ui/roadmap','Roadmap da UI por função','Estado atual, lacunas e critérios para ampliar imagem, layout, interação e HUD sem prometer suporte ausente.',`## Como ler

Revisão de código e relatórios até 06/10/2026. **Presente no código** é diferente de **validado neste APK/aparelho**. O tutorial do HUD recebe evidência de compilação separada; esta edição das docs não acrescenta um novo aceite físico. Não há datas prometidas para os itens pendentes. Os IDs R vêm do plano de UI universal da Astra, e não representam uma porcentagem de conclusão.

## R0: identidade, dados e persistência

**Parcial.** Documento AEUI 5 com leitura 1–4, IDs locais estáveis, recurso registrado e instância runtime por Canvas. Identidade de mundo/lease evita misturar nós de sessões distintas. Falta completar separação de pintura/hit/foco/semântica, PropertyId de UI e bindings persistentes entre documentos. Aceite futuro: referência sobreviver a salvar/reabrir/duplicar, com diagnóstico de alvo removido.

## R1: autoria integrada

**Parcial.** Hierarquia projeta Canvas/elementos; seleção abre Inspector contextual; criação, rename, reorder, duplicate/remove, Undo e fonte compartilhada presentes. Faltam drag-and-drop entre fontes, gizmos completos de layout, prévia autoral simultânea de todos os Canvas e overrides por instância. Aceite: criar/editar a UI na cena com contexto claro e sem alterar outra fonte por engano.

## R2: Image, skins e recursos

**Parcial.** Image lê recurso do projeto, Tinta e Esticar/Conter/Cobrir, com atlas. Atlas atual: uma página **2048 × 2048**, até **64 fontes**, cada imagem até **1024 × 1024 RGBA8**; documentos até **1024 nodes**, e **64 leases por mundo**. Não entregue: nine-slice, sprite sheets, múltiplas páginas/fences e skins completos. Aceite: bordas preservadas em vários tamanhos, paginação sem colisão e erro explícito para recurso ausente. HUD inteiro/vazio já pode usar duas Images sobrepostas.

## R3: input, captura e foco

**Parcial.** Captura por device/pointer, até 32 por documento; cancelar ao remover/desabilitar/trocar fonte. Não entregue: foco/navegação geral, modal scopes, hit mask de Image e semântica/acessibilidade completa. Aceite: pressionar/arrastar/cancelar múltiplos controles sem ativar a cena por baixo, em aparelho.

## R4: controles e receptores

**Parcial.** Joystick, ActionButton e LookArea autorados; receptor Character/motor dinâmico, câmera e espaço de movimento. Pareamento geral de hardware/player, buffers e restante do aceite multitouch precisam de fechamento. Os subpacotes de criação de Character/motor têm relatórios próprios; sua presença não conclui toda R4.

## R5: layout responsivo

**Parcial.** Âncoras/bordas, HBox/VBox/Grid, medidas, pesos, padding e espaçamento presentes. Não declarar CanvasScaler, breakpoints, wrap/virtualização ou safe area automática como prontos. Aceite: HUD legível em viewport pequeno/tablet com área segura e mudança de resolução, sem offsets compensatórios ocultos.

## R6: texto

Text e escrita de strings presentes; pipeline avançado de fontes, shaping/localização, rich text e comportamento completo de overflow continuam no planejamento. Aceite: idioma/tamanho distintos preservarem medição e legibilidade.

## R7: bindings e coleções

**Pendente no fluxo geral.** O HUD atual usa Behavior C# para ligar PlayerHealth às Images. Não há vínculo automático "campo vida → corações" exposto como propriedade entregue. Próximo trabalho: contratos persistentes, mudanças observáveis e coleções. Aceite: fonte de dados mudar e o elemento atualizar sem binding quebrado após reload.

## R8: inventário

Grid organiza filhos autorados. Inventário completo, slots tipados, drag/drop, stacks e transações continuam pendentes. Não tratar a existência de Grid como um sistema de inventário.

## R9: apresentação

Tela e plano Mundo/objeto presentes. RenderTexture, superfície curva, ligação a osso e composição geral de viewports/players continuam pendentes. Aceite: desenho e hit concordarem com apresentação, transformações, oclusão e viewport.

## R10: animação

**Parcial.** Duas poses XY/escala uniforme/alpha, curvas, delay, autoplay, loop e ida/volta; estados Normal/Pressionado/Desabilitado e ações ordenadas. Faltam timeline/keyframes, sprite animation, rotação/escala por eixo, callbacks de término, pause/resume dedicado e política completa de reduced motion. Aceite: cancelamento/reload/destruição liberarem estado e eventos corretamente.

## R11: templates e exportação

Os exemplos públicos de docs são receitas e scripts autorados. Biblioteca completa de templates, exportação e importação com fidelidade de todas as funções permanece no planejamento. Não presumir que um exemplo histórico já seja modelo distribuído no APK.

## R12: acesso, diagnóstico e performance

Diagnóstico básico e limites existem. Fechamento inclui acessibilidade, profiler/telemetria de UI, orçamento de imagens, grandes coleções e aceite físico. Medição de CPU em host não mede GPU/Android.

## Referências estudadas

[Godot 4.5 TextureRect](https://docs.godotengine.org/en/4.5/classes/class_texturerect.html) separa textura e ajuste ao retângulo; a Astra usa os três modos de Image descritos, sem presumir todos os modos Godot. [Unity uGUI 2.0 Image](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/script-Image.html) e [Godot 4.5 TextureProgressBar](https://docs.godotengine.org/en/4.5/classes/class_textureprogressbar.html) oferecem recursos de preenchimento que não autorizam inventar fillAmount na Astra. Nosso exemplo usa imagens inteiro/vazio ou Progress para barra contínua.`),
];

for (const node of uiNodes) uiPages.push(page(node.route, node.name === 'Image' ? 'Image (UiImage): imagens na interface' : `${node.name}: uso e campos`, node.purpose,
`## Para que serve\n\n${node.purpose}\n\n## Onde fica\n\n**Interface → criar elemento → ${node.name}**; ou Canvas expandido na Hierarquia → selecione um elemento → Inspector → **+ Elemento → ${node.name}**. Primeiro [crie e atribua o documento]($BASE/ui/comece-aqui/). Este tipo é um nó de UI, não um componente do menu Adicionar componente.\n\n## Campos e uso\n\n${node.fields}\n\nLeia [layout e campos comuns]($BASE/ui/layout-e-campos/) para padrões, unidades, estado, fundo, âncoras e composição automática. A referência de script é ${api('GuiElement')}; o tipo é **GuiKind.${node.name}**.\n\n## Exemplo prático\n\n${node.example}\n\n${node.name==='Image'?`### Imagem: recurso, proporção e alpha\n\n- **Recurso do projeto / Image:** caminho relativo, como **Images/heart-full.png**. Não use C:/, /sdcard/ ou URL. PNG com transparência serve para o contorno de coração. O seletor lista recursos do projeto e informa erros de decodificação/atlas.\n- **Ajuste / ImageStyle.Fit:** **Esticar (Stretch)** preenche o retângulo deformando proporção; **Conter (Contain)** preserva proporção e cabe inteira (padrão); **Cobrir (Cover)** preserva proporção e recorta excedente.\n- **Tinta / ImageStyle.Tint:** multiplica a cor; branco **0xFFFFFFFF** conserva a imagem (padrão). Alpha zero a torna transparente.\n- **Desenhar fundo:** Image nasce com fundo transparente, bordas 24,24,224,224 (200 × 200), âncoras (0,0). Ajuste para 48 × 48 no HUD.\n- **Visível:** o script pode esconder a camada cheia e deixar o coração vazio atrás. Image não tem valor de vida próprio, nem fillAmount.\n- **Clicável, ações, estados e duas poses:** são opcionais; veja [interação/animação]($BASE/ui/interacao-e-animacao/).\n\n[Tutorial completo: HUD de corações]($BASE/ui/hud-coracoes/).\n\n`:''}## Limitações e roadmap\n\n${node.limitations}\n\nO [roadmap por função]($BASE/ui/roadmap/) distingue dados, autoria, imagem, entrada, layout e bindings. Esta página descreve o contrato e o uso; não afirma um novo teste no dispositivo.\n\n## Conferência\n\nCrie o elemento no documento, altere os campos relevantes, salve UI, atribua ao Canvas e confira no Play. Pare, reabra e confirme a autoria. Se falhar, use [diagnóstico]($BASE/ui/diagnostico/) e mantenha a mensagem exata.`));

uiPages.push(page('ui/hud-coracoes','HUD de corações: do editor ao dano e cura','Monte três corações com Image, ligue à vida do jogador e confira dano, cura e zero vida.',`## É possível nesta versão?

**Sim, pela composição Canvas UI + Image + Behavior C#.** Image desenha o ícone e permite mudar Visible. A regra de vida é implementada no script PlayerHealth do exemplo. Não existe um componente pronto de "HUD de corações" ou binding automático de vida no snapshot. Este tutorial usa três corações inteiros; meio coração/preenchimento radial exigem outra composição, e Image não tem fillAmount.

## O resultado e a árvore

\`\`\`text
Jogador                         HUD (objeto da cena)
└─ PlayerHealth                 ├─ Canvas UI → UI/hud.aeui
                                └─ HeartHud → Player = Jogador

UI/hud.aeui (documento)
├─ Hearts (Panel, sem fundo)
│  ├─ Empty1 (Image vazio)       ← fica visível
│  ├─ Heart1 (Image cheio)       ← script liga/desliga
│  ├─ Empty2 (Image vazio)
│  ├─ Heart2 (Image cheio)
│  ├─ Empty3 (Image vazio)
│  └─ Heart3 (Image cheio)
├─ Status (Text)
├─ Damage (Button)
└─ Heal (Button)
\`\`\`

Os seis Images ficam sobrepostos em pares. Ao esconder Heart2, Empty2 continua desenhado na mesma posição. Use Panel com layout manual aqui; esconder filhos diretos de HBox pode reorganizar a fileira. A ordem é relevante: vazio primeiro, cheio depois.

<figure class="astra-hud-figure"><div><img src="/examples/heart-hud/Images/heart-full.png" width="48" height="48" alt="Coração cheio" /><img src="/examples/heart-hud/Images/heart-full.png" width="48" height="48" alt="Coração cheio" /><img src="/examples/heart-hud/Images/heart-empty.png" width="48" height="48" alt="Coração vazio" /></div><figcaption>Vida 2/3: ilustração com os recursos do tutorial. A execução real ocorre na Astra em Play.</figcaption></figure>

## 1. Prepare os recursos

Adicione **Images/heart-full.png** e **Images/heart-empty.png** dentro do projeto. Use duas imagens 64 × 64 com alpha; ambas precisam existir e ser legíveis. [Baixe o pacote do tutorial](/examples/heart-hud/Astra-Heart-Hud.zip): inclui **UI/hud.aeui**, PNGs, scripts e [instruções](/examples/heart-hud/README.txt), para integrar num projeto existente. Abra e salve o .aeui pela área Interface para registrá-lo como recurso, ou siga a autoria manual abaixo. As duas imagens já aparecem no documento autoral, então o atlas conhece os dois recursos antes de esconder uma camada.

## 2. Crie o documento e preencha o layout

Siga [o caminho de autoria]($BASE/ui/comece-aqui/) e salve **UI/hud.aeui**. Crie Panel e renomeie para **Hearts**. Selecionar Panel antes de criar Image faz os filhos pertencerem a ele. Todos usam âncoras inicial e final **(0,0)**.

| Elemento | Pai | Bordas: esquerda, topo, direita, base | Recurso / texto |
|---|---|---|---|
| Hearts, Panel | raiz | 24,24,184,72 | Desenhar fundo desligado |
| Empty1, Image | Hearts | 0,0,48,48 | Images/heart-empty.png |
| Heart1, Image | Hearts | 0,0,48,48 | Images/heart-full.png |
| Empty2, Image | Hearts | 56,0,104,48 | Images/heart-empty.png |
| Heart2, Image | Hearts | 56,0,104,48 | Images/heart-full.png |
| Empty3, Image | Hearts | 112,0,160,48 | Images/heart-empty.png |
| Heart3, Image | Hearts | 112,0,160,48 | Images/heart-full.png |
| Status, Text | raiz | 24,80,320,116 | Vida: 3/3 |
| Damage, Button | raiz | 24,124,124,168 | Dano |
| Heal, Button | raiz | 136,124,236,168 | Cura |

Para os Images, use **Ajuste = Conter**, **Tinta = branco**, **Visível = ligado**, **Clicável = desligado** e sem animação. Panel Hearts deve ter fundo transparente. Damage e Heal usam ação **Notificar**; não os configure para alterar Value do Image. Após criar os filhos, selecione a raiz/limpe a seleção antes de criar Status e os botões. Salve UI.

## 3. Configure a cena

1. Crie **HUD**, adicione **Canvas UI**, atribua **UI/hud.aeui** em **Documento UI**, use **Tela** e Habilitado.
2. Crie ou escolha **Jogador**. Ele pode ser só um objeto vazio para a demonstração por botão; física não é necessária nessa etapa.
3. Adicione os scripts abaixo na área de código, compile e anexe **PlayerHealth** a Jogador e **HeartHud** a HUD.
4. No Inspector do HeartHud, campo **Player**, escolha o objeto Jogador. Não escolha um Image da árvore UI: o campo é uma referência a objeto da cena.
5. Salve a cena e a UI. Receptor/câmera de entrada do Canvas podem ficar sem atribuição nesta demonstração visual.

## 4. Regra de vida: PlayerHealth.cs

[Baixar PlayerHealth.cs](/examples/heart-hud/PlayerHealth.cs)

\`\`\`csharp
${heartExamples[0].code}
\`\`\`

Awake começa com três corações. TakeDamage e Heal aceitam quantidades não negativas, limitadas à capacidade. Zero vida apenas muda o estado **IsDead**; este exemplo não inventa morte, respawn, animação ou persistência de save.

## 5. Ligar o estado às imagens: HeartHud.cs

[Baixar HeartHud.cs](/examples/heart-hud/HeartHud.cs)

\`\`\`csharp
${heartExamples[1].code}
\`\`\`

Gui.ForCanvas(Object) escolhe o Canvas do objeto HUD. Start resolve nomes e conserva handles somente desta execução. O script verifica os tipos dos corações e falha com mensagem quando Player/PlayerHealth estão ausentes. Update consome os botões e só escreve as imagens quando a vida muda. Não precisa procurar Heart1–3 a cada frame.

## 6. Dano vindo do gameplay

Outro Behavior pode resolver o jogador e chamar \`player.GetBehavior<PlayerHealth>()?.TakeDamage(1)\` no momento real de um ataque. Para uma zona de dano, o arquivo abaixo usa **TriggerEnter**, uma vez por entrada, não TriggerStay a cada passo:

\`\`\`csharp
${heartExamples[2].code}
\`\`\`

[Baixar HeartDamageTrigger.cs](/examples/heart-hud/HeartDamageTrigger.cs). Anexe à zona com corpo/colisor 3D em modo sensor. O outro objeto precisa participar da física 3D e carregar PlayerHealth. Consulte [Corpo físico]($BASE/componentes/astra-physics-body/), [Colisor 3D]($BASE/componentes/astra-physics-collider/) e [eventos físicos]($BASE/sistemas/fisica-3d/). Eventos 2D têm contrato próprio; não substitua assinaturas por suposição. O script não define cooldown nem identifica filhos sem PlayerHealth: coloque o Behavior no objeto resolvido pelo evento ou adapte a busca explicitamente.

## 7. Conferir o resultado

| Ação em Play | Vida esperada | HUD esperado |
|---|---|---|
| Iniciar | 3 | três cheios, texto Vida: 3/3 |
| Dano | 2 | dois cheios e um vazio |
| Dano duas vezes | 0 | três vazios, texto Sem vida |
| Dano em zero | 0 | continua zero |
| Cura | 1 | um cheio e dois vazios |
| Cura até o máximo | 3 | não ultrapassa três |
| Parar e reabrir Play | 3 | reinicia, documento autoral preservado |

**Interagir não executa esses scripts.** Use Play para validar a ligação com a vida. Se a fonte recarregar durante Play, resolva novos handles ou reinicie.

Os três scripts deste tutorial compilaram sem erros contra o SDK do APK publicado. O documento do pacote foi gravado e relido pelo serializador nativo: formato AEUI 5, dez elementos. Isso verifica contratos e formato; o roteiro acima ainda precisa de aceite no Play e no aparelho. Consulte o [manifesto de exemplos](/snapshot-2026-10-06/examples.json) para a evidência de compilação.

## Responsividade, limite e roadmap

Os corações usam 160 × 48 px e margem 24 px no viewport Tela. Eles conservam tamanho e posição no canto superior esquerdo, sem assumir escala por resolução de referência. Confira landscape pequeno e tablet, notch/área segura, contraste e espaço da cena. Safe area automática e escala responsiva completa continuam em R5. Para fileira flexível, use HBox com **slots Panel** de tamanho preferido 48 × 48 e as duas Images dentro de cada slot.

Meios corações podem ser autorados com imagens adicionais e regra de meio ponto; nine-slice, fill radial, binding automático, timeline e templates completos continuam no [roadmap]($BASE/ui/roadmap/). Vida persistente entre sessões pede SaveStore e regra explícita de save/load; não é consequência de salvar UI. Para erros, veja [diagnóstico de Image e HUD]($BASE/ui/diagnostico/).`));
