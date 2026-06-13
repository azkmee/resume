# Resume engine — playbook

Turns a job description into a tailored resume + outreach draft + a tracker row,
reading only from `data/portfolio.json`. Run this as a Claude Code session (or, later,
a packaged skill).

## Inputs

- **Job description** — pasted text or a URL (fetch and extract the JD).
- **`data/portfolio.json`** — the structured source of truth.

## Steps

1. **Parse the JD.** Extract: role title, seniority, must-have skills, nice-to-haves,
   key responsibilities, domain, and ATS keywords. Note location/remote and any
   explicit years-of-experience bar.

2. **Score achievements.** For each entry in `portfolio.json.achievements`, compute a
   0–100 relevance score from:
   - skill/tag overlap with the JD's must-haves (weighted highest),
   - seniority fit (does the achievement signal the right level?),
   - metric strength (quantified results score higher),
   - domain match.
   Record the overall `match_score` for the posting (max/weighted-average of selected).

3. **Select.** Per role, keep the top-scoring achievements (typically 3–5 for the
   current role, fewer for older ones). Prefer entries with `metrics`. Drop anything
   irrelevant to this JD — tailoring means *cutting*, not just reordering.

4. **Write bullets.** Start from each selected achievement's `resume_bullets`, then
   rephrase to mirror the JD's language and lead with the metric. Never invent
   numbers or claims not present in the source.

5. **Assemble the resume.** Header from `profile`; a summary tuned to the JD; selected
   roles/bullets; a skills section ordered to surface the JD's must-haves first.
   Render with the CRT design language → HTML → PDF (see Phase 3 template).

6. **Draft outreach.** A short cover note / recruiter email referencing 1–2 of the
   strongest matched wins and why the role fits.

7. **Log it.** Append a row to the tracker (see `tracker/README.md`) at status
   `drafted`, with `match_score`, `resume_version`, `job_url`, and a `jd_snapshot`.

## Guardrails

- **Truth only.** Every bullet must trace to an achievement in `portfolio.json`.
  Placeholders like "quantify later" are not facts — don't present them as numbers.
- **Flag, don't fabricate.** If the JD wants something not in the portfolio, surface
  the gap rather than inventing experience.
- **Tailor by subtraction.** A focused 1-page CV beats an exhaustive one.
