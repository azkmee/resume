---
name: apply-job
description: Apply to one or more job postings end-to-end. For each posting it tailors an ATS-passing resume (Sonnet), reviews it with a separate ATS-scanner agent, fills the application form (Haiku) via the chrome-devtools browser MCP, tries to submit, falls back to refilling + manual click when an anti-bot wall is hit, and logs the application. Reads the applicant's details from the JOB_APPLICANT_PROFILE env file and prompts to update it when a form needs a field that's missing. Use when the user provides one or more job URLs (or pasted JDs) and wants to apply.
argument-hint: <job-url-or-JD> [more urls...]
---

# apply-job

End-to-end job applications: **tailor → ATS-review → fill → submit-or-handoff → log**, one pass per posting, fanned out across postings.

## Inputs
- **Job postings** — one or more URLs or pasted JDs (from the skill args or the user's message).
- **Applicant profile** — JSON at `$JOB_APPLICANT_PROFILE` (default `./.applicant-profile.json`, gitignored). Schema/template: [`applicant.example.json`](./applicant.example.json).
- **Resume content** — `data/portfolio.json` (the truth source; never invent beyond it).
- **Tailoring rules** — `workflow/tailor-resume.md`. **ATS rubric** — [`ats-rubric.md`](./ats-rubric.md).

## Prerequisites
- The **`chrome-devtools`** MCP server must be connected (browser automation). If its tools aren't available, tell the user to add it (`claude mcp add --scope user chrome-devtools -- npx -y chrome-devtools-mcp@latest`) and restart, then stop.
- Google Chrome installed (for headless PDF render via [`render-resume.sh`](./render-resume.sh)).

## Procedure

### 0 · Load the applicant profile
Read `$JOB_APPLICANT_PROFILE` (fallback `./.applicant-profile.json`). If neither exists, copy `applicant.example.json` to `./.applicant-profile.json`, tell the user to fill it, and stop. Validate core fields: `full_name, first_name, last_name, email, phone, location, citizenship, requires_visa_sponsorship, notice_period, linkedin`. **Any time a form later needs a field that is empty/absent in the profile, stop that form, name the exact field, and prompt the user to add it to the profile file** — never guess salary, citizenship, sponsorship, or relocation.

**Ask once per application (batch all unknowns).** Before filling, scan the *entire* form — every page/step of a multi-step flow — and collect ALL questions that can't be answered from the profile or résumé. Then prompt the user a **single time** with every unknown batched into one `AskUserQuestion` (or one message). Do **not** ask question-by-question or step-by-step. Standard COI/EEO items: answer factual ones from the profile (EEO → the profile's decline/"prefer not to say" option), and only escalate genuinely personal/legal unknowns (e.g. non-compete, relationships, expected salary). When a later step reveals a field you couldn't foresee, add it to a running list and ask it together with any others still outstanding for that application.

### 1 · Collect the postings
For each URL: open it with chrome-devtools (`navigate_page`, then `evaluate_script` to grab the JD text), or `WebFetch` for static pages. Save each JD to `tracker/jd-snapshots/<application_id>.md`. `application_id = <YYYY-MM-DD>-<company-slug>-<role-slug>`.

### 2 · Orchestrate (use the **Workflow** tool)
Invoking this skill **is** the opt-in to the Workflow tool. With **one** posting, you may run inline; with **several**, author a workflow with one pipeline per posting.

Per-posting stages:

- **Stage A — Tailor resume · `model: 'sonnet'`.** Read `data/portfolio.json` + the JD. Apply `workflow/tailor-resume.md` (truth only; tailor by *subtraction*; lead with metrics; mirror the JD's must-have keywords for ATS). Write `resumes/resume-<id>.html` (and `.md`), then render the PDF: `bash .claude/skills/apply-job/render-resume.sh resumes/resume-<id>.html`. Return the PDF path + the keyword list targeted + a 0–100 fit/match score.
- **Stage B — ATS review · `model: 'sonnet'` (separate agent acting as the ATS scanner).** Score the rendered resume's *extracted text* against the JD using `ats-rubric.md`. Return `{score, pass, missing_keywords, parse_risks, fix_instructions}`. If `pass=false` (score < 75), loop back to Stage A with the gaps (**max 2 iterations**); only proceed once it passes. Keywords may be added only if genuinely supported by `data/portfolio.json` — otherwise report as an honest gap, don't fabricate.
- **Stage C — Fill & submit · `model: 'haiku'`.** With chrome-devtools, open the application form, fill every field from the profile + resume, and upload the resume PDF. **Try to submit first.** Field-mapping notes: a **"Website" / "Portfolio"** field → `profile.website` (the GitHub Pages site); an optional **"additional documents" / "recommendation" / "supporting docs"** upload → `profile.recommendation_letter` if set (skip silently if empty); a **cover-letter** field → a short note built from the resume's strongest matched bullets. Then branch on the result:
  - **Success confirmation** → `status = applied`, set `date_applied = today`.
  - **Anti-bot wall** (reCAPTCHA, "flagged as spam", human-verification, hCaptcha, Cloudflare): do **not** retry or attempt to defeat it. Re-fill the form cleanly, leave it ready, and record `status = needs_manual_submit` with the tab URL — the user clicks Submit.
  - **Email-code verification** (e.g. Greenhouse "Security code for your application"): after the user submits, the platform may email a one-time code. If the Gmail MCP is connected, search Gmail (`from:greenhouse-mail.io OR subject:"security code" newer_than:1h`), surface the code to the user, and fill it into the code field — but let the **user** click the final resubmit (entering an email-derived code + submitting is theirs to confirm).
  - **Missing required field** not in the profile → `status = needs_profile_update:<field>`; prompt the user.
  - **Account/registration wall** (the site requires creating an account to apply, e.g. Randstad, MokaHR): **try to create the account.** Use `email` from the profile; generate a strong password and **record it** in `.applicant-secrets.json` (gitignored — create it and add to `.gitignore` if missing) under `accounts[]` with `{site, email, password, created}`. If account creation needs an **email/SMS verification code**, fetch it from Gmail (`from:(noreply OR no-reply OR verify) newer_than:15m`) and enter it. Only stop and hand off if a step truly can't be automated (e.g. phone-only OTP to the user's device, or a captcha gating registration) — then `status = needs_manual_submit` noting exactly what's left and that the password is saved in `.applicant-secrets.json`.
  - **Hidden file input** (custom dropzones where upload_file fails on the dropzone, e.g. Gem/Greenhouse): the real `<input type=file>` is `display:none`. Un-hide it via evaluate_script (`el.style.cssText='display:block;opacity:1;position:fixed;top:80px;left:10px;width:240px;height:40px;z-index:99999'; el.id='x-file'; el.setAttribute('aria-label','file input')`), re-`take_snapshot`, then `upload_file` to its new uid.
  - **Long multi-step screener** (Workday, Phenom): fill the first reachable step, then `status = needs_manual_submit` with a note on what remains.

### 2.5 · Poll for submission (3-minute loop)
For every posting left at `needs_manual_submit`, **check back every 3 minutes** to see whether the user has clicked Submit, using `ScheduleWakeup` with `delaySeconds: 180` (or the `loop` skill). On each wake-up, per pending posting:
- Re-check the application tab for a confirmation (`"Thank you for applying"`, `"Application received"`, `"/confirmation"` URL), **or** check Gmail for a confirmation email (`from:(greenhouse OR ashby OR workday OR lever) newer_than:1h`).
- Also surface any new **verification code** email that arrived (see above).
- When confirmed → flip the tracker row to `status = applied`, set `date_applied = today`, and tell the user.
- Stop looping once all pending postings are `applied` (or after a sensible cap, e.g. 5 checks / ~15 min) — then report what's still outstanding.

> **Browser concurrency caveat:** chrome-devtools drives a SINGLE shared browser. Stages A and B are pure file/LLM work → safe to run in parallel across postings. **Stage C touches the shared browser → run it serially** across postings (or give each posting its own `new_page({isolatedContext})`). Practical shape: fan out A+B in parallel, then do C one posting at a time and collect the manual-click handoffs.

### 3 · Log every application
Append a row to `tracker/applications-template.csv` per the columns in `tracker/README.md`:
`application_id, date_applied (today only if actually submitted), company, role, seniority, location, source, job_url, jd_snapshot (path from step 1), resume_version (resumes/resume-<id>.pdf), match_score, status (applied | needs_manual_submit | needs_profile_update | drafted), next_action, contact, outreach, notes, last_updated (today)`. **`notes` must record what was applied and a one-line role description.**

### 4 · Report
One block per posting: fit, ATS score, status, and the exact action needed from the user — quote each manual-click handoff ("click Submit on the <company> tab") and each profile-update prompt ("add `expected_salary` to the profile").

## Guardrails
- **Truth only.** Every resume bullet traces to `data/portfolio.json`; every form answer traces to the profile. Never invent metrics, skills, salary, citizenship, or sponsorship answers.
- **Anti-bot = hand off, never defeat.** Fill, then give the click to the user.
- **Irreversible & outward-facing.** Submitting is final. For judgment fields absent from the profile, prompt — don't assume.
- **PII.** The profile file is gitignored; never commit it or write more PII into logs than the tracker schema requires.

## Model assignment (per the request)
| Work | Model |
|------|-------|
| Resume tailoring | **Sonnet** |
| ATS review | **Sonnet** (separate agent) |
| Form filling | **Haiku** |
