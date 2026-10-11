export const developmentOctober11StudioGuide = {
  route: 'pt-br/desenvolvimento/2026-10-11/estudio-de-animacao',
  title: 'Desenvolvimento: estúdio de animação, rig, IK e transferência',
  description: 'Bloco N03 da revisão de desenvolvimento: estúdio em painéis, rig autorável, IK de dois ossos, espelho de membro, biblioteca de poses e transferência entre personagens. Aceite Android em Astra Dev, sem novo APK público.',
  body: `:::caution[Revisão em desenvolvimento]
Esta página descreve a revisão de **11/10/2026** da branch de desenvolvimento. Foi instalada e testada no aparelho do proprietário como **Astra Dev (dev.aether.editor.u07)**, mas **não é um APK público**. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## O que mudou

O editor de clipes deixou de ocupar a tela inteira. Com largura suficiente ele abre como **estúdio**:

| Área | Conteúdo |
|---|---|
| Esquerda | Hierarquia do objeto animado. Tocar um osso seleciona o mesmo alvo do toque no viewport. |
| Centro | Viewport com o personagem e o esqueleto desenhado por cima; coluna compacta de ferramentas (mover, girar, escala, enquadrar, orbitar, IK) e timeline embaixo. |
| Direita | Inspector com abas **Chave**, **Rig** e **Pose**. |

A timeline agrupa os eixos por osso e rola até o canal do osso selecionado. O botão de filtro mostra só o osso selecionado.

## Rig do personagem

Na aba **Rig**: **Capturar hierarquia** lê as juntas reais do objeto. Cada junta pode ter canais, espaço e limite (dobradiça ou cone e torção, com eixo e ângulos). **Publicar rig** grava \`Rigs/<nome>.aerig\` no projeto. O rig publicado é carregado junto com o clipe.

Em **Espelho**, **Sugerir pares por nome** encontra Left/Right, _L/_R e .L/.R, ignorando o número final que exportadores acrescentam (b_LeftUpperArm_09 / b_RightUpperArm_06).

## Pose, IK e espelho

1. Na aba **Pose**, ligue **Modo pose** e toque um osso.
2. **IK de dois ossos**: selecione a ponta (pata, mão, pé) e arraste o alvo âmbar. Os dois ossos acima giram, o comprimento é mantido e a dobra não inverte. O losango no joelho/cotovelo define a direção da dobra. Limites de dobradiça/cone do rig são respeitados. Alvo fora do alcance estica a cadeia e avisa.
3. **Espelhar membro para o outro lado** copia o membro do osso selecionado (do ancestral pareado mais alto até a ponta) para o lado oposto; o lado de origem não muda.
4. **Salvar pose atual** grava a pose do clipe no tempo atual como \`.aerpose\`; cada pose da biblioteca aplica-se com um toque, como chave.
5. **Fantasma** desenha o esqueleto no quadro anterior (azul) e no seguinte (âmbar).

Tudo isso usa o mesmo rascunho de pose do gizmo: com **Auto-key**, a chave entra ao soltar; Gravar, Cancelar e Desfazer funcionam igual. IK e espelho gravam na camada Base.

## Transferir animação para outro personagem

Na aba **Rig → Transferência**, escolha o **Destino** entre os personagens articulados da cena e toque **Transferir clipe**. As juntas são correspondidas pelo nome (exato, depois sem sufixo numérico). O movimento é avaliado pelo mesmo avaliador de transferência do runtime, que compensa poses de repouso diferentes, e gravado a 30 Hz como **clipe novo e independente** no destino. Se o destino não tiver rig publicado, ele é capturado na hora com a pose atual como referência.

## Limites conhecidos

- A correspondência da transferência é só por nome; um mapa manual por junta ainda não tem interface.
- Transferência grava rotações; posição da raiz e escala não são transferidas nesta revisão.
- IK e espelho gravam só na camada Base.
- Não há miniatura de pose; a biblioteca lista nomes.
- Fantasma usa um quadro de 0,1 s de cada lado, não as chaves vizinhas.
- Não declara paridade com UMotion, Animation Rigging ou FinalIK.
`,
};
