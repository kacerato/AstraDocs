import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2];
if(!root)throw Error('Informe o checkout da engine.');
const source=fs.readFileSync(path.join(root,'managed/Astra.Scripting/Generated/Components.g.cs'),'utf8');
const starts=[...source.matchAll(/public readonly struct (\w+) : IComponentFacade/g)];
const map={};
for(let i=0;i<starts.length;i++) {
  const type=starts[i][1],body=source.slice(starts[i].index,starts[i+1]?.index||source.length);
  for(const member of body.matchAll(/public [\w.<>?]+ (\w+)\s*\n\s*\{([\s\S]*?)\n\s*\}/g)) {
    const fields=[...new Set([...member[2].matchAll(/Component\.Get(?:Float|Bool|Enum|Reference)\("([^"]+)"/g)].map(m=>m[1]))];
    if(fields.length)map[`Astra.Components.${type}.${member[1]}`]=fields;
  }
}
if(!Object.keys(map).length)throw Error('Nenhum vínculo extraído.');
fs.writeFileSync(process.argv[3] || 'data/component-member-map.json',JSON.stringify(map,null,2)+'\n');
console.log(JSON.stringify({mappedMembers:Object.keys(map).length}));
