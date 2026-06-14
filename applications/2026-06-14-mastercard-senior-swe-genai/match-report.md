# Match report — Mastercard Senior SWE (Generative AI), Foundry R&D

**Overall fit: ~82/100 — strong apply.** Core backend/Java/Python/AWS/API/data/CI-CD
requirements are squarely met. The stretch is *direct production generative-AI* work
(LLMs, prompt engineering, vector DBs) — which the JD lists mostly as **preferred**,
and requires only **basic** AI exposure, which you have.

## Strong matches (backed by your log)
| JD requirement | Your evidence |
|---|---|
| 5+ yrs backend, Java (Spring Boot) / Python | ~5 yrs at ESGpedia, Java/Spring + Python |
| Scalable microservices & REST APIs | ESG question-customisation module; Superset/S3 endpoint |
| AI/ML integration (pre-trained models, external APIs) | **AWS Textract (managed ML/OCR) integrated behind a custom adapter** |
| Caching, async, data-intensive flows | emissions calculator: async-on-save + hot-reload cache, ~3s saved |
| SQL + NoSQL, schema design, migrations | MySQL/MongoDB/Redis; Flyway across 4 DB connections |
| Cloud (AWS) + CI/CD | AWS Textract/RDS/S3; migrations auto-run in deploy pipeline |
| Testing | JUnit, unit + integration |
| Auth / secure data access | S3 presigned-URL flow; per-group access scoping |
| Agile, distributed teams, mentoring, code review | Lead role: sprint planning/AAR, pair-design TDDs, mentoring |
| GenAI curiosity / self-driven learning | in-repo AI documentation experiment |
| Payments/finance domain (preferred) | ESG registry built with **MAS** (financial regulator), STACS/Greenprint |

## Gaps — flag honestly, don't fabricate
- **Production GenAI (LLMs, prompt engineering, transformers, vector DBs)** — *preferred.* Your closest real evidence: integrating a managed ML service (Textract) + the GenAI documentation experiment. Do **not** claim LLM/prompt-engineering production work you haven't done.
- **Go / FastAPI** — you have 2 of the 3 listed languages (Java, Python); no Go. Fine, not required.
- **Kubernetes / Terraform / serverless / IaC** — *preferred DevOps.* You have CI/CD + AWS but no logged K8s/Terraform.
- **Message queues / API gateways** — listed under microservices; not in your log. Don't claim.
- **Monitoring / APM tools** — JD wants APM; your log shows logging/diagnosis but no named APM tool. Left understated on purpose.

## To strengthen this application
1. **A small GenAI side project** (call an LLM/OpenAI API, a tiny RAG/embeddings demo) would convert the biggest "preferred" gap into a real bullet — and the JD explicitly values personal projects.
2. Confirm/add any **message-queue, container, or monitoring** experience from work not yet captured in the log.
3. Fill in real **contact details** (left as placeholders in the resume).
