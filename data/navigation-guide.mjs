export const navigationGuide = {
  route: 'pt-br/snapshot-2026-10-09/sistemas/navegacao',
  title: 'Navegação: malha, agentes, obstáculos e links',
  description: 'Asse a malha de navegação, faça personagens andarem até um destino ou perseguirem um alvo, recorte caminhos e ligue vãos com links.',
  body: `:::note[Disponível no APK público 0.3.0]
A navegação está na prévia pública **0.3.0-preview.20261009**, versionCode 28, em [Download](/download/). Foi aceita no POCO F7/Android 16 dentro do pacote público: bake pela Inspeção e sete verificações em Play. Links e obstáculos em movimento foram validados no host. Isso não garante todo aparelho ou cena.
:::

## Como funciona

A **Superfície de navegação** transforma os colisores estáticos da cena numa malha por onde os agentes andam. O bake acontece no editor e gera o recurso \`Navegação/<nome>.navmesh\` do projeto. No Play, a malha é carregada e cada **Agente** entra numa multidão que calcula caminho, desvio de outros agentes e velocidade. A velocidade vai para quem já move o objeto: Personagem, Motor dinâmico, corpo físico ou, sem física, a própria pose.

A Astra usa Recast/Detour 1.6.0 (licença zlib) para bake, consulta e multidão.

## Primeiro caminho em cinco passos

1. Monte o chão e as paredes com **Corpo físico estático + Colisor** (ou colisores Malha de um modelo importado).
2. **+ → Navegação → Superfície**. Selecione a Superfície e toque **Assar** na Inspeção. O cartão mostra polígonos, área, tiles e tempo; o viewport desenha a malha em verde, com vãos ao redor das paredes.
3. Selecione o objeto que será perseguido e use **+ → Navegação → Agente perseguidor**. O agente nasce com Personagem e com o alvo selecionado em **Seguir objeto**.
4. Toque Play. O agente contorna as paredes e para à **Distância de parada** do alvo. Se o alvo se mover mais que **Refazer caminho a**, o caminho é recalculado.
5. Salve. Ao reabrir o projeto, a malha volta do disco; o cartão diz **Assada e atual** ou **Desatualizada** quando a geometria mudou desde o bake.

## Superfície

| Grupo | Campos | Efeito |
|---|---|---|
| Agente | Raio, Altura, Altura do degrau, Inclinação máxima | Distância das paredes, espaço livre, desnível vencido sem link e rampa máxima |
| Coleta | Coletar (cena, filhos, volume), Camada dos colisores, centro/tamanho do volume | Quais colisores estáticos entram |
| Precisão | Célula, Altura da célula, Área mínima de região, Tile | Detalhe da malha e tamanho do bloco reconstruído por recortes |
| Avançado | Aresta máxima, Erro de borda, Amostra e erro de detalhe | Simplificação dos contornos e da altura |

O bake roda em segundo plano: **Cancelar** preserva a malha anterior. **Assar de novo** reescreve o mesmo recurso. **Desvincular** tira o recurso da Superfície (o arquivo continua no projeto); a atribuição é desfeita com Desfazer. **Malha visível/oculta** só muda o desenho no editor.

Objetos com Agente ou Obstáculo não viram chão assado. A malha fica onde foi assada; mover a Superfície depois não a desloca.

## Agente

| Campo | Uso |
|---|---|
| Superfície | Malha usada; vazio escolhe a que contém o objeto |
| Seguir objeto | Alvo perseguido sem script |
| Velocidade, Aceleração, Giro | Movimento pedido à multidão e giro para a direção do movimento |
| Distância de parada, Frear ao chegar | Onde chega e se desacelera antes |
| Raio, Altura, Deslocamento da base | Corpo usado no desvio entre agentes e altura do pivô na própria pose |
| Desvio de agentes | Nenhum, baixo, médio, bom ou alto |
| Áreas | Usar links e áreas de salto, atravessar área difícil e custos |

**Quem move o objeto.** Personagem e Motor dinâmico recebem a velocidade pela [posse de controle](/pt-br/snapshot-2026-10-07/sistemas/posse-de-controle/) na fonte **IA**, a de menor prioridade: o jogador ou um script assumem quando enviam comando. Corpo móvel sem motor recebe velocidade linear. Sem física, o agente move a pose do objeto; um filho com corpo físico impede isso e a Inspeção mostra o motivo.

### Pelo Behavior

\`\`\`csharp
var agente = Object.GetComponent<NavAgent>()!.Value;
agente.OnDestinationReached(this, _ => Scene.Log(ObjectId, "chegou"));
agente.OnPathFailed(this, _ => Scene.Log(ObjectId, "sem caminho"));
bool aceito = agente.SetDestination(new Vector3(7, 0, -7));
\`\`\`

| Membro | Efeito |
|---|---|
| SetDestination(Vector3) | Pede caminho; falso quando o ponto está longe da malha |
| Stop() / Resume() | Para no lugar guardando o destino / volta a ele |
| Warp(Vector3) | Teleporta Personagem ou pose para o ponto mais próximo da malha |
| RemainingDistance() | Comprimento do caminho restante; infinito sem caminho |
| PathStatus() | 0 sem caminho, 1 completo, 2 parcial, 3 inválido |
| HasPath(), IsOnLink(), Velocity() | Estado do quadro |
| OnDestinationReached, OnPathFailed, OnLinkEntered | Eventos, entregues no quadro seguinte |

SetDestination substitui o alvo de Seguir objeto até o próximo Resume. Conexões de evento também chamam **Agente: parar** e **Agente: retomar**.

## Obstáculos

O **Obstáculo de navegação** recorta a malha no Play (caixa que gira em Y ou cilindro). Só os tiles tocados são reconstruídos. Com **Recortar só parado**, o recorte sai enquanto o objeto se move e volta depois de **Tempo até parado**. Desativar o objeto devolve o caminho.

## Links

O **Link de navegação** liga duas bordas: vão, salto, escada. Posicione **Início** e **Fim** a menos do **Raio de conexão** da malha. Área **Salto** exige que o agente use links e áreas de salto; desligar **Nos dois sentidos** permite ir só do início ao fim. A travessia é linear e emite OnLinkEntered.

## Áreas e modificadores

O **Modificador de navegação** muda a área dos colisores deste objeto (Caminhável, Não caminhável, Salto, Difícil) ou os ignora no bake. Os custos ficam em cada Agente: com custo alto ele contorna a área difícil; com custo 1 atravessa.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| "Sem malha assada" no Play | Asse a Superfície e salve; confira se a Superfície está ativa |
| Agente fora de qualquer malha | Ponha o agente sobre o chão assado ou escolha a Superfície |
| Agente sem caminho atrás da parede | Raio do agente da Superfície maior que o vão; diminua o raio e asse de novo |
| Link não liga | Pontas longe da malha ou numa fatia estreita junto à divisa de tiles; aproxime-as do interior |
| Personagem não anda | Outra fonte de controle tem prioridade (jogador ou script); veja Posse de controle |

## Limites desta versão

Sem áreas nomeadas por projeto, volume modificador, tipos de agente, prioridade de desvio e superfície que acompanha o objeto. Consultas estáticas (amostrar ponto, calcular caminho sem agente) não estão na API C#. Sem medição de desempenho sustentado com multidões grandes.
`,
};
