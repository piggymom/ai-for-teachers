# MCC Decision Lab — Research Capture and Analysis

Source: https://mcc-decision-lab.replit.app/
Captured: 2026-05-10
Project surface: 11 single-mechanic professional simulations built around Middlesex Community College, Lowell MA. Built solo on Replit; LLM-generated turn events; instructor analytics dashboard behind an access code.

## Why this folder exists

The creator's pitch is that these sims give teachers a far more nuanced picture of student learning than a summative end-of-unit assessment. Their phrase: an "echocardiogram" of learning, captured through choices, pacing, and reflection rather than a final score.

This research folder evaluates that claim and the design execution against it.

## Files

- `01-learning-design-analysis.md` — Does the captured signal actually function as formative assessment? What does it measure well, what does it miss, and where does the metaphor break.
- `02-ux-ui-analysis.md` — What works visually, what's broken, what's missing to make this beautiful.
- `scenarios-reference.md` — Per-discipline content matrix: role, setting, stats, special mechanic, time horizon, sample first turn.
- `screenshots/` — Full-page screenshots across all 11 disciplines: detail card, intro overview, first turn, choice outcome, reflection break, failure state.
- `data/` — Plain-text dump of each captured screen (for grep / reference).

## Methodology

Walked the live site with Playwright (real Chromium, real UA, single registered user "Asher Research"). For each of the 11 disciplines:
1. Opened the discipline detail card
2. Read the stat overview / special mechanic intro
3. Started the simulation and captured the first turn
4. Picked the first viable choice for 5 turns
5. Captured the mid-game reflection break when it triggered
6. Captured failure state when meters crashed (only Personal Finance reached this in 5 turns)

Could not access the instructor dashboard: it is gated behind an access code I would not brute-force. Coverage of the dashboard surface comes from the JS bundle source (label and prompt strings, API endpoints, panel structure).

## Verdict snapshot

Substantive learning-design idea wrapped in a plausibly-coded prototype with shallow visual execution.

**Worth stealing**: reflection-as-mechanic (sentence starters, mid-stream prompts, replenishes a survival resource), the instructor dashboard concept (turning student decisions into a teaching artifact), the textured failure narratives, the local grounding (Lowell-specific framing throughout).

**Don't transplant the meter spine**. Eleven distinct professions all collapse into "balance four dials, don't let any crash." That homogenizes cognition that is not actually homogenous in real practice. Pattern is reusable; this specific application of it is over-uniform.

**The "echocardiogram" claim is partially true**. The system captures real signal about decision style (risk preference, stakeholder favoring, reflection depth). It does not capture conceptual understanding, transfer, or skill execution. See the learning-design analysis for the full breakdown.

**Visually it does need work**. Same dashboard chrome on every discipline, default shadcn indigo, Source Serif 4 used as UI type at all sizes. See the UX/UI analysis for the punch list.
