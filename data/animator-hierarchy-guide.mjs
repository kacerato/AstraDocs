export const animatorHierarchyGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animator-hierarquia',
  title: 'Animator: grupos, entradas e interrupções',
  description: 'Organize estados em grupos aninhados, configure rotas e interrompa misturas preservando a pose exibida.',
  body: `:::caution[Desenvolvimento]
Implementado no Astra Dev **0.2.8-dev.20261008**, code **16**. O APK público 0.2.3 e seus contratos continuam na versão distribuída. Este guia explica a revisão Dev; não anuncia equivalência completa com UMotion ou FinalIK.
:::

## Usar em qualquer objeto animável

Grupos organizam estados e suas regras. Não dependem de um jogador: mecanismos, hierarquias de objetos, modelos com skin e canais de morph usam o mesmo Animator e compositor. Os clipes precisam oferecer canais compatíveis com os alvos.

1. Selecione o objeto, abra **Animator → Abrir grafo**.
2. Num controller compartilhado, abra **Recurso → Editar recurso** para alterar sua definição. Navegar e inspecionar a instância não libera autoria compartilhada.
3. Use **+Grupo**. Selecione o grupo e **Abrir grupo**. Um estado Entrada é criado junto para fornecer um destino inicial efetivo.
4. Crie estados, escolha clipes e faça ligações. **Local** move um estado ou uma árvore inteira para outro grupo; destinos que criariam ciclos não são oferecidos.
5. Use os breadcrumbs para retornar. Cada nível recupera sua posição e zoom. **Duplicar** copia a árvore com novas identidades; **Excluir** remove seus descendentes. Undo/Redo restaura a operação inteira.

![Grafo após salvar e reabrir no Android: três níveis e configuração de interrupção preservada.](/assets/animator-hierarchy-dev.png)

O grafo ocupa a superfície principal; propriedades acompanham a seleção na gaveta lateral. Ligações distintas têm trajetos separados quando seus destinos se projetam sobre o mesmo grupo fechado. A navegação não altera o histórico de autoria.

## Entrada, saída e escopo

**Entrada** escolhe primeiro a ligação condicional elegível, na ordem autorada; caso nenhuma seja elegível, usa o destino padrão direto do grupo. O destino pode ser outro grupo, cuja entrada é resolvida. Grupo vazio pode ser autorado, mas tentar executá-lo produz diagnóstico: nenhum estado é inventado.

**Saída** de um estado consulta as ligações de seu grupo. Saídas de grupo podem subir por vários níveis até encontrar um estado ou outro grupo. Sem rota válida, a transição é recusada e os gatilhos permanecem disponíveis. Não há retorno implícito ao estado padrão do pai.

**Qualquer estado** é local ao grupo e seus descendentes. O nó na raiz vale para toda a camada. A procura começa no escopo mais interno e sobe pelos ancestrais. Sua fila precede as ligações normais.

O blend pertence à ligação de saída do estado que iniciou a rota. Ligações de máquina e Entrada mostram destino, condições e prioridade; não oferecem duração sem consumidor. Nomes não podem conter barra: a barra separa os segmentos do caminho. Nomes curtos repetidos em grupos diferentes exigem o caminho completo.

## Interromper uma mistura

Selecione a ligação e ajuste **Interrupção**. A política da ligação atualmente em execução determina quais filas normais podem substituí-la:

| Política | Procura durante o blend |
|---|---|
| Só Qualquer estado | Apenas as filas de Qualquer estado |
| Origem | Ligações do estado de origem |
| Destino | Ligações do estado de destino |
| Origem → destino | Origem antes do destino |
| Destino → origem | Destino antes da origem |

As filas de Qualquer estado continuam precedendo as filas normais em todas as políticas. **Por prioridade** interrompe a procura quando alcança a ligação ativa na fila. **Priorizar/Adiar** muda a ordem entre ligações da mesma origem e escopo. **Reentrar** permite voltar ao mesmo estado folha.

Uma interrupção começa na **pose composta realmente exibida**, preservando posição, rotação, escala e morph por propriedade. Uma segunda interrupção captura novamente esse resultado. Máscaras, camadas aditivas, pesos e autoridade física continuam passando pelo compositor. Se a captura necessária ainda não existe, a troca é recusada com diagnóstico e a mistura anterior permanece.

**Unidade → Segundos** usa duração fixa. **Voltas** multiplica a duração autorada pela duração ponderada do clipe de origem, considerando a velocidade efetiva. **Iniciar em** é o tempo normalizado inicial do destino: 0,20 começa em um quinto da volta. Eventos anteriores ao offset não são reproduzidos retroativamente.

## API C# e eventos

~~~csharp
var animator = Object.Animator();
animator.Play("Mecanismo"); // resolve Entrada e padrões dos grupos
animator.CrossFade("Mecanismo/Ciclo/Fase/Aberta", 0.4f);
var state = animator.GetCurrentState();
Scene.Log(ObjectId, state.Path);
bool inside = state.IsInMachine("Mecanismo/Ciclo");
string leaf = state.LeafName;
string next = state.NextPath;
~~~

Play troca imediatamente; CrossFade recebe segundos, inclusive quando a ligação autorada usa voltas. Caminhos completos distinguem nomes repetidos; nome curto precisa ser único. O transporte aceita os caminhos completos dentro dos limites do modelo, sem truncá-los a 128 bytes.

Na fachada de componente Animator, **OnMachineEntered**, **OnMachineExited** e **OnTransitionInterrupted** aceitam o Behavior receptor e seu callback tipado. Entrada/saída enviam índice da camada e ID da máquina; interrupção envia camada, ID da ligação substituída e ID do novo estado folha. Inscrições seguem o lifecycle do Behavior.

Ao interromper: evento de interrupção, saídas dos grupos do mais interno ao mais externo, entradas do mais externo ao mais interno e entrada do estado. Grupos de origem e destino permanecem ativos durante a mistura. Gatilhos usados por uma rota bem-sucedida são consumidos uma única vez.

Os parâmetros, relógios, captura e transições são independentes por instância. O Play não grava o controller compartilhado. Esta API controla execução e inspeção; **edição de topologia e clipes por transações C# ainda não está entregue**.

## Persistência, migração e limites

Animator **v5** e recurso **AEANIMATOR 3** acrescentam máquinas, parentagem, entrada, políticas e opções de transição. Leitores novos aceitam Animator v1–v4 e recursos 1–2. Grafos anteriores continuam na raiz; nenhum agrupamento é inventado. Leitores antigos não entendem os formatos novos: preserve backup antes de salvar no Dev.

Limites atuais por controller/camada: 32 parâmetros, quatro camadas, 24 estados, 48 ligações, 32 grupos e profundidade 16. Nomes têm até 63 bytes UTF-8; um estado tem até oito movimentos e uma ligação até quatro condições. IDs permanecem estáveis; IDs excluídos não são reutilizados pelo histórico.

## Evidência desta revisão

25/25 cenários host: hierarquia, entrada/saída, cinco políticas, captura repetida, quaternions/escala/morph e composição parcial, migração v4, prefab, caminhos longos, histórico e seleção de ligações. SDK e sonda C# compilados; contrato de componente e seis cenários de conexão de eventos passaram.

No POCO F7/Android 16, 15 checks C# passaram antes e após autoria e reabertura: três níveis, entrada condicional, saídas encadeadas, interrupções repetidas e isolamento. Por toque, criar/mover/duplicar/excluir, Undo/Redo e editar ligação preservaram **Destino → origem** e **0,20 voltas** após salvar/encerrar/reabrir. O arquivo autorado permaneceu idêntico após Play.

Todos os **598 quadros** da captura foram extraídos e revisados em **20 folhas**, com PTS e hashes. O mecanismo A mantém continuidade nos fades interrompidos; B fica independente. Play imediato introduz mudanças intencionais de pose na sonda. Skin/morph têm evidência host; o cenário físico usa mecanismos sem skin. Não mede FPS sustentado, multidões ou qualidade de caminhada.

Editor completo de clipes/curvas/poses, retargeting, IK, root motion e biblioteca com importação de FBX continuam pendentes. O inventário de FinalIK/UMotion é pesquisa; seus assets ainda não estão disponíveis como recursos importados na engine. BoZo permanece excluído.

Referências estudadas: [Unity 6000.0 — Nested State Machines](https://docs.unity3d.com/6000.0/Documentation/Manual/NestedStateMachines.html), [State Machine Transitions](https://docs.unity3d.com/6000.0/Documentation/Manual/StateMachineTransitions.html), [Animation Transitions](https://docs.unity3d.com/6000.0/Documentation/Manual/class-Transition.html) e [código Godot 4.5-stable](https://github.com/godotengine/godot/blob/4.5-stable/scene/animation/animation_node_state_machine.cpp). Hierarquia e arbitragem foram adaptadas ao modelo tipado e ao grafo de toque da Astra, sem copiar o layout das referências.
`
};
