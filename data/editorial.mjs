import { projectStatusMarkdown } from './project.mjs';
import { uiPages, heartExamples } from './ui-guides.mjs';
import { editorPages } from './editor-guides.mjs';
import { conceptPages } from './concept-guides.mjs';
import { systemPages } from './system-guides.mjs';
import { beginnerPages } from './beginner-guides.mjs';
import { releasePages } from './release-guides.mjs';
import { workflowExamples } from './workflow-examples.mjs';
import { api as typeLink } from './workflow-guide-tools.mjs';
export const pages=[];
const add=(route,title,description,body,options={})=>pages.push({route,title,description,body: (['comece/visao-geral','versoes/estado-da-versao'].includes(route) ? projectStatusMarkdown+'\n\n' : '')+body,options});
const api=(name)=>`[${name}]($BASE/api/astra-${name.toLowerCase()}/)`;
const guide=(route,title,description,sections)=>add(route,title,description,sections.map(([h,p])=>`## ${h}\n\n${p}`).join('\n\n'));

const rotate=`using Astra;
using System.Numerics;

[ComponentId("docs.rotate-object")]
public sealed class RotateObject : Behavior
{
    public override void Update(float deltaTime)
    {
        Object.Rotate(Vector3.UnitY, 0.5f * deltaTime,
                      TransformSpace.Local);
    }
}`;
pages.push(...beginnerPages);
pages.push(...releasePages);

for (const page of [...editorPages, ...conceptPages, ...systemPages]) add(page.route, page.title, page.description, page.body, page.options);

const diagnostics=[
['erros-de-compilacao','Erros de compilação','O script não compila ou o Behavior não fica disponível.','Assinatura de outra engine; namespace incorreto; tipo renomeado; identificador duplicado; dependência de script ausente.','Leia o primeiro erro com arquivo e linha. Compare a assinatura com esta API. Reduza o script a um Behavior com Update vazio e reintroduza as chamadas até localizar a incompatibilidade.','Uma compilação sem erros permite passar à verificação de anexação e lifecycle; ainda não comprova comportamento de gameplay.','Behavior'],
['componente-indisponivel','Componente indisponível','O Add ou a API recusa a composição.','Dependência ausente, conflito, segunda instância de um tipo único, tipo não registrado ou mudança estrutural proibida em Play.','Abra a ficha do componente. Confira requirements, conflicts, multiplicidade e mutabilidade. Interprete ComponentUnavailable, ComponentMissing e ComponentInUse como causas distintas.','A composição deve ser aceita com todas as dependências presentes e sem conflito.','Component'],
['handle-invalido','Handle inválido','Uma operação aponta para objeto removido ou outra sessão.','O alvo foi destruído, o Play foi reiniciado, a cena foi trocada ou uma tarefa conservou referência além do lifetime do dono.','Confira IsAlive e a origem da referência. Refaça a resolução na sessão atual. Cancele callbacks que sobreviveriam ao objeto. Não suprima StaleHandle ou ForeignWorld em um loop por frame.','O acesso deve usar o alvo da sessão atual sem reutilizar o handle antigo.','WorldStatus'],
['objeto-nao-se-move','Objeto não se move','Uma transformação não produz o efeito esperado.','Behavior desabilitado; objeto inativo; delta zero; câmera não enquadra o alvo; escrita posterior por outro sistema; autoridade física.','Comece sem física em um objeto visual. Verifique o callback e a unidade. Observe TransformOwnedByPhysics e o escritor responsável pela pose. Para corpos, use a API física adequada.','Uma mudança isolada deve aparecer na pose e na câmera usada em Play.','GameObject'],
['camera-sem-imagem','Câmera sem imagem','A cena aparece no editor, mas o Play não enquadra conteúdo.','Câmera ativa diferente da esperada, orientação, near/far, escala, recurso ausente ou estado de visibilidade.','Use uma cena pequena com geometria conhecida. Confira pose da câmera de jogo, projeção e planos de recorte. Compare a câmera selecionada com a usada no mundo de Play.','O mesmo objeto de referência deve aparecer de forma estável no enquadramento do jogo.','GameViewAccess'],
['colisao-ausente','Colisão ausente','Objetos atravessam a geometria ou a consulta não encontra o alvo.','Há malha visual sem colisor; camada/máscara exclui o par; mistura de física 2D/3D; corpo inativo; geometria inadequada.','Confira a composição, o tipo de corpo e os filtros. Use formas simples e movimento moderado para isolar configuração de problemas de velocidade ou geometria.','A configuração mínima deve produzir contato ou hit antes de reintroduzir a geometria complexa.','PhysicsAccess'],
['input-sem-resposta','Input sem resposta','A ação existe no código, mas não responde ao controle.','Nome de ação diferente, vínculo ausente, contexto desabilitado, grupo de dispositivo excluído ou foco capturado pelo editor.','Consulte Exists e ActionState. Feche modal/teclado, devolva foco ao gameplay e confira os vínculos do projeto. Verifique Pressed versus JustPressed conforme a mecânica.','A fase e o valor devem mudar ao pressionar e voltar ao estado esperado ao soltar.','InputAccess'],
['asset-nao-encontrado','Asset não encontrado','Um componente referencia um recurso que não pode ser resolvido.','Identidade não registrada, arquivo movido, dependência externa ausente, importação incompleta ou tipo de recurso incompatível.','Confira o registro e o resultado da importação. Preserve a fonte e a mensagem. Diferencie UnknownResource de ResourceTypeMismatch; não atribua um GUID arbitrário para ocultar o erro.','O recurso deve resolver, aparecer na cena e continuar resolvendo após reabrir o projeto.','AssetGuid'],
['cena-nao-reabre','Cena não reabre','A leitura do projeto falha ou os dados não correspondem ao salvo.','Formato incompatível, arquivo incompleto, referência de recurso ausente ou tentativa de abrir conteúdo de outra geração.','Faça uma cópia do arquivo antes de agir. Registre versão e mensagem de leitura. Confira backups e recursos. Não salve uma cena vazia sobre o único arquivo com falha.','Reabra uma cópia recuperada e verifique objetos, propriedades e recursos antes de substituir a original.','ScenesAccess'],
['play-nao-inicia','Play não inicia','A sessão de runtime não chega a executar o cenário.','Compilação inválida, script ausente, recurso necessário não resolvido ou falha durante inicialização de um comportamento.','Confira diagnóstico de compilação e lifecycle. Tente uma cena mínima sem o último componente adicionado. Identifique a primeira falha em Awake/Start em vez de seguir erros em cascata.','A sessão deve iniciar, atualizar e encerrar sem referências conservadas da execução anterior.','Behavior'],
['ui-sem-evento','UI sem evento','Um controle visível não entrega a interação esperada.','Canvas errado, elemento desabilitado, sobreposição capturando input, foco, nome diferente ou fila de eventos não consumida.','Selecione explicitamente o canvas correto. Confira o elemento com TryFind, seu estado e interação. Consuma Poll e compare o Kind do evento.','Pressionar e soltar deve produzir o evento correto sem ativar elementos que estejam atrás.','GuiAccess'],
['audio-sem-reproducao','Áudio sem reprodução','Uma voz não produz som audível.','Clip ausente, voz parada/pausada, ganho baixo, bus silenciado, listener ou lifetime inválido.','Leia Snapshot e confira o recurso. Teste uma voz com configuração simples e volume conhecido. Verifique o áudio do dispositivo antes de alterar a cena inteira.','Play, Pause, Resume e Stop devem refletir no estado e na saída observada.','AudioVoice'],
];
for(const [slug,title,description,causes,steps,confirm,type] of diagnostics)guide(`diagnostico/${slug}`,title,description,[['Causas a conferir',causes],['Investigar',steps],['Confirmar a correção',confirm],['Contrato relacionado',api(type)]]);

const performance=[
['como-medir','Como medir','Construa uma comparação reproduzível.','Registre build, aparelho/GPU, cena, resolução, qualidade, duração, aquecimento e condições térmicas. Diferencie Debug com validação de uma build de desempenho.','Compare o mesmo percurso e a mesma câmera. Guarde tempos de CPU/GPU e distribuição de frames, não apenas um FPS instantâneo. Metas de 60/120 FPS não são resultados medidos.'],
['cpu-e-atualizacao','CPU e atualização','Descubra em qual etapa o quadro gasta tempo.','Scripts, transformações, física, culling e submissão têm custos diferentes. Uma espera pela GPU pode aparecer como tempo de CPU sem significar trabalho útil do processador.','Reduza uma carga de cada vez e compare o perfil. Evite procurar objetos por nome repetidamente em Update quando uma referência válida pode ser conservada durante a sessão.'],
['gpu-e-draw-calls','GPU e draw calls','Mais FPS exige localizar o custo dominante.','Draw calls são apenas uma dimensão: pixels, sombras, transparência, largura de banda e complexidade do shader também consomem GPU. Diminuir chamadas não garante ganho se o gargalo estiver em outro estágio.','Compare a mesma imagem e configuração. Se reduzir resolução melhora muito o tempo de GPU, investigue custo por pixel. Registre qualquer mudança visual junto da medição.'],
['texturas-e-memoria','Texturas e memória','Considere o tamanho residente, não apenas o arquivo comprimido.','Dimensões, formato, mipmaps e número de recursos simultâneos influenciam memória e bandwidth. Um arquivo pequeno no disco pode resultar em uma imagem grande na GPU.','Revise materiais e texturas repetidas. Compare qualidade em distâncias reais de câmera. Não remova mipmaps ou diminua resolução sem verificar estabilidade visual e aliasing.'],
['alocacoes-c','Alocações C#','Evite criar lixo continuamente nos caminhos por frame.','Coleções temporárias, strings e materialização de consultas podem gerar pressão no coletor. Algumas APIs retornam arrays ou listas; confira a assinatura e a frequência de uso.','Conserve referências enquanto forem válidas e faça consultas caras na frequência necessária. Não transforme otimizações locais em estado global que sobreviva indevidamente ao Play.'],
['fisica-e-queries','Física e queries','Meça corpos ativos e consultas como cargas separadas.','A quantidade de pares, formas, contatos e passos influencia a simulação. RayCastAll e Overlap também dependem da capacidade solicitada e podem indicar truncamento.','Use filtros compatíveis com a necessidade da mecânica. Observe truncated e não interprete uma lista limitada como todos os objetos do mundo. Compare o custo mantendo a mesma cena.'],
['carga-de-cenas','Carga de cenas','Separe I/O, importação, criação e publicação.','Abrir uma cena pode envolver leitura, resolução de recursos, derivados e criação de objetos. Medir só o clique até a primeira imagem não explica qual etapa causa a espera.','Compare primeira abertura e reabertura com cache. Registre recursos e tamanho. Não declare ganho se a versão rápida apenas deixou de carregar parte do conteúdo.'],
['termica-e-bateria','Térmica e bateria','Desempenho sustentado exige uma janela de observação.','A frequência e o custo podem mudar com aquecimento, energia, brilho e limite de frames. Temperatura de bateria isolada não determina a temperatura ou throttling do SoC.','Use build e condições comparáveis, warmup e duração registrada. Anote queda ao longo do tempo e preserve o mesmo cenário. Um pico de FPS não comprova estabilidade térmica.'],
['qualidade-e-resolucao','Qualidade e resolução','Publique a configuração efetiva junto de qualquer métrica.','Resolução dinâmica, sombras, luzes, materiais e efeitos alteram custo e imagem. Dois números de FPS não são comparáveis se uma execução reduziu a resolução sem registrar isso.','Fixe ou registre a escala real. Capture a mesma câmera para comparar perda visual. Distinga opção autoral, política solicitada e capacidade resolvida pelo backend.'],
['orcamentos-por-aparelho','Orçamentos por aparelho','Trate cada perfil como evidência específica.','Um orçamento depende de GPU, driver, resolução, cenário, energia e temperatura. Não transfira a medição de um aparelho para todos os modelos com uma classificação comercial parecida.','Defina uma cena representativa e acompanhe média, p95/p99 e estabilidade. Este portal não publica uma tabela universal de desempenho nem promete uma taxa de frames sem ensaio correspondente.'],
];
for(const [slug,title,description,meaning,method] of performance)guide(`desempenho/${slug}`,title,description,[['O que observar',meaning],['Método de comparação',method],['Registro mínimo','Guarde versão, configuração, cena e resultado junto da evidência. Ensaios de host, build Android, instalação e execução física são etapas distintas.']]);

export const examples=[{id:'rotate-object',filename:'RotateObject.cs',code:rotate,description:'Gira um objeto visual no eixo Y local a 0,5 rad/s.',prerequisites:'Objeto sem autoridade física, geometria visível, Behavior anexado.'}];
examples.push(...heartExamples);
function recipe(slug,title,description,setup,code,expect,limits,type){
  const body=`## Composição da cena\n\n${setup}\n\n## Implementação\n\n${code?'```csharp\n'+code+'\n```':'Configure os valores pelo Inspector e consulte a API relacionada antes de adicionar controle por script.'}\n\n## Resultado esperado\n\n${expect}\n\n## Cuidados\n\n${limits}\n\nConsulte ${typeLink(type)}. As instruções descrevem o cenário proposto; a execução em dispositivo não foi realizada nesta publicação.`;
  add(`receitas/${slug}`,title,description,body,{kind:'recipe'});
}
recipe('girar-um-objeto','Girar um objeto','Integre velocidade angular com o delta da atualização.','Objeto visual sem corpo ou personagem escrevendo sua pose; câmera enquadrada.',rotate,'Rotação local contínua a 0,5 rad/s.','Use radianos e multiplique por deltaTime uma única vez. Uma esfera sem detalhes pode esconder visualmente a rotação.','GameObject');
const movement=`using Astra;
using System.Numerics;

[ComponentId("docs.move-local")]
public sealed class MoveLocal : Behavior
{
    public override void Update(float deltaTime)
    {
        Object.Translate(Vector3.UnitZ * deltaTime,
                         TransformSpace.Local);
    }
}`;
examples.push({id:'move-local',filename:'MoveLocal.cs',code:movement,description:'Desloca um objeto visual no seu eixo Z local.',prerequisites:'Objeto visual sem autoridade física e câmera enquadrada.'});
recipe('mover-em-espaco-local','Mover em espaço local','Mova na direção do objeto, mesmo quando ele está rotacionado.','Objeto visual com orientação diferente da identidade, sem física comandando a pose.',movement,'O objeto percorre seu eixo Z local; rotacioná-lo muda a direção do movimento.','Compare com TransformSpace.World mantendo a mesma rotação. Não use este exemplo como motor de personagem físico.','GameObject');
const spawn=`using Astra;

[ComponentId("docs.spawn-temporary")]
public sealed class SpawnTemporary : Behavior
{
    public override void Start()
    {
        var child = Object.CreatePrimitive(PrimitiveType.Cube);
        child.Name = "Cubo temporário";
        child.Destroy(3.0);
    }
}`;
examples.push({id:'spawn-temporary',filename:'SpawnTemporary.cs',code:spawn,description:'Cria um cubo e solicita destruição após três segundos.',prerequisites:'Behavior em objeto ativo; câmera precisa enquadrar a posição de criação.'});
recipe('criar-e-remover-objetos','Criar e remover objetos','Associe criação e lifetime a uma intenção de gameplay.','Objeto com Behavior e câmera capaz de ver sua posição.',spawn,'Um cubo é criado e a remoção é solicitada após o atraso.','A composição da primitiva depende do contrato da engine. Não conserve o handle após destruição; mudanças estruturais seguem o ponto seguro.','GameObject');
recipe('encontrar-componentes','Encontrar componentes','Trate ausência como uma possibilidade real.','Objeto que pode ou não possuir Light.',`var light = Object.GetComponent(ComponentIds.Light);
if (light is not null)
{
    light.SetFloat("intensity", 2.0f);
}`,'Somente o componente encontrado é editado.','Trecho para uso dentro de um Behavior. Multiplicidade exige escolher a instância certa; não faça buscas sem necessidade a cada frame.','Component');
recipe('camera-acompanhando-alvo','Câmera acompanhando alvo','Separe alvo, offset e amortecimento.','Uma Camera com CameraFollow no mesmo objeto; alvo válido na mesma sessão.',`var component = Object.GetComponent(ComponentIds.CameraFollow);
var target = Object.FindInWorld("Alvo");
if (component is not null && target is not null)
{
    var follow = component.CameraFollow();
    follow.Target = target.AsReference();
    follow.Offset = new System.Numerics.Vector3(0, 2, -5);
    follow.DampingSeconds = 0.2f;
}`,'A posição da câmera acompanha o alvo com o offset configurado.','Trecho de inicialização de um Behavior na câmera. O acompanhamento descrito não cria automaticamente um sistema de enquadramento, oclusão ou orientação.','CameraFollowRig');
recipe('ler-uma-acao','Ler uma ação','Use o nome configurado pelo projeto.','Uma ação chamada Interagir configurada com um vínculo.',`if (Input.Exists("Interagir") && Input.JustPressed("Interagir"))
{
    Object.Name = "Interação recebida";
}`,'No quadro do pressionamento, o nome do objeto muda.','Trecho para Update. Se a ação usa outro nome, ajuste-o. Confira foco, contexto e grupos de dispositivo.','InputAccess');
recipe('interagir-com-raycast','Interagir com raycast','Consulte a geometria física na direção do objeto.','Objeto emissor, alvo com collider e camadas incluídas no filtro.',`var hit = Physics.RayCast(Object.WorldPosition,
    Object.Forward * 5.0f, QueryFilter.Default.Ignoring(Object));
if (hit is { } contact)
{
    contact.Object.Name = "Alvo encontrado";
}`,'Um alvo físico encontrado pelo raio recebe o nome indicado.','Trecho para uma ação de interação em Behavior. O vetor carrega a extensão da consulta; não substitua por uma direção unitária quando deseja outro alcance. O exemplo altera nome, não implementa inventário ou regras de interação.','PhysicsAccess');
recipe('reagir-a-colisao','Reagir a colisão','Receba um evento e mantenha o contexto do contato.','Composição física capaz de produzir contatos e Behavior no objeto receptor.',`public override void CollisionEnter(Collision collision)
{
    var other = Resolve(collision.Other);
    if (other is not null)
        Object.Name = "Contato com " + other.Name;
}`,'O nome do receptor identifica o outro objeto quando o contato começa.','Trecho dentro de uma classe Behavior. Normal pode ser nula; triggers têm callbacks próprios e não equivalem a contato sólido.','Collision');
recipe('porta-cinematica','Porta cinemática','Uma porta móvel precisa manter a autoridade física coerente.','Porta com collider e corpo configurado como cinemático; botão ou sensor separado para a interação.',null,'A porta percorre uma pose aberta/fechada sem atravessar a parede por erro de montagem.','Antes de escrever o movimento, confira a API de corpo da versão. Não aplique o exemplo de Translate para um corpo dinâmico. Defina duração, reversão e comportamento ao encontrar obstáculo; esta receita descreve a composição, não entrega um controlador completo de porta.','PhysicsBodyRuntime');
recipe('aplicar-impulso','Aplicar impulso','Aplique um impulso no ponto de mundo escolhido.','Corpo dinâmico com collider e massa válida.',`var body = Object.PhysicsBody();
body.AddImpulseAtPosition(
    new System.Numerics.Vector3(0, 2, 0), body.CenterOfMass);`,'O corpo recebe impulso vertical no centro de massa.','Trecho executado uma vez por ação. Aplicar impulso em todo Update muda a mecânica e faz o resultado depender da frequência; não confunda impulso com força contínua.','PhysicsBodyRuntime');
recipe('contagem-regressiva','Contagem regressiva','Dispare um Timer sem depender da contagem de frames.','Componente Timer no mesmo objeto do Behavior.',`public override void Start()
{
    var component = Object.GetComponent("astra.time.timer");
    if (component is not null)
        component.Timer().Start(5.0);
}

public override void TimerElapsed(ulong timerInstanceId, uint count)
{
    Object.Name = "Tempo encerrado";
}`,'O evento altera o nome após o intervalo.','Trecho dentro de Behavior. Confira Repeat e IgnoreTimeScale. Se há vários timers, compare timerInstanceId e considere count.','Components.GameTimer');
recipe('transicao-com-tween','Transição com tween','Anime somente uma propriedade elegível.','Uma Camera no objeto e nenhum outro escritor do campo de visão.',`var camera = Object.GetComponent(ComponentIds.Camera);
if (camera is not null)
{
    var transition = camera.TweenFloat("vertical_fov", 75.0f, 1.0f);
    // Conserve a operação se precisar consultar ou cancelar a transição.
}`,'O campo de visão progride até 75 graus ao longo de um segundo.','Trecho de inicialização com using Astra. A propriedade é marcada como tweenable no contrato; trate conflito de escrita e cancelamento conforme o lifetime do Behavior.','NumberTween');
const save=`using Astra;

[ComponentId("docs.visit-counter")]
public sealed class VisitCounter : Behavior
{
    public override void Start()
    {
        long visits = Save.GetInt64("visits", 0) + 1;
        Save.SetInt64("visits", visits);
        Save.Flush();
        Object.Name = "Visita " + visits;
    }
}`;
examples.push({id:'visit-counter',filename:'VisitCounter.cs',code:save,description:'Incrementa e grava uma chave tipada ao iniciar.',prerequisites:'Projeto com SaveStore disponível; Behavior ativo.'});
recipe('salvar-progresso','Salvar progresso','Confirme alterações de chaves explicitamente.','Behavior em projeto com namespace de persistência disponível.',save,'A contagem aumenta a cada nova inicialização do Behavior e é gravada com Flush.','A chave deve manter o mesmo tipo entre versões. Trate erros de I/O e não use Flush a cada frame.','SaveStore');
recipe('trocar-de-cena','Trocar de cena','Solicite uma cena que pertence ao projeto.','Duas cenas registradas e nome de destino conferido em Scenes.Names.',`Scenes.Load("segunda-cena");`,'O mundo é substituído no fim do quadro corrente.','Trecho dentro de Behavior; o nome é um exemplo e precisa existir no seu projeto. Não faça a solicitação continuamente em Update nem conserve referências do mundo antigo.','ScenesAccess');
recipe('botao-de-ui','Botão de UI','Consuma o evento do controle certo.','Canvas com um botão chamado Comecar e Behavior consultando esse canvas.',`while (Gui.Poll(out var message))
{
    if (message.Kind == GuiEventKind.Click &&
        message.Element.Name == "Comecar")
    {
        Object.Name = "Botão acionado";
    }
}`,'Um click no controle nomeado altera o objeto receptor.','Trecho de Update. Se houver vários canvases, obtenha o GuiAccess correto. Esta receita consome a fila; coordene os consumidores para não retirar eventos de outro sistema.','GuiAccess');
recipe('controle-de-volume','Controle de volume','Ajuste o parâmetro de áudio correspondente ao escopo desejado.','AudioSource com clip válido, listener e bus configurados.',null,'O ajuste de ganho/mute no componente altera a reprodução da fonte.','Escolha se o controle atua em uma voz, um bus ou na política global. Confira os limites da propriedade no componente; um slider visual sem escrita na fonte não controla áudio.','Components.AudioSource');
recipe('percorrer-caminho','Percorrer caminho','Conecte o seguidor ao caminho antes de iniciar.','Path com pontos válidos e PathFollow no objeto que deve se mover.',`var component = Object.GetComponent(ComponentIds.PathFollow);
if (component is not null)
    component.FollowPath().Restart();`,'O seguidor reinicia a execução do caminho atribuído.','Trecho de Behavior. Atribua a referência do caminho e configure progressão/orientação no Inspector. Restart não cria um caminho nem corrige disputa de autoridade.','PathFollower');
recipe('instanciar-prefab','Instanciar prefab','Use a identidade de um recurso prefab do projeto.','Prefab importado/registrado e AssetGuid válido obtido de uma propriedade de recurso.',`// prefabAsset é um AssetGuid de recurso atribuído pelo projeto.
var instance = Object.InstantiatePrefab(prefabAsset);
instance.Name = "Instância";`,'Uma instância do recurso é criada sob o contexto de autoria definido pela API.','Trecho contextual: prefabAsset deve ser fornecido pelo projeto. Não invente um GUID e não confunda instanciar com copiar o arquivo de cena.','GameObject');

guide('exemplos/como-executar-exemplos','Como executar exemplos','Use os scripts pequenos para isolar um comportamento.',[
['Downloads desta publicação','Os microexemplos são arquivos C# independentes escritos para o portal. Eles não incluem o código da engine nem um projeto completo. Acompanhe os pré-requisitos e o estado no [manifesto]($BASE/ia/manifesto-de-exemplos/).'],
['Preparação','Crie uma cena pequena, adicione geometria e câmera, crie/anexe o script e compile no editor. Inicie Play e compare o resultado com a receita. Ao terminar, pare e confira a cena autoral.'],
['Escolha um exemplo','- [Rotação]($BASE/receitas/girar-um-objeto/)\n- [Movimento local]($BASE/receitas/mover-em-espaco-local/)\n- [Objeto temporário]($BASE/receitas/criar-e-remover-objetos/)\n- [Persistência]($BASE/receitas/salvar-progresso/)'],
['Projetos maiores','Os jogos a seguir são referências de curadoria baseadas na documentação interna existente. O portal não oferece downloads de pacotes ainda não auditados e não afirma que a distribuição atual já os inclui.']]);
guide('exemplos/cena-minima-de-lifecycle','Cena mínima de lifecycle','Observe a ordem das fases sem misturar vários sistemas.',[
['Cena','Use um objeto ativo com Behavior e uma câmera. Mantenha o script sem dependências de física, áudio ou recursos externos.'],
['Experimento','Adicione marcadores de diagnóstico em Awake, Enable, Start, Update, Disable, Stop e Destroy conforme a API de logging da instalação. Evite emitir mensagem em todo Update durante uma sessão longa.'],
['O que conferir','Inicie, desabilite/habilite o comportamento, remova o objeto e encerre Play em execuções separadas. Registre a ordem observada e compare os callbacks com a referência de Behavior. Este é um roteiro de investigação, sem log de execução fabricado.']]);
const games=[
['cristais-do-templo','Cristais do Templo','Recolher seis cristais e alcançar o portal.','Câmera ortográfica, input, ativação de objetos e materiais emissivos.','Movimento no eixo esquerdo e Ação para impulso.'],
['circuito-neon','Circuito Neon','Atravessar cinco portais em ordem.','Câmera em perspectiva, acompanhamento, corpos e checkpoints.','Eixo vertical para acelerar/frear, horizontal para desviar e Ação para turbo.'],
['arena-de-drones','Arena de Drones','Eliminar 48 drones com pulsos de ação.','Muitos objetos, comportamentos, corpos e carga de desenho.','Movimento no eixo esquerdo e Ação para o pulso.'],
['quarentena','Quarentena 04','Recolher fusíveis, religar o gerador e escapar.','Personagem, raycast, porta cinemática e recursos GLB.','Movimento e olhar em primeira pessoa; interação por mira.'],
['resgate-na-mina','Resgate na Mina','Acionar bombas, socorrer pessoas e alcançar o elevador.','Raycast, impulso físico, iluminação e controle de oxigênio.','Movimento em primeira pessoa e ação de interação.'],
['perimetro-delta','Perímetro Delta','Neutralizar sentinelas e alcançar a extração.','Raycast, dano, recarga, patrulha e linha de visão.','Mira e tiro, cobertura e recarga conforme o projeto.'],
['linha-fantasma','Linha Fantasma','Religar uma estação antes da partida.','Cenário GLB, texturas, física, lanterna e missão cronometrada.','Exploração em primeira pessoa e interação com fusíveis e equipamentos.'],
];
for(const [slug,title,goal,features,controls] of games)guide(`exemplos/${slug}`,title,goal,[['O que estudar',features],['Fluxo descrito no projeto',controls+' Abra o projeto na versão distribuída, compile os scripts antes de Play e confira os recursos importados.'],['Estado da curadoria','Esta página resume um projeto documentado anteriormente. Não foi reexecutado neste snapshot e não há download público auditado nesta publicação. Contagens históricas de entidades, vitórias ou FPS não são usadas como prova da versão atual.'],['Como aproveitar','Isole uma mecânica em uma cena pequena e compare com as [receitas]($BASE/receitas/girar-um-objeto/). Preserve uma cópia autoral antes de modificar o exemplo.']]);
guide('exemplos/curadoria-de-outros-projetos','Curadoria de outros projetos','Um projeto demonstrativo precisa ser distribuível e reproduzível.',[
['Antes de publicar','Confira recursos, licenças, scripts, versão de arquivo e dependências externas. O pacote deve abrir sem acesso ao repositório privado.'],
['Cenário de aceite','Abrir → compilar → iniciar Play → executar a mecânica central → parar → salvar → reabrir. Registre o aparelho e a versão. Uma screenshot do editor não prova gameplay.'],
['Entrega','Disponibilize arquivo, tamanho, hash, requisitos e roteiro. Projetos que ainda não passaram por essa revisão permanecem em curadoria, sem botão de download fictício.']]);

guide('versoes/estado-da-versao','Estado da versão','Snapshot de documentação de 06 de outubro de 2026.',[
['Aprofundamento por uso','Esta revisão documenta caminho/efeito dos 892 campos de 49 registros de componentes; inclui 13 elementos de documento UI, Image/UiImage, layout, ações, animação e tutorial de corações com recursos/scripts para baixar. Os 3.095 membros da API têm acesso e vínculo ao roadmap; explicações especializadas ainda pendentes são sinalizadas. Contagens atuais ficam no [manifesto de cobertura](/snapshot-2026-10-06/coverage.json).'],
['Geração documentada','Astra atual · C# · assembly Astra.Scripting. Este identificador é um snapshot datado, não uma versão comercial inventada. Planos de Astra 2, Luau, The Forge e RmlUi não são apresentados como capacidades simultâneas desta geração.'],
['O que foi extraído','A API foi analisada semanticamente com Roslyn/MSBuild. Interfaces de infraestrutura, namespaces Runtime/Compilation e tipos de transporte selecionados ficam fora do recorte de gameplay. Componentes e padrões foram extraídos dos descritores compilados da engine. Consulte as contagens no [manifesto de cobertura](/snapshot-2026-10-06/coverage.json).'],
['O que a publicação não comprova','As páginas de API fornecem assinaturas e comentários existentes; nem todo membro tem explicação editorial de custo, exceções e lifecycle. A referência dos componentes cobre números, booleanos, enums e referências de objeto; recursos e coleções podem exigir APIs específicas. Não foi realizada uma campanha de testes de engine ou validação física Android nesta publicação.'],
['Como interpretar os guias','Guias e receitas explicam contratos e oferecem cenários de conferência. Projetos maiores permanecem em curadoria. Uma página existente não significa que todo gate editorial do plano foi concluído.'],
['Atualizações','Novas revisões devem regenerar a referência e os exports, revisar o impacto de comportamento e publicar este portal. Os [dados para IA]($BASE/ia/como-consultar-por-versao/) mantêm versão e limitações.']]);
guide('versoes/changelog','Changelog do portal','Mudanças da documentação, separadas de releases da engine.',[
['06/10/2026 — documentação pelo fluxo de criação','UI de jogo e roadmap ganharam seções próprias; Image pode ser encontrada como UiImage/UIIMG. Tutorial de HUD de corações inclui árvore, campos, PNGs, documento AEUI e scripts de dano/cura. Componentes ganharam uso/caminho de cada campo, e a API ganhou acesso/roadmap por membro com backlog explícito. Registro público contém 91 famílias do inventário base e 41 capacidades do renderer.'],
['06/10/2026 — fundação do portal','Identidade Astra e Orbit aplicada ao site; navegação responsiva; tema claro/escuro; busca estática; catálogo filtrável; guias, receitas e diagnósticos; referência C# semântica; páginas de componentes; exports Markdown/JSON e manifesto de exemplos.'],
['Sem release de engine implícita','O snapshot de documentação e o APK têm identificadores próprios. Consulte a [página de download](/download/) para a versão distribuída, assinatura e evidências do pacote. Funcionalidades citadas aqui são documentadas no contexto do snapshot; a publicação do portal não comprova execução no aparelho.'],
['Próximas revisões editoriais','Aprofundar descrição de membros que só possuem assinatura; executar os cenários de exemplos; revisar fluxos do editor em aparelho; auditar recursos e coleções que não entram na tabela de reflexão.']]);
guide('versoes/compatibilidade','Compatibilidade','Mantenha código, conteúdo e documentação na mesma geração.',[
['Scripts','Confira namespace, assinatura, enum e unidade na versão consultada. Não substitua chamadas por equivalentes de outra engine sem ler o contrato.'],
['Cenas','Uma cena depende de versão de payload e recursos. Preserve uma cópia antes de converter. Um arquivo reconhecido não garante que todos os seus recursos estão presentes.'],
['Gerações futuras','Astra 2 permanece fora desta referência. Uma futura migração de linguagem exige revisar lifecycle, bindings, ownership e formatos; não se resume a traduzir sintaxe.']]);
guide('versoes/breaking-changes','Breaking changes','Identifique alterações que exigem ação do autor do projeto.',[
['Contrato público','Mudança de assinatura, unidade, valor padrão, comportamento de callback, identidade persistente ou semântica de enum pode exigir migração mesmo quando o projeto ainda compila.'],
['Snapshot inicial','Não há uma versão anterior publicada neste portal para produzir um diff confiável. Nenhuma lista de breaking changes da engine é inventada a partir da data de criação do site.'],
['Revisão de atualização','Compare os índices JSON entre snapshots, revise as diferenças de comportamento e execute o cenário central do projeto. Registre substituto e ação necessária para cada item obsoleto.']]);
guide('versoes/migracao-de-cenas','Migração de cenas','Preserve dados antes de converter um projeto.',[
['Preparação','Duplique o projeto e seus recursos. Registre a versão que consegue abrir a cópia original. Evite misturar conversão de formato com reorganização de assets.'],
['Conferência','Compare quantidade de objetos, hierarquia, transformações, componentes e referências de recurso. Salve a cópia migrada, reabra e execute uma cena curta em Play.'],
['Falha','Preserve arquivos rejeitados e mensagens. Uma migração incompleta deve ser tratada explicitamente; não substitua componentes ausentes por placeholders silenciosos.']]);
guide('versoes/migracao-de-scripts','Migração de scripts','Atualize o significado da chamada, não apenas seu nome.',[
['Comece pelos contratos','Confira callbacks, tipos, overloads, defaults e unidades. A diferença entre radianos e graus pode passar pela compilação e ainda quebrar a mecânica.'],
['Identidades persistentes','Preserve ComponentId e PropertyId quando a intenção é manter referências e valores existentes. Renomear uma classe e trocar sua identidade persistente são decisões distintas.'],
['Depois de compilar','Confira criação, atualização, remoção e término de Play. Verifique objetos criados em runtime e inscrições/corrotinas que podem manter referências antigas.']]);
guide('versoes/privacidade','Privacidade e uso','Informações de leitura e limites de distribuição do portal.',[
['Dados no navegador','A busca é estática e executada no navegador. O tema utiliza armazenamento local para lembrar a preferência. O portal não inclui formulário de conta, analytics próprio ou envio dos termos de busca para um backend de pesquisa. O provedor de hospedagem pode processar dados técnicos das requisições.'],
['Código e materiais','O portal publica documentação, contratos selecionados e microexemplos. Não distribui o repositório privado da engine. Nenhuma licença aberta para o código da engine é concedida por esta publicação.'],
['Exemplos e autoria','Os arquivos de exemplo acompanham explicação, versão, tamanho e hash. A política de redistribuição e uma licença editorial pública ainda não foram definidas. Consulte o responsável pelo projeto antes de redistribuir materiais como um pacote próprio.']]);
guide('ia/como-consultar-por-versao','Como consultar por versão','Use contratos explícitos antes de gerar código.',[
['Descoberta','Comece em [llms.txt](/llms.txt). Todas as rotas desta publicação apontam para snapshot-2026-10-06, geração astra-current e linguagem C#.'],
['Consulta','1. Localize o tipo no [índice de API](/snapshot-2026-10-06/api-index.json).\n2. Leia a página Markdown correspondente e as restrições.\n3. Confira o componente e os requisitos no [índice de componentes](/snapshot-2026-10-06/component-index.json).\n4. Use exemplos da mesma versão.\n5. Declare quando uma resposta depende de comportamento ainda não validado.'],
['Não inferir','Ausência de comentário não autoriza inventar uma exceção, default ou suporte. Assinatura presente não é prova de execução em Android. Nomes de Unity/Godot servem de referência e não autorizam importar suas APIs para a Astra.']]);
guide('ia/indice-markdown','Índice Markdown','Leia a mesma documentação sem depender da interface.',[
['Arquivos','Cada página possui uma representação Markdown estável em /markdown/. Use o link “Ler em Markdown” no rodapé dos artigos. O [índice completo](/snapshot-2026-10-06/markdown-index.json) associa título, URL e arquivo.'],
['Paridade','O export é produzido a partir do mesmo corpo que gera as páginas. Assinaturas, tabelas e avisos acompanham o conteúdo. Catálogos interativos possuem uma representação textual com todos os links.'],
['Leitura consolidada','[llms-full.txt](/llms-full.txt) contém a exportação consolidada. Para consultas menores, prefira o índice e a página relevante.']]);
guide('ia/indice-de-api-json','Índice de API JSON','Encontre a identidade semântica de tipos e membros.',[
['Contrato','O [api-index.json](/snapshot-2026-10-06/api-index.json) contém UID, assinatura, categoria, versão, URL e resumo quando existe no código. As âncoras derivam do UID semântico e não do título traduzido.'],
['Overloads','Overloads possuem identidades distintas. Confira parâmetros, modificadores e defaults; o nome do método sozinho não identifica o contrato.'],
['Limite','O índice não publica corpos de implementação nem substitui revisão do comportamento. runtimeVerified e platformEvidence permanecem explícitos.']]);
guide('ia/indice-de-componentes','Índice de componentes','Consulte composição e propriedades do mesmo snapshot.',[
['Dados','O [component-index.json](/snapshot-2026-10-06/component-index.json) inclui typeId, família, fachada, requisitos, conflitos, versão de payload, mutabilidade e propriedades.'],
['Padrões','Os padrões são lidos do componente recém-criado. Campos por slot e propriedades condicionais incluem essa distinção. Um padrão vazio pode depender de recursos atribuídos.'],
['Cobertura','A projeção atual cobre números, booleanos, enums e referências de objeto. Recursos e coleções especializados precisam da API correspondente; não trate a tabela como todo o estado serializado.']]);
guide('ia/manifesto-de-exemplos','Manifesto de exemplos','Identifique os arquivos disponíveis e o que foi verificado.',[
['Downloads','O [examples.json](/snapshot-2026-10-06/examples.json) registra descrição, pré-requisitos, URL, tamanho, SHA-256 e evidência de cada microexemplo. Os arquivos são pequenos e próprios desta documentação.'],
['Preparação','Anexe o Behavior ao objeto compatível com a receita, compile e execute o cenário. Os arquivos não incluem APK, assets da engine ou um projeto completo.'],
['Evidência','Compilação e execução são campos separados. Projetos históricos em curadoria não recebem links de download nem hashes inventados.']]);
guide('ia/limitacoes-conhecidas','Limitações conhecidas','Mantenha as lacunas junto dos dados consumidos por ferramentas.',[
['Referência técnica','Nem todo membro tem comentários editoriais de parâmetros, exceções, custo ou thread. O extrator garante identidade semântica e assinatura do recorte; não sintetiza garantias ausentes.'],
['Comportamento','Não há validação física Android nova associada a esta publicação. Exemplos e roteiros precisam de aceite na instalação efetiva. O catálogo não representa paridade integral com Unity/Godot.'],
['Distribuição','Não há instalador público nem pacote completo dos jogos históricos neste portal. A política de licença editorial ainda não está definida.'],
['Versão','Não misture esta API C# com o planejamento de Astra 2/Luau. Ao atualizar o snapshot, regenere os exports e revise os exemplos em conjunto.']]);

for (const page of uiPages) add(page.route, page.title, page.description, page.body);

guide('editor/mapa-de-acesso','Mapa de acesso: encontre a função antes de programar','Caminhos do editor, elementos UI, APIs e roadmap, começando pela intenção do usuário.',[
['Quero criar um HUD','Use [UI de jogo: onde fica]($BASE/ui/comece-aqui/). O componente é Canvas UI; Image, Text, Button e containers ficam no documento .aeui. [Corações com dano/cura]($BASE/ui/hud-coracoes/) inclui campos, árvore, recursos e scripts.'],
['Quero editar um campo de componente','Hierarquia → objeto → Inspector → componente → grupo → campo. O [catálogo]($BASE/componentes/) busca também nomes e IDs de propriedades. Cada tabela liga a uma explicação com caminho, efeito, valor inicial, domínio, unidade e condições. Escolha o slot quando o campo é por recurso/parte.'],
['Quero chamar uma função C#','Área de código → Behavior → compile → anexe ao objeto. Abra a [referência C#]($BASE/api/), encontre o tipo e o membro; leia Onde acessar este tipo, Caminho, Uso, argumentos e Roadmap. Métodos de física exigem composição; tipos de valor/enums não criam componentes pelo nome.'],
['Objeto, componente ou elemento UI?','- **Objeto:** entidade da Hierarquia da cena, com pose e componentes.\n- **Componente:** função anexada ao objeto, como Corpo físico ou Canvas UI.\n- **Recurso:** arquivo registrado, como Documento UI, clipe ou textura.\n- **Elemento UI:** nó dentro do documento, como Image; GuiElement identifica a cópia runtime da instância.\n- **API/runtime:** acesso do script ao consumidor no Play. [Conceitos de composição]($BASE/conceitos/composicao-de-componentes/).'],
['Quero saber se é possível hoje','Consulte a função e seus limites antes de implementar. [Roadmap UI]($BASE/ui/roadmap/), [renderer]($BASE/roadmap/capacidades-do-renderer/) e [91 famílias]($BASE/roadmap/registro-de-familias/) registram estados diferentes. Não há plano individual datado para todos os getters/setters. A referência mantém explícitos os membros cuja explicação especializada ainda está em revisão.'],
['Exemplos para usar','O [pacote de corações](/examples/heart-hud/Astra-Heart-Hud.zip) contém UI/hud.aeui, imagens e scripts para integrar num projeto existente. Não é uma cena completa por importação automática. O tutorial também ensina a autoria manual. Os [manifestos](/snapshot-2026-10-06/examples.json) distinguem compilação e execução.']]);

examples.push(...workflowExamples);
