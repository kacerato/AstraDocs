import { page, link, component, api, roadmap } from './workflow-guide-tools.mjs';

const p = (slug, title, description, body, order) => page('editor', slug, title, description, body, order);
export const editorPages = [
p('indice', 'Manual do editor: escolha uma tarefa', 'Caminhos de acesso e sequências de uso para trabalhar no editor Astra.', `
## Comece pelo resultado que precisa obter

Este manual acompanha o editor do snapshot de **06/10/2026**. A revisão editorial é de **07/10/2026**. Os nomes abaixo vêm dos controles do editor; o lugar ocupado pelos painéis muda com a largura da tela. O editor de cena usa landscape.

| Quero… | Onde começar | Guia com passos |
|---|---|---|
| Criar um projeto | Tela Projetos → Novo projeto | ${link('editor/projetos-e-modelos', 'Criar, abrir e preservar projetos')} |
| Encontrar um objeto | Hierarquia ou lupa da barra superior | ${link('editor/busca-global', 'Buscar por objeto, arquivo ou tipo')} |
| Mover e organizar objetos | Seleção → ferramentas do viewport / Hierarquia | ${link('editor/gizmos-e-coordenadas', 'Manipular')} · ${link('editor/hierarquia-e-parenting', 'Agrupar e mudar de pai')} |
| Configurar uma função | Objeto → Inspector → Componentes | ${link('editor/inspector', 'Editar campos')} · ${link('editor/adicionar-componentes', 'Adicionar capacidade')} |
| Trazer um modelo ou imagem | Arquivos → ícone de importação correspondente | ${link('editor/assets-e-importacao', 'Importar e conferir recursos')} |
| Escrever comportamento | Arquivos → ícone de código | ${link('editor/codigo-e-compilacao', 'Criar, compilar e anexar C#')} |
| Entender um erro | Código → Console → Problemas / Registros | ${link('editor/console-e-diagnostico', 'Investigar a primeira causa')} |
| Desfazer uma sequência | Barra superior → Undo, toque prolongado | ${link('editor/undo-e-redo', 'Navegar pelo histórico')} |
| Configurar os controles do jogo | Cena → Configurações do projeto → Entrada | ${link('sistemas/input-e-acoes', 'Criar ações e vínculos')} |
| Criar HUD com imagens | Cena → Interface (UI + ImGui) | ${link('ui/comece-aqui', 'Abrir o documento UI')} · ${link('ui/hud-coracoes', 'Corações com dano e cura')} |

## Se você não encontra a função

**Cena**, na barra superior, abre o menu de áreas de trabalho. Ali ficam **Recursos importados**, **Ambiente da cena**, **Configurações do projeto**, **Interface (UI + ImGui)** e **Layout dos painéis**. Recursos importados só fica disponível quando o projeto tem recursos.

Em uma tela compacta, use o seletor **Viewport / Hierarquia / Inspector / Arquivos** para trazer o painel desejado. Um painel recolhido não significa que a capacidade foi removida. Para ações de objeto, mantenha o toque em uma linha da Hierarquia ou abra o menu do Inspector.

## Um percurso completo de aprendizado

1. Crie o projeto e um objeto pequeno.
2. Localize-o na Hierarquia e enquadre na vista.
3. Altere um campo no Inspector; desfaça e refaça.
4. Salve e reabra para conferir o estado autoral.
5. Acrescente um componente ou script e observe em Play.

Use ${link('conceitos/indice', 'Conceitos com exemplos')} quando precisar entender a regra por trás de uma ação. Use ${link('sistemas/indice', 'Sistemas por resultado')} para montar várias funções juntas. O ${link('componentes', 'catálogo de componentes')} detalha cada campo, unidade, condição e dependência; o manual mostra a sequência de interação.
`, -30),
p('projetos-e-modelos', 'Projetos e modelos', 'Crie um projeto vazio, abra a cena e preserve uma cópia antes de experimentar.', `
## Criar e abrir

**Caminho:** tela inicial → **Projetos** → **Novo projeto**. A navegação da tela inicial também oferece **Novo** e **Importar**.

1. Abra **Novo projeto vazio**.
2. Preencha **Nome do projeto**, por exemplo \`MeuPrimeiroJogo\`.
3. Toque em **Criar projeto** e abra o projeto na lista.
4. No editor, crie um objeto pela ação **+** da Hierarquia, altere seu nome e toque em **Salvar** na barra superior.
5. Volte à lista e reabra o projeto. O objeto e a alteração devem continuar presentes.

O botão de criação fica indisponível para nome vazio, nome já existente ou caracteres de caminho como \`/ \\ : * ? " < > |\`. Retire esses caracteres; não tente contornar a validação criando diretórios manualmente.

## O que pertence ao projeto

| Conteúdo | Onde você trabalha | Como conferir |
|---|---|---|
| Objetos e componentes | Hierarquia e Inspector | Salvar → reabrir a cena |
| Imagens, modelos e áudio | Arquivos / Recursos importados | Recurso resolve após reabrir |
| Comportamentos C# | Área de código | Salvar → recompilar → anexar |
| Ações, tags e camadas | Cena → Configurações do projeto | Reabrir e verificar configuração |
| Progresso do jogador | API SaveStore em Play | Flush → próxima execução lê o valor |

Salvar texto C# não publica automaticamente uma compilação. Salvar a cena também não grava pontos e inventário de gameplay; veja ${link('sistemas/persistencia', 'persistência do jogador')}.

## Modelos, importação e cópias

A criação confirmada neste recorte oferece **projeto vazio**. Um jogo mostrado no histórico do desenvolvimento não deve ser considerado template instalado. Se começar de um exemplo, confira quais recursos e scripts ele inclui antes de reutilizá-lo.

Antes de instalar outra versão ou experimentar importação grande, preserve uma cópia completa do projeto e seus recursos fora dos dados do aplicativo. Uma cópia só da cena pode deixar imagens e modelos ausentes. Depois, faça a ${link('editor/assets-e-importacao', 'importação')} na cópia de trabalho.

**Se o projeto não abre:** preserve a cópia que falhou e siga ${link('diagnostico/cena-nao-reabre', 'diagnóstico de leitura')}. Não sobrescreva o único arquivo com uma cena vazia. Para saber o recorte distribuído, consulte ${link('versoes/estado-da-versao', 'estado da versão')}.
`),
p('viewport-e-navegacao', 'Viewport e navegação', 'Orbite, aproxime, enquadre e diferencie a vista de edição da câmera do jogo.', `
## Encontrar os controles

**Caminho:** editor de cena → **Viewport**. Na tela compacta, escolha Viewport no seletor de painéis. Os controles de navegação ficam junto à vista: **Orbit**, **Pan** e **Zoom**, representados por ícones.

| Controle | Gesto | Resultado na vista de edição |
|---|---|---|
| Orbit | Arrastar com um dedo | Gira a vista ao redor do ponto de interesse |
| Pan | Arrastar com um dedo | Desloca o enquadramento lateralmente |
| Zoom | Arrastar com um dedo | Aproxima ou afasta |
| Navegação com dois dedos | Pinçar e mover o centro do gesto | Combina zoom e deslocamento |
| Seleção | Toque curto na geometria | Escolhe um objeto sem iniciar um arraste |

Para mover o objeto, use as ferramentas de transformação; arrastar em modo Pan não muda sua posição. Veja ${link('editor/gizmos-e-coordenadas', 'gizmos')}.

## Recuperar um objeto perdido na vista

1. Abra **Hierarquia** e toque no objeto pelo nome.
2. Abra o menu do **Inspector** e escolha **Enquadrar na vista**.
3. Volte ao Viewport; use Orbit para conferir lados e Pan para ajustar o centro.
4. Faça um toque curto em outro objeto e confira o alvo no Inspector antes de editar.

Se selecionar pela geometria for difícil, use a Hierarquia: objetos encobertos ou fora da vista continuam selecionáveis na árvore. Enquadrar é uma ação da câmera de edição, não um comando para posicionar a câmera de gameplay.

## Por que aparece no editor e desaparece em Play?

A vista de edição e a câmera com componente **Câmera** têm poses e lentes diferentes. Entre em Play e confira a câmera marcada **Usar no Play**, a direção para a qual ela aponta, os planos de recorte e o estado dos objetos. Siga ${link('sistemas/cameras', 'montar a câmera do jogo')}.

O modo de pilotar uma câmera selecionada é uma exceção à navegação normal: pode editar a pose daquela câmera. Confira qual modo está ativo antes do gesto e use Undo se modificar a câmera de jogo por engano.

## Espaço e execução

Recolha painéis durante uma manipulação longa e traga o Inspector para ajustes numéricos. Em Play, **Inspecionar** permite examinar a sessão; **Pausar** e **Passo** ajudam a observar uma atualização. Ao parar, volte à cena autoral. ${link('conceitos/play-e-cena-autoral', 'Veja o que pertence a cada mundo')}.
`),
p('selecao-e-multisselecao', 'Seleção e multisseleção', 'Escolha alvos com precisão e saiba quais objetos uma ação vai atingir.', `
## Selecionar um ou vários

**Caminho:** **Hierarquia** → linha do objeto. Um toque curto no Viewport também seleciona geometria; para alvos sobrepostos, prefira a árvore.

1. Toque em \`CaixaA\` e confira esse nome no Inspector.
2. Ative o controle de multisseleção no cabeçalho da Hierarquia. O editor informa **Selecionar vários: toque nos objetos para somar ou tirar**.
3. Toque em \`CaixaB\` para adicioná-la ao conjunto. Toque outra vez para retirá-la.
4. Use as ações do menu da seleção para **selecionar tudo**, **limpar**, **inverter** ou **selecionar filhos**, quando disponíveis.

Selecionar filhos inclui a raiz selecionada e seu subgrupo. Antes de Excluir ou Duplicar, expanda a árvore para entender a extensão da ação.

## Exemplo: organizar um conjunto sem duplicar filhos duas vezes

Crie \`Grupo\` com \`CaixaA\` e \`CaixaB\` como filhos. Selecione Grupo e uma das caixas, abra o menu e duplique. A duplicação considera raízes selecionadas: o filho já incluído no ancestral não deve virar outra cópia independente. Confira a árvore resultante e desfaça uma vez.

Para transformar várias peças, faça primeiro um arraste pequeno. Observe o conjunto, use Undo e confirme que a transação inclui os alvos pretendidos. Não presuma que todo campo especializado do Inspector aceita edição coletiva: disponibilidade depende da propriedade e composição.

## O Inspector mostra outro objeto

O cadeado do Inspector pode fixar seu alvo. Com ele ativo, tocar em outra linha muda a seleção, mas o painel continua preso ao objeto anterior. Desative a fixação ou confira o título antes de digitar um valor. ${link('editor/inspector', 'Veja inspeção e fixação')}.

## Variações e cuidados

Para mover várias peças mantendo a relação entre elas, criar um pai comum pode ser mais claro que repetir uma edição coletiva. Veja ${link('editor/hierarquia-e-parenting', 'Criar grupo e mudar pai')}. Ao apagar o pai, considere toda a árvore de filhos e as referências externas para ela.

Nomes iguais não são a mesma identidade. Se uma ação parece atingir o objeto errado, use hierarquia, contexto e ID, conforme ${link('conceitos/objetos-e-identidade', 'identidade de objetos')}. O conjunto de seleção é estado do editor; não é uma lista automática de alvos do script em Play.
`),
p('hierarquia-e-parenting', 'Hierarquia e parenting', 'Crie grupos, mude o pai e entenda o que acontece com a pose e os filhos.', `
## Onde ficam as ações

**Caminho:** **Hierarquia** → toque prolongado na linha do objeto. O menu oferece **Duplicar selecionado**, **Criar grupo**, **Excluir selecionado**, **Mover acima**, **Mover abaixo**, **Mudar pai**, **Mover para raiz**, **Renomear** e **Propriedades**. O menu do Inspector também oferece ações equivalentes.

## Colocar uma peça dentro de um grupo

1. Crie ou escolha um objeto vazio chamado \`GrupoPorta\`.
2. Selecione \`Porta\`, mantenha o toque na linha e escolha **Mudar pai**.
3. Quando aparecer **Toque no novo pai na hierarquia**, toque em GrupoPorta.
4. Expanda GrupoPorta e confira Porta abaixo dele.
5. Observe a pose no Viewport, mova GrupoPorta e verifique que Porta o acompanha.
6. Use Undo para desfazer a última ação; repita para desfazer a troca de pai.

A operação do editor tenta **preservar a pose no mundo** durante a troca. Os números locais podem mudar mesmo quando o objeto não se move visualmente. **Mover para raiz** aplica a mesma intenção.

## Ordenar não é mover no espaço

**Mover acima / Mover abaixo** reorganiza irmãos na árvore. Para deslocar a peça na cena, altere sua transformação. Renomear ajuda a descoberta, mas não substitui a identidade usada em referências.

## Quando a troca é recusada

| Situação | O que fazer |
|---|---|
| Tentativa de colocar um pai dentro do próprio descendente | Escolha um pai fora daquele ramo; ciclos não são válidos |
| Transformação incompatível | Confira escala do pai e da peça; escala singular ou combinação que exige cisalhamento pode impedir preservar a pose |
| Você tocou no alvo errado | Cancele/refaça a operação; confira a árvore antes de outra edição |

Não zere escalas para “esconder” um objeto que precisa participar de parenting. Use o estado ativo quando esse for o objetivo.

## Parenting em C# é uma escolha explícita

${api('GameObject')} expõe \`SetParent(parent, index, posePolicy)\`. O padrão da API é \`KeepLocal\`, diferente da operação de preservação de mundo do editor. Declare \`ReparentPosePolicy.KeepWorld\` quando essa for a intenção. Veja o exemplo numérico em ${link('conceitos/espaco-local-e-mundo', 'espaço local e mundo')}.

Grave e reabra a cena para conferir relação e pose. Para transformar essa montagem em recurso reutilizável, use **Criar prefab da seleção** no menu do Inspector; acompanhe diferenças pela ação **Comparar com a fonte do prefab**. ${roadmap('roadmap/objetos-e-scripts')}.
`),
p('gizmos-e-coordenadas', 'Gizmos e coordenadas', 'Use seleção, movimento, rotação e escala com um resultado que você possa conferir.', `
## Acesso e escolha da ferramenta

**Caminho:** selecione um objeto → trilho de ferramentas do **Viewport**. Os ícones correspondem a **Select**, **Move**, **Rotate** e **Scale**. Os controles Orbit/Pan/Zoom navegam na vista; não são as ferramentas de transformação.

1. Selecione uma peça assimétrica, como uma caixa alongada.
2. Escolha Move e arraste uma alça do gizmo; observe o eixo afetado no Inspector.
3. Use Undo uma vez para restaurar o arraste completo.
4. Escolha Rotate e faça uma rotação pequena. A forma assimétrica torna o resultado visível.
5. Escolha Scale e confira as dimensões aparentes e os valores locais.

Para repetir um alinhamento, digite os valores de posição, rotação e escala no Inspector em vez de tentar reproduzir um gesto.

## Exercício: deslocamento local e posição no mundo

Crie um pai em X = 10 e um filho com X local = 2, sem rotação e com escala 1. O filho fica em X de mundo = 12. Mover o pai para X = 20 leva o filho para X de mundo = 22, mesmo sem alterar os 2 locais.

Ao girar o pai, os eixos locais do filho também giram. Não conclua que “X está errado” olhando apenas a orientação da tela. ${link('conceitos/espaco-local-e-mundo', 'Veja a diferença de referenciais')}.

## Valores precisos e reutilização

No menu do Inspector ficam **Copiar transformação**, **Colar transformação** e **Redefinir transformação**. Copiar a pose de um objeto sob outro pai pode produzir outro resultado de mundo; confira o referencial antes de aplicar em lote.

Os campos numéricos permitem o modo **Expressão** quando o editor o oferece. Use, por exemplo, \`2 + 3\`, confira o resultado apresentado e confirme. Não aplique uma fórmula em um campo de enum ou de recurso.

## Não disputar a pose com outro sistema

Um corpo dinâmico, Character, Path Follow ou constraint pode controlar a transformação em Play. Um arraste autoral não equivale a aplicar força. Veja ${link('conceitos/autoridade-de-transformacao', 'quem escreve a pose')} e ${link('sistemas/fisica-3d', 'movimento físico')}.

A API \`Object.Rotate\` recebe radianos, enquanto alguns campos do Inspector declaram graus. Respeite a unidade de cada operação; veja ${link('conceitos/unidades-e-convencoes', 'conversão com exemplos')}. Não há promessa aqui de atalhos de teclado ou snap iguais aos de outras engines.
`),
p('inspector', 'Inspector', 'Encontre grupos e campos, edite recursos e confira as condições de uma propriedade.', `
## Chegar à propriedade certa

**Caminho:** **Hierarquia** → objeto → **Inspector**. O cabeçalho mostra o nome, estado ativo e controles do alvo. Em tela compacta, abra Inspector no seletor de painéis. O cadeado fixa o objeto inspecionado.

Use **Inspeção** para ler e editar valores, e **Componentes** para trabalhar com a composição. Componentes podem ser expandidos, agrupados ou paginados conforme o espaço. O menu oferece **Propriedades (janela)** para ampliar a inspeção do objeto.

## Exemplo: mudar a lente de uma câmera

1. Selecione o objeto que possui ${component('astra.camera')}.
2. Abra o componente e o grupo **Lente**.
3. Em **Projeção**, escolha Perspectiva. Ajuste **FOV vertical** e os planos próximo/distante.
4. Troque para Ortográfica: a **meia-altura ortográfica** passa a ser o controle de tamanho relevante.
5. Abra o grupo **Saída** e confira **Usar no Play** e prioridade.
6. Salve, entre em Play e observe a mesma geometria. Volte para editar e reabra a cena para conferir os valores autorais.

A tabela da página do componente liga cada propriedade a seu caminho, valor inicial, domínio e condição. Um campo escondido pela projeção não é uma instrução para procurar outro componente.

## Cada campo pede uma interação diferente

| Campo | Como usar | Erro frequente |
|---|---|---|
| Número/vetor | Editar valor e conferir unidade/limite | Confundir dimensão completa com meia-dimensão |
| Enum | Escolher uma opção do controle | Copiar um número de enum de outra engine |
| Referência de objeto | Escolher um alvo compatível | Referenciar objeto sem o componente exigido |
| Recurso | Usar o seletor de recurso/slot | Colar um ID que não está registrado |
| Coleção | Selecionar entrada e editar sua configuração | Alterar o slot errado de material/clipe |

## Campo não aparece ou não aceita edição

Confira primeiro o **objeto fixado**, a aba, a página do componente e a condição do campo. Durante Play, há regras diferentes para editar valores e alterar a composição. Uma propriedade estrutural não se torna mutável só porque aparece no painel.

Para remover um componente, verifique dependências antes. Para valores em Debug, diferencie informação calculada de propriedade autoral. ${link('editor/dependencias-e-conflitos', 'Veja recusas de composição')} e ${link('conceitos/play-e-cena-autoral', 'edição versus execução')}.
`),
p('adicionar-componentes', 'Adicionar componentes', 'Localize a capacidade, resolva a composição e configure seu primeiro efeito.', `
## Caminho de criação

**Hierarquia → selecione o objeto → Inspector → Componentes → Adicionar componente (+) → família → subfamília → nome.** Em alturas menores, o controle + pode ficar no cabeçalho do Inspector. A busca do catálogo ajuda quando você conhece a função, mas não o nome.

O ${link('componentes', 'catálogo')} publica o nome real de cada componente e sua família. **Image/UiImage não é um componente do Add**: é um elemento do documento associado a Canvas UI; siga ${link('ui/comece-aqui', 'UI de jogo')}.

## Exemplo: criar uma caixa física

1. Selecione a caixa visual.
2. Adicione **Física 3D → Corpos → Corpo físico**.
3. Adicione **Física 3D → Formas → Colisor 3D**.
4. No Corpo físico, mude o movimento de **Estático** para **Dinâmico** e confira a massa.
5. No Colisor, escolha Caixa e ajuste as meias-dimensões para cobrir a geometria.
6. Posicione acima de um piso com composição física própria; salve e entre em Play.

Uma malha visível sozinha não cria colisão. A composição e os campos completos estão em ${component('astra.physics.body')} e ${component('astra.physics.collider')}; o cenário está em ${link('sistemas/fisica-3d', 'Física 3D')}.

## Antes de confirmar o Add

Leia a prévia de **Composição** e **Valores**, quando apresentada. Ela ajuda a distinguir os componentes necessários dos campos iniciais. Confira multiplicidade, dependências e conflitos. Ao final, expanda o componente no Inspector e altere um campo com resultado observável.

## Anexar um comportamento C#

Crie e compile o script pela área de código. Depois da publicação da compilação, volte ao objeto e ao Add: os scripts registrados entram na lista de comportamentos disponíveis. Escolha o tipo que declarou o identificador do componente. Texto salvo com erro não cria um tipo utilizável. ${link('editor/codigo-e-compilacao', 'Passo a passo de C#')}.

## Se a ação estiver indisponível

Pode haver uma dependência ausente, um tipo único já anexado, conflito ou mudança proibida na sessão Play. Pare a execução para compor autoralmente e siga ${link('editor/dependencias-e-conflitos', 'o motivo da recusa')}. Um nome no roadmap não cria um item no menu. ${roadmap('roadmap/registro-de-familias')}.
`),
p('dependencias-e-conflitos', 'Dependências e conflitos', 'Resolva uma composição recusada sem remover componentes ao acaso.', `
## Onde ler o motivo

**Caminho:** Inspector → Componentes → Add ou ação de remoção. Compare a mensagem com as seções **Composição**, **Requisitos**, **Conflitos** e **Mutabilidade** da ficha no ${link('componentes', 'catálogo')}.

| Regra | Significado | Correção |
|---|---|---|
| Requisito | Outro componente precisa existir para este funcionar | Monte a dependência no objeto exigido |
| Conflito | Os tipos não podem coexistir naquela composição | Escolha o sistema responsável pela função |
| Tipo único | Já existe uma instância permitida | Edite a existente ou remova-a conscientemente |
| Componente em uso | Outro componente ainda depende dele | Remova/adapte o dependente antes |
| Estrutura bloqueada em Play | A sessão não permite aquela mudança | Pare e edite a cena autoral |

## Caso concreto: malha física para personagem

Você importou uma malha com Corpo físico e Colisor, mas deseja um Character. ${component('astra.physics.character')} controla sua própria cápsula e conflita com Corpo físico, Colisor e Motor dinâmico no mesmo objeto. Adicionar todos não torna o personagem mais completo: cria duas autoridades incompatíveis.

Uma alternativa disponível no menu do Inspector é **Criar raiz Character…** para uma malha selecionada compatível. A confirmação explica a nova raiz, a malha como filho visual, a aproximação por cápsula e a retirada de Body/Collider do visual. Leia esses efeitos antes de confirmar. Scripts que procuravam Body precisam ser adaptados; a cápsula não conserva toda a forma anterior.

Depois, ajuste raio/altura, confira a árvore, use Undo para examinar a reversão e siga ${link('sistemas/personagem', 'configuração e movimento do personagem')}.

## Referência não é dependência satisfeita

Um campo apontando para outro objeto precisa resolver um objeto que possui a função necessária. Exemplo: o alvo ligado de uma junta precisa ser um corpo físico compatível. Um objeto com nome \`Corpo\`, mas sem Body, continua inválido.

## Distinguir erro estrutural de erro de escrita

\`ComponentMissing\` e \`ComponentInUse\` tratam composição; \`TransformOwnedByPhysics\` trata a tentativa de escrever uma pose controlada pela simulação. Use o contrato de ${api('WorldStatus')} e ${link('conceitos/autoridade-de-transformacao', 'autoridade de transformação')} para escolher a operação certa.

Finalize conferindo criação, configuração, Play e reabertura da composição. ${roadmap('roadmap/objetos-e-scripts')} registra evolução, não autorização para ignorar as regras atuais.
`),
p('assets-e-importacao', 'Assets e importação', 'Importe pelo tipo de arquivo, escolha publicação e confira o recurso na cena.', `
## Onde importar

**Caminho:** painel **Arquivos** → ícone de importação de **modelo**, **textura**, **áudio WAV**, **pasta** ou **ambiente**, conforme o conteúdo. Pelo menu **Cena → Recursos importados**, você consulta os recursos já registrados. Essa área fica disponível quando existe conteúdo importado.

Importar registra recursos e pode gerar derivados. Instanciar coloca uma representação na cena. São ações diferentes: um GLB na lista de recursos não é, por si, um objeto visível no mundo.

## Exemplo: trazer um GLB para a cena

1. Abra a importação de modelo em Arquivos e selecione o GLB.
2. Examine o resultado preparado: geometria, imagens, materiais e clipes que foram reconhecidos.
3. Ajuste o perfil de importação, se necessário, e escolha **Aplicar**. Após modificar o perfil, aguarde a preparação coerente com os novos valores.
4. Escolha **Só recurso** para apenas registrar, ou **Na cena** para também criar a instância.
5. Localize a instância na Hierarquia e use **Enquadrar na vista**.
6. Confira materiais, proporção e recursos; salve e reabra o projeto.

Uma falha ou ambiguidade pode impedir publicar. Resolver isso faz parte da importação, não é um motivo para assumir que o botão está quebrado.

## Reimportar sem confundir identidades

Na reimportação, escolhas como **Pela ordem** e **Como novos** afetam a associação de recursos. Só reutilize pela ordem quando a correspondência for a desejada. Tratar como novos cria identidades que podem exigir reassociar componentes existentes.

Preserve o arquivo original e suas dependências. Não substitua manualmente o GUID para fazer uma referência “parecer válida”. ${link('conceitos/cenas-e-recursos', 'Entenda identidade de recursos')}.

## O que conferir por tipo

- **Imagem:** resolução, alfa, cor/espaço de uso e recurso selecionado no slot correto.
- **WAV:** clipe registrado, voz e configuração de reprodução; ${link('sistemas/audio', 'áudio')}.
- **Modelo:** formas, materiais, normais, escala e clipes; ${link('sistemas/importacao-glb', 'GLB em detalhe')}.
- **Documento UI:** associe o \`.aeui\` ao Canvas UI; ${link('ui/comece-aqui', 'fluxo UI')}.

Se algo sumir após reabrir, investigue ${link('diagnostico/asset-nao-encontrado', 'resolução de recurso')}. ${roadmap('roadmap/renderizacao-e-materiais')} explica o recorte visual atual.
`),
p('materiais-e-texturas', 'Materiais e texturas', 'Encontre o slot, configure a superfície e saiba quando a edição afeta outras instâncias.', `
## Acesso

**Caminho do objeto:** Hierarquia → objeto com **Malha** ou **Malha deformável** → Inspector → recurso/slot de material. **Caminho do recurso:** Arquivos ou Cena → Recursos importados → selecione o material/textura. O editor abre a inspeção do recurso correspondente.

Um modelo pode ter várias partes e materiais. Se editar o slot 0 e a parte observada usa o slot 1, a alteração pode estar correta e continuar invisível naquela superfície.

## Exercício: testar uma mudança de material

1. Selecione uma peça bem iluminada e confirme seu material.
2. Anote o slot e mantenha a câmera e a luz estáveis.
3. Altere uma propriedade, como cor ou rugosidade, no nível disponível para o recurso/instância.
4. Observe outra peça que compartilha o material. Se também mudou, você editou o recurso compartilhado.
5. Desfaça e repita no override da instância quando quiser variar só aquele objeto.
6. Salve e reabra para conferir qual camada de dados recebeu a alteração.

## Campos que precisam ser lidos em conjunto

| Ajuste | Para que serve | O que comparar |
|---|---|---|
| Cor + textura base | Aparência da superfície | Textura atribuída e fator de cor |
| Rugosidade + metalicidade | Resposta à iluminação | Reflexo sob a mesma luz |
| Normal | Detalhe de orientação da superfície | Tangentes, intensidade e sentido |
| Emissão | Contribuição emissiva | Valor/fator e limites do renderer |
| Alfa | Transparência/recorte quando suportado | Modo de material e ordenação |

Use os campos reais apresentados pelo Inspector e pela ficha de ${component('astra.render.mesh')}. Não trate todos os recursos de shaders de outra engine como opções já presentes na Astra.

## Se a textura não aparecer

Confira registro do recurso, slot, coordenadas UV, fator de cor e modo de material. Uma normal não substitui geometria; uma emissão não cria automaticamente luz que ilumina outros objetos. Veja ${link('sistemas/materiais', 'material, instância e runtime')} e ${link('sistemas/iluminacao', 'iluminação')}.

Para imagens de HUD, o caminho é diferente: elemento **Image** no documento UI, com textura e layout; ${link('ui/hud-coracoes', 'exemplo de corações')}. ${roadmap('roadmap/renderizacao-e-materiais')}.
`),
p('codigo-e-compilacao', 'Código e compilação', 'Crie um Behavior, publique a compilação e anexe o tipo ao objeto correto.', `
## Abrir a área de código

**Caminho:** editor → **Arquivos** → ícone de código. A área de C# tem arquivos, editor e Console. Na cena, o editor trabalha em landscape; a área de código pode usar outra orientação.

No menu de código ficam **Novo componente C#**, **Novo auxiliar C#**, **Modelos de código…**, **Recompilar projeto**, **Salvar tudo**, **Ir para linha…**, **Desfazer**, **Refazer** e **Fechar arquivo**.

## Fazer um objeto girar

1. Crie **Novo componente C#**. Um auxiliar comum não vira componente anexável só por existir como arquivo.
2. Use o código completo de ${link('comece/primeiro-script-c', 'RotateObject')}: classe derivada de \`Behavior\`, \`ComponentId\` único e \`Update\`.
3. Escolha **Salvar tudo**; confira o indicador de texto salvo.
4. Escolha **Recompilar projeto** e abra **Console → Problemas**.
5. Corrija os erros; para a versão entrar no runtime, confira a publicação da compilação, indicada por **Publicado** quando concluída.
6. Volte à cena, selecione a peça e abra **Inspector → Componentes → Add**. Procure o comportamento compilado e anexe.
7. Entre em Play. A peça deve girar; Stop devolve a cena autoral.

## Campos expostos e identidade

Um campo serializado de script precisa do contrato de propriedade esperado pela Astra, com identidade estável. Ao refatorar, não mude \`ComponentId\` e \`PropertyId\` arbitrariamente: os valores salvos precisam continuar associados ao mesmo significado. Veja ${link('conceitos/serializacao-e-migracao', 'migração de dados')} e ${api('Behavior')}.

## Três estados diferentes

| Estado | O que significa | Próxima ação |
|---|---|---|
| Texto salvo | Arquivo atualizado | Recompilar |
| Compilação publicada | Tipo e código aceitos pelo carregamento | Anexar/configurar |
| Behavior em execução | Objeto ativo e callbacks chamados em Play | Observar a mecânica |

Se o botão de recompilar estiver indisponível, confira compilador ocupado/indisponível e edição de texto ainda em composição pelo teclado. Se compila mas nada ocorre, confira anexação, estado ativo e o escritor de transformação.

${link('editor/console-e-diagnostico', 'Console')} ajuda a separar essas fases. ${link('conceitos/lifecycle-de-behavior', 'Lifecycle')} mostra onde colocar cada operação; ${roadmap('roadmap/objetos-e-scripts')} registra evolução. Os exemplos publicados declaram compilação separada da execução em aparelho.
`),
p('console-e-diagnostico', 'Console e diagnóstico', 'Use Problemas, Registros e filtros para localizar a primeira causa de uma falha.', `
## Abrir e escolher a fase

**Caminho:** Arquivos → área de código → **Console**. As abas **Problemas** e **Registros** atendem a perguntas diferentes: Problemas mostra diagnósticos de compilação; Registros reúne mensagens da execução/editor.

Os controles incluem expansão do console, **Buscar mensagem ou arquivo…**, filtro **Todas origens** e severidades **Erros / Avisos / Info**. O resumo pode mostrar **Compilando**, **Com erros**, **Publicado** ou **Sem erros**.

## Investigar um script que não aparece no Add

1. Salve e solicite **Recompilar projeto**.
2. Abra Problemas e deixe Erros visível.
3. Leia a primeira mensagem com arquivo e linha. Localize a linha na área de código, usando **Ir para linha…** se necessário.
4. Compare o tipo, namespace e assinatura com a referência C# deste snapshot.
5. Corrija e recompile. Só depois confira o Behavior no Add.

Não procure problema de força física enquanto o código ainda não foi publicado. Um erro inicial pode provocar vários diagnósticos posteriores.

## Investigar algo que falha apenas em Play

Abra Registros, retire filtros que escondem a origem e reproduza a ação uma vez. Guarde mensagem, alvo, fase e versão. Para uma operação no mundo, leia também o resultado ou status devolvido pela API.

| Sinal | Pergunta útil | Guia |
|---|---|---|
| StaleHandle / ForeignWorld | A referência veio de outro Play/mundo? | ${link('conceitos/handles-e-lifetime', 'Lifetime')} |
| TransformOwnedByPhysics | Quem tem autoridade sobre a pose? | ${link('conceitos/autoridade-de-transformacao', 'Autoridade')} |
| ComponentMissing | O alvo possui a composição pedida? | ${link('editor/dependencias-e-conflitos', 'Composição')} |
| UnknownResource / ResourceTypeMismatch | O ID resolve o tipo certo? | ${link('diagnostico/asset-nao-encontrado', 'Recursos')} |

## Evitar um diagnóstico enganoso

Uma lista vazia com busca ativa não comprova ausência de erros. Limpe busca, origem e severidade antes de concluir. Não repita uma chamada inválida a cada Update: isso aumenta o ruído sem corrigir sua causa. Reduza o caso a um objeto e uma ação.

Uma compilação sem erros é evidência de compilação. O resultado visual, áudio e comportamento em dispositivo exigem observação própria; consulte ${link('versoes/estado-da-versao', 'evidências da versão')}.
`),
p('undo-e-redo', 'Undo e Redo', 'Desfaça transações e use o histórico para retornar a uma etapa de autoria.', `
## Acesso rápido e histórico

**Caminho:** barra superior da cena → ícones **Undo / Redo**. Um toque executa uma etapa. **Toque prolongado** em um deles abre a janela de histórico.

O histórico permite navegar páginas, mudar a ordem de apresentação e escolher uma etapa. Ao selecionar uma etapa distante, o editor percorre as transações intermediárias; se uma delas falhar, a navegação para no último estado alcançável.

## Exercício para entender a unidade de Undo

1. Selecione uma caixa e anote sua posição.
2. Arraste-a com Move por alguns segundos e solte.
3. Toque Undo uma vez. O arraste é uma transação, não centenas de posições a desfazer.
4. Toque Redo e confira a pose final.
5. Renomeie a caixa, duplique-a e mova a cópia.
6. Abra o histórico por toque prolongado e volte à etapa anterior à duplicação. Confira nome, número de objetos e pose.

Depois de desfazer, uma nova edição pode mudar o caminho de refazer. Leia a lista antes de usar o histórico como se fosse um backup independente.

## Históricos que não são a mesma coisa

| Operação | Onde desfazer | Limite |
|---|---|---|
| Transformação/composição de cena | Undo da cena | Transações autorais suportadas |
| Texto C# | Desfazer / Refazer do editor de código | Buffer de texto, sem reverter uma publicação por si só |
| Documento UI | Histórico da área UI | Operações do documento, confira o alvo |
| Simulação de gameplay | Não é coberta por Undo autoral | Stop encerra a sessão; não rebobina o jogo |
| Arquivo externo/importação/migração | Preserve cópia | Não suponha reversão integral de todos os arquivos derivados |

## Salvar e desfazer

Salvar grava o estado autoral atual. Undo pode produzir outro estado em memória que precisa ser salvo se for o resultado desejado. Antes de fechar, confira se pretende manter a etapa presente ou a anterior.

Para mudanças maiores, trabalhe numa cópia do projeto e verifique reabertura. Veja ${link('editor/projetos-e-modelos', 'preservar projetos')} e ${link('conceitos/play-e-cena-autoral', 'Stop e cena autoral')}. O histórico ajuda a autoria; não substitui estratégia de backup e migração.
`),
p('busca-global', 'Busca global', 'Encontre objetos, recursos e criação por nome, provedor e tipo.', `
## Abrir

**Caminho:** editor de cena em edição → **lupa na barra superior**. O campo informa **Buscar na cena, no projeto e em Criar (t:Tipo h: p: m:)**. Os filtros visíveis são **Tudo / Cena / Projeto / Criar**.

Não confunda esta busca com o Ctrl+K do portal de documentação: são interfaces diferentes.

## Consultas que resolvem tarefas

| Consulta | Onde procura | Uso |
|---|---|---|
| \`h:Jogador\` | Hierarquia da cena | Localizar o objeto mesmo fora da vista |
| \`p:heart\` | Arquivos/recursos do projeto | Encontrar uma imagem pelo trecho do nome |
| \`m:cubo\` | Catálogo de criação | Buscar receita com esse texto no nome |
| \`t:camera\` | Objetos pelo tipo/componente | Localizar quem possui a função de câmera |

Use os nomes presentes no seu projeto. Se o arquivo chama \`coracao-cheio\`, \`p:heart\` não o encontra só porque representa um coração.

## Percurso: encontrar e editar um objeto

1. Abra a lupa e digite \`h:\` seguido do nome ou parte dele.
2. Escolha o resultado correspondente; confira o objeto selecionado.
3. Abra Inspector e faça a alteração.
4. Para localizar uma referência semelhante, use \`t:\` com nome/ID do tipo ou script.
5. Quando terminar, limpe a consulta ou feche a busca para retomar a interação normal da cena.

Palavras múltiplas são combinadas como termos de busca, não uma expressão C#. Prefixos determinam o provedor e podem substituir a escolha do filtro. O filtro de tipo \`t:\` é voltado aos objetos e não continua procurando arquivos e receitas como se fosse texto comum.

## Nenhum resultado

Confira grafia, provedor, termos restantes e a existência do objeto/recurso no projeto aberto. Uma consulta vazia em Tudo não funciona como catálogo completo. Para navegar tudo, abra Hierarquia, Arquivos ou o menu de criação correspondente.

O nome ajuda a encontrar; referências persistentes continuam usando identidade. Renomear um objeto não é o procedimento para migrar seu ID. Veja ${link('conceitos/objetos-e-identidade', 'identidade')} e ${link('editor/assets-e-importacao', 'recursos importados')}.

Quando a pergunta é “onde criar uma função”, comece pelo ${link('editor/mapa-de-acesso', 'mapa de acesso')} e pela família no catálogo, não por um nome copiado de outra engine.
`),
p('atalhos-e-gestos', 'Atalhos e gestos', 'Gestos confirmados do editor, com alvo e efeito de cada interação.', `
## Gestos do editor de cena

| Onde | Interação | Efeito |
|---|---|---|
| Viewport | Toque curto na geometria | Seleciona objeto |
| Viewport em Orbit/Pan/Zoom | Arraste de um dedo | Navega conforme o modo ativo |
| Viewport | Pinça e deslocamento com dois dedos | Zoom e pan combinados |
| Alça de Move/Rotate/Scale | Arrastar e soltar | Transação de transformação |
| Linha da Hierarquia | Toque prolongado | Menu de ações do objeto |
| Hierarquia em multisseleção | Toque em uma linha | Adiciona/retira do conjunto |
| Undo / Redo na barra | Toque | Uma etapa do histórico |
| Undo / Redo na barra | Toque prolongado | Janela de histórico |

Sempre confira o modo ativo: navegar, manipular e pilotar uma câmera não têm o mesmo efeito.

## Teclado aberto e edição de campos

Ao tocar um campo de nome ou número, termine/confirme a edição antes de interpretar o próximo gesto como ação da cena. No editor C#, composição pelo teclado pode temporariamente impedir a recompilação. Use **Salvar tudo**, **Ir para linha…**, **Desfazer** e **Refazer** pelo menu de código quando precisar de uma ação explícita.

Não há nesta página uma promessa de atalhos W/E/R, F ou Ctrl+S iguais aos de um editor desktop. Use controles confirmados pela versão instalada. Os atalhos do portal, como busca da documentação, não são comandos da engine.

## Prática de um minuto

1. Selecione um objeto pela Hierarquia.
2. Use **Enquadrar na vista** no menu do Inspector.
3. Navegue com Orbit e uma pinça, sem editar a pose do objeto.
4. Faça um arraste com Move e solte.
5. Desfaça uma vez e abra o histórico por toque prolongado.

Se a tela ficar apertada, alterne painéis ou use **Cena → Layout dos painéis**. ${link('editor/preferencias', 'Layouts e preferências')} descreve a configuração; ${link('editor/viewport-e-navegacao', 'navegação')} explica a diferença de câmeras.
`),
p('preferencias', 'Preferências e configuração', 'Diferencie layout do editor de entrada, tags e camadas do projeto.', `
## Dois lugares, dois propósitos

**Cena → Layout dos painéis** configura o espaço de trabalho. **Cena → Configurações do projeto** configura contratos usados pela cena/jogo. Na tela inicial também existe **Configurações**, pertencente ao shell; não é o mesmo painel de opções da cena.

| Preciso alterar… | Onde acessar | Afeta |
|---|---|---|
| Disposição dos painéis | Cena → Layout dos painéis | Trabalho no editor |
| Ações e controles | Cena → Configurações do projeto → Entrada | Input do jogo |
| Relações de colisão | Configurações do projeto → Camadas e colisão | Filtragem física |
| Tags | Configurações do projeto → Tags | Classificação dos objetos |
| Água da cena, quando disponível | Configurações do projeto → Água da cena | Capacidade de água da versão |

## Recuperar espaço na tela

1. Abra Layout dos painéis.
2. Escolha/ajuste uma disposição que preserve área útil do Viewport.
3. Use o seletor de painéis em tela compacta para alternar Hierarquia, Inspector e Arquivos.
4. Salve um layout nomeado quando quiser retornar a essa disposição.
5. Para recuperar a composição inicial, use a restauração do layout padrão; o editor confirma **Layout padrão restaurado**.

As preferências de editor são persistidas por projeto em \`.astra/editor-preferences.astra\`. Fixação do Inspector, layout e apresentação de histórico são exemplos de estado de trabalho. Isso não é o SaveStore do jogador.

## Configurar o jogo por um objetivo

Para criar movimento touch, siga ${link('sistemas/input-e-acoes', 'Entrada: ação, vínculo e resposta')}. Para impedir colisão entre dois grupos, configure camadas e confira o par na matriz; veja ${link('sistemas/fisica-3d', 'física e filtros')}. Uma tag não substitui camada de colisão e um contexto de input não desliga objetos da cena.

Não espere nesta área um catálogo universal de idioma, áudio, qualidade e tempo por analogia com outras engines. As opções dependem do consumidor presente no recorte. Recursos visuais ficam também em **Ambiente da cena**, componentes e controles de gráficos.

Para comparar uma mudança de configuração, anote o valor anterior, observe um cenário pequeno e reabra o projeto. Consulte ${link('conceitos/limites-e-capacidades', 'limites efetivos')} quando a opção solicitar algo que o backend pode limitar.
`),
];
