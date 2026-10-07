import { page, link, api, component, roadmap } from './workflow-guide-tools.mjs';
import { exampleCode } from './workflow-examples.mjs';
const p = (slug, title, description, body, order) => page('sistemas', slug, title, description, body, order);
export const systemPages = [
p('indice', 'Sistemas: monte um resultado funcional', 'Escolha uma montagem, encontre os componentes e siga até a execução.', `
## Escolha pelo que o jogo precisa fazer

| Resultado | Montagem principal | Capítulo |
|---|---|---|
| Responder ao manche/tecla | Ação + vínculo + Behavior | ${link('sistemas/input-e-acoes', 'Input e ações')} |
| Mostrar o jogo pela câmera correta | Câmera + pose + lente + prioridade | ${link('sistemas/cameras', 'Câmeras')} |
| Exibir um modelo com aparência coerente | Malha + materiais + luz/ambiente | ${link('sistemas/renderizacao', 'Renderização')} · ${link('sistemas/materiais', 'Materiais')} |
| Importar um personagem animado | GLB + recursos + instância + clipes | ${link('sistemas/importacao-glb', 'Importação GLB')} · ${link('sistemas/animacao', 'Animação')} |
| Fazer uma caixa cair no piso | Dois corpos + formas + filtros | ${link('sistemas/fisica-3d', 'Física 3D')} |
| Fazer uma peça cair no plano XY | Corpo 2D + Colisor 2D | ${link('sistemas/fisica-2d', 'Física 2D')} |
| Mover um jogador por colisão | Character + input + geometria física | ${link('sistemas/personagem', 'Personagem')} |
| Prender/ligar peças físicas | Corpos + Junta | ${link('sistemas/juntas', 'Juntas')} |
| Criar vento, arrasto ou atração | Campo + volume + corpos elegíveis | ${link('sistemas/campos-fisicos', 'Campos físicos')} |
| Reproduzir som | WAV + Audio Source + saída apropriada | ${link('sistemas/audio', 'Áudio')} |
| Mostrar vida com corações | Canvas UI + .aeui + Image + Behavior | ${link('sistemas/ui-de-jogo', 'UI de jogo')} |
| Fazer objeto percorrer uma curva | Path + Path Follow | ${link('sistemas/curvas-e-caminhos', 'Caminhos')} |
| Fazer ação depois de um intervalo | Timer ou espera do Behavior | ${link('sistemas/timers', 'Timers')} · ${link('sistemas/corrotinas', 'Corrotinas')} |
| Animar um valor/transformação | Campo elegível + tween | ${link('sistemas/tweens', 'Tweens')} |
| Trocar fase e guardar progresso | Scenes + SaveStore | ${link('sistemas/troca-de-cena', 'Cenas')} · ${link('sistemas/persistencia', 'Persistência')} |
| Repetir uma sequência aleatória | RandomStream + seed + estado | ${link('sistemas/aleatoriedade', 'Aleatoriedade')} |

## Como usar uma montagem

Os capítulos informam caminho de criação, composição, campos relevantes, sequência e diagnóstico. Links de componente detalham propriedades individuais; links de API mostram assinaturas e retornos. O roadmap mostra lacunas da família sem inventar prazo para cada método.

Comece com um objeto e uma ação observável. Só acrescente outro sistema depois de entender qual deles publica a transformação, recebe input ou possui o recurso. Uma malha, um colisor e um elemento Image têm papéis diferentes; veja ${link('conceitos/composicao-de-componentes', 'composição com exemplos')}.

**Recorte:** engine e SDK de 06/10/2026, revisão editorial de 07/10. Compilação dos exemplos e execução em dispositivo são evidências separadas no ${link('ia/manifesto-de-exemplos', 'manifesto')}. O projeto permanece limitado e incompleto, com estimativa global de 20% da meta final.
`, -30),
p('input-e-acoes', 'Input e ações', 'Configure ação, vínculo e resposta, depois faça um objeto reagir ao controle.', `
## Onde configurar

**Cena → Configurações do projeto → Entrada**. O editor admite até **64 ações**. Selecione uma ação ou use **+ Ação**. As abas são **Ação**, **Vínculos** e **Resposta**.

| Aba | Campos | Para que servem |
|---|---|---|
| Ação | Nome, Tipo, Contexto | Identidade usada no C#; Botão/Eixo 1D/Eixo 2D; contexto vazio = sempre ativo |
| Ação, em eixos | Zona morta, Sensibilidade | Remover ruído e ajustar resposta |
| Ação | Papéis Mover/Olhar/Saltar | Associar às propriedades de conveniência de Input |
| Vínculos | + Vínculo, fonte, eixo, inversão, escala | Relacionar ação a manche touch, tecla, mouse ou gamepad |
| Resposta | Habilitada, grupos de dispositivo | Permitir processamento daquela ação e dispositivos |
| Resposta, em botão | Pressionar/Segurar/Tocar e durações | Escolher quando a ação é reconhecida |

Os padrões de projeto incluem **Mover** e **Olhar** como Eixo 2D e **Saltar** como Botão, vinculados aos controles touch. Confira os dados do seu projeto em vez de recriar ações duplicadas.

## Montar movimento visual

1. Selecione Mover e confira Eixo 2D, contexto e Habilitada.
2. Em Vínculos, confira **Manche touch**. Para outro dispositivo, acrescente um vínculo compatível e habilite seu grupo em Resposta.
3. Crie um objeto visual sem Body/Character/Path Follow e enquadre pela câmera de jogo.
4. Crie, compile e anexe o Behavior abaixo.
5. Entre em Play e devolva foco ao gameplay; mova o manche.

${exampleCode('input-move')}

O exemplo converte a ação em deslocamento no plano XZ a 2 m/s. Ele não é um controlador com colisão. Para esse resultado, use ${link('sistemas/personagem', 'Character')}.

## Sem resposta ou resposta repetida

Confira \`Input.Exists\`, nome exato, tipo, contexto habilitado, grupos de dispositivos e foco capturado por modal/teclado/UI. Zero grupos habilitados significa nenhuma entrada daquele conjunto.

\`Pressed\` acompanha botão mantido; \`JustPressed\` é apropriado para uma ação uma vez na transição; \`Axis2\` lê eixo. Escolher Pressed para comprar item pode comprar a cada quadro. ${api('InputAccess')} detalha captura/rebinding e estado; ${roadmap('roadmap/objetos-e-scripts')} registra a família, sem prometer mapas de entrada completos de outras engines.
`),
p('cameras', 'Câmeras', 'Configure a câmera de gameplay, enquadre a cena e resolva uma tela vazia.', `
## Criar e acessar

**Hierarquia → objeto → Inspector → Add → Câmera → Projeção → Câmera.** A câmera do Viewport é de edição; esse componente define a câmera usada pelo jogo.

## Montagem mínima

1. Coloque um objeto visual em posição conhecida.
2. Crie um objeto de câmera e posicione/oriente para olhar esse alvo.
3. No grupo **Lente**, escolha **Perspectiva**, FOV vertical de 60°, plano próximo pequeno positivo e plano distante além do alvo.
4. No grupo **Saída**, habilite **Usar no Play** e confira prioridade caso existam outras câmeras.
5. Salve e entre em Play; compare o enquadramento com o esperado.

Use ${component('astra.camera')} para domínio e condições dos campos. A pose de edição não é transferida automaticamente para a câmera do jogo porque você orbitou o Viewport.

## Perspectiva ou ortográfica?

| Projeção | Campo principal | Uso inicial |
|---|---|---|
| Perspectiva | FOV vertical | Profundidade e perspectiva em cena 3D |
| Ortográfica | Meia-altura ortográfica | Escala visual sem redução pela distância |

Na ortográfica, meia-altura de 5 representa altura visível de 10 unidades, antes de considerar enquadramento/largura. Near/far continuam importantes. A razão de aspecto muda a largura; teste o destino real.

## Derivados: acompanhar e olhar

${component('astra.camera.follow')} acompanha uma referência de alvo; ${component('astra.camera.look')} controla orientação segundo sua composição. Abra as fichas e configure o alvo/offsets. Não escreva a mesma pose também em Update sem definir autoridade. Comece com câmera fixa e só depois acrescente acompanhamento.

## Se Play ficar vazio

Confira câmera habilitada, prioridade, direção, distância, recorte, objeto ativo, malha/recurso e camada/máscara aplicável. Enquadrar o alvo pela câmera do editor só prova que você o encontrou na autoria. ${link('diagnostico/camera-sem-imagem', 'Diagnóstico de câmera')}.

${api('GameViewAccess')} permite consultar o contexto de vista; ${roadmap('roadmap/camera-e-navegacao')} distingue capacidades atuais e evolução.
`),
p('renderizacao', 'Renderização', 'Rastreie objeto, malha, material, luz e câmera para entender uma imagem ausente.', `
## O caminho até a imagem

**Objeto ativo → recurso de geometria → Malha/Malha deformável → material → luz/ambiente → câmera → renderer.** Uma etapa ausente não se corrige adicionando outra opção visual sem relação com a causa.

**Acesso:** Hierarquia → objeto → Inspector → **Renderização → Geometria** para a malha. **Cena → Ambiente da cena** reúne configuração ambiental; câmera e luz têm componentes próprios.

## Cena de referência para começar

1. Crie uma geometria simples e material com cor reconhecível.
2. Garanta câmera de jogo enquadrando a peça.
3. Adicione uma luz adequada ou ambiente configurado.
4. Entre em Play e mantenha a mesma câmera enquanto altera uma variável.
5. Troque apenas o material ou geometria para localizar o que muda.

Se a cena já é complexa, use uma cópia com uma peça, uma câmera e uma luz. Isso separa resolução de recursos de custo/efeitos.

## Sintoma → investigação

| Sintoma | Conferir primeiro |
|---|---|
| Nada visível | Câmera, objeto ativo, geometria registrada e recorte |
| Superfície preta | Material, luz, ambiente, normal e orientação |
| Parte do modelo sumiu | Submalha/slot, material, faces e importação |
| Visual muda entre peças iguais | Recurso compartilhado versus override |
| Queda ao adicionar luzes | Orçamento de luz/sombra e custo da cena |
| Animação não deforma a malha | Malha deformável, esqueleto e clip compatível |

## Derivados e limites

${component('astra.render.lod_group')} tem seu contrato próprio; não significa geração automática universal de LOD para qualquer recurso. Ambiente, luzes e materiais precisam ser lidos em conjunto. Uma opção presente não comprova todos os modos do backend.

Use ${link('sistemas/materiais', 'materiais')}, ${link('sistemas/iluminacao', 'iluminação')}, ${link('sistemas/importacao-glb', 'importação')} e ${link('sistemas/animacao', 'animação')} conforme a etapa. O recorte possui orçamento de 8 luzes locais; ${link('roadmap/capacidades-do-renderer', 'capacidades do renderer')} e ${roadmap('roadmap/renderizacao-e-materiais')} mantêm as lacunas explícitas.

Para medir custo, compare mesma imagem, câmera e resolução em ${link('desempenho/como-medir', 'Como medir')}. FPS instantâneo não substitui desempenho sustentado no aparelho.
`),
p('iluminacao', 'Iluminação', 'Configure uma luz, observe alcance e sombra e diferencie emissão de iluminação.', `
## Onde criar

**Hierarquia → objeto → Inspector → Add → Luz → Luzes → Luz.** A orientação/posição do objeto tem efeito conforme o tipo. **Cena → Ambiente da cena** configura a contribuição ambiental; é outro consumidor.

## Testar uma luz pontual

1. Crie piso e caixa com material conhecido, mais câmera enquadrada.
2. Crie a Luz perto da caixa, sem colocá-la dentro da superfície.
3. Em **Emissão**, confira tipo **Pontual**, cor, intensidade e unidade.
4. Em **Volume**, ajuste alcance para cobrir a caixa e observe onde a influência termina.
5. Em **Sombra**, escolha um modo suportado e compare a mesma pose com a sombra desligada.
6. Mova a luz, salve e reabra; entre em Play para comparar a iluminação.

${component('astra.render.light')} detalha cada campo. As opções de unidade incluem **Interna (legada)** e modos físicos indicados pelo schema. Um número de intensidade copiado de outra unidade não conserva automaticamente o brilho.

## Escolher tipo e propriedade

| Intenção | Ajuste relevante |
|---|---|
| Lâmpada que irradia ao redor | Pontual, posição e alcance |
| Feixe direcionado | Tipo spot, orientação e cone disponíveis |
| Iluminação direcional | Tipo correspondente, direção e capacidade efetiva |
| Superfície parece acesa | Emissão do material; não cria necessariamente uma luz |
| Luz geral do cenário | Ambiente/HDRI/atmosfera conforme suporte |

## Por que a mudança parece não funcionar?

Confira câmera, material e normais; objeto fora do alcance; máscara/camadas; sombra solicitada versus backend; unidade escolhida; ambiente dominante. Altere uma variável por vez. Se a emissão da placa está clara, mas o chão continua escuro, acrescente uma luz real para a iluminação do chão quando esse for o objetivo.

## Orçamento e evolução

Este recorte limita luzes locais pontuais/spot a **8**. Não planeje centenas de luzes locais a partir da presença do componente. Sombras, atmosfera física e modos de qualidade têm limites próprios em ${link('roadmap/capacidades-do-renderer', 'capacidades do renderer')}.

Veja ${component('astra.render.environment')}, ${link('sistemas/materiais', 'materiais')} e ${roadmap('roadmap/renderizacao-e-materiais')}. O status da família é distinto de validação visual em cada GPU Android.
`),
p('materiais', 'Materiais', 'Configure aparência compartilhada e overrides sem modificar o alvo errado.', `
## Composição e acesso

Um material é recurso usado pelo componente de geometria. **Hierarquia → objeto → Inspector → Malha/Malha deformável → slot de material** encontra o consumidor. **Arquivos/Recursos importados → material** encontra o recurso.

## Montagem: duas peças com a mesma fonte

1. Instancie duas peças usando o mesmo material.
2. Selecione a primeira e identifique o slot realmente usado.
3. Edite a cor no recurso compartilhado e observe as duas peças.
4. Desfaça. Use o override da instância quando a intenção for diferenciar apenas uma peça.
5. Compare sob a mesma luz, salve e reabra.

O exercício revela o nível da escrita. Não crie cópias de recurso para toda variação antes de verificar as opções efetivas por instância.

## Relacionar campos ao resultado

Cor/fator e textura base atuam em conjunto. Rugosidade e metalicidade mudam resposta à luz; normal altera orientação aparente e depende de UV/tangentes adequados. Emissão controla contribuição emissiva e não garante iluminação indireta dos objetos próximos.

Para alfa, confira o modo de material e suporte do renderer. Transparência pode exigir ordenação e produzir custo/limitações diferentes de uma superfície opaca.

## Runtime e slots

${api('GameObject')} e as fachadas de geometria expõem operações de material conforme o tipo. Confirme assinatura, parte/slot e status antes de escrever. A API não usa necessariamente nomes ou contratos de Shader/Material da Unity.

${component('astra.render.mesh')} e ${component('astra.render.skinned_mesh')} descrevem campos numéricos e acesso especializado a recursos. Um slot ausente ou tipo de recurso incompatível precisa de correção de composição, não de um GUID aleatório.

## Diagnóstico e variantes

Se só parte da peça muda, confira submalha e slot. Se a textura some, confira resolução do recurso e UV. Se a superfície escurece ao mudar luz, investigue iluminação em vez de sobrescrever permanentemente a cor.

${link('editor/materiais-e-texturas', 'Passos no editor')} detalha a interação; ${link('sistemas/iluminacao', 'iluminação')} e ${link('sistemas/importacao-glb', 'GLB')} explicam dependências. ${roadmap('roadmap/renderizacao-e-materiais')} e ${link('roadmap/capacidades-do-renderer', 'renderer')} registram limites atuais.
`),
p('importacao-glb', 'Importação GLB', 'Prepare um modelo, aplique perfil e publique recurso ou instância sem ocultar lacunas.', `
## Onde começa e o que termina

**Arquivos → ícone de importar modelo → GLB → preparação → perfil → publicação.** O objetivo pode ser registrar conteúdo ou também colocar o modelo na cena. Não trate aceitar a extensão como prova de fidelidade integral ao aplicativo que exportou.

## Percurso completo

1. Preserve o GLB original e recursos externos que o exportador exige.
2. Abra a importação e leia diagnósticos de geometria, imagens, materiais e animação.
3. Revise o perfil; aplique alterações e aguarde a nova preparação.
4. Resolva associações ambíguas antes de publicar.
5. Escolha **Só recurso** ou **Na cena**.
6. Enquadre a instância, confira cada parte/material e salve.
7. Reabra e entre em Play. Para animação, configure o consumidor e clipes.

## Campos de perfil que alteram o resultado

| Campo/opção | Decisão |
|---|---|
| Normais: Importar/Calcular | Preservar autoria ou gerar orientação de superfície |
| Tangentes: Importar/Calcular | Dados necessários para normal mapping |
| Limite de textura: 256/512/1024/2048 | Qualidade e custo de memória do derivado |
| Compressão | Formato/derivado conforme suporte |
| Streaming/prioridade | Política de recurso e residência |
| Geração de LOD | Derivação quando disponível para a geometria |

**Aplicar** é necessário depois de mudar o perfil. O resultado preparado antes da mudança não comprova uso dos novos parâmetros. **Salvar como padrão do projeto** muda o ponto de partida de futuras importações; não é substituto para aplicar a importação atual.

## Reimportação e perda

**Pela ordem** reutiliza correspondência quando apropriada; **Como novos** trata identidades novas. Se o modelo mudou de estrutura, confira as referências existentes depois dessa escolha. Não elimine a fonte porque a primeira visualização apareceu.

Materiais, extensões, rig, animações e efeitos podem ter suporte diferente. Uma malha visual não cria colisão física. Uma animação reconhecida não cria esqueleto ausente.

Veja ${link('sistemas/animacao', 'clipes e skinning')}, ${link('sistemas/fisica-3d', 'formas físicas')} e ${link('diagnostico/asset-nao-encontrado', 'recurso ausente')}. ${roadmap('roadmap/renderizacao-e-materiais')} e ${link('roadmap/capacidades-do-renderer', 'capacidades')} delimitam a interpretação atual.
`),
p('fisica-3d', 'Física 3D', 'Monte piso e caixa, configure corpo e forma e acompanhe uma queda com contato.', `
## Componentes e caminho

**Inspector → Add → Física 3D → Corpos → Corpo físico** e **Formas → Colisor 3D**. A malha mostra a aparência; o colisor define o contato; o corpo define participação/movimento.

## Cenário: caixa caindo no piso

1. Crie \`Piso\` e adicione Body **Estático** + Colisor **Caixa**.
2. Use meias-dimensões, por exemplo X=5, Y=0,25 e Z=5, e ajuste a malha para o mesmo volume.
3. Crie \`Caixa\` acima do piso com Body e Colisor Caixa de meias-dimensões 0,5.
4. No Body da caixa, escolha **Dinâmico**, massa 1 kg e velocidade inicial zero.
5. Confira camadas e matriz de colisão em **Cena → Configurações do projeto → Camadas e colisão**.
6. Salve e entre em Play. Observe queda e repouso sobre o piso.

O padrão do Body 3D é **Estático**. Editar massa sem mudar o tipo não faz a caixa cair. Evite começar com colisores de malha complexos.

## Campos ligados ao comportamento

| Campo | Efeito |
|---|---|
| Movimento | Estático, Cinemático ou Dinâmico define a autoridade |
| Massa | Resposta dinâmica às forças/impulsos |
| Velocidade inicial | Estado inicial de movimento |
| Amortecimento | Redução de movimento segundo o contrato |
| Forma/dimensões/offset do colisor | Volume efetivo de contato |
| Sensor/trigger | Detecção sem o mesmo bloqueio de um contato sólido |
| Camadas/máscaras | Quais pares/consultas participam |

${component('astra.physics.body')} e ${component('astra.physics.collider')} detalham propriedades e condições. Um colisor pode participar do corpo compatível no objeto/ancestral segundo o contrato; não suponha uma malha independente como forma automática.

## Comandar por script

Para corpo dinâmico, use ${api('PhysicsBodyRuntime')} para força/impulso/estado, e ${api('PhysicsAccess')} para consultas. \`AddForceAtPosition\` exige força e ponto no mundo; uma força fora do centro pode também produzir rotação. Não use Translate como se fosse impulso.

## Se atravessar o piso

Confira forma, dimensão, pose, tipo do corpo, ativo, filtros e velocidade. Depois teste geometria complexa e modos necessários. Veja ${link('diagnostico/colisao-ausente', 'diagnóstico')}, ${link('sistemas/juntas', 'juntas')} e ${link('sistemas/campos-fisicos', 'campos')}. ${roadmap('roadmap/fisica-3d')} mantém limites/evidências por família.
`),
p('fisica-2d', 'Física 2D', 'Monte uma simulação no plano XY com formas e consultas da família 2D.', `
## Acesso e composição

**Inspector → Add → Física 2D → Corpos → Corpo 2D** e **Formas → Colisor 2D**. A família é separada de Body/Collider 3D. Um objeto visível numa câmera ortográfica não passa automaticamente a participar da física 2D.

## Caixa no plano XY

1. Crie um piso visual e adicione Corpo 2D **Estático** e Colisor 2D Caixa.
2. Ajuste meias-dimensões X/Y do piso.
3. Crie uma peça acima, no plano XY, com Corpo 2D **Dinâmico** e Colisor 2D Caixa.
4. Confira massa, **escala de gravidade**, velocidades X/Y e amortecimento.
5. Configure uma câmera que mostre esse plano e entre em Play.

O padrão de Corpo 2D é Dinâmico, diferente do Body 3D estático. Colisor 2D oferece **Caixa**, **Círculo** e **Cápsula Y** neste schema. Meia-dimensão 0,5 produz dimensão completa de 1.

## Campos úteis

| Ajuste | Quando usar |
|---|---|
| Escala de gravidade | Variar a resposta à gravidade sem mudar toda a cena |
| Rotação fixa | Impedir giro de uma peça que deve ficar ereta |
| Velocidade angular em graus | Estado angular inicial segundo unidade declarada |
| Fricção/restituição | Deslizamento e resposta de contato |
| Sensor | Zona de detecção sem contato sólido equivalente |

Abra ${component('astra.physics2d.body')} e ${component('astra.physics2d.collider')} para campos completos. Não copie unidade angular de uma chamada 3D para um campo 2D rotulado em graus.

## Script e diagnóstico

Use ${api('Physics2DAccess')} e ${api('Body2DAccess')} para a simulação 2D. Uma raycast 3D não encontra esses corpos por causa da aparência na tela. Se falhar, confira composição, planos, filtros e a API usada antes de mexer em massa.

Derivados incluem ${component('astra.physics2d.joint')}, força constante e campos 2D. Monte cada família no mundo correspondente. ${link('sistemas/juntas', 'Juntas')} e ${link('sistemas/campos-fisicos', 'campos')} ajudam a estender o cenário. ${roadmap('roadmap/fisica-2d')} registra suporte e lacunas.
`),
p('personagem', 'Personagem', 'Crie a raiz de colisão, configure cápsula e transforme input em intenção de movimento.', `
## Escolha a montagem

**Inspector → Add → Física 3D → Corpos → Personagem.** Character já controla cápsula e movimento. Ele conflita com Corpo físico, Colisor e Motor dinâmico no mesmo objeto.

Para uma malha selecionada compatível, o menu do Inspector oferece **Criar raiz Character…**. A ferramenta cria a raiz controladora e mantém a malha como filho visual; a confirmação descreve retirada de Body/Collider do visual e a aproximação por cápsula. Scripts antigos que acessavam Body precisam ser adaptados.

## Preparar um jogador

1. Crie a raiz \`Jogador\` com Character e uma malha como filho.
2. Em **Cápsula**, ajuste raio, meia-altura do cilindro e altura dos olhos.
3. Em **Locomoção**, configure velocidade e salto; em **Chão**, inclinação e degrau conforme a ficha.
4. Monte piso com composição física 3D e confira camadas.
5. Configure ações Mover/Saltar e anexe o comportamento controlador.
6. Observe movimento, contato, degrau, salto e estado de apoio em Play.

${component('astra.physics.character')} explica cada propriedade. Não use raio zero nem confunda meia-altura cilíndrica com altura total da cápsula.

## Chamadas de movimento

Dentro do Behavior, use o input da ação e um yaw em **radianos** para \`Object.MoveCharacter(input, yawRadians)\`. Para pulo, verifique \`Input.JustPressed("Saltar")\`, solicite \`Object.TryJumpCharacter()\` e trate seu retorno. \`ReadCharacterState()\` ajuda a inspecionar apoio e estado.

Esse é um controlador, não o exemplo Translate do capítulo de input. Não multiplique a intenção por delta sem conferir o contrato da chamada e não mova a raiz também por Path Follow ou Tween.

## Problemas e derivados

Se atravessa chão, confira geometria física/filtros. Se não pula, confira ação, transição e estado de apoio; uma solicitação recusada não significa callback ausente. Se o visual está deslocado, ajuste o filho visual e a cápsula conscientemente.

**Motor dinâmico** é outra composição para locomoção física; não o acumule com Character. Câmera acompanha a raiz e HUD pode ler o estado lógico/vida sem possuir a colisão.

Veja ${link('sistemas/cameras', 'câmera')}, ${link('ui/hud-coracoes', 'vida e HUD')} e ${api('CharacterRuntimeState')}. ${roadmap('roadmap/fisica-3d')} distingue validações e limitações.
`),
p('juntas', 'Juntas', 'Ligue dois corpos com âncoras coerentes antes de ajustar limites e motores.', `
## Onde criar e o que ligar

**Inspector → Add → Física 3D → Juntas → Junta.** O componente liga corpos, não duas malhas apenas visuais. Para 2D, use **Física 2D → Juntas → Junta 2D** e corpos da mesma família.

## Exemplo inicial: duas peças ligadas por distância

1. Prepare dois objetos com Corpo físico e formas simples; mantenha pelo menos a peça móvel como Dinâmico.
2. Posicione as peças perto da configuração que a restrição deve manter.
3. Adicione Junta no proprietário compatível e selecione **Distância**.
4. Atribua **corpo conectado** ao outro objeto com Body.
5. Configure as âncoras A/B em seus referenciais locais e a distância/limites apresentados para esse tipo.
6. Entre em Play e observe a relação. Só depois varie amortecimento, rigidez ou motor.

Confira ${component('astra.physics.joint')} para requisitos e campos condicionais. Uma âncora A local no corpo A não pode receber indiscriminadamente a posição mundial do corpo B.

## Tipos e derivados

O schema 3D expõe Ponto, Dobradiça, Deslizante, Distância, Fixa, Cone, SwingTwist, Configurável 6DOF e Mola. Cada tipo muda os controles relevantes: eixo, intervalo, motor e referências precisam ser interpretados pelo modo escolhido. A família 2D possui seu próprio conjunto, como revoluta, prismática e distância.

Não ajuste um motor de dobradiça antes de confirmar que o eixo e as âncoras produzem a articulação pretendida. Use uma montagem simples e valores moderados.

## Se explodir, tremer ou não restringir

Confira alvo com Body, tipo/mundo compatível, âncoras, escala, posição inicial e colisão entre as peças. Duas formas se penetrando e uma junta tentando manter pose incompatível podem gerar grande correção. Não esconda a causa aumentando amortecimento ao máximo.

## Scripts e estado

${api('Components.Joint')} e ${component('astra.physics2d.joint')} ligam ao contrato atual. Leitura de estado e comandos devem tratar lifetime/status. Remover o corpo conectado invalida a montagem; reprocesse a referência conscientemente.

Veja ${link('conceitos/espaco-local-e-mundo', 'referenciais')}, ${link('sistemas/fisica-3d', 'composição 3D')} e ${roadmap('roadmap/fisica-3d')}; a evolução 2D está em ${roadmap('roadmap/fisica-2d')}.
`),
p('campos-fisicos', 'Campos físicos', 'Configure volume e influência e observe apenas os corpos elegíveis.', `
## Acesso por família

**Inspector → Add → Física 3D → Campos** oferece gravidade, vento, arrasto e radial. **Física 2D → Campos** contém os equivalentes do mundo 2D. Força constante é outra montagem, ligada ao corpo; não é um volume espacial universal.

## Exemplo: região de arrasto

1. Monte uma caixa dinâmica com colisor e uma velocidade inicial observável.
2. Crie um objeto separado para ${component('astra.physics.field.drag')}.
3. Ajuste forma/tamanho/offset do volume para cobrir parte do percurso.
4. Configure intensidade e filtros nos campos realmente apresentados.
5. Entre em Play e compare a caixa dentro e fora da região.
6. Desative o campo e repita com o mesmo estado inicial.

Observe o centro e a escala do volume. Um campo distante do percurso pode estar funcionando sem atingir o alvo escolhido.

## Escolher a influência

| Componente | Objetivo | Cuidado |
|---|---|---|
| Campo de gravidade | Influência gravitacional regional | Ler modo de composição/prioridade quando exposto |
| Campo de vento | Influência direcional | Vetor e espaço devem coincidir com a intenção |
| Campo de arrasto | Resistência ao movimento | Não confundir com fricção de contato |
| Campo radial | Atração/repulsão a partir de região/centro | Sinal, alcance e corpo elegível |
| Força constante | Força/torque contínuos no proprietário | Distinguir vetor mundo de vetor local |

Consulte ${component('astra.physics.field.gravity')}, ${component('astra.physics.field.wind')}, ${component('astra.physics.field.radial')} e ${component('astra.physics.constant_force')}. Campos individuais têm condições, defaults e consumidores distintos; não compartilham necessariamente todas as mesmas opções.

## Se não influenciar

O alvo pode ser estático, estar fora do volume, ter filtro incompatível ou pertencer à física 2D enquanto o campo é 3D. Confira estado e retorno em ${api('PhysicsFieldRuntime')}. Teste um corpo isolado antes de introduzir várias influências sobrepostas.

Para zonas de dano, um trigger com evento e lógica de vida pode ser mais adequado do que um campo físico; ${link('ui/hud-coracoes', 'HUD com zona de dano')} mostra a separação.

${roadmap('roadmap/fisica-3d')} e ${roadmap('roadmap/fisica-2d')} delimitam suporte e validação.
`),
p('animacao', 'Animação', 'Associe clipes ao componente e reproduza a animação no alvo compatível.', `
## Onde preparar

Importe o modelo/clipes em **Arquivos → importar modelo**. No objeto que deve reproduzir, abra **Inspector → Add → Animação → Clipes → Animação**. Para deformação de malha, confirme também Malha deformável e esqueleto compatível.

## Reprodução mínima

1. Confira que a importação registrou o clipe desejado.
2. Adicione ${component('astra.animation')} e configure sua lista de clipes pelo controle de recursos.
3. Escolha o clipe padrão, habilite o componente e **reprodução automática** quando essa for a intenção.
4. Comece com velocidade 1 e um modo de repetição adequado.
5. Entre em Play; observe pose e avanço. Salve/reabra para conferir a associação autoral.

Ter o GUID de um clipe no projeto não equivale a incluí-lo na lista do componente. \`ClipNotInComponent\` aponta essa diferença.

## Controlar em C#

${api('AnimationPlayer')} recebe um \`Component\` de animação válido. A fachada permite \`Play()\`, \`Play(nome)\`, \`Stop\`, \`Rewind\`, \`CrossFade\` e consultas. Use nomes reais em \`ClipNames\`; \`ClipEntries\` conserva a identidade das entradas da coleção.

Adicionar/remover/mover clipes usa o contrato de coleção, não substituição cega por índice. \`SetClip(elementId, guid)\` aponta a entrada estável. Confira assinatura e estado antes de alterar durante execução.

## Campos e resultado

Velocidade altera ritmo; habilitado e autoplay controlam início/participação; modos como uma vez, repetir, ping-pong ou manter mudam comportamento no término. Mistura/crossfade exige clipes e alvo compatíveis, não cria rig inexistente.

## Quando o clip toca e nada se move

Confira alvo, canais reconhecidos, esqueleto, recurso de malha e lista do componente. Uma animação apenas de transform não implica skinning; uma malha sem ossos não ganha deformação por anexar Animation. Verifique se outro sistema escreve a mesma pose depois.

Veja ${link('sistemas/importacao-glb', 'importação')}, ${link('conceitos/autoridade-de-transformacao', 'autoridade')} e ${component('astra.render.skinned_mesh')}. ${roadmap('roadmap/animacao')} e ${link('roadmap/capacidades-do-renderer', 'skinning no renderer')} distinguem lacunas e evidência.
`),
p('audio', 'Áudio', 'Importe um WAV, vincule a fonte e diferencie voz parada, muda e fora de alcance.', `
## Caminho e dependências

**Arquivos → importar áudio WAV** registra o clipe. **Inspector → Add → Áudio → Reprodução → Audio Source** cria o consumidor. Audio Listener pertence à família Escuta; Audio Bus, ao Mixer.

## Primeiro som sem distância espacial

1. Importe um WAV pequeno e confirme o recurso.
2. Adicione ${component('astra.audio.source')} ao objeto ativo.
3. Atribua o clipe pelo seletor de recurso.
4. Configure **2D / estéreo**, volume 1, pitch 1, mudo desligado e playback **Tocar**.
5. Confira o bus, entre em Play e compare estado e som no dispositivo.
6. Experimente Pausar, retomar e parar; só depois acrescente spatialização.

Esse roteiro não constitui uma nova medição de saída de áudio desta publicação; estado da voz e som ouvido são evidências diferentes.

## Áudio 3D e mixagem

Para **3D / espacial**, confira ${component('astra.audio.listener')}, posição relativa, distância mínima/máxima e rolloff. Um som fora do alcance pode ter voz tocando e saída imperceptível. Cone, ganho e doppler também dependem dessa montagem.

${component('astra.audio.bus')} organiza ganho/mute/roteamento conforme contrato. Volume da fonte, bus e aparelho podem todos interferir; investigue um por vez.

## Comandos C#

Crie \`new AudioVoice(componente)\` com a referência válida de Audio Source. ${api('AudioVoice')} oferece \`Play\`, \`Pause\`, \`Resume\`, \`Stop\`, \`Seek(segundos)\` e \`Snapshot\`. Pausar não é terminar; retomar não é necessariamente reiniciar o clipe.

O componente/recurso deve continuar vivo. Uma voz guardada após Stop ou troca de cena precisa ser reconstruída no contexto apropriado.

## Se não houver som

Leia Snapshot: inválida, parada, pausada e encerrada são situações diferentes. Confira clipe, volume/mute, bus, listener/distância no modo 3D e saída do aparelho. Use uma fonte 2D simples para isolar distância antes de alterar o WAV.

${link('diagnostico/audio-sem-reproducao', 'Diagnóstico de áudio')} e ${roadmap('roadmap/audio')} registram caminhos e limitações.
`),
p('ui-de-jogo', 'UI de jogo', 'Encontre Image, Text e Button e monte um HUD que reage ao estado do jogador.', `
## O caminho de Image / UiImage

**Hierarquia → objeto HUD → Inspector → Add → Renderização → Interface → Canvas UI → atribuir Documento UI (.aeui).** A autoria dos elementos fica em **Cena → Interface (UI + ImGui)**.

**Image não fica no Add Component da cena.** É elemento do documento UI. No código, o tipo correspondente é \`GuiKind.Image\`; a instância é acessada por ${api('GuiElement')}. O nome “UiImage” usado informalmente não identifica um componente nativo separado.

## Montagem: três corações funcionais

1. Crie o Canvas UI e o documento.
2. Dentro do documento, monte container e três Images nomeadas Heart1, Heart2 e Heart3.
3. Importe/atribua imagens de coração cheio e vazio; ajuste layout, tamanho, anchors e tint conforme os campos do tutorial.
4. Anexe PlayerHealth ao Jogador e HeartHud ao objeto do Canvas.
5. Configure a referência Player no HUD.
6. Salve, compile e entre em Play; use dano/cura e observe quantidade de corações e texto.
7. Acrescente uma zona de trigger com o terceiro Behavior quando quiser ligar dano à cena física.

${link('ui/hud-coracoes', 'O tutorial completo')} contém árvore, campos, pacote .aeui/imagens, scripts e variantes. Ele também distingue demonstração por botão de dano por física.

## Documento autoral e instância runtime

\`Gui.ForCanvas(Object)\` escolhe o canvas do proprietário. \`TryFind\` localiza elementos daquela instância; \`Poll\` entrega eventos cujo Kind precisa ser interpretado. Alterar uma Image em Play não reescreve automaticamente o documento inicial.

A prévia **Interagir** testa interação do documento, mas não equivale a executar todo o C# do jogo. Para verificar dano/cura do Behavior, compile e entre em Play.

## Botão visível que não responde

Confira canvas, nome do elemento, enabled, sobreposição, foco, captura de input e consumo da fila. Uma superfície na frente pode receber o toque. Não leia todos os eventos como clique; compare o tipo.

${component('astra.ui.canvas')}, ${api('GuiAccess')} e ${link('ui/comece-aqui', 'guia de autoria')} detalham os derivados. ${roadmap('ui/roadmap', 'Roadmap UI')} informa o que está parcial/planejado, sem assumir paridade com UI de outras engines.
`),
p('curvas-e-caminhos', 'Curvas e caminhos', 'Autore um percurso e faça outro objeto segui-lo com velocidade ou duração.', `
## Dois componentes com papéis diferentes

**Inspector → Add → Lógica → Caminhos → Path** armazena a curva. **Path Follow** fica no objeto que percorre o caminho e referencia outro objeto com Path. Acrescentar Path a uma peça não inicia movimento automaticamente.

## Montagem inicial

1. Crie um objeto \`Percurso\` com ${component('astra.path')}.
2. No editor especializado do caminho, prepare pelo menos dois pontos distintos.
3. Selecione cada ponto e ajuste posição local, tangentes de entrada/saída e roll quando necessário.
4. Crie a peça móvel, adicione ${component('astra.path.follow')} e escolha Percurso como **Path alvo**.
5. Use modo **Velocidade mundial**, velocidade 1 m/s, offsets zero e reprodução automática ligada.
6. Entre em Play e observe o percurso. Depois teste **Duração do percurso**, por exemplo 5 segundos.

A tabela de Path detalha campos por ponto. Edite a entrada selecionada; um campo de ponto não é um valor único para toda a curva.

## Campos que mudam o movimento

| Campo | Efeito |
|---|---|
| Fechado em Path | Liga início e fim da geometria do percurso |
| Vetor Up e roll | Referência para orientação |
| Progresso/distância | Posição do seguidor ao longo do percurso |
| Velocidade ou duração | Escolhe como o tempo vira avanço |
| Backwards | Inverte sentido |
| Loop | Política de repetição do seguidor |
| Orient | Orienta o objeto conforme o percurso |
| Offsets | Desloca a pose publicada segundo contrato |

Fechar a geometria e repetir a execução são escolhas diferentes.

## API e conflitos

${api('CurvePath')} representa operações do caminho; ${api('PathFollower')} e ${api('Components.PathFollow')} oferecem controle/leitura do consumidor, como reinício, parada e progresso. Use a fachada compatível com a assinatura desta versão.

Não combine esse escritor com Body dinâmico ou Translate por frame sem definir autoridade. Se o objeto não anda, confira referência de alvo, pontos distintos, enabled/autoplay, modo e valor de velocidade/duração.

Veja ${link('conceitos/espaco-local-e-mundo', 'local/mundo')}, ${link('conceitos/autoridade-de-transformacao', 'pose')} e ${roadmap('roadmap/caminhos')}.
`),
p('timers', 'Timers', 'Configure intervalo e expiração para disparar ações sem depender de uma comparação por quadro.', `
## Acesso

**Inspector → Add → Lógica → Tempo → Timer**. A fachada C# do componente chama **GameTimer**; não procure uma classe instanciável chamada Timer por analogia com bibliotecas .NET.

## Exemplo sem script: alternar um objeto

1. Crie um objeto \`Relogio\` e outro \`Placa\` visível.
2. Adicione Timer ao Relogio.
3. Defina intervalo de 2 segundos, **AutoStart**, **Repeat** e **Enabled** ligados.
4. Em ação de expiração, escolha **Alternar objeto** e atribua Placa como alvo.
5. Salve e entre em Play. Observe a placa alternando seu estado a cada intervalo.
6. Pause/retome e compare a política de tempo escolhido.

Mantenha o relógio em outro objeto: desativar seu próprio dono pode interromper a participação que você esperava continuar.

## Campos e variantes

${component('astra.time.timer')} publica intervalo autoral de 0,05–3600 s e padrão de 1 s. Repeat desligado serve para expiração única; **IgnoreTimeScale** decide se a escala de tempo deve afetá-lo. Ação **Desconectado** permite reagir pelo script em vez de uma ação direta configurada.

## Callback e contagem

No Behavior, \`TimerElapsed(ulong timerInstanceId, uint count)\` identifica a instância e quantas expirações foram agregadas naquele quadro. Se o frame atrasou, count pode ser maior que 1. Para uma recompensa por tick, processe a contagem; não suponha que haverá uma chamada separada para cada expiração.

${api('Components.GameTimer')} recebe componente válido e oferece Start, Pause, Resume, Stop, Running e Remaining. \`OnElapsed\` vincula reação ao dono. Dois timers no mesmo objeto precisam ser distinguidos por instância, não apenas pelo nome do tipo.

## Se a ação não ocorrer

Confira dono ativo, componente habilitado, início solicitado, intervalo, escala de tempo, ação e alvo vivo. Não confunda expiração sem alvo configurado com timer que não conta.

Para uma sequência async do Behavior, veja ${link('sistemas/corrotinas', 'esperas')}; para transição contínua, ${link('sistemas/tweens', 'tweens')}. ${roadmap('roadmap/tempo-eventos-e-tweens')} registra o estado da família.
`),
p('tweens', 'Tweens', 'Configure uma transição autoral ou use um campo numérico elegível sem disputar escrita.', `
## Dois caminhos

**Autoria:** Inspector → Add → **Lógica → Tempo → Transform Tween**. **C# numérico:** campo marcado como tweenable → operação ${api('NumberTween')}. Um número editável não é automaticamente elegível para tween.

## Exemplo: placa subindo e descendo

1. Crie uma peça visual sem corpo dinâmico/Path Follow/constraint escrevendo a pose.
2. Adicione ${component('astra.tween.transform')}.
3. Habilite apenas a transição de **posição** e configure o destino Y pretendido; confira **Relative** para distinguir delta relativo de destino absoluto.
4. Use duração de 1 segundo, delay zero, easing Linear e autoplay ligado.
5. Comece com uma execução; depois teste PingPong e quantidade de loops.
6. Salve e observe em Play; Stop devolve a autoria.

Não use escala zero como destino de um objeto que ainda precisa de transformação invertível. Rotação, escala e posição têm flags próprias: preencher destino de escala sem habilitar sua transição não solicita esse efeito.

## Ler os campos juntos

| Campo | Decisão |
|---|---|
| Duração / delay | Quanto dura e quando começa |
| Relative | Destino relativo ou interpretação absoluta |
| Easing | Distribuição temporal da transição |
| Loops / PingPong | Repetição e ida/volta |
| IgnoreTimeScale | Resposta à escala de tempo |
| FinishedAction / Target | Ação configurada no fim |

## Tween numérico em C#

Consulte o membro elegível e a criação da operação na API. NumberTween pode pausar, retomar, cancelar e ser descartado. \`PropertyNotTweenable\` indica campo inelegível; \`PropertyAlreadyTweening\`, operação concorrente; \`PropertyWrittenExternally\`, escrita de outro consumidor.

Reiniciar a transição a cada Update pode impedir que ela termine. Crie a operação quando a ação começar e conserve apenas enquanto o dono estiver válido.

## Diagnóstico e alternativas

Confira enabled/autoplay, flags dos canais, destino, escala de tempo e autoridade. Um Body dinâmico requer movimento físico; uma animação com clipes precisa de Animation, não apenas de tween.

${link('sistemas/animacao', 'Animação')}, ${link('conceitos/autoridade-de-transformacao', 'autoridade')} e ${roadmap('roadmap/tempo-eventos-e-tweens')} explicam composição e limites.
`),
p('corrotinas', 'Corrotinas e esperas', 'Execute uma sequência ligada ao Behavior e cancele trabalho quando a sessão termina.', `
## Onde usar

**Arquivos → código → Behavior**. \`StartCoroutine(IEnumerator)\` agenda um enumerador; \`StartAsync\` agenda trabalho async ligado ao dono. Eles não exigem Timer no objeto. Use Timer quando quiser configuração autoral de intervalo/ação; use sequência quando o próprio comportamento possui etapas.

## Exemplo completo: desativar depois de três segundos

Anexe este Behavior a uma peça visível, compile e entre em Play. Após três segundos de tempo do jogo, a peça deixa de estar ativa. Stop restaura a autoria.

${exampleCode('delayed-deactivate')}

\`Awaitable.Seconds\` usa tempo escalado. Para uma espera que deve avançar apesar da escala, confira \`SecondsRealtime\`. A pausa do editor e a escala do jogo não devem ser tratadas como controles indistinguíveis.

## Escolher uma espera

| Operação | Intenção |
|---|---|
| NextFrame | Continuar em quadro posterior |
| FixedUpdate | Continuar no ponto de atualização fixa |
| Seconds | Aguardar tempo de jogo |
| SecondsRealtime | Aguardar tempo não escalado |

${api('BehaviorAwaitables')} documenta assinatura e cancelamento. Não substitua essas esperas por Task.Run que lê/escreve o mundo em outra thread.

## Dono, retorno e encerramento

\`StartAsync\` e \`StartCoroutine\` devolvem ${api('Coroutine')}, com estado, IsRunning e Failure. Conserve o retorno quando precisar parar uma operação específica. \`StopCoroutine\`/\`StopAllCoroutines\` atendem ao contrato do Behavior.

Use o token entregue ao trabalho e evite capturar handles de outro Play. Desativação, remoção e Stop precisam ser interpretados pelo lifecycle do dono; não crie uma tarefa global sem mecanismo de encerramento.

## Se a sequência nunca termina

Confira relógio/escala, cancelamento, dono ativo, falha registrada e se a sequência foi iniciada repetidamente em Update. Inicie uma vez na transição apropriada.

O exemplo foi preparado para compilação com o SDK; execução em aparelho é evidência separada no manifesto. ${link('conceitos/thread-e-ponto-seguro', 'Ponto seguro')}, ${link('conceitos/lifecycle-de-behavior', 'lifecycle')} e ${roadmap('roadmap/tempo-eventos-e-tweens')} esclarecem as regras.
`),
p('troca-de-cena', 'Troca de cena', 'Substitua a fase ou acrescente conteúdo sabendo quais referências continuam válidas.', `
## Acesso pelo Behavior

\`Scenes\` é o acesso protegido do Behavior. ${api('ScenesAccess')} expõe \`Names\`, \`Active\`, \`Load(nome)\` e \`LoadAdditive(nome, parent)\`. Use um nome que aparece na lista de cenas do projeto; não invente um caminho por analogia com outra engine.

## Caso: ir da fase atual para outra

1. Prepare e salve a cena de destino no projeto.
2. Confira seu nome em Scenes.Names e recursos/scripts necessários.
3. No evento de conclusão ou botão, faça uma única solicitação de \`Scenes.Load(nome)\`.
4. A troca é solicitada para o fim do quadro; não suponha que a linha seguinte já está operando no mundo novo.
5. Deixe o novo Behavior resolver referências no contexto da nova cena.
6. Pare e reinicie para conferir que a autoria inicial continua coerente.

Grave progresso necessário antes da transição, com tratamento de erro. O handle do jogador anterior não deve ser conservado como se fosse o jogador novo.

## Substituir ou acrescentar?

| Chamada | Resultado pretendido | Cuidado |
|---|---|---|
| Load | Substituir cena de execução | Referências do mundo encerrado vencem |
| LoadAdditive | Acrescentar cena sob um contêiner | Recursos/objetos adicionais passam a coexistir |
| LoadAdditive com parent | Acrescentar sob pai escolhido | Confira lifetime e transformação do pai |

A carga aditiva retorna um contêiner de acesso conforme contrato. Não significa streaming infinito, descarregamento automático por distância ou mistura irrestrita de projetos diferentes.

## Se a troca falhar

Confira nome, cena registrada, recursos e publicação de scripts. Distinga pedido aceito de aplicação concluída no ponto seguro. Observe lifecycle e diagnóstico em vez de chamar Load novamente a cada quadro.

Os estados estáticos de scripts também precisam de estratégia de sessão. Guarde chaves de progresso e resolva objetos novamente. Veja ${link('sistemas/persistencia', 'gravação')}, ${link('conceitos/handles-e-lifetime', 'referências vencidas')} e ${link('conceitos/play-e-cena-autoral', 'autoria/Play')}.

${roadmap('roadmap/objetos-e-scripts')} registra a evolução da composição/cena; não há promessa de toda a arquitetura de streaming de engines maiores.
`),
p('persistencia', 'Persistência', 'Leia e grave progresso com chaves tipadas, commit explícito e recuperação.', `
## Onde acessar

**Arquivos → código → Behavior → propriedade Save**. ${api('SaveStore')} pertence ao projeto. Não é o botão Salvar da cena, o arquivo de preferências ou uma referência viva ao jogador.

## Exemplo: contar pressões entre sessões

Configure **Saltar** como Botão habilitado/vinculado. Anexe o Behavior a um objeto ativo. Cada pressão incrementa uma chave; o nome runtime do objeto mostra o valor depois da pressão.

${exampleCode('save-action-counter')}

O fallback 0 vale para chave ausente. Se a chave já foi gravada com outro tipo, GetInt64 não converte silenciosamente. O exemplo faz Flush por pressão para tornar a demonstração explícita; num jogo, escolha momentos de commit como checkpoint ou confirmação de transação, evitando escrita por frame.

## Roteiro de conferência

1. Entre em Play e pressione três vezes, soltando entre pressões.
2. Observe o nome runtime Contador 3, salvo se já havia progresso anterior.
3. Pare e recomece; a autoria pode restaurar o nome inicial, mas o contador deve ler a chave persistida.
4. Pressione novamente: deve continuar a contagem.
5. Confira leitura após reabrir o projeto sem limpar dados do aplicativo.

## Chaves, arquivos e cotas

| Mecanismo | Commit | Limite atual |
|---|---|---|
| SetString/Boolean/Int64/Double | Flush | Até 4096 chaves; snapshot de 256 KiB |
| Chave | Parte do snapshot | 1–128 bytes UTF-8; sem NUL |
| String | Parte do snapshot | Até 16 KiB UTF-8 |
| WriteText/WriteBytes | Arquivo independente confirmado na operação | 1 MiB por arquivo; 16 MiB no conjunto |

Arquivos usam caminho relativo seguro no namespace permitido. Não escreva em diretório arbitrário do aparelho. Não grave handles, tarefas ou fachadas runtime como progresso.

## Erros e evolução

Trate quota, tipo incompatível, acesso e versão como falhas reais. Não capture tudo para substituir o progresso por um save vazio. A propriedade Recovery informa recuperação do snapshot anterior quando aplicada.

${link('conceitos/serializacao-e-migracao', 'Migração')} explica versão/significado; ${link('sistemas/troca-de-cena', 'cenas')} mostra o momento de transição. ${roadmap('roadmap/objetos-e-scripts')} e ${link('versoes/estado-da-versao', 'evidência')} delimitam o recorte.
`),
p('aleatoriedade', 'Aleatoriedade', 'Use seed, stream e snapshot para reproduzir uma sequência sem prometer determinismo do jogo inteiro.', `
## Onde usar

**Arquivos → código → Behavior ou auxiliar C#**. ${api('RandomStream')} é um gerador de números, não componente do Add. Crie um fluxo para o dono/sistema que precisa de sequência própria.

## Caso: sortear uma entre três recompensas

**Trecho C# com estado local do gerador:**

\`\`\`csharp
var random = new RandomStream(123UL, 0UL);
int reward = random.Range(0, 3); // 0, 1 ou 2; nunca 3.
var snapshot = random.CaptureSnapshot();
int next = random.Range(0, 3);
random.RestoreSnapshot(snapshot);
int repeated = random.Range(0, 3); // mesmo próximo valor do fluxo.
\`\`\`

O snapshot é capturado **antes** do sorteio que você quer repetir. Restaurar depois do sorteio e esperar reproduzir o valor anterior erra a posição do fluxo.

## Seed não é o estado inteiro

| Controle | Significado |
|---|---|
| Seed | Estado inicial da sequência |
| Stream | Separa fluxos conforme algoritmo |
| Ordem de chamadas | Determina qual número cada evento recebe |
| Snapshot | Conserva a posição atual do gerador |
| AlgorithmVersion | Contrato para comparar estado/algoritmo |

Se o sistema visual consome o mesmo gerador do loot, acrescentar uma partícula pode mudar a próxima recompensa. Separe fluxos por responsabilidade quando a reprodução for importante.

## Derivados disponíveis

Range inteiro usa máximo exclusivo; Range float também respeita seu contrato. Value, Gaussian, amostras de esfera/círculo e Shuffle têm distribuições próprias. Usar raio uniforme não é o mesmo que distribuição uniforme de volume; prefira a operação que corresponde à intenção.

## Conferir repetição e limites

Crie dois fluxos com seed/stream iguais e execute a mesma sequência de chamadas. Depois introduza uma chamada extra em apenas um: as próximas posições passam a divergir. Para continuar após um save, preserve snapshot/versão em formato próprio e valide ao ler.

Isso comprova apenas o fluxo aleatório. Não garante física, agendamento e jogo inteiro determinísticos entre aparelhos, nem sequência compatível com Godot/Unity. Veja ${link('sistemas/persistencia', 'save')}, ${link('conceitos/tempo-e-atualizacao', 'tempo')} e ${roadmap('roadmap/objetos-e-scripts')}.
`),
];
