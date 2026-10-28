import fs from 'node:fs';
import { trail, badge, to } from './tools.mjs';
import { publicComponent } from '../public-text.mjs';

// Índice gerado do catálogo do APK atual: cada componente com o que faz e de onde a
// Astra estudou a ideia. A ficha de cada um tem todas as propriedades.
const snapshot = 'snapshot-2026-10-28';
const components = JSON.parse(fs.readFileSync(`data/snapshots/${snapshot}/components.json`, 'utf8')).map(publicComponent);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
const cell = s => String(s ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const engine = url => !url ? '—' : /unity3d\.com/.test(url) ? `[Unity](${url})` : /godotengine\.org/.test(url) ? `[Godot](${url})` : `[referência](${url})`;
const families = [...new Set(components.map(c => c.family))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

const table = family => components.filter(c => c.family === family)
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  .map(c => `| [${cell(c.name)}](/pt-br/${snapshot}/componentes/${slug(c.typeId)}/) | ${cell(c.description)} | ${c.properties.length} | ${engine(c.reference)} |`)
  .join('\n');

export const componentsTrail = [
trail('componentes', 'por-familia', 'Componentes por família', 'Todos os componentes do APK atual agrupados por família, com o que cada um faz, quantas propriedades tem e a referência Unity ou Godot estudada.', `
${badge('host', `extraído dos descritores compilados do APK: ${components.length} componentes`)}

Cada componente tem uma ficha com **todas as propriedades** (tipo, unidade, padrão e faixa), o que cada uma faz, um exemplo, dependências e a fachada C#. A coluna Referência aponta a página oficial da Unity ou da Godot que a Astra estudou para aquele componente: ajuda quem vem dessas engines, **não é promessa de paridade**.

Procurando pelo nome da outra engine? A busca de **Adicionar componente** aceita termos como \`Rigidbody\`, \`Light\` ou \`ParticleSystem\`.

${families.map(f => `## ${f}\n\n| Componente | O que faz | Propriedades | Referência |\n| --- | --- | --- | --- |\n${table(f)}`).join('\n\n')}

Veja também ${to('componentes', 'ler-uma-ficha', 'Como ler uma ficha de componente')}.
`),

trail('componentes', 'ler-uma-ficha', 'Como ler uma ficha de componente', 'O que significa cada parte da ficha: padrão, domínio, por slot, ponto seguro no Play, dependências, fachada C# e roadmap.', `
${badge('host', 'formato das fichas geradas do catálogo')}

| Parte da ficha | O que diz |
| --- | --- |
| Para que usar · Criar e configurar | o problema que o componente resolve e o caminho no editor |
| Vindo de outra engine | a página Unity ou Godot estudada e as palavras que a busca aceita |
| Exemplo de uso | valores para experimentar e o resultado esperado |
| Dependências e Conflitos | o que precisa estar no mesmo objeto, e o que não pode |
| Edição e ciclo de vida | se dá para adicionar, remover e mudar em Play ("ponto seguro" = aplicado entre passos da simulação) |
| Propriedades | cada campo com **tipo/unidade**, **padrão** (o valor de um componente recém-criado) e **domínio** (a faixa aceita) |
| Comandos e eventos | o que o script e a Conexão de evento podem chamar e ouvir |
| Roadmap | o que ainda falta nessa família |

**Valores típicos:** o padrão é o ponto de partida seguro; as fichas dos componentes gráficos e os tutoriais de ${to('criar', 'cena-luz-ceu-clima', 'Criar um jogo')} trazem valores de exemplo testados.

**Por slot:** campos que valem para cada material ou recurso do objeto (escolha o slot antes).

**Recursos:** seletores de arquivo do projeto (material, malha, perfil, clipe), que não entram na contagem de propriedades numéricas.
`),
];
