// Read-only Academy scenario checks: routes, rules, and coherent links to the first two field labs.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = p => readFileSync(resolve(root, p), "utf8");
const route = read("learn/field-labs/route-choices/index.html");
const rules = read("learn/field-labs/rules-create-possibilities/index.html");
const index = read("learn/field-labs/index.html");
const first = read("learn/learn-001/field-lab/index.html");
const second = read("learn/learn-002/field-lab/index.html");
const styles = read("assets/aeth-scenarios.css");
const pageMap = new Map([
  ["route-choices", route],
  ["rules-create-possibilities", rules]
]);
const stages = ["notice", "compare", "question", "redesign"];
for (const [slug, page] of pageMap) {
  assert.ok(page.includes('rel="canonical" href="https://aetherionmovement.com/learn/field-labs/' + slug + '/"'), slug + " wrong canonical");
  assert.ok(page.includes('href="/assets/aeth-field-labs.css?v=20261114-01"'), slug + " shared styles absent");
  assert.ok(page.includes('href="/assets/aeth-scenarios.css?v=20261114-01"'), slug + " scenario styles absent");
  assert.deepEqual([...page.matchAll(/<section class="lab-section" id="([^"]+)" aria-labelledby="([^"]+)"/g)].map(x => x[1]), stages, slug + " must preserve four-step learning design");
  const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(ids.length, new Set(ids).size, slug + " duplicate IDs");
  assert.equal((page.match(/<details class="lab-answer">/g) || []).length, 3, slug + " expected three optional worked examples");
  assert.equal((page.match(/<\/details>/g) || []).length, 3, slug + " unmatched native details");
  assert.ok(page.includes('href="/learn/field-labs/"'), slug + " index missing");
  assert.ok(page.includes('course remains a curriculum outline'), slug + " availability boundary absent");
  assert.ok(page.includes("No enrolment, tests, certificates, individual assessment, or submissions."), slug + " learning boundary absent");
  assert.ok(page.includes('href="#main"') && page.includes('id="main"'), slug + " skip target broken");
  assert.ok(!/<(?:form|input|textarea)\b/i.test(page), slug + " must not collect personal data");
  assert.ok(!/(localStorage|sessionStorage|fetch\s*\(|sendBeacon\s*\()/i.test(page), slug + " unexpected script/data call");
  assert.ok(!/https?:\/\/(?:meet\.google|zoom\.us)/i.test(page), slug + " must not publish meeting links");
}
assert.ok(route.includes('href="/learn/field-labs/rules-create-possibilities/"'), "route-to-rule link missing");
assert.ok(rules.includes('href="/learn/field-labs/route-choices/"'), "rule-to-route link missing");
assert.ok(route.includes('<svg viewBox=') && route.includes("<desc "), "route illustration needs a readable text alternative");
for (const target of [
  "/learn/learn-001/field-lab/",
  "/learn/learn-002/field-lab/",
  "/learn/field-labs/route-choices/",
  "/learn/field-labs/rules-create-possibilities/"
]) assert.ok(index.includes('href="' + target + '"'), "index missing " + target);
assert.equal((index.match(/class="lab-no"/g) || []).length, 4, "four and only four learning samples");
assert.ok(first.includes('href="/learn/field-labs/rules-create-possibilities/"'), "Track 01 → Track 04 not wired");
assert.ok(second.includes('href="/learn/field-labs/route-choices/"'), "Track 02 → Track 03 not wired");
assert.ok(first.includes('href="/learn/field-labs/"') && second.includes('href="/learn/field-labs/"'), "older labs must reach the index");
assert.ok(index.includes("Nineteen remain curriculum outlines"), "index must not claim 21 available courses");
assert.ok(styles.includes("@media(max-width:660px)"), "mobile layout adjustments missing");
console.log("PASS: two four-stage scenario labs, four-card index, reciprocal connections, honest availability, no data collection, responsive styles");
