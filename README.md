# Career OS

A personal system for managing my career: capture accomplishments once, then use them
to power a public showcase, generate tailored resumes, and apply for jobs — with every
application tracked.

See **[`docs/WORKFLOW.md`](./docs/WORKFLOW.md)** for the full design and roadmap.

## Layout

| Path | What it is |
|------|------------|
| [`accomplishments-log.md`](./accomplishments-log.md) | **Capture surface** — STAR-format wins in prose (human-edited). |
| [`data/portfolio.json`](./data/portfolio.json) | **Structured layer** — AI-distilled; read by the site and the resume engine. |
| [`site/`](./site/) | The Claude-designed CRT/retro showcase site (HTML/CSS/JS). |
| [`workflow/`](./workflow/) | The AI resume engine playbook. |
| [`tracker/`](./tracker/) | Job-application tracker schema + CSV template. |
| [`docs/WORKFLOW.md`](./docs/WORKFLOW.md) | Architecture and roadmap. |

## Conventions

- Accomplishment entries follow **Situation · Task · Action · Result**; quantify results.
- Capture wins as they happen — don't wait for review season.
- `accomplishments-log.md` is hand-written; `data/portfolio.json` is regenerated from it
  (see "Regenerating the structured layer" in the workflow doc) — don't hand-edit the JSON.
