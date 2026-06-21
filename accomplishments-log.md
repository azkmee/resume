# Professional Accomplishments Log — Azmi

> Living document. Capture wins as they happen — don't wait for review season.
> Format: STAR (Situation · Task · Action · Result). Always try to quantify the Result.

---

## How to add an entry (template — copy into the relevant role section)

```
### YYYY-MM-DD — [Short title, what you actually did]

**Tags:** `sprint-XX` `leadership` `backend` `java` `spring-boot` `mentorship` `process`

- **Situation:** What was the context? (system, team, customer, sprint)
- **Task:** What needed to happen and why it mattered?
- **Action:** What did *you* specifically do? (use "I", be concrete)
- **Result:** What changed? Numbers if at all possible — latency, throughput, story points, defects, retention, $, hours saved, people unblocked.

**Resume-bullet draft:** A polished one-liner you could drop into a CV.
```

**Metrics worth chasing** (steal these in your Results where they fit):
latency / p95 / throughput · # of customers or tenants impacted · uptime / incidents prevented · story points completed · review turnaround · onboarding time for new hires · cost saved · test coverage delta · defect-escape rate · # of engineers you unblocked

---

## Profile snapshot (as of 2026-05)

- **Company:** ESGpedia — Singapore (Hybrid)
- **Tenure:** 4 yrs 11 mos (Jul 2021 – Present)
- **Current title:** Software Engineering Lead (Apr 2026 – Present)
- **Domain:** ESG data & certification registry; blockchain-backed (STACS / Greenprint partnership with MAS)
- **Core stack:** Java / Spring Boot · React / Redux · AWS (Textract, RDS) · Python / Node.js · MySQL / MongoDB / Redis · Flyway · JUnit · Git · Agile
- **Education:** B.E. (Hons) Engineering Systems & Design, SUTD (2017–2020); Software & Product Development Certificate, SUTD (2021)
- **Title on most recent resume (Feb 2025):** "Full Stack Developer"

---

## Role: Software Engineering Lead — ESGpedia
*Apr 2026 – Present · Hybrid · Singapore*

### Standing scope (update as it evolves)

- **Direct reports:** 2 backend engineers, fully remote — based in Indonesia 🇮🇩 and the Philippines 🇵🇭
- **Wider oversight:** AAR (After-Action Review) lead every sprint for 5 additional backend engineers (7 backends total in scope)
- **Sprint planning:** PM defines the tickets that need work; I assign to the right engineer, estimate story points, and brief the assigned dev before pickup
- **Reporting line:** Head of Engineering
- **Wider squad context:** alongside the 7 backend engineers — multiple frontend engineers, project & product managers, and 2 data team members _(confirm exact frontend count when you get a chance)_

### Entries (newest first)

### 2026-04 — Stepped into Software Engineering Lead role

**Tags:** `promotion` `leadership` `transition`

- **Situation:** Promoted from Senior Software Engineer to Software Engineering Lead at ESGpedia, taking on direct people-management responsibility for the first time.
- **Task:** Establish a working rhythm with two new remote direct reports across two time zones (ID, PH) and take ownership of cross-team sprint AARs covering 7 backend engineers.
- **Action:**
  - Set up **biweekly 1:1s** with each direct report individually. Standard flow: open with wellbeing and working conditions, then move into performance and any blockers/issues to clarify — pacing the conversation so the human check-in happens *before* the work check-in.
  - Established an operating split with the PM during sprint planning: **PM defines** the tickets that need work → **I assign** the work to the right engineer and **estimate story points** → I **brief the assigned dev** before they pick it up.
- **Result:** Early signals from the first ~2 months as Lead:
  - **0 attrition** on the team since taking over the role — both direct reports still in seat and engaged.
  - **Longer-tenured direct report (~9 months on the team)** is now fully trained on multiple modules and operates with little day-to-day intervention — the payoff from sustained 1:1 coaching that started while I was Senior SWE and continued into the Lead transition.
  - **Newer direct report (~2 months on the team)** is in the onboarding phase, with the same biweekly 1:1 rhythm + sprint briefing flow applied from day one.

**Resume-bullet draft (combined):** *Promoted to Software Engineering Lead managing 2 remote backend engineers (Indonesia, Philippines); 0 attrition since taking over the role, with the longer-tenured direct report coached to autonomous ownership of multiple modules with minimal intervention. Own sprint planning and developer briefings with the PM, and run sprint AARs across a 7-engineer backend group.*

**Resume-bullet draft (split — better for most CVs):**
- *Promoted to Software Engineering Lead managing 2 remote backend engineers (Indonesia & Philippines); own sprint planning and developer briefings with the PM, and run sprint AARs across a 7-engineer backend group.*
- *Coached the longer-tenured direct report to autonomous ownership of multiple modules with minimal intervention; 0 attrition on the team since stepping into the Lead role.*

---

### 2026 — Redesigned sprint AAR format to lift participation in a remote team

**Tags:** `process` `aar` `team-culture` `remote-first` `leadership`

- **Situation:** Sprint AARs across the backend group followed a classic *start / stop / keep doing* template. Over time, devs weren't actively contributing — either there wasn't much pressing to say, or the friction of getting to the existing tool made it easier to skip.
- **Task:** Make AARs a venue that's actually useful for a remote-heavy team — not a meeting people endured.
- **Action:** Reworked the AAR in four concrete ways:
  1. **Moved the live document onto Microsoft Teams** instead of Confluence (which sits behind the VPN). Lower friction → higher participation and more written input ahead of the meeting.
  2. **Added an "appreciation" column** for devs to call out other devs who helped them. Surfaces cross-team support behaviour and gives a built-in motivation lever.
  3. **Added a "things to discuss" section** so the synchronous time is spent on items that actually need a conversation — not retreading the written notes.
  4. **Introduced a short game segment** every other AAR to lift the mood — important specifically because the team is distributed across SG / Indonesia / Philippines.
- **Result:** Written contributions per AAR went from **~5 bullets total → ~10–15 bullets shared across all sections** (roughly 2–3× participation). Devs now show up to the meeting with input already on the page, and the appreciation column has become a steady source of peer recognition in a fully remote setup. _(Add anything you pick up later — sentiment in 1:1s, retention, faster decisions.)_

**Resume-bullet draft:** *Redesigned sprint AAR format for a 7-engineer remote backend team — migrated the working doc out of VPN-gated Confluence into a live Teams document, introduced a peer-appreciation column and a focused "topics to discuss" section, and rotated in a light game segment to combat remote fatigue — lifting written participation from ~5 to 10–15 bullets per AAR (≈2–3× more dev input).*

---

## Role: Senior Software Engineer — ESGpedia
*Apr 2025 – Apr 2026 · Hybrid · Singapore*

### Entries (newest first)

### ~2025 — Architected ESG question-customisation module (per-asset + per-group scoping)

**Tags:** `architecture` `feature-ownership` `esg` `data-model` `access-scoping` `module-design`

> Context: this is the **next evolution** of the emissions data-entry work captured under the SWE role (on-the-fly calculator + hot-reload cache). Where that work made the existing fixed question set feel responsive, this work changed *which questions any given user actually sees*.

- **Situation:** ESG data entry used a **fixed question set** — every organisation filling in data saw the same questions regardless of how relevant those questions were to that org's reporting profile. Larger or less-applicable orgs ended up wading through a huge number of questions they had no reason to answer, which made each session noisy and slow and pushed the burden onto a small group of users.
- **Task:** Replace the fixed set with a customisable model so each org sees only the questions that matter to them — and so the data-entry work can be parcelled out to the right people inside that org rather than landing on one person.
- **Action:**
  - **Architected** the new module end-to-end — designed the data model that lets each **asset** of each organisation own a curated subset of questions, plus the assignment layer that maps question groupings to **user groups** within the org.
  - **Delivered** the implementation: backend APIs, persistence, and the scoping logic so a logged-in user only ever sees the questions they're responsible for inputting or reviewing.
  - Positioned it as the successor to the fixed-question flow — the emissions calculator + hot-reload cache work (SWE era) carried over, but now sits on top of a question set that's specific to the asset.
- **Result:**
  - Users see only the questions relevant to **their asset** and **their group**, instead of the full org-wide list — directly addressing the "way too many irrelevant questions" complaint from the previous version.
  - Data-entry workload can now be **distributed across the right people** inside each organisation rather than concentrated on one user.
  - _(quantify when you can — # of orgs now using customised question sets, average question-count reduction per session, internal/customer feedback)_

**Resume-bullet draft:** *Architected and delivered an ESG question-customisation module that replaced a fixed organisation-wide question set with per-asset curation and per-user-group assignment — so each logged-in user is shown only the questions relevant to their scope rather than the full list, removing significant noise from data entry and letting orgs distribute the work across the right people.*

---

### ~2025 — Apache Superset integration with secure S3-presigned document downloads (full-stack)

**Tags:** `full-stack` `apache-superset` `aws-s3` `presigned-urls` `bi-integration` `secure-downloads`

- **Situation:** We needed a way to surface document-backed records inside **Apache Superset** dashboards and let users **download the underlying document** directly from the table — without exposing raw S3 paths or making documents publicly addressable.
- **Task:** Build a full-stack flow that lets a Superset table row resolve to a working, time-limited download for the document it represents, while keeping the actual S3 location private behind the backend.
- **Action:**
  - **Superset side (data layer):** Integrated Apache Superset so the relevant document records show up in a table view, each row carrying the document's **UUID** rather than any S3 location.
  - **UI side:** Wired a **download button** on each row that, on click, calls the backend with the document's UUID.
  - **Backend side:** Built the endpoint that takes the UUID, resolves it to the actual S3 object, and returns a **time-limited presigned URL** rather than the raw path.
  - **UI completion:** UI uses the returned presigned URL to trigger the download directly from S3 — so the heavy object never has to flow through the backend.
- **Result:**
  - Users can download documents straight from a Superset dashboard with a single click — no manual file hunting, no shared folder access.
  - Document storage in S3 stays **private**: clients never see real S3 paths, and download links are short-lived presigned URLs.
  - Backend stays lightweight on the download path — it only hands out URLs, the actual byte transfer is S3 ↔ client.
  - _(quantify if you can — # of documents indexed in Superset, # of users with dashboard access, any drop in support requests for "where can I get this file?")_

**Resume-bullet draft:** *Built a full-stack integration between Apache Superset and S3-backed document storage — Superset surfaces records keyed by UUID, the UI's download button calls a backend endpoint that returns a short-lived S3 presigned URL, and the client streams the file directly from S3 — exposing documents to BI users without leaking S3 paths or routing large transfers through the backend.*

---

## Role: Software Engineer — ESGpedia
*Jul 2022 – May 2025 · Hybrid · Singapore · Full-time*

**Skills logged on LinkedIn:** Java, Spring Boot, +5 others _(list them out here so you have the full set)_

> Entries below are backfilled from your Feb 2025 resume. Approximate dates — refine when you remember the sprint/quarter.

### Entries

### ~2024 — On-the-fly emissions calculator + hot-reload cache

**Tags:** `backend` `performance` `cache` `async` `esg` `emissions`

> Context: the emissions feature evolved across several phases — (1) emissions varied per question, (2) then per question *and* per year, (3) then the data team owned a separate emission-factors pipeline and the backend consumed those factors. The work captured here belongs to **phase 3**.

- **Situation:** With the data team owning emission-factor processing, the app needed to recompute asset emissions whenever users edited inputs. The default path was async recalculation triggered on save, which meant users had to save *and then wait* to see how their changes moved the total.
- **Task:** Keep the async-on-save path correct, but stop forcing users to round-trip through a save just to see a number.
- **Action:**
  - Implemented **async calculation on save** so the persisted totals stay consistent with whatever the data team's emission-factor pipeline returns.
  - Built an **on-the-fly emissions calculator** that runs without persisting — users get a live, accurate preview of the total while still editing, before they commit.
  - Wired in **hot-reload caching** so when emission factors change upstream, downstream cached values can refresh without a full restart / cold cache penalty.
- **Result:** Users get instant feedback while editing instead of waiting on the save-and-recompute loop — an average of **~3 seconds saved per update** (number carried over from the Feb 2025 resume; pin down which exact phase generated it if you want to defend it in interviews). Cache hot-reload also means emission-factor updates from the data team propagate without disruptive deploys.

**Resume-bullet draft:** *Built an on-the-fly emissions calculator and hot-reload caching layer alongside the async-on-save pipeline, letting users preview totals instantly while editing instead of round-tripping through saves — saving an average of ~3 seconds per update and keeping cached values fresh when the data team's emission factors changed upstream.*

---

### ~2023 — One-week MVP for in-house OCR (AWS Textract, Python)

**Tags:** `aws-textract` `ocr` `mvp` `python` `integration-design` `poc`

- **Situation:** We needed a way to extract structured content from documents in-house, and there was no existing pattern for how the backend would consume that output cleanly.
- **Task:** Stand up a POC fast enough to validate the approach end-to-end — *and* design the integration surface so the rest of the system could rely on it.
- **Action:** Built the MVP in **Python**, wrapping **AWS Textract** behind a **custom adapter**. The hard part wasn't calling Textract — it was the POC-stage integration question: how does the backend cleanly request OCR, consume the response, and slot it into downstream processing without leaking Textract's response shape everywhere? Designed the adapter interface around that constraint.
- **Result:** Working MVP delivered in **~1 week**, with a clean adapter contract that proved the in-house pattern would work. *Current status:* this in-house pipeline is no longer maintained — OCR is now outsourced because Textract didn't cover the languages we ultimately needed to support. The POC and the integration design still stand as the part worth talking about.

**Resume-bullet draft:** *Prototyped an in-house OCR service in Python on AWS Textract within one week, designing a custom adapter interface to cleanly expose OCR results to backend consumers without coupling to vendor response shapes — validating the integration pattern before language coverage constraints moved the workload to an external provider.*

---

### ~2023 — Flyway rolled out across 4 DB connections (3 SQL + 1 MongoDB)

**Tags:** `flyway` `devops` `database` `ci-cd` `process` `migrations` `mongodb` `sql`

- **Situation:** Database schema and data changes were applied via manual patching — error-prone, inconsistent between environments, and a frequent source of deployment friction.
- **Task:** Make DB updates reproducible, tied to deployments, and auditable.
- **Action:**
  - Introduced **Flyway** starting in the **dev** environment, then progressively rolled it out so it now manages migrations across **all 4 DB connections** the codebase uses — **3 SQL databases + 1 MongoDB**.
  - Adopted Flyway's standard **versioned naming convention** so migrations are picked up automatically by version order with no per-deploy human input.
  - Wired Flyway into the **deployment pipeline** so migrations **auto-run on every deploy** to each environment.
- **Result:**
  - Manual data patching effectively eliminated across all 4 DB connections.
  - Promoting code to a new environment no longer requires a separate DB step — the migrations come along for the ride.
  - Full **version history of migrations** acts as an audit trail and rollback reference, which the team didn't have before.
  - Tangible reduction in deployment process steps and "works on staging, broken in prod" incidents.

**Resume-bullet draft:** *Rolled out Flyway from dev to all environments across 4 database connections (3 SQL + 1 MongoDB), standardising on its versioned naming convention so migrations auto-run on every deploy — eliminating manual data patching, cutting deployment steps, and producing a version-controlled audit trail of every DB change.*

---

### ~2024 — Hiring: interviewed remote backend candidates

**Tags:** `hiring` `interviewing` `leadership-signal`

- **Situation:** Team was growing and needed help vetting remote backend candidates (the same talent pipeline you'd later be managing as Lead).
- **Task:** Run technical interviews and provide hire/no-hire signals to the hiring panel.
- **Action:** Ran a **2-round interview process**:
  1. **Technical round** — live coding plus targeted technical questions to probe depth on the stack and problem-solving approach.
  2. **Follow-up questions round** — non-coding questions covering experience, working style, and fit.
  Assessed each candidate against both rounds and fed hire/no-hire signal back into the hiring decision.
- **Result:** _(still to quantify: roughly how many candidates interviewed, how many of those who got hired are still on the team)_. **Confirmed scope:** neither of the current 2 direct reports came through this interview pipeline — they were existing hires inherited / onboarded under the Lead role, so the value from this entry comes from the interview work itself, not from a "interviewed and now manage them" arc.

**Resume-bullet draft:** *Conducted 2-round technical interviews (live coding + technical Q&A, followed by behavioural Q&A) for remote backend candidates, contributing to hiring decisions and helping scale the engineering team.*

---

## Role: Software Developer Internship (PowerX Apprenticeship) — ESGpedia
*Jul 2021 – Jul 2022 · Apprenticeship*

> **Scope note:** intentionally not being backfilled with project-level detail — the SWE/Senior/Lead entries carry the resume narrative. Keeping just the historical context below for completeness.

- Part of the **PowerX Software & Development Programme** — structured industry apprenticeship.
- Contributed to ESGpedia / **STACS Network** work on the blockchain-based **Greenprint ESG Data & Certification Registry**, built in partnership with the **Monetary Authority of Singapore (MAS)**.

---

## Education

- **B.E. (Hons), Engineering Systems & Design** — Singapore University of Technology and Design (SUTD), 2017–2020
- **Software & Product Development Certificate** — Singapore University of Technology and Design (SUTD), 2021

---

## Skills inventory (keep this current)

*Baseline imported from Feb 2025 resume — add/remove as your stack evolves.*

**Languages:** Java · Python · JavaScript (Node.js)
**Client-side:** HTML · CSS · JavaScript · React · Redux
**Server-side / Frameworks:** Spring Boot · Node.js
**Data / Infra:** MySQL · MongoDB · Redis · AWS RDS · AWS (general) · AWS Textract
**DB tooling:** Flyway (migrations)
**Testing & DevOps:** JUnit · Git · Agile
**Domain:** ESG data, certification registries, blockchain (STACS / MAS Greenprint), document/OCR pipelines
**Leadership / Process:** sprint planning, story-point estimation, AAR facilitation, remote team management across SEA timezones, 1:1s, mentorship, technical interviewing

**Personal strengths (from Feb 2025 resume):**
- *Communication* — explaining technical concepts to stakeholders clearly and concisely
- *Problem solving* — debugging, optimization, finding pragmatic solutions
- *Adaptability* — picking up new tech and adjusting to shifting requirements in a fast environment

---

## Quotable wins (one-liners for elevator pitches & interviews)

- _(fill in as you go — these are gold for screening calls)_

---

## Open threads / things to capture later

- [x] ~~List the "+5 skills" hidden behind LinkedIn's collapse~~ → done from Feb 2025 resume; sync LinkedIn so the public list matches
- [~] Backfill notable Senior SWE accomplishments (Apr 2025 – Apr 2026) — 2 entries in (ESG question-customisation module + Superset/S3 full-stack integration). Confirm both are actually Senior-era (or move to SWE), and look for 1–2 more from that year (mentoring, incidents, architectural calls, any hiring you ran in this window)
- [ ] Confirm Superset/S3 entry timeframe — placed under Senior SWE as a guess; move to SWE if it actually predates the Apr 2025 promotion
- [ ] Quantify Superset/S3 entry: # of documents indexed, # of dashboard users, any audit/security wins from removing raw S3 path exposure
- [~] Backfill notable SWE accomplishments (Jul 2022 – May 2025) — all 5 entries now substantively filled (emissions calculator, documentation, OCR, Flyway, hiring format). Remaining gaps: exact sprint/dates everywhere, the exact phase that generated the "~3s saved" emissions metric, and **numbers for the hiring entry**
- [ ] Confirm exact start date of Lead role and update LinkedIn title (still shows Senior SWE)
- [x] ~~Add manager / reporting line for current role~~ — Head of Engineering
- [~] Capture team size context — done except for exact frontend headcount
- [x] ~~Quantify the AAR reformat~~ — written participation went from ~5 → ~10–15 bullets per AAR (≈2–3×). Captured. Layer in sentiment/retention signals over time.
- [x] ~~Capture a first concrete "early win" Result under the 2026-04 Lead-transition entry~~ — done: 0 attrition, longer-tenured report at autonomy on multiple modules, newer report onboarding cleanly
- [x] ~~Internship section backfill~~ — intentionally out of scope. Section now carries just historical context (PowerX, STACS/Greenprint/MAS) with a scope note.
- [ ] Decide which old SWE bullets actually happened *after* the Senior promotion (Apr 2025) and move them up — esp. interviewing remote candidates, which sounds Senior-era
- [~] Quantify the hiring entry — format captured (2 rounds: tech + Q&A); **still need numbers**: # of candidates interviewed, # hired who are still on the team. *(Current-team angle is closed: confirmed neither direct report came through this pipeline.)*
- [x] ~~Flyway entry: which environments, naming conventions, rollback~~ — fully filled in (4 DB connections: 3 SQL + 1 MongoDB; Flyway naming convention; auto-run on deploy; version history as audit trail)
- [x] ~~Confirm where the OCR MVP ended up~~ — no longer maintained; outsourced due to language coverage Textract didn't cover. Captured in entry.

---

## Review cadence

- **Every sprint close:** add 1–3 entries while the AAR is fresh.
- **Quarterly:** distill entries into 5–8 resume bullets per role.
- **Before any review / interview / promo conversation:** read this doc top to bottom.
