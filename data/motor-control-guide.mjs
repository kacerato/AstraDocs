export const motorControlGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/posse-de-controle',
  title: 'Posse de controle: UI, teclado, gamepad, script e IA',
  description: 'Configure quem dirige um motor, troque a fonte em Play e inspecione a intenção realmente consumida.',
  body: `:::note[Disponível no APK público 0.2.2]
Esta capacidade está na prévia pública **0.2.2-preview.20261007**, versionCode 7, disponível em [Download](/download/). É o mesmo APK atualizado e conferido no aparelho de aceite. O catálogo completo de 06/10 conserva seu snapshot histórico; este guia de 07/10 documenta posse, movimento medido, animação e câmera do laboratório. Publicar esta correção não declara todo U08 nem a engine completa.
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

O destino padrão de teclado/gamepad segue o motor ancestral do alvo da câmera virtual efetivamente ao vivo no Cérebro. Sem esse vínculo, segue o motor ancestral da câmera ativa, depois o alvo de Camera Follow e a seleção. Trocar o alvo libera os canais do destinatário anterior. Cada Canvas com receptor explícito continua controlando seu próprio motor pela origem UI.

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
| MotionState | HasMeasuredStep, Grounded, Velocity, GroundVelocity, GroundNormal, GroundPoint e SupportObjectId, medidos pelo solver |

Candidates é uma máscara: UI = 2, teclado = 4, gamepad = 8, Script = 16, IA = 32. Source = None no estado observado significa ausência de intenção ativa em Automático. HasMeasuredStep distingue observação de um passo consumido de um motor ainda sem passo. JumpAttempt não promete que houve salto. Focused informa a disponibilidade de entrada, inclusive suspensão pelo lifecycle.

As fachadas Astra.Components.Character e DynamicBodyMotor também expõem ControlSource e ControlPriorityUi/Keyboard/Gamepad/Script/Ai. Os comandos antigos MoveCharacter/DynamicMotor.Move continuam emitindo no canal Script; DynamicMotor.ReleaseMove libera esse canal para a política autorada.

Argumentos inválidos são recusados. Comandos para objeto inativo ou motor desabilitado são recusados com WorldException; componentes removidos, gerações antigas e outro mundo não redirecionam comandos. Um host sem a família opcional informa NotSupportedException. Não guarde um acesso antigo para controlar uma instância substituta: resolva o motor novo.

## Diagnóstico e exemplo

O diagnóstico físico contextual mostra a fonte selecionada, prioridade, candidatos, foco e vetor consumido pelo mesmo motor que altera a pose. Fora de Play, ele não inventa uma fonte medida.

O laboratório inicia em UI exclusiva: soltar o joystick para o jogador sem a IA retomar a marcha. Os botões permitem alternar fontes, concorrência Script/IA e prioridades. O humanoide de teste do Godot TPS Demo tem 145 juntas e oito clipes importados; Fox permanece um segundo rig. Piso PBR e atmosfera física são recursos editáveis.

MotorAnimationDriver usa MotionState do motor: repouso com clipe próprio, mistura Walk/Run com fase sincronizada, impulso, subida, ápice, queda e aterrissagem. Apoio físico decide chão/ar; velocidade relativa ao suporte decide cadência. Histerese evita alternar repouso/marcha por ruído. A amostra calibra ciclos Walk = 1,75 m e Run = 2,666667 m na fonte original; nomes de clipes, passadas, velocidades e fade são parâmetros tipados do controlador.

A derivação remove o track dedicado de root motion, pois o Body move o ator por forças. Não congela Walk para produzir repouso nem anima caminhada no ar. Alterar Time/Speed/WrapMode de AnimationState preserva uma transição em andamento. O Motor mantém aceleração/frenagem reais e seu controle aéreo é .85 no laboratório, editável no Inspector.

Esses recursos usam importação, skin, misturador, física e Ambiente existentes. Não encerram todo U08: IK de pés, root motion em runtime, retargeting e editor visual universal de blend trees continuam separados. A forma de colisão é medida na malha autoral e vinculada ao Body; não acompanha cada osso por quadro. Cadência calibrada reduz deslizamento, mas não promete contato perfeito dos pés em terreno irregular.

## Terceira pessoa no laboratório

O Canvas usa Espaço de movimento = Câmera e referencia a câmera de Play. Avançar no joystick segue a orientação horizontal da câmera; girar a vista muda esse referencial.

O laboratório usa **Câmera virtual orbital + Cérebro**. CameraTarget é um filho do Body a 1,3 m de altura; órbita de 5 m, pitch entre -65° e 70° e raio de câmera .25 m. Evitar obstáculos consulta a física por varredura de esfera, ignora o Body do alvo, contrai imediatamente diante do chão/parede e libera com amortecimento .2 s. Distância mínima .1 m e plano próximo .05 m são propriedades editáveis e persistidas.

O gesto escopado do Canvas soma-se ao olhar global e chega à câmera real com Cérebro, sem CameraLook escrever uma segunda pose. A órbita é independente da rotação do corpo. No pitch extremo contra o piso, retrair pode recortar o ator. Colisão requer colliders e filtros adequados; não protege contra geometria sem forma física, sensores ou toda configuração de spawn penetrado.

O Body do humano bloqueia rotação X/Z e libera Y. O Behavior calcula a direção em mundo da intenção vencedora e controla somente a velocidade angular Y do solver, com ganho 12 e limite de 8 rad/s. Ele preserva a velocidade linear e a autoridade física: o corpo, sua colisão e o esqueleto giram juntos. No repouso, cancela o giro comandado.

CameraFollow altera somente a posição e preserva os ângulos locais da câmera, inclusive em uma volta completa. Isso evita inverter pitch/roll ao cruzar os polos da representação Euler.

CameraFollow continua disponível para outras cenas. Sua órbita não consulta colisão; use a câmera virtual com Evitar obstáculos ou o Braço de mola quando precisar de retração física. O laboratório agora usa a câmera virtual/Cérebro.

## Arquivos e compatibilidade

O payload de Personagem passa a 5; o de Motor dinâmico passa a 3; CameraFollow passa a 2, com órbita e altura do pivô. CameraFollow 1 mantém o deslocamento em mundo, com órbita desativada e pivô zero. Personagem 1–4 e Motor dinâmico 1–2 mantêm seus campos anteriores e recebem Automático com as prioridades padrão. Políticas novas passam por cena, prefab, overrides e Undo/Redo. Reabrir uma cena desta revisão exige uma engine que compreenda os payloads novos; o APK público anterior não é um leitor desses novos formatos.

## Validação desta revisão

O contrato passou por doze cenários nativos direcionados, 121 cenários de regressão do editor e compilação do Behavior pelo ProjectCompiler real. Os geradores conferiram 56 tipos em dez famílias, 423 declarações de propriedades e 846 acessores; esses números são contratos gerados, não uma declaração de paridade da engine.

No POCO F7 com Android 16, uma aplicação de validação separada executou o laboratório: UI exclusiva, IA com prioridade 5, Script com 20, IA com 50, liberação do Script, pausa/retomada e retorno à IA após soltar o joystick. Alterar Fonte no Inspector, salvar, desfazer, refazer e reabrir após encerrar o processo preservou a política; os arquivos retirados do aparelho foram lidos pelo serializer nativo.

A correção de movimento teve **527 quadros** inspecionados sem amostragem: 300 de locomoção em 38 páginas e 227 de colisão/orbita em 29 páginas. Foram observados acelerar, saltar andando, mudar direção no ar, soltar, aterrissar, voltar a repouso e saltar parado. Estados Jump/Rise/Apex/Fall substituíram a caminhada aérea; Idle retomou sem congelar Walk. Na órbita desejada contra o piso, a câmera retraiu, mantendo-se fora do chão. O ângulo extremo recorta o personagem; composição automática e fade de oclusores não estão implementados.

A checagem de piso no host percorreu 72 ângulos; o quadro a quadro comprova os gestos dessas capturas, não toda cena/dispositivo ou desempenho sustentado. Gamepad foi validado no host, incluindo desconexão; sem gamepad físico no Android.

Play aguarda publicação Current dos scripts, inclusive na primeira abertura. Catálogo Empty não é assembly pronto. O caso de partida prematura foi reproduzido e corrigido; os gestos de aceite só começaram depois de READY da abertura atual.

O APK principal 0.2.2-preview.20261007 foi atualizado no aparelho sem desinstalação, usando a chave de distribuição existente. Contém somente U07Laboratorio, com 21 arquivos exatos, incluindo metadata restaurada como .astra. A migração aposentou os dez defaults reconhecidos por nome/descriptor/layout histórico; manteve os dois projetos do usuário, com hashes iguais antes/depois. Salvar, encerrar, reabrir e executar Play foram conferidos no principal; o arquivo retirado foi lido pelo serializer nativo. ProjectStore passou 7/7 casos de migração/preservação/reabertura.

A validação separada tem SHA-256 1ab86324c41ed7cb1a632f4bfa52ebba5d2d961b91eab317754cd4ba063236a0; o APK público instalado tem 61f7d8d85581dc090ad906e865b2e96c4ff974bf14cab4b5202806c0a2075936. Os hashes instalados coincidem e a biblioteca nativa é idêntica. O Download público agora entrega exatamente esse APK 0.2.2, com a mesma chave de distribuição das prévias anteriores.

Uma regressão integrada inicialmente recusou uma publicação de dependências de prefab (120/121); o caso isolado passou 1/1 e a repetição integrada 121/121. A causa ambiental da recusa transitória não foi estabelecida. Não se apresenta esse primeiro resultado como aprovação.

## Público e desenvolvimento

**Astra** é o aplicativo público, pacote **dev.aether.editor**, instalado pelo [Download](/download/). **Astra Dev** usa pacote/dados separados: **dev.aether.editor.u07**, mantido para não perder seus projetos de desenvolvimento. Não é necessário instalar Dev para usar a Astra pública. As cópias chamadas validacao/u07 surgiram para testar sem alterar a instalação principal; a validação antiga não é um terceiro canal público.

A distribuição pública conserva assinatura e aumenta versionCode. Desenvolvimento reutiliza seu pacote em revisões futuras, identificado como Astra Dev; não cria outro ícone a cada bloco. Não mova um APK Dev sobre o pacote público com assinatura diferente. Desinstalar apaga dados: copie os projetos antes. A instalação principal foi atualizada sem desinstalação nesta revisão.

## Próximos blocos

1. **Locomoção e aparência — U03/U06/restante U08:** apoio adaptativo para formas/compostos, degraus/agachar e plataformas; modos físicos específicos de água/voo/veículos; troca de aparência sem alterar física, retargeting, root motion com autoridade explícita, IK e autoria visual das transições. A integração atual de oito clipes não encerra esse pacote.
2. **UI componível — U10/R0–R12:** ampliar estilos e fundo removível, interação/eventos, layout/texto/IME, bindings, coleções, formulários/inventário, composição espacial, acessibilidade e exportação. Cada item mantém o contrato do roadmap original.
3. **Modelagem visual completa:** topologia de vértices/arestas/faces, operações de malha no viewport, UVs, materiais, normais/tangentes, instâncias/prefab/reimportação e colisão. A edição física aceita de U11 não substitui este editor visual no nível ProBuilder.
4. **SDK/reprodução/rede/custo — U12/U13/U14:** operações tipadas equivalentes à autoria, handles/staleness, snapshots/posse/correção e orçamentos medidos de CPU/GPU/memória/thermal. Sem prometer determinismo ou desempenho universal antes de medir.

Autoria física U01/U02/U04/U05/U09 e o contrato físico de U11 já têm aceites dentro dos limites publicados; não serão anunciados novamente como inteiramente pendentes. Prioridade seguinte: locomoção/animação, porque define o comportamento do personagem e os consumidores que os demais blocos usam.

## Referências de capacidade

Godot 4.5: [Input](https://docs.godotengine.org/en/4.5/classes/class_input.html), [InputMap](https://docs.godotengine.org/en/4.5/classes/class_inputmap.html) e [estado por origem no código](https://github.com/godotengine/godot/blob/4.5-stable/core/input/input.cpp). Unity Input System 1.4.3: [PlayerInput](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.4/api/UnityEngine.InputSystem.PlayerInput.html). Godot 4.5: [câmera de terceira pessoa com pivô e órbita](https://docs.godotengine.org/en/4.5/tutorials/3d/spring_arm.html). A adaptação conserva ações, destinatários e cancelamento; não presume paridade de multiplayer dessas referências.
`
};
