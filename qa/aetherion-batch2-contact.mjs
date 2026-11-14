// Batch 2 central-contact route QA — runs against branch, no email is sent.
import { chromium } from 'playwright';
import { writeFileSync,mkdirSync } from 'node:fs';
const ROOT='http://127.0.0.1:8765',DIR='qa/artifacts-batch2';
mkdirSync(DIR,{recursive:true});
const browser=await chromium.launch({headless:true});
const WIDTHS=[320,390,768,1280];
const TOPICS=['general','learning','movement','workshop','professional','partnership','accessibility','editorial'];
const records=[],errors=[];
function verify(name,ok,details={}){const r={name,pass:!!ok,...details};records.push(r);if(!ok)errors.push(r);}
for (const width of WIDTHS) {
  const page=await browser.newPage({viewport:{width,height:width<400?844:900},reducedMotion:'reduce'});
  const jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
  for (const topic of TOPICS) {
    const res=await page.goto(ROOT+'/help/?topic='+topic+'#contact',{waitUntil:'networkidle'});
    const result=await page.evaluate(()=>{
      const el=document.getElementById('enquiry-compose');
      const selector=document.getElementById('enquiry-topic');
      return {selected:selector?.value,href:el?.getAttribute('href'),txt:el?.textContent,summary:document.getElementById('enquiry-explanation')?.textContent,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),details:document.querySelectorAll('details.faqcard').length,forms:document.querySelectorAll('form').length,hash:location.hash};
    });
    const base=width+'px '+topic;
    verify(base+' HTTP',res.status()===200,{status:res.status()});
    verify(base+' preselected topic',result.selected===topic,{selected:result.selected});
    verify(base+' composer address',!!result.href?.startsWith('mailto:hello@aetherionmovement.com?subject='),{href:result.href?.slice(0,140)});
    verify(base+' includes meaningful subject',decodeURIComponent(result.href||'').includes('Aetherion enquiry | '));
    verify(base+' no horizontal overflow',result.overflow<=2,{overflow:result.overflow});
    verify(base+' retains 20 FAQ entries',result.details===20,{faqCount:result.details});
    verify(base+' no online forms',result.forms===0);
    verify(base+' contact hash stable',result.hash==='#contact');
    verify(base+' status guidance exists',!!result.summary && result.summary.length>60);
    if(width===390 && ['learning','professional','workshop'].includes(topic))await page.screenshot({path:DIR+'/help-'+topic+'-390.png',fullPage:true});
  }
  verify(width+' no JS exceptions',jsErrors.length===0,{errors:jsErrors});
  await page.close();
}
const invalid=await browser.newPage();
await invalid.goto(ROOT+'/help/?topic=%3Cscript%3E#contact',{waitUntil:'networkidle'});
verify('unknown topic safely resolves general',(await invalid.locator('#enquiry-topic').inputValue())==='general');
verify('unknown topic does not enter mailto',(await invalid.locator('#enquiry-compose').getAttribute('href')).indexOf('%3Cscript%3E')===-1);
await invalid.locator('#enquiry-topic').selectOption('professional');
verify('manual topic change reacts',(await invalid.locator('#enquiry-explanation').innerText()).includes('medical reports'));
verify('manual topic change changes subject',decodeURIComponent(await invalid.locator('#enquiry-compose').getAttribute('href')).includes('Private professional contact route'));
await invalid.close();
const nojs=await browser.newContext({javaScriptEnabled:false});
const pageNo=await nojs.newPage();await pageNo.goto(ROOT+'/help/',{waitUntil:'domcontentloaded'});
verify('no-JS general fallback mailto',await pageNo.locator('a#enquiry-compose[href="mailto:hello@aetherionmovement.com"]').count()===1);
verify('no-JS topic fallback links',await pageNo.locator('.formcard details a[href^="mailto:"]').count()>=8);
await nojs.close();
const sourceRoutes=[['learn','/learn/','learning'],['classes','/classes/','movement'],['events','/events/','workshop'],['professional','/professional-services/','professional']];
const routed=await browser.newPage({viewport:{width:390,height:844}});
for(const [name,route,topic] of sourceRoutes){
  const link='/help/?topic='+topic+'#contact';
  const result=await routed.goto(ROOT+route,{waitUntil:'networkidle'});
  verify(name+' route 200',result.status()===200);
  verify(name+' contextual Help link',await routed.locator('a[href="'+link+'"]').count()>0);
  const a=routed.locator('a[href="'+link+'"]').first();
  await a.click();
  await routed.waitForURL(url=>url.pathname==='/help/' && url.searchParams.get('topic')===topic,{timeout:7000});
  verify(name+' click transitions to preselected Help', (await routed.locator('#enquiry-topic').inputValue())===topic);
}
await routed.goto(ROOT+'/professional-services/',{waitUntil:'networkidle'});
verify('clinical page remains noindex',(await routed.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
verify('no clinical intake form',await routed.locator('form').count()===0);
await routed.goto(ROOT+'/events/',{waitUntil:'networkidle'});
verify('no active event registration', (await routed.locator('body').innerText()).includes('No events are scheduled yet'));
await routed.close();
await browser.close();
const report={count:records.length,passed:records.length-errors.length,failed:errors.length,errors,scope:'actual GitHub branch Chromium; not live domain, native Safari, mail transport or clinical scheduling'};
writeFileSync(DIR+'/batch2-qa.json',JSON.stringify({report,records},null,2));
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;