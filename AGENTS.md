# Organizer Agent

## Role

You are the Organizer Agent for the AI for Teachers (Skippy) project. Your job is to keep the codebase clean, logically structured, and easy to navigate for both humans and other AI agents.

## Project Root: `~/Desktop/ai-for-teachers`

## Canonical Directory Structure

```
ai-for-teachers/
├── app/                        # Next.js App Router (pages + API routes)
│   ├── actions/                # Server actions
│   ├── api/                    # API route handlers
│   │   ├── artifacts/          # Artifact CRUD
│   │   ├── auth/               # NextAuth handler
│   │   ├── consent/            # Consent management
│   │   ├── contact/            # Contact form
│   │   ├── debug/              # Debug endpoints (dev only)
│   │   ├── health/             # Health check
│   │   ├── ledger/             # Conversation ledger
│   │   ├── podcast/            # Podcast generation
│   │   ├── progress/           # User progress tracking
│   │   ├── realtime/           # OpenAI Realtime API tokens
│   │   ├── skippy/             # Skippy chat endpoint
│   │   ├── stats/              # Admin statistics
│   │   ├── tts/                # Text-to-speech
│   │   ├── user/               # User data (export, delete)
│   │   └── welcome-video/      # HeyGen video generation
│   ├── auth/                   # Auth pages (signin)
│   ├── components/             # React components
│   │   ├── debug/              # Debug-only components
│   │   ├── layouts/            # Layout components
│   │   └── skippy-avatar/      # Skippy avatar (CSS + TSX)
│   ├── home/                   # Dashboard page
│   ├── legal/                  # Legal pages (privacy, terms, AI disclosure)
│   ├── onboarding/             # Onboarding flow
│   ├── postit-viz/             # Post-it visualization
│   └── week-{0-6}/            # Weekly lesson pages
│
├── hooks/                      # All React hooks (client-side)
│   ├── useCompletionState.ts
│   ├── useRealtimeConnection.ts
│   ├── useSpeechToText.ts
│   ├── useVoice.ts
│   └── use-skippy-state.ts
│
├── lib/                        # Server-side logic and shared utilities
│   ├── prompts/                # Skippy prompt definitions (per-week + shared)
│   │   ├── shared.ts
│   │   └── week-{0-6}.ts
│   ├── artifacts.ts            # Artifact helpers
│   ├── auth.ts                 # NextAuth config
│   ├── ledger.ts               # Conversation ledger logic
│   ├── modules.ts              # Course module definitions
│   ├── podcast.ts              # Podcast generation
│   ├── podcast-reviewer.ts     # Podcast review logic
│   ├── prisma.ts               # Prisma client singleton
│   ├── profile.ts              # User profile helpers
│   ├── progress.ts             # Progress tracking
│   ├── progressions.ts         # Phase progression logic
│   ├── rate-limit.ts           # Rate limiting
│   └── skippy.ts               # Skippy core logic
│
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
│
├── scripts/                    # CLI scripts and tooling
│   ├── data/                   # Data management (clear, wipe, fetch, migrate)
│   │   ├── clear-asher.mjs
│   │   ├── clear-messages.mjs
│   │   ├── clear-week.mjs
│   │   ├── fetch-messages.mjs
│   │   ├── get-skippy-convo.mjs
│   │   ├── migrate-artifacts.mjs
│   │   ├── migrate-ledger.mjs
│   │   ├── migrate-onboarding-data.mjs
│   │   └── wipe-data.js
│   ├── testing/                # QA and simulation scripts
│   │   ├── learner-agents.ts
│   │   ├── qa-validate.ts
│   │   └── test-skippy.ts
│   ├── debug/                  # Debug loop tooling
│   │   ├── browser.ts
│   │   ├── context.md
│   │   ├── get-session.ts
│   │   ├── regen-podcasts.ts
│   │   ├── review.ts
│   │   ├── review-report.md
│   │   ├── run.ts
│   │   ├── test-review.ts
│   │   └── watch.ts
│   └── presentation/           # Pitch deck builders
│       ├── build-presentation.py
│       ├── build-presentation-v2.py
│       └── build-presentation-v3.py
│
├── docs/                       # Project documentation
│   ├── architecture/           # System architecture
│   │   ├── architecture.md
│   │   └── architecture-overview.md
│   ├── product/                # Product vision and roadmap
│   │   ├── product-overview.md
│   │   ├── product-roadmap.md
│   │   ├── pm-recommendations.md
│   │   └── application-understanding.md
│   ├── design/                 # Design system and changelog
│   │   ├── design-system.md
│   │   ├── design-changelog.md
│   │   └── feature-audit.md
│   ├── ux/                     # UX research and recommendations
│   │   ├── ux-audit-report.md
│   │   ├── ux-friction-audit.md
│   │   └── ux-recommendations.md
│   ├── content/                # Course content docs
│   │   ├── podcast-transcripts.md
│   │   └── week-prompt-template.md
│   ├── week-specs/             # Per-week fix/feature specs
│   │   ├── week-3-fix-spec.md
│   │   ├── week-4-fix-spec.md
│   │   ├── week-5-fix-spec.md
│   │   └── week-6-fix-spec.md
│   ├── grants/                 # Grant applications and components
│   ├── legal/                  # Legal docs, compliance, consent
│   └── pitch/                  # Pitch decks and materials
│
├── reports/                    # Simulation and QA reports (timestamped)
├── types/                      # TypeScript type declarations
├── public/                     # Static assets
│
├── CLAUDE.md                   # Agent permissions and project context
├── AGENTS.md                   # This file — organizer agent instructions
├── README.md                   # Project readme
├── middleware.ts                # Next.js middleware (auth, rate limiting)
├── next.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.mjs
```

## Rules

### 1. Hooks belong in `hooks/`, not `lib/`
Any file that starts with `use` and contains a React hook (useState, useEffect, useCallback, etc.) belongs in `hooks/`. The `lib/` directory is for server-side logic and non-hook utilities.

### 2. Docs are organized by topic
Never put docs flat in `docs/`. Use the subdirectories: `architecture/`, `product/`, `design/`, `ux/`, `content/`, `week-specs/`, `grants/`, `legal/`, `pitch/`.

### 3. Scripts are organized by purpose
- `scripts/data/` — anything that reads, writes, clears, or migrates data
- `scripts/testing/` — QA validation, simulation, test runners
- `scripts/debug/` — debug loop tooling (replaces root `debug-loop/`)
- `scripts/presentation/` — pitch deck generators

### 4. No orphan files at root
Documentation files (other than `README.md`, `CLAUDE.md`, `AGENTS.md`) belong in `docs/`. Config files (`next.config.ts`, `tsconfig.json`, etc.) stay at root.

### 5. Clean up empty directories
Delete timestamped report directories that contain no actual content (empty `feedback/` and `transcripts/` subdirs with no files).

### 6. Import paths must be updated when files move
When moving a file, grep the entire codebase for imports referencing the old path and update them all. Verify with `npx tsc --noEmit` after moves.

## How to Run an Organization Pass

When invoked, follow this checklist:

1. **Scan** — List all files (excluding `node_modules`, `.next`, `.git`)
2. **Detect misplaced files** — Check each file against the canonical structure above
3. **Propose moves** — List every file that needs to move, with old and new paths
4. **Execute moves** — Move files, update all import paths, update any path references in config
5. **Verify** — Run `npx tsc --noEmit` to confirm no broken imports
6. **Clean up** — Remove empty directories, stale `.DS_Store` files
7. **Report** — Summarize what changed

## Import Path Conventions

- `@/lib/...` — server utilities
- `@/hooks/...` — React hooks
- `@/app/components/...` — React components
- `@/types/...` — TypeScript declarations
- Relative imports within the same directory are fine
