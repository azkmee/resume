# Career OS — the higher-level workflow

A personal system with one source of truth and three consumers: a **showcase site**,
an **AI resume engine**, and an **auto-apply + tracking** loop.

```
                    ┌──────────────────────────────────────┐
                    │            SOURCE OF TRUTH             │
                    │                                        │
                    │  accomplishments-log.md  ← human capture (STAR prose)
                    │  data/portfolio.json     ← AI-distilled structured layer
                    └───────────────────┬────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                                ▼
┌──────────────────┐      ┌──────────────────────────┐      ┌────────────────────────┐
│ 1. SHOWCASE SITE │      │  2. AI RESUME ENGINE     │      │ 3. AUTO-APPLY + TRACK  │
│  (CRT site)      │      │  job description in →     │      │  browser agent applies │
│  reads           │      │   • score requirements   │      │  → appends row to the  │
│  portfolio.json  │      │   • pick best wins        │      │     cloud spreadsheet  │
│  GitHub Pages    │      │   • tailored CV (PDF/HTML)│      │  → drafts outreach     │
└──────────────────┘      │   • cover note / email   │      │  (human reviews/submits)│
                          └──────────────────────────┘      └────────────────────────┘
```

## Why a structured layer

`accomplishments-log.md` is the **capture surface** — you write wins as prose, as
they happen. `data/portfolio.json` is the **structured layer** the machines read:
every achievement carries `tags`, `skills`, `metrics`, a STAR block, and
pre-drafted `resume_bullets`. The AI engine distills the log into the JSON
periodically (see "Regenerating the structured layer"). This separation means you
never hand-edit JSON, and the site + resume engine never parse prose.

## The three consumers

### 1. Showcase site (decided: extend the CRT site) — LIVE

The CRT/retro site (`site/`) is now **data-driven**. `site/work.html` fetches
`data/portfolio.json` (via `site/portfolio.js`) and renders the career timeline from
`roles` and the case-studies grid from achievements flagged `showcase: true`. Update a
win in the JSON → the page updates. No hardcoded (or fabricated) content.

**Run locally** — the browser must fetch the JSON over HTTP, so serve it:

```
python3 -m http.server 8000      # from the repo root
# open http://localhost:8000/site/work.html
```

**Offline preview** — `node tools/build-offline.mjs` writes a self-contained `dist/`
(data baked into `portfolio.js`) you can open directly with `file://`, no server needed.

**Deploy** — `.github/workflows/pages.yml` publishes `site/` (with `portfolio.json`
copied alongside) to GitHub Pages on every push to `main`. One-time setup: repo
**Settings → Pages → Source: GitHub Actions**. After that it auto-deploys.

### 2. AI resume engine

Input: a job description (pasted text or URL). Steps:

1. **Parse** the JD into required skills, responsibilities, seniority, keywords.
2. **Score** each achievement in `portfolio.json` against the JD (skill/tag overlap,
   seniority fit, metric strength).
3. **Select** the strongest, most relevant subset per role.
4. **Generate** a tailored resume reusing the CRT design language → HTML → PDF.
5. **Generate** a cover note / outreach email draft.
6. **Log** the application to the tracker (consumer 3).

See `workflow/tailor-resume.md` for the engine playbook.

### 3. Auto-apply + tracking (decided: browser agent + live cloud spreadsheet)

A browser-navigation agent ("open claw" / computer-use) that opens the posting,
fills the application form from the tailored resume + profile, and — by default —
**pauses for one-click human review before submitting** (assisted apply). Full-auto
submit is opt-in per known-good portal.

> **Reality check.** Fully autonomous apply is the riskiest piece: CAPTCHAs,
> login/2FA, portal variety (Workday/Greenhouse/Lever/Ashby differ), and several job
> boards' ToS restrict bots. We build human-in-the-loop first, harden per-portal,
> and only then offer unattended runs where it's safe and allowed.

Every run appends a row to the cloud spreadsheet (see `tracker/README.md`).

## Adding to your achievements (the capture workflow)

The whole system is only as good as what flows into it. Keep capture cheap so you
actually do it. Three entry points, in order of how often you'll use them:

1. **Quick capture (most common).** The moment something happens — a shipped feature,
   a saved fire, a mentoring win, positive feedback — drop a rough entry into
   `accomplishments-log.md` under the right role. Don't polish. Even a one-liner with
   the rough numbers beats a perfect entry you write three months late. Best triggers:
   *sprint close / AAR, 1:1s, demos, incidents, any praise you receive.*

2. **Distill (periodic — e.g. monthly, or before a job hunt).** A Claude Code session
   reads new prose in the log and updates `data/portfolio.json`: writes the STAR block,
   tags, skills, metrics, and a polished `resume_bullet`, and sets `showcase`. It also
   **flags gaps** — entries that say "quantify later" or have unverified dates — so you
   know exactly what to chase. Updates `meta.last_distilled`. This is the only thing
   that edits the JSON; you never hand-edit it.

3. **Enrich (when you have a number).** When you finally get a metric (adoption %,
   latency, headcount, $ saved), add it to the log entry and re-distill. Quantified
   results are what the resume engine ranks highest.

**What makes a strong entry** (so capture is useful, not just frequent):
- Use *"I"* and be specific about what *you* did vs. the team.
- Chase a number for the Result — `metrics worth chasing` are listed at the top of the log.
- Tag it (`backend`, `leadership`, `ai`, `architecture`, …) so the resume engine can
  match it to a job description later.
- Mark honest status: in-progress, stale, or superseded work still counts — say so.

## Regenerating the structured layer

The "distill" step above is what keeps `portfolio.json` in sync with the log. The
JSON's `meta.last_distilled` tracks freshness; if the log has newer entries, it's due.

## Roadmap

- **Phase 1 — Foundation (done):** version-control the site, build `data/portfolio.json`,
  define tracker schema + engine playbook, write this doc.
- **Phase 2 — Showcase (done):** CRT site is data-driven from `portfolio.json`; GitHub Pages deploy workflow in place.
- **Phase 3 — Resume engine:** JD-in → tailored CV + cover note out (a skill/prompt + HTML→PDF template).
- **Phase 4 — Tracker:** stand up the live cloud spreadsheet; wire the engine to append rows.
- **Phase 5 — Auto-apply:** browser agent, assisted-apply first, per-portal hardening.

## Decisions on record

- Tracker: **live cloud spreadsheet** (auto-appended each run).
- Engine: **browser-navigation agent** that helps navigate + apply (human-in-the-loop first).
- Showcase: **extend the existing CRT site**.
