// Focused release QA for participation/B2B and short Field Note review branch.
// Browser-rendered checks. This suite never publishes or contacts users.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = 'http://127.0.0.1:8766';
const routes = [
  { name: 'B2B', path:'/org/work-with-us/', marker:'#first-message' },
  { name: 'Field Note', path:'/journal/the-drawing-table-experiment/', marker:'#experiment' },
  { name: 'Collaboration', path:'/org/', marker:'#professional-collaboration' },
  { name: 'Events', path:'/events/', marker:'#drawing-table-lab' },
  { name: 'Partners', path:'/partners/', marker:'#commissioned-programmes' },
  { name: 'Journal', path:'/journal/', marker:'#field-note-drawing-table' }
];
const widths = [320,390,768,1280];
const report = { passed:[], failed:[], date:new Date().toISOString(), routes:routes.map(x=>x.path) };
mkdirSync('qa/artifacts',{recursive:true});
function check(name,ok,details=''){(ok?report.passed:report.failed).push({name,details});}
const browser=await chromium.launch({headless:true});
for (const target of routes) {
  for (const width of widths) {
    const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
    const jsErrors=[];
    page.on('pageerror',e=>jsErrors.push(e.message));
    try{
      const res=await page.goto(base+target.path,{waitUntil:'networkidle',timeout:30000});
      check(target.name+' '+width+' HTTP 200',res?.status()===200,String(res?.status()));
      const d=await page.evaluate((selector)=>{
        const h=[...document.querySelectorAll('main h1')].filter(e=>e.getClientRects().length>0);
        const target=document.querySelector(selector);
        return {h1:h.length,main:!!document.querySelector('main'),overflow:document.documentElement.scrollWidth-innerWidth,
          target:!!target,styled:getComputedStyle(document.body).fontFamily!==''};
      },target.marker);
      check(target.name+' '+width+' single heading',d.h1===1,JSON.stringify(d));
      check(target.name+' '+width+' no horizontal overflow',d.overflow<=2,String(d.overflow));
      check(target.name+' '+width+' anchor present',d.target, target.marker);
      check(target.name+' '+width+' no uncaught JS errors',jsErrors.length===0,jsErrors.join('; '));
      if(target.name==='B2B'||target.name==='Field Note'){
        const style=await page.locator('link[href*="aeth-collaboration.css"]').count();
        const css=await page.evaluate(()=>[...document.styleSheets].some(s=>(s.href||'').includes('aeth-collaboration.css')));
        check(target.name+' '+width+' stylesheet parsed',style===1&&css,JSON.stringify({style,css}));
        const title=await page.title();
        check(target.name+' '+width+' descriptive title',title.includes('Aetherion Movement'),title);
        const links=await page.locator('a[href^="mailto:"]').count();
        if(target.name==='B2B')check('B2B '+width+' mailto only',links>=1,String(links));
      }
      if(width===390)await page.screenshot({path:'qa/artifacts/aeth-collab-'+target.path.replaceAll('/','-')+'.png',fullPage:true});
    }catch(e){check(target.name+' '+width+' runtime',false,String(e));}
    await page.close();
  }
}
await browser.close();
mkdirSync('qa/artifacts',{recursive:true});
writeFileSync('qa/artifacts/aeth-collab-qa.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed.length,failed:report.failed.length,failed_checks:report.failed},null,2));
if(report.failed.length)process.exit(1);
