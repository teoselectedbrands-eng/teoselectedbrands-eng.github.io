// Track 07: observational terminology, instructional scaffolding, and
// source integrity. Read-only assertions; browser and native device tests are separate.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const page = read("learn/field-labs/facilitation-studio/index.html");
const css = read("assets/aeth-facilitator-studio.css");
const hub = read("learn/field-labs/index.html");
const landing = read("learn/index.html");
const register = read("docs/aetherion-academy-track-learning-register-20261114.md");
const newURL = "/learn/field-labs/facilitation-studio/";
const linkedSources = [
  "learn/learn-001/field-lab/index.html",
  "learn/learn-002/field-lab/index.html",
  "learn/field-labs/route-choices/index.html",
  "learn/field-labs/rules-create-possibilities/index.html",
  "learn/field-labs/sport-culture/index.html",
  "learn/field-labs/classroom-choice/index.html"
];
const backPaths = [
  "/learn/learn-001/field-lab/",
  "/learn/learn-002/field-lab/",
  "/learn/field-labs/route-choices/",
  "/learn/field-labs/rules-create-possibilities/",
  "/learn/field-labs/sport-culture/",
  "/learn/field-labs/classroom-choice/"
];
const steps = ["observe","name","design","facilitate","evaluate","improve"];
const terms = [
  "Observation","Inference","Hypothesis","Context","Affordance","Facilitation",
  "Participation","Accommodation","Criterion","Evidence","Feedback loop","Trade-off"
];
assert.ok(page.includes('rel="canonical" href="https://aetherionmovement.com' + newURL + '"'), "Track 07 canonical missing");
assert.ok(page.includes('href="#main"') && page.includes('id="main"'), "Skip-link target missing");
assert.ok(page.includes('aria-label="Ten observation lenses"'), "Ten-lens purpose must be declared");
assert.equal((page.match(/class="fac-lens"/g)||[]).length, 10, "Exactly ten observational lenses required");
for (const id of steps) assert.ok(page.includes('id="' + id + '"'), "Learning stage missing: " + id);
const foundStages = [...page.matchAll(/<section class="lab-section" id="([^"]+)" aria-labelledby="([^"]+)"/g)]
  .map(x => x[1]);
assert.deepEqual(foundStages.slice(0, 6), steps, "Learning progression broken");
assert.equal((page.match(/class="fac-term"/g)||[]).length, 12, "Pocket terminology must have 12 terms");
for (const term of terms) assert.ok(page.includes("<dt>" + term + "</dt>"), "Term missing: " + term);
assert.equal((page.match(/<details class="lab-answer">/g)||[]).length, 5, "Five worked reasoning samples required");
assert.equal((page.match(/<\/details>/g)||[]).length, 5, "Unclosed disclosure");
assert.equal((page.match(/class="fac-timeline"/g)||[]).length, 5, "20-minute schedule must have five stages");
assert.ok(page.includes("00–03 min") && page.includes("17–20 min"), "Workshop time endpoints missing");
assert.equal((page.match(/class="fac-gate"/g)||[]).length, 3, "Three design gates required");
assert.ok(page.includes("print-friendly facilitator reflection template"), "Private worksheet label missing");
assert.ok(page.includes('href="/assets/aeth-facilitator-studio.css?v=20261114-01"'), "Scoped facilitator CSS missing");
assert.ok(css.includes("@media(max-width:560px)") && css.includes("@media print"), "Mobile/print styles missing");
assert.ok(!/<(?:form|input|textarea)\b/i.test(page), "Do not solicit or store learner answers");
assert.ok(!/(localStorage|sessionStorage|sendBeacon\s*\(|fetch\s*\()/i.test(page), "Unexpected client-side collection");
assert.ok(!/https?:\/\/(?:meet\.google|zoom\.us)/i.test(page), "No live meeting links");
const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML ids");
for (const url of backPaths) assert.ok(page.includes('href="' + url + '"'), "Cross-track source not linked: " + url);
assert.equal((hub.match(/class="lab-no"/g)||[]).length, 7, "Seven guided labs expected");
assert.ok(hub.includes('href="' + newURL + '"'), "New lab missing from central index");
assert.ok(hub.includes("Nineteen remain curriculum outlines"), "Status of 19 courses must remain honest");
assert.ok(hub.includes("not seven completed courses"), "Samples cannot be called finished courses");
assert.ok(landing.includes("Explore seven guided learning samples"), "Landing count stale");
for (const src of linkedSources) {
  const earlier = read(src);
  assert.ok(earlier.includes('href="' + newURL + '"'), src + " lacks a facilitator return path");
}
assert.ok(register.includes("Iteration L4"), "L4 phase register missing");
assert.ok(register.includes("future L5"), "Do not claim the future scenario library is done");
console.log("PASS Track 07: 10 observation lenses, 12 precise terms, 6 steps, 5 examples, 3 gates, 7 connected labs, privacy, truthful curriculum status.");
