# Azmi
**Software Engineer — Backend / Full-Stack**
Singapore · [ email ] · [ LinkedIn ] · [ GitHub ]

*Tailored for: Senior Software Engineer (Generative AI) — Mastercard Foundry R&D, Singapore*

---

## Summary

Backend-leaning full-stack engineer with ~5 years at ESGpedia (Singapore) building
scalable **Java / Spring Boot** and **Python** services for an ESG data &
certification platform delivered in partnership with the **Monetary Authority of
Singapore**. Hands-on with **REST API design, async processing, caching, and SQL/NoSQL
data-intensive flows on AWS** — including integrating a **managed ML service (AWS
Textract) into backend pipelines** behind a clean adapter. Now lead a small remote
backend team and am running a hands-on experiment using **generative AI** to maintain
in-repo engineering documentation. Comfortable owning quality and moving fast in an
R&D-style environment.

## Core skills

- **Languages:** Java, Python, JavaScript (Node.js)
- **Backend:** Spring Boot, REST API design, microservices, async & concurrency, Node.js
- **AI/ML integration:** integrating managed ML services (AWS Textract), service adapters for model outputs; exploring generative-AI tooling
- **Data:** MySQL, MongoDB, Redis (caching), schema design, Flyway migrations, data-intensive pipelines
- **Cloud / CI-CD:** AWS (Textract, RDS, S3), migrations auto-run in deployment pipelines
- **Testing:** JUnit, unit & integration testing
- **Ways of working:** Agile/Scrum, sprint planning & estimation, code review, mentoring, distributed teams

## Experience

### Software Engineering Lead — ESGpedia, Singapore
*Apr 2026 – Present*
- Lead and mentor a remote backend team (Singapore / Indonesia / Philippines): own sprint planning and story-point estimation with the PM, run sprint after-action reviews across a 7-engineer group, and guide engineers through **code reviews and pair-designed Technical Design Documents**.
- Running a hands-on experiment using **generative AI to generate and maintain in-repo engineering documentation** — exploring how LLM-assisted tooling fits the developer workflow.
- **0 attrition** since stepping into the lead role; coached the longer-tenured engineer to autonomous ownership of multiple modules.

### Senior Software Engineer — ESGpedia, Singapore
*Apr 2025 – Apr 2026*
- Architected and delivered an ESG question-customisation module end-to-end — **data model, REST APIs, persistence, and per-asset / per-user-group access scoping** — so each user sees only the data relevant to their scope.
- Built a full-stack **Apache Superset ↔ AWS S3** integration: a backend REST endpoint that resolves document UUIDs to **short-lived S3 presigned URLs**, exposing documents to BI users without leaking storage paths or routing large transfers through the service.

### Software Engineer — ESGpedia, Singapore
*Jul 2022 – May 2025*
- Built an on-the-fly emissions calculator with **async-on-save processing and a hot-reload caching layer** for a data-intensive calculation path — giving users instant previews and saving **~3 seconds per update** while keeping cached values fresh as upstream factors changed.
- Integrated a **managed ML service (AWS Textract OCR) into backend processing** in a ~1-week MVP, designing a **custom adapter** so model outputs slotted cleanly into downstream flows without coupling to the vendor's response shape.
- Rolled out **Flyway migrations across 4 database connections (3 SQL + 1 MongoDB)**, standardizing versioned migrations to **auto-run in the deployment pipeline** — eliminating manual patching and producing a full audit trail.

### Software Developer Intern (PowerX Apprenticeship) — ESGpedia, Singapore
*Jul 2021 – Jul 2022*
- Contributed to the STACS / Greenprint ESG Data & Certification Registry (blockchain-backed, MAS partnership).

## Education

- **B.E. (Hons), Engineering Systems & Design** — Singapore University of Technology and Design (SUTD), 2017–2020
- **Software & Product Development Certificate** — SUTD, 2021
