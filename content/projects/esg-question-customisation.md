---
id: esg-question-customisation
---

## What it is

ESG data entry used to run off a **fixed question set** — every organisation saw the same
questions regardless of how relevant they were. Larger or less-applicable orgs waded through a
huge list they had no reason to answer, which made each session noisy and slow and pushed the
whole burden onto a small group of users.

This module replaced that with a **customisable model**: each org sees only the questions that
matter to it, and the data-entry work can be parcelled out to the right people inside the org
instead of landing on one person.

## Architecture

Two layers do the work. A **curation layer** lets each *asset* of an organisation own a curated
subset of questions. An **assignment layer** maps question groupings to *user groups* within the
org. Together they mean a logged-in user only ever sees the questions they're responsible for.

```mermaid
flowchart LR
    Q["Full question bank"] --> A["Asset curation<br/>per-asset subset"]
    A --> G["Group assignment<br/>question groups to user groups"]
    G --> U["Scoped view<br/>user sees only their questions"]
```

I architected the module end-to-end — the data model, the assignment layer, and the backend
that enforces scoping (APIs, persistence, and the logic that resolves a user to their visible
question set). It's the successor to the fixed-question flow; the earlier emissions
calculator work carried over, but now sits on top of a question set that's specific to the asset.

## Decisions & trade-offs

- **Per-asset subsets plus a separate group-assignment layer** — rather than one flat,
  org-wide list. This is what lets each org see only relevant questions *and* distribute the
  data-entry work. The cost is a more complex data model than a single shared question set.
- **Scoping enforced in the backend** — a user's visible set is resolved server-side, not just
  hidden in the UI, so the relevant-questions guarantee actually holds.

## Reflection

> _(Your voice — draft below, edit freely.)_

The interesting part wasn't any single endpoint; it was getting the **data model** right so that
"which questions does this person see" had one clear answer no matter how assets and groups were
arranged. Once the curation and assignment layers were clean, the APIs were straightforward.

> _Gap to fill: no numbers yet — # of orgs now on customised sets, average question-count
> reduction per session, or user feedback. Worth chasing for both the page and the resume._
