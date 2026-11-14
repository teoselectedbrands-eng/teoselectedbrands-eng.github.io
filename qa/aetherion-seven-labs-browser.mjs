// Localhost browser validation of the exact draft GitHub branch. No deployment.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const base="http://127.0.0.1:8765", dest="qa/artifacts-facilitation";
mkdirSync(dest,{recursive:true});
const pages=[
["hub","/learn/field-labs/"],
["observation","/learn/learn-001/field-lab/"],
["movement","/learn/learn-002/field-lab/"],
["routes","/learn/field-labs/route-choices/"],
["rules","/learn/field-labs/rules-create-possibilities/"],
["sport","/learn/field-labs/sport-culture/"],
["classroom","/learn/field-labs/classroom-choice/"],
["studio","/learn/field-labs/facilitation-studio/"]
];
const checks=[],fails=[];
const check=(name,pass,detail=null)=>{checks.push({name,pass:!!pass,detail});if(!pass)fails.push({name,detail})};
const browser=await chromium.launch({headless:true});
for(const [name,path] of pages){
  const widths=(name==="hub"||name==="studio")?[320,390,768,1280]:[390];
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width<=390?844:900},reducedMotion:"reduce"});
    const errors=[],badAssets=[];
    page.on("pageerror",e=>errors.push(e.message));
    page.on("response",response=>{
      if(response.url().startsWith(base+"/assets/")&&response.status()>=400)badAssets.push(response.url()+" "+response.status());
    });
    try{
      const response=await page.goto(base+path,{waitUntil:"networkidle",timeout:35000});
      const observed=await page.evaluate(()=>{
        const main=document.querySelector("main");
        return {h1:main?.querySelectorAll("h1").length||0,
          overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
          canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          skip:!!document.querySelector('a.skip[href="#main"]')&&!!document.getElementById("main"),
          cards:main?.querySelectorAll(".lab-shelf>a").length||0,
          details:main?.querySelectorAll("details.lab-answer").length||0};
      });
      check(name+" "+width+" HTTP 200",response.status()===200,response.status());
      check(name+" "+width+" exactly one H1",observed.h1===1,observed.h1);
      check(name+" "+width+" no horizontal overflow >2px",observed.overflow<=2,observed.overflow);
      check(name+" "+width+" canonical",observed.canonical==="https://aetherionmovement.com"+path,observed.canonical);
      check(name+" "+width+" skip link",observed.skip);
      check(name+" "+width+" JS console exceptions",errors.length===0,errors);
      check(name+" "+width+" local assets",badAssets.length===0,badAssets);
      if(name==="hub")check("hub "+width+" seven links",observed.cards===7,observed.cards);
      if(name==="studio")check("studio "+width+" five optional examples",observed.details===5,observed.details);
      if(width===390||(name==="studio"&&width===1280))await page.screenshot({path:dest+"/"+name+"-"+width+".png",fullPage:true});
      if(name==="studio"&&width===390){
        const example=page.locator("details.lab-answer").first();
        check("disclosure initially closed",(await example.getAttribute("open"))===null);
        await example.locator("summary").click();
        check("disclosure opens",(await example.getAttribute("open"))!==null);
        await example.locator("summary").click();
        check("disclosure closes",(await example.getAttribute("open"))===null);
        const menu=page.locator(".menu-btn");
        await menu.click();
        check("mobile menu opens",(await menu.getAttribute("aria-expanded"))==="true");
        await page.keyboard.press("Escape");
        check("mobile menu Escape",(await menu.getAttribute("aria-expanded"))==="false");
        check("six other labs linked",(await page.locator("#connect .lab-shelf>a").count())===6);
      }
    }catch(e){check(name+" "+width+" navigation",false,String(e))}
    await page.close();
  }
}
const request=await browser.newContext();
for(const [,path] of pages){
  const response=await request.request.get(base+path,{timeout:10000});
  check("local linked route "+path,response.status()===200,response.status());
}
await request.close();
const axeSource=readFileSync("node_modules/axe-core/axe.min.js","utf8");
for(const [name,path] of [["hub","/learn/field-labs/"],["studio","/learn/field-labs/facilitation-studio/"]]){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(base+path,{waitUntil:"networkidle"});
  await page.addScriptTag({content:axeSource});
  const violations=await page.evaluate(async()=>{
    const report=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
    return report.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,targets:v.nodes.slice(0,4).map(n=>n.target)}));
  });
  writeFileSync(dest+"/"+name+"-axe.json",JSON.stringify(violations,null,2));
  check(name+" automated WCAG2.1 A/AA subset",violations.length===0,violations);
  await page.close();
}
await browser.close();
const report={total:checks.length,passed:checks.length-fails.length,failed:fails.length,failures:fails,
  limits:["Chromium emulation is not native iOS Safari/VoiceOver","This draft check does not prove production deployment","Automated checks do not prove full accessibility"]};
writeFileSync(dest+"/results.json",JSON.stringify({report,checks},null,2));
console.log(JSON.stringify(report,null,2));
if(fails.length)process.exitCode=1;
