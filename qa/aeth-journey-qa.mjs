// Aetherion integrated visitor journey QA — browser-based, no deployment.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base='http://127.0.0.1:8766',dest='qa/artifacts';
mkdirSync(dest,{recursive:true});
const widths=[320,390,768,1280];
const pagePaths=['/','/start/','/learn/','/workshops/','/journal/','/events/','/org/','/org/work-with-us/','/partners/','/journal/the-drawing-table-experiment/'];
const failures=[],passes=[];
const check=(name,yes,details='')=>(yes?passes:failures).push({name,details});
const browser=await chromium.launch({headless:true});
for(const width of widths){
 const page=await browser.newPage({viewport:{width,height:840},reducedMotion:'reduce'});
 const errors=[];const missing=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('/assets/aeth-journey.')&&r.status()!==200)missing.push(r.url()+' HTTP '+r.status())});
 try{
  const r=await page.goto(base+'/start/',{waitUntil:'networkidle',timeout:35000});
  check('Start '+width+' HTTP',r?.status()===200,String(r?.status()));
  const stats=await page.evaluate(()=>({h1:[...document.querySelectorAll('main h1')].filter(x=>x.getClientRects().length).length,overflow:document.documentElement.scrollWidth-innerWidth,menu:!!document.querySelector('.menu-btn'),choices:document.querySelectorAll('[data-aej-choice]').length,css:[...document.styleSheets].some(s=>s.href?.includes('aeth-journey.css'))}));
  check('Start '+width+' one h1',stats.h1===1,JSON.stringify(stats));
  check('Start '+width+' no overflow',stats.overflow<=2,String(stats.overflow));
  check('Start '+width+' has 4 choices',stats.choices===4,String(stats.choices));
  check('Start '+width+' CSS loaded',stats.css);
  for(const role of ['educator','organisation','community','curious']){
    const button=page.locator('[data-aej-choice="'+role+'"]');
    await button.click();
    const pressed=await button.getAttribute('aria-pressed');
    const visible=await page.locator('[data-aej-panel="'+role+'"]').isVisible();
    const allShown=await page.locator('[data-aej-panel]:visible').count();
    check('Start '+width+' role '+role,pressed==='true'&&visible&&allShown===1,JSON.stringify({pressed,visible,allShown}));
  }
  check('Start '+width+' no errors',errors.length===0,errors.join('; '));
  check('Start '+width+' no missing journey assets',missing.length===0,missing.join('; '));
  if(width===390)await page.screenshot({path:dest+'/aeth-journey-start-mobile.png',fullPage:true});
 }catch(e){check('Start '+width+' runtime',false,String(e))}
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
for(const p of pagePaths){
 try{
  const response=await page.goto(base+p,{waitUntil:'networkidle',timeout:35000});
  check('Route '+p+' HTTP',response?.status()===200,String(response?.status()));
  if(p!='/start/'){
   const trail=page.locator('.aej-trail');
   check('Route '+p+' has journey trail',await trail.count()===1,String(await trail.count()));
   const a=page.locator('.aej-trail a[href="/start/"]');
   check('Route '+p+' links Start',await a.count()>=1,String(await a.count()));
   const sheets=await page.evaluate(()=>[...document.styleSheets].some(s=>s.href?.includes('aeth-journey.css')));
   check('Route '+p+' has journey stylesheet',sheets);
  }
 }catch(e){check('Route '+p+' runtime',false,String(e))}
}
try{
 await page.goto(base+'/start/',{waitUntil:'networkidle'});
 await page.locator('[data-aej-choice="curious"]').click();
 await page.locator('[data-aej-panel="curious"] a[href="/journal/the-drawing-table-experiment/"]').click();
 check('Flow article reached',new URL(page.url()).pathname==='/journal/the-drawing-table-experiment/');
 await page.locator('.aej-trail a[href="/events/#drawing-table-lab"]').click();
 check('Flow events reached',new URL(page.url()).pathname==='/events/');
 check('Flow proposed Lab exists',await page.locator('#drawing-table-lab').count()===1);
 await page.locator('#drawing-table-lab a[href="/org/work-with-us/#first-message"]').click();
 check('Flow B2B reached',new URL(page.url()).pathname==='/org/work-with-us/');
 check('Flow enquiry is draft link',await page.locator('#first-message a[href^="mailto:"]').count()===1);
 await page.screenshot({path:dest+'/aeth-journey-b2b-mobile.png',fullPage:true});
}catch(e){check('Full visitor journey runtime',false,String(e));}
await page.close();
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
try{
 const r=await nojs.goto(base+'/start/',{waitUntil:'load'});
 const count=await nojs.locator('[data-aej-panel]:visible').count();
 check('No-JS all pathways remain available',r?.status()===200&&count===4,JSON.stringify({status:r?.status(),count}));
}catch(e){check('No-JS fallback runtime',false,String(e));}
await nojs.close();await browser.close();
writeFileSync(dest+'/aeth-journey-qa.json',JSON.stringify({checks:passes.length+failures.length,passed:passes.length,failed:failures},null,2));
console.log(JSON.stringify({checks:passes.length+failures.length,passed:passes.length,failed:failures.length,issues:failures},null,2));
if(failures.length)process.exit(1);
