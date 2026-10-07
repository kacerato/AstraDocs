import { page, link, api, component, roadmap } from './workflow-guide-tools.mjs';
const p = (slug, title, description, body, order) => page('conceitos', slug, title, description, body, order);
export const conceptPages = [
p('indice', 'Conceitos: entenda uma decisão concreta', 'Exemplos para escolher objeto, recurso, referencial, lifecycle e forma de salvar.', `
## Qual dúvida você está tentando resolver?

| Dúvida prática | Conceito que resolve | Exemplo do capítulo |
|---|---|---|
| Renomeei o objeto; por que a referência continua? | ${link('conceitos/objetos-e-identidade', 'Identidade')} | Duas portas com o mesmo nome |
| Image fica no Add Component? | ${link('conceitos/composicao-de-componentes', 'Composição')} | HUD: objeto + Canvas + documento + elemento |
| A referência parou de funcionar após Stop? | ${link('conceitos/handles-e-lifetime', 'Lifetime')} | Reiniciar Play e resolver o alvo novamente |
| Importei uma imagem; por que ela não aparece? | ${link('conceitos/cenas-e-recursos', 'Cena e recurso')} | Recurso registrado versus instância consumidora |
| Mudei o pai; por que X virou outro número? | ${link('conceitos/espaco-local-e-mundo', 'Local e mundo')} | Pai em 10 + filho em 2 = mundo em 12 |
| A rotação ficou rápida demais? | ${link('conceitos/unidades-e-convencoes', 'Unidades')} | Graus, radianos e deltaTime |
| Onde inicializar e onde atualizar? | ${link('conceitos/lifecycle-de-behavior', 'Lifecycle')} | Inicialização, movimento e liberação |
| O movimento sumiu depois de Stop? | ${link('conceitos/play-e-cena-autoral', 'Autoria e Play')} | Alteração runtime versus gravação autoral |
| Um timer deve funcionar durante pausa? | ${link('conceitos/tempo-e-atualizacao', 'Relógios')} | Tempo escalado versus tempo real |
| Posso acessar objetos dentro de Task.Run? | ${link('conceitos/thread-e-ponto-seguro', 'Thread e ponto seguro')} | Cálculo externo versus publicação no mundo |
| Por que o corpo recusa Translate? | ${link('conceitos/autoridade-de-transformacao', 'Autoridade')} | Física versus escrita direta de pose |
| Refatorei o script e perdi valores? | ${link('conceitos/serializacao-e-migracao', 'Serialização')} | ID estável e mudanças de tipo |
| A opção aparece; como saber se funciona? | ${link('conceitos/limites-e-capacidades', 'Capacidades')} | Configuração solicitada e suporte efetivo |

## Como aplicar estes conceitos

Leia o caso que corresponde ao seu problema, faça a pequena montagem indicada e acompanhe os valores. Depois volte ao ${link('editor/indice', 'Manual')} para a interação ou aos ${link('sistemas/indice', 'Sistemas')} para combinar as funções.

Esses contratos foram revisados contra o código do snapshot de 06/10/2026. Os roteiros mostram o que conferir na sua instalação; não transformam toda a API em recurso validado em aparelho. O progresso global de 20% é uma estimativa de produto, não a porcentagem de cada sistema.
`, -30),
p('objetos-e-identidade', 'Objetos e identidade', 'Use nomes para encontrar e IDs para referenciar sem confundir instâncias.', `
## Caso: duas portas chamadas Porta

Na Hierarquia, duplique um objeto chamado \`Porta\`. As duas instâncias podem ter nomes semelhantes, mas não devem representar a mesma identidade. Renomear a segunda para \`PortaSaida\` ajuda a encontrar; não é o mecanismo que diferencia os objetos internamente.

${api('GameObject')} expõe \`ObjectId\`, \`World\` e \`Generation\`. O ID identifica o objeto no contrato do mundo/documento. Mundo e geração também importam para o acesso de uma sessão.

## Escolher o modo de referência

| Necessidade | Use | Cuidado |
|---|---|---|
| Encontrar durante autoria | Hierarquia / busca por nome | Nomes não garantem unicidade |
| Referenciar alvo configurável de um script | Campo com ObjectReference | Resolva na sessão atual |
| Operar repetidamente durante um Play | GameObject já resolvido | Confira lifetime; não sobreviva à troca de mundo |
| Guardar progresso do jogador | Chave de gameplay estável | Não grave um handle runtime no SaveStore |

Uma busca por nome é útil para descoberta, mas frágil como contrato de uma porta que pode ser renomeada. Prefira referência configurável para o alvo específico. No Behavior, \`Resolve(referencia)\` pode não encontrar o objeto: trate ausência antes de acessar suas propriedades.

## Conferência no editor

1. Crie duas portas e dê nomes distintos.
2. Configure um alvo por referência no componente que o consome.
3. Renomeie o alvo e confira a referência.
4. Duplique o alvo e verifique que o consumidor continua apontando para a instância desejada.
5. Apague o alvo em uma cópia e observe o diagnóstico do consumidor.

Duplicar cria outra instância; o significado das referências internas/externas precisa ser conferido na montagem. Não suponha que todos os consumidores devem passar automaticamente a apontar para a cópia.

Veja ${link('editor/busca-global', 'busca')}, ${link('conceitos/handles-e-lifetime', 'referência vencida')} e ${roadmap('roadmap/objetos-e-scripts')}.
`),
p('composicao-de-componentes', 'Composição de componentes', 'Escolha a combinação que produz a função e saiba o que pertence a cada nível.', `
## Caso: um HUD de corações

A árvore da cena contém um objeto \`HUD\`. Nele você adiciona ${component('astra.ui.canvas')}. O componente referencia um **Documento UI (.aeui)**. Dentro do documento ficam elementos **Image**, como \`heart_1\`, \`heart_2\` e \`heart_3\`. No Play, um Behavior altera a instância desses elementos através de \`Gui.ForCanvas(Object)\`.

Portanto, procurar “UiImage” no Add de componentes da cena é o caminho errado para essa tarefa. Image é nó do documento, não outro corpo/objeto da Hierarquia. ${link('ui/hud-coracoes', 'Veja a montagem completa com arquivos e dano/cura')}.

## Quatro níveis que não são intercambiáveis

| Nível | Exemplo | Papel |
|---|---|---|
| Objeto | HUD, Jogador, Porta | Identidade, pose, árvore e componentes |
| Componente | Canvas UI, Corpo físico, Câmera | Dados e capacidade do objeto |
| Recurso | Documento UI, imagem, material, clipe | Conteúdo registrado e reutilizável |
| API runtime | GuiAccess, AudioVoice, AnimationPlayer | Acesso à execução de uma composição existente |

Criar uma fachada C# não cria silenciosamente todas as dependências. Ela precisa apontar para componente/recurso compatível.

## Caso: caixa que cai

Malha torna a caixa visível; Body define participação e tipo de movimento; Collider define a forma usada nos contatos. Sem Collider, a aparência da malha não resolve a colisão. Com Body estático, a caixa não cai só porque tem massa editável.

Já Character controla sua própria cápsula e não aceita Body/Collider concorrentes no mesmo objeto. A composição certa depende da função pretendida, não de acumular todos os nomes disponíveis.

**Caminho:** Hierarquia → objeto → Inspector → Componentes → Add. Confira requisitos, conflitos e campos na ficha. ${link('editor/dependencias-e-conflitos', 'Como resolver uma recusa')} e ${link('sistemas/fisica-3d', 'cenário físico')} mostram a aplicação.
`),
p('handles-e-lifetime', 'Handles e lifetime', 'Evite referências vencidas após destruição, Stop e troca de cena.', `
## Caso: referência válida no primeiro Play e inválida no segundo

Um script encontrou \`Jogador\` e guardou seu GameObject em estado estático. Stop encerrou aquele mundo. No Play seguinte, há outro mundo/sessão, mesmo que a Hierarquia e os nomes pareçam iguais. Usar o objeto antigo pode produzir \`StaleHandle\` ou \`ForeignWorld\`.

O acesso vivo combina identidade e contexto de sessão. \`IsAlive\`/\`IsValid\` ajudam a verificar o estado de ${api('GameObject')}; não tornam um alvo de outro mundo compatível por si só.

## Resolver e liberar pelo ciclo correto

1. Guarde uma referência autoral ou critério de descoberta, não um handle eterno.
2. Resolva o objeto na inicialização da sessão atual.
3. Antes de usá-lo depois de uma destruição/troca, confira existência e o resultado da operação.
4. Cancele callbacks/corrotinas que perderam seu dono.
5. No próximo Play, refaça a resolução; não restaure o handle antigo do SaveStore.

O mesmo vale para componente, elemento UI, voz de áudio e operação agendada. Uma fachada é um acesso ao consumidor, não uma cópia independente que mantém o mundo vivo.

## O que persiste e o que deve ser reconstruído

| Estado | Entre sessões |
|---|---|
| Nome/chave de uma fase desbloqueada | Pode ser gravado como progresso |
| Configuração autoral de componente | Salva pela cena |
| Handle de GameObject/GuiElement do Play | Refaça na sessão atual |
| Coroutine/assinatura de evento | Vinculada ao dono e lifecycle |

## Conferir a correção

Inicie Play, faça a ação, pare e repita. Depois, destrua o alvo ou carregue outra cena. O comportamento deve lidar com ausência e resolver o novo alvo quando apropriado, sem repetir erro em cada Update.

Veja ${link('conceitos/lifecycle-de-behavior', 'lifecycle')}, ${link('sistemas/troca-de-cena', 'troca de cena')} e ${link('editor/console-e-diagnostico', 'mensagem e status')}. Esse roteiro é distinto da evidência de execução publicada para cada exemplo.
`),
p('cenas-e-recursos', 'Cenas e recursos', 'Entenda por que importar, instanciar e vincular são etapas diferentes.', `
## Caso: importei um coração e nada apareceu

A imagem foi registrada como recurso. Para aparecer no HUD, ainda precisa de um consumidor: documento UI com um elemento Image, textura atribuída e Canvas UI instanciando aquele documento.

Do mesmo modo, um GLB pode ser publicado com **Só recurso** sem colocar um objeto na cena. **Na cena** também cria a instância. ${link('editor/assets-e-importacao', 'Veja o caminho de importação')}.

## Recurso versus instância

| Ação | O que modifica | Exemplo |
|---|---|---|
| Importar | Registro e derivados de conteúdo | Imagem/material/clipe reconhecido |
| Instanciar | Composição no documento/mundo | Objeto usando o modelo |
| Vincular | Referência no consumidor | Image usa a textura de coração |
| Alterar override | Estado específico de uma instância | Uma peça tem cor diferente |
| Alterar recurso compartilhado | Conteúdo usado por várias instâncias | Todas as peças que usam o material mudam |

Um arquivo com o mesmo nome não garante a mesma identidade. Um ID registrado para imagem também não pode substituir um ID de clipe de áudio: o consumidor exige um tipo.

## Diagnosticar o vínculo

1. Localize o recurso em Arquivos/Recursos importados.
2. Abra o consumidor e confira o slot correto.
3. Observe se a referência resolve o tipo esperado.
4. Salve e reabra sem mover os arquivos externamente.
5. Se falhar, diferencie recurso desconhecido de incompatibilidade de tipo.

Preserve fonte, derivados necessários e registro ao copiar um projeto. Uma cópia só da cena pode manter os IDs e perder o conteúdo que eles apontam.

## Cenas carregadas em runtime

\`Scenes.Load\` substitui a cena de execução; \`LoadAdditive\` acrescenta conteúdo sob um contêiner. Isso não é reimportar um recurso nem abrir outro documento autoral no editor. Referências runtime seguem o mundo em que foram resolvidas.

Consulte ${link('sistemas/importacao-glb', 'GLB')}, ${link('sistemas/troca-de-cena', 'carga de cenas')}, ${link('ui/hud-coracoes', 'HUD completo')} e ${api('AssetGuid')}.
`),
p('espaco-local-e-mundo', 'Espaço local e mundo', 'Calcule uma pose simples e escolha o referencial correto ao mover ou mudar de pai.', `
## Um exemplo sem rotação nem escala

Crie \`PaiA\` com X = 10 e escala 1. Crie \`Filho\` sob ele com X local = 2. A posição de mundo do filho é X = 12.

Agora crie \`PaiB\` em X = 20:

| Ao mudar Filho para PaiB | X local depois | X de mundo depois |
|---|---|---|
| Preservar local (KeepLocal) | 2 | 22 |
| Preservar mundo (KeepWorld) | -8 | 12 |

O editor usa a intenção de preservar mundo em **Mudar pai**. Na API, \`SetParent\` tem padrão **KeepLocal**: escolha a política explicitamente para evitar uma mudança inesperada.

## Rotação e escala mudam a conta

Posição local é transformada pela pose dos ancestrais. Com rotação/escala, não basta somar vetores. Uma direção representa orientação; um ponto inclui deslocamento; um vetor transformado pode incluir escala.

${api('GameObject')} separa \`TransformPoint\`, \`TransformDirection\`, \`TransformVector\` e operações inversas. Para converter uma posição de um recurso local ao mundo, use o contrato de ponto. Para a orientação de movimento, escolha o contrato de direção e normalize quando necessário.

## Aplicação em movimento

\`Object.Translate(deslocamento, TransformSpace.Local)\` acompanha os eixos do objeto. Em \`World\`, o deslocamento usa os eixos do mundo. **Trecho dentro de Update:**

\`\`\`csharp
Object.Translate(new System.Numerics.Vector3(0, 0, deltaTime),
                 TransformSpace.Local);
\`\`\`

Ao girar o objeto, seu percurso local muda de direção. Esse trecho não é o método para comandar um corpo dinâmico; consulte ${link('conceitos/autoridade-de-transformacao', 'autoridade')}.

## Conferir e corrigir

Observe posição local no Inspector e \`WorldPosition\` no runtime. Se a troca de pai for recusada, confira escala zero e transformações que exigiriam cisalhamento não representável. Não force uma matriz inválida para preservar a aparência.

${link('editor/hierarquia-e-parenting', 'Passos de parenting')} e ${link('editor/gizmos-e-coordenadas', 'gizmos')} aplicam esse conceito na autoria.
`),
p('unidades-e-convencoes', 'Unidades e convenções', 'Use metros, segundos, radianos e dimensões sem copiar números incompatíveis.', `
## Caso: girar 90 graus em um segundo

\`Object.Rotate\` recebe ângulo em **radianos**. 90° = π/2 rad, aproximadamente 1,5708. Em Update, aplique a taxa uma vez pelo intervalo:

\`\`\`csharp
// Trecho dentro de Update(float deltaTime).
Object.Rotate(System.Numerics.Vector3.UnitY,
              (System.MathF.PI / 2f) * deltaTime,
              TransformSpace.Local);
\`\`\`

Passar 90 diretamente nessa API significa 90 radianos, não 90 graus. Já **FOV vertical** e limites de inclinação que declaram graus devem continuar recebendo graus.

## Ler o contrato antes do número

| Dado | Convenção neste uso | Exemplo |
|---|---|---|
| Deslocamento/velocidade | Metro / metro por segundo | 2 m/s × 0,5 s = 1 m |
| Duração | Segundos | Timer de 2 s, não 2000 milissegundos |
| Rotate/yawRadians | Radianos | π rad = 180° |
| Campo rotulado em graus | Graus | FOV de 60° |
| Meia-dimensão de caixa | Metade do tamanho completo | Caixa de 2 m usa meia-dimensão de 1 m |
| Cápsula de Character | Raio + meia-altura cilíndrica | Não confundir cilindro com altura total |
| Range inteiro | Máximo exclusivo | Range(0, 3) retorna 0, 1 ou 2 |

## O erro de multiplicar delta duas vezes

Se você prepara um deslocamento já multiplicado por deltaTime e depois multiplica novamente antes de Translate, obtém velocidade dependente do passo e movimento muito pequeno. Se a API recebe intenção/velocidade e integra internamente, não aplique delta sem ler sua assinatura.

Não trate vetor de input como metros. \`Input.Axis2\` informa ação; a mecânica transforma esse valor em movimento, força ou intenção de Character.

## Exercício de escala

Compare uma caixa com tamanho conhecido, a cápsula do personagem e planos da câmera. Se um GLB vier 100 vezes maior, corrija a convenção de importação/autoria e confira física e distância de câmera antes de compensar todos os campos individualmente.

As páginas de ${link('componentes', 'campos')} declaram unidade, domínio e condição. ${link('conceitos/tempo-e-atualizacao', 'Tempo')} e ${link('sistemas/aleatoriedade', 'Range')} mostram aplicações relacionadas.
`),
p('lifecycle-de-behavior', 'Lifecycle de Behavior', 'Escolha callbacks para inicializar, atualizar e encerrar recursos de uma sessão.', `
## Onde escrever

**Caminho:** Arquivos → código → **Novo componente C#** → classe derivada de ${api('Behavior')}. Salve, recompile e anexe o tipo ao objeto. O editor do texto não chama callbacks; eles pertencem à sessão Play.

| Callback | Responsabilidade útil | Evite |
|---|---|---|
| Awake | Preparar estado da instância | Presumir que todos os outros Behaviors já inicializaram |
| Enable / Disable | Ativar/desativar participação e vínculos | Acumular assinaturas a cada reativação |
| Start | Iniciar o comportamento da sessão | Refazer o mesmo preparo a cada frame |
| Update(deltaTime) | Gameplay por quadro, input e UI | Operação pesada ou busca desnecessária por frame |
| FixedUpdate(deltaTime) | Trabalho ligado à atualização fixa | Assumir uma chamada por quadro renderizado |
| LateUpdate(deltaTime) | Ajuste após atualizações regulares | Disputar pose sem definir autoridade |
| Stop / Destroy | Encerrar sessão/instância e liberar trabalho próprio | Conservar handles para o Play seguinte |

Os callbacks de colisão, trigger e timer são eventos específicos, não substitutos universais para Update.

## Exemplo de distribuição de responsabilidades

Um HUD encontra seu canvas e elementos na inicialização. Durante Update, consome eventos de botões e atualiza imagens quando a vida muda. Ao encerrar, não reutiliza aqueles GuiElements em outro Play. ${link('ui/hud-coracoes', 'O exemplo de corações')} mostra essa divisão em um Behavior completo.

Um objeto que gira usa Update e deltaTime; não precisa criar uma coroutine para aplicar a mesma rotação continuamente. Um processo em etapas usa espera da engine e cancelamento; ${link('sistemas/corrotinas', 'veja o caso apropriado')}.

## Desabilitar não é destruir

Objeto/componente desabilitado pode continuar existindo como dado autoral, mas deixa de participar segundo o contrato do consumidor. Não use a ausência de Update como prova de que o objeto foi apagado. Confira estado ativo do objeto, componente e ancestrais.

## Conferência de ciclo

Faça Play → ação → pausa → retomada → Stop → novo Play. Depois, teste desativação/remoção do dono em uma cópia. Observe inicialização repetida, assinaturas duplicadas e tarefas sem dono.

O capítulo não promete uma ordem global de scripts configurável como a de outras engines. Dependência entre scripts precisa de contrato explícito. Veja ${link('conceitos/handles-e-lifetime', 'lifetime')} e ${roadmap('roadmap/objetos-e-scripts')}.
`),
p('play-e-cena-autoral', 'Play e cena autoral', 'Saiba qual mudança deve voltar no Stop e qual precisa de uma gravação própria.', `
## Caso: o script moveu a caixa, mas Stop restaurou a posição

Isso é coerente com a separação de mundos: a cena autoral descreve o ponto de partida; Play cria a sessão de execução. A transformação aplicada pelo script pertence àquela sessão. Parar encerra o runtime e devolve a edição autoral.

**Caminho:** barra superior → Play. Durante execução aparecem **Inspecionar**, **Pausar/Retomar**, **Tempo** e **Passo** quando pausado.

## O que fazer para cada intenção

| Quero guardar… | Ação apropriada |
|---|---|
| Posição inicial da caixa | Stop → editar transformação autoral → Salvar |
| Pontos que o jogador ganhou | SaveStore.SetInt64 → Flush no momento apropriado |
| Layout inicial de HUD | Editar documento UI e salvar recurso |
| Imagem de coração alterada durante dano | Atualizar instância runtime; recompor ao iniciar |
| Nova compilação de script | Salvar texto → recompilar/publicar |

Não existe nesta documentação uma garantia de “aplicar todas as alterações de Play para autoria”. Para persistir uma mudança, use o caminho de dados correspondente.

## Inspecionar uma sessão

1. Salve a cena inicial e entre em Play.
2. Execute a ação que modifica o objeto.
3. Use Inspecionar; confira que está olhando o runtime.
4. Pause e use Passo para observar o avanço.
5. Pare e compare com os valores autorais originais.
6. Reinicie e verifique que referências são resolvidas de novo.

Inspecionar e editar têm regras de mutabilidade diferentes por componente. Um campo autoral visível não autoriza recriar qualquer estrutura no meio da simulação.

## Recursos compartilhados exigem atenção

O isolamento de pose runtime não deve ser generalizado para toda alteração de arquivo/recurso feita por uma ferramenta. Salvar texto, documento UI ou recurso autoral é uma operação própria. Confira o alvo e preserve uma cópia antes de experimentar.

${link('sistemas/persistencia', 'Persistência')} grava progresso; ${link('editor/undo-e-redo', 'Undo')} cobre autoria; ${link('sistemas/troca-de-cena', 'troca de cena')} encerra e cria contextos runtime. São mecanismos com propósitos diferentes.
`),
p('tempo-e-atualizacao', 'Tempo e atualização', 'Escolha relógio escalado, tempo real e passo fixo para cada mecânica.', `
## Caso: jogo pausado, menu ainda precisa responder

Ao reduzir \`Time.Scale\` a zero, o tempo escalado deixa de avançar. Uma contagem ligada à simulação deve pausar; uma espera de interface em tempo real pode precisar continuar. ${api('TimeAccess')} separa as duas medidas.

| Medida | Use para | Efeito da escala |
|---|---|---|
| deltaTime / DeltaTime | Movimento e lógica por quadro | Escalado |
| UnscaledDeltaTime | Processo que deve usar tempo real | Independente da escala |
| FixedDeltaTime / FixedUpdate | Trabalho no passo fixo | Contrato da simulação fixa |
| TimeSinceStart | Cronologia escalada da sessão | Acumula tempo do jogo |
| UnscaledTimeSinceStart | Cronologia real da sessão | Acumula sem multiplicar a escala |

O contrato atual de Scale limita o valor a 0–4. Pausa do editor também controla avanço da sessão; não a trate como sinônimo universal de alterar a escala em script.

## Um quadro não é um passo fixo

Uma renderização pode ocorrer sem passo fixo ou após mais de um passo. Aplicar input/força uma vez por quadro e esperar equivalência exata com FixedUpdate pode criar comportamento dependente da frequência.

Use o intervalo recebido pela callback adequada e não multiplique duas vezes. Para timer, um quadro longo pode agregar expirações em \`count\`; ignorá-lo pode perder eventos.

## Aplicações

- **Rotação visual:** velocidade angular × deltaTime em Update.
- **Cooldown de habilidade:** tempo escalado, se pausa deve congelar a habilidade.
- **Animação de menu:** relógio não escalado, se precisa avançar durante pausa.
- **Espera async:** \`Awaitable.Seconds\` ou \`SecondsRealtime\`, conforme a intenção.
- **Timer componente:** confira **IgnoreTimeScale** em sua ficha.

## Conferência

Execute em escala 1, depois 0,5 e 0. Compare a duração de gameplay com a duração de interface. Retome e observe se o processo acumulou indevidamente trabalho durante a pausa.

Veja ${link('sistemas/timers', 'timers')}, ${link('sistemas/corrotinas', 'esperas')} e ${link('conceitos/unidades-e-convencoes', 'unidades')}. ${roadmap('roadmap/tempo-eventos-e-tweens')} declara o estado da família.
`),
p('thread-e-ponto-seguro', 'Thread e ponto seguro', 'Diferencie preparar uma operação de observar sua aplicação no mundo.', `
## Caso: pedi para destruir um objeto e ainda vejo sua referência

Uma operação estrutural pode ser aceita para aplicação em um ponto seguro. O pedido feito durante callback e a alteração efetiva da coleção do mundo não precisam acontecer na mesma linha.

${api('GameObject')} oferece variantes como \`DestroyTracked\` e \`SetParentTracked\`, que retornam uma operação acompanhável. Consulte ${api('WorldOperation')} e seus estados em vez de assumir execução imediata.

## Trabalhar em duas fases

1. **Preparar:** escolha o alvo e confira parâmetros/autoridade.
2. **Solicitar:** faça a chamada na callback/contexto autorizado.
3. **Acompanhar:** leia o resultado da operação quando ela for aplicada.
4. **Reagir:** só então atualize estado dependente da criação/remoção.

Uma solicitação aceita não garante que um alvo permaneça válido até a aplicação. Outro evento pode removê-lo; preserve diagnóstico do resultado final.

## Task.Run não é licença para acessar a cena

Uma tarefa externa pode preparar dados independentes, como cálculo sobre uma cópia de números. Isso não torna GameObject, GuiElement ou componentes thread-safe. Não leia/escreva o mundo dentro de uma Task arbitrária presumindo que await corrige o acesso.

Para trabalho ligado ao Behavior, use os pontos de espera da engine: \`Awaitable.NextFrame\`, \`FixedUpdate\`, \`Seconds\` ou \`SecondsRealtime\`, com o token de cancelamento apropriado. Veja ${link('sistemas/corrotinas', 'exemplo completo de espera')}.

## Erros que este conceito evita

| Erro | Causa provável |
|---|---|
| Enumerar e mudar a mesma composição como se fosse síncrona | Publicação estrutural em momento inadequado |
| Usar alvo após pedido de destruição | Estado dependente atualizado antes da aplicação |
| Operar no Play seguinte com tarefa antiga | Trabalho sem cancelamento/lifetime correto |
| Descartar status | Recusa ou falha final ficou escondida |

O contrato específico do membro prevalece: nem toda propriedade usa a mesma fila. Confira mutabilidade no catálogo e assinatura/status na API. ${link('conceitos/handles-e-lifetime', 'Lifetime')} explica validade; ${link('editor/console-e-diagnostico', 'Console')} ajuda a ver a causa.
`),
p('autoridade-de-transformacao', 'Autoridade de transformação', 'Escolha um escritor de pose e adapte o movimento ao sistema responsável.', `
## Caso: Translate funciona sem física e falha depois de adicionar Body

No objeto visual, seu script escreve a transformação. Com corpo dinâmico, a simulação publica a pose. Continuar escrevendo a mesma posição por fora pode ser recusado com \`TransformOwnedByPhysics\` ou disputar o consumidor.

## Escolher o movimento pela composição

| Objeto pretendido | Escritor principal | Como comandar |
|---|---|---|
| Peça visual sem simulação | Script / transformação | Translate, Rotate e propriedades adequadas |
| Corpo dinâmico | Física 3D ou 2D | Força, impulso e estado pela API física |
| Character | Controlador de personagem | MoveCharacter / TryJumpCharacter |
| Objeto no percurso | Path Follow | Caminho, progresso, velocidade/duração |
| Objeto seguindo alvo por constraint | Constraint/mola | Fonte, peso, offsets e parâmetros |
| Objeto em transição autoral | Transform Tween | Destino, duração e curva |

A tabela explica a responsabilidade; não garante que qualquer combinação entre linhas seja suportada.

## Montagem útil: raiz lógica e filho visual

Para um personagem, mantenha a raiz controlando movimento e colisão e a malha como filho visual. Uma animação visual não precisa disputar a posição mundial da cápsula. A ferramenta **Criar raiz Character…** do Inspector ajuda nessa separação, com efeitos descritos antes da confirmação.

Para uma câmera que acompanha um jogador, coloque o componente de acompanhamento na câmera e use o jogador como alvo. Não adicione Body na câmera só porque o jogador é físico. Veja ${component('astra.camera.follow')}.

## Localizar a disputa

1. Pare Play e liste componentes que podem escrever a pose.
2. Confira o script: Update/LateUpdate, tween, caminho e constraints.
3. Escolha um sistema principal para o movimento pretendido.
4. Remova/desative a escrita concorrente em uma cópia.
5. Refaça a ação e examine o status e a pose.

Resolver autoridade não é repetir Translate até “pegar”. Veja ${link('sistemas/fisica-3d', 'física')}, ${link('sistemas/personagem', 'personagem')}, ${link('sistemas/curvas-e-caminhos', 'caminhos')} e ${link('sistemas/tweens', 'tweens')}.

Constraints e molas têm sua própria família e dependências; ${roadmap('roadmap/restricoes-e-molas')} distingue o que está entregue do que ainda precisa de fechamento.
`),
p('serializacao-e-migracao', 'Serialização e migração', 'Preserve significado e identidade ao salvar, copiar e refatorar um projeto.', `
## Caso: renomear uma propriedade de script

O jogador configurou um valor no Inspector e salvou a cena. Se uma refatoração troca a identidade serializada da propriedade, o dado antigo pode deixar de corresponder ao campo novo, mesmo que a classe compile.

\`ComponentId\` e \`PropertyId\` são contratos estáveis. Não gere novos IDs em cada compilação. Renomear o texto exibido e mudar o tipo de dado são mudanças diferentes: trocar float por referência de objeto exige migração de significado, não apenas manter o nome.

## O que está sendo gravado?

| Dado | Mecanismo |
|---|---|
| Composição e propriedades autorais | Cena/documento da engine |
| Recursos e referências | Registro e arquivos do projeto |
| Layout e escolhas de editor | Preferências do editor |
| Progresso de gameplay | SaveStore e arquivos próprios |
| Handles, caches e tarefas vivas | Reconstruídos em runtime |

Um serializer ter campo para uma função não comprova que existe consumidor para ela. Preservar um valor e executar seu efeito são etapas separadas.

## Alterar um projeto com reversão

1. Faça uma cópia completa antes de atualizar formato ou versão.
2. Abra com a versão pretendida e registre qualquer diagnóstico de migração.
3. Confira uma transformação, uma referência de recurso, um componente e um campo de script.
4. Salve na cópia; feche e reabra.
5. Entre em Play e observe os consumidores dessas propriedades.

Não substitua a única cópia original porque a leitura “não deu erro”. Um dado ausente, valor padrão inesperado ou referência quebrada também exige investigação.

## Versões de documentos e famílias

Componentes publicam versão do payload e regras de mutabilidade. Documento UI, cena e progresso têm contratos próprios; não compartilham uma versão universal. Um arquivo do planejamento Astra 2/Luau não deve ser interpretado automaticamente como cena desta geração C#.

Veja ${link('editor/projetos-e-modelos', 'preservar projetos')}, ${link('sistemas/persistencia', 'SaveStore')}, ${link('diagnostico/cena-nao-reabre', 'falha de leitura')} e ${link('versoes/estado-da-versao', 'snapshot e evidência')}.
`),
p('limites-e-capacidades', 'Limites e capacidades', 'Leia suporte efetivo, cotas e truncamento antes de planejar sua cena.', `
## Caso: há campo de sombra, mas a cena exige mais que o backend entrega

Uma opção autoral expressa uma solicitação. O consumidor precisa suportar o modo e respeitar orçamento de recursos. O renderer deste recorte possui limite de **8 luzes locais pontuais/spot**; isso não vira iluminação ilimitada por adicionar mais componentes.

Veja ${link('roadmap/capacidades-do-renderer', 'capacidades do renderer')} para estados e limitações. O limite não significa que toda cena usa oito luzes com a mesma qualidade ou custo.

## Estados que mudam uma decisão

| Estado | Como interpretar |
|---|---|
| Implementado no contrato | Existe cadeia identificada no recorte; leia os limites e a evidência |
| Parcial / experimental | Há capacidade útil com lacunas explícitas |
| Planejado / pesquisado | Serve para orientar evolução; não promete uma ação disponível |
| Conferido em fonte | O comportamento foi rastreado no código |
| Exemplo compilado | Código aceito pelo SDK; execução é outro campo |
| Validado em aparelho | Exige cenário e evidência específicos |

Os **20% da meta final** são uma estimativa global informada para o projeto. Não significam 20% de cada câmera, API ou componente. Contagem de nomes também não é paridade com Unity/Godot.

## Consultas e cotas

Uma consulta com capacidade limitada pode devolver uma lista truncada. Leia o indicador de truncamento; “recebi cinco hits” não prova que só existem cinco alvos. Para SaveStore, respeite limites de chave/arquivo e caminhos permitidos. Para input, o editor admite até 64 ações neste recorte.

## Planejar sem depender de uma promessa

1. Encontre a função e a composição mínima.
2. Leia campos, domínio e limitações do consumidor.
3. Abra o roadmap da família para lacunas relacionadas.
4. Monte o menor cenário que usa a capacidade necessária.
5. Confira execução na instalação alvo antes de construir o jogo inteiro em torno dela.

${link('roadmap/registro-de-familias', 'Registro de famílias')}, ${link('versoes/estado-da-versao', 'evidências')} e ${link('sistemas/indice', 'sistemas por objetivo')} ajudam a escolher um caminho atual e detectar uma dependência ainda ausente.
`),
];
