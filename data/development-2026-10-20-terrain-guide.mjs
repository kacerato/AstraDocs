export const developmentOctober20TerrainGuide = {
  route: 'pt-br/desenvolvimento/2026-10-20/terreno-mapas-recuperacao',
  title: 'Desenvolvimento: mapas de pintura e recuperação do terreno',
  description: 'Resolução autoral da pintura, cópias de recuperação e limites da integração dos plugins.',
  body: `:::caution[Revisão local em desenvolvimento]
Esta página acompanha a branch de terreno de 20/10. Estas mudanças ainda não estão no APK 110 instalado anteriormente, nem no APK público. A validação desta revisão é local; o ADB está suspenso pelo proprietário. O primeiro bloco e os 71 itens continuam em implementação.
:::

## Resolução do mapa de pintura

Em **Forma → Detalhes → Células do mapa de pintura**, a barra escolhe de 8 a 512 células, em passos de oito. Toque no valor para entrada precisa. **0** conserva a avaliação legada. O controle aparece no relevo; a pintura volumétrica continua considerando paredes e tetos em três dimensões.

A resolução da malha continua no controle **Células por lado**. Mudar a resolução da pintura reexecuta os traços e caminhos originais, preservando a autoria. Diminuir e aumentar a resolução não substitui os traços por uma imagem degradada. Os mapas têm limites de memória e cancelamento cooperativo; a resolução máxima continua sendo uma escolha explícita.

O renderer atual ainda recebe pesos nos vértices e os interpola entre eles. Um mapa autoral mais detalhado **ainda não garante uma marca fina visível dentro de um triângulo grande**. A amostragem do mapa por fragmento, as resoluções independentes de vegetação e o PBR extensível continuam pendentes. Esta é uma entrega parcial do MapScaler previsto no plano.

Referência: [Unity 6000.0 — TerrainData](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/terraindata), com resoluções distintas para altura, alphamaps e detalhes. Os limites e o formato da Astra são próprios.

## Recuperar a autoria de uma revisão

Ao aplicar um terreno, o editor preserva uma cópia da receita antes de publicar a revisão. Pequenas diferenças podem ser guardadas como deltas exatos, com checkpoints periódicos e verificação por hash. Os arquivos de recuperação ficam em **.astra/terrain-history** dentro do projeto. Preserve essa pasta ao copiar o projeto para outro computador.

Se o GLB do terreno estiver ausente, truncado ou divergente do hash registrado, **Editar terreno** pode recuperar a receita validada. O painel informa **Receita recuperada do histórico**. Confira a prévia e aplique para reconstruir a geometria. Sem uma receita íntegra, a edição é recusada preservando o rascunho e a revisão existente.

Essa recuperação não reconstitui arquivos que nunca tiveram checkpoint. GLBs continuam sendo as fontes da cena e do Undo/Redo. Os deltas atuais são da receita; deltas de geometria e coleta completa dos arquivos antigos ainda não estão integrados. O editor não apaga revisões automaticamente nesta etapa.

Referência de estado registrado: [Unity 6000.0 — Undo.RegisterCompleteObjectUndo](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityeditor/undo/registercompleteobjectundo). O armazenamento em disco da Astra é uma implementação própria.

## Terrenos vizinhos e materiais

A implementação interna de vizinhança confere grupos e membros estáveis, arestas completas, altura mundial e identidade das camadas. Ela trata cantos compartilhados por quatro terrenos e recusa resoluções incompatíveis. A função completa de criação, seleção e publicação conjunta pelo editor permanece pendente; não há um botão novo anunciado por esta página.

Os contratos de materiais preservam camadas ordenadas, referências de textura, canais PBR, remapeamentos, triplanar, ruídos, resampling e variantes distintas. Isso prepara a integração do catálogo original, sem reduzir imagens. Modelo e serialização não provam a execução desses recursos no shader: o material visual atual de quatro albedos continua sendo uma limitação.

Referências: [Unity 6000.0 — Terrain.SetNeighbors](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Terrain.SetNeighbors.html), [TerrainLayer](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/terrainlayer) e [Shader Graph 17.0.4 — Sample Texture 2D Array](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Sample-Texture-2D-Array-Node.html).

## Compatibilidade e validação

Receitas novas usam **AETERRAIN7**, que acrescenta a resolução do mapa de pintura. As receitas 1–6 continuam legíveis; editores anteriores precisam de uma revisão compatível para reedição. Não remova revisões antigas ao alternar versões. As texturas originais não mudam de resolução nesta revisão.

Os resultados e a disponibilidade da revisão estão em [Atualizações](/atualizacoes/). A conferência no aparelho ficará para a etapa autorizada após a implementação e a verificação local.
`
};
