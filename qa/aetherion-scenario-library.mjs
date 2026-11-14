// Aetherion Scenario Library L5: source integrity and epistemic boundaries.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
const register=JSON.parse(read("learn/scenarios/scenario-register.json"));
const hub=read("learn/scenarios/index.html");
const browserCode=read("assets/aeth-scenario-library.js");
const css=read("assets/aeth-scenario-library.css");
const entry=read("learn/index.html");
const fieldHub=read("learn/field-labs/index.html");
const studio=read("learn/field-labs/facilitation-studio/index.html");
const learningPath="/learn/scenarios/";
assert.equal(register.schema,"aetherion-scenario-library-v1");
assert.equal(register.status,"private_draft");
assert.deepEqual(register.canonicalAcademy,{tracks:7,concepts:21,publicIntroductions:2,remainingOutlines:19});
assert.equal(register.cases.length,7);
assert.equal(new Set(register.cases.map(c=>c.id)).size,7);
assert.equal(new Set(register.cases.map(c=>c.slug)).size,7);
assert.deepEqual(register.cases.map(c=>c.track),[1,2,3,4,5,6,7]);
assert.equal((hub.match(/class="scn-card"/g)||[]).length,7);
assert.equal((hub.match(/<select /g)||[]).length,4);
assert.ok(hub.includes('rel="canonical" href="https://aetherionmovement.com/learn/scenarios/"'));
assert.ok(hub.includes('id="scn-count" role="status" aria-live="polite"'));
assert.ok(hub.includes('data-scenario-library'));
assert.ok(hub.includes('data-compare-left')&&hub.includes('data-compare-right'));
assert.ok(hub.includes('href="/assets/aeth-scenario-library.css?v=20261115-01"'));
assert.ok(hub.includes('src="/assets/aeth-scenario-library.js?v=20261115-01"'));
assert.ok(hub.includes("not seven completed Academy courses") ||
  hub.includes("not seven completed courses") ||
  hub.includes("not seven completed Academy courses") ||
  hub.includes("not a completed course"));
assert.ok(!/(localStorage|sessionStorage|navigator\.sendBeacon|fetch\s*\()/i.test(browserCode),"No local tracking or API calls");
assert.ok(!/(innerHTML|insertAdjacentHTML|eval\s*\()/i.test(browserCode),"Do not make dynamic HTML from case data");
assert.ok(browserCode.includes("card.hidden")&&browserCode.includes("count.textContent"));
assert.ok(css.includes("@media(max-width:650px)")&&css.includes("@media print"));
assert.ok(entry.includes('href="/learn/scenarios/"'));
assert.ok(fieldHub.includes('href="/learn/scenarios/"'));
assert.ok(studio.includes('href="/learn/scenarios/"'));
for(let i=0;i<register.cases.length;i++){
 const c=register.cases[i];
 const url=learningPath+"cases/"+c.slug+"/";
 const html=read("learn/scenarios/cases/"+c.slug+"/index.html");
 assert.equal(c.id,"SC-"+String(i+1).padStart(3,"0"));
 assert.ok(c.given.length>=3);
 for(const key of ["setting","interpretation","unknown","tradeoff","review","evidence","facilitation","link","next"])
   assert.ok(typeof c[key]==="string"&&c[key].length>10,c.id+" missing "+key);
 for(const key of ["designA","designB"]){
   assert.ok(c[key].name&&c[key].action&&c[key].constraint,c.id+" missing "+key);
 }
 assert.ok(register.cases.some(x=>x.id===c.next),c.id+" invalid next reference");
 assert.ok(hub.includes('href="'+url+'"'),c.id+" not discoverable");
 assert.ok(html.includes('rel="canonical" href="https://aetherionmovement.com'+url+'"'),c.id+" canonical wrong");
 assert.ok(html.includes('href="'+c.link+'"'),c.id+" missing linked field lab");
 assert.ok(html.includes('href="/learn/field-labs/facilitation-studio/"'),c.id+" missing facilitation link");
 assert.ok(html.includes('href="/learn/scenarios/"'),c.id+" cannot return to index");
 assert.equal((html.match(/class="scn-section"/g)||[]).length,5,c.id+" five stage sections");
 assert.ok(html.includes("Given in fiction")&&html.includes("Interpretation")&&html.includes("Proposed change")&&html.includes("Evidence needed"),c.id+" status labels");
 assert.ok(html.includes("V2 · Revision proposal"),c.id+" proposal status missing");
 assert.ok(html.includes("proposed, not proven better"),c.id+" claims unbounded");
 assert.ok(html.includes('href="#main"')&&html.includes('id="main"'),c.id+" skip broken");
 assert.ok(!/<(?:form|input|textarea)\b/i.test(html),c.id+" collection element");
 assert.ok(!/(localStorage|sessionStorage|navigator\.sendBeacon|fetch\s*\()/i.test(html),c.id+" data call");
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,c.id+" duplicate ids");
}
console.log("PASS: 7 unique JSON records, 7 detail pages, consistent proposal/evidence boundaries, local-only filters and comparison, accessible navigation, no collection");
