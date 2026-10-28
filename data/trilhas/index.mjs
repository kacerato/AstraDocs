// Páginas das trilhas (/guia/…), na ordem do menu.
import { startTrail } from './comecar.mjs';
import { editorTrail } from './editor.mjs';
import { createTrail } from './criar.mjs';
import { playerPage } from './player.mjs';
import { enemyPage } from './inimigo.mjs';
import { importTrail } from './importar.mjs';
import { scriptsTrail } from './scripts.mjs';
import { scriptsG7Trail } from './scripts-g7.mjs';
import { examplesG7Page } from './exemplos-g7.mjs';
import { componentsTrail } from './componentes.mjs';
import { downloadTrail } from './download.mjs';
import { examplesTrail } from './exemplos.mjs';
import { performanceTrail } from './desempenho.mjs';

export const trails = [
  { dir: 'comecar', label: 'Começar', pages: startTrail },
  { dir: 'editor', label: 'Editor', pages: editorTrail },
  { dir: 'criar', label: 'Criar um jogo', pages: [playerPage, enemyPage, ...createTrail] },
  { dir: 'importar', label: 'Importar', pages: importTrail },
  { dir: 'componentes', label: 'Componentes', pages: componentsTrail },
  { dir: 'scripts', label: 'Scripts C# e Flow', pages: [...scriptsTrail, ...scriptsG7Trail] },
  { dir: 'exemplos', label: 'Exemplos', pages: [...examplesTrail, examplesG7Page] },
  { dir: 'desempenho', label: 'Desempenho e qualidade', pages: performanceTrail },
  { dir: 'download', label: 'Download e versões', pages: downloadTrail },
];
export const trailPages = trails.flatMap(t => t.pages);
