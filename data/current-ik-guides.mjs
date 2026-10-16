// Orientação dos componentes de IK, interação, encaixe, Filho de e Root motion
// que entraram no APK 0.3.1 (catálogo de 16/10/2026). Cada ficha diz para que
// serve, como criar pela interface, um exemplo concreto, detalhes, o que ainda
// falta e onde ler mais. Nada aqui promete capacidade que a engine não executa.
const ik = '/pt-br/desenvolvimento/2026-10-11/ik-e-constraints/';
const effects = '/pt-br/desenvolvimento/2026-10-12/ik-efeitos-e-interacao/';
const release031 = '/pt-br/snapshot-2026-10-06/versoes/preview-0-3-1/';
const recipes = `${release031}#criar--personagem`;
const studio = `${release031}#estúdio-de-animação-v2`;
const present = 'Presente na 0.3.1.';

export const ikGuides = {
  'astra.ik.two_bone': {
    purpose:'Leva a ponta de uma cadeia de dois ossos (mão, pé, garra) até um alvo, escolhendo a direção da dobra do cotovelo ou joelho.',
    use:'Com o personagem selecionado, Criar → Personagem → **Mãos ao alvo** cria o componente na mão e um alvo onde ela está. No estúdio, a ferramenta IK arrasta o alvo e grava chaves. Mova o alvo na cena e dê Play.',
    example:'No Robot Kyle, Mãos ao alvo cria "Alvo IK · Left_Wrist_Joint_01". Arraste esse alvo até a caixa sobre a mesa: em Play a mão vai até ele e o cotovelo dobra para o lado do objeto Direção da dobra, ou para o lado do plano configurado.',
    extra:'Solver Trigonométrico resolve em um passo; Limb aceita limites do rig. Referência decide se o plano da dobra vem do alvo ou do objeto. O Zero do plano e a Rotação do polo giram o plano sem precisar de um objeto de direção. Ponta segue rotação do alvo alinha a mão ao alvo, com o desvio em graus.',
    next:`${present} Limites por osso vêm do componente Limite de rotação no próprio osso. Sem data para alvos múltiplos por cadeia.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.chain': {
    purpose:'Resolve uma cadeia de N ossos (braço mecânico, cauda, tentáculo) até um alvo por CCD ou FABRIK.',
    use:'Adicione ao último osso da cadeia, escolha o Comprimento da cadeia e o Solver; aponte o Alvo. O modelo de cena **Braço mecânico com IK de cadeia** mostra o arranjo pronto.',
    example:'Braço de quatro segmentos: Comprimento 4, FABRIK, 12 iterações, tolerância .001 m. Mova o alvo: a garra chega em um quadro e a base respeita o Limite de rotação dela.',
    extra:'CCD converge osso a osso a partir da ponta; FABRIK alterna ida e volta e distribui melhor a curva. Iterações e Tolerância trocam precisão por custo. Direção da dobra, Zero do plano e Rotação do polo valem como no IK de dois ossos.',
    next:`${present} Sem alvos intermediários nem pesos por osso. Sem data prometida.`,
    related:`[IK e constraints](${ik})`,
  },
  'astra.ik.foot_grounding': {
    purpose:'Apoia um pé no chão real da cena: um raio desce a partir do pé e a perna se ajusta à altura e à inclinação da superfície.',
    use:'Criar → Personagem → **Pés no chão** adiciona ao pé de cada perna (e o Grounder do corpo ao personagem). Ajuste o Desvio do pé se a sola flutuar ou afundar.',
    example:'Kyle sobre uma rampa de 15°: com Alinhar à superfície, o pé inclina com a rampa; com Travar o pé, ele fica parado enquanto o outro passa, até a Altura de trava.',
    extra:'Altura do raio e Distância do raio delimitam onde o chão é procurado; Correção máxima limita quanto a perna pode esticar ou encolher. O Desvio do pé nasce da altura do osso do pé no repouso.',
    next:`${present} Sem detecção de borda nem previsão de passo. Sem data prometida.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.look_at': {
    purpose:'Cabeça e coluna olham para um alvo, com o peso do corpo distribuído pela cadeia e um ângulo máximo.',
    use:'Criar → Personagem → **Olhar para alvo** adiciona ao osso da cabeça com um alvo 2 m à frente do personagem e escolhe o eixo frontal do osso. Mova o alvo e dê Play.',
    example:'Com o alvo à frente, o Kyle olha reto; arraste-o 1 m para a esquerda e a cabeça gira dentro do Ângulo máximo, com a coluna acompanhando conforme o Peso do corpo.',
    extra:'Comprimento da cadeia conta quantos ossos acima da cabeça participam. Eixo frontal é o eixo local do osso que aponta para o alvo; os eixos de osso variam por modelo, e a receita escolhe o que melhor se alinha com a frente do personagem.',
    next:`${present} Sem olhos independentes nem suavização por velocidade neste componente (o Sistema de interação tem o olhar com velocidade). Sem data prometida.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.aim': {
    purpose:'Um osso (mão, cano, ferramenta) aponta o eixo escolhido para o alvo, girando os ossos acima com peso decrescente.',
    use:'Criar → Personagem → **Mirar com as mãos** adiciona a cada mão com um alvo 1,5 m à frente. Ajuste Comprimento da cadeia (2 = antebraço e braço) e Iterações.',
    example:'Mire o alvo "Mira · Right_Wrist_Joint_01" numa caixa no chão: a mão aponta para baixo e o braço acompanha; com Queda .5 o ombro gira metade do antebraço.',
    extra:'Queda distribui a rotação do topo para a base. Eixo frontal é o eixo local do osso que deve apontar; a receita escolhe o alinhado com a frente do personagem.',
    next:`${present} Sem limites por osso dentro do Aim; use Limite de rotação. Sem data prometida.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.rotation_limit': {
    purpose:'Limita a rotação de um osso no runtime, como dobradiça, ângulo ou cone, respeitado pelos solvers de IK.',
    use:'Adicione ao osso e escolha o Tipo: Dobradiça (um eixo entre Mínimo e Máximo), Ângulo (qualquer direção até o máximo) ou Cone (abertura em graus).',
    example:'Cotovelo: Dobradiça no eixo X, mínimo 0°, máximo 140°. Com IK de dois ossos, o alvo atrás das costas não vira o cotovelo ao contrário.',
    extra:'O rig do estúdio também mostra esses limites ao posar. O limite age depois dos solvers do mesmo osso.',
    next:`${present} Sem limite poligonal (Final IK RotationLimitPolygon). Sem data prometida.`,
    related:`[IK e constraints](${ik})`,
  },
  'astra.ik.grounder': {
    purpose:'Ajusta a pelve quando vários pés estão apoiados em alturas diferentes, para as pernas não esticarem além do possível.',
    use:'Criar → Personagem → **Pés no chão** adiciona ao personagem junto do Apoio do pé. Informe a Pelve se o nome não for reconhecido.',
    example:'Um pé sobre um bloco de 20 cm e outro no chão: a pelve desce até o Deslocamento máximo da pelve e os dois pés ficam apoiados.',
    extra:'Bípedes e quadrúpedes usam o mesmo componente; o modelo de cena **Quadrúpede com grounder** mostra quatro patas numa rampa.',
    next:`${present} Sem rotação da pelve pela inclinação média. Sem data prometida.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.finger_curl': {
    purpose:'Fecha ou abre os dedos a partir de um valor de curvatura, girando a cadeia de falanges.',
    use:'Adicione ao primeiro osso de cada dedo, escolha o Comprimento da cadeia (3 falanges) e anime Curvatura de 0 (aberto) a 1 (fechado) por chave ou script.',
    example:'Mão do Kyle: Curvatura .8 e Ângulo máximo 80° fecha o punho; .2 segura uma caixa sem atravessá-la.',
    extra:'Eixo é o eixo local em torno do qual as falanges giram.',
    next:`${present} Sem detecção de contato por dedo. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.offset': {
    purpose:'Desloca a pose final de um osso em metros depois dos solvers, sem mexer na animação.',
    use:'Adicione ao osso e anime os três deslocamentos; útil para balançar uma cabeça ou corrigir um alvo sem editar o clipe.',
    example:'Offset Y de .05 m no osso do peito faz o personagem respirar quando animado por tween.',
    extra:'O deslocamento é aplicado no espaço do osso, após IK e antes dos encaixes.',
    next:`${present} Sem rotação de offset neste componente. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.twist_relaxer': {
    purpose:'Distribui a torção de uma ponta (mão) pelos ossos de torção do antebraço, para o pulso não dobrar a malha.',
    use:'Adicione ao osso de torção (forearm twist) e ajuste o Peso.',
    example:'Com a mão girada 90° por IK, Peso 1 reparte a torção entre o antebraço e o osso de torção; sem ele, a malha do pulso afina.',
    extra:'Age depois dos solvers do membro.',
    next:`${present} Sem múltiplos ossos de torção por componente. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.hit_reaction': {
    purpose:'Reage a um impacto: a cadeia acima do osso atingido se inclina na direção da força e volta no tempo escolhido.',
    use:'Adicione ao osso atingido, defina Força, Duração e Comprimento da cadeia; com Reagir a colisões, qualquer contato físico dispara a reação. Por script, chame a reação com direção e intensidade.',
    example:'Peito com Força 25 e Duração .4 s: uma caixa lançada contra o Kyle faz o tronco recuar e retornar.',
    extra:'Eixo escolhe em torno de qual eixo local a cadeia dobra.',
    next:`${present} Sem ragdoll parcial. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.recoil': {
    purpose:'Recuo de disparo: a cadeia das mãos gira o Ângulo de coice e recua a distância escolhida, voltando em Duração.',
    use:'Adicione à mão que segura a arma, ajuste Ângulo de coice, Recuo e Duração; dispare por script.',
    example:'Ângulo 8°, Recuo .05 m, Duração .25 s: cada tiro levanta o cano e empurra a mão para trás.',
    extra:'Comprimento da cadeia decide quantos ossos acima da mão participam.',
    next:`${present} Sem padrão de dispersão. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.inertia': {
    purpose:'Um osso solto (cauda, orelha, antena) segue o movimento do pai com atraso elástico.',
    use:'Adicione ao osso e ajuste Rigidez e Amortecimento; Ângulo máximo evita dobras exageradas.',
    example:'Cauda da raposa do modelo Quadrúpede: Rigidez 40, Amortecimento .35, Ângulo máximo 35°.',
    extra:'A mola age no espaço do pai, sobre a pose animada.',
    next:`${present} Sem colisão da cadeia com o corpo. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.amplifier': {
    purpose:'Amplifica ou atenua o movimento animado de um osso em relação ao pai.',
    use:'Adicione ao osso; Quantidade .5 reduz à metade, 2 dobra.',
    example:'Amplificador na cabeça com Quantidade 1.5 exagera um aceno gravado no estúdio sem reeditar as chaves.',
    extra:'Age sobre a rotação local do osso antes dos solvers.',
    next:`${present} Sem amplificação por eixo. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.body_tilt': {
    purpose:'Inclina o corpo ao fazer curvas, proporcional à velocidade angular do personagem.',
    use:'Adicione ao osso da coluna, ajuste Inclinação por giro e Ângulo máximo; Suavização evita trancos.',
    example:'Personagem correndo em círculo com Inclinação .2 e máximo 20°: o tronco pende para dentro da curva.',
    extra:'Eixo escolhe o eixo local da inclinação.',
    next:`${present} Sem inclinação por aceleração linear. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.hand_poser': {
    purpose:'Copia a pose de uma mão de referência (dedos e pulso) para a mão do personagem, com peso.',
    use:'Adicione à mão, aponte a Referência (uma hierarquia de mão posada, por exemplo a pegada de um objeto) e ajuste o Peso.',
    example:'Objeto interagível com Pose da mão apontando para uma mão fechada: ao pegar, os dedos assumem a pegada.',
    extra:'Incluir o próprio osso copia também a rotação do pulso.',
    next:`${present} Sem mistura entre duas referências. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.penetration_avoidance': {
    purpose:'Empurra o osso para fora de colisores próximos, dentro de um raio.',
    use:'Adicione ao osso que atravessa geometria (mão, cotovelo) e ajuste o Raio.',
    example:'Mão com Raio .05 m deixa de atravessar a mesa ao alcançar a caixa.',
    extra:'Consulta os colisores físicos da cena a cada quadro.',
    next:`${present} Sem resposta de rotação. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.interaction_object': {
    purpose:'Objeto que uma mão pode alcançar, pegar e carregar: ponto de pegada, pose da mão, tempos e, com duas mãos, ponto de carregar.',
    use:'Criar → Personagem → **Carregar caixa** monta mesa, caixa com duas pegadas e ponto de carregar. Para um objeto seu, adicione o componente e aponte Pegada (um filho onde a mão vai) e, se for pegar, marque Pegar.',
    example:'Caixa com Pegada e Segunda pegada nas laterais e Ponto de carregar no peito do personagem: em Play ele agacha, segura e levanta a caixa junto ao corpo.',
    extra:'Tempo de alcance, de soltar e de erguer controlam a animação procedural. Pose da mão usa um Poser de mão.',
    next:`${present} Sem múltiplos pontos de pegada por mão. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.interaction_system': {
    purpose:'Faz o personagem interagir com objetos interagíveis: alcança com as mãos, agacha e se inclina, olha para o objeto e carrega.',
    use:'Adicionado pelo **Carregar caixa** ou pelo Inspector (pelve, peito e mãos preenchidos pelo nome dos ossos). Por script, inicie a interação com um efetor e um objeto, ou deixe um Gatilho de interação automático começar.',
    example:'Com o Kyle dentro do gatilho da caixa, a interação começa sozinha: as mãos vão às pegadas, o corpo agacha conforme Agachar e Inclinar, a caixa sobe ao ponto de carregar.',
    extra:'Velocidade escala os tempos do objeto; Ossos do membro é quantos ossos a mão arrasta; Olhar com Velocidade e Giro do olhar aponta a cabeça para o objeto enquanto alcança. Eventos `reached`, `released`, `entered` e `left` chegam aos scripts e às conexões.',
    next:`${present} Sem interação com os pés nem com dois objetos ao mesmo tempo. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.interaction_grip': {
    purpose:'Pivô de pegada: gira a pegada do objeto para encarar a mão que chega, por torção, balanço ou os dois.',
    use:'Adicione ao objeto interagível e aponte a Pegada; escolha o Modo e o Eixo em torno do qual a pegada pode girar.',
    example:'Alça de uma caneca: Modo torção no eixo Y faz a alça virar para a mão venha de onde vier.',
    extra:'Girar uma vez fixa a orientação no primeiro contato; os pesos de torção, balanço e completo dosam cada componente.',
    next:`${present} Sem pegada deslizante ao longo de uma barra. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.interaction_trigger': {
    purpose:'Faixa à frente de um objeto: quando um personagem com Sistema de interação entra nela, gera `entered` e, se Automático, começa a interação.',
    use:'Adicione ao objeto (ou a um filho posicionado) e aponte o Objeto interagível; ajuste Raio, Ângulo máximo e os deslocamentos para definir de onde o personagem pode pegar.',
    example:'Gatilho com Raio .5 m e Automático: ao andar até a caixa, o Kyle pega sem script; ao sair, `left`.',
    extra:'Em volta do objeto aceita qualquer direção; Cima fixo ignora a inclinação do objeto; Mãos escolhe a mão (ou as duas) que a interação usa.',
    next:`${present} Sem fila de gatilhos nem prioridade entre objetos próximos além da distância. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.ik.full_body': {
    purpose:'IK de corpo inteiro: pelve, peito e até quatro pontas com alvos, puxando o corpo na direção do alcance.',
    use:'Criar → Personagem → **Corpo inteiro** liga pelve, peito e pontas pelo nome e cria um alvo por ponta onde ela está. Mova os alvos e dê Play.',
    example:'Puxe o alvo da mão direita 40 cm para a frente: a mão vai, a coluna dobra conforme Dobra da coluna e a pelve avança até o Deslocamento máximo do corpo.',
    extra:'Puxão do corpo dosa quanto a pelve segue os membros; Ossos do membro é o tamanho de cada cadeia.',
    next:`${present} Sem efetores de ombro e coxa nem mapeamento automático de pés como pontas 3 e 4 fora dos nomes conhecidos. Sem data prometida.`,
    related:`[IK e constraints](${ik}) · [Receitas de Personagem](${recipes})`,
  },
  'astra.ik.fabrik_root': {
    purpose:'FABRIK em árvore: várias cadeias que partem de uma raiz comum (mão com dedos, árvore de tentáculos) resolvidas juntas.',
    use:'Adicione ao osso raiz comum e preencha até quatro pares ponta/alvo.',
    example:'Raiz no pulso com três dedos como pontas: aproximar os três alvos fecha a mão de forma coerente.',
    extra:'Fixar a raiz dosa quanto a raiz pode ser puxada; Iterações troca precisão por custo.',
    next:`${present} Até quatro cadeias por componente. Sem data prometida.`,
    related:`[IK e constraints](${ik})`,
  },
  'astra.ik.body_by_targets': {
    purpose:'Corpo guiado por três alvos (cabeça, mão esquerda, mão direita), no jeito do VRIK: a coluna segue a cabeça e as mãos alcançam os alvos.',
    use:'Adicione ao personagem, aponte pelve, peito, cabeça e mãos (preenchidos pelo nome quando possível) e os três alvos.',
    example:'Mova o alvo da cabeça para baixo: o personagem agacha com a coluna dobrando conforme Dobra da coluna, até o Deslocamento máximo do corpo.',
    extra:'Seguir o corpo dosa quanto a pelve acompanha a cabeça; Rotação da cabeça copia a rotação do alvo.',
    next:`${present} Sem rastreamento de pés nem entrada de XR real; os alvos vêm da cena ou de scripts. Sem data prometida.`,
    related:`[IK e constraints](${ik})`,
  },
  'astra.ik.socket': {
    purpose:'Prende um acessório (arma, chapéu, mochila) a um osso com um deslocamento, seguindo a pose final depois dos solvers.',
    use:'Adicione ao objeto do acessório, aponte o Osso e ajuste posição e rotação locais; Seguir escala do osso acompanha a escala.',
    example:'Espada presa ao osso da mão direita com rotação X de 90°: segue a mão em Play e nas poses do estúdio.',
    extra:'Diferente de tornar o objeto filho do osso: o encaixe recebe a pose depois de IK e interação.',
    next:`${present} Sem troca animada de encaixe; use Filho de para trocar o pai durante um clipe. Sem data prometida.`,
    related:`[Efeitos de IK e interação](${effects})`,
  },
  'astra.constraint.child_of': {
    purpose:'Troca o pai do objeto durante a animação sem reparentar na hierarquia; os canais locais valem no espaço do pai escolhido.',
    use:'No estúdio, **Seguir** (menu da ferramenta de pose) grava a troca de pai num intervalo; pelo Inspector, aponte o Pai e marque Fixo para manter o objeto no personagem.',
    example:'Caixa segue a mão esquerda de 0,8 s a 2 s: o objeto sobe com a mão e depois volta ao espaço da cena.',
    extra:'É a correspondência do Child-Of do UMotion; o importador de projetos UMotion cria este componente.',
    next:`${present} Sem transição suave entre pais. Sem data prometida.`,
    related:`[Estúdio v2](${studio}) · [IK e constraints](${ik})`,
  },
  'astra.animation.root_motion': {
    purpose:'O passo do osso raiz move o personagem pela cena, com o osso ficando no lugar: andar, correr e girar saem do clipe.',
    use:'No estúdio, ⋮ → **Root motion** cria o componente com o osso raiz encontrado pelo nome ou pela estrutura; escolha o que extrair (plano, vertical, giro) e a frente do osso.',
    example:'Clipe de caminhada em loop: com Andar no plano e Salto de laço, o personagem avança a cada volta em vez de voltar ao início; com Personagem, o movimento passa pela física.',
    extra:'Salto e giro de laço corrigem a descontinuidade entre o último e o primeiro quadro; Osso fica no lugar remove o deslocamento do próprio osso.',
    next:`${present} Sem curvas de root motion editáveis à parte do clipe. Sem data prometida.`,
    related:`[Estúdio v2](${studio})`,
  },
};

// Uso por campo (depois do nome do campo gerado pela engine). Regras por
// expressão cobrem x/y/z, tip_N/target_N e os campos comuns da família.
const common = {
  weight:'0 desliga, 1 aplica por inteiro; anime para ligar e desligar o efeito com suavidade.',
  priority:'Ordem entre solvers do mesmo osso: o maior roda por último e vence.',
  enabled:'Desligado, o componente fica na cena sem agir.',
  axis:'Eixo local do osso usado pelo efeito; os eixos variam por modelo (no Robot Kyle, o +Z da cabeça aponta para o lado). As receitas escolhem o eixo alinhado com a frente do personagem.',
  chain_length:'Quantos ossos acima deste participam.',
  iterations:'Mais iterações, mais precisão e mais custo por quadro.',
  target:'Objeto da cena que o solver alcança; as receitas criam um alvo nomeado ao lado do personagem.',
  pole:'Objeto para onde a dobra aponta; vazio usa o plano configurado.',
  solver:'Trigonométrico resolve em um passo; Limb respeita limites do rig; CCD e FABRIK valem para cadeias.',
  reference:'De onde vem o plano da dobra: do alvo ou do próprio objeto.',
  match_target_rotation:'A ponta copia a rotação do alvo, com o desvio em graus abaixo.',
  plane_angle:'Gira o plano da dobra em graus, sem um objeto de direção.',
  pole_rotation:'Gira o polo em torno do eixo raiz-ponta.',
  tolerance:'Distância da ponta ao alvo considerada resolvida, em metros.',
};
const perType = {
  'astra.ik.foot_grounding': {ray_height:'Altura acima do pé de onde o raio desce.',ray_distance:'Até onde o raio procura o chão.',foot_offset:'Altura do pé acima do chão no repouso; a receita lê do modelo.',max_correction:'Quanto a perna pode subir ou descer, em metros.',lock_height:'Abaixo desta altura o pé travado fica parado.',align_to_surface:'Inclina o pé com a superfície.',lock_foot:'Mantém o pé apoiado parado enquanto o outro passa.'},
  'astra.ik.look_at': {body_weight:'Quanto a coluna participa do olhar.',head_weight:'Quanto a cabeça participa.',clamp_angle:'Ângulo máximo do olhar em graus.'},
  'astra.ik.aim': {falloff:'Como a rotação cai do osso que mira para a base da cadeia.'},
  'astra.ik.rotation_limit': {kind:'Dobradiça (um eixo), Ângulo (qualquer direção) ou Cone.',minimum:'Limite inferior em graus (dobradiça).',maximum:'Limite superior em graus (dobradiça e ângulo).',cone:'Abertura do cone em graus.'},
  'astra.ik.grounder': {max_pelvis_offset:'Quanto a pelve pode descer para os pés alcançarem o chão.',pelvis:'Osso da pelve; preenchido pelo nome quando reconhecido.'},
  'astra.ik.finger_curl': {curl:'0 aberto, 1 fechado.',max_angle:'Rotação de cada falange quando fechado.'},
  'astra.ik.twist_relaxer': {},
  'astra.ik.hit_reaction': {strength:'Intensidade da reação.',duration:'Tempo para voltar à pose.',react_to_collisions:'Qualquer contato físico dispara a reação.'},
  'astra.ik.recoil': {kick_angle:'Levantada do cano em graus.',kick_back:'Recuo da mão em metros.',duration:'Tempo para voltar.'},
  'astra.ik.inertia': {stiffness:'Força de retorno da mola.',damping:'Quanto a oscilação morre.',max_angle:'Dobra máxima em graus.'},
  'astra.ik.amplifier': {amount:'1 mantém, abaixo atenua, acima exagera.'},
  'astra.ik.body_tilt': {tilt_per_turn:'Inclinação por velocidade de giro.',max_angle:'Inclinação máxima em graus.',smoothing:'Tempo de suavização.'},
  'astra.ik.hand_poser': {include_self:'Copia também a rotação do pulso.',reference:'Hierarquia de mão posada a copiar.'},
  'astra.ik.penetration_avoidance': {radius:'Raio ao redor do osso que não pode entrar em colisores.'},
  'astra.ik.interaction_object': {reach_time:'Tempo para a mão chegar à pegada.',release_time:'Tempo para soltar.',lift_time:'Tempo para erguer até o ponto de carregar.',pick_up:'O objeto passa para a mão ao ser alcançado.',grip:'Filho do objeto onde a mão vai.',second_grip:'Pegada da segunda mão.',hand_pose:'Poser de mão aplicado ao pegar.',hold_point:'Ponto do personagem onde o objeto fica ao carregar com as duas mãos.'},
  'astra.ik.interaction_system': {speed:'Escala os tempos do objeto.',limb_bones:'Ossos que a mão arrasta ao alcançar (2 = antebraço e braço).',crouch:'Quanto o corpo agacha para alcançar baixo.',lean:'Quanto o corpo se inclina para alcançar longe.',look_speed:'Velocidade do olhar para o objeto.',look_turn:'Giro máximo do olhar.',auto_effector:'Mão usada pelos gatilhos automáticos.',auto_object:'Objeto padrão para iniciar por script.',auto_second:'Segunda mão.',pelvis:'Osso da pelve (agachar).',chest:'Osso do peito (inclinar).',look_at:'Osso que olha para o objeto.'},
  'astra.ik.interaction_grip': {twist_weight:'Peso da torção em torno do eixo.',swing_weight:'Peso do balanço.',full_weight:'Peso da orientação completa.',rotate_once:'Fixa a orientação no primeiro contato.',mode:'Torção, balanço ou completo.',grip:'Pegada que gira.'},
  'astra.ik.interaction_trigger': {radius:'Raio da faixa.',max_angle:'Ângulo máximo entre a frente do personagem e o objeto.',offset_x:'Deslocamento lateral da faixa.',offset_z:'Deslocamento à frente.',angle_offset:'Giro da direção da faixa.',automatic:'Começa a interação ao entrar.',orbit:'Aceita qualquer direção em volta do objeto.',fix_up:'Ignora a inclinação do objeto.',hands:'Mão esquerda, direita ou as duas.',interactable:'Objeto interagível alvo; vazio usa o próprio objeto.'},
  'astra.ik.full_body': {body_pull:'Quanto a pelve segue os membros.',max_body_offset:'Deslocamento máximo da pelve.',spine_bend:'Quanto a coluna dobra.',limb_bones:'Tamanho de cada cadeia.',pelvis:'Osso da pelve.',chest:'Osso do peito.'},
  'astra.ik.fabrik_root': {root_pin:'0 solta a raiz, 1 a mantém no lugar.'},
  'astra.ik.body_by_targets': {body_follow:'Quanto a pelve acompanha a cabeça.',spine_bend:'Quanto a coluna dobra.',max_body_offset:'Deslocamento máximo do corpo.',head_rotation:'Copia a rotação do alvo da cabeça.',pelvis:'Osso da pelve.',chest:'Osso do peito.',head:'Osso da cabeça.',head_target:'Alvo da cabeça.',left_hand:'Mão esquerda.',left_target:'Alvo da mão esquerda.',right_hand:'Mão direita.',right_target:'Alvo da mão direita.'},
  'astra.ik.socket': {follow_scale:'Acompanha a escala do osso.',bone:'Osso ao qual o acessório se prende.'},
  'astra.constraint.child_of': {pinned:'Mantém o objeto preso ao personagem.',parent:'Pai durante a animação.'},
  'astra.animation.root_motion': {loop_jump:'Compensação de posição entre o fim e o início do laço.',loop_turn:'Compensação de giro no laço.',horizontal:'Extrai o movimento no plano.',vertical:'Extrai subida e descida.',rotation:'Extrai o giro.',keep_bone_in_place:'Remove o deslocamento do próprio osso.',axis:'Eixo local do osso que aponta para a frente.',bone:'Osso raiz; encontrado pelo nome ou pela primeira bifurcação.'},
};
export function ikPropertyUsage(c,p) {
  if(!ikGuides[c.typeId]) return undefined;
  const own = perType[c.typeId]?.[p.id]; if(own) return own;
  if(/^plane_zero_[xyz]$/.test(p.id)) return 'Componente da direção que define o zero do plano da dobra.';
  if(/^target_offset_[xyz]$/.test(p.id)) return 'Desvio em graus somado à rotação do alvo quando a ponta a segue.';
  if(/^offset_[xyz]$/.test(p.id)) return 'Componente do deslocamento em metros.';
  if(/^position_[xyz]$/.test(p.id)) return 'Componente da posição local do encaixe em metros.';
  if(/^rotation_[xyz]$/.test(p.id)) return 'Componente da rotação local do encaixe em graus.';
  if(/^tip_\d$/.test(p.id)) return 'Osso da ponta desta cadeia (mão, pé, garra).';
  if(/^target_\d$/.test(p.id)) return 'Alvo que esta ponta alcança.';
  return common[p.id];
}
