# Aetherion Batch 3 — Field, Navigation & Coordination Architecture
**Status:** Private GitHub review. **Not deployed.** No public booking, intake or event enrollment activated.
**Release branch:** `review/aetherion-batch3-field-coordination-20261114`
**Original main checkpoint:** `316fb18a2615e48eab75060a8750af8554548a81` (Batch 2 production)

## 1. What belongs where
| Surface | Unique visitor question | Experience / evidence | Handoff |
| --- | --- | --- | --- |
| Home `/` | Where do I start? | One original person/activity/environment investigation and choices | Field Lab; Discover directory; Coordination |
| Movement `/movement/` | What are the eight movement families and their meaning? | Existing 8-card Atlas + new observation bridge | `/movement/lab/` |
| Field Lab `/movement/lab/` | What happens when a task condition changes? | A **fictional**, local-only interactive comparison; observation vs inference; sensor evidence caveats | Own LearningResource canonical; `/learn/`; relevant News; Coordination |
| Learn `/learn/` | What can I safely learn now? | Existing no-account lessons plus one staged evidence pathway | Original lesson records and Field Lab |
| Classes `/classes/` | What sort of nonclinical experience might fit? | Existing 11 proposed class formats and relevant comparison | Field Lab, general coordination — not booking |
| Events and Workshops | How could a group activity become real? | Existing 6 event ideas and 72 topic catalogue, with readiness stages | Coordination, then real owner/host decision |
| Functioning and Living | What is the difference between clinical and everyday access? | Independent explanatory examples and professional boundaries | General route `/coordination/`, then authorised private channel |
| Partners and Community | How can a group proposal become an agreed pilot? | Responsible host/facilitator/consent/access model | Coordination |
| Help `/help/` | How do I ask a simple question? | Batch2 topic-based general email drafts; no personal data captured by site | Email must be sent explicitly by visitor |
| Coordination `/coordination/` | What happens after I ask? | Local enquiry preference planner and truthful lifecycle. No data stored or submitted by the site | General `mailto:` only, owner-assisted handling |
| Discover `/discover/#all-destinations` | Where is the full index? | Existing curated multi-topic directory, with **new routes inserted once** | Independent canonical pages |
| News, Journal | What is verified evidence vs interpretive writing? | Own publication routes, dates, citations and editorial standards | Links into learning, never copied as another article |
| Professional Services | Which licensed pathway applies? | Separate factual orientation, **existing noindex maintained** | General email can ask for authorised private route |

## 2. An AI secretary is an operational role, not a false online employee
The owner directs AI assistance for reviewing correspondence, drafting messages, categorising questions, checking connected Calendar, preparing reminders, organising readiness and proposing future calendar actions. The public website does **not** have a connected AI chat agent, backend, email autosender or calendar reservation API. Do not say it does.

### Safe request states and valid transitions
```
DRAFT (on visitor device, not received)
   ↓ visitor explicitly sends email
RECEIVED (verified mailbox receives a real message)
   ↓ appropriate route and consent / identity minimisation
ROUTED (owner or authorised coordinator selects next action)
   ↓ a real person, space, time zone and modality are checked
PROPOSED (preference, not a booking)
   ↓ explicit confirmation by authorised coordinator
CONFIRMED (real booked appointment or valid event invitation)
   ↓ optional agreed preparation/reminder
COMPLETED / DECLINED / NEEDS FOLLOW-UP
```
**No state beyond DRAFT is created by the static website.** A date selected by a visitor is only a preference; never label it 'available'. Clinical cases require a separate confidential professional process.

### Future workflow data model (proposal, **not deployed**)
A future coordination service, if authorised, could maintain: `request_id`, `created_at`, `channel`, `topic`, `contact_method`, `consent_scope`, `assigned_role`, `state`, `next_action`, `preferred_window`, `timezone`, `proposed_slot`, `confirmed_slot`, `meeting_provider`, `meeting_link_visibility`, `source_evidence`, `status_history`, `retention_rule`. Contact identifiers and clinical details must not go into public URLs. Create unique IDs, restricted permissions, deletion rules and logging before any backend intake. This is a specification, not a database in production.

### Request safety and privacy
- No collection of name, telephone, medical records or child-identifying details in the current website interaction.
- `mailto:` drafts open the visitor's own mail application; the user controls Send.
- AI assistance may prepare owner-approved correspondence. It is not human identity impersonation and does not guarantee a reply SLA.
- Calendar reads and creates require appropriate user instructions and checked privileges; private Google Meet links never enter public HTML.
- Explicit owner approval is required before creating public RSVP, onboarding a therapist, selling sessions, activating reminders or sending messages on behalf of Aetherion.
- Maintain professional boundaries: physical activity education and personal training ≠ licensed OT/PT.

## 3. Index and content rules
- **One canonical per original page.** Cross-discipline learning connections link to the original source, without duplicating journalism or making the same text on several pages.
- Discover retains responsibility as the broader content index; do not fork a second global index.
- The new Movement Field Lab is a **LearningResource** with an original interactive scenario. The new Coordination route is an informational **WebPage**, not an Offer, medical service or appointment provider.
- Two new route entries are included in the staged `sitemap.xml`, preserving all 111 existing entries. New total **113**. Do not merge index changes if the page scope or public-status truth changes.
- Legacy hash views remain routed by existing `assets/app.js`; do not remove them or mistake a hash route for its own independently indexed canonical.
- Prefer original lightweight editorial illustrations and no interior/founder photography. Do not invent a branded logo.

## 4. Scientific lens and learning integrity
Observation is not interpretation. The scene is fictional. A changed lighting, noise, time or route condition may help, hinder or have no measurable effect. Do not prescribe an exercise or claim clinical efficacy.
Key references to read at original sources:
- WHO International Classification of Functioning: https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health
- Original Aetherion News explainers on adolescent activity and wearables (source limitations and institutional dates retained).
- Aetherion Journal, *A Place That Invites Movement*, explicitly an interpretive essay, not an original WHO finding.

## 5. Recursive foundation gate
1. Check entire repository `index.html` inventory and active sitemap for duplicates, missing canonicals and page types; record findings and legacy gaps without silently rewriting old material.
2. Run Chromium at 390 and 1280 on 16 primary routes, plus 320/768 on both new experiences.
3. Actually change the Movement Lab controls and Coordination planner; verify updated output and mailto draft without sending anything.
4. Automated axe WCAG 2.1 A/AA for the new pages; manual keyboard, Safari/iPhone and VoiceOver remain distinct limitations.
5. Verify root hash-route isolation, original eight Movement cards, eleven class formats, six event concepts, and historical News/Journal links.
6. Confirm changed-file scope and latest `main` SHA, save rollback ref, obtain owner's exact-head approval for release; then merge and perform live hosted QA before calling it public.

**Release rule:** Build → Critique → Test → Repair → Re-test → Owner gate → Publish → Verify → Learn. Do not merge a red test or confuse a user-friendly mock-up with active appointment inventory.
