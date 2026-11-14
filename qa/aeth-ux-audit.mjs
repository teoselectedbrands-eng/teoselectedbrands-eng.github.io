// Aetherion Edition: content index + browser UX QA. Review only; no deployment.
import { chromium } from 'playwright';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const out='qa/artifacts';mkdirSync(out,{recursive:true});
const root='http://127.0.0.1:8767';
const passed=[],failed=[];const ck=(name,yes,detail='')=>(yes?passed:failed).push({name,detail});
const file=p=>readFileSync(p,'utf8');
const allTopicIds=Array.from({length:72},(_,i)=>'aet-ws-'+String(i+1).padStart(3,'0'));
const audiences=['schools','families-and-youth','clubs-and-coaches','workplaces-and-teams','health-and-care','design-and-culture','community-organisations'];
const subjects=['schools-and-education','children-families-and-youth','movement-sport-and-coaching','leadership-and-workplaces','ergonomics-and-work-design','health-literacy-and-awareness','ageing-care-and-daily-life','design-space-and-accessibility','technology-ai-and-media','science-nature-and-discovery','culture-history-and-storytelling','community-and-public-engagement'];
const learn=['movement-science','brain-learning','psychology-participation','human-functioning','environment-accessibility','children-play','ageing-everyday-life','science-technology-culture'];
const journal=['movement-practice','children-play','adults-activity','home-ageing','psychology-learning','food-health','design-society','science-culture'];
const locations=[
 ...allTopicIds.map(x=>'workshops/topics/'+x+'/index.html'),
 ...audiences.map(x=>'workshops/audiences/'+x+'/index.html'),
 ...subjects.map(x=>'workshops/subjects/'+x+'/index.html'),
 ...learn.map(x=>'learn/fields/'+x+'/index.html'),
 ...journal.map(x=>'journal/collections/'+x+'/index.html'),
 'workshops/audiences/index.html','workshops/subjects/index.html','learn/fields/index.html','journal/collections/index.html','resources/movement-practice-notes/index.html'
];
for(const p of locations){
 ck('Exists '+p,existsSync(p));
 if(!existsSync(p))continue;
 const s=file(p);
 ck('Has document structure '+p,s.includes('<!doctype html>')&&s.includes('<h1')&&s.includes('<main')&&s.includes('</html>'));
 const url='https://aetherionmovement.com/'+p.replace('index.html','');
 ck('Canonical URL '+p,s.includes(url));
}
ck('Canonical topic file set',allTopicIds.length===72);
const wk=file('workshops/index.html'),home=file('index.html'),move=file('movement/index.html'),cls=file('classes/index.html'),lrn=file('learn/index.html'),jrn=file('journal/index.html'),dis=file('discover/index.html'),map=file('sitemap.xml');
ck('Workshop main has dedicated audience link',wk.includes('/workshops/audiences/schools/'));
ck('Workshop archive preserved', (wk.match(/class="ws10-card"/g)||[]).length===72);
ck('Workshop card canonical links', (wk.match(/class="ws15-direct"/g)||[]).length===72);
ck('Workshop counts not displayed',!wk.includes('72 workshop topics')&&!wk.includes('Explore all 72'));
ck('Homepage new hero',home.includes('id="home16-title"'));
ck('Homepage no unrelated astronomy feature',!home.includes('/journal/why-the-night-sky-shows-us-different-moments-in-time/'));
ck('Movement explains practical methods',move.includes('id="practice"')&&move.includes('/classes/pilates/')&&move.includes('id="outdoor"'));
ck('Classes practical gallery',cls.includes('id="practice-gallery"'));
ck('Learning science entry',lrn.includes('id="learning-domains"'));
ck('Journal life-context entry',jrn.includes('id="journal-collections"'));
ck('Discover no inventory badges',!dis.includes('class="ad-count"'));
ck('Sitemap all new routes',locations.every(p=>map.includes('https://aetherionmovement.com/'+p.replace('index.html',''))));
const browser=await chromium.launch({headless:true});
const smoke=['/','/movement/','/classes/','/workshops/','/workshops/audiences/schools/','/workshops/subjects/schools-and-education/','/workshops/topics/aet-ws-001/','/learn/','/learn/fields/','/journal/','/journal/collections/','/discover/','/resources/movement-practice-notes/'];
for(const width of [390,1280]){
 const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
 for(const route of smoke){
  try{
   const res=await page.goto(root+route,{waitUntil:'networkidle',timeout:35000});
   const d=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:[...document.querySelectorAll('h1')].filter(x=>x.getClientRects().length>0).length}));
   ck(width+' route '+route,res?.status()===200,String(res?.status()));
   ck(width+' h1 '+route,d.h1===1,String(d.h1));
   ck(width+' no overflow '+route,d.overflow<=3,String(d.overflow));
   if(width===390&&['/','/movement/','/classes/','/workshops/','/learn/','/journal/'].includes(route))await page.screenshot({path:out+'/aeth-ux-'+route.replaceAll('/','_')+'.png',fullPage:true});
  }catch(e){ck(width+' runtime '+route,false,String(e));}
 }
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
try{
 await page.goto(root+'/workshops/',{waitUntil:'networkidle'});
 await page.locator('.ws11-audience a[href="/workshops/audiences/schools/"]').click();
 ck('Workshops to Schools index',new URL(page.url()).pathname==='/workshops/audiences/schools/');
 await page.locator('.atx-card a[href^="/workshops/topics/"]').first().click();
 ck('Schools index to individual topic',new URL(page.url()).pathname.startsWith('/workshops/topics/'));
 await page.goto(root+'/workshops/',{waitUntil:'networkidle'});
 const searchLink=page.locator('#ws11-all');
 await searchLink.click();
 ck('Workshop library quick link expands archive',await page.locator('#workshop-catalogue').evaluate(el=>el.open));
 await page.goto(root+'/workshops/',{waitUntil:'networkidle'});
 const details=page.locator('#workshop-catalogue');
 ck('Archive collapsed on entry',!(await details.getAttribute('open')));
 await details.locator(':scope > summary').click();
 ck('Archive opens',await details.evaluate(el=>el.open));
 ck('Search filter accessible',await page.locator('#ws10-search').isVisible());
}catch(e){ck('Workshop visitor path',false,String(e));}
await page.close();
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
try{await nojs.goto(root+'/workshops/',{waitUntil:'load'});ck('No-JS workshop audience navigation',await nojs.locator('.ws11-audience a[href="/workshops/audiences/schools/"]').count()===1);}catch(e){ck('NoJS fallback',false,String(e));}
await nojs.close();await browser.close();
writeFileSync(out+'/aeth-ux-audit.json',JSON.stringify({total:passed.length+failed.length,passed:passed.length,failed},null,2));
console.log(JSON.stringify({total:passed.length+failed.length,passed:passed.length,failed:failed.length,issues:failed.slice(0,30)},null,2));
if(failed.length)process.exit(1);
