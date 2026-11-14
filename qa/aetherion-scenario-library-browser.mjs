// Browser QA of source-controlled draft scenario library. No deployment, data collection or accounts.
import { chromium } from "playwright";
import { mkdirSync,writeFileSync,readFileSync } from "node:fs";
const base="http://127.0.0.1:8765",folder="qa/artifacts-scenarios";
mkdirSync(folder,{recursive:true});
const cases=["the-doorway","the-tote-route","the-library-route","the-paper-bridge","the-three-courts","the-classroom-minute","the-workshop-loop"];
const checks=[],failures=[];
function verify(n,pass,detail=null){checks.push({n,pass:!!pass,detail});if(!pass)failures.push({n,detail});}
const browser=await chromium.launch({headless:true});
const routes=[["index","/learn/scenarios/"],...cases.map(x=>[x,"/learn/scenarios/cases/"+x+"/"])];
for(const [name,path] of routes){
  for(const width of name==="index"?[320,390,768,1280]:[390]){
    const page=await browser.newPage({viewport:{width,height:width<400?844:900},reducedMotion:"reduce"});
    const js=[],bad=[];
    page.on("pageerror",e=>js.push(e.message));
    page.on("response",r=>{if(r.url().startsWith(base+"/assets/")&&r.status()>=400)bad.push(r.url()+" "+r.status())});
    try{
      const resp=await page.goto(base+path,{waitUntil:"networkidle",timeout:35000});
      const x=await page.evaluate(()=>({
        h1:document.querySelectorAll("main h1").length,
        overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href")||null,
        skip:!!document.querySelector('a.skip[href="#main"]')&&!!document.querySelector("main#main")
      }));
      verify(name+" "+width+" HTTP",resp.status()===200,resp.status());
      verify(name+" "+width+" one H1",x.h1===1,x.h1);
      verify(name+" "+width+" horizontal overflow <=2px",x.overflow<=2,x.overflow);
      verify(name+" "+width+" correct canonical",x.canonical==="https://aetherionmovement.com"+path,x.canonical);
      verify(name+" "+width+" skip link",x.skip);
      verify(name+" "+width+" JS errors",js.length===0,js);
      verify(name+" "+width+" assets 200",bad.length===0,bad);
      if(name==="index")verify(name+" "+width+" seven cards",(await page.locator(".scn-card").count())===7);
      if(name==="index"&&(width===390||width===1280))await page.screenshot({path:folder+"/"+name+"-"+width+".png",fullPage:true});
      if(name==="the-workshop-loop"&&width===390)await page.screenshot({path:folder+"/"+name+"-"+width+".png",fullPage:true});
      if(name==="index"&&width===390){
        await page.locator("#scn-track").selectOption("3");
        verify("track filter 3 shows one",(await page.locator(".scn-card:visible").count())===1);
        verify("live count updates",(await page.locator("#scn-count").innerText()).startsWith("1 of 7"));
      }
    }catch(e){verify(name+" "+width+" browser navigation",false,String(e))}
    await page.close();
  }
}
const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
await p.goto(base+"/learn/scenarios/",{waitUntil:"networkidle"});
await p.locator("#scn-track").selectOption("3");
verify("track three visible count",(await p.locator(".scn-card:visible").count())===1);
await p.locator("#scn-focus").selectOption("culture");
verify("incompatible filter zero",(await p.locator(".scn-card:visible").count())===0);
verify("zero status announced",(await p.locator("#scn-count").innerText()).startsWith("0 of 7"));
await p.locator("#scn-reset").click();
verify("reset restores seven",(await p.locator(".scn-card:visible").count())===7);
await p.locator("#scn-focus").selectOption("facilitation");
verify("facilitation filter one",(await p.locator(".scn-card:visible").count())===1);
await p.locator("#scn-left").selectOption("SC-003");
await p.locator("#scn-right").selectOption("SC-004");
verify("comparator left title",(await p.locator("[data-compare-left] [data-compare-title]").innerText()).includes("Two paths"));
verify("comparator right title",(await p.locator("[data-compare-right] [data-compare-title]").innerText()).includes("rule"));
verify("comparator links are case routes",((await p.locator("[data-compare-left] [data-compare-link]").getAttribute("href"))==="/learn/scenarios/cases/the-library-route/")&&((await p.locator("[data-compare-right] [data-compare-link]").getAttribute("href"))==="/learn/scenarios/cases/the-paper-bridge/"));
await p.close();
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
const nj=await nojs.newPage();
await nj.goto(base+"/learn/scenarios/",{waitUntil:"domcontentloaded"});
verify("no-JS fallback all seven",(await nj.locator(".scn-card:visible").count())===7);
await nojs.close();
const axe=readFileSync("node_modules/axe-core/axe.min.js","utf8");
for(const path of ["/learn/scenarios/","/learn/scenarios/cases/the-workshop-loop/"]){
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(base+path,{waitUntil:"networkidle"});
 await page.addScriptTag({content:axe});
 const violations=await page.evaluate(async()=>{const x=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});return x.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.slice(0,3).map(n=>n.target)}));});
 verify("axe automated WCAG 2.1 A/AA subset "+path,violations.length===0,violations);
 writeFileSync(folder+"/"+(path==="/learn/scenarios/"?"index":"case")+"-axe.json",JSON.stringify(violations,null,2));
 await page.close();
}
await browser.close();
const report={total:checks.length,passed:checks.length-failures.length,failed:failures.length,failures,
 limits:["Chromium automation is not native iOS Safari or VoiceOver","Draft files are locally served, not deployed","Automated accessibility subset is not full WCAG conformance"]};
writeFileSync(folder+"/results.json",JSON.stringify({report,checks},null,2));
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
