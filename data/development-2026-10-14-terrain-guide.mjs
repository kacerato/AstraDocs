export const developmentOctober14TerrainGuide = {
  route: 'pt-br/desenvolvimento/2026-10-14/terreno-voxel',
  title: 'Desenvolvimento: gerador de terreno e voxel',
  description: 'Terreno por altura, voxel suave e blocos, com pincéis, materiais, chunks, colisão e receita editável. Revisão de desenvolvimento validada no host.',
  body: `:::caution[Revisão em desenvolvimento]
Implementação de 14/10/2026 na branch de terreno. Os testes foram executados no Windows. Ainda não há validação desta função no Android nem novo APK público. O catálogo da distribuição atual permanece separado.
:::

## Criar e editar

1. Abra um projeto. No menu de criação, procure **Terreno e voxel**.
2. Em **Gerar**, escolha **Altura / relevo**, **Voxel suave / cavernas** ou **Voxel em blocos**. Comece com seed 1337, lado 64 m, 32 células, amplitude 16 m e base 4 m. São valores iniciais editáveis.
3. Toque **Gerar e aplicar**. O trabalho mostra progresso e permite cancelar. Surge uma raiz Terreno com malhas separadas por chunk e material. Enquadre pela aba **Gerir**.
4. Em **Esculpir**, escolha ferramenta, raio em metros e força. Ative **Pincel no viewport** e toque na superfície. Cada toque aplica uma operação; não é um pincel contínuo por arraste. Para escavar dentro do volume, ajuste X/Y/Z locais e use **Aplicar pincel**.
5. **Camadas** escolhe Grama, Rocha, Terra ou Caminho; selecione Pintar em Esculpir para pintar. A escala da textura é medida em metros. **Gerar e aplicar** confirma alterações nos parâmetros.
6. Salve a cena. Para continuar depois, selecione a raiz ou um chunk, abra a ferramenta e use **Gerir → Abrir seleção**. Desfazer/Refazer restaura a receita e a geometria anteriores; Remover última retira a última operação e regenera.

Em painéis altos, os controles aparecem juntos. Em painéis baixos, as setas do rodapé percorrem páginas adaptadas à altura, mantendo o botão de geração acessível.

## Ferramentas com efeito

| Ferramenta | Efeito |
| --- | --- |
| Elevar / Baixar | Altera a superfície na área do pincel. |
| Nivelar | Aproxima a superfície da altura Y do pincel. |
| Suavizar | Suaviza alturas ou a densidade tridimensional do volume. |
| Escavar / Adicionar | Remove ou acrescenta densidade nos modos voxel; indisponível no terreno por altura. A força desses pincéis satura em 1. |
| Pintar | Atribui uma das quatro camadas à região horizontal do pincel. |
| Caminho | Nivela e pinta; operações consecutivas de Caminho interpolam a faixa entre seus centros. |

O modo por altura serve para relevo sem cavernas. O voxel suave representa superfícies volumétricas e cavernas; o modo em blocos preserva faces cúbicas. O volume é finito. Os chunks têm 16 células; a geração desta revisão recalcula o terreno inteiro, sem streaming ou LOD automático.

## Materiais, gerenciamento e persistência

Quatro texturas fornecidas com o material de referência foram incorporadas em versões de 256 × 256 pixels. A seleção inicial usa altura/inclinação. A projeção usa o eixo dominante de cada face: não há mistura triplanar completa nem mistura ponderada de camadas nesta revisão.

A raiz e os chunks existentes mantêm suas identidades na regeneração. Personalizações de material nos chunks existentes são preservadas. Se um chunk deixa de existir, anexos diretos são movidos para a raiz conservando a transformação mundial. Uma cópia de chunk dentro do grupo precisa ser removida antes de regenerar.

Cada revisão é um GLB com malhas, texturas e receita, salvo em Terrenos. A cena aponta para essa revisão. Arquivos antigos são conservados para o histórico: **não há limpeza automática nem orçamento global do acervo nesta versão**. Muitas edições aumentam disco e memória; trabalhe com resoluções moderadas. Não remova revisões ainda usadas por cenas ou Undo.

Colisão ativa cria corpos estáticos com colisores triangulares reais. Após trocar a opção em Gerar ou Gerir, gere novamente. O terreno pode ser usado no Play; escultura durante Play não está habilitada.

## Limites e recuperação

- 8–128 células por lado, em múltiplos de 8; 8–64 células verticais. A combinação deve respeitar até 600 mil amostras volumétricas e 200 mil triângulos.
- Até 256 operações por receita. Resolução e raios pequenos demais em relação ao tamanho da célula podem não produzir detalhe visível.
- Um trabalho cancelado não substitui o terreno. Se a cena ou o projeto mudar enquanto a geração ocorre, o resultado é descartado; gere novamente no contexto correto.
- Falha de publicação mantém os objetos anteriores. Os diagnósticos aparecem no painel. Salvar a cena continua necessário após aplicar.
- Não inclui mundo infinito, vegetação procedural, erosão hidráulica nem todos os shaders dos plugins estudados.

## Evidência e referências

Suíte nativa específica: geração determinística, três modos, GLB pelo importador real, pincéis, caminho, limites, cancelamento, publicação rejeitada, Undo/Redo, persistência, identidade dos chunks e colisão Jolt por raycast. A UI nativa foi capturada por rasterização de software no executável de testes em 1280 × 720 e 655 × 300; isso não comprova renderização Vulkan nem execução em telefone.

Referências de capacidade: [Godot 4.6 — SurfaceTool](https://docs.godotengine.org/en/4.6/classes/class_surfacetool.html), [Unity 6 — Terrain Layers](https://docs.unity.com/en-us/engine/6000.7/manual/creating-environments/script-terrain/terrain-textures) e [ITsMagic — Terrain](https://itsmagic.com.br/documentation/pt/docs/api-reference/Components/Terrain/). O fluxo de ferramentas e propriedades é inspirado na organização mobile da ITsMagic, adaptado à Astra.

Digger 6.0 foi estudado para densidade, operações e chunks; MicroSplat 3.9.41 para camadas/projeção; Path Painter II 2.1.10 para fluxo e texturas. A geometria é implementação nativa própria, com tetraedros no modo suave. Não é execução de DLLs Unity nem declaração de paridade com esses produtos.
`
};
