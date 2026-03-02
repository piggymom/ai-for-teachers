# Product Overview — AI for Teachers

*Last updated: 2026-03-01 | Based on full codebase audit*

## Product Vision

A 6-week personalized AI professional development course that teaches K-12 educators practical AI literacy through guided conversations with an AI tutor, producing one concrete, reusable classroom artifact per week.

## Target User Persona

**Primary:** K-12 classroom teachers (any subject, any grade level) who are curious about AI but don't know where to start, lack time for lengthy PD, and want practical skills — not theory.

**Secondary:** Instructional coaches and curriculum specialists looking for structured AI PD to recommend or facilitate.

**Key Traits:**
- Time-poor (20-25 min/week is the max commitment)
- Varying AI experience (from "never used it" to "I've played with ChatGPT")
- Skeptical but open — wants to see concrete classroom value
- Cares deeply about student outcomes and pedagogical integrity
- 82% of K-12 teachers feel unprepared for AI (per DOL data)

## Core Value Proposition

Every session ends with something the teacher can use Monday morning. No fluff, no slides, no generic tips.

**Guided conversation → concrete artifact → classroom-ready output.**

The key differentiator is **personalization at every layer**: Skippy (the AI tutor) knows your grade level, subjects, constraints, goals, and current understanding — and adapts every response accordingly. The product builds **capacity, not dependency** — teachers learn transferable skills they can use with any AI tool, not tricks tied to one platform.

### Why This Matters Now
- Federal mandate: DOL AI Literacy Framework (February 2026)
- Traditional PD costs $50-200/session with poor outcomes; this costs ~$5-15/teacher
- First-wave AI tools (Khanmigo, MagicSchool) create the "Ozempic problem" — capability loss when tools disappear

## Current Feature Set

### Curriculum (7 weeks: 0-6)

| Week | Topic | Artifact Produced | Key Framework |
|------|-------|-------------------|---------------|
| 0 | Getting Started | Teacher profile (5 min onboarding) | — |
| 1 | Understanding AI | "AI Understanding Card" — mental model | SOLO taxonomy diagnosis |
| 2 | Prompting Fundamentals | Prompt template using 4C Framework | Context, Constraints, Command, Criteria |
| 3 | Lesson Planning with AI | Lesson planning workflow | Iteration + Chunking |
| 4 | Feedback & Assessment | Feedback/rubric template | Calibration (anchor examples) |
| 5 | Differentiation with AI | Differentiation template | Variation (invariant before variant) |
| 6 | Integration & Ethics | Personal AI policy | Capacity demonstration (capstone) |

### Core Features

| Feature | Technology | Status |
|---------|-----------|--------|
| **Skippy AI Tutor (Text)** | Claude Sonnet 4 with 6-layer prompt composition | Live |
| **Conversation Ledger** | Async classifier, SOLO taxonomy, 4C tracking, phase state machine | Live |
| **Personalized Podcast Recaps** | Claude Sonnet (script) + OpenAI TTS-1 (audio) — two AI hosts | Live |
| **Welcome Video** | HeyGen avatar video personalized to teacher profile | Live |
| **Artifact Gallery** | Dual extraction (regex + Claude Haiku), metadata generation | Live |
| **Progress Tracking** | Hybrid API + localStorage with cross-tab sync | Live |
| **Google SSO** | NextAuth.js v4 with Prisma adapter | Live |
| **Skippy Voice Mode** | OpenAI Realtime API (WebRTC) | Disabled (feature flag) |
| **Rate Limiting** | Per-user middleware (60 msg/hr, 5 podcasts/hr) | Live |
| **Consent Management** | FERPA/privacy compliance tracking | Live |

### Conversation Intelligence (The "Moat")

- **6-layer prompt composition:** Global personality → week-specific goals → personalized opening → teacher profile → ledger state → diagnostic probe
- **Async classifier:** Post-response LLM analysis (zero latency impact) updating ledger for context-aware follow-ups
- **SOLO Taxonomy diagnosis:** Assesses teacher's understanding level (pre-structural → extended-abstract) and adapts scaffolding
- **"One Win, Then Wrap":** Pedagogical framework ensuring every session produces exactly one actionable output via DISCOVER → BUILD → REFINE → REFLECT → SAVE → BRIDGE arc
- **External testing loop:** Built-in "try this in ChatGPT/Gemini, report back" pattern — teaches independence, not dependency
- **Sticky 4C booleans:** Once a skill component is demonstrated, the ledger never unsets it (prevents classifier noise regression)
- **3-strike frustration protocol:** If teacher redirects 3 times, Skippy gracefully wraps the session

### Codebase Scale

- ~4,134 lines of pedagogical prompt content across 7 week files
- ~1,091 lines in ledger/classifier system
- ~454 lines in main Skippy API route
- ~375 lines in prompt composition logic
- ~538 lines in main chat UI component
- 21 API routes, 20+ React components
- 226-line Prisma schema (8 models)

## Tech Architecture Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.3 (App Router, Turbopack) |
| Language | TypeScript 5.9.3 |
| UI | React 19.2.3, Tailwind CSS 4, Geist Sans/Mono |
| Database | PostgreSQL (Supabase) via Prisma 5.22 ORM |
| Auth | NextAuth.js v4 (Google OAuth) |
| AI — Tutor | Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`) |
| AI — Classifier | Anthropic Claude (async, fire-and-forget) |
| AI — Artifacts | Anthropic Claude Haiku (extraction fallback) |
| AI — Podcasts | Claude Sonnet (script) + OpenAI TTS-1 (audio) |
| AI — Voice | OpenAI Realtime API (WebRTC, disabled) |
| AI — Video | HeyGen API (personalized avatar videos) |
| Hosting | Vercel (serverless) |
| Design | Light theme (Perplexity-inspired), teal accent (#20B2AA), typography-driven hierarchy |

### Key Architecture Decisions

1. **Non-streaming responses** — Full response returned at once (streaming not yet implemented; this is the #1 UX gap)
2. **Last-10-messages windowing** — Only recent messages sent to Claude to manage token costs and latency
3. **In-memory caching** — Podcast and video caches use `Map` (lost on every Vercel deploy)
4. **Hybrid progress tracking** — Server-first with localStorage fallback and cross-tab sync
5. **Per-user rate limiting** — In-memory middleware store (not suitable for multi-server)

### Data Model

```
User (NextAuth)
├── UserProfile (1:1) — role, grades, subjects, experience, constraints, goals, tone
├── Progress (1:N) — per-week status (not_started | in_progress | completed)
├── SkippyMessage (1:N) — full conversation history
├── ConversationLedger (1:N) — phase, diagnostic, 4C, engagement per week
├── Artifact (1:N) — extracted artifacts with metadata
└── Consent (1:N) — legal compliance records
```

## Deployment & Infrastructure

- **Production URL:** Deployed on Vercel (serverless)
- **Database:** Supabase PostgreSQL
- **Environment:** 7 API keys required (Anthropic, OpenAI, HeyGen, Google OAuth, Supabase, NextAuth)
- **Cost structure:** ~$5-15/teacher marginal cost (AI API calls + hosting)

## Founder Context

- **Asher Scott:** 15+ years classroom teaching, Master's from Finland, built TimeSaveAI (100+ weekly users)
- **Unique positioning:** Teacher who learned to engineer (not engineer who consulted teachers)
- **Traction:** New Visions PD delivery (full staff training, February 2026); product deployed and functional

## What's Next

See `docs/product-roadmap.md` for the prioritized development plan and `docs/pm-recommendations.md` for strategic recommendations.
