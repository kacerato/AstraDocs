export const developmentOctober15TerrainGuide = {
  route: 'pt-br/desenvolvimento/2026-10-15/terreno-voxel',
  title: 'Desenvolvimento: terreno editável, prévia do pincel e camadas suaves',
  description: 'Reedição no Inspector, base sólida, prévia durante o gesto, escultura e navegação exclusivas e pintura triplanar. Cobertura e limites da revisão de 15/10/2026.',
  body: `:::caution[Desenvolvimento — aceite desta revisão no aparelho pendente]
A revisão de fonte **8713229** passou em **33/33 cenários integrados no host Windows**, incluindo a integração do Studio e da biblioteca presentes nessa revisão. O pacote de teste **Astra Terreno, code 85**, usa o identificador separado **dev.aether.editor.terrain**; seus projetos ficam separados da Astra Dev e do aplicativo público. A prévia, o novo layout, os operadores e o shader desta revisão ainda precisam de validação Android/Vulkan no aparelho. O download público e o catálogo da distribuição atual permanecem separados.
:::

Esta revisão amplia o [gerador inicial de 14/10](/pt-br/desenvolvimento/2026-10-14/terreno-voxel/). O terreno continua associado à sua receita depois de aplicado. A edição passa a ter entrada no Inspector, uma opção de base sólida e controles agrupados por tarefa.

## Criar um terreno com espessura

1. Abra um projeto e escolha **Criar → Geometria → Terreno e voxel**.
2. Em **Forma → Estrutura**, escolha **Relevo** e **Base sólida**. Novos terrenos por altura começam com essa estrutura; **Superfície** mantém a alternativa de uma malha aberta.
3. Use lado **64 m**, **32 células por lado** e espessura mínima **8 m**. São valores do exercício, editáveis nos campos; o tamanho de cada célula será 2 m.
4. Em **Forma → Relevo**, escolha **Colinas** e seed **1337**. A predefinição ajusta amplitude para 8 m, elevação base para 4 m, frequência para 2 e oitavas para 4. A seed permanece editável.
5. Toque **Criar terreno**. A geração prepara a malha, os materiais e a colisão antes de aplicar a revisão à cena. **Cancelar geração** preserva a geometria anterior.
6. Use **Ver** para enquadrar o resultado. Depois de aplicar, use **Gerir → Salvar cena** para persistir os objetos e o vínculo com a receita.

Os campos de dimensão e posição usam coordenadas locais do terreno; os rótulos em metros consideram a escala original. Escalar a raiz também escala o resultado no mundo.

## Retomar a edição depois de aplicar

Selecione a raiz **Terreno**, um de seus chunks ou um objeto anexado dentro desse grupo. No Inspector, toque **Editar terreno**. A ferramenta recupera a receita da revisão associada ao objeto, inclusive ao reabrir uma cena salva. Renomear o grupo não transforma a malha em um recurso sem autoria.

Também é possível usar **Gerir → Abrir seleção**. **Novo terreno** inicia outro rascunho; não é o comando para continuar editando o selecionado. Antes de trocar de terreno, aplique as alterações que deseja manter e salve a cena.

Se a fonte da receita estiver ausente ou inválida, o editor não cria silenciosamente um terreno substituto. Confira a seleção e recupere o GLB da revisão correspondente. O vínculo está no recurso persistido, não apenas no nome visível do objeto.

## Onde fica cada ajuste

| Aba | Organização e efeito |
| --- | --- |
| **Forma → Estrutura** | Relevo, voxel suave ou blocos; superfície/base sólida; espessura; dimensões e resolução. |
| **Forma → Relevo** | Predefinições, amplitude, elevação base, frequência, oitavas, seed e bordas de ilha. |
| **Forma → Detalhes** | Escala das texturas, colisão triangular e orçamento de geração. |
| **Esculpir → Ferramentas** | Ferramenta, forma, raio, força, núcleo rígido, rotação e proporção; Y para Nivelar/Caminho. |
| **Esculpir → Precisão** | XYZ local, carimbo numérico, remoção de amostra, espaçamento e alvo acima do dedo. |
| **Pintar** | Miniaturas das quatro texturas; camada, raio, força, escala, mistura triplanar e variação macro. |
| **Gerir** | Novo/abrir seleção, enquadrar, salvar, Desfazer/Refazer, reverter o rascunho e colisão. |

Durante a autoria, o viewport reserva espaço para um painel lateral próprio. Hierarquia, arquivos, Inspector genérico e gizmo deixam de disputar essa área. Fechar a ferramenta recupera os painéis e controles normais. O rodapé fica fora da rolagem; a posição de rolagem é preservada depois de aplicar um gesto.

Raio, força e núcleo rígido têm sliders e entrada numérica. Arrastar verticalmente sobre um slider rola o painel; arrastar horizontalmente ajusta o valor. Os campos **− / +** também aceitam entrada numérica. Propriedades da receita exigem **Aplicar configuração**. Salvar a cena não aplica o rascunho automaticamente.

## Superfície ou base sólida

**Superfície** gera apenas o relevo. **Base sólida** mantém esse topo e acrescenta quatro laterais externas e um fundo horizontal, formando um bloco fechado. Os limites internos dos chunks não recebem paredes.

**Espessura mínima da base** é a distância entre o ponto mais baixo do relevo final e o fundo. O padrão é 8 e o intervalo permitido vai de **0,1 a 512 unidades locais**. Exemplo: se o ponto mais baixo está em Y = 3 e a espessura é 8, o fundo fica em Y = −5. Ao esculpir um ponto abaixo do mínimo anterior, o fundo desce junto para preservar a espessura.

Fundo e laterais usam a camada **Rocha**, com normais planas e textura projetada nas faces. A pintura da superfície não altera esse material lateral. A colisão triangular, quando ativada e aplicada, inclui as paredes e a face inferior.

A opção pertence ao modo por altura. Ela não transforma o relevo em um campo de densidade escavável: para cavernas e remoção tridimensional de material, use **Voxel suave** ou **Blocos**. A base é uma malha fechada com colisão estática; não representa simulação de massa interna.

## Predefinições sem apagar a escultura

| Predefinição | Amplitude | Frequência | Bordas de ilha |
| --- | --- | --- | --- |
| Plano | 0 m | 2 | Desligadas |
| Colinas | 8 m | 2 | Desligadas |
| Montanhas | 24 m | 4 | Desligadas |
| Ilha | 16 m | 3 | Ligadas |

As quatro usam elevação base 4 m e quatro oitavas. Preservam a seed, a resolução, as camadas e as amostras de escultura já gravadas: mudam a origem procedural sobre a qual essas operações são reaplicadas. Confira o resultado antes de salvar. Para mudar de representação depois de esculpir, crie outro terreno; isso evita interpretar operações de densidade como operações de altura.

## Esculpir e pintar com o dedo

Selecionar uma ferramenta ou camada ativa a escultura. Ajuste raio, força, forma, núcleo rígido, rotação e proporção, depois **toque e arraste no terreno**. A marca mostra limite externo, influência interna e centro; operadores volumétricos mostram a forma tridimensional. **Precisão → Alvo acima do dedo** desloca a mira para deixar a superfície visível.

A prévia publica uma malha temporária **durante o gesto**, sem criar arquivo, recurso persistido ou etapa de Undo. Há um trabalho em execução; as amostras mais recentes são reunidas para a próxima atualização. Soltar confirma uma revisão e **um único Desfazer**. Cancelar repõe a geometria anterior.

**Navegar** desarma o pincel. Escolher orbitar, deslocar a câmera ou zoom também muda para navegação. O gizmo de mover/rotacionar/escalar fica fora deste espaço de autoria. Para transformar a raiz, feche o editor de terreno.

O arraste não pinta através do painel e apenas um dedo conduz o gesto. Exceder o limite da receita descarta o gesto com diagnóstico. A amostragem segue o deslocamento e o espaçamento; **não há acumulação por tempo ao manter o dedo imóvel**. A prévia ainda recalcula o terreno completo e republica o pacote gráfico agregado: não é remalhamento incremental nem promessa de 60 fps.

| Ferramenta | Uso |
| --- | --- |
| **Elevar / Baixar** | Acrescenta ou reduz altura na área do pincel. |
| **Nivelar** | Aproxima a superfície do Y configurado em **Precisão**, mantido como alvo durante o arraste. |
| **Suavizar / Aguçar** | Suaviza ou acentua diferenças de altura; nos voxels, atua na densidade tridimensional. |
| **Escavar / Adicionar** | Remove/acrescenta massa no voxel, com força e núcleo rígido. |
| **Ruído** | Variação determinística da altura pela seed e grupo de gesto. |
| **Terraços** | Aproxima alturas de intervalos definidos pela altura do degrau. |
| **Restaurar** | Recupera localmente relevo/densidade procedural e pesos naturais; preenche buracos. |
| **Buraco** | Corta células do relevo. Na base sólida, corta teto/fundo e fecha as paredes da abertura. Para volume, use Escavar. |
| **Pintar** | Mistura a camada por pesos suaves; no voxel considera distância tridimensional. |
| **Caminho** | Nivela para Y e pinta; interpola amostras do mesmo gesto. Gestos independentes não se conectam. |

Circular/esfera e caixa são formas básicas. Meia esfera e ponta cônica aparecem apenas para operadores volumétricos. Rotação orienta a forma, proporção alonga X em relação a Z e núcleo rígido define a região de influência plena antes da transição. Não há cubo arredondado, dimensão Y independente ou cone invertido nesta revisão.

Para uma aplicação exata, ajuste X/Y/Z em **Precisão** e use **Aplicar na posição XYZ**. Esse caminho permite alcançar o interior de um voxel. Ao abrir um terreno por altura depois de usar Escavar/Adicionar em um voxel, a ferramenta passa para Elevar, pois operações de densidade não se aplicam ao relevo.

**Remover última amostra** retira um único registro do pincel e regenera. Um arraste pode conter várias amostras: use **Desfazer** para reverter o gesto inteiro. **Reverter alterações não aplicadas** recarrega a receita atualmente aplicada ao terreno.

## Materiais, identidade e gerenciamento

As quatro texturas fornecidas, adaptadas para 256 × 256 pixels, permanecem: Grama, Rocha, Terra e Caminho. As miniaturas usam essas imagens reais. Novos terrenos ativam **Mistura e triplanar** por padrão.

Quatro pesos normalizados por vértice são interpolados na superfície. Inclinação e ruído compõem a distribuição natural; pintar modifica os pesos gradualmente. O shader combina projeções dos três eixos para reduzir esticamento nas paredes. A variação macro combina duas escalas/rotações e modulação suave de cor para reduzir repetição. UVs locais mantêm a textura associada ao terreno ao mover a raiz.

Escala e variação alteram a receita: use **Aplicar configuração**. O modo legado por região continua disponível. Laterais e fundo do relevo sólido permanecem Rocha. Isso não equivale ao MicroSplat completo: faltam normais/PBR por camada, height blend, arrays, clusters com texturas distintas, POM e reamostragem por distância. Aparência e custo GPU ainda aguardam teste no aparelho. UV1 contém dados de superfície; não é uma parametrização de lightmap.

A raiz e os chunks existentes preservam suas identidades ao regenerar. Materiais personalizados nos chunks existentes são mantidos. Se uma parte deixa de existir, os anexos diretos são preservados na raiz com a transformação mundial correspondente. Cópias de um mesmo chunk dentro do grupo precisam ser resolvidas antes da regeneração.

Cada aplicação grava uma revisão GLB com geometria, texturas e receita, e a cena passa a referenciá-la. Revisões antigas permanecem no acervo para Undo e referências de outras cenas. **Esta iteração ainda não tem coleta automática de revisões.** Muitas aplicações podem aumentar o consumo mesmo quando a revisão atual respeita seu limite. Não apague arquivos ainda usados por cenas ou pelo histórico.

A publicação de uma nova revisão considera a **biblioteca agregada de modelos importados**, com orçamento de **128 MiB de armazenamento CPU contabilizado e 4.096 draws**. A estimativa soma geometria, texturas decodificadas e metadados do acervo carregado ao candidato. **Gerir** mostra os totais retidos. Uma nova revisão que ultrapasse o orçamento é recusada antes de alterar os recursos; a revisão aplicada, as fontes e o histórico permanecem disponíveis. Uma revisão idêntica já carregada pode ser reutilizada sem duplicar sua fonte.

Essa proteção foi exercitada pela suíte integrada do host; sua medição no aparelho continua pendente. **Ela não é uma garantia geral contra falta de memória:** não limita toda a RAM do aplicativo, custos temporários de geração/publicação, memória da GPU, outros sistemas ou o crescimento dos arquivos no disco. Nenhuma fonte antiga é removida automaticamente para liberar o orçamento.

## Migração e compatibilidade

Receitas antigas **AETERRAIN1** continuam sendo lidas e preservam a superfície aberta. A espessura padrão fica disponível, mas só passa a ter efeito quando **Base sólida** for ativada e aplicada.

Receitas **AETERRAIN1/2** mantêm a aparência legada até ativar a nova mistura. Dig/Add antigos recebem núcleo rígido na migração. Novas gravações usam **AETERRAIN3**, com estrutura/espessura, forma, núcleo, rotação, proporção, grupo de gesto, mistura e variação de material. Geometria e receita ficam no mesmo GLB. Editores anteriores não reabrem a nova receita para autoria; conserve cenas/revisões anteriores para retorno. Abrir o projeto não converte automaticamente todas as fontes.

## Limites e recuperação

- Mundo finito; 8–128 células por lado, em múltiplos de 8; 8–64 células verticais nos voxels. Até 600 mil amostras volumétricas e 200 mil triângulos por terreno.
- Chunks de 16 células. A base sólida com 128 células usa 66.560 triângulos, incluindo fundo e perímetro; não exige a discretização tridimensional do voxel.
- **4.096 amostras de pincel por receita**, não 4.096 gestos. Raio pequeno em relação à célula pode produzir pouco detalhe e consumir mais amostras no arraste.
- A geração ainda recalcula o terreno completo. Não inclui remalhamento incremental, streaming infinito, LOD automático, vegetação procedural ou erosão hidráulica.
- Cancelamento, cena/projeto alterado durante o trabalho ou falha de publicação preservam a revisão aplicada. O rascunho pode continuar pendente: corrija o diagnóstico, reaplique ou use Reverter.
- Salve a cena depois de aplicar. Escultura durante Play permanece desabilitada; a colisão desta ferramenta é estática.

## Evidência desta iteração

Suíte integrada no host Windows: **33/33 cenários aprovados**. Cobre três modos, fechamento/colisão Jolt da base, migração/GLB, persistência/Undo/Redo, reedição pelo roteador de toque, XYZ/Y, orçamento e cancelamento. Também verifica operações novas, formas e núcleo rígido no voxel, buracos fechados, pesos/bindings sRGB e exclusão de gizmos. O teste da prévia confirma geometria elevada antes de soltar, atualizações sucessivas e preservação de documento, arquivos, recursos e histórico. Capturas por rasterização de software verificam a UI nativa, não a GPU Android.

No aparelho **25053PC47G, Android 16 / API 36**, o pacote **dev.aether.editor.u07** foi atualizado com instalação sobre a versão existente, sem apagar os dados. VersionCode 78 e versão 0.3.1-dev.terrain.20261015.1 foram conferidos no pacote instalado. Até este ponto, foram confirmados:

- Criação e exibição do relevo com base sólida.
- Fechamento do painel e reabertura da receita por **Inspector → Editar terreno**.
- Arraste real sobre o terreno, reunindo **nove amostras em uma única aplicação**.

Posteriormente, pintura do relevo e reabertura de projetos de teste também foram exercitadas no APK 78. Essa evidência anterior **não certifica a prévia, o layout, novos operadores ou shader da revisão 3**. A verificação desta revisão no telefone é registrada separadamente do resultado anterior. Conforto, latência, desempenho e colisão em jogo da nova revisão continuam pendentes.

Artefato anterior **Dev 78**: **109.172.209 bytes**; SHA-256 **a804f9d096fd0c5d1039b8ac65e95d42e956149c3a71e050625f7f06dbda1ee7**. Essa identidade registra o pacote anterior usado na validação e não substitui o APK do download público.

As provas do host da [entrega anterior](/pt-br/desenvolvimento/2026-10-14/terreno-voxel/) não certificam automaticamente esta revisão. Propostas visuais também não substituem a interface executada.

## Auditoria dos pacotes recebidos

Inventário físico: **753 arquivos de conteúdo** — Digger 6.0 (151), MicroSplat Collection rotulado 3.9.41 (517) e Path Painter II 2.1.10 (85). Os 11 módulos MicroSplat fornecidos declaram internamente **3.9.0 / Unity 2019.4**. Path Painter traz DLLs e API XML, sem fontes C# completas equivalentes. Extração não significa execução na Astra.

| Pacote | Incremento implementado | Capacidades pendentes |
| --- | --- | --- |
| Digger | Densidade finita, quatro formas, pintura, suavização/restauração/aguçamento, prévia e Undo. | Parâmetros completos, chunks afetados/LOD, API runtime pública e equivalência de algoritmos. |
| Path Painter | Faixa interpolada com nível e pintura, falloff e separação de gestos. | Acostamento independente, rampa/seguir relevo, pontos/curvas editáveis, vegetação, vizinhança e APIs completas. |
| MicroSplat | Quatro pesos, albedo triplanar e variação macro de escala/cor. | PBR/height blend, arrays/clusters completos, mapa global, neve, fluxos/lava/poças, mesh-terreno, tessellation/POM, alpha-hole e wind/glitter. |

A pesquisa separa **33 famílias de capacidades**. Nenhum dos três pacotes tem port completo. PDFs de outros módulos incluídos no core não indicam que suas fontes foram fornecidas. A auditoria está concluída como inventário; **a implementação de todas as capacidades permanece em andamento**.

A análise visual estudou o [vídeo oficial Unity de Terrain Tools, de 2019](https://www.youtube.com/watch?v=aExdxF4OKBo), incluindo **60 quadros consecutivos** nas sequências de 149 e 150 segundos, mais amostragens do restante. Também estudou o [Anti Tiling Module, de Jason Booth](https://www.youtube.com/watch?v=DJbT5-ckIDM) por amostragem. São referências de fluxo/aparência, não medições da Astra nem análise de todos os quadros dos vídeos.

## Referências de capacidade

- [Unity 6.0 — Paint Texture](https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-PaintTexture.html).
- [Unity Terrain Tools 5.0 — Brushes](https://docs.unity3d.com/Packages/com.unity.terrain-tools@5.0/manual/brushes.html).
- [Unity Terrain Tools 5.3 — Sculpt](https://docs.unity3d.com/Packages/com.unity.terrain-tools@5.3/manual/sculpt.html).

- [Unity 6.0 (6000.0) — Creating and editing Terrains](https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-UsingTerrains.html): autoria vinculada ao objeto selecionado, ferramentas no Inspector e pincel por clique/arraste.
- [Godot 4.6 — SurfaceTool](https://docs.godotengine.org/en/4.6/classes/class_surfacetool.html): geometria procedural com atributos e normais suaves/planas.
- [Godot 4.6 — BoxMesh](https://docs.godotengine.org/en/4.6/classes/class_boxmesh.html): dimensões de um volume retangular e subdivisão das faces.
- [Unity 6 (6000.7) — Terrain Layers](https://docs.unity.com/en-us/engine/6000.7/manual/creating-environments/script-terrain/terrain-textures): organização de camadas de terreno.
- [ITsMagic — Terrain](https://itsmagic.com.br/documentation/pt/docs/api-reference/Components/Terrain/): referência de organização mobile de ferramentas e propriedades.

O gerador e a UI são implementações da Astra. O estudo de Digger 6.0, MicroSplat 3.9.41 e Path Painter II 2.1.10, descrito na entrega inicial, não significa execução de DLLs Unity ou paridade com os plugins.
`
};
