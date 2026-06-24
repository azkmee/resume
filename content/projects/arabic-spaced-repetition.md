---
# This file is the long-form narrative for the `arabic-spaced-repetition` record in data/portfolio.json.
# Structured fields (title, stack, status, decisions) live in the JSON; this is the prose,
# diagrams, and reflections the project detail page renders. Pair them by `id`.
id: arabic-spaced-repetition
---

## What it is

A personal app for **actually retaining Arabic vocabulary** instead of forgetting it a week
later. New words are added by the app, scheduled for review on a **spaced-repetition** curve,
and surfaced through **Telegram** — so revision comes to a chat I already check daily rather
than an app I have to remember to open.

The twist: instead of static flashcards, it **generates fresh practice** — revision questions
and short reading passages — with an LLM, so the same word shows up in new contexts each time.

## How it works

```mermaid
flowchart LD
    A[App adds new Arabic words] --> B[(Spaced-repetition schedule)]
    B -->|word is due| C[Telegram reminder]
    C --> D[LLM generates questions + passages]
    D -->|subscription tokens| C
```

- **Word capture** — new words enter the system through the app and get a review schedule.
- **Spaced repetition** — due words are pushed for review on a spacing curve.
- **Telegram delivery** — reminders and generated practice arrive as Telegram messages.
- **LLM generation** — questions and reading passages are generated on demand.

## Decisions & trade-offs

- **Subscription tokens, not API tokens** — generation runs through an LLM **subscription plan**
  rather than pay-per-use API billing, to keep cost flat and predictable for a personal app.
  The cost: it's tied to a subscription's quota and interface rather than a clean programmatic
  API.
- **Telegram as the surface** — revision prompts go to a channel checked daily, with no
  separate app to open. The cost: bound to Telegram bot constraints.

## Status

In progress — building the core loop: add words → spaced reminders via Telegram → generated
questions and passages.

## Reflection

> _(Your voice — draft below, edit freely.)_

The interesting constraint here was **cost**: an LLM that generates fresh material every review
is what makes this better than flashcards, but per-call API billing would make daily practice
feel expensive. Routing generation through a subscription plan is the bet that keeps the habit
sustainable.
