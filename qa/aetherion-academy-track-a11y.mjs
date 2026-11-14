// Static regression guard for Aetherion Academy's accessible course index.
// Browser and native iPhone VoiceOver checks remain separate release gates.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const page = readFileSync(new URL("../learn/academy/index.html", import.meta.url), "utf8");
const seen = new Set();
const courses = [...page.matchAll(/<article class="card" id="(learn-\d+)">([\s\S]*?)<\/article>/g)];

assert.equal(courses.length, 21, "Exactly 21 course concepts must remain in the index");
for (const [, courseId, article] of courses) {
  const title = article.match(/<h3>([^<]+)<\/h3>/)?.[1];
  const accessible = article.match(/<summary aria-label="([^"]+)">Explore the ten proposed modules<\/summary>/)?.[1];
  assert.ok(title, courseId + ": missing course heading");
  assert.equal(accessible, "Explore the ten proposed modules for " + title,
    courseId + ": disclosure must be distinguishable by course name");
  assert.ok(!seen.has(accessible), courseId + ": duplicate accessible label");
  seen.add(accessible);
}

const trackSections = [...page.matchAll(/<section class="section wrap" id="academy-track-(\d\d)" data-academy-track="(\d)">/g)];
assert.equal(trackSections.length, 7, "All seven tracks must have stable deep-link IDs");
for (let i = 0; i < trackSections.length; i++) {
  assert.equal(Number(trackSections[i][1]), i + 1, "Track anchor numbering changed");
  assert.equal(Number(trackSections[i][2]), i, "Track filter mapping changed");
}
assert.match(page, /<label for="academy-track">Choose a track<\/label>/, "Labeled filter must remain");
assert.match(page, /<p id="academy-count" role="status" aria-live="polite">/, "Live result count must remain");
assert.match(page, /<a class="skip" href="#main">Skip to content<\/a>/, "Keyboard skip link must remain");
assert.doesNotMatch(page, /<form\b/i, "Academy is informational: no intake forms");
console.log("PASS: " + courses.length + " uniquely named disclosures, " + trackSections.length + " stable tracks, labeled filter, live count, skip link and no form.");
