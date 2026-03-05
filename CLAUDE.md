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
- `app/` — Next.js pages and routes
- `lib/` — Core logic (prompts, ledger, profile)
- `scripts/` — Simulation and testing scripts
- `components/` — React components

When in doubt, check existing patterns in the codebase before inventing new ones.
