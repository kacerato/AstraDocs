import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const pages=JSON.parse(fs.readFileSync('data/pages.json','utf8'));
const errors=[];let links=0;
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#x26;','&');
for(const page of pages){
  const file=path.join(root,page.url,'index.html');
  if(!fs.existsSync(file)){errors.push(`Missing HTML: ${page.url}`);continue;}
  const html=fs.readFileSync(file,'utf8');
  if(!html.includes('<h1'))errors.push(`Missing h1: ${page.url}`);
  if(!fs.existsSync(path.join(root,page.markdown)))errors.push(`Missing Markdown: ${page.markdown}`);
  for(const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)){
    const url=decode(match[1]);if(!url.startsWith('/')||url.startsWith('//'))continue;
    const parsed=new URL(url,'https://astra-docs-opal.vercel.app');
    const local=path.resolve(root,'.'+decodeURIComponent(parsed.pathname));
    if(!local.startsWith(root+path.sep)&&local!==root){errors.push(`Escaping path: ${url}`);continue;}
    const target=fs.existsSync(local)&&fs.statSync(local).isDirectory()?path.join(local,'index.html'):local;
    links++;
    if(!fs.existsSync(target))errors.push(`${page.url} -> ${url}`);
    else if(parsed.hash&&target.endsWith('.html')){
      const dest=fs.readFileSync(target,'utf8');const id=decodeURIComponent(parsed.hash.slice(1));
      if(!dest.includes(`id="${id}"`))errors.push(`Missing anchor ${url}`);
    }
  }
  if(/C:\\Users\\|github\.com\/kacerato\/(?!AstraDocs(?:[\/"#?]|$))|<script[^>]+src="https:\/\/(?!vercel)/i.test(html))errors.push(`Private path or external script: ${page.url}`);
}
const report={pages:pages.length,links,errors:[...new Set(errors)]};fs.mkdirSync('evidence',{recursive:true});fs.writeFileSync('evidence/links.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:pages.length,links,errors:report.errors.slice(0,35),totalErrors:report.errors.length},null,2));
if(errors.length)process.exitCode=1;
