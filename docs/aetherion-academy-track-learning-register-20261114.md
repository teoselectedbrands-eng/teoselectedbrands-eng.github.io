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
