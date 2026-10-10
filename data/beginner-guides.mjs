import { page, link, component, api } from './workflow-guide-tools.mjs';
import { projectStatusMarkdown } from './project.mjs';

export const beginnerLessons = [
  ['instalacao', 'Instalar e conferir a versão'],
  ['primeiro-projeto', 'Criar o projeto CaixaGira'],
  ['conheca-o-editor', 'Encontrar ferramentas e selecionar'],
  ['primeira-cena', 'Montar uma cena visível'],
  ['ler-o-inspector', 'Entender e preencher os campos'],
  ['primeiro-componente', 'Animar sem escrever código'],
  ['primeiro-script-c', 'Entender o primeiro script C#'],
  ['play-e-stop', 'Comparar edição e execução'],
  ['salvar-e-reabrir', 'Conferir o que foi salvo'],
  ['proximos-passos', 'Escolher a próxima mecânica'],
];
const p = (slug, title, description, body, order) => {
  const index = beginnerLessons.findIndex(([id]) => id === slug);
  const result = page('comece', slug, title, description, body.trim(), order);
  const nav = i => i < 0 || i >= beginnerLessons.length ? false : {
    label: beginnerLessons[i][1], link: `/pt-br/snapshot-2026-10-06/comece/${beginnerLessons[i][0]}/`,
  };
  result.options.front.prev = index >= 0 ? nav(index - 1) : false;
  result.options.front.next = index >= 0 ? nav(index + 1) : false;
  if (index >= 0) result.body = `**Etapa ${index + 1} de ${beginnerLessons.length} · Projeto CaixaGira**\n\n${link('comece/indice', 'Ver o percurso completo')}\n\n` + result.body;
  return result;
};
const help = link('comece/ajuda-por-sintoma', 'Ajuda pelo que você está vendo');
const glossary = link('comece/glossario', 'Glossário com exemplos');
const checkpoint = (question, answer) => `\n\n<details>\n<summary>Confira se entendeu: ${question}</summary>\n\n${answer}\n\n</details>\n`;

export const beginnerPages = [
p('indice', 'Comece do zero: um projeto, dez etapas', 'Não precisa conhecer o nome das funções. Siga um mesmo projeto, com caminhos, valores, resultados e ajuda.', `
## O que você vai construir

Uma caixa alongada chamada **CaixaGira**, enquadrada por uma câmera, iluminada e animada. Primeiro você altera campos no editor; depois troca a animação por um script curto, entende cada linha e confere o que permanece depois de salvar e reabrir. É uma cena de aprendizado, ainda sem vitória, personagem ou jogo completo.

Você pode começar sem experiência com C#. O trecho de programação tem explicação linha a linha. Antes de avançar, confira o resultado da etapa: o importante é entender o que mudou, e não terminar a leitura rápido.

## Escolha por onde entrar

| Sua situação | Primeiro caminho |
| --- | --- |
| Nunca abri a Astra | Comece pela instalação e siga a sequência abaixo |
| Já instalei, mas estou perdido na tela | ${link('comece/conheca-o-editor', 'Mapa do editor pelo que você quer fazer')} |
| Não entendi um campo ou uma unidade | ${link('comece/ler-o-inspector', 'Como ler o Inspector')} |
| Algo sumiu, não gira ou não aparece no Play | ${help} |
| Quero criar corações de vida | ${link('ui/hud-coracoes', 'HUD de corações: documento, imagens, vida e scripts')} |
| Não sei se minha ideia é possível nesta prévia | ${link('comece/o-que-posso-criar', 'Capacidades, dependências e limites')} |

## Siga estas dez etapas

| Etapa | Faça | Antes de seguir, você deve conseguir |
| --- | --- | --- |
${beginnerLessons.map(([id, title], i) => `| ${i + 1} | ${link(`comece/${id}`, title)} | ${['Abrir a tela de projetos e identificar o APK utilizado', 'Criar e reabrir CaixaGira sem importar arquivos', 'Selecionar um objeto e encontrar suas propriedades', 'Ver a caixa também pela câmera de Play', 'Explicar posição, rotação, escala e referência', 'Observar uma rotação de 90° feita por campos', 'Explicar como o script produz giro por segundo', 'Distinguir o estado autoral do estado em execução', 'Recuperar nomes, valores, recursos e comportamento', 'Escolher uma expansão com dependências claras'][i]} |`).join('\n')}

Não pule a câmera: ver um objeto no editor não garante vê-lo no Play. Não adicione física nesta primeira montagem: ela tem sua própria autoridade sobre o movimento e dificultaria identificar quem está girando a caixa.

## Como usar cada aula

1. Leia **o objetivo e a preparação**. Se faltar uma etapa, use o link para voltar.
2. Siga o **caminho de acesso**. A seta significa a ordem das telas ou controles, não uma pasta no aparelho.
3. Preencha os **valores do exercício**. Eles não substituem os padrões ou limites da referência.
4. Observe o **resultado esperado**. Quando não acontecer, leia a recuperação antes de acrescentar componentes.
5. Faça a **pequena variação** para conferir que entendeu a causa do resultado.

As instruções foram confrontadas com o código do snapshot. Os resultados são roteiros para você conferir na sua instalação; esta revisão das docs não inclui nova execução do aplicativo em aparelho. O exemplo C# já possui evidência de compilação separada da execução.

## Ajuda sem precisar conhecer a API

${help} · ${glossary} · ${link('comece/perguntas-frequentes', 'Perguntas de quem está começando')} · [Comunidade oficial no Discord](https://discord.gg/KpqnBvt4uG)

Ao pedir ajuda, diga a etapa, o que fez, o que esperava e o que apareceu. ${link('comece/ajuda-por-sintoma', 'Veja um modelo de relato com as informações necessárias')}.
`, 0),

p('visao-geral', 'Entenda a Astra antes de começar', 'O que é a engine, o que você cria e como interpretar esta prévia.', `
${projectStatusMarkdown}

## O que significa engine

A engine reúne ferramentas para montar cenas e sistemas que executam essas cenas. Você cria os dados no **editor**; o **runtime** usa esses dados para desenhar, atualizar comportamentos e processar os sistemas disponíveis. Um projeto não vira jogo apenas por ter objetos: ele precisa de regras, entrada do jogador, feedback e uma forma de começar e terminar.

Na Astra atual, você organiza objetos em uma cena, acrescenta componentes, configura campos e programa comportamentos em C#. O editor de cena usa o aparelho em landscape. A área de código é uma ferramenta diferente e pode usar outra orientação.

## As cinco coisas que não devem ser confundidas

| Coisa | Exemplo | Onde você encontra |
| --- | --- | --- |
| Projeto | CaixaGira, contendo cena, scripts e recursos | Tela de projetos |
| Objeto | A caixa que você seleciona | Hierarquia da cena |
| Componente | Câmera, Corpo físico ou Transform Tween | Inspector do objeto |
| Recurso | Imagem, modelo ou documento .aeui | Arquivos / recursos importados |
| Elemento UI | Image de um coração dentro do documento | Editor do documento UI |

O nome de uma imagem não é uma referência ao recurso, e Image/UiImage não é um componente de cena que você adiciona pelo menu genérico. ${link('ui/comece-aqui', 'Veja os dois níveis da UI')}.

## O que esta documentação garante

**Conferido em fonte**: contrato observado no código. **Compilação conferida**: o exemplo passou pelo compilador identificado no manifesto. **Execução conferida** exigiria um cenário realmente executado. São evidências diferentes. Nem a presença de um nome no catálogo, nem uma screenshot provam todos os usos desse sistema.

O snapshot documenta a geração C# de 06/10/2026. Planos de outra geração ou tarefas locais posteriores não significam que o APK público recebeu esses recursos. Consulte [Atualizações](/atualizacoes/) e a disponibilidade indicada em cada nota.

## Seu primeiro caminho

Abra ${link('comece/indice', 'a trilha do zero')}. Para consultar uma função específica, use o ${link('editor/mapa-de-acesso', 'mapa de acesso')}. Quando aparecer um termo novo, consulte o ${glossary}.
`, 1),

p('requisitos-e-compatibilidade', 'Antes de instalar: versão e compatibilidade', 'Confira o aparelho, preserve seus projetos e separe falha de instalação de falha da cena.', `
## Requisitos do APK público

Abra [Download](/download/) e confira os dados do pacote realmente oferecido. Esta distribuição exige **Android 8.0 ou superior, ARM64 e Vulkan 1.1**. **Aparelhos com páginas de memória de 16 KB não são suportados por este pacote**. Não há neste portal um instalador público equivalente para Windows ou iOS.

Cumprir a versão do Android não confirma sozinho a arquitetura, a GPU ou a compatibilidade do driver. Nenhuma lista universal de aparelhos compatíveis foi validada nesta revisão. Use uma cena pequena para começar e registre o aparelho quando houver falha.

## Espaço, memória e tamanho de cena

Não existe aqui um número seguro de RAM, FPS ou tamanho de projeto que sirva para todos os dispositivos. Um modelo pode exigir os arquivos originais, dados derivados e texturas ao mesmo tempo. Comece sem importações; depois adicione um recurso por vez. Se uma cena vazia funciona e a cena importada falha, preserve ambas: essa diferença ajuda a localizar o problema.

## Antes de atualizar uma instalação

Guarde uma cópia recuperável do projeto inteiro fora dos dados do aplicativo, incluindo recursos e scripts. Não use desinstalar ou limpar dados como primeira tentativa de reparo. Pacotes assinados com chaves diferentes não podem substituir um ao outro diretamente; o Android pode exigir reinstalação, que pode apagar dados locais.

## Informações úteis para suporte

Anote versão do APK, modelo do aparelho, Android e momento da falha: instalar, iniciar, abrir projeto, importar, compilar ou entrar em Play. Se o aplicativo abre, informe também cena e recurso envolvidos. ${link('comece/ajuda-por-sintoma', 'Modelo de relato e diagnóstico por sintoma')}.
`, 2),

p('instalacao', 'Instale e faça o primeiro contato', 'Baixe a prévia, entenda a instalação Android e chegue à tela de projetos.', `
## Objetivo e preparação

Terminar esta etapa com a Astra aberta na tela de projetos. Você precisa de um aparelho compatível, espaço para o APK e seus dados e, se já usa a engine, uma cópia segura dos projetos. Leia ${link('comece/requisitos-e-compatibilidade', 'os requisitos do pacote')}.

## Caminho: site → APK → Android → Astra

1. Abra [Download](/download/) no aparelho e confira versão, requisitos e tamanho.
2. Use **Baixar APK**. Aguarde o arquivo terminar; não instale uma cópia parcialmente baixada.
3. Abra o arquivo pelo download do navegador ou pelo gerenciador de arquivos.
4. Se o Android pedir permissão para instalar por esse aplicativo, abra a configuração indicada pelo sistema e autorize a origem usada. A redação e o caminho variam entre fabricantes; isso é uma tela do Android.
5. Volte ao arquivo, conclua a instalação e abra a Astra.
6. Identifique a versão pelo pacote e pelas [notas da distribuição](/atualizacoes/#2026-10-07-apk-preview-u07). Você deve chegar à lista de projetos, antes de criar sua cena.

A instalação pública é **Astra**, pacote **dev.aether.editor**. **Astra Dev** é separada, para desenvolvimento; não precisa ser instalada para este curso. Nesta prévia, **U07 Laboratório de Controle** é o único exemplo embutido e editável. Seus projetos próprios continuam na lista. O laboratório não substitui o projeto **CaixaGira** do exercício.

O SHA-256 no Download permite comparar a integridade do arquivo com o manifesto. Ele não é uma senha nem um código que você deve digitar na Astra.

## Se não chegar à lista de projetos

| O que apareceu | O que conferir |
| --- | --- |
| Instalação bloqueada pela origem | Permissão de instalar pelo navegador/gerenciador usado |
| Arquivo inválido ou download interrompido | Baixe novamente e compare tamanho/hash do manifesto |
| Aplicativo incompatível | Android, ARM64, Vulkan e limite de páginas de memória |
| Pacote em conflito com a instalação anterior | Assinatura diferente; preserve os dados antes de reinstalar |
| Instala, mas fecha ao abrir | Informe aparelho, Android, versão e instante da falha no Discord |

Não contorne uma falha apagando o projeto. Preserve o arquivo e o erro para investigação.

## Confira antes de seguir

Abra e feche o aplicativo sem importar nada. Se ele retorna à lista de projetos, prossiga para criar **CaixaGira**. Instalar o APK ainda não é o mesmo que conseguir executar qualquer cena pesada.
`, 3),

p('primeiro-projeto', 'Crie o projeto CaixaGira', 'Do nome do projeto à primeira gravação, sem modelos nem arquivos externos.', `
## Objetivo e preparação

Criar uma base vazia que possa ser reaberta. Comece na tela de projetos, após a instalação. **CaixaGira é o nome do projeto neste exercício**; não é um modelo que precisa existir no catálogo.

## Caminho exato

**Tela de projetos → Novo projeto → Novo projeto vazio → Nome do projeto → Criar projeto.**

1. Escolha **Novo projeto vazio** para controlar o que entra na cena.
2. No campo **Nome do projeto**, escreva \`CaixaGira\`.
3. Confirme **Criar projeto**. Abra o projeto na lista se ele ainda não estiver aberto.
4. Use o aparelho em **landscape** no editor de cena. Não procure o código como um painel permanente ao lado de todas as ferramentas.
5. Use **Salvar**, na barra do editor. Volte à lista e abra **CaixaGira** novamente.

## O campo Nome do projeto

O nome identifica o projeto, não um objeto dentro dele. Evite nome vazio, nome já existente e caracteres de caminho \`/ \\ : * ? " < > |\`. Para uma segunda tentativa, use \`CaixaGiraTreino\` em vez de sobrescrever um projeto importante. Nomes descritivos são melhores que “teste2final”.

## Resultado esperado

Você encontra CaixaGira na lista e consegue voltar ao editor. A cena vazia pode não mostrar geometria: isso não significa que o projeto falhou. Os objetos serão criados na etapa da primeira cena.

## Quando não funciona

**Criar foi recusado:** confira nome e existência de outro projeto com o mesmo nome. **Não encontro o projeto:** volte à tela de projetos e confira o nome utilizado. **Não abre após salvar:** registre a versão e o erro; não comece uma importação grande para tentar corrigir a base.

## Exercício curto

Antes de criar objetos, diga qual nome é o projeto e qual será o nome da caixa. Ambos podem ser CaixaGira, mas são identidades diferentes. O projeto reúne arquivos; a caixa será um objeto selecionável na Hierarquia.
${checkpoint('uma cena vazia está quebrada?', 'Não necessariamente. Criar um projeto vazio não obriga a criar geometria, câmera e regras de jogo automaticamente. Confira primeiro se o projeto existe e reabre.')}
`, 4),

p('conheca-o-editor', 'Encontre as ferramentas pelo que quer fazer', 'Um mapa de ações, seleção e navegação, com diferenças entre telefone e tela maior.', `
## Objetivo

Encontrar o lugar da ação sem memorizar a engine inteira. Use **CaixaGira** aberto. Em uma cena vazia, deixe a criação de objetos para a próxima aula; aqui você aprende os destinos.

| Quero… | Onde ir | O que esse lugar faz |
| --- | --- | --- |
| Ver e enquadrar a cena | Viewport | Mostra a vista de edição e os manipuladores |
| Encontrar um objeto mesmo escondido | Hierarquia | Lista a organização de objetos e filhos |
| Alterar os valores de um objeto | Selecione na Hierarquia → Inspector | Exibe atributos e componentes da seleção |
| Criar um objeto | Hierarquia → + | Abre **Criar objeto**, com busca e categorias |
| Adicionar uma função a um objeto existente | Inspector → Componentes → Adicionar componente (+) | Mostra famílias, composição e valores |
| Trabalhar com arquivos ou scripts | Arquivos → ícone de código para a área C# | Separa recurso/arquivo de comportamento anexado |
| Ajustar o ambiente | Cena → Ambiente da cena | Configura o contexto da cena, não um objeto qualquer |
| Editar uma interface de jogo | Cena → Interface (UI + ImGui) | Abre ferramentas próprias de UI |
| Ver o resultado executando | Play; Stop para voltar | Entra/sai do mundo em execução |

## Em tela pequena

Use o seletor **Viewport / Hierarquia / Inspector / Arquivos** para alternar a área necessária. Um painel que não está visível pode estar apenas em outro destino. Na criação, o detalhe pode aparecer abaixo da lista; em uma tela maior ele fica ao lado. O botão de adicionar componente também pode mudar de posição no cabeçalho compacto. Procure a função, não uma coordenada fixa de pixels.

## Selecionar antes de editar

Na Hierarquia, toque no objeto e depois abra o Inspector. Confira o nome no cabeçalho. Se você seleciona outro objeto, mas o Inspector continua mostrando o anterior, veja se o **bloqueio do Inspector** está ligado. Desbloqueie para acompanhar a seleção.

Toque prolongado em um objeto abre ações contextuais como renomear, duplicar, excluir e reorganizar. Não confunda renomear com substituir o tipo do objeto. Duplicar também não cria automaticamente uma regra de spawn no jogo.

## Navegar não é mover o objeto

**Orbitar, deslocar a vista e aproximar** mudam como você observa a cena. **Mover, girar e escalar** alteram o objeto selecionado. O gizmo é o manipulador com eixos/alças. Se só a vista mudou, os números da transformação do objeto devem continuar iguais.

## Voltar de um erro

Use Desfazer/Refazer para uma edição recente; o toque prolongado abre o histórico correspondente. Código e UI possuem contextos de edição próprios. Histórico não é backup: preservar uma cópia continua sendo necessário antes de alterações arriscadas.

Mais detalhes: ${link('editor/indice', 'Manual por tarefa')} e ${link('editor/mapa-de-acesso', 'Mapa de funções, UI e APIs')}.
${checkpoint('olhei a caixa de outro lado; eu movi a caixa?', 'Só se você usou a ferramenta de transformar o objeto. Orbitar a vista muda o observador, não a posição autoral da caixa. Confira os campos no Inspector.')}
`, 5),

p('primeira-cena', 'Monte uma cena que aparece no Play', 'Crie uma caixa alongada, ilumine e capture o enquadramento numa câmera.', `
## Objetivo e preparação

Ver a mesma caixa no editor e no Play. Abra CaixaGira, pare o Play se estiver ativo e mantenha a criação **na raiz**, sem colocar luz/câmera como filhos da caixa. Ter uma câmera como filha da caixa que gira produziria outro resultado.

## 1. Crie o Cubo

**Hierarquia → + → Criar objeto → Geometria → Cubo → Criar.** A busca também aceita **Cubo**. Não escolha **Caixa dinâmica**: essa receita acrescenta física, que ainda não queremos.

Selecione o novo objeto, use Renomear no contexto da Hierarquia e escreva **CaixaGira**. Vá ao **Inspector → atributos → transformação** e preencha:

| Campo | Valor do exercício | Por quê |
| --- | --- | --- |
| Posição X / Y / Z | 0 / 0 / 0 | Facilita localizar a caixa na origem |
| Rotação X / Y / Z | 0 / 0 / 0 graus | Estabelece uma pose inicial conhecida |
| Escala X / Y / Z | 2 / 1 / 1 | Deixa a caixa alongada para perceber o giro |

São valores da aula, não uma imposição para qualquer projeto. Escala 1 mantém o tamanho base; escala 0 pode esconder/degenerar a geometria. A transformação local também depende do pai, por isso começamos na raiz.

## 2. Enquadre pela vista de edição

Use a navegação do viewport para enxergar a caixa de frente e um pouco de lado, com espaço à sua volta. Evite ficar dentro da geometria. Você pode selecionar pela Hierarquia mesmo se a caixa estiver fora do enquadramento. Se necessário, volte aos valores acima e procure a origem.

Não há nesta aula uma pose numérica universal para a câmera: a criação da câmera usa a vista que você preparou, evitando depender de uma convenção de orientação presumida.

## 3. Adicione iluminação

**Hierarquia → + → Luzes → Luz direcional → Criar.** Renomeie para **LuzPrincipal** e confira que ela está na raiz. A receita cria luz direcional e a orienta a partir da vista. Ajustar a rotação muda a direção da iluminação; mover uma luz direcional não equivale a mover uma lâmpada de alcance local.

Comece com os valores da receita. Se ficar escuro, confira se a luz existe e está ativa, seu tipo/direção e o material; não aumente vários campos e configurações de qualidade de uma vez. ${component('astra.render.light')} traz os campos completos e suas unidades.

## 4. Crie a câmera a partir da vista

Com a caixa ainda bem enquadrada: **Hierarquia → + → Básicos → Câmera → Criar**. Essa receita captura a pose da vista de edição. Renomeie para **CameraPrincipal**. No Inspector, abra ${component('astra.camera')}:

| Grupo / campo | Padrão do componente | Escolha nesta aula | Efeito |
| --- | --- | --- | --- |
| Lente / Projeção | Perspectiva | Perspectiva | Distância influencia o tamanho aparente |
| Lente / Campo vertical | 60° | 60° | Ângulo vertical de visão |
| Lente / Próximo | 0,1 m | 0,1 m | Recorte próximo; evite a câmera dentro da caixa |
| Lente / Distante | 2000 m | Mantenha inicialmente | Recorte distante, não qualidade da malha |
| Saída / Usar no Play | Verdadeiro | Ligado | Habilita esta câmera para execução |
| Saída / Prioridade | 0 | 0, com apenas uma câmera | Participa da seleção da câmera |

## 5. Salve e observe

Use **Salvar**, entre em **Play** e confira se a caixa aparece. Ela ainda não deve girar. Use **Stop** antes de continuar editando. A vista de edição e a câmera do jogo são coisas diferentes, mesmo que tenham o mesmo enquadramento neste momento.

## Se o Play não mostrar a caixa

1. Há uma CameraPrincipal na Hierarquia com Câmera e **Usar no Play** ligado?
2. A caixa está ativa, com escala diferente de zero e geometria visível?
3. A câmera foi criada **depois** de enquadrar a caixa? Se foi antes, ajuste/pilote a câmera pelo ${link('editor/indice', 'manual de câmera')} ou refaça apenas a câmera nesta cena de treino.
4. Há outra câmera disputando a saída? Mantenha apenas a câmera desta aula habilitada.
5. A caixa está fora do recorte, escura ou escondida? Separe enquadramento de iluminação antes de modificar a cena.

## Exercício curto

Altere só Escala X de 2 para 3, observe e volte para 2. Você deve mudar o formato da caixa, não o zoom da câmera. Salve a pose inicial antes da animação.
${checkpoint('se o Cubo existe, ele já tem gravidade e colisão?', 'Não. Geometria visível não prova composição física. Corpo físico e Colisor 3D são capacidades adicionais, descritas no capítulo de física.')}
`, 6),

p('ler-o-inspector', 'Como preencher e entender cada tipo de campo', 'Números, unidades, opções, referências, recursos e condições com exemplos concretos.', `
## Antes de preencher qualquer coisa

**Hierarquia → selecione o objeto → Inspector → grupo/componente → campo.** Confira o nome do objeto e o componente. O mesmo rótulo, como **Ativo**, pode controlar um objeto, uma luz, um tween ou outra função. Desativar uma função não significa apagar o objeto.

Leia o campo em quatro partes: **qual dado ele muda**, **qual unidade usa**, **quando tem efeito** e **quem o consome**. Se só mudar um número sem verificar o resultado, você não sabe ainda se está editando a função correta.

## Números, vetores e unidades

| Tipo | Como ler | Exemplo para experimentar | Erro comum |
| --- | --- | --- | --- |
| Número com unidade | A unidade faz parte do significado | Duração 2 s leva o dobro de 1 s para o mesmo tween | Tratar duração como velocidade |
| X / Y / Z | Três eixos de um vetor | Escala 2 / 1 / 1 alonga apenas X | Escrever 2 nos três eixos e aumentar tudo |
| Graus no Inspector | Uma volta completa é 360° | Rotação Y 90° é um quarto de volta | Reusar esse número numa API em radianos |
| Radianos na API de rotação | Uma volta é aproximadamente 6,283 rad | 0,5 rad/s é aproximadamente 28,65°/s | Passar 90 esperando um quarto de volta |
| Massa em kg | Propriedade de um corpo físico | 1 kg é o padrão do Corpo físico | Esperar que massa sozinha faça a malha cair |
| Meia extensão de forma | Metade do tamanho em um eixo | Meia extensão 0,5 corresponde a tamanho 1 nesse eixo | Confundir tamanho completo com metade |

Os números de código C# usam ponto, como \`0.5f\`. As explicações em português podem usar vírgula, como 0,5. Confira o formato aceito pelo controle numérico da sua instalação antes de confirmar; não cole “2 segundos” num campo que pede apenas um número.

## Local e mundo: qual posição você está mudando?

**Local** é relativo ao pai; **mundo** é a pose resultante na cena. Uma caixa filha de um objeto movido pode estar em Local X = 0 e ainda longe da origem do mundo. Na trilha, criamos na raiz para reduzir essa ambiguidade. ${link('conceitos/indice', 'Exemplos de referencial e parentesco')} explicam como escalar/rotacionar o pai afeta os filhos.

## Opções e booleanos

Uma **enumeração** escolhe uma opção de um conjunto: Projeção = Perspectiva ou Ortográfica; Movimento do corpo = Estático, Cinemático ou Dinâmico. Não escreva uma opção inventada. Um **booleano** liga/desliga uma função: Girar, Mover, Usar no Play. No tween, preencher Rotação Y não basta quando **Girar** está desligado.

## Referência de objeto não é o nome digitado

Na câmera seguidora, **Alvo** recebe uma referência ao objeto que deve ser acompanhado. Escolha o objeto no seletor. Renomear um objeto para “Jogador” não o vincula automaticamente a todos os campos chamados Alvo. Uma referência vazia pode deixar a função sem receptor. Confira também as restrições do seletor: algumas referências não aceitam um objeto da própria subárvore.

## Recurso não é qualquer arquivo

Uma imagem importada, um documento UI e um clipe possuem tipos diferentes. Importar registra o recurso; atribuir liga esse recurso a um consumidor. Para um coração, a imagem é usada por **Image** no documento; o documento é usado por **Canvas UI** no objeto da cena. Sem essa cadeia, ter o PNG em Arquivos não desenha o HUD.

Leia ${link('ui/image', 'Image / UiImage: recurso, tamanho, tint e recorte')} e ${link('ui/hud-coracoes', 'a montagem completa dos corações')}. Os seletores devem receber um recurso compatível, não um caminho presumido de outra máquina.

## Campos condicionais e slots

**Meia altura** da câmera faz sentido em Ortográfica; não é o controle de zoom da perspectiva. Um grupo avançado pode ficar recolhido. Propriedades por **slot** referem-se a uma parte/recurso da coleção: escolha o slot certo antes de editar. Vários materiais no mesmo objeto não recebem necessariamente o mesmo valor.

Se o campo não está presente, confira modo, grupo, tipo e versão. Não acrescente um componente com nome parecido apenas para fazer o campo aparecer.

## Padrão, exemplo e limite são diferentes

**Padrão** é o valor lido de um componente recém-criado. **Valor do exercício** é uma escolha para observar um efeito. **Domínio** é o conjunto aceito pelo contrato, não uma recomendação de qualidade. **Receita de criação** pode configurar valores diferentes do padrão do componente isolado.

O ${link('componentes', 'catálogo de componentes')} permite buscar o nome ou ID do campo e ler caminho, unidade, domínio, condição e efeito. Depois de editar: observe, salve, reabra e confira no Play. Uma propriedade em referência ainda não representa aceite de todo cenário em Android.

## Exercício curto

Selecione CaixaGira, mude Escala X de 2 para 3, observe e volte. Depois confira **Campo vertical** da câmera sem modificá-lo. Explique por que um campo muda a geometria e o outro muda a lente.
${checkpoint('posso usar 90 tanto no Inspector quanto em Object.Rotate?', 'Não sem conferir a unidade. Nesta API de rotação o ângulo é em radianos; o Inspector apresenta graus. O nome “rotação” sozinho não garante a mesma representação.')}
`, 7),

p('primeiro-componente', 'Anime a caixa sem escrever código', 'Adicione Transform Tween e veja como cada opção participa de uma rotação de 90 graus.', `
## Objetivo e preparação

Fazer CaixaGira girar de 0° para 90° em dois segundos. Você precisa da caixa alongada, luz e câmera da etapa anterior. Fique em **edição**, selecione **CaixaGira** e mantenha Rotação X/Y/Z em 0. Não adicione corpo físico, script de movimento ou outro tween para a mesma transformação nesta montagem.

## Caminho para adicionar

**Hierarquia → CaixaGira → Inspector → Componentes → Adicionar componente (+) → Lógica → Tempo → Transform Tween.**

Confira a prévia de composição e confirme **Adicionar**. Na tela compacta, procure o + no cabeçalho. Você está acrescentando uma função ao objeto já existente; não criando outro objeto.

Abra ${component('astra.tween.transform')} e configure:

| Grupo / campo | Padrão | Valor da aula | O que muda |
| --- | --- | --- | --- |
| Tempo / Duração | 1 s | 2 s | Tempo para completar o movimento |
| Tempo / Espera | 0 s | 0 s | Começa sem atraso |
| Tempo / Ativo | Ligado | Ligado | Permite o funcionamento |
| Tempo / Iniciar no Play | Ligado | Ligado | Dispara ao iniciar a execução |
| Tempo / Curva | Linear | Linear | Avanço uniforme no tempo |
| Destino / Mover | Ligado | **Desligado** | Evita levar a caixa ao destino de posição |
| Destino / Girar | Desligado | **Ligado** | Habilita o canal de rotação |
| Destino / Escalar | Desligado | Desligado | Preserva a escala alongada |
| Destino / Rotação X / Y / Z | 0 / 0 / 0 graus | 0 / **90** / 0 graus | Destino do giro no eixo Y |
| Destino / Destino relativo | Desligado | Desligado | Usa o destino local configurado, sem somá-lo à pose inicial |
| Repetição / Ciclos | Uma vez | Uma vez | Finaliza após um percurso |
| Repetição / Ida e volta | Desligado | Desligado | Não acrescenta percurso de retorno |
| Conexão / Ao concluir | Desconectado | Desconectado | Não ativa/desativa outro objeto nesta aula |

Campos de posição e escala não comandam esses canais quando **Mover** e **Escalar** estão desligados. Preencher um destino sem ligar o canal não produz a animação esperada.

## Execute e compare

1. Salve a cena inicial.
2. Entre em Play e observe por mais de dois segundos.
3. O resultado esperado é a caixa girar um quarto de volta e parar. Não é giro infinito.
4. Use Stop. Confira a transformação da cena autoral, sem presumir que o último frame do Play virou a pose salva.

## Se a caixa não girar

Confira objeto selecionado, componente Ativo, Iniciar no Play, **Girar ligado**, destino Y = 90 e pose inicial diferente do destino. A caixa alongada ajuda a perceber a orientação; uma esfera ou um cubo simétrico pode enganar. Se ela também deslocou, veja **Mover**. Se dois sistemas disputam a pose, pare e deixe só o tween nesta etapa.

## Variação que ensina

Troque apenas Duração de 2 para 4 s, salve e inicie um novo Play. O destino continua 90°, mas leva o dobro do tempo. Depois volte para 2 s. Para estudar repetição, consulte os campos **Ciclos** e **Ida e volta** na referência; não confunda repetir um trecho com somar 90° continuamente.

## Preparar a próxima etapa

O script da próxima aula também controla rotação. Pare o Play e **desligue Ativo deste Transform Tween** antes de anexar o script. Assim você sabe qual sistema está produzindo o movimento. Pode manter o componente na cena de treino, desativado, para comparar as duas abordagens.
${checkpoint('preenchi Rotação Y = 90; por que não girou?', 'Verifique Girar, Ativo e Iniciar no Play. Um valor é dado; o consumidor precisa estar habilitado para aplicá-lo. Confira também se o objeto já começou em 90°.')}
`, 8),

p('primeiro-script-c', 'Seu primeiro script, explicado linha a linha', 'Crie, compile, anexe e entenda uma rotação contínua em C#, sem confundir salvar com executar.', `
## Objetivo e preparação

Substituir o tween por uma rotação contínua no Play. A caixa deve estar visível pela câmera. Pare a execução, **desative Transform Tween** e não acrescente física à caixa. Você não precisa aprender toda a linguagem C# para seguir, mas precisa respeitar nomes, pontuação e maiúsculas do exemplo.

## 1. Crie o arquivo na área de código

**Arquivos → ícone de código → Novo componente C#.** Crie/abra **RotateObject.cs**, usando a criação dentro do projeto. Substitua o conteúdo pelo exemplo completo abaixo; não cole uma classe dentro de outra classe gerada.

[Baixar RotateObject.cs](/examples/rotate-object/RotateObject.cs). O download é um arquivo de script, não um projeto completo nem uma cena que abre automaticamente.

\`\`\`csharp
using Astra;
using System.Numerics;

[ComponentId("docs.rotate-object")]
public sealed class RotateObject : Behavior
{
    public override void Update(float deltaTime)
    {
        Object.Rotate(Vector3.UnitY, 0.5f * deltaTime, TransformSpace.Local);
    }
}
\`\`\`

## 2. Entenda cada parte

| Trecho | O que quer dizer | Por que está aqui |
| --- | --- | --- |
| using Astra; | Permite usar os nomes do SDK Astra | Behavior, ComponentId e TransformSpace vêm da engine |
| using System.Numerics; | Importa os tipos numéricos usados | Vector3 representa um vetor com três eixos |
| ComponentId("docs.rotate-object") | Identidade estável do componente | Não é o nome do objeto nem uma pasta; não duplique esse ID em outra classe |
| public sealed class RotateObject : Behavior | Declara um comportamento chamado RotateObject | Behavior é a base que participa do lifecycle da engine |
| public override void Update(float deltaTime) | Implementa a atualização do comportamento | Recebe o intervalo da atualização, em segundos |
| Object | O objeto ao qual este Behavior foi anexado | Não significa “todos os objetos da cena” |
| Vector3.UnitY | O vetor de uma unidade no eixo Y | Define o eixo do giro |
| 0.5f * deltaTime | Velocidade de 0,5 rad/s multiplicada pelo intervalo | Converte velocidade em ângulo desta atualização |
| TransformSpace.Local | Aplica o giro no referencial local | O eixo acompanha a orientação local do objeto |
| { } e ; | Delimitam blocos e instruções | Apagar uma chave ou um ponto e vírgula pode impedir a compilação |

**0,5 rad/s equivale a aproximadamente 28,65° por segundo**. Em dois segundos, o giro acumulado esperado é aproximadamente 57,3°, sujeito ao tempo efetivamente avançado. É diferente do tween que tinha um destino de 90° e parava.

Sem multiplicar por deltaTime, você pediria um ângulo a cada atualização e a velocidade dependeria da frequência de atualização. Não troque por um número de “FPS desejado”. \`0.5f\` usa ponto decimal e o sufixo f indica um valor float em C#.

## 3. Salve e compile

Na área de código, use **Salvar tudo → Recompilar projeto**. Aguarde a publicação do catálogo. **Publicado** é o estado a procurar; um arquivo salvo ainda pode conter erros ou não ter produzido o comportamento disponível para anexar.

Se aparecer erro, abra **Console → Problemas**. Comece pelo primeiro erro e confira arquivo/linha, chaves, ponto e vírgula, maiúsculas e se o código está completo. Uma falha de publicação pode deixar o catálogo anterior; não conclua que a versão recém-editada está rodando.

## 4. Anexe ao objeto

Volte ao editor de cena: **Hierarquia → CaixaGira → Inspector → Componentes → Adicionar componente (+)**. Encontre **RotateObject** entre os comportamentos publicados, confira a prévia e confirme **Adicionar**. O arquivo no projeto não se anexa sozinho.

O nome exibido pode seguir os metadados do componente; procure a classe publicada e confirme sua fonte. Se não encontrar, volte à compilação, confira estado Publicado e IDs duplicados. Não crie uma segunda cópia da classe para “forçar” sua aparição.

## 5. Execute e observe

Salve, entre em Play e observe a caixa por alguns segundos. Ela deve girar continuamente em torno do próprio eixo local Y. Pare com Stop e confira a pose autoral. Se não girar: verifique a instância anexada, objeto ativo, publicação correta e ausência de outro escritor da transformação.

## Variação pequena

Troque só \`0.5f\` por \`1.0f\`, salve, recompile e faça um novo Play. O giro deve ser duas vezes mais rápido. Depois restaure 0.5f. Trocar o número no arquivo sem recompilar não prova que o runtime recebeu a alteração.

## Até onde esta aula comprova

O arquivo disponível possui evidência de compilação no ${link('ia/manifesto-de-exemplos', 'manifesto de exemplos')}. O roteiro de Play deve ser conferido na sua instalação; esta revisão editorial não acrescenta evidência de execução física. APIs relacionadas: ${api('Behavior')}, ${api('GameObject')} e ${api('TransformSpace')}.
${checkpoint('salvei o .cs e nada mudou; falta o quê?', 'Confira compilação/publicação, instância anexada e novo Play. Salvar o texto, publicar o catálogo e executar o Behavior são etapas diferentes.')}
`, 9),

p('play-e-stop', 'Entenda o que muda no Play e depois do Stop', 'Compare cena autoral, mundo em execução, câmera e atualização do script.', `
## Objetivo

Saber qual estado você está observando. Use CaixaGira com **apenas um** controlador de rotação ativo: o tween ou o script. A posição e a rotação salvas na edição são a base autoral; a rotação calculada enquanto o script roda pertence à execução.

## Faça a comparação

1. Em edição, selecione CaixaGira e anote a rotação inicial.
2. Salve essa cena.
3. Entre em Play e observe a mudança por alguns segundos.
4. Use Stop e volte ao Inspector do objeto.
5. Compare com o valor autoral anotado. Não trate o último frame executado como uma edição permanente automática.
6. Inicie um novo Play e observe de onde o comportamento começa.

| Momento | O que você está configurando/observando |
| --- | --- |
| Edição antes do Play | Dados autorais, componentes, vínculos e recursos |
| Entrada no Play | Instâncias de runtime são criadas a partir desses dados |
| Atualização | Sistemas e Behaviors aplicam suas regras |
| Stop | Encerra a execução; referências daquele mundo não devem ser reutilizadas |
| Novo Play | Novo ciclo de execução, com a base autoral e dados persistentes explícitos quando usados |

## A câmera também importa

A vista que você move no editor é uma ferramenta de autoria. A câmera habilitada para Play gera a visão do jogo. Mover a vista de edição depois de criar CameraPrincipal não significa reposicionar automaticamente a câmera autoral.

## Logs e compilação não são a mesma saída

Na área de código, **Problemas** ajuda com compilação; **Registros** mostra mensagens de execução. Um script que compila pode falhar no Play por componente ausente, recurso inválido ou referência de outro mundo. Consulte a ${link('diagnostico/erros-de-compilacao', 'ajuda de compilação')} e a ${help}.

## Não misture vários donos do movimento

Tween, script, física, animação ou um pai em movimento podem afetar a pose. Nesta aula, deixe apenas o controlador escolhido. Um corpo dinâmico não deve receber movimentação direta como se fosse um objeto visual sem física; sua integração possui regras próprias.

## Exercício curto

Pare o Play, altere a rotação autoral para um valor que reconheça, salve e inicie novamente. Compare com um giro que só ocorreu no runtime. Depois retorne à pose da trilha. ${link('conceitos/indice', 'Lifecycle, handles e autoridade de transformação')} aprofunda esses conceitos.
${checkpoint('posso guardar um objeto do Play anterior para o próximo?', 'Não como uma referência válida daquele mundo. Stop encerra o mundo; handles/referências de runtime precisam respeitar lifecycle e identidade do novo mundo.')}
`, 10),

p('salvar-e-reabrir', 'Confira o que realmente foi salvo', 'Nome, transformação, componentes, recursos, código e dados do jogador têm persistências diferentes.', `
## Objetivo

Recuperar a montagem depois de fechar e reabrir. Faça esta etapa em **edição**, depois de Stop. Não use apenas “a tela continua igual” como conferência: procure valores identificáveis.

## A sequência de conferência

1. Na Hierarquia, confirme **CaixaGira**, **CameraPrincipal** e **LuzPrincipal**.
2. No Inspector da caixa, confira escala 2 / 1 / 1 e a pose autoral que escolheu.
3. Confira qual controlador está ativo. Se estiver usando RotateObject, o tween deve ficar desativado.
4. Na área de código, use **Salvar tudo** e **Recompilar projeto** se alterou o script. Confira Publicado.
5. Volte ao editor e use **Salvar** para a cena.
6. Volte à lista de projetos, feche/reabra o projeto e confira nomes, transformação e componentes.
7. Entre em Play e observe o comportamento; pare e confira a base autoral novamente.

## O que cada ação preserva

| Dado | Onde editar/salvar | Como conferir |
| --- | --- | --- |
| Objetos e componentes autorais | Editor da cena → Salvar | Reabrir e conferir valores/vínculos |
| Texto do script | Área de código → Salvar tudo | Reabrir o arquivo e comparar o trecho |
| Catálogo compilado | Recompilar projeto | Conferir Publicado e componente disponível |
| Documento UI | Editor do documento, no fluxo de salvar próprio | Reabrir o documento e conferir árvore/campos |
| Recursos externos | Importação/registro + arquivos do projeto | Conferir consumidor e referência após reabrir |
| Progresso do jogador | API de save usada explicitamente pelo jogo | Executar uma escrita/leitura real do slot |

Salvar a cena não transforma automaticamente vida, placar ou inventário do jogador em um savegame. ${link('sistemas/indice', 'Veja os sistemas e exemplos de persistência')} para escolher o contrato correto.

## Backup recuperável

Preserve o projeto inteiro, incluindo scripts, imagens, documentos e modelos necessários. Copiar só um script não preserva a cena; copiar só a cena não garante que recursos externos estejam disponíveis. Não renomeie extensões para fingir uma conversão e não use um ZIP de exemplo como se fosse qualquer formato de projeto.

Antes de instalar outro APK ou limpar dados, tenha uma cópia fora dos dados do aplicativo. Para conferir o backup, prefira uma cópia separada, sem sobrescrever o original, e confira os mesmos vínculos.

## Quando algo não voltou

Confira se reabriu **o projeto certo**, se a alteração foi autoral ou só no Play, se salvou no editor correspondente e se todos os recursos acompanharam a cópia. Preserve original e cópia defeituosa para comparação. ${help} orienta como relatar a diferença.
${checkpoint('copiei apenas RotateObject.cs; fiz backup de CaixaGira?', 'Não. O arquivo preserva esse script, mas não os objetos, câmera, luz, componentes, recursos e demais dados do projeto.')}
`, 11),

p('proximos-passos', 'Escolha uma expansão com resultado claro', 'Depois da primeira cena, avance uma mecânica por vez, com dependências e conferência.', `
## Primeiro, conclua a base

Você deve conseguir criar, enquadrar, animar, compilar, anexar, parar, salvar e reabrir CaixaGira. Se ainda falta uma dessas partes, volte à ${link('comece/indice', 'etapa correspondente')}. Não é necessário ler toda a API antes de experimentar a próxima mecânica.

## Escolha pelo resultado que quer ver

| Próximo resultado | O que acrescentar | O que conferir | Guia |
| --- | --- | --- | --- |
| Mover por entrada do jogador | Ação/eixo de input e um consumidor de movimento | Objeto responde ao eixo, sem outro dono da pose | ${link('exemplos/como-executar-exemplos', 'Exemplo InputMove e preparação')} |
| Caixa cair e parar no chão | Corpo físico + Colisor 3D na caixa; composição física no chão | Queda, contato e pose consistente | ${link('sistemas/indice', 'Montagem de física 3D')} |
| Câmera acompanhar um objeto | Câmera + Acompanhar alvo + referência de Alvo | Alvo escolhido e offset útil | ${component('astra.camera.follow')} |
| Corações perderem/preencherem vida | Documento UI + imagens + Canvas UI + vida + scripts | Dano/cura alteram os corações no Play | ${link('ui/hud-coracoes', 'Tutorial completo de corações')} |
| Contador voltar após reabrir | Ação de input + API de save explícita | Valor gravado e lido no slot correto | ${link('exemplos/como-executar-exemplos', 'Exemplo SaveActionCounter')} |
| Objeto sumir depois de um atraso | Behavior + coroutine e lifecycle | Desativação no tempo escolhido | ${link('exemplos/como-executar-exemplos', 'Exemplo DelayedDeactivate')} |

Esses guias apresentam contratos e roteiros; confira as evidências do exemplo e o resultado na versão instalada. Ter uma família listada não comprova toda combinação de um jogo grande.

## Um jeito seguro de ampliar

Faça uma cópia do projeto, escolha uma linha da tabela e mantenha o resto simples. Escreva uma frase de resultado: “ao aplicar dano, um coração muda para vazio”. Liste as dependências e só depois configure os campos. Se não acontecer, investigue o elo que falhou: evento → vida → atualização UI → imagem desenhada.

## Quando a ideia ainda não é suportada

Consulte ${link('comece/o-que-posso-criar', 'capacidades e limites')} e o ${link('roadmap/registro-de-familias', 'roadmap por família')}. Planejado não significa disponível. Reduza a ideia para um protótipo com consumidores existentes e envie a necessidade ao [Discord oficial](https://discord.gg/KpqnBvt4uG), com um caso de uso concreto.

## Continue estudando sem se perder

O ${link('editor/indice', 'Manual')} explica **como operar**; ${link('conceitos/indice', 'Conceitos')} explica **por que escolher**; ${link('sistemas/indice', 'Sistemas')} explica **como combinar**; ${link('componentes', 'Componentes')} descreve **campos**; ${link('api', 'API')} fornece **assinaturas**. Use cada seção para sua pergunta, em vez de tentar memorizar todas de uma vez.
`, 12),

p('ajuda-por-sintoma', 'Estou travado: ajuda pelo que aparece na tela', 'Encontre o próximo diagnóstico sem conhecer o nome do sistema.', `
## Comece pela última coisa que funcionou

Pare de adicionar funções por um momento. Volte à menor cena que ainda reproduz o problema, mantendo uma cópia do original. Anote se a falha é na instalação, na edição, na compilação ou no Play: cada etapa tem causas diferentes.

| Estou vendo isto | Confira primeiro | O próximo caminho |
| --- | --- | --- |
| Não instala / pacote em conflito | Requisitos, arquivo completo, assinatura da instalação anterior | ${link('comece/instalacao', 'Instalação, sem apagar projetos')} |
| Não sei onde tocar | Seletor de destinos e objeto selecionado | ${link('comece/conheca-o-editor', 'Mapa de ações do editor')} |
| Inspector mostra o objeto errado | Nome no cabeçalho e bloqueio do Inspector | Desbloqueie e selecione novamente pela Hierarquia |
| Objeto existe, mas não aparece | Ativo, escala, geometria, posição e enquadramento | ${link('comece/primeira-cena', 'Primeira cena, passos 1–4')} |
| Editor mostra, Play não mostra | Câmera habilitada, pose, recorte e outras câmeras | ${link('comece/primeira-cena', 'Conferência da CameraPrincipal')} |
| Campo sumiu | Grupo recolhido, modo condicional, tipo e versão | ${link('comece/ler-o-inspector', 'Como ler campos condicionais')} |
| Tween não gira | Girar/Ativo/Iniciar no Play e destino diferente da origem | ${link('comece/primeiro-componente', 'Tabela de configuração do tween')} |
| Junta não se move no Animation Studio | Pose, canal TRS, camada isolada e skin real; confirme a versão instalada | [Tutorial de autoria e disponibilidade](/pt-br/snapshot-2026-10-07/sistemas/animation-clips/) |
| Pose funciona no preview, mas não no Play | Gravar a pose e atribuir o clipe ao Animation/Animator da raiz correta | [Bindings e uso real do clipe](/pt-br/snapshot-2026-10-07/sistemas/animation-clips/) |
| Script salvo não mudou o jogo | Publicação, instância anexada e novo Play | ${link('comece/primeiro-script-c', 'Salvar → compilar → anexar → executar')} |
| Componente C# não aparece para adicionar | Erros de compilação, Publicado e identidade duplicada | ${link('diagnostico/erros-de-compilacao', 'Erros de compilação')} |
| Caixa não cai / atravessa o chão | Corpo dinâmico e colisor na caixa; composição física no chão | ${link('sistemas/indice', 'Guia de física e contato')} |
| PNG do coração não aparece | Image dentro do documento, recurso atribuído, Canvas UI ligado ao documento | ${link('ui/hud-coracoes', 'Montagem dos corações')} |
| Coração aparece, mas não muda com dano | Vida alterada, Behavior de HUD e referências/IDs dos elementos | ${link('ui/hud-coracoes', 'Dano, cura e atualização do HUD')} |
| Objeto pula ou treme | Física/tween/script/animação disputando transformação | Isole um escritor; confira autoridade antes de mover diretamente |
| Alteração sumiu após Stop | Era uma mudança de runtime ou uma edição autoral? | ${link('comece/play-e-stop', 'Diferença entre os dois estados')} |
| Projeto reabriu com recurso faltando | Arquivos da cópia e referências, não apenas a cena | ${link('comece/salvar-e-reabrir', 'Persistência e backup')} |

## Como ler um erro C#

Na área de código, **Console → Problemas**: leia o primeiro erro, arquivo e linha. Corrija uma causa e recompile; uma chave ausente pode gerar várias mensagens depois. Em **Registros**, confira mensagens de execução e seus filtros de origem/severidade. Copie o texto exato, não apenas “deu erro”.

**ComponentMissing:** confira qual componente a operação exige e em qual objeto. **StaleHandle/ForeignWorld:** uma referência pode pertencer a outro mundo/ciclo de execução. **TransformOwnedByPhysics:** movimentação direta está disputando a pose física. **UnknownResource/ResourceTypeMismatch:** recurso ausente ou tipo incompatível. São pistas para investigar, não autorização para desativar a validação ou criar um placeholder.

## Teste uma hipótese por vez

Exemplo: a caixa está parada. Primeiro observe se está em Play. Depois confira a instância de RotateObject e o estado Publicado. Só então confira outros controladores. Se mudar câmera, script, física e qualidade simultaneamente, você perde a informação de qual mudança resolveu ou piorou o problema.

## Envie um relato que alguém possa reproduzir

Use o [Discord oficial](https://discord.gg/KpqnBvt4uG). Antes de compartilhar, remova informações privadas. Preencha:

\`\`\`text
Versão do APK:
Modelo do aparelho / Android:
Etapa ou link do tutorial:
Última ação que funcionou:
Passos até falhar: 1. ... 2. ... 3. ...
Resultado esperado:
Resultado que apareceu:
Mensagem exata / arquivo / linha:
Acontece em projeto vazio ou só neste projeto?
Imagem/vídeo da tela e pequeno exemplo, se disponível:
\`\`\`

Uma sugestão também pode seguir esse formato: explique o objetivo, onde o fluxo atual impede a tarefa e o resultado desejado. O canal aceita sugestões; envio não representa promessa de prazo ou suporte já implementado.
`, 13),

p('o-que-posso-criar', 'Minha ideia é possível nesta versão?', 'Descubra a composição necessária e o limite entre contrato atual, exemplo e roadmap.', `
## Comece pela capacidade, não pelo nome

A Astra está numa prévia limitada e incompleta, com cerca de **20% da meta final declarada do projeto**. Essa porcentagem expressa a visão global do autor; não é a porcentagem de métodos da API testados, nem uma garantia de que 20% de qualquer jogo esteja pronto.

Use a tabela para encontrar a primeira montagem. Leia o guia e suas evidências antes de decidir a dimensão do projeto.

| Quero fazer | Cadeia mínima | Onde aprender / o que não presumir |
| --- | --- | --- |
| Objeto girar | Objeto visual → Transform Tween **ou** Behavior de rotação | ${link('comece/primeiro-componente', 'Sem código')} / ${link('comece/primeiro-script-c', 'Com C#')}; evite dois donos da pose |
| Objeto cair e colidir | Transform → Corpo físico → Colisor → mundo físico → chão físico | ${link('sistemas/indice', 'Física 3D')}; malha desenhada não implica colisão |
| Seguir o jogador com câmera | Câmera → Acompanhar alvo → referência do objeto | ${component('astra.camera.follow')}; nome “Jogador” não preenche Alvo |
| HUD de corações funcional | Vida → dano/cura → documento .aeui com Image → imagens → Canvas UI → Behavior que atualiza | ${link('ui/hud-coracoes', 'Tutorial completo')}; não é só desenhar três PNGs |
| Botão de interface | Documento UI → Button → ação/conexão → consumidor | ${link('ui/elementos', 'Elementos UI')}; aparência não cria a regra de jogo |
| Movimento por comando | Entrada → ação/eixo → consumidor que respeita a autoridade da pose | ${link('sistemas/indice', 'Input e movimento')}; toque no editor não é input do jogo |
| Salvar pontuação | Estado do jogo → API de save → slot → escrita/leitura | ${link('exemplos/como-executar-exemplos', 'SaveActionCounter')}; Salvar cena não é savegame |
| Trazer um modelo | Arquivo compatível → importação → recursos → objeto/renderer | ${link('editor/indice', 'Importação')}; importar geometria não converte todas as regras da ferramenta original |

## Como ler o roadmap

**Implementado** e **parcial** precisam ser lidos dentro do escopo descrito. **Pesquisado/planejado** registra intenção ou referência, não botão disponível. Uma assinatura C# extraída confirma um contrato, mas não comprova todos os cenários de jogo nem todas as plataformas.

Consulte ${link('roadmap/registro-de-familias', 'famílias de capacidades')}, ${link('ui/roadmap', 'roadmap UI')} e ${link('roadmap/capacidades-do-renderer', 'renderer')}. Não há datas prometidas para cada função ou cada campo.

## APK e documentação evoluem separadamente

Em [Atualizações](/atualizacoes/), **Docs** registra o que mudou no portal. Uma nota **App / Em desenvolvimento** não significa que o APK para baixar mudou. Procure **distribuído** e a versão do pacote quando quiser saber o que chegou ao usuário. O snapshot conserva URLs datadas para evitar misturar gerações.

## Delimite seu primeiro protótipo

Em vez de “quero um RPG”, comece com “quero reduzir vida e atualizar três corações”. Depois acrescente uma entrada, um inimigo ou persistência. Cada expansão precisa de criação, dados, consumidor, referências, salvamento e uma forma de conferir o resultado.

Se não encontrou uma cadeia existente, descreva o caso no [Discord](https://discord.gg/KpqnBvt4uG). Não use API de Unity/Godot num script Astra apenas porque o nome parece equivalente. As referências ajudam a estudar a capacidade; o contrato da Astra é o que define seu código.
`, 14),

p('perguntas-frequentes', 'Perguntas de quem está começando', 'Respostas práticas sobre código, projetos, UI, instalação e diferenças entre edição e execução.', `
## Preciso saber programar para começar?

Não para criar objetos, configurar componentes e fazer a primeira animação por campos. Regras próprias normalmente exigem entender os consumidores disponíveis e, quando necessário, C#. A trilha começa visualmente e explica um script completo antes de propor expansões.

## Onde começo se não conheço nada de jogos?

Na ${link('comece/indice', 'trilha CaixaGira')}. Não comece pelo catálogo de milhares de membros: use a referência quando souber a ação que quer realizar. Consulte o ${glossary} durante a aula.

## Criar objeto e adicionar componente são a mesma coisa?

Não. Hierarquia → + cria uma entidade/receita. Inspector → Componentes → + acrescenta função ao objeto selecionado. Uma receita pode criar vários componentes juntos; confira sua composição.

## Por que o cubo não cai?

Ele pode ser apenas visual. Gravidade/contato precisam da composição física e do tipo de movimento correto. O chão visível também precisa de composição física para bloquear a queda. ${link('sistemas/indice', 'Veja física 3D')}.

## Por que o editor mostra o objeto, mas o Play fica vazio?

O editor tem sua própria vista. Confira a câmera de jogo, **Usar no Play**, pose, recorte e prioridade. ${link('comece/primeira-cena', 'Monte CameraPrincipal a partir da vista')}.

## O braço do robô foi animado na Astra ou veio pronto?

No laboratório, Kyle chegou sem clipes. O gerador criou um clipe pela API da Astra e gravou +35° no Z local do ombro em 1 s, entre poses originais em 0/2 s. Foi autoria programática real, não gravação manual pelo touch. Os Vikings reproduzem clipes importados. O [tutorial do Animation Studio](/pt-br/snapshot-2026-10-07/sistemas/animation-clips/) ensina a reproduzir o braço visualmente e separa a revisão Dev da distribuição pública.

## Não consigo mover uma junta no preview. O que conferir?

Abra Pose, escolha a junta e uma propriedade TRS; use Camada isolada para os gizmos. XYZ revela os valores. Juntas exige uma skin com ossos reais, não uma malha estática. A revisão de seleção direta é de desenvolvimento e não aparece automaticamente no APK público 0.3.0. Para sobreposições, use Objetos/Hierarquia. Salvar um clipe também não o atribui sozinho a Animation/Animator.

## Onde fica UIIMG ou UiImage?

O elemento documentado é **Image**, dentro de um documento UI .aeui. Canvas UI liga o documento à cena. Não procure Image como se fosse um componente 3D. ${link('ui/image', 'Campos de Image')} e ${link('ui/hud-coracoes', 'HUD funcional')} mostram a sequência.

## Posso baixar os corações e já abrir como jogo completo?

O pacote oferece documento, imagens e scripts para integração. Não representa uma cena completa com jogador, gatilhos e todos os vínculos prontos. Siga a montagem e confira IDs/referências. Não renomeie o ZIP para uma extensão de projeto.

## Salvei um script. Por que ele não está rodando?

Confira **Recompilar projeto → Publicado → anexar o Behavior ao objeto → Play**. O arquivo salvo é somente uma das etapas. ${link('comece/primeiro-script-c', 'Veja cada passo e seu resultado')}.

## Posso copiar código de Unity ou Godot?

Os conceitos ajudam, mas APIs, tipos e lifecycle não são automaticamente compatíveis. Use o SDK Astra desta geração. Um script com \`MonoBehaviour\` ou APIs de outra engine não se transforma num Behavior da Astra por mudar só o nome do arquivo.

## Posso usar vírgula no número do script?

C# usa ponto decimal: \`0.5f\`. Vírgula separa argumentos e pode mudar o significado ou causar erro. No texto português, 0,5 representa o mesmo valor, mas não é a sintaxe para colar no código.

## Rotação é sempre em graus?

Não. O Inspector apresenta graus; a API de rotação usada no exemplo recebe radianos. Confira a unidade do membro, não apenas seu nome. ${link('comece/ler-o-inspector', 'Unidades e tipos de campos')}.

## Tudo que mudo no Play vai ser salvo?

Não presuma isso. Estado autoral e estado de execução têm funções diferentes. Progresso do jogador usa persistência explícita. ${link('comece/play-e-stop', 'Compare antes/durante/depois')}.

## Desfazer substitui backup?

Não. Histórico pertence ao contexto de edição e não garante recuperação depois de reinstalar, limpar dados ou perder arquivos. Faça cópia recuperável antes de ações arriscadas.

## Tenho um Windows/iPhone. Há instalador aqui?

O download público desta distribuição é o APK Android. O portal não oferece instalador equivalente para essas plataformas. Consulte requisitos e disponibilidade em [Download](/download/).

## “20%” significa 20% dos recursos testados?

Não. É a estimativa declarada da meta global do projeto. Estados/evidências de cada capacidade devem ser lidos separadamente; não use essa porcentagem como cobertura de testes ou promessa de paridade.

## Uma atualização das docs também atualiza meu aplicativo?

Não. Leia origem, disponibilidade e versão em [Atualizações](/atualizacoes/). Mudança editorial não troca o APK instalado. Trabalho “em desenvolvimento” ainda precisa de uma distribuição correspondente.

## O download via GitHub expõe o código privado da engine?

Um link público revela o endereço do repositório/asset usado para distribuição e permite ver o que é público nele. Um APK não publica automaticamente o código-fonte privado. O site de documentação e seus exemplos são públicos; não devem receber os arquivos internos da engine. Repositório de documentação, binário distribuído e código da engine são materiais diferentes.

## Como pedir ajuda ou sugerir uma função?

No [Discord oficial](https://discord.gg/KpqnBvt4uG), com versão, etapa, passos, resultado esperado e mensagem exata. ${link('comece/ajuda-por-sintoma', 'Use o modelo de relato')}. Explique o problema que a função resolveria, além de seu nome.
`, 15),

p('glossario', 'Glossário: a palavra e um exemplo na Astra', 'Entenda os termos encontrados nas aulas sem depender de uma definição abstrata.', `
## Projeto, cena e autoria

| Termo | Em palavras simples | Exemplo e uso |
| --- | --- | --- |
| Engine | Ferramentas e sistemas que criam/executam o jogo | Astra edita a cena e executa seus sistemas no Play |
| Editor | Ambiente onde você prepara os dados | Mudar a escala da caixa antes do Play |
| Runtime | Sistemas e instâncias durante a execução | RotateObject atualizando a rotação |
| Projeto | Conjunto organizado de dados e arquivos | CaixaGira reúne cena, scripts e recursos |
| Cena | Organização de objetos e suas configurações | Caixa, câmera e luz montadas juntas |
| Objeto / entidade | Unidade selecionável da cena | CameraPrincipal na Hierarquia |
| Componente | Função e dados ligados a um objeto | Câmera define como aquele objeto produz uma vista |
| Composição | Conjunto de componentes que trabalham juntos | Corpo físico + Colisor para contato físico |
| Receita | Criação que configura uma composição | Caixa dinâmica difere de Cubo visual |
| Authoring / autoral | Dados preparados para gerar a execução | Rotação inicial salva no editor |
| Instância | Uma cópia concreta de uma definição | Duas caixas podem ter Behaviors do mesmo tipo |
| Hierarquia | Árvore dos objetos e seus pais/filhos | Um filho acompanha mudanças do pai |
| Raiz | Objeto sem pai na organização | CaixaGira na raiz evita herdar giro de outro objeto |
| Persistência | Dados que podem ser recuperados depois | Reabrir a cena e recuperar a escala |

## Transformação e câmera

| Termo | Em palavras simples | Exemplo e uso |
| --- | --- | --- |
| Viewport | Área que mostra a vista da cena | Enquadrar a caixa para criar a câmera |
| Inspector | Área dos atributos/componentes selecionados | Abrir Câmera → Lente |
| Gizmo | Manipulador visual para editar | Arrastar uma alça para mover no eixo |
| Transform / transformação | Posição, rotação e escala | Escala 2/1/1 alonga X |
| Pose | Posição e orientação de algo | Câmera na pose da vista de edição |
| Vetor | Valores por eixos | Vector3.UnitY é o eixo Y unitário |
| Local | Relativo ao pai/referencial local | Giro no próprio eixo local da caixa |
| Mundo / world | Referencial resultante da cena | Posição após combinar pais e filhos |
| Grau | Unidade angular em que uma volta tem 360 | 90° é um quarto de volta no tween |
| Radiano | Unidade angular em que uma volta tem cerca de 6,283 | 0,5 rad/s no script |
| FOV / campo de visão | Ângulo abrangido pela lente | Campo vertical 60° da câmera |
| Perspectiva | Projeção com tamanho aparente dependente da distância | Objeto longe parece menor |
| Ortográfica | Projeção com extensão definida sem esse efeito de distância | Meia altura define metade da altura visível |
| Near / far / recorte | Limites próximo/distante do desenho | Objeto dentro do recorte próximo pode não aparecer |

## Campos, arquivos e UI

| Termo | Em palavras simples | Exemplo e uso |
| --- | --- | --- |
| Propriedade / campo | Dado editável de uma função | Duração do tween |
| Default / padrão | Valor do componente recém-criado | Duração padrão 1 s, diferente dos 2 s da aula |
| Domínio | Valores aceitos pelo contrato | Projeção aceita opções específicas |
| Enum / enumeração | Escolha entre opções nomeadas | Estático, Cinemático ou Dinâmico |
| Booleano | Verdadeiro/falso, ligado/desligado | Girar habilita o canal de rotação |
| Referência | Vínculo com uma identidade, não apenas um texto | Alvo da câmera escolhido no seletor |
| Recurso / asset | Dado registrado para um consumidor | Imagem atribuída a Image |
| Importar | Trazer/registrar dados externos | Um .glb vira recursos usados na cena |
| Material | Dados usados no aspecto da superfície | Alterar o material difere de alterar o colisor |
| Slot | Posição de uma coleção/recurso | Campo aplicado ao material do slot escolhido |
| UI / HUD | Interface do jogo / informações sobre ele | Corações que representam a vida |
| Documento .aeui | Árvore e dados da UI autoral | hud.aeui contendo elementos Image |
| Elemento UI | Nó dentro desse documento | Um Image para cada coração |
| Canvas UI | Consumidor que liga o documento à cena | Sem documento atribuído, o PNG sozinho não vira HUD |
| ID | Identidade usada para localizar/vincular dados | ComponentId do Behavior; não é o nome do projeto |
| Tint | Cor multiplicada na apresentação da imagem | Um tint inadequado pode mudar o aspecto do coração |

## Código, tempo, física e evidência

| Termo | Em palavras simples | Exemplo e uso |
| --- | --- | --- |
| C# | Linguagem usada nos scripts desta geração | RotateObject.cs |
| SDK | Tipos e contratos disponíveis para programar | Namespace Astra e Behavior |
| API | Formas documentadas de acessar uma capacidade | Object.Rotate com eixo, ângulo e referencial |
| Behavior | Base de um componente programado | RotateObject anexado à caixa |
| Método | Operação com nome e parâmetros | Rotate recebe dados para aplicar um giro |
| Parâmetro / argumento | Dado esperado / dado fornecido na chamada | deltaTime e o valor recebido naquela atualização |
| Compilar | Conferir/traduzir código para execução | Erro de sintaxe impede a publicação nova |
| Publicar catálogo | Disponibilizar tipos compilados no projeto | Componente aparece para adicionar |
| Anexar | Criar a instância do comportamento no objeto | Adicionar RotateObject à CaixaGira |
| Lifecycle | Criação, atualização e encerramento das instâncias | Novo Play cria um ciclo; Stop o encerra |
| Update | Etapa de atualização do Behavior | Acumular giro durante a execução |
| deltaTime | Intervalo da atualização em segundos | Velocidade × intervalo = ângulo do passo |
| Tween | Interpolação de valor entre estados no tempo | Ir de 0° a 90° em 2 s |
| Input | Entrada recebida pelo jogo | Eixo para mover, diferente de arrastar um gizmo |
| Colisor | Forma usada para contato/consultas físicas | Caixa física não é a malha visual |
| Corpo dinâmico | Corpo cujo movimento é simulado | Caixa que pode cair e colidir |
| Savegame | Persistência explícita do progresso do jogo | Contador salvo num slot |
| Handle | Referência com identidade/ciclo de validade | Não reutilizar o mundo de um Play encerrado |
| Snapshot | Recorte datado da documentação | URLs snapshot-2026-10-06 |
| Release | Distribuição identificada | APK com versão, tamanho e hash |
| SHA-256 | Resumo usado para comparar integridade | Conferir o APK baixado com o manifesto |
| Roadmap | Estado e evolução planejada por capacidade | Planejado ainda não significa disponível |
| Conferido em fonte | Contrato observado no código | Não equivale a execução em todos os aparelhos |
| Compilação conferida | Exemplo aceito pelo compilador indicado | Não prova câmera, cena e gameplay |

## Aplique os termos numa montagem

Em “o Behavior atualiza o Image de um HUD”, temos um **script anexado**, executando no **runtime**, localizando um **elemento** do **documento** instanciado por **Canvas UI**, e trocando sua apresentação a partir da **vida do jogador**. São vários elos, não uma única classe que faz tudo. ${link('ui/hud-coracoes', 'Veja os elos no tutorial de corações')}.

Para voltar à prática: ${link('comece/indice', 'trilha do zero')}, ${link('comece/ler-o-inspector', 'campos e unidades')} e ${help}.
`, 16),
];
