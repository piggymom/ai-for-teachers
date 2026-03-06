# Claude Code Permissions

## Autonomous Mode

You have permission to:
- Edit any file without asking
- Create new files without asking
- Run npm/npx commands without asking
- Run git commands without asking
- Install packages without asking
- Delete files if necessary (warn first, don't ask)
- Run database migrations after showing the SQL

## Working Style

- Execute plans immediately after showing them — don't wait for approval
- If something fails, try to fix it yourself before asking me
- Commit frequently with clear messages
- Only ask me when you genuinely need a decision (architecture, design tradeoffs, unclear requirements)

## Exceptions — Always Ask First

- Pushing to remote (git push)
- Anything involving production databases
- Deleting more than 5 files at once
- Changes to .env files with real credentials
- Deploying to Vercel/production

## Current Project Context

This is AI for Teachers (Skippy). Key directories:
- `app/` — Next.js App Router (pages, API routes, components)
- `lib/` — Server-side logic (prompts, ledger, profile, auth, prisma)
- `hooks/` — All React hooks (client-side)
- `scripts/data/` — Data management scripts (clear, migrate, fetch)
- `scripts/testing/` — QA validation and simulation scripts
- `scripts/debug/` — Debug loop tooling
- `scripts/presentation/` — Pitch deck builders
- `docs/` — Documentation organized by topic (architecture, product, design, ux, content, week-specs, grants, legal, pitch)
- `prisma/` — Database schema and migrations
- `reports/` — Simulation and QA reports (timestamped)
- `types/` — TypeScript type declarations

See `AGENTS.md` for the full canonical directory structure and organizer agent instructions.

When in doubt, check existing patterns in the codebase before inventing new ones.
