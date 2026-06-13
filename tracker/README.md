# Job-application tracker

**Decided format:** a live cloud spreadsheet (auto-appended by the AI engine each run).
This file is the **schema spec** — the column contract the engine writes to, so the
sheet stays consistent no matter who/what edits it.

`applications-template.csv` mirrors the columns and can seed a new sheet (import it),
or serve as a local fallback if the cloud sheet is unavailable.

## Columns

| # | Column | Meaning |
|---|--------|---------|
| 1 | `application_id`   | Stable id, e.g. `2026-06-13-acme-backend-lead` |
| 2 | `date_applied`     | ISO date the application was submitted |
| 3 | `company`          | Employer name |
| 4 | `role`             | Job title as posted |
| 5 | `seniority`        | IC / Senior / Lead / Manager, as inferred |
| 6 | `location`         | On-site / Hybrid / Remote + city |
| 7 | `source`           | Where found (LinkedIn, company site, referral, board) |
| 8 | `job_url`          | Link to the posting |
| 9 | `jd_snapshot`      | Link/path to saved JD text (postings disappear) |
| 10 | `resume_version`  | Which tailored CV was sent (file/link) |
| 11 | `match_score`     | Engine's 0–100 fit score for the JD |
| 12 | `status`          | `drafted` → `applied` → `screening` → `interview` → `offer` / `rejected` / `withdrawn` |
| 13 | `next_action`     | What's owed next and by when |
| 14 | `contact`         | Recruiter / hiring manager + channel |
| 15 | `outreach`        | Link to the drafted/sent cover note or email |
| 16 | `notes`           | Freeform — interview feedback, salary, etc. |
| 17 | `last_updated`    | ISO timestamp of last status change |

## Status lifecycle

```
drafted → applied → screening → interview → offer
                              ↘ rejected / withdrawn (terminal)
```

The engine creates rows at `drafted` (resume generated) and flips to `applied` once
the browser agent submits (or you confirm the assisted submit).
