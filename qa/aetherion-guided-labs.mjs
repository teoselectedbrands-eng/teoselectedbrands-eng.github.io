// Read-only content and navigation invariants for Aetherion's two independent field labs.
import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const get = (p) => readFileSync(resolve(root, p), "utf8");
const cases = [
  {slug: "learn-001", title: "See Before You Explain", next: "learn-002"},
  {slug: "learn-002", title: "A Movement in Context", next: "learn-001"}
];

const ids = ["notice", "interpret", "reframe", "transfer"];
assert.ok(existsSync(resolve(root, "assets/aeth-field-labs.css")), "Scoped CSS must be present");
for (const item of cases) {
  const path = "learn/" + item.slug + "/field-lab/index.html";
  const page = get(path);
  const intro = get("learn/" + item.slug + "/index.html");
  assert.ok(page.includes("<title>" + item.title), path + ": wrong title");
  assert.ok(page.includes('rel="canonical" href="https://aetherionmovement.com/learn/' +
    item.slug + '/field-lab/"'), path + ": wrong canonical");
  assert.ok(page.includes('href="/assets/aeth-field-labs.css?v=20261114-01"'), path + ": missing CSS");
  assert.ok(intro.includes('href="/learn/' + item.slug + '/field-lab/"'), path + ": intro not connected");
  assert.ok(page.includes('href="/learn/' + item.next + '/field-lab/"'), path + ": no cross-track continuation");
  assert.ok(page.includes('<a href="/learn/' + item.slug + '/">View the ' +
    (item.slug === "learn-001" ? "observation" : "movement") +
    ' introduction ↗</a>'), path + ": wrong return link in the recommended next steps");

  const starts = [...page.matchAll(/<section class="lab-section" id="([^"]+)" aria-labelledby="([^"]+)"/g)];
  assert.deepEqual(starts.map(s => s[1]), ids, path + ": expected four steps in order");
  for (const m of starts) {
    assert.ok(page.includes('<h2 id="' + m[2] + '">'), path + ": missing labelled heading for " + m[1]);
  }
  assert.equal((page.match(/<details class="lab-answer">/g) || []).length,
    (page.match(/<\/details>/g) || []).length, path + ": disclosure must close");
  assert.ok((page.match(/<details class="lab-answer">/g) || []).length >= 3,
    path + ": show-at-will examples absent");
  assert.ok(page.includes('href="#main"') && page.includes('id="main"'), path + ": skip to content broken");
  assert.ok(!/<(form|input|textarea)\b/i.test(page), path + ": forbidden personal-data entry element");
  assert.ok(!/(localStorage|sessionStorage|fetch\s*\(|sendBeacon\s*\()/i.test(page), path + ": forbidden tracking code");
  assert.ok(page.includes("No account. No grading. No personal-data submission."),
    path + ": published learning boundaries missing");
  assert.ok(!/(you are now certified|all ten modules are complete|enrol now)/i.test(page), path + ": incorrect availability claim");
  const idsSeen = [...page.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(idsSeen.length, new Set(idsSeen).size, path + ": duplicate DOM ids");
  console.log("PASS " + path + ": four learning stages, safe disclosures, visible boundaries, linked intro, connected learning path");
}
console.log("PASS two coherent independent labs and CSS; native iPhone and live browser QA are separate release checks");
