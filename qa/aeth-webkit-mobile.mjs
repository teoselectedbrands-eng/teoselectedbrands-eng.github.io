// Read-only WebKit mobile regression: Safari rendering engine, not a physical iPhone.
import { webkit } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base='http://127.0.0.1:8768';
const dest='qa/artifacts';
mkdirSync(dest,{recursive:true});
const results={engine:'WebKit (Playwright, Linux)',note:'Simulates touch and iPhone-sized viewports; not native iOS Safari/VoiceOver',passed:[],failed:[]};
const check=(name,pass,details='')=>results[pass?'passed':'failed'].push({name,details});
const routes=[
  '/','/movement/','/classes/','/workshops/','/events/','/learn/','/journal/','/discover/',
  '/org/','/start/','/workshops/audiences/schools/','/workshops/topics/aet-ws-001/',
  '/resources/movement-practice-notes/'
];
const browser=await webkit.launch({headless:true});
for(const width of [320,390]){
  const context=await browser.newContext({
    viewport:{width,height:width===390?844:720},deviceScaleFactor:3,
    isMobile:true,hasTouch:true,reducedMotion:'reduce',locale:'en-US'
  });
  const page=await context.newPage();
  const errors=[];const missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{
    if(r.url().startsWith(base+'/assets/')&&r.status()>=400)
      missing.push(r.status()+' '+new URL(r.url()).pathname);
  });
  for(const route of routes){
    errors.length=0;missing.length=0;
    try{
      const res=await page.goto(base+route,{waitUntil:'load',timeout:35000});
      await page.waitForTimeout(200);
      const d=await page.evaluate(()=>{
        const visible=e=>e&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
        const img=[...document.images].filter(x=>visible(x)&&x.getBoundingClientRect().top<innerHeight+50);
        return {
          h1:[...document.querySelectorAll('h1')].filter(visible).length,
          overflow:document.documentElement.scrollWidth-innerWidth,
          imageCount:img.length,
          brokenImages:img.filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.getAttribute('src')),
          noFocus:!!document.querySelector('.skip:not([href])')
        };
      });
      check('webkit '+width+' '+route+' HTTP',res?.status()===200,String(res?.status()));
      check('webkit '+width+' '+route+' one H1',d.h1===1,String(d.h1));
      check('webkit '+width+' '+route+' no horizontal overflow',d.overflow<=3,String(d.overflow));
      check('webkit '+width+' '+route+' images',d.brokenImages.length===0,d.brokenImages.join('; '));
      check('webkit '+width+' '+route+' no JS errors',errors.length===0,errors.join('; '));
      check('webkit '+width+' '+route+' assets loaded',missing.length===0,missing.join('; '));
      if(width===390&&['/','/classes/','/movement/','/workshops/'].includes(route)){
        const name=route==='/'?'home':route.slice(1).replaceAll('/','-');
        await page.screenshot({path:dest+'/aeth-webkit-'+name+'.png',fullPage:false});
      }
    }catch(e){check('webkit '+width+' '+route+' runtime',false,String(e));}
  }
  try{
    await page.goto(base+'/',{waitUntil:'load'});
    const menu=page.locator('.menu-btn');
    check('webkit '+width+' visible menu',await menu.isVisible());
    await menu.tap();
    check('webkit '+width+' menu opens',await menu.getAttribute('aria-expanded')==='true');
    check('webkit '+width+' navigation displayed',await page.locator('#mainnav').isVisible());
    await Promise.all([
      page.waitForURL(url=>url.pathname==='/classes/',{timeout:15000,waitUntil:'load'}),
      page.locator('#mainnav a[href="/classes/"]').tap()
    ]);
    check('webkit '+width+' navigation reaches classes',new URL(page.url()).pathname==='/classes/',page.url());
  }catch(e){check('webkit '+width+' menu interaction',false,String(e));}
  try{
    await page.goto(base+'/workshops/',{waitUntil:'load'});
    await page.locator('#ws11-all').tap();
    check('webkit '+width+' library search opens',await page.locator('#workshop-catalogue').evaluate(e=>e.open===true));
    await page.goto(base+'/workshops/',{waitUntil:'load'});
    await Promise.all([
      page.waitForURL(url=>url.pathname==='/workshops/audiences/schools/',{timeout:15000,waitUntil:'load'}),
      page.locator('.ws11-audience a[href="/workshops/audiences/schools/"]').tap()
    ]);
    check('webkit '+width+' audience navigation',new URL(page.url()).pathname==='/workshops/audiences/schools/',page.url());
  }catch(e){check('webkit '+width+' workshop interaction',false,String(e));}
  await context.close();
}
const noJs=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,javaScriptEnabled:false});
const fallback=await noJs.newPage();
try{
  const r=await fallback.goto(base+'/workshops/',{waitUntil:'load'});
  check('WebKit no-JS workshop HTTP',r?.status()===200,String(r?.status()));
  check('WebKit no-JS direct audience links',await fallback.locator('a[href="/workshops/audiences/schools/"]').count()>=1);
}catch(e){check('WebKit no-JS fallback',false,String(e));}
await noJs.close();await browser.close();
writeFileSync(dest+'/aeth-webkit-report.json',JSON.stringify({summary:{passed:results.passed.length,failed:results.failed.length},...results},null,2));
console.log(JSON.stringify({passed:results.passed.length,failed:results.failed.length,issues:results.failed},null,2));
if(results.failed.length)process.exit(1);
