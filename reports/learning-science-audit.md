# Learning Science Architecture Audit Report

**Date:** 2026-03-02
**Scope:** Verify all learning science fixes have landed in codebase
**Status:** PASS — All critical fixes confirmed in place

---

## Summary Table

| # | Fix Category | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Progressions.ts alignment | 7 weeks (0-6), correct topics, 5 SOLO levels each | All 7 weeks present, correct topics, 5 levels each | **PASS** |
| 2 | Worked example dialogues | Weeks 1-6 have `WEEK_N_EXAMPLES` with 5 levels + getter function | All 6 weeks confirmed | **PASS** |
| 3 | Example injection in ledger | `getWeekExample()` dispatches to week-specific functions, injected via `formatLedgerForPrompt()` | Confirmed at ledger.ts:267-277 (dispatch) and 437-441 (injection) | **PASS** |
| 4 | Prior-week callbacks | Weeks 3-6 reference skills from earlier weeks | All confirmed (see details below) | **PASS** |
| 5 | Capacity checks | Weeks 3-6 have capacity verification before BRIDGE | All confirmed | **PASS** |
| 6 | Week 6 structure | Thinking-based BUILD, STRESS-TEST phase, follow-up trees, capacity demo | All confirmed | **PASS** |
| 7 | Documentation | `docs/` directory with fix specs | No docs/ directory exists | **FAIL** |

**Overall: 6/7 PASS.** The only gap is documentation files, which are non-blocking for pilot testing.

---

## 1. Progressions.ts Alignment

**File:** `lib/progressions.ts`

| Week | Expected Topic | Actual Topic | 5 Levels | Diagnostic Probe |
|------|---|---|---|---|
| 0 | Getting Started | Getting Started | Yes | Yes |
| 1 | Understanding AI | Understanding AI in Teaching | Yes | Yes |
| 2 | Prompting Fundamentals | Prompting Fundamentals | Yes | Yes |
| 3 | Lesson Planning with AI | Lesson Planning with AI | Yes | Yes |
| 4 | Feedback & Assessment | Feedback & Assessment | Yes | Yes |
| 5 | Differentiation with AI | Differentiation with AI | Yes | Yes |
| 6 | Integration & Ethics | Integration & Ethics | Yes | Yes |

**Key verification:** Week 5 is correctly "Differentiation with AI" (NOT the old "Communication & Admin"). All 5 SOLO levels present for every week: pre-structural, unistructural, multistructural, relational, extended-abstract.

**PASS**

---

## 2. Worked Example Dialogues

Each week 1-6 has:
- A `WEEK_N_EXAMPLES` record mapping level names to example dialogue strings
- Short-form aliases (uni, multi, rel, ext)
- A `getWeekNExample(level)` function with fallback to pre-structural

| Week | File | EXAMPLES Line | Getter Function | All 5 Levels |
|------|------|---|---|---|
| 1 | `lib/prompts/week-1.ts` | Line 325 | `getWeek1Example()` line 500 | Yes |
| 2 | `lib/prompts/week-2.ts` | Line 446 | `getWeek2Example()` line 692 | Yes |
| 3 | `lib/prompts/week-3.ts` | Line 348 | `getWeek3Example()` line 621 | Yes |
| 4 | `lib/prompts/week-4.ts` | Line 366 | `getWeek4Example()` line 626 | Yes |
| 5 | `lib/prompts/week-5.ts` | Line 408 | `getWeek5Example()` line 652 | Yes |
| 6 | `lib/prompts/week-6.ts` | Line 424 | `getWeek6Example()` line 685 | Yes |

Week 0 intentionally has no worked examples (onboarding/profile-building only).

**PASS**

---

## 3. Example Injection in Ledger

**File:** `lib/ledger.ts`

**Dispatch function** (lines 267-277):
```typescript
function getWeekExample(weekNumber: number, level: string): string {
  switch (weekNumber) {
    case 1: return getWeek1Example(level);
    case 2: return getWeek2Example(level);
    case 3: return getWeek3Example(level);
    case 4: return getWeek4Example(level);
    case 5: return getWeek5Example(level);
    case 6: return getWeek6Example(level);
    default: return '';
  }
}
```

**Called in `formatLedgerForPrompt()`** (lines 289-291):
```typescript
const exampleDialogue = ledger.diagnostic.level
  ? getWeekExample(ledger.weekNumber, ledger.diagnostic.level)
  : '';
```

**Injected into prompt** (lines 437-441):
```typescript
${exampleDialogue ? `
---

${exampleDialogue}
` : ''}
```

Examples are injected AFTER the `</conversation_state>` block, separated by `---`. If no level is diagnosed yet, no example is injected. Week 0 returns empty string (correct).

**PASS**

---

## 4. Prior-Week Callbacks

### Week 3 (`lib/prompts/week-3.ts`)
- Line 10: "This week builds on the 4C prompting skills from Week 2"
- Examples reference 4C throughout dialogue
- **Skills referenced:** 4C Framework (Week 2)

### Week 4 (`lib/prompts/week-4.ts`)
- Line 89: "You learned to iterate and chunk in Week 3"
- Line 116: "This is REVIEW — they learned 4C in Week 2 and applied it in Week 3"
- Examples reference "iteration move from Week 3" (lines 424, 451, 488)
- **Skills referenced:** 4C (Week 2), Iteration/Chunking (Week 3)

### Week 5 (`lib/prompts/week-5.ts`)
- Line 86: "Your 4C skills structure the prompt. Your iteration skills from Week 3... Your calibration skills from Week 4"
- Line 184: "Remember calibration? Add per-version quality anchors"
- Examples reference "iteration from Week 3", "calibration from Week 4" throughout
- **Skills referenced:** 4C (Week 2), Iteration (Week 3), Calibration (Week 4)

### Week 6 (`lib/prompts/week-6.ts`)
- Lines 58-62: Explicit "Prior-Week Skills" section listing all four:
  - Week 2: 4C Framework
  - Week 3: Iteration
  - Week 4: Calibration
  - Week 5: Invariant Dimensions
- Examples reference all prior weeks extensively
- **Skills referenced:** All (Weeks 2-5)

**Cumulative skill chain is intact:** 4C → Iteration → Calibration → Invariant Dimensions → Integration.

**PASS**

---

## 5. Capacity Checks

| Week | Location | Check Type |
|------|----------|------------|
| 3 | `week-3.ts` line 319 | "Capacity Check (Before BRIDGE)" — 3 verification questions about iteration independence |
| 4 | `week-4.ts` line 221 | "Capacity Check (before BRIDGE)" — verification of calibration skill transfer |
| 5 | `week-5.ts` line 248 | "Capacity Check (before BRIDGE)" — verification of variation/invariant dimension understanding |
| 6 | `week-6.ts` REFLECT phase | Capacity demonstration via follow-up trees + "What's shifted since Week 1?" |

Weeks 0-2 intentionally have no capacity checks (onboarding/foundational skills).

**PASS**

---

## 6. Week 6 Specific Fixes

### 6a. Thinking-Based BUILD Phase
BUILD is structured as a 4-step "thinking" process (not output-heavy):
1. **Skill Integration** — Which skills am I combining?
2. **Principles** — What principles emerged?
3. **Student-Facing** — What does this look like for students?
4. **One Sentence** — Capture the core of your policy

### 6b. STRESS-TEST Phase
- `week-6.ts` line 181: "Phase 3: STRESS-TEST (2-3 exchanges) — Policy Pressure Test"
- Line 376: "STRESS-TEST → REFINE (ledger) — repurposed for policy pressure-testing"
- Correctly maps to REFINE in the ledger system

### 6c. Follow-Up Trees
- Lines 222, 230, 238: Three follow-up trees in STRESS-TEST for different scenarios
- Each scenario branches based on teacher's response sophistication

### 6d. Capacity Demonstration
- REFLECT phase includes "What's shifted in how you think about AI since Week 1?"
- Follow-up trees in STRESS-TEST probe depth of reasoning

### 6e. Prior-Week Skill References
- Explicit "Prior-Week Skills" reference block (lines 58-62)
- Level-specific guidance includes skill callbacks (e.g., line 119: pre/uni teachers get prompted "In Week 3, you built a lesson planning template")
- Examples reference invariant dimensions from Week 5 (line 195)

### 6f. Ethics Integration
- Line 268: "Ethics emerge through BUILD and STRESS-TEST, not through a static list"
- Line 275: Bias awareness surfaces in STRESS-TEST Scenario 4
- Line 279: AI disclosure surfaces in STRESS-TEST Scenario 2

**PASS**

---

## 7. Documentation

**Expected:** `docs/` directory containing:
- `week-prompt-template.md`
- `week-3-fix-spec.md`
- `week-4-fix-spec.md`
- `week-5-fix-spec.md`
- `week-6-fix-spec.md`

**Actual:** No `docs/` directory exists.

**Impact:** Non-blocking for pilot testing. The fix specifications are effectively encoded in the prompt files themselves, which are well-commented. Documentation would be valuable for onboarding collaborators or external reviewers.

**FAIL** (non-blocking)

---

## Additional Observations

### Week 2 Extras
`week-2.ts` includes additional learning science infrastructure not in the original audit checklist:
- `WEEK_2_INSIGHTS` — insight patterns for injection
- `WEEK_2_MISCONCEPTIONS` — common misconceptions with correction strategies
- `formatInsightsForInjection()` and `formatMisconceptionForInjection()` functions
- These are handled specially in `ledger.ts` (misconceptions section, lines 293+)

### Ledger Integration Quality
The ledger system (`lib/ledger.ts`) cleanly integrates all the learning science components:
- Level-specific behavioral guidance via `getLevelBehaviors()`
- Phase-specific guidance via `getPhaseGuidance()`
- Week-specific example dialogues via `getWeekExample()`
- Week 2 misconception handling
- 4C status tracking
- Artifact tracking

### Type Safety
All SOLO levels use the `ReadinessLevel` type from `progressions.ts`. The `WEEK_N_EXAMPLES` records use string keys with short-form aliases for flexibility.

---

## Recommendation

**The learning science architecture is in place. Proceed with pilot testing.**

The single failure (missing documentation) is non-blocking. All functional components — progressions, worked examples, example injection, prior-week callbacks, capacity checks, and Week 6 capstone structure — are implemented and wired together through the ledger system.

If documentation is desired before pilot, it can be generated from the existing well-commented source files.
