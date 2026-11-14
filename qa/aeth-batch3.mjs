// Aetherion Batch3 — read-only verification of exact branch files, not production.
import { chromium } from 'playwright';
import { mkdirSync,readFileSync,writeFileSync,readdirSync,statSync } from 'node:fs';
import {join} from 'node:path';
const DIR='qa/artifacts-batch3',HOST='http://127.0.0.1:8765';
mkdirSync(DIR,{recursive:true});
const checks=[],failures=[],warnings=[];
const test=(name,condition,detail=null)=>{const r={name,pass:!!condition,detail};checks.push(r);if(!condition)failures.push(r)};
const walk=(root)=>readdirSync(root).flatMap(name=>{
 if(name==='.git'||name==='node_modules'||name==='qa'||name.startsWith('.'))return [];
 const path=join(root,name);let st;
 try{st=statSync(path)}catch{return []}
 return st.isDirectory()?walk(path):path.endsWith('index.html')?[path]:[];
});
const docs=walk('.').sort();
const pages=docs.map(file=>{const c=readFileSync(file,'utf8');return {
 file,bytes:c.length,canonical:c.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||null,
 robots:c.match(/<meta name="robots" content="([^"]+)"/)?.[1]||null,
 title:/<title\b/i.test(c),h1:(c.match(/<h1(?:\s|>)/gi)||[]).length
}});
const routeSummary={total:pages.length,indexable:pages.filter(p=>p.robots?.startsWith('index')).length,
 noindex:pages.filter(p=>p.robots?.startsWith('noindex')).length,missingCanonical:pages.filter(p=>!p.canonical).map(p=>p.file),
 missingTitle:pages.filter(p=>!p.title).map(p=>p.file),missingH1:pages.filter(p=>p.h1===0).map(p=>p.file)};
test('Full site route inventory preserves at least 129 HTML entrypoints',pages.length>=129,pages.length);
for(const path of ['coordination/index.html','movement/lab/index.html']){
 const p=pages.find(p=>p.file.replace(/^\.\//,'')===path);
 test(path+' exists with own canonical',!!p&&p.canonical==='https://aetherionmovement.com/'+path.replace('index.html',''));
 test(path+' indexable when published',p?.robots?.startsWith('index,'));
 test(path+' exactly one H1',p?.h1===1,p?.h1);
}
const map=readFileSync('sitemap.xml','utf8');
const loc=[...map.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
test('Original sitemap extended to 113 unique URLs',loc.length===113&&new Set(loc).size===113,loc.length);
for(const route of ['/coordination/','/movement/lab/'])test('Sitemap contains '+route,loc.includes('https://aetherionmovement.com'+route));
const discovery=readFileSync('discover/index.html','utf8');
test('Discover indexes both new routes',['/coordination/','/movement/lab/'].every(x=>discovery.includes('href="'+x+'"')));
test('Discover directory movement count updated',discovery.includes('id="directory-movement-more">Movement and main sections <span class="ad-count">4</span>'));
const bodyHome=readFileSync('index.html','utf8');
test('Homepage original hash sections unchanged',(bodyHome.match(/<section data-legacy-page=/g)||[]).length===16);
test('Homepage field-note entrance present',bodyHome.includes('id="aeth3-home-investigation"'));
const atlas=readFileSync('movement/index.html','utf8');
test('Atlas retains original eight entries',(atlas.match(/class="atlas-card"/g)||[]).length===8);
const contactHtml=readFileSync('professional-services/index.html','utf8');
test('Clinical professional page remains noindex',contactHtml.includes('content="noindex,follow,max-image-preview:large"'));
const js=readFileSync('assets/aeth-batch3.js','utf8');
test('New features are local-only: no storage, API or tracking',!/(localStorage|sessionStorage|fetch\(|XMLHttpRequest|navigator\.sendBeacon)/.test(js));
test('No auto-submit, no HTML injection in local JS',!/(form\.submit\(|innerHTML|\.click\(\))/.test(js));

const browser=await chromium.launch({headless:true});
const critical=[
 ['home','/'],['movement','/movement/'],['coordination','/coordination/'],['lab','/movement/lab/'],['discover','/discover/'],
 ['learn','/learn/'],['classes','/classes/'],['events','/events/'],['help','/help/'],
 ['functioning','/functioning/'],['living','/living/'],['partners','/partners/'],['org','/org/'],
 ['membership','/membership/'],['workshops','/workshops/'],['professional','/professional-services/']
];
for(const width of [390,1280]){
 for(const [id,path] of critical){
  const page=await browser.newPage({viewport:{width,height:width===390?844:960},reducedMotion:'reduce'});
  const errors=[]; const assets=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('response',res=>{if(res.url().includes('/assets/aeth-batch3')||res.url().includes('/assets/pathways/'))if(res.status()!==200)assets.push({url:res.url(),status:res.status()})});
  try{
   const response=await page.goto(HOST+path,{waitUntil:'networkidle',timeout:40000});
   const state=await page.evaluate(()=>{
     const visible=x=>!!x&&x.getClientRects().length>0&&getComputedStyle(x).display!=='none'&&getComputedStyle(x).visibility!=='hidden';
     const container=document.querySelector('main')||document.body;
     return {overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),
      h1:[...container.querySelectorAll('h1')].filter(visible).map(x=>x.innerText.slice(0,80)),
      aeth3:[...container.querySelectorAll('.aeth3')].filter(visible).length};
   });
   test(id+' '+width+' HTTP 200',response.status()===200,response.status());
   test(id+' '+width+' no horizontal overflow',state.overflow<=2,state.overflow);
   test(id+' '+width+' no JavaScript error',errors.length===0,errors);
   test(id+' '+width+' new asset requests successful',assets.length===0,assets);
   if(['coordination','lab'].includes(id)){
     test(id+' '+width+' exactly one visible H1',state.h1.length===1,state.h1);
     test(id+' '+width+' new content present',state.aeth3>=1,state.aeth3);
   }
   if(width===390&&['home','movement','coordination','lab','discover'].includes(id))await page.screenshot({path:DIR+'/'+id+'-390.png',fullPage:true});
   if(width===1280&&['coordination','lab'].includes(id))await page.screenshot({path:DIR+'/'+id+'-1280.png',fullPage:true});
  }catch(e){test(id+' '+width+' route visits successfully',false,String(e))}
  await page.close();
 }
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await page.goto(HOST+'/coordination/',{waitUntil:'networkidle'});
await page.locator('#aeth3-topic').selectOption('professional');
await page.locator('#aeth3-mode').selectOption('online');
await page.locator('#aeth3-day').fill('2026-12-01');
const summary=await page.locator('#aeth3-summary').innerText(),email=await page.locator('#aeth3-compose').getAttribute('href');
test('Coordination: topic modifies next-step explanation',summary.includes('private clinical coordination'));
test('Coordination: date labelled preference, not booked',summary.includes('not a reserved slot'));
test('Coordination: draft addresses general inbox',email.startsWith('mailto:hello@aetherionmovement.com?subject='));
test('Coordination: draft correctly includes optional day/format',decodeURIComponent(email).includes('2026-12-01')&&decodeURIComponent(email).includes('online'));
test('Coordination: no form or automated submission',await page.locator('form').count()===0);
const professional=(await page.locator('meta[name=robots]').getAttribute('content'));
test('Coordination informational indexability',professional.startsWith('index,'));
await page.goto(HOST+'/movement/lab/',{waitUntil:'networkidle'});
const initial=await page.locator('#aeth3-observation').innerText();
await page.locator('#aeth3-scene').selectOption('route');
await page.locator('#aeth3-condition').selectOption('noise');
const revised=await page.locator('#aeth3-observation').innerText();
test('Field Lab: changing scenario updates actual output',initial!==revised&&revised.includes('busy public space'));
test('Field Lab: changed condition appears',revised.includes('competing sound'));
test('Field Lab: uncertainty caveat appears',revised.includes('not assume'));
await page.close();
const axe=readFileSync('node_modules/axe-core/axe.min.js','utf8');
const a11y=[];
for(const path of ['/coordination/','/movement/lab/']){
 const a=await browser.newPage({viewport:{width:390,height:844}});
 await a.goto(HOST+path,{waitUntil:'networkidle'});
 await a.addScriptTag({content:axe});
 const result=await a.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,4).map(n=>n.target)}))});
 a11y.push({path,violations:result});
 test('Automated WCAG 2.1 A/AA '+path,result.length===0,result);
 await a.close();
}
writeFileSync(DIR+'/site-inventory.json',JSON.stringify(routeSummary,null,2));
writeFileSync(DIR+'/a11y.json',JSON.stringify(a11y,null,2));
await browser.close();
const report={checks:checks.length,passed:checks.length-failures.length,failed:failures.length,failures,warnings,routeInventory:routeSummary,limits:['Automated Chromium/axe only, not native Safari or human accessibility validation','No email sent, no booking created, no external calendar inventory exposed','Broader legacy route inventory is informational, not a declaration all 129 pages are equally mature']};
writeFileSync(DIR+'/results.json',JSON.stringify({report,checks},null,2));console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;