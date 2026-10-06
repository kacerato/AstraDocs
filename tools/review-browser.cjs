const { chromium } = require(process.argv[2]+'/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});globalThis.reviewBrowser=browser;
 const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const origin=process.env.DOCS_URL||'http://127.0.0.1:4321';const base='/pt-br/snapshot-2026-10-06';
 const routes={home:'/',guide:base+'/comece/primeiro-script-c/',api:base+'/api/astra-gameobject/',catalog:base+'/componentes/',component:base+'/componentes/astra-camera/'};
 const results=[];fs.mkdirSync('evidence',{recursive:true});
 for(const width of [360,390,768,1440]){
   await page.setViewportSize({width,height:width<500?844:1000});
   for(const [name,route] of Object.entries(routes)){
     const res=await page.goto(origin+route,{waitUntil:'networkidle'});
     const metric=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent}));
     results.push({name,width,status:res.status(),...metric});
     if(metric.scroll>width+1)errors.push(`Horizontal overflow ${name} ${width}: ${metric.scroll}`);
     if(res.status()!==200)errors.push(`HTTP ${res.status()} ${route}`);
     if(width===390||width===1440)await page.screenshot({path:`evidence/${name}-${width}.png`,fullPage:name!=='api'&&name!=='component'});
   }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin+routes.catalog);
 await page.locator('#catalog-query').fill('camera');
 await page.locator('#catalog-family').selectOption({label:'Câmera'});
 const filtered=await page.locator('li[data-search]:visible').count();if(filtered!==3)errors.push(`Camera filter expected 3, got ${filtered}`);
 await page.locator('#catalog-query').fill('zzzinexistente');if(!await page.locator('.astra-empty').isVisible())errors.push('Empty state missing');
 await page.locator('[data-clear]').click();if(await page.locator('li[data-search]:visible').count()!==49)errors.push('Reset did not restore 49 components');
 await page.goto(origin+routes.guide);
 await page.keyboard.press('Control+k');
 const search=page.locator('site-search input').first();await search.waitFor({state:'visible'});await search.fill('Rotate');
 await page.waitForFunction(()=>document.querySelector('.pagefind-ui__result-link')!==null,{timeout:15000});
 const searchCount=await page.locator('.pagefind-ui__result-link').count();await page.keyboard.press('Escape');
 const copy=page.getByRole('button',{name:/copiar|copy/i}).first();await copy.click();const copied=await page.evaluate(()=>navigator.clipboard.readText());if(!copied.includes('RotateObject'))errors.push('Clipboard mismatch');
 const theme=page.locator('starlight-theme-select select').first();await theme.selectOption('dark');await page.reload();
 if(await page.locator('html').getAttribute('data-theme')!=='dark')errors.push('Theme did not persist');
 await page.screenshot({path:'evidence/guide-dark-1440.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:/menu/i}).click();
 if(!await page.locator('#starlight__sidebar').evaluate(e=>e.matches(':popover-open')))errors.push('Mobile sidebar did not open');
 await page.screenshot({path:'evidence/mobile-menu.png'});await page.keyboard.press('Escape');
 await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(origin+routes.guide);const readable=(await plain.textContent('main')).includes('RotateObject');if(!readable)errors.push('No-JS content missing');
 await browser.close();
 const report={results,filtered,searchCount,clipboard:true,themePersistence:true,noJsReadable:readable,errors};fs.writeFileSync('evidence/browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
})().catch(async e=>{console.error(e);await globalThis.reviewBrowser?.close();process.exitCode=1;});
