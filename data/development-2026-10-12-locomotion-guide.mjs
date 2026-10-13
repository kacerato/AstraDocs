export const developmentOctober12LocomotionGuide = {
  route: 'pt-br/desenvolvimento/2026-10-12/locomocao-e-aparencia',
  title: 'Desenvolvimento: locomoção, apoio e aparência (N05)',
  description: 'Personagem com aceleração, frenagem, controle no ar, voo, nado na água da cena, dirigir e agachar com teto; root motion pelo motor com colisão e resíduo; trava de pé contra deslize; encaixe de acessórios no osso. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **12/10/2026** na branch de desenvolvimento. Validada no host (Windows); a validação no aparelho desta parte acontece na próxima liberação do ADB. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## Personagem (motor de locomoção)

Propriedades novas no componente **Personagem**. Cenas antigas abrem com o comportamento anterior (resposta instantânea, controle no ar total, modo Solo).

| Propriedade | Efeito |
|---|---|
| Aceleração (m/s²) | Rampa até a velocidade pedida; zero responde na hora. |
| Frenagem (m/s²) | Desaceleração ao soltar o comando ou inverter a direção; zero para na hora. |
| Controle no ar (0–1) | Quanto do comando vale sem apoio; zero conserva o impulso do salto. |
| Modo de movimento | **Solo** (gravidade e apoio), **Voo** (sem gravidade, eixo vertical), **Nado na água** (dentro de um volume de água com física da cena; fora dele volta ao solo), **Dirigir** (frente/trás é acelerador, lados são giro; não desliza de lado e não gira parado). |
| Velocidade de nado | Fração da velocidade dentro da água. |
| Giro ao dirigir (°/s) | Giro máximo; cresce com a velocidade e inverte de ré. |

Comandos em Play (C# e Conexões de evento): **Agachar** (\`Crouch(true/false)\`; levantar falha sem espaço acima), **Subir/descer** (\`SetVertical(-1..1)\`, voo e nado) e **Na água** (\`InWater()\`).

## Root motion pelo motor

O passo da animação agora vira **velocidade pedida ao Personagem**: a colisão decide o deslocamento realizado, sem atravessar paredes. O componente informa o **deslocamento realizado** e o **resíduo**; quando o mundo bloqueia mais da metade do passo, aparece o diagnóstico "Root motion bloqueado pelo mundo". Corpo dinâmico continua recebendo o passo como velocidade, e objeto sem física, como transformação.

## Contra o deslize

- **Apoio do pé → Travar pé no apoio:** enquanto o pé animado está a menos de **Altura de contato** do chão, ele fica no ponto onde tocou; solta quando o pé sobe ou quando ficar preso esticaria a perna além da **Correção máxima**.
- **Animator → parâmetros medidos** (velocidade no plano, vertical e apoio, já existentes) sincronizam idle/andar/correr e salto/queda/pouso com o movimento real.

## Aparência: Encaixe

Componente **Encaixe** (Adicionar componente → Lógica → IK) no acessório, arma ou parte modular: escolha o **Osso**, o deslocamento (posição e rotação) e se segue a escala do osso. Resolve no fim do passo de IK, então acompanha a pose final, inclusive o IK. Trocar o visual e perder o osso gera diagnóstico em vez de prender no osso errado.

## Câmera

A câmera virtual, o cérebro de câmeras e a colisão/desoclusão entregues antes continuam sendo o sistema de câmera; direção relativa à câmera vem do controle do Personagem.
`,
};
