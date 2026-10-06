import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const engineRoot = process.argv[2] || process.env.ASTRA_ENGINE_ROOT;
if (!engineRoot) {
  console.error('Informe o checkout da engine: npm run sync:api -- C:/caminho/atchengine');
  process.exit(1);
}
const project = path.resolve(engineRoot, 'managed/Astra.Scripting/Astra.Scripting.csproj');
if (!fs.existsSync(project)) throw new Error(`Projeto não encontrado: ${project}`);
const args = ['run', '--project', 'tools/export-api', '--', project, 'data/api.json'];
if (process.argv[3]) args.push(path.resolve(process.argv[3]));
const result = spawnSync('dotnet', args, { stdio: 'inherit', shell: false });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
