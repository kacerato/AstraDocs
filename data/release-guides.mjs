import { link } from './workflow-guide-tools.mjs';
// Release gráfica G0..G7. As seções das branches que ainda não entraram na base ficam
// atrás de `graphicsMerged` e só aparecem quando o commit do APK as contiver.
const graphicsMerged = { g4Moon:true, g6:true, g7:true };
const appRelease = '0.4.0-preview.20261028', versionCode = 31, commit = '8850af92';
const catalog = '/pt-br/snapshot-2026-10-28/componentes/';

const graphicsChapter = {
  route:'versoes/preview-0-4-0', title:'Astra 0.4.0: gráficos vivos — Volume e pós da URP, dia e noite, clima, sondas, lightmap e partículas',
  description:'Como usar o Volume com perfil compartilhado e overrides, a exposição automática, o céu com sol, lua e estrelas, o clima, as sondas, o lightmap assado, o sistema de partículas e os cortes de custo por nível incluídos no APK 0.4.0.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-28',appRelease,runtimeVerified:true,prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK ${appRelease}, versionCode ${versionCode}**, gerado no commit **${commit}**, sem alterações locais. [Download](/download/).

A atualização instala por cima da Astra 0.3.2 com a mesma chave e preserva os projetos. **Ao salvar, cenas, materiais e perfis passam aos formatos novos e a 0.3.2 não os abre mais**: copie o projeto antes se precisar voltar. O [catálogo de 28/10 (APK 0.4.0)](${catalog}) traz os componentes novos (Hora do dia, Iluminação da cena, Sonda de reflexo, Grupo de sondas de luz, Clima, Sistema de partículas e Entrada do jogador) e os campos novos de Ambiente, Luz, Câmera, Mesh Renderer e Animator.

## Desempenho

**Caminho:** Projeto › Qualidade. Cada nível é um teto, como o URP Asset de cada nível da Unity: limita Render Scale, cascatas e resolução da sombra do sol, filtro da sombra, oclusão de ambiente, bloom e luzes por objeto. O painel mostra o corte no próprio valor (por exemplo 4 → 2). No nível C a resolução dinâmica fica ligada, a oclusão sai e cada objeto recebe até 4 luzes.

- Cada objeto avalia só as luzes pontuais que o alcançam.
- **Animator › Culling Mode**: Sempre animar, Atualizar transformações ou Desligar fora da câmera do jogo. Personagens são avaliados em paralelo, e quem ocupa pouco da tela anima a cada 2 ou 4 quadros com interpolação.
- A sombra do sol usa dois mapas: o cenário parado fica em cache e só os moradores são redesenhados.
- **Resolução dinâmica** mais estável: decide pela mediana dos quadros e desce mais de um degrau quando a GPU passa muito do orçamento (Vila em nível C: 36,6 → 55,4 FPS).

Medido no POCO F7, Vila Astra: na qualidade alta, GPU de 50,8 para 28,2 ms por quadro e CPU de 23,6 para 11,2 ms contra a linha de base de 17/10; no nível C, 18,91 → 14,33 ms com o teto.

## Pós-processamento e Volume

**Caminho:** + › Volume e céu (Volume global, em caixa, em esfera, Ambiente, Volume de nuvens). No Inspector, **Perfil** escolhe, cria (Novo) ou copia (Clonar) o perfil; editar um valor muda todos os Volumes que usam o mesmo perfil. Cada efeito é um cartão de override com interruptor, contagem, **ALL/NONE** e o menu ⋮; **Adicionar override** lista por categoria o que falta. Parâmetro desmarcado vem do Volume de baixo. A câmera escolhe os Volumes pela **Máscara de volume** (camadas do objeto).

- **Exposição** do HDRP: Fixa, Automática (padrão) e Automática por histograma, medição em EV100 na GPU, adaptação Progressiva e limites −6/10 para a noite ficar escura.
- **Tonemapping** Nenhum, Neutro, ACES e AgX; **Ajustes de cor** com Pós-exposição, Filtro de cor e Giro de matiz; **Bloom** com Espalhamento, Tom, Brilho máximo e sujeira da lente.
- **Cor:** sete visuais prontos em cartões (Neutro, Cinemático, Dia quente, Entardecer, Noite azul, Tempestade, Fantasia), ajuste fino (balanço de branco, Lift/Gamma/Gain, Sombras/Médios/Realces) e as oito curvas de cor da URP, numa tabela de cor 32³.
- **Profundidade de campo** Gaussian ou Bokeh (2 a 3,5 ms no POCO; não roda junto com o ampliador temporal), **desfoque de movimento**, **aberração cromática**, **distorção de lente** e **vinheta** completa.

## Céu, luz e materiais

**Janela Iluminação** (☰ › Iluminação): o Ambiente da cena, com Material do céu (.skybox) e céu Procedural, Panorâmico (HDRI) ou Físico; luz ambiente por Céu, Gradiente ou Cor; neblina Linear, Exponencial ou Exponencial² com Cor fixa (céu limpo) ou Acompanhar o céu. A aba **Lightmaps** está em [Sondas e luz assada](#sondas-e-luz-assada).

- **Dia e noite:** + › Luzes › **Sol com dia e noite** cria o Sol com a Hora do dia e a Lua ligados. A hora gira o objeto do sol; o céu calcula a cor pelo ângulo dele. À noite a Lua vira a luz principal, o céu fica azul-marinho e as estrelas giram com a hora. Para o ciclo inteiro, use Exposição Automática no Volume.
- **Luz** como o Light da Unity: sombra na própria Luz (tipo, força, desvios), várias direcionais (a mais brilhante, ou a Fonte do sol da Iluminação da cena, é o sol), Máscara de culling, Camadas de renderização, spot em abertura total, cor sRGB.
- **Mesh Renderer › Iluminação:** Projetar sombras (Desligado, Ligado, Dupla face, Só sombra), Receber sombras, Camadas de renderização, Sondas e iluminação global.
- **Câmera** como a da URP: fundo Céu, Cor sólida ou Não inicializado, Culling Mask, Viewport Rect para tela dividida, câmera física (focal, sensor, Gate Fit), pós, sombras, HDR e antisserrilhado por câmera. A tag MainCamera existe em todo projeto.
- **Material** (toque num .material em Arquivos): Shader Lit, Complex Lit, Simple Lit, Unlit, Particles Lit ou Particles Unlit, com Smoothness, Height Map, Detail Inputs, Clear Coat, fluxo Especular, tipo de superfície com Alfa, Premultiplicado, Aditivo ou Multiplicar, Render Face e Sorting Priority. O importador Unity lê a suavidade do mapa metálico e do alfa do albedo, e a Biblioteca mostra um relatório por pacote.
- O reflexo do ambiente vem do céu da cena (Environment Reflections › Skybox): acabou o contorno claro e a sombra lavada.

## Sondas e luz assada

- **+ › Luzes › Sonda de reflexo:** ajuste a caixa até as paredes, ligue Projeção na caixa e toque **Assar** (Iluminação/<nome>.aeprobe), ou use Tempo real. Cada objeto mistura as duas sondas de maior Importância que o contêm.
- **+ › Luzes › Grupo de sondas de luz:** 8 sondas num cubo; Editar sondas, alças no viewport, Assar sondas.
- **☰ › Iluminação › Lightmaps › Gerar iluminação**, como o Progressive Lightmapper: marque os objetos como Static, confira o contador **Sem UV2** (tocar seleciona os objetos), escolha **Luz › Modo** Assado ou Misto e gere. O bake roda em segundo plano no aparelho; as sondas de luz são assadas no mesmo passo. O sol e a lua da Hora do dia continuam em tempo real. Modo de visão **Lightmap assado** no menu Sky/Fog/Post. Na importação de modelos, **Gerar UV de lightmap**. Sponza com 8 luzes no POCO F7: GPU 18,58 → 13,18 ms.

## Nuvens e clima

- **Nuvens** no Volume, como o Cloud Layer do HDRP: cobertura, cirros, altitude, espessura, curvatura da Terra, vento e sombra no chão pelo sol. + › Volume e céu › Volume de nuvens cria um volume só de nuvens.
- **+ › Volume e céu › Clima:** um Ambiente global com o Clima e os filhos Chuva e Neve. Escolha o Tipo (Limpo, Nublado, Chuva, Tempestade, Neve) e a Intensidade. Em Play a chuva varia sozinha, o chão molha, empoça e respinga, a neve cobre os telhados com espessura e a Tempestade solta relâmpagos. Cada tipo traz neblina, cor e luz próprias.
${graphicsMerged.g4Moon ? '- **Nuvens volumétricas** (Nuvens › Tipo › Volumétricas), como as Volumetric Clouds do HDRP: cúmulos até o horizonte, lado do sol dourado no fim de tarde, luz da lua à noite, Espessura, Fator de forma, Erosão e Passos; cerca de +1,5 ms no POCO F7. A Camada 2D continua, mais barata.\n- **Lua** com órbita própria (nasce mais tarde a cada dia) e **noite escura**: no Volume da noite, Exposição › Limite mínimo perto de −5,5 EV100.\n' : ''}
## Partículas

**Caminho:** + › Efeitos (Partículas, Fogo, Faíscas…). O Inspector empilha os módulos na ordem da Unity, cada um com interruptor: Principal, Emissão (rajadas, taxa por distância), Forma (8), Velocidade, Limite, Herança e Força no tempo, Cor/Tamanho/Rotação no tempo e pela velocidade, Ruído, Colisão (até dois planos), Sub-emissores, **Folha de textura**, **Luzes**, **Trilhas**, Renderização e Material. Um **Material do projeto** com shader Partícula substitui a textura própria. Por script: \`ParticleSystem.Play()\`, \`Stop()\`, \`Emit(n)\`. Custo no POCO: 1.000 faíscas ~0,26 ms de GPU.
${graphicsMerged.g6 ? `
## Importação de pacotes

**Caminho:** Importar › Pasta de pacote › Biblioteca › toque o prefab de efeito › **Abrir** › **Na cena**.

- **Efeitos prontos de pacotes Unity:** prefabs de partícula convertem em cascata (materiais, sons WAV, prefabs de impacto e a malha das partículas) para o Sistema de partículas, agora com partícula em malha, colisão com o mundo, órbita, até 8 sub-emissores e a mistura Distorção.
- **Scripts comuns de efeito viram componentes:** Linha, Laser, Projétil, Instanciar ao colidir, Som repetido, Girar e Seguir câmera. O que não tem equivalente aparece como perda listada, e o efeito abre sem ele.
- **Projeto novo** nasce com Main Camera (com Ouvinte de áudio) e Directional Light, como a cena nova da Unity; sem Ouvinte, o Play ouve pela câmera do jogo.
- Nenhum asset de pacote vem no APK: você importa os pacotes que tem. Guia: [Importar um pacote pela Biblioteca](/guia/importar/biblioteca-de-pacotes/).
` : ''}${graphicsMerged.g7 ? `
## API C# e Flow

- **C# com os nomes da Unity** (\`Astra.Rendering\`): \`Volume.SharedProfile\`, \`Volume.Profile\` (cópia própria), \`VolumeProfile.TryGet/Add/Remove/Has\`, \`VolumeParameter.Override\` e os overrides com classe própria (Exposure, Tonemapping, ColorAdjustments, Bloom, DepthOfField e os demais); \`RenderSettings\` sobre o Ambiente da cena; \`TimeOfDay.Current\`, \`Hour\`, \`Speed\` e os eventos \`HourChanged\`, \`Sunrise\`, \`Sunset\`, \`DayChanged\`; \`Material.SetFloat/SetColor/SetTexture\` com os nomes da URP; \`SceneQuery.FindFirstObjectByType\`; nomes da Unity em Light, Camera, MeshRenderer, ReflectionProbe e LightProbeGroup. Guia: [API gráfica](/guia/scripts/api-grafica/).
- **Flow (Conexão de evento):** eventos **Hora do dia** (hora mudou, nascer, pôr, dia mudou) e **Entrada** (ação executada, cancelada); comandos **Volume: definir peso**, **trocar perfil**, **usar cópia do perfil** e **Malha: trocar material**. A Conexão de evento passa à versão 3; cenas antigas abrem iguais.
- **Entrada do jogador** (PlayerInput): ações do mapa viram eventos do objeto. Guia: [Entrada do jogador](/guia/scripts/entrada-do-jogador/).
- Seis exemplos validados no POCO F7, em C# e em Flow: [Exemplos da API gráfica](/guia/exemplos/api-grafica/).
- Hora do dia no Play: escrever \`Hour = 18.5f\` põe 18,5 no quadro seguinte (antes somava ao tempo decorrido).
- Ainda não: trocar o shader do override de um objeto, chaves das Color Curves por script, fim da recaptura de uma sonda.
` : ''}
## Outros

- **Personagem › Direção:** Girar para a direção do movimento, Velocidade do giro, Suavização do giro e Relativo à câmera, como o Third Person Controller da Unity. Ligado no modelo Personagem jogável e em Criar raiz Character; componentes antigos abrem com o giro desligado.
- **Telemetria de desempenho opcional:** a coleta só liga depois da escolha na primeira abertura; Configurações › Telemetria de desempenho envia ou apaga os dados. Jogos exportados não têm telemetria.
- Edição múltipla: Adicionar componente acrescenta em todos os objetos selecionados sem apagar o que cada um tinha.

## Limites desta prévia

- Medições só no POCO F7 (Adreno 825); sem garantia para todo aparelho ou cena; páginas de memória de 16 KB não suportadas.
- Até duas câmeras visíveis ao mesmo tempo; Camera Stack, Target Texture e MSAA não existem.
- Lightmap: o par com o ambiente zerado e a caminhada de 24 h não foram validados no aparelho.
- A chuva do Clima entra sob telhados.
- **Exportar APK** continua experimental.
`
};

export const releasePages = [graphicsChapter, {
  route:'versoes/preview-0-3-2', title:'Astra 0.3.2: Animator 2D e camadas sincronizadas, Play sem solavancos, pacotes POLYGON e BoZo',
  description:'Como usar os modos 2D e as camadas sincronizadas do Animator, o que mudou no Play do carregar e no IK de dois ossos, a conversão Humanoid mais fiel e a importação de pacotes POLYGON e BoZo incluídos no APK 0.3.2.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-16',appRelease:'0.3.2-preview.20261016',runtimeVerified:true,prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK 0.3.2-preview.20261016, versionCode 30**, gerado da main no commit **cddc7a45**, sem alterações locais. [Download](/download/).

A atualização instala por cima da Astra 0.3.1 com a mesma chave e preserva os projetos. O [catálogo de 16/10 (APK 0.3.2)](/pt-br/snapshot-2026-10-16b/componentes/) continua valendo: nenhum componente novo entrou nesta prévia, só campos e comportamento.

## Animator: Modo 2D e Sincronizar com

**Caminho:** Inspector do Animator → **Abrir grafo do Animator** → estado → **Mistura 2D**. A linha **Modo 2D** alterna Triangulação (o comportamento anterior), Direcional simples, Direcional livre e Cartesiano livre, como os modos 2D da Unity; os dois modos livres usam bandas de gradiente em coordenadas polares ou cartesianas.

**Camadas:** a partir da segunda camada, **Sincronizar com** escolhe a camada de origem. A camada passa a espelhar máquinas, estados e transições da origem (ids próprios, referências remapeadas) e guarda as próprias motions por estado; peso, máscara e composição continuam da própria camada. Editar a estrutura na cópia é recusado com aviso na barra de estado: edite na origem e a cópia acompanha. Arquivo do Animator na versão 6; recurso \`.aeanimator\` na versão 4.

## Play: carregar e IK de dois ossos

- O **Sistema de interação** não deixa mais a pelve cair e voltar num quadro quando a mão animada cruza a borda do alcance: o agachamento cai em rampa entre 80% e 100% do alcance horizontal e o corpo move no máximo 2 m/s. Inclinação e agachamento medem o braço na pose animada do quadro.
- **Dois ossos sem polo:** com a cadeia quase reta, o lado da dobra vem do repouso no referencial do osso raiz; a pose animada continua mandando quando dobra de verdade.
- Receitas de **Criar › Personagem** aplicadas num projeto ficam nele até serem removidas; três solvers no mesmo punho por cima de um clipe é o que faz a animação "quebrar". Remova sobras pelo menu do objeto.

## Clipes Humanoid da Unity

A conversão músculos → ossos encaixa a orientação do Avatar no eixo, coloca o quadril pelo centro de massa medido no esqueleto do próprio personagem e normaliza o corpo pela pose em T. Contra o projeto UMotion original do Kyle, o erro médio das mãos cai de 15–16 cm para 6,7–7,2 cm e o dos pés de 29 cm para 7 cm; resta ≈5 cm de deslocamento vertical constante. Clipes com **Bake Into Pose** deixam de ser recusados e o **Offset** de rotação da raiz é aplicado ao corpo; Loop Pose, Mirror, Level e Cycle Offset continuam recusados com aviso.

## Pacotes POLYGON e BoZo

**Caminho:** **Importar** (barra superior) → **Pasta de pacote** → escolha a pasta no seletor do Android. A Biblioteca abre no pacote com o trilho de tipos.

- **POLYGON Icons (Synty):** o FBX cita o PSD do atlas, que o pacote não traz; o editor usa a primeira imagem exportada com o mesmo radical (\`…_01_A.png\`) e o ícone entra texturizado com **Na cena**.
- **BoZo 2.2:** \`BodyRig.fbx\` tem skin com mais de quatro influências: na aba **Perfil** (página 3/3) troque "Recusar perda" por "Reduzir a 4" e toque **Preparar** antes de **Na cena**. Com o BodyRig selecionado, acione \`BMAC_M_Idle.anim\` na Biblioteca: o clipe Humanoid converte e abre no estúdio. Roupas modulares, shaders estilizados e expressões ficam fora desta prévia.

## Limites desta prévia

- **Exportar APK** continua experimental.
- Blend Tree aninhada e Sync timing do Animator não entram; a conversão Humanoid mantém ≈5 cm de deslocamento vertical constante.
- Sem garantia para todo aparelho ou cena; sem medição sustentada de desempenho; páginas de memória de 16 KB não suportadas.
`
}, {
  route:'versoes/preview-0-3-1', title:'Astra 0.3.1: estúdio de animação v2, Criar › Personagem e Biblioteca como gerenciador',
  description:'Como usar o estúdio v2 (posar por padrão, chave por canal, chaves-mestras), as receitas de Criar › Personagem, o Importar universal e a Biblioteca incluídos no APK 0.3.1.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-16',appRelease:'0.3.1-preview.20261016',runtimeVerified:true,prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK 0.3.1-preview.20261016, versionCode 29**, gerado da main no commit **02744aa9**, sem alterações locais. [Download](/download/).

A atualização instala por cima da Astra 0.3.0 com a mesma chave e preserva os projetos. O [catálogo de 16/10](/pt-br/snapshot-2026-10-16/componentes/) acompanha este APK; os recortes de 09/10, 07/10 e 06/10 continuam publicados.

## Estúdio de animação v2

**Caminho:** menu do objeto (⋮ na Hierarquia ou toque longo) → **Animar**. O estúdio abre posando, com auto-key ligado e o personagem enquadrado.

- **Painel do osso (direita):** Posição, Rotação e Escala com X, Y, Z editáveis e um botão de chave por canal (cheio = chave neste tempo; contorno = canal animado; apagado = sem canal, tocar cria o canal e grava). Abaixo, a grade de ferramentas: Auto-key, Espelhar, Copiar, Colar, Repouso, Fantasma, Ossos, IK, Fixar, Camada, Seleção, Guardar pose.
- **Timeline:** a metade de baixo da régua é a linha de chaves-mestras — um losango por quadro com chave em qualquer trilha. Tocar seleciona o quadro inteiro e leva o cursor; arrastar move todas as chaves do quadro com um único Desfazer; tocar onde não há chave vale como scrub. Toque longo numa chave abre o menu da chave (Tempo, Valor, Tangente, Curva, Copiar, Recortar, Excluir). Pinça faz zoom da régua.
- **Menu ⋮ do estúdio:** Parar de posar, Novo clipe (quaternion, Euler ou progressivo), Renomear, Duração, Camadas, Curvas, Eventos e marcadores, Rig, Assistente de IK, IK permanente nesta ponta, Root motion, Bake da pose final, Exportar GLB.
- **Campos numéricos:** tocar um valor abre o teclado; o valor confirmado grava a chave quando o auto-key está ligado.

## Criar › Personagem

**Caminho:** **+** da Hierarquia (ou menu Criar) → **Personagem**, com um personagem selecionado (ou o único esqueleto da cena). Cada receita cria componentes e alvos de uma vez e é um único Desfazer:

- **Olhar para alvo:** LookAt na cabeça com um alvo 2 m à frente do personagem.
- **Mirar com as mãos:** Aim em cada mão com um alvo 1,5 m à frente.
- **Mãos ao alvo:** IK de dois ossos em cada mão, com o alvo onde ela está.
- **Pés no chão:** Apoio do pé por pé e Grounder com a pelve.
- **Corpo inteiro:** pelve, peito e até quatro pontas com alvos.
- **Carregar caixa:** mesa, caixa com pegadas e sistema de interação; dê Play.

Os ossos são reconhecidos pelo nome (inglês e português) ou pela estrutura do esqueleto; alvos criados pelas receitas nunca são tomados por ossos. Uma receita já aplicada responde "Já montado neste personagem".

## Importar universal e Biblioteca

- O botão **Importar** da barra superior abre o menu com Modelo (GLB, FBX), Pasta de pacote, Textura, Ambiente (HDRI) e Áudio.
- **Cena → Biblioteca de pacotes:** trilho de tipos com contagem, cartões com selo (pronto, a converter, aviso) e painel de detalhe com Abrir, Instanciar, Vincular e Reimportar. **Cena → Malhas do projeto** abre a Biblioteca no trilho **Projeto**, com "Na cena" no cartão. Um modelo que a cena referencia sem registro em \`.astra/assets.astra\` aparece como cartão de aviso com o diagnóstico.

## Interface universal e Final IK

- Menu **Cena** como menu de contexto, barra superior só de ícones, Inspector em coluna rolável de cartões.
- Bloco de interação do Final IK: pegada com pivô, gatilho de interação (eventos \`entered\` e \`left\`), olhar enquanto alcança e limite de torção no cone.
- Clipes Humanoid da Unity convertidos para rotações de ossos pelo Avatar do modelo.

## Limites desta prévia

- **Exportar APK** (botão nos projetos) chega como experimental: identidade, chave e exportação pelo seletor de arquivos do sistema não foram concluídos de ponta a ponta no aparelho.
- BoZo (personagens modulares), galeria POLYGON e Blend 2D direcional do Animator ficam para prévias seguintes.
- Sem garantia para todo aparelho ou cena; sem medição sustentada de desempenho; páginas de memória de 16 KB não suportadas.
`
}, {
  route:'versoes/preview-0-3-0', title:'Astra 0.3.0: navegação, Animation Studio e Animator ampliado',
  description:'Como usar a navegação nova (malha, agentes, obstáculos e links), o Animation Studio e as ampliações do Animator incluídos no APK 0.3.0.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-09',appRelease:'0.3.0-preview.20261009',runtimeVerified:true,prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK 0.3.0-preview.20261009, versionCode 28**, gerado da main no commit **a868c8ac**, sem alterações locais. [Download](/download/) · [Registro da atualização](/atualizacoes/#2026-10-09-apk-preview-0-3-0).

A atualização instala por cima da Astra pública anterior, com a mesma chave, e preserva os projetos. Projetos salvos com os componentes novos podem não abrir em versões antigas: guarde uma cópia antes de testar.

O [catálogo de 09/10](/pt-br/snapshot-2026-10-09/componentes/) acompanha este APK, com 68 componentes e a família Navegação. [Novas fichas e mudanças](/pt-br/snapshot-2026-10-09/componentes/novidades/). O catálogo de 07/10 (APK 0.2.3) e o de 06/10 continuam nos seus endereços. A Astra segue uma prévia limitada; esta versão não anuncia a engine completa.

## Navegação

**Caminho:** + → **Navegação → Superfície**. Selecione a Superfície e toque **Assar** na Inspeção: os colisores estáticos viram uma malha (polígonos verdes no viewport) salva em \`Navegação/<nome>.navmesh\`. Depois selecione um alvo e crie **+ → Navegação → Agente perseguidor**; em Play ele contorna as paredes até a distância de parada.

- **Agente:** move Personagem e Motor dinâmico pela posse de controle (fonte IA), corpo pela velocidade ou a própria pose; Seguir objeto, desvio de agentes, frenagem e áreas.
- **Obstáculo:** recorta a malha no Play; **Link:** liga vãos e saltos; **Modificador:** muda a área ou tira objetos do bake.
- **Scripts:** \`SetDestination\`, \`Stop\`, \`Resume\`, \`Warp\`, \`RemainingDistance\`, \`PathStatus\` e os eventos de chegada, falha e link.

[Guia completo da navegação](/pt-br/snapshot-2026-10-09/sistemas/navegacao/).

## Animation Studio e Animator

O que estava no canal de desenvolvimento entra no APK público:

- [Workspace universal do Animator](/pt-br/snapshot-2026-10-07/sistemas/animator-universal/), [controllers reutilizáveis e overrides](/pt-br/snapshot-2026-10-07/sistemas/animator-controllers/), [camadas aditivas](/pt-br/snapshot-2026-10-07/sistemas/animator-aditivo/) e [grupos com interrupção](/pt-br/snapshot-2026-10-07/sistemas/animator-hierarquia/).
- [Clipes editáveis, curvas, bake, camadas e consolidação](/pt-br/snapshot-2026-10-07/sistemas/animation-clips/), também pela API C# de autoria.

## Correções

- A folha **Criar** abre com uma receita selecionada, com o destino (raiz ou filho) visível.
- Pulo e movimento diretos do editor não disputam mais com scripts.
- Primitivas criadas por script sob Personagem, corpo móvel ou Agente nascem só visuais (antes o Play podia parar).
- Preenchimentos da interface (malha de navegação, nós de grupo do Animator) aparecem.

## Evidências e limites

Build, assinatura (mesmo certificado das prévias) e integridade foram conferidos. No POCO F7 com Android 16, este APK atualizou a Astra anterior sem apagar projetos e, dentro do pacote público, assou a malha pela Inspeção e passou 7/7 verificações de navegação em Play. A mesma biblioteca nativa passou no canal Astra Dev com reabertura a frio. Host: suíte nativa 1527/1527 e C# 523/0. Links e obstáculos em movimento foram validados no host. Sem garantia para todo aparelho ou cena e sem medição de desempenho sustentado. Inclui Recast/Detour 1.6.0 (licença zlib).

${link('comece/ajuda-por-sintoma','Como relatar um problema')} · ${link('comece/indice','Trilha do zero')} · [Discord oficial](https://discord.gg/KpqnBvt4uG).
`
}, {
  route:'versoes/preview-0-2-3', title:'Astra 0.2.3: câmera virtual, mixer de áudio e Animator',
  description:'Como usar a câmera virtual, o mixer de áudio com efeitos e snapshots e o Animator com editor de grafo, incluídos no APK 0.2.3.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-07',appRelease:'0.2.3-preview.20261007',runtimeVerified:true,prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK 0.2.3-preview.20261007, versionCode 12**, gerado da main no commit **af1d9981**, sem alterações locais. [Download](/download/) · [Registro da atualização](/atualizacoes/#2026-10-07-apk-preview-0-2-3).

A atualização instala por cima da Astra pública anterior, com a mesma chave, e preserva os projetos. Projetos salvos com os componentes novos podem não abrir em versões antigas: guarde uma cópia antes de testar.

O [catálogo de 07/10](/pt-br/snapshot-2026-10-07/componentes/) agora acompanha este APK: os componentes abaixo têm fichas próprias com campos, caminhos e exemplos. O catálogo de 06/10 permanece como histórico. [Novas fichas e mudanças](/pt-br/snapshot-2026-10-07/componentes/novidades/). A Astra segue uma prévia limitada; esta versão não anuncia a engine completa.

## Câmera virtual e Cérebro

**Caminho:** Hierarquia → selecione o personagem → **+ → Básicos → Câmera virtual**. A câmera nasce em órbita sobre o objeto selecionado, com mira e desvio de paredes. Se a cena ainda não tiver um Cérebro, ele entra na câmera da cena no mesmo passo de desfazer.

- **Prioridade:** a câmera virtual ativa de maior prioridade fica ao vivo. Para trocar de câmera, aumente a prioridade de outra (por script ou Conexão de evento).
- **Posição:** Fixa, Seguir (deslocamento com amortecimento) ou Órbita (ângulos e raio; o gesto de olhar gira enquanto ela está ao vivo).
- **Rotação:** Fixa, Olhar para o alvo ou Rotação do alvo.
- **Colisão:** "Evitar obstáculos" aproxima a câmera quando uma parede fica entre ela e o alvo.
- **Cérebro:** fica na câmera do jogo e mistura pose e lente na troca (Corte, Suave, Linear e variações).

No Play, o cartão da câmera na Inspeção mostra **Ao vivo** ou **Em espera**; o do Cérebro mostra a câmera ao vivo e a barra da transição.

## Mixer de áudio

Cada **Bus de áudio** processa o som das fontes ligadas a ele. Os efeitos ficam no mesmo objeto do bus e agem na ordem dos componentes:

| Componente | Para que serve |
| --- | --- |
| Filtro de áudio | Passa-baixa abafa (porta fechada, embaixo d'água); passa-alta afina (rádio, telefone); também pico e prateleiras |
| Eco | Repetições atrasadas com realimentação |
| Reverberação | Sala simulada (tamanho, amortecimento, pré-atraso, mistura) |
| Compressor | Controla picos; com **Sidechain** em outro bus, abaixa a música quando aquele bus soa (ducking) |
| Envio de áudio | Copia o som daquele ponto para outro bus, por exemplo um bus só com reverberação |
| Snapshot de mixer | Leva até 8 valores (ganho, corte do filtro, mistura de reverb…) a novos valores com transição |

**Experimente o ducking:** + → Áudio → **Bus com ducking** (escolha o bus de falas no seletor que abre), outro **Bus de áudio** para falas, e ligue cada Fonte de áudio ao seu bus. Em Play, o cartão do Compressor mostra quantos dB está reduzindo e o do bus mostra o nível.

Na **Fonte de áudio**: Mistura espacial (0 = 2D, 1 = 3D), Prioridade (0 é a mais importante; acima de 32 vozes as menos importantes ficam virtuais e voltam do ponto certo), Início/Fim do loop e Carregamento **Streaming** para músicas longas. WAV acima de cerca de 43 s é importado como streaming; salve a cena depois de importar.

Scripts: \`AudioBus.PeakDb()\`, \`AudioCompressor.ReductionDb()\`, \`AudioSnapshot.TransitionTo(segundos)\` e \`AudioSource.IsVirtual()\`.

## Animator

Para personagens importados com animações (glTF). **Caminho:** selecione a raiz do modelo → Componentes → Adicionar componente → família **Animação** → **Animator** (remova a Animação legada antes; os dois não ficam no mesmo objeto). Depois, no cartão do Animator, toque **Abrir grafo do Animator**.

No grafo:

1. **Parâmetros** (coluna esquerda): + Float, + Int, + Bool ou + Gatilho. Toque no nome para renomear e no valor para mudar o padrão.
2. **Estados:** + Estado cria no centro da vista; arraste para organizar. Na direita, escolha o tipo: Clipe, Mistura 1D (clipes por limiar de um parâmetro, por exemplo Parado 0, Andar 1, Correr 2 pela Velocidade) ou Mistura 2D (clipes em pontos X/Y). **Padrão** define o estado inicial.
3. **Transições:** toque **Transição**, depois o estado de origem (ou **Qualquer estado**) e o de destino. Na direita: tempo de saída, duração e condições (por exemplo, Velocidade Maior que 0,5; ou o gatilho Pular).
4. **Camadas:** + camada sobrepõe outra máquina, com peso e máscara (só uma parte da hierarquia, como o tronco).
5. **Eventos:** num estado, + evento marca um tempo (0 a 1) e um número que chega ao script.

Tudo pode ser desfeito. No Play, o grafo mostra o estado vivo com a barra de tempo e os valores dos parâmetros, só para leitura.

\`\`\`csharp
var animator = Object.Animator();
animator.SetFloat("Velocidade", 1.5f);
if (pulou) animator.SetTrigger("Pular");
var estado = animator.GetCurrentState();   // estado.Name, estado.IsInTransition
\`\`\`

Nome de parâmetro ou tipo errado lança \`WorldException\`. Pendentes: sub-máquinas de estado, interrupção de transição, camadas aditivas e root motion.

## Evidências e limites

Build, assinatura (mesmo certificado das prévias) e integridade foram conferidos. No POCO F7 com Android 16, este APK atualizou a Astra anterior sem apagar projetos e executou o aceite da câmera virtual. Mixer de áudio e Animator foram aceitos na instalação Astra Dev com a mesma biblioteca nativa deste APK. Não há garantia para todo aparelho ou cena, nem medição de desempenho sustentado. Áudio só em WAV.

${link('comece/ajuda-por-sintoma','Como relatar um problema')} · ${link('comece/indice','Trilha do zero')} · [Discord oficial](https://discord.gg/KpqnBvt4uG).
`
}, {
  route:'versoes/preview-2026-10-07', title:'Prévia de 07/10/2026: mudanças e primeiros usos',
  description:'Onde encontrar os novos tweens, consultas físicas, materiais e ferramentas de autoria desta distribuição.',
  options:{kind:'release',status:'source-reviewed',front:{reviewedAt:'2026-10-07',appRelease:'0.2.1-preview.20261007',prev:false,next:false}},
  body:`
## Versão e recorte

Este capítulo acompanha o **APK 0.2.1-preview.20261007, versionCode 6**, gerado da main no commit **09bd7349**, sem alterações locais de comportamento da engine. [Download](/download/) · [Registro da atualização](/atualizacoes/#2026-10-07-apk-preview).

Este capítulo é histórico do **APK 0.2.1**. Os componentes novos não constam do catálogo de 06/10; agora têm fichas no [catálogo de 07/10 para o APK 0.2.3](/pt-br/snapshot-2026-10-07/componentes/). Consulte aquele recorte para os contratos atuais; ele não converte a API 0.2.1 em API 0.2.3.

A Astra permanece uma prévia limitada e incompleta, com cerca de 20% da meta global declarada. Esta distribuição não anuncia conclusão da engine ou paridade integral com outras engines.

## Atualização e projetos existentes

Faça uma cópia recuperável do projeto inteiro. A chave é a mesma da prévia pública anterior e o versionCode aumenta, permitindo atualização por cima daquele pacote. Instalações de desenvolvimento com outra assinatura podem continuar exigindo reinstalação; preserve dados antes de remover o aplicativo.

Projetos gravados com componentes/payloads novos podem não abrir na versão antiga. Conserve a cópia anterior; downgrade não substitui desfazer ou backup.

## Sequência de tweens: duas ações, uma depois da outra

**Caminho:** Hierarquia → objeto controlador → Inspector → Componentes → Adicionar componente (+) → **Lógica → Tempo → Sequência de tweens**.

Configure primeiro Transform Tween ou Tween de propriedade nos objetos alvos. Depois escolha esses objetos nas etapas da sequência. Ela coordena consumidores existentes; não cria os tweens automaticamente.

| Campo | Como usar | Efeito |
| --- | --- | --- |
| Etapa 1…8 | Escolha um objeto com tween persistente | A sequência reinicia os tweens desse objeto |
| Etapa N junto da anterior | Desligado para sequência; ligado para paralelo | Começa no mesmo grupo da anterior |
| Intervalo da etapa | Espera em segundos | Soma-se à espera do próprio tween |
| Repetição | Percursos da lista inteira | Não substitui a repetição de cada tween |
| Iniciar no Play / Ativo | Ligue no primeiro exercício | A lista começa ao executar |

**Experimente:** crie duas caixas alongadas, cada uma com Transform Tween de rotação Y até 90°, duração 2 s, Girar ligado e Mover/Escalar desligados. Escolha A na Etapa 1 e B na Etapa 2. Sem “junto da anterior”, A deve terminar antes de B começar. Pare, ligue essa opção e repita para comparar o grupo em paralelo.

Um tween infinito impede terminar a etapa. Evite outro script cancelando/reiniciando os mesmos tweens. A etapa seguinte começa no quadro seguinte ao término do grupo, sem garantia de reaproveitar o restante daquele intervalo. A fachada TweenSequence fornece Play, Cancel, Pause, Resume e Step, além de OnStepStarted e OnCompleted. A Conexão de evento também oferece os comandos persistentes.

## Tween de propriedade: animar um campo

**Caminho:** objeto → Inspector → Componentes → Adicionar componente → **Lógica → Tempo → Tween de propriedade**.

Escolha o alvo (vazio usa o próprio objeto), componente e propriedade no seletor. Somente propriedades numéricas marcadas como interpoláveis são elegíveis: não equivale a animar qualquer recurso, string, enum ou booleano.

Configure Destino, Duração, Espera, Curva, repetição e ida/volta. O destino usa a unidade do campo escolhido. Destino relativo soma ao valor inicial; desligado, é o valor final. A escrita mantém a validação do campo; não contorna limites.

O componente é repetível e pode participar de sequências. Isso não resolve conflitos entre dois consumidores escrevendo a mesma propriedade. Comece com um só tween por campo e confira o resultado no Play. Reinício, cancelamento, pausa, retomada e tempo decorrido são operações da fachada PropertyTween.

## Raio, Varredura de forma e Braço de mola

**Caminho:** objeto → Inspector → Componentes → Adicionar componente → **Física 3D → Consultas**.

| Função | Para que serve | Configuração essencial |
| --- | --- | --- |
| Raio | Encontrar o primeiro obstáculo numa direção | Alvo local X/Y/Z define direção e alcance; confira filtros |
| Varredura de forma | Testar deslocamento de um volume | Forma, dimensões e alvo local; retorna o primeiro acerto |
| Braço de mola | Manter filhos, como uma câmera, antes de obstáculos | Comprimento em +Z local, margem e raio de esfera |

**Experimente o Raio:** tenha chão com composição física e um objeto de consulta dois metros acima, com orientação local alinhada ao mundo. Use alvo local 0 / −3 / 0. No Play, o resultado deve atingir o chão se o filtro o incluir. Chão apenas visual não garante acerto físico.

O padrão do Raio aponta para 0 / −1 / 0 local; girar o objeto gira essa direção. Excluir próprio corpo, inclusão de sensores/tipos de corpo e camada podem explicar “Sem acerto”. A depuração ajuda no editor; o Inspector mostra o resultado em execução.

No Braço de mola, a câmera deve ser filha. Ele altera a pose dos filhos quando não há outro sistema com autoridade sobre ela; resolva conflitos com um seguidor/controlador concorrente. Raio da esfera zero usa raio; maior que zero varre volume esférico para ajudar nas quinas.

As consultas atualizam no Play após a física. Raio e Varredura têm atualização imediata pelo método próprio ou pela Conexão de evento. Não há mundo físico fictício fora do avaliador válido. Varredura não retorna todos os overlaps; regras que exigem vários resultados precisam da API correspondente.

## Material físico por corpo e por forma

**Caminho:** objeto com Corpo físico → Inspector → componente → seletor de material físico → **Criar material com os valores deste corpo**. Com recurso atribuído, a ação permite atualizá-lo. O arquivo .physmat também abre em Propriedades pelo navegador de arquivos.

Atrito e restituição mudam o contato; superfície fornece informação para regras como som de passos. Material físico e material visual são diferentes: mudar cor não muda atrito.

Os modos de combinação são padrão do motor, média, mínimo, multiplicar e máximo. A precedência do modo participa do resultado de um par. Ambos no padrão conservam a combinação do motor.

No Colisor 3D, material próprio diferencia formas de um corpo composto; desligado, a forma usa o material do corpo. Alterar um recurso compartilhado pode afetar vários consumidores: confira usuários nas Propriedades antes de editar.

## Sensores, juntas e corpo físico

No Corpo físico, sensores ganharam **Monitorar** e **Detectável por sensores**. Monitorar desligado impede publicar eventos daquele sensor; a detectabilidade participa do filtro do outro sensor. Permanência no Colisor é entregue por par, no máximo uma vez por quadro, mesmo com vários passos físicos.

Na Junta, **Quebra** expõe força e torque; zero conserva o comportamento de não quebrar. Ultrapassar o limite retira a restrição do solver e publica o evento. O componente autoral permanece, e a quebra de runtime não se transforma automaticamente em exclusão permanente na cena.

Personagem ganhou evento de colisão com objeto, ponto e normal dos contatos sólidos após movimento. Não é entrada de sensor. Na Conexão de evento, configure emissor, evento, receptor e ação; adicionar a conexão não define sozinho a regra do jogo.

Centro de massa, inércia e interpolação acrescentam controle sobre simulação e apresentação da pose. Comece com os valores padrão/calculados e altere uma variável por vez. Interpolação visual não aumenta a frequência do solver; centro de massa deslocado muda a resposta à rotação, não a malha desenhada.

## Autoria física e regeneração de colisão

**Caminho:** ações do objeto → **Configurar locomoção → Decompor → Fontes/Ajustes → Gerar → Revisar → Aplicar**. Escolha fontes antes de gerar; prévia não é colisão aplicada.

Geometria base, pose atual e amostragem do clipe têm papéis diferentes. O instante é editável no modo do clipe. A colisão gerada é captura estática, não acompanhamento contínuo da animação.

Limites: até 100 mil triângulos, 128 fontes, 32 partes, 64 vértices por casco e 400 mil voxels. Recursos ausentes, geometria inválida, resultado desatualizado e conflitos podem impedir aplicar. Prazo cooperativo não é garantia de tempo real: uma fase interna pode ultrapassá-lo antes de devolver controle.

Na regeneração, revise correspondência e edições locais antes de aplicar. O fluxo mantém visual separado da autoridade física, receita persistente, integração com prefab e conservação de momento na reconstrução do mesmo corpo, dentro do contrato implementado.

## Evidências e primeiro uso

Build, assinatura, manifesto e integridade são conferidos para esta distribuição. Registros físicos anteriores da main usaram outros hashes de APK: **não representam aceite em aparelho deste novo pacote assinado**. Esta publicação não inclui nova instalação/campanha física no aparelho.

Comece em uma cópia pequena e confira edição → Play → Stop → salvar → reabrir. ${link('comece/ajuda-por-sintoma','Como relatar um problema')} · ${link('comece/indice','Trilha do zero')} · [Discord oficial](https://discord.gg/KpqnBvt4uG).
`
}];
