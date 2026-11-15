// Private Aetherion practice, inquiry and brand validation, no deploy or external messages.
import { chromium,webkit } from 'playwright';
import { existsSync,readFileSync,mkdirSync,writeFileSync } from 'node:fs';
const base='http://127.0.0.1:8770',out='qa/artifacts';mkdirSync(out,{recursive:true});
const errors=[],passing=[];const ok=(name,v,detail='')=>(v?passing:errors).push({name,detail});
const practice=['pilates','calisthenics','rhythm-and-coordination','play-and-cooperation','outdoor-movement','living-and-ageing'];
const files=practice.map(x=>'classes/'+x+'/index.html');
const routes=['/','/movement/','/classes/','/membership/','/help/','/inquiry/',...practice.map(x=>'/classes/'+x+'/')];
for(const p of [...files,'inquiry/index.html','assets/aeth-inquiry.js','assets/aeth-practice-field.css','assets/brand/aetherion-logo-header-gold-transparent.png','assets/brand/aetherion-logo-header-green-transparent.png']){
 ok('source exists '+p,existsSync(p));
}
const png=readFileSync('assets/brand/aetherion-logo-header-gold-transparent.png');
ok('Original logo valid PNG',png.slice(0,8).toString('hex')==='89504e470d0a1a0a','signature');
ok('Original logo preserved file size',png.length===89267,String(png.length));
const csv=readFileSync('classes/index.html','utf8');
ok('Class index links all guides',practice.every(x=>csv.includes('/classes/'+x+'/')));
ok('Outdated movement studies removed',!readFileSync('movement/index.html','utf8').includes('Balance is a relationship'));
ok('No real email capture in inquiry',!readFileSync('assets/aeth-inquiry.js','utf8').match(/fetch\(|localStorage|XMLHttpRequest|sendBeacon/i));
const expectedLogo='/assets/brand/aetherion-logo-header-gold-transparent.png';
for(const [engine,launcher] of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await launcher.launch({headless:true});
 for(const width of [320,390,1280]){
  const c=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce'});
  const page=await c.newPage();
  for(const route of routes){
   const errs=[];page.on('pageerror',e=>errs.push(e.message));
   try{
    const resp=await page.goto(base+route,{waitUntil:'load',timeout:30000});
    await page.waitForTimeout(110);
    const info=await page.evaluate(()=>{
      const vis=x=>x&&x.getClientRects().length>0&&getComputedStyle(x).visibility!=='hidden';
      const h1=[...document.querySelectorAll('main h1')].filter(vis);
      const el=document.querySelector('header.mast a.brand');
      const style=el?getComputedStyle(el):null;
      return {h1:h1.length,overflow:document.documentElement.scrollWidth-innerWidth,brand:style?.backgroundImage||'',logoSize:el?.getBoundingClientRect().width||0,visibleImages:[...document.images].filter(vis).length};
    });
    ok(engine+' '+width+' '+route+' HTTP',resp?.status()===200,String(resp?.status()));
    ok(engine+' '+width+' '+route+' one visible h1',info.h1===1,String(info.h1));
    ok(engine+' '+width+' '+route+' fits screen',info.overflow<=3,String(info.overflow));
    if(route!='/help/')ok(engine+' '+width+' '+route+' original logo CSS',info.brand.includes(expectedLogo),info.brand.slice(0,140));
    ok(engine+' '+width+' '+route+' no script errors',errs.length===0,errs.join('; '));
    if(engine==='WebKit'&&width===390&&['/','/movement/','/classes/','/inquiry/','/membership/'].includes(route))await page.screenshot({path:out+'/aeth-practice-'+(route==='/'?'home':route.replaceAll('/','-'))+'.png',fullPage:false});
   }catch(e){ok(engine+' '+width+' '+route+' runtime',false,String(e))}
  }
  try{
   await page.goto(base+'/inquiry/',{waitUntil:'load'});
   await page.locator('#aeth-purpose').selectOption('classes');
   await page.locator('#aeth-mode').selectOption('individual');
   await page.locator('#aeth-context').selectOption('self');
   ok(engine+' '+width+' inquiry local routing visible',(await page.locator('[data-aeth-route]').textContent()||'').includes('No classes'));
   ok(engine+' '+width+' form shows draft not booking',(await page.locator('form [role=status]').textContent()||'').includes('Nothing has been sent'));
  }catch(e){ok(engine+' '+width+' inquiry operation',false,String(e));}
  try{
   await page.goto(base+'/movement/',{waitUntil:'load'});
   const link=page.locator('a[href="/classes/pilates/"]').first();
   await Promise.all([page.waitForURL(u=>u.pathname==='/classes/pilates/',{timeout:12000}),link.click()]);
   ok(engine+' '+width+' field to Pilates guide',new URL(page.url()).pathname==='/classes/pilates/');
  }catch(e){ok(engine+' '+width+' field navigation',false,String(e))}
  await c.close();
 }
 await browser.close();
}
writeFileSync(out+'/aeth-practice-qa.json',JSON.stringify({passed:passing.length,failed:errors},null,2));
console.log(JSON.stringify({pass:passing.length,fail:errors.length,errors:errors.slice(0,30)},null,2));
if(errors.length)process.exit(1);
