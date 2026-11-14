// Batch 2: Central Help handoff — real Chromium QA against source branch, no network submissions.
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('qa/artifacts-contact',{recursive:true});
const root='http://127.0.0.1:8765',browser=await chromium.launch({headless:true});
const failures=[],results=[];let checked=0;
function test(label,condition,evidence){checked++;const item={label,pass:!!condition,evidence:evidence??null};results.push(item);if(!condition)failures.push(item);}
const topics=["learning","movement","workshop","event","professional","partnership"];
const expected={"learning":"Learning & resources","movement":"Movement learning","workshop":"Workshops & group learning","event":"Events & invitations","professional":"Professional contact route","partnership":"Community partnerships"};
for(const width of [320,390,768,1280]) {
 const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=await page.goto(root+'/help/',{waitUntil:'networkidle'});
 test('Help '+width+' HTTP 200',base.status()===200,base.status());
 const basic=await page.evaluate(()=>({over:document.documentElement.scrollWidth-window.innerWidth,h1:document.querySelectorAll('h1').length}));
 test('Help '+width+' no horizontal overflow',basic.over<=2,basic.over);
 test('Help '+width+' one H1',basic.h1===1,basic.h1);
 test('Help '+width+' default route hidden',await page.locator('#enquiry-route').isHidden());
 test('Help '+width+' generic mailto unchanged',(await page.locator('#contact .cta').getAttribute('href'))==='mailto:hello@aetherionmovement.com');
 test('Help '+width+' script no errors',errors.length===0,errors);
 for(const topic of topics) {
   await page.goto(root+'/help/?topic='+topic+'#contact',{waitUntil:'networkidle'});
   test('Help '+width+' '+topic+' route shown',await page.locator('#enquiry-route').isVisible());
   test('Help '+width+' '+topic+' label correct',(await page.locator('#enquiry-route-label').textContent())===expected[topic]);
   const href=await page.locator('#contact .cta').getAttribute('href');
   test('Help '+width+' '+topic+' subject and recipient',href.startsWith('mailto:hello@aetherionmovement.com?subject=')&&decodeURIComponent(href).includes('Aetherion enquiry'),href.slice(0,140));
   test('Help '+width+' '+topic+' no personal data in URL',!page.url().includes('name=')&&!page.url().includes('email=')&&!page.url().includes('diagnosis='));
 }
 if([390,1280].includes(width))await page.screenshot({path:'qa/artifacts-contact/help-'+width+'.png',fullPage:true});
 await page.goto(root+'/help/?topic=unknown#contact',{waitUntil:'networkidle'});
 test('Help '+width+' unknown topic ignored',await page.locator('#enquiry-route').isHidden());
 await page.goto(root+'/help/',{waitUntil:'networkidle'});
 await page.locator('#faq-search').fill('workshop');
 test('Help '+width+' existing FAQ search stays working',(await page.locator('#faq-count').textContent()).includes(' of 20 answers'));
 test('Help '+width+' no data submission forms',(await page.locator('form').count())===0);
 await page.close();
}
const pages=[
 {url:'/learn/',target:'/help/?topic=learning#contact'},
 {url:'/classes/',target:'/help/?topic=movement#contact'},
 {url:'/events/',target:'/help/?topic=event#contact'},
 {url:'/professional-services/',target:'/help/?topic=professional#contact'}
];
for(const p of pages){
  for(const width of [320,390,768,1280]){
    const page=await browser.newPage({viewport:{width,height:width<400?844:850},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const res=await page.goto(root+p.url,{waitUntil:'networkidle'});
    test(p.url+' '+width+' HTTP 200',res.status()===200,res.status());
    test(p.url+' '+width+' contains correct bridge',(await page.locator('a[href="'+p.target+'"]').count())===1);
    const offset=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    test(p.url+' '+width+' no horizontal overflow',offset<=2,offset);
    test(p.url+' '+width+' no forms',(await page.locator('form').count())===0);
    test(p.url+' '+width+' no script errors',errors.length===0,errors);
    await page.locator('a[href="'+p.target+'"]').click();
    test(p.url+' '+width+' opens requested Help route',new URL(page.url()).pathname==='/help/'&&new URL(page.url()).search===new URL(p.target,root).search,page.url());
    test(p.url+' '+width+' selected Help guidance visible',await page.locator('#enquiry-route').isVisible());
    await page.close();
  }
}
await browser.close();
const report={checked,passed:checked-failures.length,failed:failures.length,failures,limitations:['Tests use Chromium; not native iOS Safari/VoiceOver','No test email sent; mailbox delivery, staffing and response SLAs unverified','No public event invitations or booking slots activated']};
writeFileSync('qa/artifacts-contact/result.json',JSON.stringify({report,results},null,2));
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;