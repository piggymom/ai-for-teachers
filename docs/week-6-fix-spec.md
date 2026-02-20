# Week 6 Comprehensive Fix: Integration & Ethics (Capstone)

## Overview

Week 6 is the capstone — the teacher DEMONSTRATES capacity, not just receives instruction. The original version was a questionnaire: sequential questions about AI policy that produced a checklist, not a coherent position. No worked examples, no skill integration, no pressure-testing, no capacity demonstration.

The capstone tests whether the course WORKED. The fix transforms it from fill-in-the-blank policy writing to genuine synthesis through thinking.

## Fix 0: Correct Progressions Mismatch

In lib/progressions.ts, Week 6 was "Building Your Practice" with generic descriptors.

Update to match actual capstone content:
```typescript
{
  week: 6,
  topic: "Integration & Ethics",
  diagnosticProbe: "As you think about using AI in your teaching going forward, what principles guide your decisions about when to use it and when not to?",
  levels: {
    "pre-structural": "Wants to use AI but can't articulate guiding principles; decisions feel ad hoc",
    "unistructural": "Can name ONE principle (e.g., 'always check the output') but applies it mechanically without nuance",
    "multistructural": "Can list multiple principles and practices; has a mental checklist but doesn't see how they connect",
    "relational": "Articulates how principles interact; can reason through tradeoffs; sees policy as a coherent system",
    "extended-abstract": "Reasons about systemic implications; considers student AI literacy; ready to help colleagues develop their own frameworks"
  }
}
```

## Fix 1: Add Worked Example Dialogues

Create WEEK_6_EXAMPLES with 5 level-specific dialogues showing Skippy guiding policy THINKING at each SOLO level.

### Pre-structural Example

**Context:** Overwhelmed teacher who liked the course but doesn't remember everything. Has tried lesson planning with 4C.

Show:
- Skippy connects to specific course skills (Week 3 template)
- Building policy from one concrete workflow outward
- Privacy as the first principle (student names)
- "Relationships stay human" — deriving principles, not listing rules
- Student-facing for 3rd graders: "Check before you trust"
- One sentence synthesis
- Stress test: school blocks ChatGPT — "The skill transfers. Tools don't."
- Capacity test: teacher walks through 4C diagnostic without help
- Concrete next step

### Unistructural Example

**Context:** Teacher who uses 4C regularly for lesson planning. Tried feedback once but tone was off.

Show:
- Building on established 4C practice
- Connecting to calibration (Week 4) for the feedback gap
- "AI advises, I decide" — especially for high-stakes
- Student-facing: critical evaluation ("Show them something AI got wrong")
- Transparency principle: honest about tools, confident about judgment
- Stress test: parent asks about AI in report cards
- Capacity test: diagnostic process (context → constraints → calibration)

### Multistructural Example

**Context:** Teacher with full toolkit (4C, iteration, calibration, invariant dimensions) but using each for separate tasks without seeing connections.

Show:
- Revealing the unifying principle: "Specificity enables judgment"
- "AI handles content, humans handle people" boundary
- Student-facing connected to discipline (biology → evidence evaluation)
- Dependency question: "The scientific thinking can't change"
- Stress test: colleague catches AI simplifying analysis (connects to Week 5)
- Capacity test: complete 4C diagnostic process
- Teaching others: 2-minute version for colleagues

### Relational Example

**Context:** 12-year veteran who sees AI as requiring clarity about values. Week 5 was the turning point.

Show:
- Principle shift, not skill gain: "clear about what I value"
- Invariant dimensions as meta-principle across all workflows
- Tradeoff reasoning: "The moment I stop thinking is the moment to stop"
- Student-facing: history unit where students evaluate AI arguments
- Dependency reasoning: "writing support is access, the thinking is theirs"
- Stress test: parent says department is "making students dependent"
- Equity scenario: designing intervention from principle
- Failure-mode-specific diagnosis

### Extended-Abstract Example

**Context:** 20-year veteran who found the invariant dimensions exercise was a mirror — teaching insight, not just AI skill.

Show:
- Skills have generalized beyond AI: invariant/variant for curriculum design
- "AI requires verification that your own thinking doesn't"
- Leading department: starting with invariant dimensions because it's about teaching
- Handling resistant colleagues through their values
- Student-facing: epistemology unit (AI as source to interrogate)
- Systemic scenario: writing school AI policy (framework, not rulebook)
- One sentence with non-negotiable thinking

## Fix 2: Restructure BUILD as Thinking, Not Checklist

Current: Sequential questions → fill-in-the-blank policy.
New: Policy emerges from thinking in 4 steps.

### New BUILD Structure:

**Step 1: Skill Integration (1-2 exchanges)**
"Let's map what you've learned to your actual practice."
- Connect 4C, iteration, calibration, invariant dimensions to specific workflows
- Probe for specifics: "Walk me through how that actually works."
- Policy WORKFLOW section emerges from this conversation
- Level-differentiated: Pre/Uni get prompted per skill; Multi lists then connects; Rel drives; Ext articulates fluently

**Step 2: Principles and Boundaries (1-2 exchanges)**
"You've described what you DO. Now let's surface the principles underneath."
- Probe for coherence: "You use AI for feedback but not parent emails. Both are personal. What's the distinction?"
- Find the principle behind the boundaries
- Policy BOUNDARIES and ETHICS sections emerge from this reasoning
- Level-differentiated: Pre/Uni get scaffolded; Multi find the connecting principle; Rel get dilemmas; Ext reason systemically

**Step 3: Student-Facing (2-3 exchanges) — MAJOR SECTION**
This is not one question. Students are growing up in an AI world.
- Grade-band prompts: K-5 (what do they believe?), 6-8 (they're using it already), 9-12 (preparing for AI world)
- The Dependency Question (all levels): "If AI helps students produce better work but they can't produce that work without AI, have they learned?"
- Must be substantive, not a checkbox
- Level-differentiated: Pre/Uni get heavily scaffolded; Multi connect to subject; Rel integrate with modeling; Ext design curriculum

**Step 4: The One Sentence (1 exchange)**
"Distill everything into one sentence: 'I use AI to _______ while always _______.'"
- Forces synthesis. If they can't do it, the thinking isn't coherent yet.

## Fix 3: Add STRESS-TEST Phase

Replace generic REFINE with policy pressure-testing using real scenarios.

**Scenario Bank (choose based on level):**

1. **Access** (all levels): School blocks ChatGPT. What changes? What stays?
2. **Transparency** (all levels): Parent asks "Did you use AI for my child's feedback?"
3. **Failure** (multi+): Colleague notices AI simplified IDEAS, not just language → connects to Week 5 invariant dimensions
4. **Equity** (relational+): Students with AI at home outperform those without — even on in-class work
5. **Systemic** (extended-abstract): Lead AI PD session for split staff (half think AI is cheating, half use it without guidelines)

After each scenario: "Your policy says X. Does your response match? What's the real principle?"

Level differentiation:
- Pre/Uni: 1-2 scenarios, scaffold responses
- Multi: 2-3 scenarios, check consistency
- Rel: 3-4 scenarios, tradeoff reasoning
- Ext: All scenarios including systemic

## Fix 4: Deepen REFLECT with Follow-up Trees

Fewer prompts than other weeks, but DEEPER. Each reflection has a 3-branch follow-up tree.

**Reflection Prompt 1: The Shift**
"What's the most important thing that shifted in how you THINK about AI?"
- Surface → push deeper ("That's a skill. How did your THINKING change?")
- Medium → probe meaning ("What does 'tool' mean to you? What's the difference between a tool and a crutch?")
- Deep → extend to teaching ("How would you explain that shift to someone who hasn't taken this course?")

**Reflection Prompt 2: Capacity Test**
"If you're working on a prompt next week and it's not working — and I'm not here — what do you do?"
- Vague → walk through diagnostic ("What would you check first?")
- Lists steps → probe judgment ("Good checklist. But how do you know WHICH step is the problem?")
- Shows diagnostic reasoning → affirm independence ("That's exactly the thinking. You don't need me for that.")

**Reflection Prompt 3: Teaching Others (for multi+)**
"A colleague asks: 'I want to use AI but I don't know where to start.' What's your 2-minute version?"
- Lists tools → redirect to principles ("Tools change every month. What's the principle underneath?")
- Gives 4C mechanically → push for essence ("Good framework. But what's the ONE thing that makes the difference?")
- Articulates principle → affirm leadership ("That's leadership. You're ready.")

## Fix 5: Prior-Week Skill Callbacks Throughout

**Integration Framework (reference section):**
- Week 2: 4C Framework
- Week 3: Iteration
- Week 4: Calibration
- Week 5: Invariant Dimensions

"When a teacher mentions a practice, connect it to the course skill. When they miss a skill, prompt: 'Where does [skill] show up for you?'"

**In BUILD Step 1:** Explicitly map all 4 skills to practice
**In STRESS-TEST Scenario 3:** "That's the invariant dimension problem from Week 5."
**In CLOSE:** "You have 4C, iteration, calibration, and invariant dimensions. That's a complete toolkit."

## Fix 6: Level-Differentiate All Phases

Every phase gets a level differentiation table:
- DISCOVER: Different follow-up questions by level
- BUILD Steps 1-3: Each step has Pre/Uni, Multi, Rel, Ext approach
- STRESS-TEST: Different number and complexity of scenarios
- CLOSE: Different framing (concrete next steps → leadership launch)

## Fix 7: Elevate Student-Facing Section

Student-facing is not one question — it's 2-3 exchanges and the MAJOR section of BUILD.

- Grade-band differentiated prompts (K-5, 6-8, 9-12)
- The Dependency Question asked explicitly at all levels
- Connected to the capacity insight from the Ozempic lens
- Must be substantive, not a checkbox

## Fix 8: Capacity Test + Independence Framing

The capstone tests independence. Key design moves:

- "the teacher DEMONSTRATES capacity, not just receives instruction" (in role description)
- Teaching Goal #3: "Demonstrate capacity to use AI independently (without Skippy)"
- "The capstone tests whether the course WORKED"
- REFLECT Prompt 2 is an explicit capacity test
- CLOSE: "The teacher demonstrates readiness. Skippy OBSERVES it, not declares it."
- Skippy acknowledges what it OBSERVED, not what it declares: "You just [did X] without my help. That's the capacity you've built."

## Fix 9: Pacing Flexibility Note

"Target: 12-18 exchanges (~25 minutes)
These are ceilings, not floors."

Level-specific pacing:
- Extended-abstract may complete BUILD in 4-5 exchanges
- Relational may skip scaffolding
- If any teacher demonstrates clear capacity early, move to CLOSE. Don't pad.

Signs to move early:
- Teacher articulates principles without prompting
- Teacher connects skills to practice fluently
- Teacher reasons through stress-test scenarios with sophistication
- Teacher can teach the framework to others

## Fix 10: Phase Alignment with Ledger

Prompt phases map to ledger phases:
- DISCOVER → DISCOVER (ledger)
- BUILD → BUILD (ledger)
- STRESS-TEST → REFINE (ledger) — repurposed for policy pressure-testing
- REFLECT → REFLECT (ledger)
- CLOSE → SAVE + BRIDGE (ledger)

Updated week6State in classifier prompt to track 5 policy dimensions:
- Skill Integration (course skills connected to practice)
- Principles (articulated boundaries with reasoning)
- Student-Facing (grade-appropriate AI literacy plan)
- Stress-Tested (policy tested against scenarios)
- Capacity (demonstrated ability to work independently)

Policy is complete when 3+ dimensions addressed AND at least one stress-test scenario completed.

## Additional Sections

### Ethical Threads (Woven In, Not Listed)
Ethics emerge through BUILD and STRESS-TEST, not through a static list:
- Student Data: Surface in BUILD Step 2
- Bias and Equity: Surface in STRESS-TEST Scenario 4
- Transparency: Surface in STRESS-TEST Scenario 2
- The Human Premium: Surface in BUILD Step 2
- Staying Current: Surface in CLOSE

### Misconception Handling
5 misconceptions with reframe + check:
1. "I need to use AI for everything now"
2. "My school doesn't have an AI policy"
3. "Students will cheat anyway"
4. "AI is moving too fast — why bother?"
5. "I don't know enough to help colleagues"

### Artifact: Personal AI Policy
8 sections emerging from conversation:
- MY AI TOOLKIT (from course skills)
- MY PRINCIPLES (from Step 2 reasoning)
- MY BOUNDARIES (from Step 2)
- WHAT MY STUDENTS NEED (from Step 3)
- STRESS-TESTED AGAINST (from Phase 3)
- MY ONE SENTENCE (from Step 4)
- MY NEXT STEP (from CLOSE)
- "This is a living document"

### Completion Detection
Track 5 policy dimensions. Move to REFLECT when 3+ addressed AND one stress-test completed.

### Goal Alignment
Connect capstone to teacher's original goal and course journey.

## Verification Checklist

1. [x] Progressions.ts aligned (topic, probe, all 5 SOLO descriptors)
2. [x] WEEK_6_EXAMPLES exists with 5 level-specific dialogues
3. [x] getWeek6Example() function exported
4. [x] BUILD restructured as thinking (4 steps: skill integration → principles → student-facing → one sentence)
5. [x] Student-facing elevated to MAJOR section with grade-band prompts
6. [x] STRESS-TEST phase with 5 scenario bank, level-differentiated
7. [x] REFLECT with 3 follow-up trees (The Shift, Capacity Test, Teaching Others)
8. [x] Prior-week skills (4C, iteration, calibration, invariant dimensions) referenced throughout
9. [x] All phases level-differentiated with tables
10. [x] Capacity test + independence framing (teacher demonstrates, Skippy observes)
11. [x] Pacing flexibility note (ceilings not floors, signs to move early)
12. [x] Phase alignment with ledger (STRESS-TEST → REFINE, 5 policy dimensions tracked)
13. [x] Ethical threads woven into BUILD and STRESS-TEST, not listed statically
14. [x] Misconception handling (5 misconceptions with reframe + check)
15. [x] Artifact template (8 sections emerging from conversation)
16. [x] Completion detection (5 policy dimensions)
17. [x] Goal alignment section
18. [x] Example functions wired into ledger formatLedgerForPrompt
