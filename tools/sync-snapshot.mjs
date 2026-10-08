import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

// Extract only public contracts. The isolated private source and executable stay
// under ignored evidence/, never under data/ or public/.
const engine=process.argv[2], version=process.argv[3];
if(!engine || !/^snapshot-\d{4}-\d{2}-\d{2}$/.test(version||'')) throw Error('Usage: npm run sync:snapshot -- <engine Git checkout> snapshot-YYYY-MM-DD');
const release=JSON.parse(fs.readFileSync('data/release.json','utf8'));
const commit=release.source.baselineCommit;
if(!/^[a-f0-9]{40}$/.test(commit) || release.source.localChangesIncluded) throw Error('A release with local source changes requires separately recorded provenance.');
const output=`data/snapshots/${version}`;
if(fs.existsSync(`${output}/source.json`)) {
  const prior=JSON.parse(fs.readFileSync(`${output}/source.json`,'utf8'));
  if(prior.sourceCommit!==commit || prior.releaseVersion!==release.version) throw Error('Do not overwrite a published snapshot with another release. Create a new versioned route.');
}
const privateDir=path.resolve(`evidence/snapshot-source-${commit}`);
const run=(command,args,options={})=>{
  const result=spawnSync(command,args,{encoding:'utf8',shell:false,...options});
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(`${command} failed (${result.status}): ${result.stderr||result.stdout}`);
  return result.stdout;
};
fs.mkdirSync(privateDir,{recursive:true}); fs.mkdirSync(output,{recursive:true});
run('git',['-C',path.resolve(engine),'cat-file','-e',`${commit}^{commit}`]);
const archive=path.join(privateDir,'source.tar');
run('git',['-C',path.resolve(engine),'archive','--format=tar',`--output=${archive}`,commit,'native','managed','Directory.Build.props','NuGet.config']);
run('tar',['-xf',archive,'-C',privateDir]);
const executable=path.join(privateDir,process.platform==='win32'?'export-components.exe':'export-components');
run(process.env.CXX||'g++',['-std=c++20','-O1','-ffunction-sections','-fdata-sections','-Wl,--gc-sections','-I',path.join(privateDir,'native'),'tools/export-components.cpp',path.join(privateDir,'native/resources/asset_registry.cpp'),path.join(privateDir,'native/scene/collision_recipe.cpp'),'-o',executable]);
fs.writeFileSync(`${output}/components.json`,run(executable,[]));
run('dotnet',['run','--project','tools/export-api','--',path.join(privateDir,'managed/Astra.Scripting/Astra.Scripting.csproj'),`${output}/api.json`],{env:{...process.env,ASTRA_DOCS_SNAPSHOT:version}});
run(process.execPath,['tools/sync-member-map.mjs',privateDir,`${output}/component-member-map.json`]);
// Git stores these JSON contracts with LF; hash the same bytes on Windows/CI.
for(const file of ['components.json','api.json','component-member-map.json']) fs.writeFileSync(`${output}/${file}`,fs.readFileSync(`${output}/${file}`,'utf8').replaceAll('\r\n','\n'));
const read=file=>JSON.parse(fs.readFileSync(`${output}/${file}`,'utf8'));
const components=read('components.json'),api=read('api.json');
const source={version,reviewedAt:version.slice(9),releaseVersion:release.version,versionCode:release.versionCode,sourceCommit:commit,extraction:'Compiled native descriptors; Roslyn/MSBuild semantic compilation; generated facade mapping',runtimeVerified:false,componentTypes:components.length,componentProperties:components.reduce((n,c)=>n+c.properties.length,0),apiTypes:api.types.length,apiMembers:api.types.reduce((n,t)=>n+t.members.length,0),sha256:Object.fromEntries(['components.json','api.json','component-member-map.json'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(`${output}/${file}`)).digest('hex')]))};
fs.writeFileSync(`${output}/source.json`,JSON.stringify(source,null,2)+'\n');
console.log(JSON.stringify({...source,sha256:undefined}));
