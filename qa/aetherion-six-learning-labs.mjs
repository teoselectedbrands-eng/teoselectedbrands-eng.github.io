// Content-integrity and navigational regression for Academy L3 (review only).
// Complements, but does not replace, rendered mobile and real device testing.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const hub = read("learn/field-labs/index.html");
const learn = read("learn/index.html");
const register = read("docs/aetherion-academy-track-learning-register-20261114.md");
const stylesheet = read("assets/aeth-community-labs.css");
const labs = [
  {name: "Observation", path: "/learn/learn-001/field-lab/", file: "learn/learn-001/field-lab/index.html"},
  {name: "Movement", path: "/learn/learn-002/field-lab/", file: "learn/learn-002/field-lab/index.html"},
  {name: "Routes", path: "/learn/field-labs/route-choices/", file: "learn/field-labs/route-choices/index.html"},
  {name: "Rules", path: "/learn/field-labs/rules-create-possibilities/", file: "learn/field-labs/rules-create-possibilities/index.html"},
  {name: "Sport", path: "/learn/field-labs/sport-culture/", file: "learn/field-labs/sport-culture/index.html"},
  {name: "Classroom", path: "/learn/field-labs/classroom-choice/", file: "learn/field-labs/classroom-choice/index.html"}
];

assert.equal((hub.match(/class="lab-no"/g) || []).length, 6, "Hub must contain exactly six independently described samples");
assert.match(hub, /Nineteen remain curriculum outlines/, "Do not misrepresent the 19 incomplete courses");
assert.match(hub, /not six completed courses/, "Six samples are not complete courses");
assert.match(learn, /Explore six guided learning samples/, "The Learn page must use the current count");
assert.ok(learn.includes('href="/learn/field-labs/"'), "Learn landing must link to the hub");
assert.match(register, /Iteration L3/, "Document this learning iteration");
assert.match(register, /future L4/i, "Keep Track 07 planning distinct");
assert.match(stylesheet, /@media\(max-width:760px\)/, "Small-screen layout adjustment missing");

for (const lab of labs) {
  assert.ok(hub.includes('href="' + lab.path + '"'), "Hub missing " + lab.name);
  const p = read(lab.file);
  assert.ok(p.includes('href="https://aetherionmovement.com' + lab.path + '"'),
    lab.name + ": missing/corrupt canonical");
  assert.ok(p.includes('href="#main"') && p.includes('id="main"'),
    lab.name + ": skip link target missing");
  assert.ok(!/<(?:form|input|textarea)\b/i.test(p), lab.name + ": forbidden data capture");
  assert.ok(!/(localStorage|sessionStorage|sendBeacon\s*\(|fetch\s*\()/i.test(p),
    lab.name + ": unexpected client-side storage or network request");
  const ids = [...p.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(new Set(ids).size, ids.length, lab.name + ": duplicate IDs");
  assert.ok(p.includes('href="/learn/field-labs/"'), lab.name + ": no return route to hub");
}

for (const [label, slug] of [["Sport", "sport-culture"], ["Classroom", "classroom-choice"]]) {
  const p = read("learn/field-labs/" + slug + "/index.html");
  const found = [...p.matchAll(/<section class="lab-section" id="([^"]+)" aria-labelledby="([^"]+)"/g)];
  assert.deepEqual(found.map(x => x[1]), ["notice", "compare", "question", "redesign"],
    label + ": four learning steps expected");
  assert.ok(found.every(x => p.includes('<h2 id="' + x[2] + '">')),
    label + ": every learning section needs its heading");
  assert.equal((p.match(/<details class="lab-answer">/g) || []).length, 3,
    label + ": three optional worked examples required");
  assert.equal((p.match(/<\/details>/g) || []).length, 3,
    label + ": native details must close");
  assert.ok(p.includes('href="/assets/aeth-community-labs.css?v=20261114-01"'),
    label + ": responsive CSS missing");
  assert.ok(p.includes("course") && (p.includes("outline") || p.includes("curriculum")),
    label + ": do not claim a completed course");
}
const sport = read("learn/field-labs/sport-culture/index.html");
const classroom = read("learn/field-labs/classroom-choice/index.html");
assert.equal((sport.match(/class="culture-card"/g) || []).length, 3,
  "Sport comparison must include park, club and learning-group contexts");
assert.match(sport, /scoreboard miss/i, "Sport field lab must ask about what counting misses");
assert.ok(sport.includes('href="/learn/field-labs/classroom-choice/"'), "Sport-to-school link missing");
assert.equal((classroom.match(/class="culture-stage"/g) || []).length, 5,
  "Classroom example must describe exactly five one-minute time boxes");
assert.match(classroom, /not a physical prescription/i, "School learning boundary missing");
assert.match(classroom, /without public pressure/i, "Choice must not become coercion");
assert.ok(classroom.includes('href="/learn/field-labs/sport-culture/"'), "School-to-sport link missing");

for (const slug of ["rules-create-possibilities", "route-choices"]) {
  const p = read("learn/field-labs/" + slug + "/index.html");
  assert.ok(p.includes('href="/learn/field-labs/sport-culture/"'),
    "Previous learning path " + slug + " must connect to sport culture");
}

console.log("PASS: 6/6 connected lab routes, new Track 05/06 content, five-minute plan, unique IDs, privacy boundaries and honest curriculum status");
