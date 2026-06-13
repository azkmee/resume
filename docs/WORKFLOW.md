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

### 1. Showcase site (decided: extend the CRT site)

The existing Claude-designed CRT/retro site (`site/`) currently hardcodes each role
in `work.html`. Target state: the site fetches `data/portfolio.json` and renders
roles + achievements (`showcase: true`) from data, so updating a win in one place
updates the public page. Deploy via GitHub Pages.

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

## Regenerating the structured layer

When you add wins to `accomplishments-log.md`, run the distill step (a Claude Code
session / skill): it reads the log, updates `data/portfolio.json`, and flags entries
needing numbers or date verification. The JSON's `meta.last_distilled` tracks freshness.

## Roadmap

- **Phase 1 — Foundation (done):** version-control the site, build `data/portfolio.json`,
  define tracker schema + engine playbook, write this doc.
- **Phase 2 — Showcase:** make the CRT site data-driven from `portfolio.json`; deploy to GitHub Pages.
- **Phase 3 — Resume engine:** JD-in → tailored CV + cover note out (a skill/prompt + HTML→PDF template).
- **Phase 4 — Tracker:** stand up the live cloud spreadsheet; wire the engine to append rows.
- **Phase 5 — Auto-apply:** browser agent, assisted-apply first, per-portal hardening.

## Decisions on record

- Tracker: **live cloud spreadsheet** (auto-appended each run).
- Engine: **browser-navigation agent** that helps navigate + apply (human-in-the-loop first).
- Showcase: **extend the existing CRT site**.
