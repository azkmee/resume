# UI → Collection Map

> Field-level mapping from the Claude Design prototype (`Resume Website-handoff.zip`) to the
> MongoDB collections in [`nosql-schema.md`](./nosql-schema.md).
>
> Legend:
> **`collection.field`** = stored data · _computed_ = derived at render (not stored) ·
> _static_ = design copy / layout (hardcode or move to `pages`) · ⚠️ = schema gap (see §7).

---

## 0. Global chrome (every page)

| UI element | Source |
|---|---|
| Logo `portfolio.` | `site_settings.siteTitle` |
| Nav tabs (Home/Work/Projects/Systems/About) | `site_settings.nav[]` (label, href, order) |
| Active tab highlight | _computed_ (current route) |
| Nav meta `Singapore · HH:MM SGT` | `site_settings.location.city` + `.timezone`; time is _computed_ (`data-clock`) |
| Footer LED `● Online` | `site_settings.status.available` |
| Footer `Career uptime 0d 00:00:00` | _computed_ (`data-uptime`) from earliest `experiences.startDate` |
| Footer `Built with HTML + warmth` | `site_settings.colophon.text` |
| Footer `© 2026 · say hi` | _computed_ year + `site_settings.socials` (email) |
| Theme "Tweaks" (accent / width / density / shadows) | `site_settings.theme.*` |

---

## 1. Home (`index.html`)

| UI element | Source |
|---|---|
| Hero pill `Available for interesting problems` | `site_settings.status.label` (or `profile.status`) |
| Hero headline `…a software engineer.` | `profile.headline` (multi-line styling is _static_) |
| Hero sub (ESGpedia line, "This is my logbook") | `profile.summary`; ESGpedia link → ⚠️ company URL |
| Hero actions (Read the CV / Side projects / Systems) | `site_settings.nav` / routes |
| **Snapshot** kicker `May 2026` | _computed_ (current month) |
| Snapshot · Role | `profile.currentRole.title` |
| Snapshot · Company `ESGpedia · Singapore (hybrid)` | `profile.currentRole.company` + `experiences(current).location` / `.workMode` |
| Snapshot · Tenure `4 yrs 11 mos · since Jul 2021` | _computed_ from earliest `experiences.startDate` |
| Snapshot · Domain `ESG data & certification registry` | ⚠️ `profile.domain` (not yet a field) |
| Snapshot · Stack chips | `skills` where `featured: true` |
| Snapshot · Education `B.E. (Hons)… SUTD '20` | `education` (featured / most recent) |
| Snapshot · Status | `profile.status` / `site_settings.status` |
| **What I'm doing** (`/now`) rows | `now.entries[]` (label, value, accent) |
| **Recently** feed (`latest 6`) — ts / tag / body | `feed.date` · `feed.kind`+`feed.label` · `feed.body`; limit is _computed_ |
| Directory cards (/work, /projects, /systems) | `site_settings.nav` / _static_; "3 sections" _computed_ |

---

## 2. Work (`work.html`)

| UI element | Source |
|---|---|
| Hero kicker `/var/log/career.log`, headline, sub | _static_ (or `pages` slug `work`) |
| Hero action `Download CV →` | `site_settings.cv.url` / `.mediaId` |
| **Snapshot** · Company / Title / Domain | `profile.currentRole.*` (+ ⚠️ `profile.domain`) |
| Snapshot · Tenure `Jul 2021 → Present` | _computed_ from `experiences` |
| Snapshot · Team `Cross-functional eng + product…` | `experiences(current).standingScope` / `.summary` |
| **Daily-driver stack** — Backend / Frontend / Data & cloud / Practice | `skills` grouped by `category` (the 4 design groups) |
| **Career timeline** (`6 entries`) | `experiences` + `education`, merged & sorted by date |
| ─ entry `when` `Apr 2026 → Present · current` | `experiences.startDate`/`.endDate`/`.current` |
| ─ entry `title` / `org` | `experiences.title` / `.company`+`.location` |
| ─ entry bullets | `experiences.highlights[]` |
| ─ education entries (SUTD cert, B.E.) | `education.credential` / `.institution` / years |
| timeline count `6 entries` | _computed_ (`experiences` + `education` counts) |
| **Case studies** (`4 entries · 2 awaiting`) | `case_studies` |
| ─ card `CS-01` / period | `case_studies.code` / `.period` |
| ─ card title / pitch | `case_studies.title` / `.pitch` |
| ─ meta Stack / Result / Status | `case_studies.stack[]` / `.result[]` / `.projectStatus` |
| ─ empty slots (CS-03/04) | _absent documents_ |

---

## 3. Projects (`projects.html`)

| UI element | Source |
|---|---|
| Hero kicker `/usr/bin/weekend_brain`, headline, sub | _static_ (or `pages` slug `projects`) |
| Filter chips (All / Shipped / WIP / Abandoned / Experiment) | distinct `projects.projectStatus` (UI filter) |
| Card `P-04` id | `projects.code` |
| Card name / pitch | `projects.name` / `.pitch` |
| Meta · Name | `projects.name` |
| Meta · Stack | `projects.techStack[]` |
| Meta · Shipped `2025-08` | `projects.period.end` |
| Meta · Link `github.com/you/proj` | `projects.links[]` (type `repo`) |
| Meta · Lesson | `projects.lesson` |
| Status chip `Shipped` + filter key | `projects.projectStatus` |
| Empty slots (P-01…03, 05, 06) | _absent documents_ |
| "How to add a project" panel | _static_ (authoring note) |
| Statusbar `Slots 6 · Filled 1 · Awaiting 5` | _computed_ |

---

## 4. Systems (`systems.html`)

| UI element | Source |
|---|---|
| Hero three questions (what is it / why / what would I change) | _static_ (the method frame) |
| **Method** panel (01 Observe / 02 Decompose / 03 Critique) | _static_ (or `pages` slug `systems-method`) |
| **Teardowns** list (`1 draft · 3 awaiting`) | `teardowns` |
| ─ entry num `01` | `teardowns.number` |
| ─ entry date / `Draft` badge | `teardowns.publishedAt` / `.status` |
| ─ entry title | `teardowns.title` |
| ─ entry description | `teardowns.excerpt` |
| ─ entry chips (UI / Performance / Interaction) | `teardowns.tags[]` |
| **Suggested targets** backlog | `teardowns` where `status: "idea"` |
| ─ item bold name | `teardowns.title` / `.target` |
| ─ item description | `teardowns.excerpt` |
| Statusbar counts | _computed_ |

> A teardown's structured body uses `teardowns.analysis.{observe,decompose,critique}` plus the
> rich `teardowns.body.blocks[]` (text / image / diagram / code / html) when the full write-up
> is opened.

---

## 5. About (`about.html`)

| UI element | Source |
|---|---|
| Hero kicker `finger me@local`, headline `Hi there.` | _static_ |
| Hero sub (intro paragraph) | `profile.summary` / `profile.bio` (first para) |
| **About me** long-form (3 paragraphs) | `profile.bio` |
| **What I'm doing** (`/now`) | `now.entries[]` |
| **Full stack rundown** — I reach for / Comfortable with / Working on | `skills` grouped by `affinity` (`reach_for` / `comfortable` / `working_on`) |
| **Say hi** · Email / GitHub / LinkedIn / read.cv | `site_settings.socials[]` (by platform) |
| Say hi · Status | `site_settings.status` |
| Say hi buttons (Email / GitHub / LinkedIn / Download CV) | `site_settings.socials[]` + `site_settings.cv` |
| **Colophon** (text + fonts) | `site_settings.colophon.text` / `.fonts[]` |

---

## 6. Collection → where it surfaces (reverse index)

| Collection | Appears on |
|---|---|
| `profile` | Home (hero, snapshot), Work (snapshot), About (hero, bio) |
| `now` | Home, About |
| `site_settings` | every page (nav, footer, contact, colophon, theme, CV) |
| `experiences` | Work (snapshot, timeline) |
| `education` | Home (snapshot), Work (timeline) |
| `skills` | Home (chips), Work (stack groups), About (affinity columns) |
| `accomplishments` | _none directly_ — private source for `case_studies`, `feed`, timeline bullets |
| `case_studies` | Work (case studies) |
| `projects` | Projects |
| `teardowns` | Systems (published + `idea` backlog), Home feed (referenced) |
| `feed` | Home (Recently) |
| `media` | anywhere an image/diagram/cover renders |
| `pages` | optional host for static hero/method copy |
| `blog_posts`, `testimonials` | not in this design (optional/future) |

---

## 7. Schema gaps the UI surfaced (recommended additions)

These are small fields the prototype displays that the current schema doesn't have a clean home for:

1. **`profile.domain`** — Snapshot shows `Domain: ESG data & certification registry` (Home + Work).
2. **`experiences.companyUrl`** — the ESGpedia hyperlink in heroes/snapshots.
3. **`profile.careerStart`** (or just derive) — Snapshot tenure `since Jul 2021`; can be computed
   from the earliest `experiences.startDate`, so optional.
4. **Static page copy** — hero kickers (`/var/log/career.log`), the Systems **Method** text, and the
   "How to add a project" note are currently design copy. Either hardcode them or store as `pages`
   documents (block body) if you want them editable without a deploy.

Everything else maps cleanly. Items marked _computed_ (clock, uptime, tenure, counts, "latest 6",
active nav) should stay derived at render — don't store them.
