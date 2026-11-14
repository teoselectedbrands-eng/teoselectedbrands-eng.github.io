// Aetherion foundation browser QA. Runs against exact PR source on localhost.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
const base='http://127.0.0.1:8765', dest='qa/artifacts';
mkdirSync(dest,{recursive:true});
const widths=[320,390,768,1280];
const paths=[['learn','/learn/'],['classes','/classes/'],['events','/events/'],['professional','/professional-services/'],['legacy','/#/professional-services/']];
let n=0;
const failed=[],passed=[];
const check=(name,ok,detail=null)=>{n++;const rec={name,ok:!!ok,detail};(ok?passed:failed).push(rec);};
const browser=await chromium.launch({headless:true});
for(const [name,path] of paths){
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:width<400?844:950},reducedMotion:'reduce'});
  const jsErrors=[],assetErrors=[];
  page.on('pageerror',e=>jsErrors.push(e.message));
  page.on('response',r=>{if(r.url().includes('/assets/aeth-pathways')||r.url().includes('/assets/pathways/'))if(r.status()!==200)assetErrors.push(r.url()+' '+r.status());});
  let status=0;
  try{
    const resp=await page.goto(base+path,{waitUntil:'networkidle',timeout:35000});
    status=resp.status();
    const info=await page.evaluate(()=>{
      const vis=x=>x&&x.getClientRects().length>0&&getComputedStyle(x).visibility!=='hidden'&&getComputedStyle(x).display!=='none';
      const main=document.querySelector('main')||document.body;
      const imgs=[...main.querySelectorAll('img[src*="/assets/pathways/"]')].filter(vis);
      return {h1:[...main.querySelectorAll('h1')].filter(vis).length,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),
      nav:[...main.querySelectorAll('.ap-jump a')].filter(vis).length,
      imgs:imgs.map(x=>({src:x.getAttribute('src'),ok:x.complete&&x.naturalWidth>0})),
      legacy:[...document.querySelectorAll('[data-legacy-page]')].filter(vis).map(x=>x.dataset.legacyPage)};
    });
    check(name+' '+width+' HTTP 200',status===200,status);
    check(name+' '+width+' overflow <=2px',info.overflow<=2,info.overflow);
    check(name+' '+width+' exactly one visible heading',info.h1===1,info.h1);
    check(name+' '+width+' image loads',info.imgs.length>0&&info.imgs.every(x=>x.ok),info.imgs);
    check(name+' '+width+' working page index',info.nav>=3,info.nav);
    check(name+' '+width+' no JS errors',jsErrors.length===0,jsErrors);
    check(name+' '+width+' new asset requests OK',assetErrors.length===0,assetErrors);
    if(name==='legacy')check(name+' '+width+' hidden-page isolation',info.legacy.length===1&&info.legacy[0]==='/professional-services/',info.legacy);
    if(width===390||width===1280)await page.screenshot({path:dest+'/'+name+'-'+width+'.png',fullPage:true});
  }catch(e){check(name+' '+width+' navigation does not throw',false,String(e));}
  await page.close();
 }
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await page.goto(base+'/learn/',{waitUntil:'networkidle'});
await page.locator('[data-observe-value="no"]').first().click();
check('Learn explanation on inference',(await page.locator('#ap-observation-feedback').innerText()).startsWith('Interpretation:'));
await page.locator('[data-observe-value="yes"]').click();
check('Learn explanation on observation',(await page.locator('#ap-observation-feedback').innerText()).startsWith('Observation:'));
check('Learn selected option announced',(await page.locator('[data-observe-value="yes"]').getAttribute('aria-pressed'))==='true');
await page.goto(base+'/classes/',{waitUntil:'networkidle'});
await page.locator('#ap-format-select').selectOption('rhythm');
check('Classes option link updates',(await page.locator('#ap-format-link').getAttribute('href'))==='#rhythm-movement');
check('Classes example updates',(await page.locator('#ap-format-description').innerText()).includes('tempo'));
await page.locator('[data-class-filter="strength"]').click();
check('Classes original filter still responds',(await page.locator('#class-count').innerText()).includes('format'));
await page.locator('#reset-classes').click();
check('Classes reset restores 11',(await page.locator('.format-card:visible').count())===11);
await page.goto(base+'/events/',{waitUntil:'networkidle'});
await page.locator('#ap-event-audience').selectOption('school');
await page.locator('#ap-event-mode').selectOption('room');
check('Events local brief updates',(await page.locator('#ap-event-summary').innerText()).includes('educators and school teams'));
const href=await page.locator('#ap-event-email').getAttribute('href');
check('Events email draft is real mailto',href.startsWith('mailto:hello@aetherionmovement.com?subject=')&&decodeURIComponent(href).includes('in-person small-group'));
check('Events six proposals retained',(await page.locator('.event-card').count())===6);
check('Events no confirmed calendar',(await page.locator('body').innerText()).includes('No events are scheduled yet'));
await page.goto(base+'/professional-services/',{waitUntil:'networkidle'});
check('Professional noindex',(await page.locator('meta[name=robots]').getAttribute('content')).startsWith('noindex,'));
check('Professional contact not a form',(await page.locator('form').count())===0&&(await page.locator('a[href^="mailto:"]').count())>=1);
await page.goto(base+'/#/professional-services/',{waitUntil:'networkidle'});
check('Legacy professional route is visible',await page.locator('[data-legacy-page="/professional-services/"]').isVisible());
check('Legacy hidden sections stay hidden',(await page.locator('[data-legacy-page]:visible').count())===1);
await page.close();
const bad=await browser.newPage();
const missing=await bad.goto(base+'/missing-foundation-route-404/',{waitUntil:'domcontentloaded'});
check('Unknown route returns 404',missing.status()===404,missing.status());
await bad.close();
// Verify shared mobile navigation on all four standalone pages.
for(const url of ['/learn/','/classes/','/events/','/professional-services/']){
  const navPage=await browser.newPage({viewport:{width:390,height:844}});
  await navPage.goto(base+url,{waitUntil:'networkidle'});
  const menu=navPage.locator('.menu-btn');
  check('Mobile menu present '+url,(await menu.count())===1);
  if(await menu.count()){
    await menu.click();
    check('Mobile menu expands '+url,(await menu.getAttribute('aria-expanded'))==='true'&&await navPage.locator('.nav').evaluate(x=>x.classList.contains('open')));
    await navPage.keyboard.press('Escape');
    check('Escape closes menu '+url,(await menu.getAttribute('aria-expanded'))==='false');
  }
  await navPage.close();
}

// WCAG 2.1 A/AA automated audit (informative; not a substitute for VoiceOver).
const axeSrc=readFileSync('node_modules/axe-core/axe.min.js','utf8');
const a11y=[];
for(const url of ['/learn/','/classes/','/events/','/professional-services/']){
  const auditPage=await browser.newPage({viewport:{width:390,height:844}});
  await auditPage.goto(base+url,{waitUntil:'networkidle'});
  await auditPage.addScriptTag({content:axeSrc});
  const result=await auditPage.evaluate(async()=>{
    const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
    return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.help,affected:v.nodes.length,targets:v.nodes.slice(0,3).map(n=>n.target)}));
  });
  a11y.push({url,violations:result});
  check('Automated WCAG 2.1 A/AA scan '+url+' reports no findings',result.length===0,result);
  console.log('A11Y',url,JSON.stringify(result));
  await auditPage.close();
}
writeFileSync(dest+'/a11y-results.json',JSON.stringify(a11y,null,2));
await browser.close();
const report={count:n,passed:passed.length,failed:failed.length,failures:failed,limits:['Native Safari/VoiceOver not checked','General email inbox replies and clinician availability not tested','No external booking or intake activated']};
writeFileSync(dest+'/qa-results.json',JSON.stringify({report,passed},null,2));
console.log(JSON.stringify(report,null,2));
if(failed.length)process.exitCode=1;