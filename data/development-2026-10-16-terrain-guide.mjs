export const developmentOctober16TerrainGuide = {
  route: 'pt-br/desenvolvimento/2026-10-16/terreno-caminhos',
  title: 'Desenvolvimento: pincéis volumétricos e caminhos editáveis',
  description: 'Escopo da revisão do primeiro bloco de terreno, caminhos, preservação de assets e validação local.',
  body: `:::caution[Bloco em implementação; aplicativo público inalterado]
Esta página descreve a branch de desenvolvimento de terreno. Não declara os 71 itens da auditoria nem o primeiro bloco concluídos. ADB está suspenso; capturas da UI executável no host e testes locais não certificam aparência, desempenho ou conforto de toque Android.
:::

## Pincel e edição

A revisão acrescenta cubo arredondado, dimensões XYZ independentes ou vinculadas, orientação em três eixos, direção invertida para meia esfera/cone, opacidade acumulativa ou alvo, profundidade em relação à superfície e trava de altura. Restaurar separa geometria e pesos; filtros volumétricos consideram vizinhos em três dimensões. O contorno do pincel usa a forma do operador.

Os parâmetros ficam em **Pincel → Ferramentas, Precisão e Forma 3D**. O editor continua mostrando a prévia antes da confirmação. Navegar desarma o pincel; o gizmo de transformar objetos não disputa o gesto de escultura.

## Caminhos como recursos editáveis

Abra **Traçado** e crie um caminho. A linha superior seleciona o caminho e cria outro. Em **Traçado**, selecione um ponto no viewport ou pelos controles anterior/próximo; ajuste X/Z, escolha segmentos retos ou curvos, insira/remova pontos e selecione caps redondos, retos ou quadrados. Duplicar e excluir permanecem no mesmo painel.

**Altura: seguir superfície** acompanha o terreno esculpido. **Altura: pontos XYZ** faz a altura de cada ponto participar do caminho, inclusive pontos intermediários. Em **Perfil**, a mistura com rampa uniforme conecta as alturas das extremidades; altura definida, elevação relativa, inversão e limite de inclinação têm controles separados. Campos sem efeito no modo escolhido ficam desabilitados.

**Perfil** controla pista, largura total do acostamento, vínculo de proporção e curva geométrica. Arraste os nós da curva ou ajuste suas coordenadas. É possível inserir/remover nós internos sem substituir toda a curva. Influência acima de 1 forma crista; abaixo de 0 forma vala em relação à diferença entre pista e terreno. A seção transversal usa a mesma curva.

**Materiais** mantém outra curva, com opacidade entre 0 e 1, camadas da pista/acostamento, transição e política de cruzamentos. Alterar a curva geométrica não altera a curva de pintura. Modelagem e pintura são independentes. O contrato de vegetação é reservado para o bloco com distribuição real; não há limpeza de grama/árvores anunciada nesta revisão.

**Aplicar** confirma a receita; **Salvar cena** preserva a cena. Reabrir o terreno recupera pontos, segmentos e parâmetros. Cancelar um arraste de nó restaura o rascunho anterior ao gesto.

## Assets e qualidade

A biblioteca preparada contém **82 entradas de material/configuração e 146 texturas únicas**, com fontes originais, proveniência e miniaturas separadas. PNGs utilizáveis diretamente mantêm os mesmos bytes; PSD/TIF/TGA recebem conversão sem redução de resolução. Miniaturas não substituem texturas de terreno. Oito referências de máscaras ausentes nos pacotes permanecem declaradas como dependências ausentes.

Essa biblioteca ainda precisa ser conectada à seleção e ao renderer completo. O material atual de quatro camadas não equivale a PBR por camada, height blend, noise normal ou clusters completos. A preparação dos assets não fecha M01–M08.

## Desempenho e limites

O campo de autoria e a triangulação são separados. A atualização identifica chunks afetados e dependências nas bordas; chunks sem mudanças podem ser reutilizados. Pintura filtra as operações que alcançam cada chunk. A exportação GLB e a prévia ao arrastar compartilham apenas vértices idênticos em todos os atributos, preservando todos os triângulos, normais, UVs e pesos no nível original.

A publicação gráfica por faixas mantém buffers do mesmo tamanho e envia os intervalos alterados. Mudanças de tamanho ainda substituem buffers; sincronização, filas e culling continuam tendo custo global. Isso não é promessa de taxa de quadros nem fechamento completo da publicação localizada. LOD do terreno, mapas independentes, vizinhança, histórico por deltas/GC e integração altura–volume seguem no escopo aberto.

## Migração e evidências

AETERRAIN5 grava o modo de altura dos pontos. Receitas 1–4 continuam legíveis; versão 4 conserva seguir superfície. Editores antigos não reabrem receitas novas para autoria. Preserve revisões ao alternar versões. Aplicar não substitui Salvar cena.

A contagem final de testes e a disponibilidade desta revisão constam na [nota de Atualizações](/atualizacoes/). Não existe APK desta revisão distribuído pelo site.

Referências: [Unity Splines 2.8.4 — Knots](https://docs.unity3d.com/Packages/com.unity.splines@2.8/manual/knots.html), [Unity 6000.0 — Mesh.SetVertexBufferData](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Mesh.SetVertexBufferData.html) e [Unity Terrain Tools 5.0 — Brushes](https://docs.unity3d.com/Packages/com.unity.terrain-tools@5.0/manual/brushes.html).
`
};
