export const motorControlGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/posse-de-controle',
  title: 'Posse de controle: UI, teclado, gamepad, script e IA',
  description: 'Configure quem dirige um motor, troque a fonte em Play e inspecione a intenção realmente consumida.',
  body: `:::caution[Revisão de desenvolvimento]
Esta capacidade pertence à revisão U07 de 07/10/2026. O APK público da página Download continua na prévia de 06/10/2026 e não contém esta ampliação. O catálogo completo de 06/10 mantém seu próprio snapshot; esta página documenta somente o novo contrato de controle.
:::

## O que a posse controla

O Motor dinâmico e o Personagem recebem cinco canais de intenção: UI, teclado/mouse, gamepad, script e IA. A política escolhe um canal por passo físico. Ela não converte a malha, não substitui a colisão e não cria outro dono do transform. O Motor dinâmico continua aplicando forças ao Corpo existente; o Personagem usa seu motor virtual.

IA aqui é uma origem para comandos emitidos pelo seu Behavior. Esta entrega não implementa navegação, decisão de agentes, multiplayer, pareamento de controles por usuário ou rollback de rede.

## Configurar no editor

1. Selecione um objeto com Motor dinâmico ou Personagem e abra suas propriedades.
2. Em **Posse de controle**, escolha **Fonte de controle**. Automático arbitra prioridades; UI, Teclado/mouse, Gamepad, Script e IA são fontes exclusivas.
3. Em Automático, ajuste as cinco prioridades. As prioridades ficam ocultas nas fontes exclusivas, mas seus valores são preservados.
4. Configure as ações de movimento e salto no mapa Input do projeto. Teclado e gamepad precisam de vínculos reais nessas ações; selecionar uma fonte não cria vínculos automaticamente.
5. Para um joystick autorado, atribua **Jogador / receptor** no Canvas ao objeto com motor. A aparência do objeto e a aparência do joystick são independentes da posse.

O destino padrão de teclado/gamepad segue o motor ancestral da câmera ativa, depois o motor do alvo de Camera Follow. Sem esses vínculos, usa o motor da seleção ou de seu ancestral. Trocar o alvo libera os canais de hardware do destinatário anterior. Cada Canvas com receptor explícito continua controlando seu próprio motor pela origem UI.

| Propriedade | Identificador | Padrão | Efeito |
|---|---|---|---|
| Fonte de controle | control_source | Automático (0) | Arbitragem ou posse exclusiva |
| Prioridade UI | control_priority_ui | 10 | Peso do joystick/controles UI |
| Prioridade teclado/mouse | control_priority_keyboard | 10 | Peso das ações dessa origem |
| Prioridade gamepad | control_priority_gamepad | 10 | Peso das ações dessa origem |
| Prioridade script | control_priority_script | 20 | Peso dos comandos Script |
| Prioridade IA | control_priority_ai | 5 | Peso dos comandos IA |

Prioridades são números finitos de 0 a 1000. Fonte aceita 0 a 5. Alterar fonte ou prioridade em Play afeta o próximo passo, sem recriar corpo/cápsula nem apagar seu momentum. Como as demais alterações em Play, isso não modifica automaticamente a cena autoral salva.

## Arbitragem e cancelamento

Automático escolhe a maior prioridade entre canais com intenção. Empates usam a ordem estável IA → Script → Gamepad → Teclado → UI. As prioridades padrão mantêm Script acima do jogador manual, e IA abaixo dele.

UI e hardware neutros liberam sua contribuição. Um comando Script/IA com vetor zero significa **assumir a posse e parar**, durante o quadro atual. Uma fonte exclusiva permanece dona mesmo sem comando: outras origens não assumem o movimento enquanto ela está neutra.

Envie Script/IA em Update ou FixedUpdate. O comando de Update vale para os subpassos desse quadro; FixedUpdate pode substituí-lo. Se a origem parar de enviar, a intenção de movimento expira no quadro seguinte. Entre produtores da mesma origem, vence o último envio na ordem real de execução dos scripts.

Um pulso de salto aguarda o próximo passo físico, inclusive quando o toque é mais curto que esse passo. A tentativa acompanha a origem vencedora. Pulsos que perdem a arbitragem são descartados; não viram saltos atrasados quando outra origem solta a posse. A geometria/apoio do motor decide se a tentativa permite saltar.

Perder foco ou pausar cancela todas as intenções e saltos. Envios válidos enquanto a entrada está suspensa são consumidos sem guardar movimento para a retomada. Desconectar gamepad cancela seu canal e preserva teclado/UI. Desativar, remover ou substituir o motor libera seu estado; uma nova instância não herda a intenção da antiga. Remover, desabilitar, cancelar ou retargetar o Canvas/control limpa sua contribuição antes do passo físico. Depois de trocar o destinatário padrão, controles UI sem receptor exigem um gesto novo.

## API C#

GameObject.MotorControl() retorna um acesso vinculado à instância concreta de Motor dinâmico ou Personagem. A família nativa opcional é astra.motor-control, versão 1; o ABI principal permanece compatível.

\`\`\`csharp
using Astra;
using System.Numerics;

// Em um objeto que já possui Motor dinâmico ou Personagem:
var control = Object.MotorControl();
control.PolicySource = MotorControlSource.None; // Automático
control.Submit(MotorControlSource.Ai, new Vector2(0, 0.5f), yawRadians: 0);
// Envie novamente a cada Update/FixedUpdate enquanto desejar essa intenção.
control.Release(MotorControlSource.Ai);

var state = control.State; // Resultado do último passo físico
Scene.Log(ObjectId, $"Origem {state.Source}, intenção {state.Move}");
\`\`\`

| API | Contrato |
|---|---|
| PolicySource | None = Automático; Ui, Keyboard, Gamepad, Script ou Ai = exclusividade |
| Submit(source, input, yawRadians, jump) | Script/IA somente; eixos finitos em [-1,1], yaw finito em radianos; jump é uma tentativa |
| Release(source) | Libera Script/IA e seu salto pendente |
| State | Source, Candidates, Focused, HasMeasuredStep, JumpAttempt, Move, YawRadians e Priority |

Candidates é uma máscara: UI = 2, teclado = 4, gamepad = 8, Script = 16, IA = 32. Source = None no estado observado significa ausência de intenção ativa em Automático. HasMeasuredStep distingue observação de um passo consumido de um motor ainda sem passo. JumpAttempt não promete que houve salto. Focused informa a disponibilidade de entrada, inclusive suspensão pelo lifecycle.

As fachadas Astra.Components.Character e DynamicBodyMotor também expõem ControlSource e ControlPriorityUi/Keyboard/Gamepad/Script/Ai. Os comandos antigos MoveCharacter/DynamicMotor.Move continuam emitindo no canal Script; DynamicMotor.ReleaseMove libera esse canal para a política autorada.

Argumentos inválidos são recusados. Comandos para objeto inativo ou motor desabilitado são recusados com WorldException; componentes removidos, gerações antigas e outro mundo não redirecionam comandos. Um host sem a família opcional informa NotSupportedException. Não guarde um acesso antigo para controlar uma instância substituta: resolva o motor novo.

## Diagnóstico e exemplo

O diagnóstico físico contextual mostra a fonte selecionada, prioridade, candidatos, foco e vetor consumido pelo mesmo motor que altera a pose. Fora de Play, ele não inventa uma fonte medida.

O cenário de autoria U07 alterna fontes, concorrência Script/IA e prioridades em runtime. Ele usa o corpo humano de teste CesiumMan, com 19 juntas e seu clipe importado, além do rig Fox. A colisão do humano é medida na malha e vinculada ao Body controlador; a velocidade medida pelo Body ajusta a reprodução do clipe na amostra. O piso usa textura PBR de concreto e o Ambiente usa atmosfera física e névoa. A leitura de posição/posse vem da API real, sem simular movimento na UI.

Esses recursos reutilizam importação, skin, animação, materiais e Ambiente existentes. A amostra não encerra o bloco U08: root motion, retargeting e integração universal de estados de locomoção/aparência permanecem trabalho separado. A forma de colisão é medida na pose autoral; não acompanha cada osso a cada quadro.

## Terceira pessoa no laboratório

O Canvas usa Espaço de movimento = Câmera e referencia a câmera de Play. Avançar no joystick segue a orientação horizontal da câmera; girar a vista muda esse referencial.

Em Acompanhar alvo / CameraFollow, **Orbitar alvo** gira o deslocamento pela orientação em mundo da câmera, e **Altura do pivô** define o ponto observado no eixo Y do alvo. CameraLook controla yaw/pitch; CameraFollow posiciona a câmera depois da física. A amostra usa deslocamento (0, 0, -5), pivô 1,1 m e amortecimento zero para manter o personagem enquadrado ao arrastar. Esses valores são propriedades reais, editáveis, persistidas e acessíveis pela fachada C# CameraFollow.

O Body do humano bloqueia rotação X/Z e libera Y. O Behavior calcula a direção em mundo da intenção vencedora e controla somente a velocidade angular Y do solver, com ganho 12 e limite de 8 rad/s. Ele preserva a velocidade linear e a autoridade física: o corpo, sua colisão e o esqueleto giram juntos. No repouso, cancela o giro comandado.

CameraFollow altera somente a posição e preserva os ângulos locais da câmera, inclusive em uma volta completa. Isso evita inverter pitch/roll ao cruzar os polos da representação Euler.

O componente Braço de mola existe separadamente na engine. Este laboratório usa CameraFollow e não configura esse componente: sua órbita, sozinha, não garante impedir atravessamento da câmera em ambientes fechados.

## Arquivos e compatibilidade

O payload de Personagem passa a 5; o de Motor dinâmico passa a 3; CameraFollow passa a 2, com órbita e altura do pivô. CameraFollow 1 mantém o deslocamento em mundo, com órbita desativada e pivô zero. Personagem 1–4 e Motor dinâmico 1–2 mantêm seus campos anteriores e recebem Automático com as prioridades padrão. Políticas novas passam por cena, prefab, overrides e Undo/Redo. Reabrir uma cena desta revisão exige uma engine que compreenda os payloads novos; o APK público anterior não é um leitor desses novos formatos.

## Validação desta revisão

O contrato passou por oito cenários nativos direcionados, 117 cenários de regressão do editor e compilação do Behavior pelo ProjectCompiler real. Os geradores conferiram 56 tipos em dez famílias, 423 declarações de propriedades e 846 acessores; esses números são contratos gerados, não uma declaração de paridade da engine.

No POCO F7 com Android 16, uma aplicação de validação separada executou o laboratório: UI exclusiva, IA com prioridade 5, Script com 20, IA com 50, liberação do Script, pausa/retomada e retorno à IA após soltar o joystick. Alterar Fonte no Inspector, salvar, desfazer, refazer e reabrir após encerrar o processo preservou a política; os arquivos retirados do aparelho foram lidos pelo serializer nativo.

A gravação final de órbita e caminhada teve todos os seus 200 quadros decodificados e inspecionados, sem amostragem. A câmera cruzou 90° sem inverter; o corpo girou até aproximadamente -108° e caminhou na direção da câmera. Isso comprova esse gesto nesta revisão, não desempenho sustentado, comportamento em toda cena ou toda combinação de dispositivos. Gamepad foi validado no host, incluindo desconexão; não houve gamepad físico conectado ao Android.

O APK de validação tem SHA-256 d689f2095633082223b3a5341ab38c49d8c824c78b180f465654bbd39a368e0d. A instalação e o pacote no aparelho têm o mesmo hash. Esse pacote não substitui o APK público de 06/10/2026.

## Referências de capacidade

Godot 4.5: [Input](https://docs.godotengine.org/en/4.5/classes/class_input.html), [InputMap](https://docs.godotengine.org/en/4.5/classes/class_inputmap.html) e [estado por origem no código](https://github.com/godotengine/godot/blob/4.5-stable/core/input/input.cpp). Unity Input System 1.4.3: [PlayerInput](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.4/api/UnityEngine.InputSystem.PlayerInput.html). Godot 4.5: [câmera de terceira pessoa com pivô e órbita](https://docs.godotengine.org/en/4.5/tutorials/3d/spring_arm.html). A adaptação conserva ações, destinatários e cancelamento; não presume paridade de multiplayer dessas referências.
`
};
