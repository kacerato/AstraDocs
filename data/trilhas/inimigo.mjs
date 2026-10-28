import { trail, badge, shot, to } from './tools.mjs';

const current = '/pt-br/snapshot-2026-10-28';

export const enemyPage = trail('criar', 'inimigo-que-persegue', 'Inimigo que persegue e patrulha', 'Asse a malha de navegação e faça um inimigo perseguir o jogador sem código, ou patrulhar entre dois pontos com um script curto.', `
${badge('device', 'navegação aceita no POCO F7 dentro do APK público 0.3.0 (bake pelo Inspector e 7 verificações em Play)')}

Continue a cena do ${to('criar', 'fazer-um-player', 'Fazer um player')}: chão e paredes com colisão e o seu personagem.

## 1. A superfície de navegação

1. **+** › **Navegação › Superfície**.
2. No Inspector, confira as medidas do agente: **Raio do agente** 0,5, **Altura do agente** 2, **Altura do degrau** 0,4, **Inclinação máxima** 45°. **Coletar = Toda a cena**.
3. Toque **Assar**. O bake roda em segundo plano e grava \`Navegação/<nome>.navmesh\`. O viewport desenha a malha azulada, com um vão em volta das paredes.

${shot('criar/navegacao-malha.webp', 'Malha de navegação desenhada sobre o chão, contornando as paredes', 'Malha de navegação assada.')}

Só colisores **estáticos** viram chão. Mudou uma parede de lugar? O cartão fica "Desatualizada": asse de novo.

## 2. O inimigo, sem código

1. Selecione o seu personagem (o alvo).
2. **+** › **Navegação › Agente perseguidor**. Ele cria um Personagem com o componente **Agente** e um cilindro, já com **Seguir objeto** = a seleção.
3. Afaste o inimigo do jogador e aperte **▶**: ele contorna as paredes até você.

| Campo do Agente | Experimente |
| --- | --- |
| Velocidade | 3 (um pouco mais lento que o jogador a 4) |
| Distância de parada | 1,5 (para antes de encostar) |
| Girar para o movimento | ligado (o inimigo olha para onde anda) |
| Desvio de agentes | Alto, quando houver vários inimigos |

## 3. Patrulhar entre dois pontos (script)

> Conferido contra a API C# do APK; a execução desta receita no aparelho ainda não foi registrada.

Num Agente com **Seguir objeto** vazio:

\`\`\`csharp
using System.Numerics;
using Astra;
using Astra.Components;

[ComponentId("meujogo.patrulha")]
public sealed class Patrulha : Behavior
{
    private readonly Vector3 pontoA = new(-6, 0, 0);
    private readonly Vector3 pontoB = new(6, 0, 0);
    private NavAgent agente;
    private bool indoParaB;

    public override void Start()
    {
        if (Object.GetComponent<NavAgent>() is not { } encontrado) { Enabled = false; return; }
        agente = encontrado;
        // Ao chegar, troca de destino.
        agente.OnDestinationReached(this, _ =>
        {
            indoParaB = !indoParaB;
            agente.SetDestination(indoParaB ? pontoB : pontoA);
        });
        agente.SetDestination(pontoA);
    }
}
\`\`\`

Os pontos são posições no mundo, em metros; ponha-os sobre a malha. \`Stop()\` e \`Resume()\` pausam e retomam; \`Warp(ponto)\` teleporta.

## 4. Sem script: reagir à chegada

Numa **Conexão de evento** no inimigo: Evento **Agente: chegou**, Ação **Chamar método**, Método **Áudio: tocar**, Receptor = um objeto com Fonte sonora. Ver ${to('scripts', 'flow-sem-codigo', 'Flow: eventos sem código')}.

## Limites

- A malha fica onde foi assada: mover o objeto da Superfície não a desloca.
- Áreas nomeadas por projeto e volume modificador não existem; o **Modificador** muda a área de colisores no bake (Caminhável, Não caminhável, Salto, Difícil).
- Portas que abrem: use **Obstáculo**, que recorta a malha durante o Play.

Fichas: [Superfície](${current}/componentes/astra-navigation-surface/) · [Agente](${current}/componentes/astra-navigation-agent/) · [Obstáculo](${current}/componentes/astra-navigation-obstacle/).
`);
