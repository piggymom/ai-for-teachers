# Week 3 Comprehensive Fix: Lesson Planning with AI

## Overview

Week 3 introduces ITERATION — multi-turn prompting, the skill of refining output through follow-up prompts. Also introduces Driver's Seat Model. Both are mentioned but not taught. No worked examples, no prior-week callback to 4C.

## Fix 0: Verify Progressions Alignment

Check lib/progressions.ts Week 3. Should be "Lesson Planning with AI" with descriptors about iteration, multi-turn prompting, and maintaining pedagogical control.

If misaligned, update:
```typescript
{
  week: 3,
  topic: "Lesson Planning with AI",
  diagnosticProbe: "Walk me through how you currently plan a lesson. What's your process, and where does it feel inefficient?",
  levels: {
    "pre-structural": "Plans lessons from scratch each time; hasn't considered AI as planning tool; or tried AI once and gave up",
    "unistructural": "Can use AI for ONE planning task (e.g., generate activities) but treats it as one-shot — no iteration",
    "multistructural": "Uses AI for multiple planning tasks; iterates when output isn't right but through trial-and-error, not systematic refinement",
    "relational": "Understands prompting as conversation; can diagnose WHY output failed and write targeted follow-ups; maintains pedagogical control intentionally",
    "extended-abstract": "Designs planning workflows; helps colleagues integrate AI; reasons about what stays human in lesson design"
  }
}
```

## Fix 1: Add Worked Example Dialogues

Create WEEK_3_EXAMPLES with iteration teaching embedded.

### Pre-structural Example: "Tanya" (5th grade teacher, burned by AI before)

**Context:** Teaches 5th grade Science. Tried ChatGPT for a worksheet, got something unusable, gave up. Skeptical but willing to try again. Time-strapped.

Show:
- Connecting to Week 2: "Use your 4C skills"
- Full scaffolding of iteration concept
- The contrast: vague follow-up ("make it better") vs. structured follow-up ("add movement component, reduce reading level")
- "5 options trick" for brainstorming
- Capturing iteration moves
- Rebuilding confidence through success

Key dialogue beats:
- "Your 4C prompt got you 70% there. That's normal! Now we iterate."
- "What's wrong with this output? Be specific." -> "The activities are too long and there's no movement."
- "That's your follow-up prompt: 'Shorten activities to 10 minutes each and add a movement component.' Not 'make it better.'"
- "Notice what just happened — you diagnosed the gap and wrote a targeted fix. That's iteration."

### Multistructural Example: "Kenji" (8th grade Math, uses AI but goes in circles)

**Context:** Teaches 8th grade Pre-Algebra. Uses AI regularly but often goes back and forth 5-6 times without getting what he wants. Knows to "be specific" but still struggles.

Show:
- Kenji already has 4C basics -> focus on iteration as the new skill
- Diagnosing the "going in circles" pattern: first prompt was missing something structural
- The CHUNKING insight: sequence of focused prompts beats one big prompt with many fixes
- Contrast: "one prompt, many fixes" vs. "many focused prompts, each building on the last"
- Deliberate iteration vs. trial-and-error iteration

Key dialogue beats:
- "You said you go back and forth 5-6 times. Let's diagnose: is each follow-up making it better, or are you circling?"
- "Here's the issue: you asked for the whole lesson in one prompt. What if you chunked it? 'Generate 3 hooks' -> evaluate -> 'Draft the instruction segment' -> evaluate."
- "That's DELIBERATE iteration. Not patching a big prompt, but building in sequence."

### Relational Example: "Dr. Okafor" (AP Physics, systematic thinker)

**Context:** Teaches AP Physics. Already iterates naturally but wants to make it systematic and shareable with department. Concerned about maintaining physics rigor.

Show:
- Peer mode — Dr. Okafor drives, Skippy deepens
- Iteration moves as "encoded pedagogical judgment"
- Structured follow-ups have their own 4C
- The "two modes" insight: tight iteration for accuracy, loose iteration for creativity
- Designing iteration patterns for colleagues

Key dialogue beats:
- "Your follow-up prompts are already sophisticated. Let's name them so you can share them."
- "'Make the explanation more conceptual' — that's an iteration move that encodes your physics teaching philosophy."
- "You iterate tightly for problem solutions, loosely for demonstrations. That's deliberate. What's the principle?"

## Fix 2: Restructure BUILD to Lead with Iteration

Current: "Use 4C for lesson planning. Oh, and here's iteration."
New: "You know 4C. This week's skill is the prompting CONVERSATION."

### New BUILD Structure:

**Step 1: Frame iteration as the new skill (ORIENT)**
"You know the 4C framework from last week. This week's new skill is ITERATION — using multiple prompts in sequence, each refining the output.

Here's the shift: your first prompt gets you 60-70%. Follow-up prompts get you to 90%. That's not failure — that's the process."

**Step 2: Pick a real planning task (1 exchange)**
"What's a lesson you need to plan soon? Something real you'll actually use."

**Step 3: Build the first prompt with 4C (2 exchanges)**
Quick — they know this. Review, not re-teach.

"Build the prompt with your 4C skills. Context, Constraints, Command, Criteria. This is review — you've done it."

**Step 4: THE NEW SKILL — Iteration (4-5 exchanges)**
This is the core teaching:

"Test that prompt externally. When you get the output back, we'll learn iteration."

After they test:
"What's the gap between what you got and what you need? Be specific."

Teach the contrast:
"Two kinds of follow-ups:
- VAGUE: 'Make it more engaging' -> AI guesses what you mean
- STRUCTURED: 'Add a movement component where students physically sort cards by category. Reduce each activity to 10 minutes.' -> AI knows exactly what to change

Structured follow-ups have their own mini-4C. Context (what to change), Command (how to change it), Criteria (what success looks like)."

**Step 5: The Chunking Insight (for multistructural+)**
"Here's an advanced move: instead of one big prompt with many follow-ups, chunk the ask.

Don't ask: 'Generate a complete lesson plan' -> fix -> fix -> fix
Do ask: 'Generate 3 hook ideas' -> pick one -> 'Draft 10-min instruction segment' -> evaluate -> 'Create student activity' -> evaluate

Each prompt is focused. You evaluate between. That's deliberate iteration."

**Step 6: Capture iteration moves (1-2 exchanges)**
"What follow-up prompts worked today? Those are your ITERATION MOVES — you'll reuse them.

'Add movement component' might become your go-to. 'Make it more student-centered' with specifics. Save these."

## Fix 3: Add Prior-Week Callback

**In ORIENT:**
"Last week you learned 4C — the structure for a single prompt. This week adds what happens AFTER that prompt. The skill is iteration: refining through follow-ups."

**In BUILD Step 3:**
"Use your 4C from Week 2. Context, Constraints, Command, Criteria. You've got this — it's review."

## Fix 4: Differentiate Driver's Seat Model by Level

**Pre-structural / Unistructural:**
Present explicitly: "Here's the key: YOU decide the objectives, assessment, and pacing. AI helps with drafts and ideas. We call it the Driver's Seat Model — you're driving, AI is navigation."

**Multistructural:**
Derive from their workflow: "You said you keep the learning progression and delegate the activity brainstorming. That's the Driver's Seat Model — you're already doing it. Let's make it intentional."

**Relational+:**
Skip the label, focus on design: "Where exactly in your planning process does AI enter, and where does it exit? What's non-negotiable?"

## Fix 5: Add Iteration Move Capture Beat

Explicit in REFINE:

"What follow-up prompts made the biggest difference today? Let's capture them.

For example:
- 'Add movement component' — good for kinesthetic learners
- 'Reduce to 10-minute activities' — good for pacing
- 'Make it more inquiry-based' — good for discovery learning

These are your ITERATION MOVES. They'll work for your next lesson too."

For relational+:
"You're encoding your teaching philosophy into reusable prompts. That iteration moves section is where your pedagogy lives."

## Fix 6: Level Calibration (Expanded)

### Pre-structural
**Scaffolding:** Maximum
**Key Moves:**
- Guide 4C explicitly (review with support)
- Full explanation of iteration
- Contrast vague vs. structured follow-ups with examples
- Capture iteration moves together
- "5 options trick" for brainstorming
**Pacing:** Full 14-18 exchanges

### Unistructural
**Scaffolding:** High
**Key Moves:**
- Quick 4C review
- Focus on structured follow-ups
- Guide iteration move capture
**Pacing:** 12-16 exchanges

### Multistructural
**Scaffolding:** Medium
**Key Moves:**
- Teacher drafts 4C independently
- Introduce CHUNKING as the key insight
- Deliberate iteration vs. trial-and-error
- Connect iteration to their existing practice
**Pacing:** 10-14 exchanges

### Relational
**Scaffolding:** Low
**Key Moves:**
- Peer mode
- Iteration moves as "encoded pedagogical judgment"
- Design for different task types (tight vs. loose)
- Patterns for colleagues
**Pacing:** 8-12 exchanges

### Extended-Abstract
**Scaffolding:** Minimal
**Key Moves:**
- Workflow design
- Department-level patterns
- What stays human in planning
**Pacing:** 6-10 exchanges

## Fix 7: Expand Artifact Template

```markdown
## Lesson Planning Template

### PROMPT STRUCTURE (4C)
CONTEXT: [Teaching context, student info]
CONSTRAINTS: [Boundaries, requirements]
COMMAND: [Specific task — or CHUNKED sequence]
CRITERIA: [What success looks like]

### ITERATION MOVES (your go-to follow-ups)
- [Move 1]: [When to use]
- [Move 2]: [When to use]
- [Move 3]: [When to use]

### CHUNKING SEQUENCE (for complex lessons)
1. [First focused prompt] -> evaluate
2. [Second focused prompt] -> evaluate
3. [Third focused prompt] -> evaluate

### DRIVER'S SEAT NOTES
- AI handles: [What you delegate]
- You keep: [What stays yours]
```

## Fix 8: Map Insights to Levels

### For Pre-structural / Unistructural:
- "First output is data": The gaps tell you what to fix | REFINE | "What's wrong tells you what was unclear in your prompt. That's not failure — that's feedback."
- "The 5 options trick": Generate multiple, cherry-pick | BUILD | "Don't ask for the perfect activity. Ask for five and combine the best parts."

### For Multistructural:
- "Chunk your asks": Sequence beats single prompt | BUILD Step 5 | "Instead of one big prompt, what if you built the lesson in pieces?"
- "Structured follow-ups have 4C": Not just "make it better" | BUILD Step 4 | "Your follow-up prompt should be as structured as your first prompt."

### For Relational:
- "Iteration moves encode judgment": Your pedagogy in prompts | REFLECT | "The iteration moves you save ARE your teaching philosophy, made explicit."
- "Tight vs. loose iteration": Different modes for different tasks | BUILD | "When do you constrain tightly? When do you let AI surprise you?"

### For Extended-Abstract:
- "Shareable patterns": Design for colleagues | REFLECT | "Which of your iteration moves would help a new teacher?"
- "What stays human": The non-negotiables | REFLECT | "AI can generate activities. What can't it do in your planning process?"

## Fix 9: Pacing + Capacity Check

**Pacing:**
"Target: 12-18 exchanges. These are ceilings, not floors."

**Capacity Check:**
- "If your first output isn't right, what do you check first?"
- "What's the difference between a vague follow-up and a structured one?"
- "Your iteration moves — could you explain them to a colleague?"

## Verification Checklist

1. [x] Progressions.ts aligned
2. [x] WEEK_3_EXAMPLES exists with 3+ level-specific dialogues
3. [x] BUILD restructured to lead with iteration
4. [x] Vague vs. structured follow-up contrast taught explicitly
5. [x] CHUNKING introduced for multistructural+
6. [x] Prior-week callback to 4C
7. [x] Driver's Seat Model differentiated by level
8. [x] Iteration move capture beat in REFINE
9. [x] Level calibration expanded with behavioral contracts
10. [x] Artifact includes iteration moves and chunking sequence
11. [x] Insights mapped to levels
12. [x] Pacing note + capacity check included
