import fs from 'node:fs';
import { trail, badge, to } from './tools.mjs';

// A tabela sai das notas de publicação: cada APK público aparece uma vez, com a nota
// que diz o que entrou nele.
const updates = JSON.parse(fs.readFileSync('data/updates.json', 'utf8'));
const releases = updates.entries.filter(e => e.kind === 'release' && e.availability === 'distributed');
const short = v => v.replace(/-preview\..*/, '');
const chapter = e => e.links.find(l => /\/versoes\//.test(l.url))?.url;
const row = e => `| ${short(e.releaseVersion)} | ${e.date.split('-').reverse().join('/')} | ${e.versionCode} | ${e.title.replace(/^APK [0-9.]+ publicado: /, '').replace(/^Astra [0-9.]+: /, '').replaceAll('|', '\\|')} | ${chapter(e) ? `[como usar](${chapter(e)})` : '—'} · [nota](/atualizacoes/#${e.id}) |`;

export const downloadTrail = [
trail('download', 'versoes', 'Versões e como atualizar', 'Todas as versões públicas da Astra para Android, o que entrou em cada uma, como atualizar sem perder projetos e a compatibilidade dos arquivos.', `
${badge('device', 'cada atualização foi instalada por cima da anterior no POCO F7, com os projetos preservados')}

A versão atual está em [Baixar Astra](/download/). O histórico completo, com as correções e as revisões de desenvolvimento, está em [Atualizações](/atualizacoes/).

## Versões publicadas

| Versão | Data | versionCode | O que trouxe | Mais |
| --- | --- | --- | --- | --- |
${releases.map(row).join('\n')}

## Atualizar sem perder projetos

1. Baixe o APK novo em [Baixar Astra](/download/).
2. Instale por cima, **sem desinstalar**. Todas as versões usam a mesma chave; o Android aceita a atualização e os projetos ficam.
3. Abra um projeto e confira antes de salvar.

## Compatibilidade dos arquivos

- Uma versão nova abre os projetos das anteriores e migra os arquivos ao salvar.
- Uma versão velha **não** abre arquivos salvos por uma mais nova. A 0.4.0 muda o formato das cenas, materiais e perfis: salve uma cópia do projeto antes se precisar voltar para a 0.3.2.
- O que muda em cada formato está na seção Migração de cada nota.

## Aparelhos

Android 8.0 ou mais novo, 64 bits (arm64-v8a), Vulkan 1.1 e páginas de memória de 4 KB. As medições de desempenho foram feitas num POCO F7; veja ${to('desempenho', 'niveis-de-qualidade', 'níveis de qualidade')} para aparelhos mais fracos.
`),
];
