// Editorial guidance reviewed against the schema and the subsystem consumers.
// A documented field is a contract; device acceptance remains a separate record.
const groups = {
  constraints: {
    title:'Restrições e molas', route:'roadmap/restricoes-e-molas',
    use:'Ligue a fonte/alvo no Inspector; escolha os eixos e a influência. Use em um objeto cuja pose não esteja sob autoridade incompatível da física ou de outro controlador.',
    example:'Crie um objeto visual e uma fonte. Atribua a fonte, mova-a em Play e compare o objeto com Peso 0 e Peso 1. Para mola, compare duas frequências e observe a aproximação ao alvo.',
    next:'Consolidar autoria de fontes, limites de composição e aceite de lifecycle/pose por família. Não há cronograma individual publicado para cada setter. A presença de uma restrição não implica suporte a toda a família de constraints da Unity.',
  },
  time: {title:'Tempo, eventos e tweens',route:'roadmap/tempo-eventos-e-tweens',use:'Configure duração/intervalo e reprodução, depois ligue a ação ou Behavior consumidor. Separe relógio escalado do relógio real e callbacks de quadro dos passos físicos.',example:'Use intervalo de 1 s, inicie Play e altere pausa/escala do tempo. Confira a diferença ao ligar Ignorar escala do tempo; ligue um receptor para observar a ação.',next:'Ampliar composição e diagnóstico de ações/curvas e conferir cancelamento, pausa, remoção e reinício. Sem data prometida. Timeline geral não é consequência da existência de Timer ou tween.'},
  ui: {title:'Canvas e UI de jogo',route:'ui/roadmap',use:'Salve um documento .aeui, atribua Documento UI e escolha Tela para HUD ou Mundo para plano na cena. Elementos Image/Text/Button são criados dentro desse documento.',example:'Siga o tutorial HUD de corações: três Images cheias sobre três vazias e HeartHud ligado a PlayerHealth.',next:'R0–R12: imagem/skins, autoria, foco/input, controles, layout, texto, bindings, inventário, apresentações, animação, templates e acesso. Consulte estados e critérios por função na página dedicada.'},
  render: {title:'Renderização e materiais',route:'roadmap/renderizacao-e-materiais',use:'Atribua geometria e recursos compatíveis; altere material/slot, luz ou ambiente e observe o resultado pela câmera. Valores autorais e política gráfica efetiva têm estados distintos.',example:'Uma malha, câmera e luz: compare rugosidade/metalness no mesmo enquadramento, ou alcance/intensidade da luz sobre a malha. Material emissivo sozinho não equivale a uma luz iluminando objetos vizinhos.',next:'Cookies e luz de área, GI/lightmap bake, unwrap/atlas e sondas continuam no registro de capacidades conforme o item. Recursos importados não comprovam consumo. Performance e compatibilidade Vulkan precisam de aceite por aparelho.'},
  camera: {title:'Câmera e navegação',route:'roadmap/camera-e-navegacao',use:'Crie uma câmera ativa; escolha projeção e planos. Olhar recebe entrada e Acompanhar alvo recebe uma referência. Não use a pose da câmera como fonte implícita de física do jogador.',example:'Atribua um alvo a Acompanhar alvo e mova-o. Compare Damping 0 com um tempo maior. Teste perspectiva/ortográfica com a mesma malha enquadrada.',next:'Consolidar composição de rigs, apresentação e aceite de input/viewports. Pareamento geral de jogadores/câmeras pertence também ao roadmap UI R4/R9; não há data por método.'},
  physics: {title:'Física 3D e motores',route:'roadmap/fisica-3d',use:'Resolva Corpo físico, Colisor e autoridade de pose antes de aplicar forças, motores ou juntas. Corpo dinâmico recebe forças; sensor emite sobreposição. Character e Motor dinâmico têm contratos próprios.',example:'Crie chão estático e um corpo dinâmico com colisor. Compare queda, massa, atrito e restituição. Para sensor, conecte TriggerEnter a um Behavior como no HUD de corações.',next:'Ampliar autoria/rebuild, geometria e apoio dos motores, juntas e diagnóstico por cenário. Fechamento deve incluir salvar/reabrir, remoção e gameplay no aparelho. Importação universal de todas as formas e controles não está declarada pronta.'},
  physics2d: {title:'Física 2D',route:'roadmap/fisica-2d',use:'Monte Body2D + Colisor 2D no plano XY. Juntas, forças e campos 2D operam nessa simulação; não compartilham automaticamente contatos com corpos 3D.',example:'Coloque uma caixa 2D dinâmica sobre um chão 2D estático. Compare escala de gravidade e rotação travada. Conexão física 2D pode ativar um receptor ao entrar no sensor.',next:'Fechar autoria e cenários de solver/eventos/queries no Android; ampliar formas e juntas somente com consumidores. Física 2D presente não representa renderização Sprite/Tilemap completa.'},
  audio: {title:'Áudio',route:'roadmap/audio',use:'Atribua um clipe do projeto ao Audio Source e confira reprodução, volume, mute e bus. Escolha escuta e espacialização; prioridade decide o listener efetivo.',example:'Um Audio Source e um Audio Listener: toque um clipe, altere volume/mute e depois compare estéreo com 3D movendo a fonte.',next:'Ampliar transporte, formatos, mixer e diagnóstico de backend. Seek não deve ser presumido como disponível porque há cursor de reprodução. Conferir saída física no aparelho é uma evidência separada.'},
  animation: {title:'Animação e deformação',route:'roadmap/animacao',use:'Atribua clipes/recursos e escolha reprodução. SkinnedMesh precisa dos dados de deformação compatíveis; um nome de clip ou blend shape não cria esse recurso.',example:'Use um recurso com clipe real, compare Speed 0/1 e modos de repetição; confira deformação e bounds antes de usar culling.',next:'Ampliar importação, composição, edição de clipes e aceite de deformação/motion vectors. Timeline de UI é outro sistema e continua parcial. Não pressupõe Animator completo.'},
  path: {title:'Caminhos e seguidores',route:'roadmap/caminhos',use:'Crie Path com pontos/tangentes persistentes e atribua o objeto ao Path Follow. Distância e orientação dependem da curva e da pose mundial.',example:'Autore uma curva com três pontos, atribua o alvo e percorra em velocidade constante; salve/reabra os pontos e compare orientação +Z e direção reversa.',next:'Aprofundar ferramentas de pontos/tangentes, visualização e cenários de escala/lifecycle. Path não é navmesh, pathfinding ou spline universal importada.'},
  script: {title:'Objetos, Behaviors e composição',route:'roadmap/objetos-e-scripts',use:'Crie um Behavior C# com ComponentId estável, compile o projeto e anexe ao objeto. Campos públicos suportados e PropertyId aparecem no Inspector; callbacks recebem o mundo do Play.',example:'Anexe PlayerHealth ao Jogador e HeartHud ao HUD; atribua a referência Player, compile e entre em Play.',next:'Consolidar cenas, prefabs, contratos de scripts e mensagens, com referência remapeada e lifecycle correto. Contagem de APIs não mede fechamento funcional. Comportamento não validado deve permanecer explicitamente sem aceite.'},
};
export const componentFamilies = groups;
export function familyFor(id) {
  if (/^astra\.(spring|constraint)/.test(id)) return 'constraints';
  if (/^astra\.(time|tween|logic)/.test(id)) return 'time';
  if (id.includes('.ui.')) return 'ui';
  if (id.includes('.skinned_mesh') || id==='astra.animation') return 'animation';
  if (id.startsWith('astra.render.')) return 'render';
  if (id.startsWith('astra.camera')) return 'camera';
  if (id.startsWith('astra.physics2d')) return 'physics2d';
  if (id.startsWith('astra.physics')) return 'physics';
  if (id.startsWith('astra.audio')) return 'audio';
  if (id.startsWith('astra.path')) return 'path';
  return 'script';
}
export function componentGuide(c) {
  const group=groups[familyFor(c.typeId)];
  return {...group, purpose:c.description, location:c.listedInAdd?`Hierarquia → selecione o objeto → Inspector → Adicionar componente → **${c.family}**${c.subfamily?` / **${c.subfamily}**`:''} → **${c.name}**.`:'Área de código → crie/compile o Behavior → anexe ao objeto. Este registro não é criado pelo menu genérico.',
    extra:c.typeId==='astra.ui.canvas'?'O recurso Documento UI não entra na tabela numérica abaixo. Ele é escolhido por recurso registrado; em C#, use GetDocument/SetDocument. Image está dentro do .aeui, não neste componente.':''};
}

const exact = {
  enabled:'Ativa/desativa a participação do componente no sistema consumidor; não remove seus dados.',
  weight:'Influência do resultado: 0 não influencia e 1 aplica integralmente. Compare com a pose sem a restrição.',
  frequency:'Frequência da resposta da mola; valores maiores reagem mais rápido ao movimento do alvo.',
  damping_ratio:'Amortecimento da mola: controla a oscilação em torno do alvo; use a faixa e compare aproximação, não apenas posição final.',
  max_speed:'Limita a velocidade da aproximação da mola, na unidade indicada para posição/rotação/escala.',
  roll:'Rotação em torno do eixo de mira; não muda a posição do alvo.',
  aim_axis:'Escolhe o eixo local alinhado à direção do alvo.',up_axis:'Define a convenção de vertical da orientação; evite direção degenerada.',
  duration:'Tempo da reprodução/interpolação; configure na unidade indicada. Valor curto acelera a transição.',
  delay:'Espera inicial antes de reproduzir a transição.',
  enabled_unused:'',autoplay:'Inicia a reprodução automaticamente ao ativar a execução; não é o mesmo que repetição.',
  play_automatically:'Inicia os clipes configurados automaticamente; exige recurso de animação válido.',
  pingpong:'Alterna ida e volta na reprodução.',relative:'Interpreta os valores da transição como deslocamento relativo, conforme o canal.',
  position:'Seleciona a participação do canal de posição no tween.',rotation:'Seleciona a participação do canal de rotação no tween.',scale:'Seleciona a participação do canal de escala no tween.',
  ignore_time_scale:'Usa relógio não afetado pela escala do tempo do mundo; confira pausa e segundos reais.',
  easing:'Escolhe a curva de interpolação; altera a velocidade ao longo da transição, não o valor final.',
  loops:'Número/política de repetições no domínio indicado; confira a opção de repetição contínua na enumeração/contrato.',
  finished_action:'Ação disparada ao terminar o tween; configure o destino compatível.',finished_target:'Objeto receptor da ação de término.',
  interval_seconds:'Tempo entre disparos do Timer, em segundos.',auto_start:'Começa a contar automaticamente na ativação.',repeat:'Repete o intervalo; desligado produz um disparo e termina.',
  elapsed_action:'Ação ao expirar o Timer; um callback de script continua sendo um consumidor explícito.',elapsed_target:'Objeto a receber a ação de expiração.',
  once:'Consome/desliga a conexão depois da primeira entrega.',argument:'Argumento escalar enviado à ação configurada.',
  event:'Escolhe o evento de origem. Enter, Stay e Exit têm frequências diferentes; Stay não é um clique único.',
  action:'Escolhe o efeito da conexão. Desconectado conserva os dados mas não aplica ação.',
  method:'Nome exato do método receptor na conexão de script; verifique assinatura e existência.',
  receiver:'Objeto que recebe a ação/evento; não é o objeto que provocou o contato.',other_filter:'Restringe o outro objeto aceito pelo evento; não é o receptor da ação.',
  target:'Referência a objeto fonte/alvo usada por este componente. Atribua pelo seletor; nome sozinho não mantém identidade.',
  units_per_pixel:'Converte pixel em unidades do mundo no Canvas Mundo. Tela usa viewport; não é escala responsiva de referência.',
  order:'Ordena apresentação dos Canvas; compare sobreposição e entrada com o modo efetivo.',
  occlusion:'Usa profundidade/hit do Canvas Mundo; não oculte HUD de Tela tentando configurar este campo.',
  mode:'Seleciona o modo do componente no domínio indicado; revise os campos que aparecem após trocar.',
  movement_space:'Escolhe espaço do vetor de movimento: mundo, jogador ou câmera de entrada.',
  input_receiver:'Objeto com Character/motor dinâmico para receber controles; HUD visual não precisa desse receptor.',
  input_camera:'Câmera usada para o espaço de movimento/olhar dos controles do Canvas.',
  roughness:'Rugosidade PBR: menor valor produz reflexão mais concentrada; maior torna a superfície mais áspera.',
  metallic:'Participação metálica no material PBR; altera resposta difusa/especular.',
  normal_scale:'Intensidade do normal map; exige textura e canal compatíveis.',
  specular:'Ajuste especular do material dentro do contrato do renderer.',
  emission_strength:'Multiplica a emissão do material; não adiciona uma luz iluminando objetos vizinhos.',
  'material.override':'Habilita os valores de material autorados no override do slot.',
  'lightmap.enabled':'Habilita consumo de lightmap externo válido. Não gera bake, UVs ou atlas.',
  'lightmap.intensity':'Multiplica irradiância do lightmap; exige textura/UV1 compatíveis.',
  'surface.alpha_cutoff':'Limiar de corte de alpha no modo máscara; não cria transparência blend.',
  'surface.alpha_mode':'Escolhe tratamento opaco/máscara/blend no domínio do contrato.',
  'surface.sides':'Define tratamento de faces/lados do material.',
  'channels.occlusion_strength':'Intensidade da oclusão do material, se a origem/canal tiver recurso.',
  'channels.occlusion_source':'Seleciona a origem de oclusão do material, separada do AO global.',
  'channels.normal_flip_y':'Inverte o eixo Y do normal map para ajustar convenção da textura.',
  'channels.alpha_source':'Escolhe a origem usada para alpha da superfície.',
  skinned_motion_vectors:'Solicita motion vectors da deformação; exige política/render e dados compatíveis.',
  quality:'Seleciona qualidade da deformação no domínio disponível; não importa pesos ausentes.',
  blend_shape_weight:'Peso do blend shape por slot; exige recurso com shapes existentes.',
  size:'Tamanho de referência para seleção de LOD por altura projetada.',
  animate_cross_fading:'Controla evolução temporal do crossfade quando a política suportar esse modo.',
  level_count:'Quantidade de níveis ativos de LOD. Atribua malhas/objetos por nível.',
  fade_mode:'Seleciona a política de transição de LOD, no domínio indicado.',
  force_level:'Força nível para conferência; opção automática devolve a seleção à projeção.',
  priority:'Prioridade entre candidatos do mesmo sistema; compare o consumidor efetivo, não só o número no Inspector.',
  atmosphere:'Quantidade da contribuição atmosférica no modelo de céu selecionado.',
  sun_disk_degrees:'Tamanho angular do disco solar desenhado no céu.',sun_disk_intensity:'Brilho do disco solar; não substitui a intensidade de uma luz direcional.',
  fog_light_energy:'Energia de luz na neblina conforme o modelo de fog.',fog_density:'Densidade da neblina; aumentar reduz visibilidade ao longo do percurso.',
  fog_start:'Distância a partir da qual a neblina começa.',fog_base_height:'Altura de referência da neblina de altura.',fog_height_falloff:'Queda da densidade conforme altura.',
  exposure_ev:'Exposição manual em EV antes do tonemapping; compare com auto exposição desligada.',
  bloom_threshold:'Limiar de brilho que participa do bloom.',bloom_intensity:'Intensidade do bloom habilitado.',
  contrast:'Contraste do pós-processamento.',saturation:'Saturação do pós-processamento.',vignette_intensity:'Força da vinheta habilitada.',film_grain_intensity:'Força do grain habilitado.',
  ambient_occlusion_radius:'Raio de amostragem do AO global.',ambient_occlusion_intensity:'Peso visual do AO global.',ambient_occlusion_power:'Curva de contraste do AO.',ambient_occlusion_bias:'Bias para evitar auto oclusão excessiva.',
  blend_distance:'Distância de mistura na borda do volume de ambiente.',sphere_radius:'Raio do volume esférico, quando esse shape está selecionado.',
  indirect_diffuse:'Escala da iluminação indireta difusa disponível; não calcula GI bake.',indirect_specular:'Escala do reflexo especular do ambiente.',
  physical_sky_intensity:'Multiplica a energia do céu físico.',air_density:'Densidade do ar usada pelo céu físico.',aerosol_density:'Densidade do aerosol usada pelo céu físico.',aerosol_anisotropy:'Anisotropia da dispersão de aerosol.',
  planet_radius_km:'Raio do planeta do modelo atmosférico em km.',observer_height_km:'Altura do observador atmosférico em km.',rayleigh_scale_height_km:'Altura característica da dispersão Rayleigh.',aerosol_scale_height_km:'Altura característica do aerosol.',atmosphere_height_km:'Espessura da atmosfera do modelo.',ground_albedo:'Refletância do chão do céu físico.',
  auto_exposure_min_ev:'Limite inferior de exposição automática.',auto_exposure_max_ev:'Limite superior de exposição automática.',auto_exposure_low_percent:'Percentil inferior do histograma para auto exposição.',auto_exposure_high_percent:'Percentil superior do histograma para auto exposição.',auto_exposure_target_grey:'Nível cinza alvo da medição automática.',auto_exposure_speed_up:'Velocidade de adaptação ao elevar exposição.',auto_exposure_speed_down:'Velocidade de adaptação ao reduzir exposição.',
  hdri_rotation_degrees:'Gira a orientação do ambiente HDRI em graus.',hdri_exposure_ev:'Exposição do recurso HDRI em EV.',
  fog:'Ativa neblina do volume, conforme override e política efetiva.',post:'Ativa o grupo de pós-processamento do volume.',auto_exposure:'Solicita exposição adaptativa no consumidor disponível.',auto_exposure_center_weighted:'Pondera centro da medição automática.',
  bloom:'Ativa bloom, com limiar/intensidade separados.',vignette:'Ativa vinheta.',film_grain:'Ativa grain.',ambient_occlusion:'Ativa AO global; não é bake de GI.',
  physical_atmosphere_high_quality:'Escolhe maior qualidade do céu físico, com custo dependente do backend.',sky:'Escolhe o modelo de céu; HDRI exige recurso atribuído.',tone_mapper:'Seleciona curva de mapeamento de brilho para saída.',volume_shape:'Seleciona ambiente global, caixa ou esfera conforme o domínio.',volume_layer:'Camada do volume usada com máscara da câmera.',
  color_temperature:'Temperatura da luz em kelvin, quando Usar temperatura está ligado.',intensity:'Energia da luz na unidade selecionada; compare com distância/alcance constantes.',range:'Alcance de contribuição da luz pontual/spot.',
  inner_angle:'Ângulo interno do cone spot; região de contribuição central.',outer_angle:'Ângulo externo do cone spot; limite de contribuição.',
  shadow_strength:'Peso da sombra disponível para esta luz.',shadow_bias:'Deslocamento de comparação de profundidade para evitar acne.',shadow_normal_bias:'Bias em função da normal; excesso pode destacar a sombra da superfície.',shadow_near_plane:'Plano próximo do mapa de sombra.',use_color_temperature:'Aplica temperatura de cor à cor autorada da luz.',
  unit:'Unidade de intensidade no domínio da luz; não troque números supondo equivalência entre lux/lumen/candela.',shadow_mode:'Solicita a modalidade de sombra no renderer disponível.',shadow_resolution:'Resolução solicitada para mapa de sombra; alocação depende da política e atlas.',
  vertical_fov:'Campo de visão vertical da perspectiva, em graus.',near_plane:'Plano de corte próximo; valor exageradamente baixo reduz precisão de depth.',far_plane:'Plano de corte distante; objetos além ficam cortados.',orthographic_half_height:'Metade da altura vertical da projeção ortográfica.',projection:'Seleciona perspectiva ou ortográfica.',environment_mask:'Máscara de camadas dos volumes de ambiente aceitos pela câmera.',
  yaw_sensitivity:'Ganho horizontal do olhar.',pitch_sensitivity:'Ganho vertical do olhar.',pitch_limit:'Limita inclinação vertical da câmera.',damping_seconds:'Tempo de suavização da aproximação da câmera ao alvo.',
  coefficient:'Coeficiente da contribuição de vento, combinado com o vetor/campo.',linear_drag:'Arrasto linear aplicado pelo campo.',angular_drag:'Arrasto angular aplicado pelo campo.',acceleration:'Aceleração radial em relação à origem do campo.',tangential_acceleration:'Aceleração tangencial em torno da origem.',wake_bodies:'Acorda corpos afetados quando a política do campo pede.',replace_world_gravity:'Substitui em vez de somar a contribuição de gravidade mundial no campo.',falloff:'Seleciona atenuação da contribuição ao longo do campo.',affected_layer:'Filtra a camada dos corpos afetados pelo campo.',
  mass:'Massa do corpo dinâmico em kg; influencia resposta a força/impulso.',friction:'Atrito nos contatos; compare deslizamento com o mesmo par de superfícies.',restitution:'Restituição nos contatos; controla ressalto conforme a combinação física.',linear_damping:'Amortecimento de velocidade linear.',angular_damping:'Amortecimento de velocidade angular.',gravity_factor:'Multiplica gravidade mundial deste corpo 3D.',gravity_scale:'Multiplica gravidade mundial deste corpo 2D.',max_linear_velocity:'Limite de velocidade linear do corpo.',max_angular_velocity:'Limite de velocidade angular do corpo.',solver_velocity_steps:'Ajuste de passos do solver de velocidade para o corpo.',
  sensor:'Participa como sensor/sobreposição; não é uma superfície sólida de contato.',allow_sleep:'Permite dormir quando o corpo pode ficar em repouso.',continuous_collision:'Solicita detecção contínua para reduzir tunneling; confira formas/velocidades suportadas.',motion:'Escolhe autoridade estática/cinemática/dinâmica no domínio do corpo.',
  eye_height:'Altura de referência dos olhos do Character.',speed:'Velocidade de reprodução/percurso/motor na unidade do componente.',slope_degrees:'Inclinação máxima de apoio do Character.',jump_speed:'Velocidade alvo inicial de salto.',step_height:'Altura de degrau que o Character pode transpor.',floor_snap_length:'Distância de snap ao chão; confira degraus e bordas.',gravity:'Aceleração de gravidade do Character.',inherit_platform_horizontal:'Herdar movimento horizontal da plataforma de apoio.',
  hull_tolerance:'Tolerância da construção convexa de colisão.',active_edge_angle:'Ângulo para tratamento de bordas ativas da malha física.',convex:'Seleciona cozinha convexa quando a forma é baseada em malha.',weld_vertices:'Solda vértices na cozinha da malha; altera a forma derivada.',optimize_cooking:'Solicita otimização do derivado de colisão.',mesh_local_pose:'Aplica pose local da malha na construção da forma conforme o modo.',owner:'Escolhe o dono do corpo/forma no domínio do colisor.',
  motor:'Modo de motor da junta; exige tipo e limites compatíveis.',limit_min:'Limite inferior da junta na unidade do tipo.',limit_max:'Limite superior da junta na unidade do tipo.',motor_velocity:'Velocidade alvo do motor da junta.',motor_position:'Posição alvo do motor da junta.',motor_force:'Força/torque máximo do motor, conforme o tipo de junta.',spring_frequency:'Frequência da mola da junta.',spring_damping:'Amortecimento da mola da junta.',
  swing_y:'Limite de swing no eixo Y da junta.',swing_z:'Limite de swing no eixo Z da junta.',twist_min:'Limite inferior de twist.',twist_max:'Limite superior de twist.',connected_body:'Objeto com o corpo conectado; confira a cadeia de dependências.',
  acceleration_motor:'',braking:'Limita a correção da velocidade quando não há comando de movimento.',air_control:'Multiplicador de controle enquanto sem apoio.',probe_height:'Altura da origem da consulta de apoio.',probe_distance:'Alcance da consulta de apoio.',support_radius:'Raio da região de apoio do motor.',max_slope:'Inclinação máxima de apoio do motor.',inherit_platform_velocity:'Herda velocidade da plataforma de apoio quando permitido.',automatic_support:'Resolve apoio pela geometria real; confira diagnóstico em vez de presumir chão.',
  wrap_mode:'Escolhe política ao atingir o fim do clipe.',clip_count:'Quantidade de entradas de clipe autoradas; recurso e estado de reprodução são separados.',
  reference_angle_degrees:'Ângulo de referência relativo da junta 2D em graus.',axis_angle_degrees:'Direção do eixo da junta 2D em graus.',length:'Comprimento de referência da junta Distance.',min_length:'Comprimento mínimo da junta Distance.',max_length:'Comprimento máximo da junta Distance.',lower_limit:'Limite inferior da junta 2D.',upper_limit:'Limite superior da junta 2D.',motor_speed:'Velocidade linear alvo do motor da junta 2D.',motor_angular_speed_degrees:'Velocidade angular alvo do motor 2D em graus/s.',max_motor_force:'Limite de força do motor linear 2D.',max_motor_torque:'Limite de torque do motor angular 2D.',spring_hertz:'Frequência da mola 2D.',spring_target_translation:'Translação alvo da mola 2D.',spring_target_angle_degrees:'Ângulo alvo da mola 2D.',linear_hertz:'Frequência da ligação linear 2D.',angular_hertz:'Frequência da ligação angular 2D.',linear_damping_ratio:'Razão de amortecimento linear 2D.',angular_damping_ratio:'Razão de amortecimento angular 2D.',world_anchor:'Interpreta a âncora conforme a opção de mundo da junta 2D.',collide_connected:'Permite colisão entre os corpos conectados.',limit_enabled:'Ativa os limites configurados da junta 2D.',motor_enabled:'Ativa motor da junta 2D.',spring_enabled:'Ativa mola da junta 2D.',angular_velocity_degrees:'Velocidade angular 2D em graus/s; não confundir com rad/s da API matemática.',fixed_rotation:'Trava a rotação física do Body2D.',capsule_half_length:'Metade da distância entre centros da cápsula 2D; raio é configurado separadamente.',
  volume:'Ganho linear de áudio do consumidor correspondente; 0 silencia e 1 conserva ganho unitário.',pitch:'Velocidade/pitch da reprodução; não altera o arquivo original.',pan:'Pan estéreo, de esquerda a direita; é condicional à espacialização.',min_distance:'Distância próxima de referência da atenuação 3D.',max_distance:'Distância máxima de referência da atenuação 3D.',rolloff_factor:'Fator de queda de ganho do modelo de atenuação.',cone_inner:'Ângulo interno do cone acústico.',cone_outer:'Ângulo externo do cone acústico.',cone_gain:'Ganho fora da região interna do cone.',doppler:'Fator do efeito Doppler.',mute:'Silencia sem remover o componente.',loop:'Repete a reprodução/percurso no fim.',playback:'Política/estado de reprodução autorada da fonte.',dimension:'Seleciona áudio estéreo ou espacial conforme o domínio.',rolloff:'Modelo de atenuação por distância.',bus:'Destino de mixer da fonte.',solo:'Isola esse bus conforme o roteamento do mixer.',output:'Bus de saída; confira ciclos e destino Master.',
  closed:'Fecha a curva ligando o último ponto ao primeiro.',point_roll:'Roll do frame da curva por ponto.',progress_distance:'Distância inicial mundial ao longo da curva.',backwards:'Percorre a curva na direção reversa.',orient:'Alinha orientação ao frame do caminho.',
};

export function propertyUsage(c,p) {
  const id=p.id;
  let description=p.help || exact[id];
  if (c.typeId==='astra.ui.canvas' && /^(width|height)$/.test(id)) description='Resolução local do plano no modo Mundo. No modo Tela, o retângulo é o viewport; não é resolução de referência para escala.';
  if (/^astra\.(constraint|spring)\.scale$/.test(c.typeId) && /^offset_[xyz]$/.test(id)) description='Fator de escala no eixo indicado, combinado à escala da fonte. Valor 1 mantém o fator unitário; não é deslocamento em metros.';
  if (c.typeId==='astra.physics.dynamic_motor' && id==='acceleration') description='Limita a força de correção para atingir a velocidade alvo; usa a massa real, sem escrever Transform diretamente.';
  if (c.typeId==='astra.render.environment' && id==='weight') description='Peso da mistura do volume, combinado com shape, distância e prioridade.';
  if (c.typeId==='astra.path.follow' && id==='duration') description='Tempo para completar o percurso no modo por duração; modo velocidade usa Speed.';
  if (c.typeId==='astra.animation' && id==='speed') description='Multiplica a velocidade de reprodução dos clipes; exige estado/recurso de animação válido.';
  if (!description && /^source_\d+$/.test(id)) description=`Objeto fonte da parte ${Number(id.split('_')[1])+1} da receita de colisão. A receita conserva referências; não é uma forma runtime isolada.`;
  if (!description && /^(axis|freeze_position|freeze_rotation)_[xyz]$/.test(id)) description=id.startsWith('freeze')?'Trava o grau de liberdade físico desse eixo; afeta a resposta do corpo, não só o Inspector.':'Aplica a restrição no eixo indicado; desligar conserva esse canal fora da influência.';
  if (!description && /^(offset|center|rotation_offset|position|rotation|scale|vector|velocity|angular|force|relative_force|torque|relative_torque|up|point_position|point_in|point_out)_[xyz]$/.test(id)) {
    const prefix=id.slice(0,-2), axis=id.slice(-1).toUpperCase();
    const uses={offset:'Deslocamento do resultado/volume em relação à origem configurada',center:'Centro local da forma de colisão',rotation_offset:'Offset angular da orientação resultante',position:'Destino do canal de posição do tween',rotation:'Rotação autorada do sistema na unidade indicada',scale:'Destino do canal de escala do tween',vector:'Componente do vetor de contribuição do campo',velocity:'Velocidade linear inicial/autorada do corpo',angular:'Velocidade angular do corpo',force:'Força contínua em espaço mundial',relative_force:'Força contínua no espaço local do objeto',torque:'Torque contínuo em espaço mundial',relative_torque:'Torque contínuo no espaço local',up:'Vetor vertical inicial do frame do caminho; vetor total zero é inválido',point_position:'Posição local do ponto selecionado da curva',point_in:'Tangente de entrada do ponto selecionado da curva',point_out:'Tangente de saída do ponto selecionado da curva'};
    description=`${uses[prefix]}, eixo ${axis}.`;
  }
  if (!description && /^(half_[xyz]|half_height|radius)$/.test(id)) description=id==='radius'?'Raio da forma/volume selecionado; confira o tipo e os campos condicionais.':'Meia dimensão da forma/volume no eixo indicado. Dimensão total é o dobro; aplica-se à forma selecionada.';
  if (!description && /^transition_\d$/.test(id)) description='Limiar de altura projetada para trocar este nível de LOD; mantenha ordenação dos níveis.';
  if (!description && /^fade_width_\d$/.test(id)) description='Largura da faixa de transição desse nível de LOD.';
  if (!description && /^level_\d$/.test(id)) description='Objeto/recurso de renderização atribuído a este nível de LOD; referência ausente não fabrica geometria.';
  if (!description && /^(anchor|axis|normal)_[ab]_[xyz]$/.test(id)) description=`${id.startsWith('anchor')?'Posição da âncora':id.startsWith('axis')?'Direção do eixo':'Normal de referência'} no frame do corpo ${id.split('_')[1].toUpperCase()}, componente ${id.slice(-1).toUpperCase()}. Configure os dois frames compatíveis.`;
  if (!description && /^(linear|angular)_[xyz]_/.test(id)) {
    const [space,axis,field]=id.split('_'); const terms={minimum:'limite inferior',maximum:'limite superior',friction:'fricção no grau de liberdade',velocity:'velocidade alvo do motor',position:'posição/ângulo alvo do motor',force:'força/torque máximo',frequency:'frequência da mola',damping:'amortecimento da mola',motion:'política livre/limitado/travado',motor:'modo do motor'};
    description=`Junta: ${terms[field]} do canal ${space==='linear'?'linear':'angular'} ${axis.toUpperCase()}. O tipo de junta, modo e unidade definem quando tem efeito.`;
  }
  if (!description && /^override_/.test(id)) description=`Inclui o grupo ${id.slice(9)} na mistura desse volume. Configurar valores sem ativar o override pode conservar a contribuição de outro volume.`;
  if (!description && /^(color|base_color|emission|sky_zenith|sky_horizon|ground|fog_color|material\.base_color|material\.emission)\.[rgb]$/.test(id)) description=`Canal ${id.slice(-1).toUpperCase()} da cor ${id.slice(0,-2)} no consumidor correspondente. Combine os três canais e intensidade quando existente.`;
  if (!description && /^box_size\.[xyz]$/.test(id)) description='Dimensão da caixa do volume de ambiente no eixo indicado; apenas no shape correspondente.';
  if (!description && /^material\./.test(id)) description=exact[id.slice(9)]?`Valor do slot quando o override de material estiver ativo. ${exact[id.slice(9)]}`:null;
  if (!description && /^channels\.(roughness|metallic|occlusion)$/.test(id)) description='Seleciona qual canal da textura fornece o sinal indicado; confira a organização real da imagem importada.';
  if (!description && /^(sampling\.|lightmap\.)/.test(id)) {
    const field=id.split('.').at(-1);const terms={offset_u:'Desloca a coordenada U',offset_v:'Desloca a coordenada V',scale_u:'Multiplica a coordenada U',scale_v:'Multiplica a coordenada V',rotation:'Gira as coordenadas UV',uv_set:'Escolhe o conjunto UV existente na geometria',wrap:'Escolhe repetição/clamp da amostragem',filter:'Escolhe filtragem da amostragem'};
    if(terms[field])description=`${terms[field]} ${id.startsWith('lightmap')?'do lightmap externo':'da textura/canal indicado'}. Não cria UVs ou recurso ausente.`;
  }
  if (!description && id==='shape') description='Escolhe a geometria do colisor/campo no domínio indicado; os campos relevantes mudam por forma.';
  if (!description && id==='kind') description='Escolhe a variante de luz/junta no domínio indicado; siga os campos e requisitos condicionais.';
  if (!description && id==='torque') description='Torque contínuo sobre o Body2D dinâmico; não é orientação autoral.';
  if (!description) throw new Error(`Missing property usage: ${c.typeId}.${id}`);
  return description;
}
