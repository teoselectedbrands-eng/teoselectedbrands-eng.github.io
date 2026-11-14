# Aetherion Academy — Connected learning-track register

**Register:** AET-ACADEMY-TRACKS-20261114-01  
**Status:** Private curriculum / release review (not a public event, course offer, or enrolment promise)  
**Source:** Existing public `/learn/academy/` (seven tracks, 21 course concepts), existing `/learn/learn-001/` and `/learn/learn-002/`, plus the proposed guided field labs in this branch.  
**Responsibility:** Owner approves activation and publishing; editorial content and tests can develop on review branches.

## One learning architecture, not seven disconnected catalogues

**Learning unit:** An observable or fictional situation → a question → a distinction between evidence and interpretation → a deliberate change or comparison → a reflection → an optional connection to a different field.

A course may mix visual examples, plain writing, diagrams, reflective prompts, experiments on paper, and facilitated learning. Learners may move between fields; there is no mandatory linear progression or automatic score.

### Current inventory and honest availability

| Track | Three canonical course concepts | Verified public status | Next proposed learning-depth activity |
| --- | --- | --- | --- |
| 01 Observation & Interpretation | See Before You Explain; Context, Questions & Better Judgement; Patterns Without Certainty | The first title has an open introductory page. Two others are outlines. | **Proposed in this PR:** fictional evidence ledger, multiple hypotheses, revealable worked examples |
| 02 Movement Literacy | A Movement in Context; Everyday Strength as Capability; Balance, Flow & Transitions | The first title has an open introductory page. Two others are outlines. | **Proposed in this PR:** task-map and layout trade-off lab |
| 03 Place & Environment | Routes, Access & Choice; Objects That Change Activity; Public Space as a Learning Field | Three outlines only | Design a fictional route, compare thresholds and choices; no accessibility certification |
| 04 Play & Participation | Rules Create Possibilities; Groups, Roles & Shared Attention; Creative Cooperation | Three outlines only | Compare two group rules and how participation options change |
| 05 Sport & Movement Culture | Sport Beyond Competition; Rhythm, Dance & Expression; Learning How to Train | Three outlines only | Compare the same sport practice across spaces, roles and histories |
| 06 Families & Schools | Five-Minute Classroom Movement; Play at Home and Together; Educator Movement Lab | Three outlines only | Create an optional child/family/educator activity card using a fictional classroom |
| 07 Facilitation & Community | How a Workshop Works; Hosting Accessible Groups; Community Projects from Small Beginnings | Three outlines only | Design a short inclusive session, roles, transitions and review criteria |

**Counts:** 7 canonical tracks × 3 courses each = 21 concepts. 2 existing introductions; 19 further courses remain **outlines**, not completed lessons, enrolment products, attendance programmes or certificates. The two *new* guided labs in this draft enrich only those two introductions; do not silently advance the ten proposed modules to a completed course.

## Proposed connections between tracks

1. **Track 01 → Track 02:** Observe actions without reading motives; then describe purpose, objects, route, time and people.
2. **Track 02 → Track 03:** Changing a table or route may change access for other users. Consider trade-offs, not one-variable triumphs.
3. **Track 03 → Track 04:** The environment and the rules together shape how a group can participate.
4. **Track 04 → Track 05:** Explore how sport practices create roles, cultures and participation opportunities.
5. **Track 05 → Track 06:** Translate a concept into a family or school question; avoid adult programme copying.
6. **Track 06 → Track 07:** Prepare facilitators for materials, adaptation, privacy, group roles and feedback.
7. **Track 07 → Track 01:** Return field observations, uncertainties and questions to the next learning cycle.

These are editorial cross-links and future learning paths, not claims about a learner's real outcomes or certification.

## Release status by layer

| Layer | Observation or action | Status |
| --- | --- | --- |
| Existing `/learn/academy/` | 7 tracks / 21 concepts | Already public; preserve |
| Existing `/learn/learn-001/` and `/learn/learn-002/` | Two open, independent introductions | Already public; additive links proposed |
| `/learn/learn-001/field-lab/` | Four-stage evidence/inference lab | Draft on PR, **not public** |
| `/learn/learn-002/field-lab/` | Four-stage activity/context lab | Draft on PR, **not public** |
| Automated static content QA | Semantic stages, local links, no data collection, honest availability | On review branch; check exact-head GitHub Actions |
| Browser regression and real mobile rendering | Responsive layout, disclosure, actual navigation | Requires evidence before public release |
| Native iPhone VoiceOver check | Spoken names and activation on a device | **Deferred for now**; no unsupported pass claim |
| Enrolment / accounts / progress / grading / certificates | Requires separate readiness and authorization | Disabled / out of scope |

## Each future learning piece must preserve

- One concrete problem, an activity or an original fictional scenario, not just an outline.
- Observable evidence, interpretations and unknowns clearly separated.
- At least one useful question or comparison and a fair alternative interpretation.
- A plain-language explanation plus an optional revealable worked example.
- A route back to the Academy and at least one meaningful linked field.
- Accessible HTML baseline, readable mobile layout, readable offline fallback when feasible, without mandatory audio or video.
- No account, logging, health-data intake, informal child data, grading or credential promises until separately verified and approved.
- Tests inspect exact branch/SHA; merge only after explicit owner approval. Production checks happen *after* the release, and findings feed the next iteration.

## Next incremental sequence

**Batch L1:** Review the two drafted field labs. Fix only evidence-based blockers.  
**Batch L2:** Build one short grounded learning sample for Track 03 (place, routes, access) and Track 04 (play, rules, participation).  
**Batch L3:** Build linked samples for Track 05 (sport culture) and Track 06 (family/school translations).  
**Batch L4:** Build the Track 07 facilitator reflection and reuse its review loop to critique the earlier samples.

The system should not restart from scratch. Preserve accepted lessons and register evidence, then add only the next validated layer.

---

## Iteration L2 — two proposed open-field scenarios (review-only)

**Scope:** Additive expansion to the previously drafted two field labs. This changes **learning sample coverage**, not the canonical 21-course curriculum count.

| Track | Standalone scenario route | Distinction to preserve | Status |
| --- | --- | --- | --- |
| 03 · Place & Environment | `/learn/field-labs/route-choices/` | Route geometry and signage are not proof of universal accessibility or legal compliance | Draft, not published |
| 04 · Play & Participation | `/learn/field-labs/rules-create-possibilities/` | A rule can permit different contributions without guaranteeing participation outcomes | Draft, not published |

**Discovery:** `/learn/field-labs/` links all four samples, and `/learn/` gains a carefully labelled link. The first two samples now link into the new route and rule scenarios. Full lesson modules remain in development; no new course enrolment, scoring, certificate, intake, child-data submission or booking is enabled.

**Release dependency:** This is a stacked review branch based on the exact content of the PR #11 guided labs. Merge or deploy only after resolving that prerequisite and obtaining separate owner authorization for each exact candidate head. Do not treat a green source check as a substitute for preview, rendered links, responsive inspection and hosted verification.

**Editorial reasoning loop:** Observe scene → compare physical/social conditions → distinguish assumption and evidence → propose a change → identify trade-offs → define what to check → return to the next learning question.

**Future L3 (not delivered in this iteration):** one scenario each for Track 05 sport culture and Track 06 families/schools. Track 07 facilitator skills should integrate evaluation of all earlier scenarios, not become an isolated series.

---

## Iteration L3 — Sport & Movement Culture / Families & Schools (review only)

**Branch:** `review/aetherion-tracks05-06-connected-labs-20261114`  
**Dependency:** PR #12 head `51f44378a9ca2384cba55510af2373e3b583b43a`, which itself depends on PR #11. No merge, public release or operational service activation is authorized by this register.

### Two new standalone guided learning examples

| Canonical track and outline | Proposed self-paced sample route | Question and learning boundary |
| --- | --- | --- |
| Track 05, Sport Beyond Competition | `/learn/field-labs/sport-culture/` | Same fictional ball-passing activity in park, sport club and learning group: what changes when rules, institutions, roles and goals change? Counting passes does not measure inclusion, enjoyment, belonging or real-world impact |
| Track 06, Five-Minute Classroom Movement | `/learn/field-labs/classroom-choice/` | Fictional educator design sample: compare one-size-fits-all and choice-based invitations, build a five-minute paper sequence and reflect on space, timing, privacy, voluntary options and adult supervision, without claims about child development, attention or outcomes |

**Updated hub:** `/learn/field-labs/` holds six linked samples. `/learn/` points to it while explicitly stating that the samples are not complete courses.

**Canonical Academy remains unchanged:** 7 tracks × 3 course concepts = 21. Only two have public introductory pages; 19 remain curriculum outlines, including the Track 03–06 titles referenced by standalone examples. An independent lab is not enrolment, course completion, attendance, graded progress or certification.

### Learning loop joining first six tracks

Observation & Interpretation → Movement Literacy → Place & Environment → Play & Participation → Sport & Movement Culture → Families & Schools → reflective facilitation in future Track 07.

This is a navigational/editorial possibility, not a mandatory linear curriculum or claim that educational transfer has been measured.

### Review / release boundaries

- Archive the exact head and preserve individual PR layers; release only in owner-authorised order.
- Test all six routes, their canonicals, the Learn hub and back links, semantic headings, optional disclosure examples and privacy boundaries.
- Inspect real mobile rendered experience before any public release. Native VoiceOver hands-on check is deferred, but accessible HTML and noncollection checks remain in QA.
- No client, child, medical, attendance or contact information collection; no live RSVP, workshops, scheduling, invoice, payments, platform accounts, certificates or additional professional claims.

### Next development focus (future L4, not completed here)

Track 07 · How a Workshop Works: a **facilitator feedback loop** that deliberately revisits the six samples to make editorial and learning-design decisions. Keep reflective reviews, consent boundaries, accommodations and release decisions separate from enrolment and live delivery.

---

## Iteration L4 — Observation-first facilitation studio (private review)

**Authoring direction:** The facilitator is not a nonstop lecturer or a secret evaluator of people. This role combines grounded observation, terminology discipline, scenario design, group-process support, evaluation of the *design*, and revision. A creative, 10/10 observation metaphor expresses attention to more dimensions; it must not imply omniscience or a real person/automated service.

**New standalone sample:** `/learn/field-labs/facilitation-studio/` — related to canonical Track 07 `How a Workshop Works` (outline, not a complete course). New sample adds:
- **Ten observation lenses:** purpose, action, space, objects, time, sensory context, people/roles, choice, evidence, uncertainty.
- **Six steps:** observe → name → design → facilitate → evaluate → improve.
- **Twelve glossary terms:** observation, inference, hypothesis, context, affordance, facilitation, participation, accommodation, criterion, evidence, feedback loop, trade-off.
- A fictional 20-minute six-adult encounter with a paper bridge, three optional facilitation roles, clear invitation language and reflective closure.
- A print-friendly, noncollecting seven-question design review worksheet, optional revealable worked examples and links back to previous six samples.

**Updated discovery:** `/learn/field-labs/` shows seven sample routes. `/learn/` describes seven *samples*, not seven full courses. The 7 canonical tracks × 3 concepts = **21 course concepts** stays unchanged: **two public introductory pages + 19 other curriculum outlines**. All new labs are draft pages on stacked review branches until separately authorized, integrated and verified in production.

### Facilitation responsibility and evidence gates

**Observer:** Name visible action and conditions. Avoid assigning diagnoses, motives or private preferences from surface behaviour.

**Terminologist:** Keep observed / inferred / proposed / verified distinct. Terms label the *epistemic status* of a claim, not the identity of the individual.

**Scenario designer:** Specify goal, people, objects, environment, roles, optional participation routes, transitions, constraints and trade-offs; distinguish fictional activity plans from real pilots.

**Facilitator:** Make choice and understanding possible; manage timing and privacy boundaries without coercing speech or participation.

**Evaluator:** Test a bounded design question with relevant evidence, not an unannounced grade of participants.

**Improvement engineer:** Log exactly what changed in the next draft, why it changed, the new uncertainty and the next review checkpoint.

### Status and dependency

This L4 review branch is **stacked on PR #13** (Track 05/06), which depends on PR #12 then PR #11. PR #10's separate Academy screen-reader label fix remains independent and must be considered during release integration.

Review-only. Do not merge, deploy, publish, collect data, activate attendance, create paid courses, enable sign-in or issue certificates. Keep baseline semantic accessibility and privacy checks; hands-on native iPhone VoiceOver testing has been deferred by the owner for now, not passed.

### Future L5 direction, not delivered here

Build a **facilitator scenario library and decision architecture**, starting with additional cases from the seven canonical tracks: purpose, available evidence, material/resource constraints, participation modes, safeguards, and revision history. Review each exemplar as a learning design, not an individual assessment. Do not multiply catalogues without improving their actual educational depth.

---

## Iteration L5 — Scenario Library and comparative design decisions (PRIVATE REVIEW)

**Branch:** `review/aetherion-scenario-library-l5-20261115`  
**Stack dependency:** PR #14 head `31c2791a48702822ec914847b4de7c22586f2642`, built upon #13 → #12 → #11. PR #10 (screen-reader label enhancements) remains independent. New routes have not been published.

**New index:** `/learn/scenarios/`: seven fictional cases with standalone index pages at `/learn/scenarios/cases/<slug>/`; a track filter, focus filter, and side-by-side comparison with no user data collection or saved state.

**Canonical structured source:** `/learn/scenarios/scenario-register.json` is a source-controlled JSON register. It contains seven unique case IDs (SC-001 to SC-007), each mapped to one Academy track and a previously drafted linked field lab. This JSON is an editorial reference, not a registry of real patients, students, sessions, measurements, validated results or confirmed providers.

| ID | Domain | Fictional design decision |
| --- | --- | --- |
| SC-001 | Observation | Describe a doorway scene without assuming a hidden motive |
| SC-002 | Movement | Compare tote-route changes without claiming universal ease |
| SC-003 | Place | Distinguish sketched route access from measured usability |
| SC-004 | Play | Offer genuine contribution roles without reading silence as absence |
| SC-005 | Sport culture | Keep pass counts separate from inclusion or belonging |
| SC-006 | Families/schools | Analyse a voluntary five-minute classroom invitation; no children assessed |
| SC-007 | Facilitation | Design a 20-minute group question, examine choices, revise evidence claims |

### Standard field model
- **Given in fiction:** statements that the invented story provides; not observations of actual people
- **Interpretation:** a possible explanation that the case does not establish
- **Unknown:** information not present in the story
- **V1 design proposal:** an initial arrangement and constraint
- **V2 revision proposal:** an alternative design and a potential trade-off; not implemented or empirically better
- **Review criterion and evidence gate:** the question and kinds of real checks that would be needed before an actual effectiveness/access claim
- **Facilitator invitation:** a respectful example script and a link to the related previous lab and the next case

### Navigation and user privacy
The seven-case index supports filtering and two-case comparison through local JavaScript DOM updates. All seven cards remain in HTML if script execution is unavailable. `select` choices stay in current page state only; no accounts, event telemetry, analytics, storage, network submission, form controls, certificates or score. Include a back route to the source field lab and the seven-course concept Academy.

### Release/readiness gate
This is a source-draft extension, not an approval to publish. Check exact-head test scripts and browser runs, mobile layouts at 320/390/768/1280, focus/control labels, filter-count feedback, comparison consistency, working links and canonical URLs, no unintended client-side data calls, default no-JS readability, and honest non-course lab status. Native iPhone VoiceOver remains a separate deferred check, not a passed gate.

The Academy still has seven tracks, 21 course concepts, two public introductory course pages and 19 outline-only concepts. The **seven field labs and seven scenario cases** represent two different forms of draft educational content, *not* fourteen complete courses.

**Future L6 proposal, not delivered here:** facilitate private expert commentary on the case schema and add strictly documented observations only if explicit consent, evidence standards and owner approval exist; no automatic publication or personal-data collection.
