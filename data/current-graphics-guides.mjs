// Orientação dos componentes do plano gráfico G0..G7 (clima, luz, sondas, partículas,
// efeitos importados e entrada), revisada contra a fonte do APK da release gráfica.
// Os rótulos da release ficam aqui para trocar num lugar só quando a versão fechar.
export const graphicsRelease = '0.4.0';
const chapter = '/pt-br/snapshot-2026-10-06/versoes/preview-0-4-0/';
const present = `Presente na ${graphicsRelease}.`;

export const graphicsGuides = {
  'astra.render.time_of_day': {
    purpose:'Gira o objeto da luz direcional pela hora, data e latitude, como um script de ciclo de dia da Unity. O céu procedural, a luz ambiente e a neblina acompanham o ângulo do sol; à noite uma Lua opcional vira a luz principal.',
    use:'Crie por + › Luzes › Sol com dia e noite (cria o Sol e a Lua já ligados) ou adicione a uma Luz direcional existente. Defina Hora, Latitude, Dia do ano e Norte. Duração do dia maior que zero faz a hora andar no Play. Em Lua, aponte outra Luz direcional para ela seguir a lua da mesma hora e data.',
    example:'Com o Sol com dia e noite na Vila, ponha Hora 17,4: o horizonte fica avermelhado e as sombras compridas. Ponha 22: a Lua (0,5 lux, 12000 K) projeta a sombra e as estrelas giram com a hora. Para um dia de 24 minutos, Duração do dia 24. Para o ciclo inteiro ficar legível, troque o Volume para Exposição Automática.',
    extra:'A rotação do transform muda de verdade e aparece no gizmo e no Inspector; quem escreve a rotação da luz por script disputa com a Hora do dia. Com duas direcionais, o céu usa a que tem Hora do dia. Fase da lua sai do dia do ano. No Play a hora avança no próprio componente; a hora escrita por script vale no quadro seguinte.',
    next:`${present} Eventos Hora mudou, Nascer do sol, Pôr do sol e Dia mudou na Conexão de evento e em C# (HourChanged, Sunrise, Sunset, DayChanged); Speed acelera o dia. Eclipses e refração atmosférica não existem.`,
    related:`[Dia e noite e a Lua](${chapter}#céu-luz-e-materiais)`,
  },
  'astra.render.lighting_settings': {
    purpose:'Configurações de iluminação da cena: qual direcional é o sol e como o lightmap é assado. Equivale às Lighting Settings da janela Lighting da Unity 6.',
    use:'Crie por + › Luzes › Iluminação da cena, ou toque Gerar iluminação em ☰ › Iluminação › Lightmaps: sem o componente, ele nasce na raiz da cena com os padrões da Unity, num passo de desfazer. Fonte do sol vazia usa a direcional mais brilhante (com a Hora do dia na frente). Marque os objetos como Static, confira o contador Sem UV2 e toque Gerar iluminação.',
    example:'Na Sponza, marque as luzes pontuais com Modo Assado, mantenha Resolução 40 texels/m, Rebotes 2 e Remover ruído ligado e gere. No POCO F7 o bake levou 156 s em segundo plano e a GPU do quadro caiu de 18,58 para 13,18 ms com 8 luzes. Use o modo de visão Lightmap assado para ver só o que foi guardado.',
    extra:'Dados de iluminação é escrito pelo Gerar iluminação e só sai pelo Limpar. Amostras diretas, indiretas e do ambiente trocam qualidade por tempo de bake. O sol e a lua da Hora do dia nunca são assados; o céu de cada hora reescala o lightmap. As sondas de luz da cena são assadas no mesmo passo.',
    next:`${present} Modo direcional fica Não direcional. Lightmap com mapa de sombra (Shadowmask), Adaptive Probe Volumes e bake na nuvem não existem.`,
    related:`[Gerar iluminação](${chapter}#sondas-e-luz-assada)`,
  },
  'astra.render.reflection_probe': {
    purpose:'Captura o cômodo num cubemap para metal e vidro refletirem a sala certa em vez do céu. Assada (uma vez, só objetos Static) ou em tempo real.',
    use:'Crie por + › Luzes › Sonda de reflexo. Ajuste Tamanho e Deslocamento da caixa pelas alças até as paredes, ligue Projeção na caixa num interior e toque Assar: o cubemap vai para Iluminação/<nome>.aeprobe. Em Tempo real, escolha Atualização (Ao acordar, Todo quadro ou Por script) e o Fatiamento no tempo.',
    example:'Numa sala de 10×4×10 m com um piso metálico, ponha a sonda no centro, caixa 10/4/10, Projeção na caixa ligada, Resolução 128 e Asse. A esfera de metal reflete as paredes alinhadas. Uma segunda sonda no corredor com Distância de mistura 1 faz a transição entre as duas.',
    extra:'Cada objeto mistura as duas sondas de maior Importância que contêm o centro dele (empate: a menor caixa) e cai no reflexo do céu fora delas. Fundo, Máscara de culling e Planos próximo/distante valem para a captura. Por script, RenderProbe() recaptura; o fim da recaptura ainda não é notificado. Custo no POCO F7 com 111 desenhos refletindo: cerca de +0,6 ms de GPU.',
    next:`${present} Sonda Custom, Anchor Override e reflexos em espaço de tela não existem.`,
    related:`[Sondas](${chapter}#sondas-e-luz-assada)`,
  },
  'astra.render.light_probe_group': {
    purpose:'Pontos que guardam a luz da cena (harmônicos esféricos L2) para iluminar o que se move e o que não tem lightmap.',
    use:'Crie por + › Luzes › Grupo de sondas de luz (8 sondas num cubo). Em Editar sondas use anterior/próxima, Adicionar, Duplicar e Apagar, ou toque a sonda no viewport e arraste as alças. Assar sondas (ou Gerar iluminação, que assa junto com o lightmap) grava Iluminação/<grupo>.aelightprobes.',
    example:'Espalhe sondas a 1,5 m do chão nos dois lados de uma porta entre um pátio ao sol e um interior escuro, com uma fileira na soleira. Asse. Um personagem andando de fora para dentro escurece aos poucos, sem salto. Mostrar arestas desenha os tetraedros: evite tetraedros finos e compridos.',
    extra:'Como na Unity, objetos Static com lightmap não usam as sondas; no Mesh Renderer, Sondas de luz = Misturar sondas liga cada objeto. Remover anéis tira os lóbulos negativos atrás de luz forte. A posição dos campos Posição X/Y/Z é a da sonda selecionada.',
    next:`${present} Light Probe Proxy Volume e posicionamento automático não existem.`,
    related:`[Sondas](${chapter}#sondas-e-luz-assada)`,
  },
  'astra.environment.weather': {
    purpose:'Faz o papel do script de clima da Unity: muda nuvens, neblina e atmosfera do Ambiente do mesmo objeto, dosa as partículas de Chuva e Neve que acompanham a câmera e molha, empoça e cobre de neve as superfícies.',
    use:'Crie por + › Volume e céu › Clima: nasce um Ambiente global (prioridade 2) com o Clima e os filhos Chuva e Neve ligados. Escolha Tipo (Limpo, Nublado, Chuva, Tempestade, Neve) e Intensidade. Em Superfícies ajuste Molhado, Poças e Neve acumulada e os tempos para molhar, secar e acumular.',
    example:'Tipo Chuva, Intensidade 0,7, Variação natural 0,35: no Play as gotas oscilam com pancadas e calmarias (no POCO F7, 3.003 a 3.553 gotas vivas em 2 min) e o chão escurece em 20 s e empoça nos pisos planos. Troque para Neve: céu aberto, sol e telhados com espessura. Tempestade acrescenta relâmpagos com clarão.',
    extra:'O Clima escreve propriedades que você vê: Cobertura, Tom e Densidade das nuvens, a neblina do Ambiente e a taxa de emissão das partículas. Na edição a mudança é imediata; no Play passa pela Transição. Vento na precipitação inclina a chuva pelo vento das nuvens. O teto de partículas do aparelho é repartido pelo que cada sistema emite. Custo medido com chuva: cerca de +0,8 ms de GPU.',
    next:`${present} A chuva ainda entra sob telhados; raio desenhado, trovão e colisão das gotas com a física não existem.`,
    related:`[Nuvens e clima](${chapter}#nuvens-e-clima)`,
  },
  'astra.effects.particle_system': {
    purpose:'Emite, simula e desenha partículas, no modelo do Particle System da Unity: fogo, faíscas, fumaça, chuva e magia, com módulos ligados um a um.',
    use:'Crie por + › Efeitos (Partículas, Fogo, Faíscas…) ou adicione a um objeto. O Inspector empilha os módulos na ordem da Unity, cada um com interruptor no cabeçalho: Principal, Emissão, Forma, Velocidade/Limite/Herança/Força no tempo, Cor/Tamanho/Rotação no tempo e pela velocidade, Ruído, Colisão, Sub-emissores, Folha de textura, Luzes, Trilhas, Renderização e Material. No viewport, Reproduzir/Parar/Reiniciar.',
    example:'Para um fogo animado: Material do projeto com shader Particles Unlit em Aditivo e uma folha 4×4; Folha de textura com Colunas 4, Linhas 4, Folha inteira; Vida 1,2 s, Taxa 40/s, Forma Cone de 15°, Tamanho no tempo decrescente e Cor no tempo de amarelo a vermelho transparente. Para Faíscas à noite, ligue Luzes com Proporção 0,2 e Máximo de luzes 8.',
    extra:'Valores com mínimo e multiplicador seguem os modos da Unity (constante, aleatório entre dois, curva). Material escolhe um Material do projeto com shader Partícula: a imagem dele e a folha de quadros substituem a textura própria; em aparelho sem descritores bindless fica a textura própria. Colisão com Planos (até dois) ou com o Mundo (colisores da física do Play). Custo no POCO F7: 1.000 faíscas ~0,26 ms de GPU, 8.000 ~0,87 ms; quads grandes cobrindo a tela custam por preenchimento. API C#: Play, Stop, StopAndClear, Pause, Clear, Emit, IsPlaying, ParticleCount, Time e o evento Parou.',
    next:`${present} Módulo Externo de forças e partículas que empurram corpos físicos não existem.`,
    related:`[Partículas](${chapter}#partículas)`,
  },
  'astra.render.line': {
    purpose:'Desenha uma faixa por uma lista de pontos, com largura, cor e Material de partícula, como o Line Renderer da Unity. Também é o corpo visual do Laser.',
    use:'Adicione ao objeto e defina Pontos (até 8) e a posição de cada um, em mundo (Pontos em mundo) ou no espaço do objeto. Ajuste Largura inicial/final, Cor inicial/final e escolha um Material do projeto com shader Partícula. Fechar liga o último ponto ao primeiro.',
    example:'Para uma corda de 3 pontos: Pontos 3, Ponto 1 (0,2,0), Ponto 2 (1,1.6,0), Ponto 3 (2,2,0), Largura 0,05, cor marrom. Para um raio de energia, Material aditivo, Repetir a cada 1 m e Rolagem ao longo 2/s.',
    extra:'Brilho multiplica a cor (útil com bloom). Repetir a cada 0 estica a textura na faixa inteira. Importado de prefabs com Line Renderer pela importação de pacotes.',
    next:`${present} Mais de 8 pontos, cantos arredondados e alinhamento à superfície não existem.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.effects.laser': {
    purpose:'Lança um raio da frente do objeto até o primeiro colisor e desenha-o pela Linha do mesmo objeto, com um efeito de impacto no ponto. Converte o script de laser dos pacotes de efeitos.',
    use:'No objeto com Linha, adicione Laser. Defina Alcance, Frente (+Z da Astra ou o eixo do pacote) e escolha o Efeito de impacto (um objeto filho com partículas). Repetições por metro faz a textura não esticar com o comprimento.',
    example:'Numa arma com Linha aditiva vermelha, Laser com Alcance 20 e Efeito de impacto num filho Faíscas: apontando para uma parede a 6 m, a linha para na parede e as faíscas nascem no ponto, viradas para fora com Impacto alinhado ao laser.',
    extra:'Afastamento do impacto recua o efeito da superfície para não entrar na parede. Sem colisor no alcance, a linha vai até o Alcance e o impacto some.',
    next:`${present} Filtro por camada e reflexo em espelho não existem.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.effects.projectile': {
    purpose:'Move o objeto para a frente; no primeiro acerto cria o Impacto, solta os rastros configurados e some. Converte o script de projétil dos pacotes de efeitos.',
    use:'Adicione ao objeto do projétil. Defina Velocidade, Vida e Raio do teste de acerto, escolha os recursos Impacto e Disparo (prefabs) e, em Soltar 1..4, os filhos de rastro que devem continuar no mundo depois do acerto.',
    example:'Bola de fogo: Velocidade 15 m/s, Vida 5 s, Raio 0,1; Impacto = prefab de explosão; Soltar 1 = filho Trilha. Instanciada pelo script a 1 m à frente do jogador, ela anda, acerta a parede, cria a explosão no ponto e a trilha se desfaz sozinha.',
    extra:'Impacto virado para o atirador orienta o efeito de volta para quem atirou; Giro do impacto corrige prefabs modelados em outro eixo. Disparo é criado na origem quando o projétil nasce.',
    next:`${present} Gravidade, ricochete e teleguiado não existem.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.effects.collision_spawn': {
    purpose:'Cada toque de partícula do Sistema de partículas deste objeto cria um prefab no ponto: respingo, faísca, explosão. Equivale ao OnParticleCollision dos scripts dos pacotes.',
    use:'No objeto com Sistema de partículas e Colisão ligada, adicione Instanciar ao colidir e escolha os Efeitos. Defina Duração do efeito (quanto cada cópia vive) e Máximo por quadro.',
    example:'Chuva de meteoros com Colisão no plano do chão: Efeitos = prefab de explosão pequena, Duração 2 s, Máximo por quadro 4. Cada meteoro que toca o chão deixa uma explosão; Virado para o emissor orienta a explosão para cima.',
    extra:'Solto na cena deixa as cópias no mundo em vez de filhas do emissor. Destruir este objeto remove o emissor no primeiro toque (projéteis de partícula).',
    next:`${present} Toques com a física da cena dependem da Colisão Mundo do Sistema de partículas.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.audio.effect_sound': {
    purpose:'Toca o clipe da Fonte de áudio do mesmo objeto de tempos em tempos, com volume sorteado, como o PlayOneShot dos scripts de som dos pacotes de efeitos.',
    use:'No objeto com Fonte de áudio, adicione Som repetido. Defina Intervalo, Atraso e, com Volume sorteado, o Volume mínimo e máximo.',
    example:'Fogueira: Fonte de áudio com um estalo curto, Som repetido com Intervalo 2 s, Volume sorteado 0,4 a 1. Os estalos repetem sem soar mecânicos.',
    extra:'Repetir desligado toca uma vez depois do Atraso. O clipe é o da Fonte de áudio; este componente não escolhe clipe próprio.',
    next:`${present} Lista de clipes sorteados não existe.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.effects.rotator': {
    purpose:'Gira o objeto e os filhos numa velocidade constante, no espaço local.',
    use:'Adicione e defina Velocidade X/Y/Z em graus por segundo.',
    example:'Um portal mágico: Velocidade Z 45 °/s gira o anel de partículas e os filhos juntos.',
    extra:'Gira o transform do objeto; quem também escreve a rotação (animação, script) disputa com ele.',
    next:present,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.effects.follow_camera': {
    purpose:'Mantém o objeto na posição da câmera do jogo, mais um deslocamento nos eixos do mundo. Serve para chuva, neve e poeira que devem cercar o jogador onde ele estiver.',
    use:'Adicione ao objeto do efeito e ajuste Deslocamento X, Y e Z em metros. A posição é a da câmera do jogo (a marcada MainCamera); o giro do objeto não muda.',
    example:'Uma chuva de partículas com Forma Caixa de 40 × 1 × 40 m e Seguir câmera com Deslocamento Y 15: as gotas sempre nascem 15 m acima da câmera e cobrem a vista inteira, ande o jogador para onde andar.',
    extra:'Equivale ao Position Constraint da Unity preso à câmera. Prefabs de efeito importados que prendiam a precipitação ao jogador por script chegam com este componente. O Clima da Astra já acompanha a câmera sozinho (Seguir a câmera no Clima).',
    next:`${present} Seguir outro objeto que não a câmera fica para as restrições de posição.`,
    related:`[Importação de pacotes](${chapter}#importação-de-pacotes)`,
  },
  'astra.input.player_input': {
    purpose:'Transforma ações do mapa de entrada do projeto em eventos deste objeto, como o Player Input da Unity em Invoke Unity Events.',
    use:'Adicione ao objeto do jogador e marque em Ações quais ações do mapa ele observa. Numa Conexão de evento, escolha Entrada: ação executada ou Entrada: ação cancelada e filtre pela ação. Em C#, assine PlayerInput.Performed e Canceled.',
    example:'Ação Mirar segurada: Entrada: ação executada liga o desfoque de profundidade do Volume e Entrada: ação cancelada desliga, sem script.',
    extra:'Ações fora da marcação não geram eventos. Os nomes das ações vêm do mapa de entrada da cena.',
    next:`${present} Troca de esquema de controle e vários jogadores locais não existem.`,
    related:`[API C# e Flow](${chapter}#api-c-e-flow)`,
  },
};

// Componentes que já existiam e mudaram muito no plano gráfico: a orientação de 06/10
// ficou desatualizada.
export const graphicsChangedGuides = {
  'astra.render.environment': {
    purpose:'Volume da cena, como o Volume da URP/HDRP: um perfil compartilhado de overrides (exposição, tonemapping, cor, bloom, profundidade de campo, céu, neblina, nuvens…) que vale no mundo inteiro ou dentro de uma caixa ou esfera, misturado por prioridade e peso.',
    use:'Crie por + › Volume e céu (Volume global, em caixa, em esfera, Ambiente, Volume de nuvens, Clima). Em Perfil escolha, crie (Novo) ou copie (Clonar) um perfil. Cada efeito é um cartão de override com interruptor, ALL/NONE e o menu ⋮; Adicionar override lista o que o perfil ainda não tem. O Ambiente da cena também é editado por ☰ › Iluminação.',
    example:'Para um desfoque ao mirar: Volume global com prioridade 10 e peso 0, override Profundidade de campo em Bokeh com Distância de foco 3 m. Uma Conexão de evento (ou script) leva o peso a 1 enquanto a mira está segurada. A câmera escolhe os Volumes pela Máscara de volume (camadas do objeto).',
    extra:'Editar um valor muda o perfil e todos os Volumes que o usam, num único desfazer. Um parâmetro desmarcado fica apagado e vem do Volume de baixo. Valores que não se misturam (modos, texturas, liga/desliga) trocam assim que o Volume começa a pesar. A profundidade de campo custa 2 a 3,5 ms no POCO F7 e não roda junto com o ampliador temporal.',
    next:`${present} Volumes por câmera além da máscara, Curve Mapping da exposição e importação de .cube não existem.`,
    related:`[Pós-processamento e Volume](${chapter}#pós-processamento-e-volume)`,
  },
  'astra.render.light': {
    purpose:'Luz direcional, pontual ou spot, como o Light da Unity: modo Tempo real, Misto ou Assado, sombra configurada na própria luz, máscara de culling e camadas de renderização.',
    use:'Crie por + › Luzes. Em Sombra escolha Sem sombra, Dura ou Suave, a Força e os desvios. Modo Assado entra no lightmap e sai do tempo real quando houver lightmap; Misto assa só o rebote. Máscara de culling e Camadas de renderização escolhem o que a luz ilumina.',
    example:'Uma segunda direcional azulada, intensidade 0,3, sem sombra, ilumina o lado escuro das casas sem apagar o sol. Um poste com Modo Assado e sombra suave aparece no lightmap da praça e libera uma das luzes por objeto.',
    extra:'A direcional mais brilhante (ou a Fonte do sol da Iluminação da cena) é o sol, com cascatas e disco no céu; as outras viram luzes adicionais sem sombra. Cada objeto soma até 8 luzes (4 no nível C). Ângulos do spot são a abertura total; a cor é sRGB.',
    next:`${present} Cookie e luz de Área não existem.`,
    related:`[Céu, luz e materiais](${chapter}#céu-luz-e-materiais)`,
  },
  'astra.camera': {
    purpose:'Câmera como a da URP: lente (inclusive câmera física), fundo, Culling Mask, pós, sombras, HDR, antisserrilhado por câmera, Máscara de volume e Viewport Rect para tela dividida.',
    use:'Selecione a câmera › Inspector: Lente, Renderização, Ambiente e Saída. A tag MainCamera marca a câmera do jogo (Camera.main). Para tela dividida, duas câmeras com Viewport diferentes e Prioridades distintas.',
    example:'Câmera física: ligue, Distância focal 85 mm, sensor 36×24 mm, Ajuste Vertical: o campo de visão sai da focal. Fundo Cor sólida preta e Culling Mask sem a camada Casas mostram só os personagens.',
    extra:'Várias câmeras desenham da menor para a maior prioridade; uma de tela inteira que limpa o fundo esconde as de baixo. Até duas visíveis ao mesmo tempo, e a de cima sai sem sombras e sem TAA.',
    next:`${present} Camera Stack (Overlay), Target Texture, MSAA e deslocamento de lente não existem.`,
    related:`[Céu, luz e materiais](${chapter}#céu-luz-e-materiais)`,
  },
  'astra.render.mesh': {
    purpose:'Desenha a malha com os materiais dos slots e decide como ela participa da luz: sombras, sondas, lightmap e camadas de renderização.',
    use:'Na aba Iluminação: Projetar sombras (Desligado, Ligado, Dupla face, Só sombra), Receber sombras, Contribuir para iluminação global e Receber iluminação global (Lightmaps ou Sondas de luz). Em Sondas: Sondas de luz e Sondas de reflexo.',
    example:'Uma casa estática com UV2: Contribuir ligado, Receber = Lightmaps. Um personagem: Receber = Sondas de luz e Sondas de luz = Misturar sondas. Uma copa de árvore que só precisa da sombra: Projetar sombras = Só sombra num duplicado.',
    extra:'Sem UV2, a malha Static recebe pelas sondas; a importação pode gerar UV de lightmap (xatlas). Decalques e vidros recebem o lightmap da superfície embaixo sem bloquear a luz.',
    next:present,
    related:`[Sondas e luz assada](${chapter}#sondas-e-luz-assada)`,
  },
};

const rgb = id => ({r:'vermelho',g:'verde',b:'azul',a:'opacidade'})[id.slice(-1)];
export function graphicsPropertyUsage(c,p) {
  const id=p.id;
  // O texto do descritor vence; aqui só os campos que chegaram sem ajuda.
  if (p.help) return null;
  if (c.typeId==='astra.render.environment') {
    if (/^grading_(lift|gamma|gain|shadows|midtones|highlights)_color\.[rgb]$/.test(id)) return `Canal ${rgb(id)} da cor de ${id.split('_')[1]} da gradação (Lift/Gamma/Gain ou Sombras/Médios/Realces da Unity). Branco neutro; combine com o Brilho da faixa.`;
    if (/^grading_(lift|gamma|gain|shadows|midtones|highlights)$/.test(id)) return 'Brilho desta faixa da gradação, de −1 a 1; 0 é neutro. Vale depois da exposição, na tabela de cor (LUT 32³).';
    if (/^grading_(shadows|highlights)_(start|end)$/.test(id)) return 'Limite da faixa de Sombras/Realces em luminância (0 a 1), como as faixas de Shadows Midtones Highlights da Unity.';
    if (id==='grading_temperature') return 'Balanço de branco: negativo esfria (azul), positivo esquenta (amarelo), como o White Balance da Unity.';
    if (id==='grading_tint') return 'Balanço de branco: negativo puxa para o verde, positivo para o magenta.';
    if (id==='grading_vibrance') return 'Satura mais as cores pouco saturadas e preserva as já fortes (pele).';
    if (id==='sun_glare') return 'Auréola do sol espalhada pelo pós; 0 desliga.';
    if (id==='moon_phase') return '0 lua nova, 0,5 cheia. Com Hora do dia, a fase sai da data.';
    if (id==='moon_size') return 'Diâmetro aparente da lua no céu, em graus (a real tem cerca de 0,5°).';
    if (id==='moon_intensity') return 'Brilho do disco da lua no céu; não é a luz da Lua (essa é uma Luz direcional ligada à Hora do dia).';
    if (id==='star_intensity') return 'Brilho das estrelas, que só aparecem com o sol abaixo do horizonte.';
    if (/^cloud_tint\.[rgb]$/.test(id)) return `Canal ${rgb(id)} do tom das nuvens, multiplicado pela luz do sol e do céu.`;
    if (id==='sky_exposure') return 'Exposição do céu procedural, como o Exposure do Skybox/Procedural (padrão 1,3). Não depende da intensidade do sol.';
    if (id==='sun_size') return 'Tamanho do disco do sol no céu procedural, como Sun Size da Unity.';
    if (id==='sun_size_convergence') return 'Quanto o brilho do sol se concentra no disco (Sun Size Convergence); maior deixa a borda mais nítida.';
    if (/^ambient_(sky|equator|ground)_color\.[rgb]$/.test(id)) return `Canal ${rgb(id)} da cor do ${id.split('_')[1]==='sky'?'céu':id.split('_')[1]==='equator'?'equador':'chão'} na luz ambiente por Gradiente.`;
    if (/^ambient_color\.[rgb]$/.test(id)) return `Canal ${rgb(id)} da luz ambiente por Cor.`;
    if (id==='fog_end') return 'Distância em que a neblina Linear fica total; só vale no modo Linear.';
    if (/^override_/.test(id)) return 'Coloca este efeito no perfil (Adicionar override). Os parâmetros do efeito têm caixa própria; um parâmetro desmarcado vem do Volume de baixo.';
  }
  if (c.typeId==='astra.render.mesh' && id==='channels.roughness_source') return 'De onde sai a rugosidade: canal da textura, suavidade (1 − canal) ou suavidade no alfa da cor base, como a Smoothness Source da Unity. Herdar mantém a do material.';
  if (c.typeId==='astra.camera') {
    if (id==='sensor_height') return 'Altura do sensor da câmera física, em mm (Full Frame: 24). Com a focal, define o campo vertical.';
    if (/^background_color\.[rgb]$/.test(id)) return `Canal ${rgb(id)} da cor de fundo quando Fundo = Cor sólida.`;
  }
  if (c.typeId==='astra.render.reflection_probe') {
    if (/^box_size\.[xyz]$/.test(id)) return `Tamanho da caixa de influência no eixo ${id.slice(-1).toUpperCase()}, em metros. Com Projeção na caixa, deve coincidir com as paredes.`;
    if (/^box_offset\.[xyz]$/.test(id)) return `Deslocamento da caixa em relação ao objeto no eixo ${id.slice(-1).toUpperCase()}; a captura continua na posição do objeto.`;
    if (/^background\.[rgb]$/.test(id)) return `Canal ${rgb(id)} da cor de fundo da captura quando Fundo = Cor sólida.`;
  }
  if (c.typeId==='astra.render.light_probe_group' && /^probe_position_[xyz]$/.test(id)) return `Posição da sonda selecionada no eixo ${id.slice(-1).toUpperCase()}, no espaço do objeto. Escolha a sonda em Editar sondas ou tocando no viewport.`;
  if (c.typeId==='astra.effects.particle_system') {
    if (id==='start_color_a') return 'Opacidade da cor inicial de cada partícula.';
    if (id==='start_color_min_a') return 'Opacidade da segunda cor quando a cor inicial é aleatória entre duas.';
    if (id==='simulation_speed') return 'Multiplica a velocidade de todo o sistema; 2 roda o efeito duas vezes mais rápido.';
    if (/^burst_\d_count_max$/.test(id)) return 'Máximo de partículas da rajada; com mínimo diferente, cada rajada sorteia entre os dois.';
    if (/^shape_box_[xyz]$/.test(id)) return `Tamanho da caixa de emissão no eixo ${id.slice(-1).toUpperCase()}, em metros.`;
    if (/^shape_position_[xyz]$/.test(id)) return `Deslocamento da forma de emissão no eixo ${id.slice(-1).toUpperCase()}, no espaço do objeto.`;
    if (/^shape_rotation_[xyz]$/.test(id)) return `Giro da forma de emissão em torno de ${id.slice(-1).toUpperCase()}, em graus.`;
    if (/^size_over_lifetime_[yz]$/.test(id)) return `Multiplicador do tamanho no eixo ${id.slice(-1).toUpperCase()} ao longo da vida, quando Tamanho no tempo usa eixos separados (o X é o campo Tamanho no tempo).`;
    if (/^rotation_over_lifetime_[xy]$/.test(id)) return `Velocidade angular em torno de ${id.slice(-1).toUpperCase()}, em graus por segundo, quando Rotação no tempo usa eixos separados (partículas em malha ou alinhadas ao mundo).`;
    if (id==='size_over_lifetime') return 'Multiplicador do tamanho ao longo da vida (constante ou curva conforme o modo).';
    if (id==='rotation_over_lifetime') return 'Velocidade angular ao longo da vida, em graus por segundo.';
    if (/^material_tint_[rgb]$/.test(id)) return `Canal ${({r:'vermelho',g:'verde',b:'azul'})[id.slice(-1)]} da tinta da textura própria; acima de 1 brilha com bloom.`;
    if (/^material_scroll_[xy]$/.test(id)) return 'Rolagem da textura própria, em repetições por segundo.';
    if (id==='material_noise_scale') return 'Escala do ruído que recorta a textura própria.';
    if (/^material_noise_scroll_[xy]$/.test(id)) return 'Rolagem do ruído, em repetições por segundo; anima a borda de fumaça e fogo.';
    if (id==='material_center_glow_power') return 'Concentra o brilho central da partícula; maior deixa o miolo mais pontual.';
    if (id==='emission_enabled') return 'Liga o módulo Emissão; desligado, só rajadas por script (Emit) criam partículas.';
    if (id==='rotation_over_lifetime_enabled') return 'Liga o módulo Rotação no tempo.';
    if (id==='shape_type') return 'Forma de onde as partículas nascem: Esfera, Hemisfério, Cone, Caixa, Círculo, Aresta, Rosca ou Retângulo.';
    if (id==='shape_cone_emit_from') return 'Cone: nascer na Base ou em todo o Volume.';
    if (id==='shape_box_emit_from') return 'Caixa: nascer no Volume, na Casca ou nas Arestas.';
    if (id==='color_over_lifetime_mode') return 'Um gradiente, ou aleatório entre dois gradientes por partícula.';
  }
  if (id==='enabled' && ['astra.render.time_of_day','astra.render.reflection_probe','astra.render.light_probe_group'].includes(c.typeId)) return 'Desligado, o componente para de agir e conserva os dados.';
  return null;
}

export const reviewedGraphicsComponentIds = Object.keys(graphicsGuides);
