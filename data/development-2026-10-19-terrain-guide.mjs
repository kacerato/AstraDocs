export const developmentOctober19TerrainGuide = {
  route: 'pt-br/desenvolvimento/2026-10-19/terreno-integracao',
  title: 'Desenvolvimento: LOD autoral e continuidade do pincel',
  description: 'Como configurar o detalhe do terreno à distância, preservar a edição e entender os limites da revisão integrada.',
  body: `:::caution[Revisão de desenvolvimento]
Esta revisão integra o trabalho de terreno de 17/10 às alterações recentes do editor. O primeiro bloco e os 71 itens do plano continuam incompletos. Não há APK novo distribuído por esta página. A revisão de desenvolvimento 107 foi instalada no POCO F7; o alcance dos testes e as limitações estão em Atualizações.
:::

## Detalhe à distância

Abra **Forma → Detalhes → Detalhe à distância**. **Níveis** aceita de 1 a 4: um nível mantém apenas a geometria original; os demais habilitam versões reduzidas para renderização. **Erro máx. (%)** controla a tolerância da simplificação e fica desabilitado com apenas um nível. A seleção por distância utiliza o orçamento em pixels de Qualidade.

Toque **Aplicar** para gerar os níveis. A prévia durante a escultura mantém a malha original. A simplificação protege as bordas dos chunks e considera normais e pesos de pintura. A colisão usa a geometria original. Isso não certifica ainda a aparência das transições no renderer Android.

O ajuste pertence ao terreno, permanece na receita e acompanha aplicar, desfazer/refazer e reabrir. **Salvar cena** continua necessário para persistir os objetos da cena.

## Continuidade do pincel

O espaçamento acumula a distância percorrida entre eventos de entrada, inclusive em curvas. Subdividir a mesma linha de entrada em mais eventos não deve aumentar a quantidade de carimbos. Ficar parado não acrescenta carimbos; perder a superfície interrompe a continuidade. Em volume, a distância inclui os três eixos.

Essa regra não reconstrói posições que o aparelho deixou de informar e não equivale a pressão ou força por tempo. O teste integrado e seus limites ficam registrados na [nota de Atualizações](/atualizacoes/).

## Memória e assets

Buffers podem conservar uma reserva limitada ao crescer ou diminuir. O crescimento envia a região nova e as faixas alteradas; uma região reativada é enviada novamente. Isso preserva a qualidade da geometria e não significa arena por chunk nem sincronização totalmente localizada.

As fontes da biblioteca permanecem na resolução original; miniaturas são recursos separados. O catálogo preparado ainda não está ligado ao PBR completo do terreno. Seleção extensível, normal, altura, misturas, ruídos e clusters continuam obrigatórios no plano. O material atual de quatro albedos não representa a conclusão dessas capacidades.

## Migração

### Aplicar a prévia: correção posterior de 19/10

Ao soltar o pincel ou tocar **Aplicar**, uma prévia completa da mesma receita pode ser compartilhada com a aplicação, sem gerar novamente o campo e a malha. Se houve alteração, a geração recebe o resultado anterior e reutiliza chunks compatíveis. Alterações estruturais podem continuar exigindo reconstrução completa. Nenhum asset ou propriedade foi reduzido para obter esse reaproveitamento.

A prévia reutiliza também os vínculos de textura da fonte, sem publicar cópias adicionais das imagens. Isso evita que o gesto sozinho esgote os descritores em projetos com histórico extenso. O limite global de texturas e o crescimento das revisões ainda exigem trabalho no gerenciamento.

Exportação/importação GLB e publicação agregada ainda têm custo. Essa correção não conclui a arena por chunk nem a sincronização localizada. O estado de validação desta correção está na nota **Terreno: aplicação reaproveita a geometria da prévia**, em [Atualizações](/atualizacoes/).

Referência do trabalho de atualização de geometria: [Unity 6000.0 — Mesh.SetVertexBufferData](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Mesh.SetVertexBufferData.html). O cache de aplicação é implementação própria da Astra, sem alegação sobre o algoritmo interno da Unity.

### Compatibilidade de receitas

Receitas novas usam **AETERRAIN6**, que salva a política de LOD. Receitas 1–5 continuam legíveis. Editores anteriores não aceitam a receita 6 para reedição: preserve uma revisão compatível antes de alternar versões. As páginas de [15/10](/pt-br/desenvolvimento/2026-10-15/terreno-voxel/) e [16/10](/pt-br/desenvolvimento/2026-10-16/terreno-caminhos/) são registros das revisões anteriores.

Referências: [Godot 4.5 — Mesh LOD](https://docs.godotengine.org/en/4.5/tutorials/3d/mesh_lod.html) e [Unity 6000.0 — Terrain.heightmapPixelError](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Terrain-heightmapPixelError.html).
`
};
