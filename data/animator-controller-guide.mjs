export const animatorControllerGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animator-controllers',
  title: 'Animator: controllers compartilhados e overrides',
  description: 'Reutilize a definição de um grafo e substitua clipes por instância, em mecanismos, objetos e personagens.',
  body: `:::note[Disponível no APK público 0.3.0]
Controllers e overrides, aceitos no Astra Dev 0.2.6 (08/10/2026), estão no APK público **0.3.0-preview.20261009**, versionCode 28, em [Download](/download/).
:::

## Definição compartilhada, execução independente

Um arquivo **.aeanimator** guarda parâmetros, camadas, estados, movimentos, transições e eventos. Dois objetos podem usar o mesmo recurso e executar estados, relógios e parâmetros diferentes. O componente mantém sua raiz animada, corpo/motor, máscaras, ativação, velocidade global e relógio escalado ou real.

Um override troca um clipe original por outro em todos os usos daquele clipe dentro do grafo de uma instância. Isso funciona em hierarquias e mecanismos com clipes de transform, além de modelos com skin. A troca de clipe não faz retargeting humano: a hierarquia precisa oferecer nós compatíveis com seus canais. Atribuição sem canal compatível é recusada; correspondência parcial é indicada.

## Criar e reutilizar

1. Adicione **Animator**, abra o grafo e escolha **Recurso** na barra.
2. **Criar recurso** publica o grafo local como .aeanimator e vincula o objeto. Em outro Animator, **Escolher** atribui esse recurso.
3. A autoridade **Instância** protege a topologia compartilhada. Escolha o substituto abaixo do nome do clipe original; a seta de reset restaura aquele original.
4. **Editar recurso** permite mudar a definição compartilhada. A barra indica que a alteração afeta todos os consumidores. **Voltar à instância** encerra essa autoridade.
5. **Desvincular** incorpora o grafo resolvido e os clipes locais no objeto. **Copiar recurso** cria outra identidade, útil para separar a lógica.

A gaveta rola; nome e revisão continuam visíveis. Corpo e máscara aparecem como referências da instância abaixo da tabela de clipes. Os ícones de controller e override fazem parte do atlas do APK.

![Workspace real no Android: controller compartilhado e override local](/assets/animator-controller-dev.png)

Ao abrir .aeanimator nos Arquivos, um recurso já usado abre o grafo de um consumidor. Se ainda não tiver consumidor, abre no editor textual; atribua a um Animator para editá-lo visualmente. Um editor visual autônomo de recurso ainda não está nesta revisão.

## Histórico, arquivo e Play

Edições do recurso usam Undo/Redo do conteúdo compartilhado; mudanças da instância usam o histórico do objeto. Arrastar um estado compartilhado confirma um único passo. O próximo ID nunca volta para trás ao desfazer: estados novos não reciclam identidades removidas. Criar mantém o recurso disponível depois de Undo; Undo desfaz a atribuição.

Arquivo e registro são publicados pelo journal existente. Se o arquivo mudar externamente, a edição recusa sobrescrevê-lo: use **Recarregar** e confira a revisão. Um recurso ausente ou inválido interrompe a avaliação com diagnóstico; o grafo inline antigo não serve como fallback. Um override cuja origem desapareceu numa nova revisão permanece gravado, indicado como sem origem e removível explicitamente.

O Play carrega um snapshot dos controllers em memória. Alterar ou recarregar arquivos é autoria fora do Play; uma nova execução usa a revisão atual. Não há leitura de disco por quadro para resolver controller. Prefabs e clones preservam GUIDs dos recursos e remapeiam referências locais, incluindo máscaras.

## C# no Dev

A fachada tipada do componente expõe **GetController / SetController**. A API de parâmetros e estados continua no controlador de execução do objeto.

~~~csharp
using Astra;
using Astra.Components;

var source = door.GetComponent<Animator>()!.Value.GetController();
otherDoor.GetComponent<Animator>()!.Value.SetController(source);
otherDoor.Animator().SetFloat("Abertura", 1);
// Incorpora a definição e os clipes resolvidos nesta instância.
otherDoor.GetComponent<Animator>()!.Value.SetController(default);
~~~

Trocar por outro GUID limpa overrides locais e reinicia a máquina; reatribuir o mesmo GUID conserva os overrides. GUID desconhecido, tipo errado ou recurso não carregado é recusado antes de alterar o componente. O SDK desta distribuição pública anterior ainda não contém os métodos novos; use o SDK do Dev correspondente. A autoria aninhada do grafo e dos pares de overrides por API continua um bloco próprio.

## Migração e limites

**Validação:** host 11/11 cenários focados de runtime/editor, SDK Release sem erros ou avisos, build nativo e APK. No POCO F7: copiar recurso e desfazer a atribuição mantendo o arquivo, editar e mover estado compartilhado com Undo/Redo, escolher recurso, substituir/resetar clipe, rolar referências locais e salvar/encerrar/reabrir preservando revisão e override. A sonda C# passou seis checks de execução em dois mecanismos sem skin. Todos os **537 quadros** da gravação foram revisados, com PTS e hashes. O cenário muda parâmetros em degraus para comparar poses; não mede suavidade de locomoção humana, FPS sustentado ou todos os aparelhos.

Animator **v3** acrescenta controller e pares de clipes. V1/v2 continuam legíveis como grafos locais, com defaults e vínculos físicos preservados. O recurso utiliza **AEANIMATOR 1**. APKs anteriores não leem v3: preserve backup antes de salvar a cena no Dev.

Continuam os limites de 32 parâmetros, 4 camadas, 24 estados e 48 transições por camada, 8 movimentos e 8 eventos por estado. Controller reutilizável não encerra submáquinas, interrupções, aditivas, root motion, retargeting, IK, edição de clipes/Timeline, tracks de outras propriedades ou escala de muitas instâncias. U03/U06/U08 inteiros permanecem abertos.

## Origem das decisões

[Unity 6000.0 AnimatorOverrideController](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimatorOverrideController.html) separa lógica compartilhada e substituição de clipes, preservando saída em tempo normalizado. O [Inspector oficial, branch 6000.0](https://github.com/Unity-Technologies/UnityCsReference/blob/6000.0/Editor/Mono/Inspector/AnimatorOverrideControllerInspector.cs) usa pares original/substituto e aplica o conjunto. A Astra adapta esse fluxo à gaveta de toque e mantém overrides na instância. [Godot 4.5 AnimationTree](https://docs.godotengine.org/en/4.5/tutorials/animation/animation_tree.html) reforça a separação entre árvore e clipes e o estado de execução por instância.
`
};
