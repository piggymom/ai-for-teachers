# Week 4 Comprehensive Fix: Feedback & Assessment

## Overview

Week 4 introduces CALIBRATION — anchor examples for consistent quality across batches. The concept is right but undertaught: one paragraph of explanation, no worked examples, no prior-week callbacks. The "personalization layer" is strong conceptually but underdeveloped in practice.

## Fix 0: Verify Progressions Alignment

Check lib/progressions.ts Week 4. Should be "Feedback & Assessment" with descriptors about calibration, batch consistency, and personalization — not generic AI use.

If misaligned, update:
```typescript
{
  week: 4,
  topic: "Feedback & Assessment",
  diagnosticProbe: "When you give feedback on student work, what makes it effective? What's hardest about maintaining quality across many students?",
  levels: {
    "pre-structural": "Gives feedback but quality degrades with volume; student 1 gets attention, student 25 gets 'good job'",
    "unistructural": "Can identify ONE technique for consistent feedback (e.g., rubric) but applies mechanically",
    "multistructural": "Uses multiple techniques (rubrics, templates, batch strategies) but doesn't see how they connect",
    "relational": "Understands calibration as quality control; can explain WHY anchor examples create consistency; sees personalization as distinct from drafting",
    "extended-abstract": "Designs feedback systems; reasons about the human/AI handoff; considers ethics of AI feedback to students"
  }
}
```

## Fix 1: Add Worked Example Dialogues

Create WEEK_4_EXAMPLES with calibration teaching embedded.

### Pre-structural Example: "Aisha" (2nd grade teacher, overwhelmed by feedback volume)

**Context:** Teaches 2nd grade. Collects writing journals daily but feedback is inconsistent — detailed for first few, "nice work!" for the rest. Feels guilty but exhausted.

Show:
- Full scaffolding of calibration concept ("Here's what an anchor example is...")
- Creating anchor examples together (strong vs. weak 2nd grade writing)
- Testing with one piece of student work first
- Discovering what AI drafted vs. what teacher adds (personalization layer)
- The "warm tone for young kids" iteration move
- Building the personalization checklist

Key dialogue beats:
- "AI doesn't know that Marcus had a rough week. You do. That's the personalization layer."
- "What does 'good' 2nd grade evidence use look like? Let's write that down as your anchor."
- "The AI feedback sounds like a textbook. What's the iteration move?" -> "Make it warm and encouraging for a 7-year-old."

### Multistructural Example: "Jordan" (9th grade Math, uses rubric but feedback still varies)

**Context:** Teaches Algebra 1. Has a rubric for problem-solving but written feedback varies by mood/energy. Wants consistency without losing the human touch.

Show:
- Jordan already has a rubric -> Skippy shows how to convert to calibration anchors
- Chunking from Week 3: feedback by rubric category, not by student
- Differentiated calibration: different anchors for different student groups
- The "swap anchors, keep template" insight
- Personalization as differentiated cognitive push

Key dialogue beats:
- "Your rubric has 4 categories. What if you chunked feedback by category instead of by student? That's Week 3 iteration applied to feedback."
- "What does 'strong problem-solving' look like for your struggling students vs. your advanced students? Different anchors, same template."
- "AI drafted the analysis. What do YOU add? For this student specifically?"

### Relational Example: "Marcus" (11th grade History, concerned about AI feedback ethics)

**Context:** Teaches AP US History. Essays require nuanced historical thinking. Worried AI will miss sophisticated moves or give generic feedback that students will detect.

Show:
- Peer mode — Marcus drives, Skippy challenges
- Framework-based anchors (historical thinking moves, not just "good/bad")
- Quality control as personalization — reviewing AI's analytical judgments
- Transparency as ethical stance
- "When AI reaches its ceiling" — what stays human

Key dialogue beats:
- "Your feedback isn't just 'good argument.' It's 'this move is sophisticated because...' How do you encode that in anchors?"
- "AI flagged this as unsupported. But the student is arguing from absence. That's a sophisticated move AI missed. What's your quality control process?"
- "If your AP students knew AI helped write feedback, what would you tell them?"

## Fix 2: Restructure BUILD to Teach Calibration as Core Skill

Current: 4C for feedback, mention calibration in one paragraph.
New: Calibration is the core skill, taught through practice.

### New BUILD Structure:

**Step 1: Pick a real feedback task (1 exchange)**
"What kind of student work do you give feedback on most often? Something you'll actually use this for."

**Step 2: Quick 4C build (1-2 exchanges)**
"Use your 4C — you know this. Context, Constraints, Command, Criteria. Build the feedback prompt."

**Step 3: THE NEW SKILL — Calibration (3-4 exchanges)**
This is the core teaching:

"Now here's the problem: you're going to run this on [N] papers. How does AI know what 'strong' looks like in YOUR classroom?

The technique is ANCHOR EXAMPLES. Before the batch, you show AI:
- 'Here's a strong [assignment] and here's WHY it's strong: [example]'
- 'Here's one that needs work and here's WHY: [example]'
- 'Apply this standard to all [N] papers.'

That's calibration — like giving a substitute your rubric before they grade. But more specific than a rubric — actual examples with your reasoning attached.

What's a strong example from your class? And a weak one?"

Guide them through:
- Selecting appropriate anchors
- Articulating WHY each is strong/weak (not just labeling)
- Binary vs. spectrum anchors (strong/weak vs. strong/adequate/weak)
- Adding anchors to their prompt

**Step 4: Personalization layer (2-3 exchanges)**
"AI handles the analysis and draft. What do YOU add that AI can't know?"

Introduce personalization moves:
- Growth-arc memory: "Remember when you struggled with X? Look at you now."
- Differentiated cognitive push: Different challenge level for different students
- Emotional attunement: Knowing when to push vs. encourage
- (For relational+) Analytical quality control: Reviewing AI's judgments

Build the personalization checklist explicitly.

**Step 5: External test (2 exchanges)**
"Test it with ONE piece of student work. See what AI drafts. Then ask: What would I add? What would I change?"

## Fix 3: Add Prior-Week Skill Callbacks

**In ORIENT:**
"You learned to iterate in Week 3 — structured follow-ups to refine output. That skill applies here. When AI's feedback draft isn't quite right, you iterate.

This week adds CALIBRATION: making your first prompt consistent across the whole batch. Your anchor examples encode your feedback standards the same way your iteration moves encode your teaching approach."

**In BUILD Step 2:**
"4C — you've done this. The structure is familiar. The new piece is what comes next."

**In BUILD Step 5:**
"The feedback isn't quite right. What's your iteration move from Week 3?"

**In personalization section:**
"Remember 'encoding pedagogical judgment' from Week 3? Your anchor examples do the same thing — they encode YOUR standards so AI can apply them consistently."

## Fix 4: Differentiate Feedback Flow Introduction

The Feedback Flow (Analyze -> Draft -> Personalize -> Deliver) is good but introduced the same way for all levels.

**Pre-structural / Unistructural:**
Present explicitly: "Here's the Feedback Flow: AI Analyzes patterns and Drafts feedback. You Personalize it and Deliver it. Four steps. AI does 1 and 2, you do 3 and 4."

**Multistructural:**
Derive from their workflow: "You already analyze, draft, edit, deliver. We're making that systematic — AI handles analyze and draft consistently, you handle personalize and deliver with intention."

**Relational+:**
Skip the model, focus on design: "Where exactly does AI enter your feedback process, and where does it exit? What stays yours no matter what?"

## Fix 5: Add Personalization Moves Framework

Expand from discussion to framework:

```markdown
## Personalization Moves — What You Add That AI Can't

### Growth-Arc Memory
"Remember when you struggled with X? Look at you now."
- Requires knowing student's history
- AI sees one paper; you see the trajectory

### Differentiated Cognitive Push
Different challenge level for different students:
- Struggling: "You found the evidence — that's the hardest part. Now let's connect it."
- Advanced: "You argued X, but what about Y? How would you respond?"

### Emotional Attunement
Knowing when to push vs. encourage:
- "I know this was hard for you. I see the effort."
- "You're ready for more. Let's push."

### Analytical Quality Control (Relational+)
Reviewing AI's judgments for accuracy:
- Did AI flag something sophisticated as an error?
- Did AI miss something important?
- Where did AI reach its ceiling?
```

Have teacher build their personalization checklist during the session.

## Fix 6: Strengthen REFINE Phase

Current REFINE is 10 lines. Expand:

**After first test:**
"What's the 15% that didn't work? That's where the interesting learning is."

**Iteration move capture:**
"What follow-up prompts fixed the feedback? Let's save those as iteration moves for feedback specifically."

**Structured follow-up practice:**
- Tone adjustment: "Rewrite in warmer language for [grade level]"
- Specificity: "Point to a specific sentence in their writing"
- Level-appropriateness: "Simplify the revision suggestion for struggling writers"

**For multistructural+:**
"What if your inclusion students need different feedback anchors? Same template, swap the examples. That's differentiated calibration."

## Fix 7: Level Calibration (Expanded)

### Pre-structural
**Scaffolding:** Maximum
**Key Moves:**
- Full explanation of what calibration is
- Create anchors together: "What's a strong example? Why is it strong?"
- Heavy support on personalization layer
- One test, one iteration
**Pacing:** Full 14-18 exchanges

### Unistructural
**Scaffolding:** High
**Key Moves:**
- Introduce calibration with their existing rubric
- Guide anchor creation
- Build personalization checklist together
**Pacing:** 12-16 exchanges

### Multistructural
**Scaffolding:** Medium
**Key Moves:**
- Connect calibration to their rubric: "Your rubric becomes your anchors"
- Introduce differentiated calibration (different anchors per group)
- Chunking from Week 3 (by category, not by student)
**Pacing:** 10-14 exchanges

### Relational
**Scaffolding:** Low
**Key Moves:**
- Framework-based anchors (thinking moves, not just quality labels)
- Quality control as personalization
- Ethics of AI feedback
**Pacing:** 8-12 exchanges

### Extended-Abstract
**Scaffolding:** Minimal
**Key Moves:**
- System design for department
- The human/AI handoff boundary
- Transparency and trust
**Pacing:** 6-10 exchanges

## Fix 8: Map Insights to Levels

### For Pre-structural / Unistructural:
- "Batch similar work": Grade same assignment type together | BUILD | "Do all the reading responses, then all the math problems. Same calibration applies."
- "One student at a time, but calibrated": Consistency without losing individual attention | Personalization | "Each student gets YOUR attention. AI just made sure you're applying the same standard."

### For Multistructural:
- "Rubric -> Anchors": Convert what you have | BUILD Step 3 | "Your rubric already defines quality. Anchors add examples of what that looks like."
- "Chunk by category": From Week 3 | BUILD | "Instead of feedback per student, feedback per rubric category. Chunking from last week."

### For Relational:
- "AI catches what you miss": Fatigue-resistant | REFLECT | "You miss things at paper 25 that you'd catch at paper 1. AI doesn't get tired."
- "Your ceiling, not AI's": Where AI fails | Personalization | "AI reached its limit here. That's where your expertise matters most."

### For Extended-Abstract:
- "Transparency as teaching": Model AI use | REFLECT | "How you talk about AI use IS teaching your students about AI."
- "The feedback relationship": What can't be delegated | REFLECT | "Some feedback moments are too important for AI. When a student needs to know YOU read their work."

## Fix 9: Add Pacing Note + Capacity Check

**Pacing:**
"Target: 12-18 exchanges. These are ceilings, not floors. Higher-level learners may move faster. Don't pad."

**Capacity Check (before BRIDGE):**
- "If AI gave generic feedback on a paper, how would you diagnose the problem?"
- "What's your calibration anchor for 'strong' in this assignment? Could you explain it to a colleague?"
- "Where does AI hand off to you? What's YOURS no matter what?"

## Verification Checklist

1. [x] Progressions.ts aligned
2. [x] WEEK_4_EXAMPLES exists with 3+ level-specific dialogues
3. [x] Calibration gets 3-4 exchanges of dedicated teaching in BUILD
4. [x] Prior-week skills (4C, iteration) explicitly referenced
5. [x] Feedback Flow introduction differentiated by level
6. [x] Personalization Moves framework added
7. [x] Personalization checklist built during session
8. [x] REFINE expanded with iteration move capture
9. [x] Level calibration expanded with behavioral contracts
10. [x] Insights mapped to levels
11. [x] Pacing note + capacity check included
