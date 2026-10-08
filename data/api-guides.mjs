import { componentGuide, componentFamilies, familyFor, propertyUsage } from './component-guides.mjs';
const api=n=>`[${n}]($BASE/api/astra-${n.toLowerCase()}/)`;
export function apiContext(type,components) {
  const comp=components.find(c=>type.ns==='Astra.Components'&&c.api&&(type.name===c.api||type.fullName.startsWith(`Astra.Components.${c.api}.`)));
  if(comp) return {family:familyFor(comp.typeId),component:comp,access:`${componentGuide(comp).location}\n\nNo Behavior em Play, obtenha a fachada com \`Object.GetComponent<${comp.api}>()\`; trate null antes de usar. Para outro objeto, resolva uma ObjectReference e consulte nesse objeto. Criar \`new ${comp.api}(component)\` envolve um componente existente; não adiciona um componente à cena.`};
  const name=type.name;
  if(/^Gui/.test(name))return {family:'ui',access:`Editor → **Interface** → documento .aeui; cena → objeto **Canvas UI**. Dentro de um Behavior, **Gui.ForCanvas(owner)** seleciona a instância, **Find/TryFind** localiza o elemento e **Poll** consome eventos. ${name==='GuiAccess'?'Gui é a propriedade protegida herdada de Behavior; use ForCanvas para escolher explicitamente o proprietário.':name==='GuiElement'?'GuiElement vem de Find/TryFind/Create; um valor default não é um elemento válido.':`**${name}** configura ou descreve dados de GUI. Leia [campos e valores]($BASE/ui/layout-e-campos/) e use os records/enums com GuiElement ou GuiAccess.`} [HUD completo]($BASE/ui/hud-coracoes/).`};
  const entries=[
    [/^(Behavior|Component|ObjectReference|GameObject|World|Scene|Asset|Snapshot|Serialize|PropertyId|HideIn|ColorUsage|GradientUsage)/,'script','Crie/compile um Behavior na área de código e anexe ao objeto. **Object**, **Scene** e **Scenes** dão acesso ao mundo da sessão. Referências autorais são resolvidas com Resolve; handles do Play anterior não são reutilizados.'],
    [/^(Time|Wait|Coroutine|BehaviorAwait|NumberTween|TransformTween|GameTimer|Timer|Tween)/,'time','No Behavior, use **Time**, StartCoroutine/StartAsync ou o componente Timer/Transform Tween associado ao objeto. Dados de estado retornam do consumidor runtime; não se instanciam para iniciar uma simulação por conta própria.'],
    [/^(Physics2D|Body2D|BodyVelocity2D)/,'physics2d','No Behavior, use **Physics2D** para consultas ou a fachada Body2D/Collider2D do objeto. O plano é XY e os contratos de graus/radianos são explícitos.'],
    [/^(Physics|Character|DynamicMotor|Collision|Query|Ray|Shape)/,'physics','No Behavior, use **Physics**, Object.PhysicsBody(), Object.DynamicMotor() ou callbacks Collision/Trigger. Crie corpo/colisor antes; resultados de consulta não adicionam um corpo.'],
    [/^(Audio)/,'audio','Adicione Audio Source/Listener/Bus no objeto e atribua clipe do projeto. Obtenha o transporte AudioVoice pela API do componente existente; veja Component e AudioSource.'],
    [/^(Animation|Deformable|Keyframe|Tangent)/,'animation','Atribua dados de animação/deformação ao componente e obtenha o player/estado pela API do objeto ou componente. AnimationCurve/Keyframe descrevem dados; não tornam uma malha automaticamente deformável.'],
    [/^(Path|CurvePath|CurvePoint|CurveWrap)/,'path','Adicione **Path** e autorie pontos. Adicione **Path Follow** ao consumidor e atribua a fonte. A API especializada devolve amostras/frames do caminho.'],
    [/^(Graphics|Material|TextureStreaming)/,'render','Use configuração gráfica do projeto/ambiente ou o material/slot da malha. Leia política solicitada, resolvida e capacidades separadamente; um enum não prova backend disponível.'],
    [/^(Camera|GameView|ScreenRect)/,'camera','Configure Câmera, Olhar/Acompanhar alvo na cena. No Behavior, **View** fornece viewport/área segura e conversões. Uma leitura de View não configura automaticamente layout de UI.'],
    [/^(Input|Haptics)/,'ui','Configure ações do projeto e, no Behavior, use **Input** ou **Haptics**. Controles do Canvas leem o receptor pelo contexto Gui.ForCanvas; não confunda ação de entrada com evento de GUI.'],
    [/^(Save)/,'script','No Behavior, **Save** dá acesso ao armazenamento do projeto. Use chave e versão explícitas; salvar estado de gameplay não é salvar cena autoral.'],
    [/^(Color|Gradient|Mathf|RandomStream|Transform)/,'script','Tipos de valor/utilitários C# usados dentro de Behaviors e campos suportados. Construa o valor ou chame o membro estático conforme a declaração; ele só tem efeito quando um consumidor recebe o resultado.'],
  ];
  const record=entries.find(([re])=>re.test(name));
  return {family:record?.[1]||'script',access:record?.[2]||'Use este tipo no código C# do projeto, pela declaração abaixo. Ele não corresponde automaticamente a um botão ou componente no editor. Confira construtor, static e tipo de retorno antes de criar/obter uma instância.'};
}
const guiUsage={
  ForCanvas:'Escolhe a UI do objeto proprietário e, quando informado, a instância exata do componente. Não passa um GuiElement como proprietário.',
  Find:'Busca nome exato e entrega handle desta instância; lança erro se ausente. Resolva em Start e conserve enquanto a instância estiver viva.',
  TryFind:'Busca sem presumir sucesso; teste o bool antes de usar o out element. Útil quando o elemento é opcional.',
  Create:'Cria elemento na cópia runtime da instância. GuiKind define o tipo; parent precisa pertencer ao mesmo contexto. Não grava a autoria .aeui.',
  Poll:'Retira um evento da fila. Use while, filtre Kind e identifique Element. Mantenha um consumidor da fila por Canvas.',
  Diagnostic:'Mensagem de diagnóstico da instância, útil para ação/alvo/pose inválidos. Não é um status global de todas as UI.',
  Image:'Caminho relativo de imagem dentro do projeto. Troca o recurso do elemento Image; não aceita URL/caminho externo.',
  ImageStyle:'Fit e Tint da Image. Use with para conservar o outro campo. Conter preserva proporção e cabe inteira.',
  Visible:'Liga/desliga a apresentação da subárvore. No HUD, esconde camada cheia e mantém a imagem vazia atrás.',
  Enabled:'Participação em input/estado desabilitado; pode continuar desenhado. Ancestrais também influenciam.',
  Layout:'Âncoras normalizadas e bordas em pixels do pai. Offsets são esquerda/topo/direita/base, não largura/altura.',
  Sizing:'Tamanhos mínimo/preferido, pesos e espaçamento do layout automático. Pai HBox/VBox/Grid pode controlar o retângulo.',
  Style:'Fundo, conteúdo, destaque, clipping, fonte e raio. Cores usam 0xAARRGGBB; preserve campos com with.',
  SetText:'Altera string do elemento runtime; Image não desenha texto.',Text:'Lê/escreve conteúdo textual. Atualize o Text de status quando a vida mudar.',
  Name:'Nome exato usado por Find. ID e lease conservam identidade; renomear não converte outro handle.',
  Id:'Identificador local do nó, não identidade global entre documentos/Canvas.',InstanceId:'Identidade da instância runtime; não salve uma lease como referência autoral.',
  Kind:'Tipo do elemento encontrado. Confira GuiKind.Image antes de tratar o nó como coração.',
  Snapshot:'Estado atual de tipo, visible/enabled e intervalo/valor, no contexto desta instância.',
  Value:'Escrita numérica para Toggle, Slider e Progress. Não altera vida nem preenchimento de Image.',
  OnClick:'Configura ação principal de clique e alvo da mesma instância; Notify permite consumir Poll. Para Image, o clique é opcional.',
  Interaction:'Clicável, ação, alvo e argumento do clique; alvo 0 significa o próprio elemento.',
  AddAction:'Acrescenta listener ordenado após ação principal, no mesmo documento. Até 16 ações por elemento no formato atual.',
  Actions:'Snapshot dos listeners adicionais; alterar o array retornado não substitui a lista no documento.',
  ReplaceAction:'Troca listener no índice indicado; preserve evento, alvo e argumento válidos.',
  RemoveAction:'Remove listener no índice indicado, preservando os demais.',MoveAction:'Reordena listeners; ordem altera a sequência dos efeitos.',
  Animation:'Configuração de uma transição de duas poses; enabled/autoplay/loop e delay são campos distintos.',
  PlayAnimation:'Reinicia a transição configurada; precisa de animação habilitada válida.',
  StopAnimation:'Para e restaura pose autoral. Não é pause/resume da transição.',
  Transitions:'Configura estados Normal, Pressionado e Desabilitado; combina pose/tinta com a animação.',
  Remove:'Remove nó e subárvore da cópia runtime, invalida handles/ações afetados. Não remove o componente Canvas da cena.',
  MoveEarlier:'Reordena o elemento na árvore runtime para posição anterior; observe desenho/hit/layout.',
  MoveLater:'Reordena o elemento na árvore runtime para posição posterior; observe desenho/hit/layout.',
  Input:'Estado bruto de gesto do controle (Value, Pressed, Pointer, Device). Não substitui ação do receptor.',
  InputAction:'Nome da ação compatível do catálogo do projeto. Não é GuiClickAction.',
  BaseImage:'Imagem de base do Joystick no projeto.',KnobImage:'Imagem de puxador do Joystick no projeto.',
  ControlSettings:'Modo/eixo/gate, raios, zonas mortas, resposta e visual do controle touch.',
  Canvas:'Apresentação da instância GUI; em cena, o componente UiCanvas é a origem da configuração. Não grava a fonte.',
  Axis:'Lê a componente X da ação do receptor.',Axis2:'Lê o vetor 2D da ação do receptor.',
  Pressed:'Estado mantido da ação do receptor.',JustPressed:'Borda de pressionar na amostra de entrada.',JustReleased:'Borda de soltar na amostra de entrada.',ActionState:'Estado tipado da ação amostrada, incluindo fase/valor.',
};
const guiFields={
  GuiLayout:{AnchorMin:'Âncora inicial XY normalizada em relação ao pai.',AnchorMax:'Âncora final XY normalizada em relação ao pai.',Offsets:'Bordas esquerda/topo/direita/base em pixels relativos às âncoras.'},
  GuiStyle:{Background:'Cor de fundo 0xAARRGGBB; alpha zero não desenha fundo.',Foreground:'Cor do texto/conteúdo do controle.',Accent:'Cor de destaque/preenchimento do controle.',ClipChildren:'Recorta desenho/hit de descendentes ao retângulo.',FontSize:'Tamanho do texto em pixels.',Radius:'Raio do fundo/imagem desenhados; não é uma hit mask por alpha.'},
  GuiSizing:{Minimum:'Tamanho mínimo XY do filho.',Preferred:'Tamanho preferido XY; zero mede conteúdo.',Flexible:'Peso de expansão dos filhos HBox/VBox.',Padding:'Margens internas esquerda/topo/direita/base.',Spacing:'Distância XY entre filhos; HBox usa X e VBox usa Y.',Alignment:'Início, Centro, Fim ou Esticar no container.',Columns:'Colunas do Grid.',Ignore:'Fora do fluxo automático; libera layout manual.'},
  GuiImageStyle:{Fit:'Modo de ajuste Stretch/Contain/Cover.',Tint:'Cor multiplicativa; branco 0xFFFFFFFF conserva imagem e alpha.'},
  GuiPose:{Position:'Deslocamento XY em pixels aplicado sobre o layout.',Scale:'Escala uniforme; não é escala independente por eixo.',Opacity:'Alpha da pose, propagado aos filhos.',Identity:'Pose sem deslocamento, escala 1 e alpha 1.'},
  GuiAnimation:{Enabled:'Habilita a transição de duas poses.',AutoPlay:'Inicia a transição automaticamente.',Loop:'Repete a transição após completar; atraso é inicial.',PingPong:'Executa ida e volta.',Easing:'Curva de interpolação.',Duration:'Tempo da transição, em segundos.',Delay:'Espera inicial, em segundos.',From:'Pose inicial.',To:'Pose final.',Default:'Configuração desativada, 0,3 s, curva Smooth, poses identidade.'},
  GuiInteraction:{Clickable:'Habilita clique opcional de Image/Text/Panel/container.',Action:'Ação primária ao clicar.',Target:'ID local no mesmo documento; zero = próprio elemento.',Value:'Argumento numérico da ação.'},
  GuiActionBinding:{Event:'Evento que dispara o listener: Click ou ValueChanged.',Action:'Ação nativa executada na ordem da lista.',Target:'Alvo local no mesmo documento; não é objeto de cena.',Value:'Argumento da ação, como valor de Progress.'},
  GuiStateStyle:{Pose:'Deslocamento, escala e alpha do estado.',Tint:'Cor multiplicativa do estado.',Identity:'Pose identidade e tinta branca.'},
  GuiTransitions:{Enabled:'Habilita Normal/Pressionado/Desabilitado.',Duration:'Tempo de mistura entre estados, em segundos.',Easing:'Curva da transição de estado.',Normal:'Visual sem interação.',Pressed:'Visual durante pressão.',Disabled:'Visual com elemento/ancestral desabilitado.',Default:'Desativado, 0,12 s; pressionado escala 0,94, desabilitado alpha 0,45.'},
  GuiCanvas:{Mode:'Screen para Tela ou World para plano de mundo.',Resolution:'Resolução do plano de mundo; Screen usa viewport.',Position:'Posição local do plano.',Rotation:'Euler do plano, em graus.',UnitsPerPixel:'Unidades do mundo por pixel.',Occlusion:'Profundidade/hit no plano de mundo.'},
  GuiControlSettings:{Mode:'Fixo/Flutuante/Dinâmico do controle.',Axis:'Restringe eixo Livre/Horizontal/Vertical.',Gate:'Domínio circular ou quadrado.',InputRadius:'Raio de referência da entrada em pixels.',BaseRadius:'Raio visual da base em pixels.',KnobRadius:'Raio visual do puxador.',Deadzone:'Zona morta interna normalizada.',OuterDeadzone:'Zona morta externa normalizada.',Exponent:'Expoente da curva de resposta.',Sensitivity:'Ganho da resposta.',ReturnSeconds:'Tempo do retorno visual.',ShowBase:'Mostra desenho da base.',ShowKnob:'Mostra desenho do puxador.',Default:'80/80/28 px, deadzone 0,12, ganho/expoente 1, retorno 0,12 s.'},
  GuiControlSnapshot:{Value:'Vetor bruto do gesto, não velocidade física.',Pressed:'Captura/pressão atual.',Pointer:'Identificador do ponteiro capturado.',Device:'Tipo/identidade de device; pointer igual não une mouse e touch.'},
  GuiSnapshot:{World:'Mundo da execução.',Id:'ID local do nó.',Kind:'Tipo de nó.',Visible:'Visibilidade do estado local.',Enabled:'Habilitação do estado local.',Value:'Valor de Toggle/Slider/Progress.',Minimum:'Extremo inferior autorado.',Maximum:'Extremo superior autorado.'},
  GuiEvent:{Element:'Handle da origem na instância que emitiu.',Kind:'Click ou ValueChanged.',Value:'Valor entregue com o evento.'},
};
export function memberGuide(type,m,context,componentMemberMap={},usageForField=propertyUsage) {
  let usage='';
  const mapping=componentMemberMap[`${type.fullName}.${m.name}`];
  if(context.component&&mapping){const fields=context.component.properties.filter(p=>mapping.includes(p.id));if(fields.length)usage=fields.map(p=>`**${p.name}:** ${usageForField(context.component,p)}`).join(' ');}
  if(!usage&&['GuiElement','GuiAccess','GuiInputAccess'].includes(type.name))usage=guiUsage[m.name]||'';
  if(!usage&&guiFields[type.name])usage=guiFields[type.name][m.name]||'';
  if(!usage && m.name==='.ctor')usage='Constrói o tipo pela assinatura declarada. Um construtor de fachada envolve um componente existente; um record de configuração só tem efeito quando atribuído ao consumidor.';
  if(!usage && m.kind==='Field' && type.kind==='Enum')usage='Opção deste enum. Use apenas no argumento/campo desse tipo; a presença da opção não comprova suporte da plataforma.';
  if(!usage && ['Wrap','Component','Object','IsAlive','InstanceId','TypeId','Remove'].includes(m.name)&&context.component){usage={Wrap:'Envolve um Component existente após conferir TypeId; não cria componente.',Component:'Handle genérico da instância, usado para operações de reflexão e recursos.',Object:'Objeto dono deste componente; use para resolver composição.',IsAlive:'Validade do handle no mundo/geração atuais. Remoção e novo Play invalidam a referência.',InstanceId:'Distingue a instância no mesmo objeto; importante para componentes múltiplos.',TypeId:'Identificador nativo usado em AddComponent/GetComponent.',Remove:'Solicita remoção pelo lifecycle nativo; dependências e regras de Play podem recusar.'}[m.name];}
  if(!usage && m.docs.summary)usage=m.docs.summary;
  if(!usage)usage=m.kind==='Property'?'Campo/propriedade conforme a declaração. Confira get/set/init e o tipo; a interpretação especializada ainda não tem revisão editorial individual neste snapshot.':m.kind==='Method'?'Chame pelo acesso deste tipo indicado acima, com argumentos da assinatura. O efeito especializado deste membro ainda precisa de revisão editorial individual; não deduza equivalência com Unity/Godot pelo nome.':'Contrato de dados conforme a declaração; a explicação individual permanece em revisão.';
  const path=context.component?`Inspector → ${context.component.name}${mapping?.length?` → ${context.component.properties.find(p=>mapping.includes(p.id))?.group||'Geral'}`:''}; ou fachada C# em um Behavior.`:/^Gui/.test(type.name)?'Interface / Canvas UI → documento → elemento; use o contexto Gui.ForCanvas em Behavior.':'Área de código → Behavior compilado/anexado → acesso descrito em “Onde acessar este tipo”.';
  return {usage,path,roadmapRoute:componentFamilies[context.family].route,editorialReviewed:!!mapping||!!guiFields[type.name]?.[m.name]||!!guiUsage[m.name]&&['GuiElement','GuiAccess','GuiInputAccess'].includes(type.name)||!!m.docs.summary};
}
