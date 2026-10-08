import { componentGuide, propertyUsage, familyFor } from './component-guides.mjs';

// Editorial guidance reviewed against the source of APK 0.2.3 (af1d9981).
// Keep this separate so the archived 06/10 reference does not acquire newer claims.
export function currentFamilyFor(id) {
  return id === 'astra.animation.animator' ? 'animation' : familyFor(id);
}
const chapter = '/pt-br/snapshot-2026-10-06/versoes/preview-0-2-3/';
const firstPreview = '/pt-br/snapshot-2026-10-06/versoes/preview-2026-10-07/';
const control = '/pt-br/snapshot-2026-10-07/sistemas/posse-de-controle/';
const guides = {
  'astra.tween.property': {
    purpose:'Interpola uma propriedade numérica de um componente existente. Use para variar uma luz, um parâmetro de material ou outro campo marcado como interpolável.',
    use:'Escolha Alvo; vazio usa este objeto. No seletor de propriedade, escolha o tipo de componente e o campo numérico. Destino usa a unidade desse campo. Recursos, strings, booleanos e enums não entram nesse seletor.',
    example:'Em uma luz, escolha o campo de intensidade pelo seletor. Use Destino 2, Duração 1 s, Espera 0 e Destino relativo desligado. Em Play, a intensidade deve chegar a 2, dentro dos limites do campo. Compare depois Destino relativo ligado: 2 passa a ser um incremento. A receita não representa uma execução validada desta publicação.',
    extra:'Tipo de componente e PropertyId escolhidos são configuração persistente especializada, fora da tabela numérica. O consumidor usa a primeira instância desse tipo no alvo; o seletor não grava um InstanceId para escolher outra. Não confunda o nome exibido com o identificador. Dois tweens no mesmo campo podem disputar a escrita; use um consumidor por campo no primeiro exercício.',
    next:'Presente no APK 0.2.3; seletor numérico, lifecycle e comandos Restart/Cancel/Pause/Resume constam do contrato. Animação arbitrária de qualquer recurso/campo não é suportada. Sem data para expansões.',
    related:`[Montagem passo a passo](${firstPreview}#tween-de-propriedade-animar-um-campo)`,
  },
  'astra.tween.sequence': {
    purpose:'Coordena tweens persistentes em até oito etapas, em sequência ou em grupos paralelos. Use para abrir duas partes de uma porta ou encadear movimentos.',
    use:'Prepare Transform Tween ou Tween de propriedade nos objetos alvos. A sequência reinicia os tweens desses objetos; não os cria. Atribua os objetos em Etapa 1…8, na ordem desejada. Junto da anterior reúne uma etapa ao grupo anterior.',
    example:'Prepare A e B com Transform Tween de rotação Y até 90°, duração 2 s, Girar ligado e Mover/Escalar desligados. Escolha A na Etapa 1 e B na Etapa 2. Com Junto da anterior desligado, B deve começar depois de A. Ligue para comparar paralelo. Um tween infinito impede terminar o grupo.',
    extra:'Intervalo da etapa soma uma espera antes do grupo à espera do próprio tween. Ignorar escala de tempo aqui vale para os intervalos; cada tween conserva seu próprio relógio. A próxima etapa começa no quadro seguinte ao término, sem promessa de reaproveitar o tempo restante.',
    next:'Presente no APK 0.2.3, com Play, Cancel, Pause, Resume, Step e eventos de etapa/conclusão. Não é uma timeline geral; coordenação de áudio, clipes e qualquer função arbitrária não está declarada.',
    related:`[Receita de duas etapas](${firstPreview}#sequência-de-tweens-duas-ações-uma-depois-da-outra)`,
  },
  'astra.camera.virtual': {
    purpose:'Define uma candidata de pose e lente para a câmera do jogo. Ela segue ou orbita um alvo; o Cérebro escolhe a candidata ao vivo e aplica o resultado à câmera real.',
    use:'Crie um objeto separado para a câmera virtual. Escolha Alvo rastreado, Posição = Órbita e Rotação = Olhar para o alvo para terceira pessoa. O objeto da câmera real recebe Câmera + Cérebro; não coloque ambos no objeto do jogador físico.',
    example:'Use um alvo na altura do tronco, Raio da órbita 5 m e Ângulo vertical 20°. Ligue Evitar obstáculos, raio .25 m e selecione a camada de paredes. Tenha colliders reais. Crie outra virtual com prioridade maior para observar a troca no Cérebro. Os valores são receita, não novos padrões do componente.',
    extra:'Atalho de criação: selecione o personagem → + → Básicos → Câmera virtual. O atalho cria uma filha em órbita e adiciona Cérebro à câmera da cena se necessário. A criação genérica pelo Inspector conserva os padrões da tabela (Posição/Rotação fixas e Evitar obstáculos desligado). No Play, o cartão indica Ao vivo ou Em espera. A virtual não cria um segundo viewport.',
    next:'Órbita, seguimento, lente, mistura e desvio físico estão na prévia 0.2.3. Fade de oclusores, enquadramento automático geral e garantia contra spawn penetrado não estão implementados. Sem data prometida.',
    related:`[Câmera e Cérebro](${chapter}#câmera-virtual-e-cérebro) · [Exemplo do laboratório](${control}#terceira-pessoa-no-laboratório)`,
  },
  'astra.camera.brain': {
    purpose:'Seleciona a câmera virtual ao vivo e mistura a pose e a lente na câmera real. Use para alternar exploração, conversa ou uma visão fixa.',
    use:'Adicione na câmera real que já tem Câmera. Crie as câmeras virtuais em objetos separados. A virtual habilitada de maior prioridade concorre; no empate, a ativada por último vence. Remova Olhar/Acompanhar alvo do objeto do Cérebro para evitar dois escritores de pose.',
    example:'Crie duas virtuais com prioridades 10 e 20. Configure no Cérebro Duração padrão 2 s e curva Suave. Aumente a prioridade da primeira para 30 em Play e observe a troca e a barra de transição. Se a entrada da virtual substitui o padrão, sua curva/duração é usada.',
    extra:'O cartão de execução mostra a candidata ao vivo e o progresso da troca. Desligar o Cérebro interrompe sua autoridade; a última pose permanece, não volta automaticamente à pose antes do Play. Ele não cria câmeras virtuais nem renderiza split-screen.',
    next:'Mistura de pose/lente disponível na 0.2.3. Esta família não promete paridade com Cinemachine, split-screen ou composição automática. Sem data para essas extensões.',
    related:`[Montagem das duas partes](${chapter}#câmera-virtual-e-cérebro)`,
  },
  'astra.physics.raycast': {
    purpose:'Consulta o primeiro obstáculo sólido ao longo de um segmento. Use para apontar, detectar chão ou medir uma distância física.',
    use:'Alvo X/Y/Z é o vetor local completo: direção e comprimento. A rotação do objeto muda a direção em mundo. O chão precisa participar da física; uma malha apenas visual não é detectada.',
    example:'Coloque a consulta 2 m acima de um chão com corpo/colisor. Com eixos locais alinhados ao mundo, use Alvo 0 / −3 / 0. Em Play, confira o cartão de acerto. Se não houver resultado, verifique comprimento, camada, tipo de corpo e sensores antes de alterar a geometria.',
    extra:'Atualiza após a física em Play. A API especializada e a Conexão de evento permitem pedir atualização imediata quando há avaliador válido. Não representa contato ou força e não retorna todos os obstáculos do caminho.',
    next:'Primeiro acerto e filtros presentes na prévia. Consultas com vários resultados exigem a API correspondente; não deduza uma coleção pelo componente. Sem expansão datada.',
    related:`[Consultas e montagem](${firstPreview}#raio-varredura-de-forma-e-braço-de-mola)`,
  },
  'astra.physics.shapecast': {
    purpose:'Varre uma esfera, cápsula, caixa ou cilindro até o primeiro obstáculo. Use quando uma linha é estreita demais para representar o volume que precisa passar.',
    use:'Escolha Forma, preencha suas dimensões e o vetor local Alvo. Dimensões não são a distância percorrida. Resolva filtros como no Raio; mude a forma para revelar os campos condicionais.',
    example:'Compare uma esfera de raio .25 m com um raio ao atravessar uma quina; use o mesmo vetor local 0 / 0 / 3 m. Para uma caixa de largura 1 m, Meia extensão X é .5 m. Observe o primeiro acerto em Play com colliders reais.',
    extra:'O resultado é de varredura, não uma lista de overlaps nem um corpo dinâmico. A consulta atualiza após a física. Sem avaliador físico válido, não há resultado fictício fora do Play.',
    next:'Formas e primeiro acerto presentes na prévia. Não presume toda combinação de formas/filtros de outras engines; conferir o cenário real. Sem data para expansão.',
    related:`[Raio e varredura](${firstPreview}#raio-varredura-de-forma-e-braço-de-mola)`,
  },
  'astra.physics.spring_arm': {
    purpose:'Retrata filhos ao longo de um braço quando há obstáculos. Use para sustentar uma câmera filha sem atravessar uma parede física.',
    use:'Crie o braço em um objeto e coloque a câmera como filha. Comprimento segue +Z local; a orientação do braço decide o lado. Use margem para manter distância da superfície e raio maior que zero para varredura esférica.',
    example:'Use comprimento 4 m, margem .1 m e raio .2 m. Aproxime o braço de uma parede com collider em Play e confira a distância efetiva dos filhos. Se outro controlador escreve a pose da câmera, retire esse conflito antes de interpretar o resultado.',
    extra:'Raio zero usa consulta por linha. Não controla automaticamente lente, mira ou prioridade de câmera. A câmera virtual com Evitar obstáculos é outro fluxo: não empilhe ambos sem resolver quem escreve a pose.',
    next:'Retração física do braço presente na prévia. Desoclusão universal, composição e estabilidade em qualquer cena não são declaradas. Sem data de expansão.',
    related:`[Montagem de câmera filha](${firstPreview}#raio-varredura-de-forma-e-braço-de-mola)`,
  },
  'astra.animation.animator': {
    purpose:'Escolhe e mistura clipes por uma máquina de estados. Use para repouso, andar, correr e salto de um modelo que já tem animações importadas.',
    use:'Selecione a raiz do modelo → adicione Animator em Animação → Máquina de estados. Remova Animação legada do mesmo objeto. No cartão, toque Abrir grafo do Animator; em Play, o grafo mostra estado e parâmetros somente para leitura.',
    example:'Crie Float Velocidade e um estado Mistura 1D. Atribua clipes reais de repouso/andar/correr nos limiares 0 / 1 / 2, escolha Velocidade como parâmetro e marque esse estado como Padrão. Em um Behavior, Object.Animator().SetFloat("Velocidade", 1.5f) seleciona a mistura; o Animator não mede a velocidade do corpo por conta própria.',
    extra:`### Campos que ficam no grafo\n\nA tabela automática abaixo cobre o cartão básico; **não cobre as coleções do grafo**. Abra-o para configurar:\n\n| Área | Caminho e uso |\n|---|---|\n| Parâmetros | Coluna esquerda → + Float/Int/Bool/Gatilho; toque nome e padrão. O tipo deve corresponder ao setter C#. |\n| Estados | + Estado → seleção → lado direito: Clipe/Mistura 1D/Mistura 2D, clipes reais, limiares ou posições X/Y. Padrão escolhe a entrada. |\n| Transições | Transição → origem ou Qualquer estado → destino; configure duração, tempo de saída e condições. Sem condição correta, o parâmetro sozinho não muda o estado. |\n| Camadas | + camada → peso e máscara de subárvore. Camadas são de substituição, sem adição. |\n| Eventos | Estado → + evento → tempo normalizado 0–1 e marca numérica entregue ao script. Não é um nome de método arbitrário. |\n\nLimites autorais: 32 parâmetros, 4 camadas, 24 estados e 48 transições por camada, 8 clipes por estado, 4 condições por transição e 8 eventos por estado. Nomes até 63 caracteres. Salve a cena; o grafo pertence ao componente, não a um controller asset separado. Undo/Redo vale para a autoria.\n\n:::caution[Advertência herdada do descritor]\nO campo de limitação nativo repete “sem mistura entre clipes” do registro compartilhado de animação. Esse texto está desatualizado para Animator: o grafo desta versão possui mistura 1D/2D e transições. Ele permanece no JSON como dado bruto da extração; não é a descrição editorial do Animator. Root motion, sub-máquinas, interrupção de transições e camadas aditivas continuam ausentes.\n:::`,
    next:'Clipe, misturas 1D/2D, camadas de substituição, condições, eventos e grafo estão na 0.2.3. Pendentes: root motion, sub-máquinas, interrupção e camadas aditivas; sem data prometida.',
    related:`[Grafo, código e evidências](${chapter}#animator)`,
  },
  'astra.audio.filter': {
    purpose:'Filtra o som de um Bus de áudio. Passa-baixa abafa; passa-alta retira graves; pico/prateleira modificam uma faixa.',
    use:'No objeto do Bus, adicione o filtro. Ligue a Fonte ao Bus. Escolha Tipo antes de ajustar Frequência de corte, Ressonância ou Ganho; o efeito faz parte da cadeia ordenada de componentes.',
    example:'Use WAV com bastante agudo, Tipo Passa-baixa, corte 1000 Hz e Q .707. Compare Ativo ligado/desligado. Passe para 5000 Hz para ouvir menos abafamento. É um exercício de escuta, não uma promessa de resultado em toda saída de áudio.',
    extra:'Um efeito sem fonte roteada não tem sinal para processar. Frequência usa Hz; Ganho usa dB. Não cria material acústico ou simulação automática de paredes.',
    next:'Filtro de bus presente na 0.2.3. WAV é o formato publicado; MP3/OGG e acústica automática não estão suportados. Sem cronograma de expansão.',related:`[Mixer e roteamento](${chapter}#mixer-de-áudio)`,
  },
  'astra.audio.echo': {
    purpose:'Repete o sinal de um Bus com atraso e realimentação. Use para uma repetição audível de voz ou efeito.',
    use:'Adicione Eco no objeto do Bus e roteie uma Fonte WAV a ele. Atraso é em milissegundos; Realimentação regula a cauda. Mistura do eco e Sinal original são ganhos separados.',
    example:'Use Atraso 300 ms, Realimentação .4, Mistura .5 e Sinal original 1. Toque um som curto: as repetições devem decair. Reduza Realimentação para encurtar a cauda. Desligar Ativo esvazia as repetições.',
    extra:'Não é atraso inicial da reprodução nem espera de um tween. Evite ganhos altos em cadeia; eles podem saturar o sinal.',
    next:'Eco de bus presente na 0.2.3; não é propagação acústica por geometria. Sem expansão datada.',related:`[Cadeia do mixer](${chapter}#mixer-de-áudio)`,
  },
  'astra.audio.reverb': {
    purpose:'Acrescenta uma cauda de sala ao Bus de áudio. Use para dar ambiente sonoro a um sinal ou a um bus de envio.',
    use:'Adicione no Bus. Tamanho da sala e Amortecimento controlam a cauda; Pré-atraso em ms separa as primeiras reflexões. Em um bus só de retorno, Sinal original 0 deixa apenas reverberação.',
    example:'Use Tamanho .8, Amortecimento .5, Largura 1 e Pré-atraso 20 ms. Compare Mistura 0 e .3 com uma voz curta. Para retorno separado, envie por Envio de áudio e use Sinal original 0 no destino.',
    extra:'Tamanho da sala é normalizado, não metros nem leitura da geometria. Desligar corta a reverberação. O bus de retorno precisa encaminhar sua saída para um destino audível.',
    next:'Reverberação algorítmica de bus presente na 0.2.3. Não presume convolução, baking acústico ou leitura automática de uma sala. Sem data de expansão.',related:`[Mixer e envios](${chapter}#mixer-de-áudio)`,
  },
  'astra.audio.compressor': {
    purpose:'Reduz picos acima de um limiar. Com Sidechain, reduz o bus quando outro bus toca: a música abaixa durante a fala.',
    use:'Adicione no Bus da música. Para ducking, atribua o Bus das falas em Sidechain. Sem referência ele mede seu próprio sinal. Ajuste Limiar em dB, Razão e Ataque/Liberação em ms.',
    example:'Com música e fala WAV roteadas a buses separados, use Limiar −20 dB, Razão 4, Ataque 20 ms e Liberação 250 ms. Atribua Falas ao Sidechain da música. Toque fala e confira Redução em dB no cartão do Compressor; a música deve recuperar o ganho após a liberação.',
    extra:'Atalho: + → Áudio → Bus com ducking; escolha o bus de fala no seletor. O outro bus ainda precisa existir e receber a fonte. Ganho de compensação recupera nível de saída; não elimina a compressão.',
    next:'Compressão e ducking presentes na 0.2.3. Não é automix universal, loudness normalizado ou sistema de diálogos completo. Sem data prometida.',related:`[Ducking passo a passo](${chapter}#mixer-de-áudio)`,
  },
  'astra.audio.send': {
    purpose:'Copia uma fração do sinal do ponto atual da cadeia para outro Bus. Use para uma reverberação compartilhada sem substituir o caminho original.',
    use:'Adicione no Bus de origem, escolha outro Bus em Destino e ajuste Nível do envio. Sua posição entre os componentes decide se copia antes ou depois de um efeito.',
    example:'Crie um Bus de retorno com Reverberação, Sinal original 0 e Mistura .3. No Bus de origem, atribua esse retorno no Envio e use Nível .5. Compare .5 e 0 para ouvir a contribuição do retorno mantendo o caminho original.',
    extra:'Destino vazio não envia. Confira o encaminhamento do bus de retorno; uma referência válida não garante que ele alcance a saída. Evite ciclos de roteamento.',
    next:'Envio ordenado no mixer presente na 0.2.3. Não declara toda topologia de feedback nem roteamento arbitrário entre engines. Sem data de expansão.',related:`[Mixer e retorno](${chapter}#mixer-de-áudio)`,
  },
  'astra.audio.snapshot': {
    purpose:'Guarda até oito valores-alvo de mixer e faz uma transição entre o estado atual e esses valores. Use para água, pausa ou mudanças de ambiente sonoro.',
    use:'Para cada slot, escolha Objeto (o Bus ou o objeto do efeito), Parâmetro e Valor. O parâmetro determina a unidade e a faixa real; o limite amplo da tabela de Valor não contorna o destino. Slots sem destino não configuram um efeito.',
    example:'No slot 1, selecione um Bus de música, Parâmetro Ganho do bus e Valor .3; Transição 1 s. Em Play, a fachada AudioSnapshot.TransitionTo(1f) leva o ganho ao alvo. Aplicar ao iniciar liga aplicação imediata no primeiro quadro, sem transição. Prepare outro snapshot com ganho 1 para restaurar.',
    extra:'Parâmetros aceitos: ganho do bus (linear), corte do filtro (Hz), Q, ganho do filtro (dB), mistura de Eco/Reverb, tamanho do Reverb, nível de Envio e limiar do Compressor (dB). A seleção usa o primeiro componente daquele tipo no objeto; se houver dois filtros, não presume escolher o segundo. Transição usa tempo real. Não guarda a cena, clipes ou o progresso de gameplay.',
    next:'Snapshots de até oito valores e transição presentes na 0.2.3. Não representam preset universal de toda propriedade do mixer; destinos arbitrários não suportados. Sem expansão datada.',related:`[Mixer e comandos](${chapter}#mixer-de-áudio)`,
  },
};

export function currentComponentGuide(c) {
  const inherited = componentGuide(c);
  if(c.typeId === 'astra.animation.animator') {inherited.title='Animação e deformação';inherited.route='roadmap/animacao';}
  const guide = guides[c.typeId];
  if (guide) return {...inherited, ...guide};
  if (c.typeId === 'astra.physics.collision_recipe') return {...inherited,
    location:'Hierarquia → ações do objeto → Configurar locomoção → Decompor → escolha Fontes/Ajustes → Gerar → Revisar → Aplicar. A receita é produzida por esse fluxo de autoria; não é um Behavior e não entra no menu genérico de componentes.',
    use:'Escolha geometria e fontes antes de gerar. Revise a prévia e aplique a colisão; gerar sozinho não publica formas na cena. A receita permite regeneração explícita, preservando edições conforme o contrato.',
    example:'Em uma cópia do projeto, escolha uma malha como fonte, gere uma prévia pequena, revise as partes e aplique. Salve/reabra antes de modificar a fonte e pedir regeneração. Limites: 100 mil triângulos, 128 fontes, 32 partes, 64 vértices por casco e 400 mil voxels.',
    extra:'As referências de fonte abaixo podem ficar ocultas ou com escrita restrita: não são 128 componentes ativos. Colisão gerada é captura estática da base/pose/amostra escolhida; não acompanha os ossos a cada quadro. Recurso ausente ou resultado desatualizado pode impedir aplicar.',
    related:`[Autoria, revisão e regeneração](${firstPreview}#autoria-física-e-regeneração-de-colisão)`};
  if (c.typeId === 'astra.camera.follow') return {...inherited,
    extra:'Órbita e Altura do pivô pertencem ao payload 2. Órbita desligada mantém deslocamento em mundo; payload 1 migra com órbita desligada e pivô zero. Este seguidor não consulta colisão: use Câmera virtual com Evitar obstáculos ou Braço de mola para retração.', related:`[Câmera do laboratório](${control}#terceira-pessoa-no-laboratório)`};
  if (['astra.physics.character','astra.physics.dynamic_motor'].includes(c.typeId)) return {...inherited,
    extra:`A seção Posse de controle escolhe UI, teclado, gamepad, Script ou IA. Prioridades ficam visíveis em Automático. Selecionar uma origem não cria vínculos de entrada. [Arbitragem, cancelamento, campos e receita](${control}).`,related:`[Posse e movimento medido](${control})`};
  if (c.typeId === 'astra.audio.source') return {...inherited,
    extra:'Atribua o clipe WAV pelo seletor de recurso e o Bus pelo seletor de objeto. Esses recursos não são valores numéricos. Mistura espacial 0 = 2D e 1 = 3D. Até 32 vozes são reais; as menos prioritárias podem ficar virtuais. Streaming usa leitura progressiva para músicas longas. MP3/OGG não estão incluídos.',related:`[Mixer, streaming e vozes](${chapter}#mixer-de-áudio)`};
  if (c.typeId === 'astra.physics.body') return {...inherited,
    extra:`Material físico é um recurso .physmat, separado do material visual. No seletor, crie com os valores do corpo; compartilhar um recurso compartilha futuras edições. Centro de massa/inércia manuais requerem os modos automáticos desligados. [Materiais e sensores](${firstPreview}#material-físico-por-corpo-e-por-forma).`};
  if (c.typeId === 'astra.physics.collider') return {...inherited,
    extra:`Material próprio diferencia esta forma do material do corpo. Desligado, usa o corpo. Recurso .physmat também abre em Propriedades pelo navegador de arquivos. [Materiais por forma](${firstPreview}#material-físico-por-corpo-e-por-forma).`};
  if (c.typeId === 'astra.physics.joint') return {...inherited,
    extra:'Quebra por força/torque remove a restrição do solver e publica o evento em runtime. O componente autoral permanece. Zero conserva a junta sem quebra por esse limite; a quebra no Play não vira exclusão salva.'};
  return inherited;
}

const exact = {
  default_blend:'Curva padrão da transição entre câmeras virtuais. Corte troca imediatamente; as demais curvas usam Duração padrão, salvo substituição pela virtual que entra.',
  destination:'Valor de chegada na unidade do campo selecionado. Relativo desligado = valor final; ligado = incremento a partir do início.',
  cutoff:'Frequência de corte em Hz. No passa-baixa, reduzir abafa; nos demais modos, localiza a faixa conforme o Tipo.',
  resonance:'Q do filtro: .707 é uma resposta plana; aumentar ressalta a região do corte. Compare sem elevar o ganho excessivamente.',
  gain:'Reforço/corte da faixa em dB, usado nos modos Pico/Prateleira. Não é o ganho linear do Bus.',
  feedback:'Fração da repetição que volta ao atraso. Menor encurta a cauda; valores altos prolongam repetições.',
  wet:'Ganho do sinal processado pelo efeito. Zero retira essa contribuição; não é porcentagem em 0–100.',
  dry:'Ganho do sinal original. Em um bus de retorno com Reverb, zero evita duplicar o caminho seco.',
  room_size:'Tamanho normalizado da sala algorítmica; maior prolonga a cauda. Não é a medida geométrica em metros.',
  damping:'Absorção dos agudos na cauda da reverberação. Compare com um som curto rico em agudos.',
  width:'Abertura estéreo da cauda. Não muda a posição 3D da fonte.',
  predelay:'Espera em milissegundos antes das primeiras reflexões; 20 significa .02 segundo.',
  threshold:'Nível em dB acima do qual o detector provoca redução de ganho; com Sidechain mede o outro Bus.',
  ratio:'Razão de compressão: 4 significa que 4 dB acima do limiar resultam em 1 dB acima dele.',
  attack:'Tempo em milissegundos para reagir à redução; pequeno reage rápido aos picos.',
  release:'Tempo em milissegundos para recuperar ganho após cair abaixo do limiar; controla a volta da música no ducking.',
  makeup:'Ganho de saída em dB aplicado após compressão; ajuste sem saturar o bus.',
  mix:'Mistura do sinal comprimido com o original; 1 = processado, valores menores permitem compressão paralela.',
  level:'Fração linear copiada ao Bus de destino neste ponto da cadeia. Zero não envia; não é volume master.',
  spatial_blend:'0 usa apresentação 2D, 1 usa 3D; valores intermediários misturam. Confira Listener, distâncias e o recurso real.',
  loop_start:'Início do trecho repetido, em segundos do clipe. Exige loop ligado e intervalo válido.',
  loop_end:'Fim do trecho repetido, em segundos. Confira a duração real do WAV e início menor que fim.',
  loading:'Escolhe carregamento do clipe: Streaming lê progressivamente, em vez de presumir tudo em memória. WAV longo é importado para streaming; salve a cena após importar.',
  pivot_height:'Altura vertical em metros do pivô da órbita do seguidor. Zero mantém o alvo sem deslocamento vertical.',
  orbit:'Habilita modo orbital de Camera Follow; desligado conserva seguimento por deslocamento em mundo. Não adiciona consulta de colisão.',
  monitoring:'Permite publicar eventos deste sensor. Desligado não significa desativar o collider visual ou outro sensor.',
  monitorable:'Permite que outros sensores detectem este corpo pelo filtro. É independente de Monitorar os próprios eventos.',
  automatic_center_of_mass:'Ligado calcula centro de massa da composição física; desligue para usar as coordenadas manuais.',
  automatic_inertia:'Ligado calcula inércia; desligue para usar os valores manuais e conferir resposta de rotação.',
  own_material:'Ligado usa material físico próprio desta forma. Desligado herda o do corpo. Não altera cor/textura.',
  friction_combine:'Política de combinar atrito do par. Padrão conserva a regra do motor; a precedência dos modos participa da escolha.',
  restitution_combine:'Política de combinar restituição do par. Compare em uma queda controlada; não muda o material visual.',
  surface:'Classificação da superfície para consumidores como regras de passos. Selecionar o valor não cria som ou Behavior automaticamente.',
  interpolation:'Política de suavização visual entre passos físicos; não aumenta a frequência do solver nem muda a trajetória física.',
  break_force:'Limite de força para quebra da junta; zero conserva sem quebra por força. A quebra é estado do Play, não exclusão do componente autoral.',
  break_torque:'Limite de torque para quebra; zero conserva sem quebra por torque. Ligue um receptor ao evento para uma regra de gameplay.',
  control_source:'Automático arbitra os canais; UI/Teclado/Gamepad/Script/IA escolhe uma origem exclusiva. Origem exclusiva neutra mantém a posse; não passa para a IA.',
};
export function currentPropertyUsage(c,p) {
  if(c.typeId === 'astra.physics.shapecast' && p.id === 'shape') return 'Escolhe Esfera, Caixa, Cápsula ou Cilindro para a varredura. Configure somente as dimensões relevantes da forma; isso não cria um collider persistente.';
  if (c.typeId === 'astra.audio.echo' && p.id === 'delay') return 'Intervalo entre repetições, em milissegundos. 300 ms = .3 s; não é a espera inicial de um tween.';
  if (c.typeId === 'astra.audio.source' && p.id === 'priority') return '0 é a prioridade mais importante. Ao exceder 32 vozes reais, as menos importantes podem ficar virtuais e conservar o progresso para retornar.';
  if (c.typeId === 'astra.camera.virtual') {
    if (/^offset_[xyz]$/.test(p.id)) return 'Componente do deslocamento em metros para Seguir. Referencial decide eixos de mundo ou guinada do alvo; não substitui o raio da Órbita.';
    if (/^aim_offset_[xyz]$/.test(p.id)) return 'Deslocamento de mira em metros aplicado ao ponto do alvo; ajusta enquadramento sem mover o alvo físico.';
    if (p.id === 'rotation_damping') return 'Amortecimento para aproximar a orientação desejada; zero acompanha sem atraso. Não é velocidade angular do corpo.';
    if (p.id === 'noise_amplitude') return 'Amplitude do tremor angular em graus. Zero desliga esta contribuição; combine com Frequência sem confundir com entrada de olhar.';
    if (p.id === 'noise_position_amplitude') return 'Amplitude do tremor de posição em metros. Não move o alvo nem garante evitar obstáculos por todo tremor.';
    if (p.id === 'noise_frequency') return 'Frequência do tremor. Compare no mesmo enquadramento; só produz contribuição quando a amplitude correspondente é maior que zero.';
    if (p.id === 'blend_time') return 'Duração em segundos da entrada desta virtual quando sua curva substitui o padrão do Cérebro.';
    if (p.id === 'orbit_pitch_min' || p.id === 'orbit_pitch_max') return 'Limite em graus do pitch da Órbita. Mantenha mínimo menor ou igual ao máximo; um ângulo extremo pode recortar o personagem.';
  }
  if (/^control_priority_/.test(p.id)) return 'Prioridade de arbitragem desta origem em Automático, de 0 a 1000. Maior vence entre candidatos; na fonte exclusiva fica oculta e é preservada. Não é prioridade de execução do script.';
  if (/^center_of_mass_[xyz]$/.test(p.id)) return 'Coordenada local em metros do centro de massa manual. Desligue cálculo automático; muda a resposta de rotação física, não desloca a malha visual.';
  if (/^inertia_[xyz]$/.test(p.id)) return 'Componente diagonal da inércia manual, usada com cálculo automático desligado. Valores válidos afetam resistência à rotação; compare com a massa e forma reais.';
  if (/^slot_\d+_value$/.test(p.id)) return 'Valor-alvo deste slot de mixer, na unidade do Parâmetro selecionado (Hz, dB ou ganho linear). A escrita é limitada pela faixa do destino; a faixa ampla deste campo não a contorna.';
  if (/^target_[xyz]$/.test(p.id) && /raycast|shapecast/.test(c.typeId)) return 'Componente do vetor local do segmento em metros. Seu módulo define alcance; girar o objeto gira a direção em mundo. Não é uma posição absoluta do alvo.';
  if (p.id === 'radius' && /shapecast|spring_arm/.test(c.typeId)) return c.typeId.endsWith('spring_arm') ? 'Raio em metros do volume varrido. Zero usa linha; maior considera um volume esférico e ajuda em quinas.' : 'Raio em metros da esfera/cápsula, visível conforme Forma. Não é comprimento do segmento.';
  if (p.id === 'half_height' && c.typeId === 'astra.physics.shapecast') return 'Meia altura do volume em metros, para cápsula/cilindro conforme Forma. Não é a altura inteira de um modelo.';
  if (/^half_[xyz]$/.test(p.id)) return 'Meia extensão da caixa neste eixo, em metros. Uma extensão .5 representa tamanho total 1 nesse eixo.';
  if (p.id === 'length' && c.typeId.endsWith('spring_arm')) return 'Comprimento desejado em metros no eixo +Z local. Obstáculos reduzem a distância efetiva dos filhos.';
  if (p.id === 'margin' && c.typeId.endsWith('spring_arm')) return 'Margem em metros descontada no acerto, para conservar afastamento do obstáculo.';
  if (p.id === 'exclude_self') return 'Exclui o primeiro Corpo físico encontrado neste objeto ou subindo por seus ancestrais. Use para não atingir o jogador que sustenta a consulta; sem esse corpo ancestral, não há exclusão automática de todos os colliders do ramo.';
  if (p.id === 'include_sensors') return 'Inclui formas sensoras no resultado. Desligado evita tratar volumes de trigger como paredes.';
  if (p.id === 'include_static') return 'Inclui corpos estáticos, como chão e paredes. Desligar pode explicar ausência de acerto.';
  if (p.id === 'include_dynamic') return 'Inclui corpos dinâmicos no resultado; não aplica força nem impede movimento por conta própria.';
  if (p.id === 'layer' && /raycast|shapecast|spring_arm/.test(c.typeId)) return 'Todas aceita camadas do projeto; escolher uma limita a consulta. A camada da malha visual não cria forma física.';
  if (exact[p.id]) return exact[p.id];
  if (p.help) return p.help;
  return propertyUsage(c,p);
}

export const reviewedNewComponentIds = Object.keys(guides);
