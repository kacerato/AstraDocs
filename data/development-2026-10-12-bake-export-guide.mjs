export const developmentOctober12BakeExportGuide = {
  route: 'pt-br/desenvolvimento/2026-10-12/bake-e-exportacao',
  title: 'Desenvolvimento: bake da pose final e exportação GLB (N06)',
  description: 'Bake que transforma IK, constraints e root motion em chaves FK num clipe novo, com progresso, cancelamento e verificação sem solvers; exportação GLB de esqueleto e animação com relatório de perdas e prova de reimportação. Revisão de desenvolvimento, sem APK público novo.',
  body: `:::caution[Revisão em desenvolvimento]
Revisão de **12/10/2026** na branch de desenvolvimento. Validada no host (Windows); a validação no aparelho acontece na próxima liberação do ADB. O download público continua **0.3.0-preview.20261009/code 28**.
:::

## Bake da pose final

**Estúdio de animação → aba IK → Bake da pose final.** Usa o intervalo da timeline (ou o clipe inteiro) e reproduz o mesmo caminho do Play em cada quadro: **animação → root motion → constraints → IK** (dois ossos, cadeia, olhar, mira, grounder, corpo inteiro, efeitos, encaixes). O resultado vira um **clipe novo** em \`Clipes/<nome> · bake.aeclip\`; o original não muda.

- **Root motion no bake:** fica no osso (como animado) ou vai para o personagem (trilha do dono).
- **Job:** avança alguns quadros por atualização, mostra o progresso no cartão; tocar de novo **cancela sem publicar nada**. Se o clipe de origem mudar durante o bake, o job para e nada é publicado.
- **Qualidade antes de publicar:** cada quadro intermediário é comparado com a interpolação dos quadros gravados; passando de 1 mm (ou 0,1% do tamanho do personagem) ou 0,5°, o bake recomeça com o dobro da taxa, até 240 Hz.
- **Verificação:** depois de publicar, o clipe novo é tocado **sem solvers** em quadros intermediários e comparado com a pose resolvida. O relatório mostra o desvio em **milímetros** (unidades do mundo) e **graus**, a fração do tamanho do personagem, o osso e o instante do maior desvio.
- **Desfazer:** a criação do clipe é uma operação de histórico.

## Exportar GLB

**Aba IK → Exportar GLB.** Grava \`Exportados/<clipe>.glb\` com a hierarquia do personagem (nós) e a animação amostrada na taxa do clipe (canais de translação, rotação e escala, LINEAR), em metros, Y para cima e quaternions XYZW.

- **Prova de reimportação:** o arquivo é lido de volta pelo importador da engine e comparado com o clipe original em tempos intermediários; enquanto passar de 1 mm ou 0,1°, a taxa dobra (até 4×). O relatório mostra a taxa usada, o desvio em milímetros e graus e quantas amostras foram comparadas.
- **Relatório de perdas** (\`Exportados/<clipe>.relatorio.txt\`): eventos (cues), regiões, trilhas de propriedade e drivers não têm equivalente no glTF e são listados; camadas saem compostas numa só.
- **Escopo da saída:** esqueleto e animação. Malhas, skins e materiais não fazem parte deste arquivo; o modelo importado continua com a fonte original.
- **FBX:** não é oferecido. Só aparece quando houver prova de ida e volta equivalente.

AECLIP continua sendo a saída nativa e sem perdas.
`,
};
