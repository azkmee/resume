# ATS review rubric

The ATS-review agent scores a rendered resume against a specific JD, as an automated
applicant-tracking-system parser would. Goal: confirm the resume parses cleanly AND
surfaces the JD's must-have keywords. Score 0–100; **pass threshold = 75**.

Score the **text extracted from the PDF** (what a parser sees), not the visual layout.

## Scoring (100 pts)

1. **Keyword coverage (40)** — must-have skills/tools/titles from the JD appear verbatim
   (exact strings ATS matches on, e.g. "Java", "Spring Boot", "REST API", "CI/CD",
   "distributed systems"). List any must-have keyword that is missing.
2. **Title & seniority alignment (10)** — headline/role language matches the posted title.
3. **Parseability (20)** — text is selectable/extractable; no critical content locked in
   images; no multi-column or table layouts that scramble reading order; standard fonts.
4. **Standard section headings (10)** — uses parser-friendly headings: Experience / Work
   Experience, Skills, Education (not cute synonyms).
5. **Contact block (10)** — name, email, phone, location, LinkedIn present and on their own
   lines near the top.
6. **Hygiene (10)** — reverse-chronological roles with dates; bullets start with action
   verbs; no headers/footers holding key info; one consistent date format.

## Output (return as structured data)

```
{ "score": <0-100>, "pass": <bool>, "missing_keywords": [..],
  "parse_risks": [..], "fix_instructions": "<concise edits to reach pass>" }
```

If `pass=false`, the resume stage regenerates using `fix_instructions` + `missing_keywords`
(max 2 iterations). **Never invent experience to add a keyword** — only add a keyword if it
is genuinely supported by `data/portfolio.json`; otherwise report it as an honest gap.
