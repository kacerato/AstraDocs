import { link } from './workflow-guide-tools.mjs';
export const releasePages = [{
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
