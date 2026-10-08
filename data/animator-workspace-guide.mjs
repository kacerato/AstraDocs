export const animatorWorkspaceGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animator-universal',
  title: 'Animator universal: grafo e fontes de movimento',
  description: 'Edite animações de objetos, mecanismos e personagens com uma superfície contextual e vínculos opcionais com física.',
  body: `:::caution[Revisão de desenvolvimento]
Este workspace ampliado está em desenvolvimento. O APK público **0.2.3-preview.20261007** conserva o Animator anterior. Astra Dev **0.2.5-dev.20261007** foi aceita no POCO F7/Android 16 em 08/10/2026: mecanismo sem skin, vínculos físicos, parâmetros ao vivo, gestos e salvar/reabrir. O build do host passou em 9/9 cenários focados. Esta revisão ainda não foi distribuída no APK público. [Disponibilidade e APK](/download/).
:::

## Um grafo para objetos e hierarquias

O Animator não exige jogador, cilindro, câmera ou esqueleto humano. Clipes importados com canais de transform animam portas, atuadores, objetos e hierarquias articuladas, além de personagens. A raiz animada e o objeto que fornece movimento físico são referências independentes.

Curvas de propriedades arbitrárias de UI/material/áudio ainda não estão implementadas neste grafo. Submáquinas, interrupções, camadas aditivas, controller compartilhado, retargeting, root motion, IK e edição de clipes/Timeline continuam pendentes. Esta revisão não encerra todos os blocos U03/U06/U08.

## Criar e editar

1. Importe um recurso com clipes e canais de animação. Adicione **Animator** ao objeto pela família Animação na Inspeção; remova a Animação legada caso ocupe o mesmo objeto.
2. Abra o grafo. **+Estado** cria estado; toque no nó para editar nome, clipe ou mistura, velocidade, loop e eventos.
3. **Ligar** → origem → destino cria transição. Selecione a seta para configurar condições, saída e duração. Subir/descer muda sua prioridade dentro do mesmo grupo de origem. Qualquer estado é examinado antes das saídas do estado atual.
4. **Params** abre os parâmetros; **Ajustes** abre propriedades da seleção. Uma gaveta por vez mantém espaço para o grafo; arraste verticalmente para alcançar movimentos/eventos abaixo da área visível.
5. Arraste nós para posicionar; use dois dedos para navegar e ampliar. **Quadro** enquadra. Duplicar conserva dados do estado com nova identidade, sem copiar automaticamente suas conexões. Desfazer/refazer pertence ao documento.

Ícones novos usam a família angular branca com acentos verdes. Estado, transição, parâmetros, camadas, mistura, vínculo, enquadramento e duplicação estão no atlas real da interface.

![Grafo real no Astra Dev com um mecanismo e fonte física independente](/assets/animator-workspace-dev.png)

Captura real do APK Dev, com um mecanismo sem esqueleto. A interface ampliada ainda não está no APK público.

## Parâmetros manuais e vínculos

| Fonte | Tipo | Valor |
|---|---|---|
| Script/manual | Float, Int, Bool, Gatilho | Default autoral e comandos do script |
| Velocidade no plano | Float | Norma XZ do movimento medido |
| Velocidade vertical | Float | Componente Y com sinal |
| Apoio no chão | Bool | Apoio resolvido do Character/Motor |
| Velocidade total | Float | Norma XYZ |

Selecione o parâmetro, escolha **Fonte** e **Corpo / motor**. O proprietário é o padrão. Um Corpo comum pode fornecer velocidade; Apoio exige Personagem ou Motor dinâmico. Character usa velocidade relativa ao apoio; o Motor desconta a velocidade da plataforma quando apoiado.

Float vinculado permite **Escala** de −100 a 100 e **Resposta** de 0 a 10 segundos, com filtro exponencial; zero é imediato. Bool não é suavizado. Valores vêm do último passo físico concluído: o pipeline atual avalia animação antes da física do quadro, podendo haver um quadro de atraso. Seleção de fonte inválida/inativa ou física parada zera o vínculo e expõe diagnóstico. Scripts não podem sobrescrever silenciosamente um parâmetro vinculado.

## Testar em Play

O grafo mostra estado e valores vivos. Parâmetros manuais Float/Int/Bool podem ser alterados durante Play; gatilhos podem ser disparados. Esses valores de teste não alteram defaults nem entram no histórico. Estrutura do grafo permanece bloqueada. A visualização de mistura 1D/2D usa os pesos calculados pelo runtime, sem simular um editor de IK ou uma prévia 3D inexistente.

A fachada C# **Astra.Animator** expõe **Target** (raiz visual) e **MotionSource** (fonte física), ambas referências a objetos. O controlador **GameObject.Animator()** conserva os métodos de parâmetros e estados. Setters em parâmetros vinculados são recusados com **WorldStatus.Rejected**. Configuração aninhada de fonte/resposta/escala é feita pelo editor nesta revisão; sua API de autoria tipada ainda precisa ser ampliada.

## Validação desta revisão

Host: nove cenários de runtime/editor passaram; SDK Release compilado sem erros ou avisos. POCO F7/Android 16: parâmetro leu velocidade física 1.500, pose mudou e retornou ao repouso após parar; setters vinculados recusados. Float/Bool manuais e gatilho foram usados pela UI em Play. Pinça com dois dedos, rolagem dos 32 parâmetros e oito eventos, duplicar/desfazer/refazer e reabertura após encerrar o app passaram. Defaults manuais permaneceram zero após testar valores vivos.

A gravação do mecanismo teve todos os **717 quadros** revisados, sem amostragem temporal: abertura, estabilização e retorno contínuo. Isso não mede FPS sustentado nem prova retargeting, root motion, IK ou ausência de deslizamento de todos os personagens.

## Salvar e compatibilidade

Animator passa ao payload **v2**. Cenas v1 migram mantendo parâmetros manuais, escala 1, resposta 0 e origem no próprio objeto. V2 guarda fonte, escala, resposta e referência do corpo. APKs antigos não conhecem v2: **guarde uma cópia da cena antes de salvar na versão de desenvolvimento**. Navegação e valores ao vivo não são autoria.

Limites atuais: 32 parâmetros, 4 camadas; por camada, 24 estados e 48 transições; por estado, 8 movimentos e 8 eventos; por transição, 4 condições.

## Origem das decisões

[Unity 6000.0 Animator Controller](https://docs.unity3d.com/6000.0/Documentation/Manual/class-AnimatorController.html) e [Transitions](https://docs.unity3d.com/6000.0/Documentation/Manual/class-Transition.html) ajudam a separar parâmetros, estados e ordem de transições. [Godot 4.5 AnimationTree](https://docs.godotengine.org/en/4.5/tutorials/animation/animation_tree.html) e seu [editor de máquina de estados](https://github.com/godotengine/godot/blob/4.5-stable/editor/animation/animation_state_machine_editor.cpp) mostram seleção contextual e histórico. Na Astra mobile, adaptamos esses princípios para uma única gaveta, sem copiar sua aparência.
`
};
