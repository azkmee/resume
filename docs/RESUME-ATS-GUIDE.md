# Resume formatting for AI / ATS screeners

How an automated screener reads a resume, and the rules our resume engine follows so
output parses and scores well. Sources at the bottom.

## How screeners work (3 steps)
1. **Parse** — extract structured fields (name, contact, job titles, dates, skills,
   education). Complex layouts make this fail *silently* — garbled data, low score.
2. **Score** — compare parsed profile to the job description via keyword + (increasingly)
   semantic match. Target **~65–75% keyword overlap** with the JD.
3. **Rank** — your score vs every other applicant.

~75% of resumes are auto-rejected on **formatting or keywords**, not qualifications.

## Format rules (do)
- **Single column**, reverse-chronological. (Two-column PDFs parsed ~71% of fields vs
  ~97% for single-column DOCX.)
- **Standard section headings:** Summary, Technical Skills, Professional Experience, Education.
- **Standard fonts** (Calibri, Arial, Georgia, Times). No graphics, logos, icons, photos.
- **Consistent dates:** `Apr 2025 – Apr 2026`, `Jul 2022 – May 2025`.
- **Acronym + full term once:** "Continuous Integration/Continuous Delivery (CI/CD)",
  "Large Language Model (LLM)", "Machine Learning (ML)".
- **Quantified bullets, strong action verbs**, XYZ formula: *accomplished [X], as measured
  by [Y], by doing [Z]*.
- **Mirror the JD's wording** for real skills you have.
- **One page** for <10 years' experience.

## Format rules (don't)
- No tables, text boxes, multi-column layouts, headers/footers for key info.
- Don't paste the job description in (spam filter).
- Don't hide white-text keywords (parsers strip formatting and flag it).
- No meta-commentary ("Tailored for…", honest-note blockquotes) in the resume body —
  candor belongs in the cover letter.

## File format: ship both
- **DOCX** → application portals / ATS (Workday, Taleo, iCIMS, Greenhouse, SuccessFactors
  parse Word most reliably).
- **Text-based PDF** → emailing recruiters / when layout fidelity matters.
- Always read the posting's instructions first; some specify a format.

## How we generate it
`tools/build_resume.py` builds a clean single-column **DOCX** with `python-docx`, then
LibreOffice converts it to **PDF** (`soffice --headless --convert-to pdf`). Content is the
ATS-optimized version of the per-application `resume.md`. Contact details are passed at
build time (env vars) so personal info is never committed to this public repo.

## Sources
- [Jobscan — ATS-friendly resume format (2026)](https://www.jobscan.co/blog/20-ats-friendly-resume-templates/)
- [Jobscan — Resume PDF vs Word](https://www.jobscan.co/blog/resume-pdf-vs-word/)
- [Enhancv — ATS resume examples & guide 2026](https://enhancv.com/resume-examples/ats/)
- [How to format your resume for AI screening — ORISE/ORAU](https://orise.orau.gov/internships-fellowships/blog/how-to-format-your-resume-for-ai-screening.html)
- [Simplify — XYZ resume format](https://simplify.jobs/blog/how-to-use-the-xyz-resume-format)
- [IGotAnOffer — Senior SWE resume examples (Google, Amazon)](https://igotanoffer.com/en/advice/senior-software-engineer-resume-examples)
