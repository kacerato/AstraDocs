import fs from 'node:fs';
import path from 'node:path';
// Public data only: omit implementation owners, evidence paths, code and local files.
const root=process.argv[2];
if(!root)throw Error('Informe o checkout privado usado para revisar os contratos.');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/planos/ampliacao-2026-09-23/FAMILIAS-ESTADO.json'),'utf8').replace(/^\uFEFF/,''));
const source=fs.readFileSync(path.join(root,'native/core/engine_capability.h'),'utf8');
const capabilities=[...source.matchAll(/\{"([^"]+)",\s*"([^"]+)",\s*CapabilityState::(\w+),\s*"[^"]*",\s*"([^"]*)"\}/g)].map(([,id,name,state,limitation])=>({id,name,state,limitation}));
if(!capabilities.length)throw Error('Nenhuma capacidade extraída.');
const families=ledger.capacidades.map(f=>({id:f.id,name:f.capacidade,family:f.familia,requirements:f.requisitos,dependencies:f.dependencias,scope:f.escopo,state:f.estado,gaps:f.lacunas,validationLimits:f.limites_validacao||[]}));
fs.writeFileSync('data/roadmap.json',JSON.stringify({reviewedAt:'2026-10-06',ledgerBaseDate:ledger.data_base,note:ledger.nota,families,capabilities},null,2)+'\n');
console.log(JSON.stringify({families:families.length,capabilities:capabilities.length}));
