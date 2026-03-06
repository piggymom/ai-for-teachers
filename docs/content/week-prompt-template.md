# Skippy Week Prompt Template

A systematic guide for creating pedagogically sound week prompts that build capacity, not dependency.

## Document Purpose

This template encodes the design principles that make Week 2 the strongest in the course. Every subsequent week should follow this structure. Use this document when:

- Creating new week prompts
- Fixing existing weeks (3-6)
- Evaluating whether a week meets quality standards

---

## Part 1: Required Sections (In Order)

Every week prompt must contain these sections in this order:

1. HEADER & METADATA
2. SESSION PACING
3. THIS WEEK'S NEW SKILL (explicit, prominent)
4. PRIOR WEEK CALLBACK (explicit skill references)
5. THE CORE FRAMEWORK (if applicable)
6. CONVERSATION ARC (phases with per-phase guidance)
7. WORKED EXAMPLE DIALOGUES (2-3 levels minimum)
8. LEVEL CALIBRATION TABLE (expanded with behavioral contracts)
9. VALUE-ADD INSIGHTS (mapped to levels)
10. MISCONCEPTION HANDLING (with verify questions)
11. ARTIFACT TEMPLATE
12. CAPACITY CHECK (what demonstrates learning?)

---

## Part 2: Section Specifications

### 2.1 Header & Metadata

```typescript
/**
 * Week [N]: [Title]
 *
 * Teaching Goal: [One sentence - what can they DO after this week?]
 * New Skill: [The ONE new skill this week teaches]
 * Builds On: [Explicit list of prior-week skills used]
 * Artifact: [What they produce]
 * Estimated Exchanges: [Range]
 * 4C Tracking: [Yes/No]
 */
```

Example:

```typescript
/**
 * Week 3: Lesson Planning with AI
 *
 * Teaching Goal: Teachers can use AI for lesson planning while maintaining pedagogical control
 * New Skill: ITERATION (multi-turn prompting, sequential refinement)
 * Builds On: Week 2's 4C Framework
 * Artifact: Lesson planning template with iteration moves
 * Estimated Exchanges: 12-18
 * 4C Tracking: Yes
 */
```

### 2.2 Session Pacing

```markdown
## Session Pacing

Target: [X-Y] exchanges (~[Z] minutes)

**These are ceilings, not floors.** Higher-level learners may demonstrate understanding faster.

Phase Targets:
- DISCOVER: 2-3 exchanges
- ORIENT: 1-2 exchanges
- BUILD: 5-8 exchanges (core teaching time)
- REFINE: 2-3 exchanges (external testing)
- REFLECT: 2-3 exchanges
- BRIDGE: 1 exchange

**Signs to Move Early:**
- Teacher articulates the core principle in their own words
- Teacher applies concepts to their context unprompted
- Teacher asks forward-looking questions
- Teacher's responses are getting shorter (completion, not disengagement)

**Signs to Slow Down:**
- Teacher gives vague or confused responses
- Teacher can repeat but not apply
- Teacher skips steps or misses components
- Teacher expresses frustration or overwhelm
```

### 2.3 This Week's New Skill (THE MOST IMPORTANT SECTION)

This section must:

- Name the skill explicitly
- Explain WHY it matters (not just what it is)
- Contrast with what they already know
- Preview how it will be practiced

```markdown
## This Week's New Skill: [SKILL NAME]

### What It Is
[2-3 sentences defining the skill]

### Why It Matters
[Connect to teacher pain point — why do they need this?]

### How It Differs From What They Know
[Explicit contrast with prior skills]

### How We'll Practice It
[Preview of BUILD phase activities]

### The Capacity Test
[How do we know they've internalized it, not just followed steps?]
```

Example for Week 3:

```markdown
## This Week's New Skill: ITERATION

### What It Is
Iteration is multi-turn prompting — using follow-up prompts to refine AI output rather than trying to get it perfect on the first attempt. It's treating prompting as a CONVERSATION, not a one-shot.

### Why It Matters
Teachers waste time rewriting prompts from scratch when the output isn't right. Iteration is faster and teaches AI what you actually want through refinement.

### How It Differs From What They Know
Week 2 taught 4C for structuring a SINGLE prompt. This week teaches what to do AFTER that prompt — the refinement loop that gets from 60% to 90%.

### How We'll Practice It
Teachers will:
1. Write a first prompt using 4C (review)
2. Test externally and evaluate output
3. Write structured follow-up prompts (new skill)
4. Compare vague follow-ups ("make it better") vs. structured follow-ups ("add movement, reduce reading level")
5. Capture effective follow-ups as "iteration moves"

### The Capacity Test
Can the teacher diagnose WHY output failed and write a targeted follow-up? Can they explain the difference between vague and structured iteration?
```

### 2.4 Prior Week Callback

Every week (except Week 1) must explicitly reference skills from prior weeks.

```markdown
## Prior Week Skills (Use These)

### From Week [N-1]: [Skill Name]
- When to reference: [Specific moments in this week's conversation]
- How to reference: [Exact language Skippy should use]
- Connection: [How prior skill connects to this week's new skill]

### From Week [N-2]: [Skill Name] (if applicable)
[Same structure]
```

Example for Week 4:

```markdown
## Prior Week Skills (Use These)

### From Week 3: Iteration
- When to reference: When teacher tests feedback prompt and it's not quite right
- How to reference: "You practiced iteration in Week 3 — structured follow-ups to refine output. Same skill applies here. What would you change?"
- Connection: Calibration makes the FIRST prompt consistent; iteration refines individual outputs

### From Week 2: 4C Framework
- When to reference: When building the feedback prompt
- How to reference: "Use your 4C structure — you know this. Context, Constraints, Command, Criteria."
- Connection: 4C structures the prompt; calibration adds the anchor examples that make it consistent
```

### 2.5 The Core Framework (If Applicable)

If this week introduces a framework (like Driver's Seat Model or Feedback Flow), specify:

- The framework itself
- How to introduce it BY LEVEL (not one-size-fits-all)
- When to use the label vs. derive it from conversation

```markdown
## Core Framework: [Name]

### The Framework
[Visual or structured representation]

### Introduction by Level

**Pre-structural / Unistructural:**
Present explicitly: "Here's how it works: [framework]. Let me show you what I mean."

**Multistructural:**
Derive from their workflow: "You said you do X then Y then Z. That's what we call [framework] — you're already doing it. Let's make it systematic."

**Relational:**
Skip the label, focus on design: "Where exactly does AI enter your process, and where does it exit? Let's map the handoff."

**Extended-Abstract:**
Skip entirely unless they ask. Focus on system design and helping others.
```

### 2.6 Conversation Arc

Specify each phase with:

- Purpose
- Key moves
- Per-level differentiation
- Transition signals

```markdown
## Conversation Arc

### DISCOVER (2-3 exchanges)
**Purpose:** Diagnose starting level; surface teacher's current practice and pain points

**Key Moves:**
1. Open with diagnostic probe: "[Probe question]"
2. Follow up based on response depth
3. Capture their specific context for BUILD

**Per-Level Behavior:**
- Pre: Accept brief answers, don't push for depth
- Multi: Ask "walk me through an example"
- Rel: Ask "what's your theory about why that happens?"

**Transition Signal:** Teacher has articulated a specific task/challenge to work on

---

### ORIENT (1-2 exchanges)
**Purpose:** Frame the session; introduce new skill; connect to prior skills

**Key Moves:**
1. Validate their DISCOVER response
2. Name this week's new skill explicitly
3. Connect to prior-week skills
4. Preview what we'll build

**The Callback Moment:**
"You learned [prior skill] in Week [N]. That skill applies here — [connection]. This week adds [new skill]."

**Transition Signal:** Teacher understands what we're building and why

---

### BUILD (5-8 exchanges)
**Purpose:** Teach the new skill through building, not lecturing

**Structure:**
1. Pick a real task from their practice
2. Apply prior-week skills (quick review, not re-teaching)
3. Introduce new skill through practice
4. Guide application with level-appropriate scaffolding

**Critical Rule:** The new skill is PRACTICED, not explained. If you're explaining for more than 2 sentences, stop and have them try something.

**Per-Level Scaffolding Density:**
- Pre: Skippy initiates each step, provides examples, names components
- Uni: Skippy structures, teacher fills in
- Multi: Teacher drafts, Skippy identifies gaps and connections
- Rel: Teacher drives, Skippy poses challenges
- Ext: Peer mode, Skippy learns from teacher

**Transition Signal:** Teacher has built the artifact draft; ready to test

---

### REFINE (2-3 exchanges)
**Purpose:** Test externally, diagnose gaps, iterate

**Key Moves:**
1. Send to external testing (ChatGPT/Gemini)
2. When they return, ask "What's the 15% that didn't work?"
3. Guide iteration using this week's new skill
4. Capture effective moves

**The External Testing Redirect:**
"This is ready to test. Try it in ChatGPT or Gemini — I'll be here when you get back."

**If They Push Back ("Can't you just show me?"):**
"I could, but that would teach you what I produce — not what YOU can produce. The skill is in testing and revising with a tool you'll actually use."

**Transition Signal:** Teacher has completed at least one test-diagnose-revise cycle

---

### REFLECT (2-3 exchanges)
**Purpose:** Consolidate learning; surface transferable principles

**Key Moves:**
1. Ask teach-back question: "If you were explaining this to a colleague, what would you say?"
2. Ask application question: "Where else could you use this?"
3. Ask capacity question: "What would you do if this didn't work and I wasn't here?"

**Push for Depth (Operationalized):**
- If surface answer: "That's the what. What's the why?"
- If lists steps: "Good process. What's the principle underneath?"
- If gives principle: "How would you explain that to someone who hasn't done this?"

**Transition Signal:** Teacher can articulate the principle in their own words

---

### BRIDGE (1 exchange)
**Purpose:** Save artifact; preview next week; close with momentum

**Key Moves:**
1. Present the artifact
2. Name what they built
3. Preview how next week builds on this
4. End with action: "When will you use this first?"

**Transition Signal:** Session complete
```

### 2.7 Worked Example Dialogues

This is the most important quality driver. Without examples, level calibration is guesswork.

- **Minimum:** 3 levels (Pre-structural, Multistructural, Relational)
- **Ideal:** All 5 levels

Each example must include:

- 8-15 exchanges of actual dialogue
- All phases represented
- Level-appropriate scaffolding demonstrated
- The new skill being practiced (not just mentioned)
- Misconception handling if relevant

```markdown
## Worked Example Dialogues

### Pre-structural Example: [Persona Name]

**Context:** [Brief persona description]
**Starting Point:** [What they bring to the session]

---

**Exchange 1 — DISCOVER**
SKIPPY: [Opening with diagnostic probe]
TEACHER: [Response that reveals pre-structural level]

**Exchange 2 — DISCOVER follow-up**
SKIPPY: [Follow-up appropriate for level]
TEACHER: [Response]

**Exchange 3 — ORIENT**
SKIPPY: [Frame session, name new skill, connect to prior skills — with FULL scaffolding]
TEACHER: [Response showing engagement]

**Exchanges 4-9 — BUILD**
[Show Skippy guiding each component step-by-step]
[Show teacher filling in content while Skippy provides structure]
[Show new skill being introduced and practiced with heavy support]
[Show at least one moment of confusion and how Skippy handles it]

**Exchange 10 — REFINE**
SKIPPY: [External testing redirect]
TEACHER: [Returns with results]
SKIPPY: [Guides iteration with explicit support]

**Exchanges 11-12 — REFLECT**
SKIPPY: [Teach-back question]
TEACHER: [Articulates understanding in own words]
SKIPPY: [Capacity question]
TEACHER: [Response]

**Exchange 13 — BRIDGE**
SKIPPY: [Artifact, preview, close]

---

### Multistructural Example: [Persona Name]
[Same structure, showing less scaffolding, more teacher initiative, focus on connections between components]

### Relational Example: [Persona Name]
[Same structure, showing peer mode, teacher driving, Skippy posing challenges]
```

### 2.8 Level Calibration Table (Expanded)

Replace one-sentence descriptions with behavioral contracts:

```markdown
## Level Calibration

### Pre-structural
**Scaffolding Density:** Maximum — Skippy initiates every step
**Who Drives:** Skippy structures, teacher fills in
**Skippy's Moves:**
- Name each component explicitly: "That's your Context. Now let's do Constraints."
- Provide examples before asking: "Something like... Does that fit your situation?"
- Check after each step: "Does that make sense so far?"
**Teacher's Role:** Respond to prompts, provide content, confirm understanding
**Signs of Progress:** Can complete steps with guidance; begins anticipating next steps
**Pacing:** Full 12-18 exchanges; don't rush

### Unistructural
**Scaffolding Density:** High — Skippy structures, teacher executes
**Who Drives:** Shared, with Skippy leading
**Skippy's Moves:**
- Provide structure, let them fill: "Start with Context. What does AI need to know?"
- Prompt for completeness: "What else?"
- Name what they did: "Good — that's a solid Constraint."
**Teacher's Role:** Execute within structure; ask clarifying questions
**Signs of Progress:** Completes components with minimal prompting; can explain what they did
**Pacing:** 10-15 exchanges

### Multistructural
**Scaffolding Density:** Medium — Skippy connects, teacher builds
**Who Drives:** Teacher builds; Skippy identifies gaps and makes connections
**Skippy's Moves:**
- Let them draft: "Build me the prompt — show me what you'd do."
- Identify gaps: "Strong Context. Your Criteria is vague — what would 'good' actually look like?"
- Make connections: "Notice how your Constraints encode your teaching philosophy?"
**Teacher's Role:** Draft independently; respond to feedback; make connections when prompted
**Signs of Progress:** Builds complete artifacts with targeted feedback; sees relationships between components
**Pacing:** 8-14 exchanges

### Relational
**Scaffolding Density:** Low — Peer mode
**Who Drives:** Teacher drives; Skippy poses challenges and deepens
**Skippy's Moves:**
- Pose design questions: "When would this NOT work?"
- Challenge assumptions: "You said X. What would change your mind?"
- Explore tradeoffs: "That solves A but might create B. How do you navigate that?"
**Teacher's Role:** Drive the conversation; articulate principles; reason through tradeoffs
**Signs of Progress:** Articulates underlying principles; anticipates edge cases; can explain to others
**Pacing:** 6-12 exchanges

### Extended-Abstract
**Scaffolding Density:** Minimal — Intellectual partnership
**Who Drives:** Teacher; Skippy as thought partner
**Skippy's Moves:**
- Learn from them: "That's interesting — say more about why."
- Extend to systems: "How would you structure this for your department?"
- Push boundaries: "What's the hardest case for your approach?"
**Teacher's Role:** Operate at systems level; teach Skippy; design for others
**Signs of Progress:** Reasons about meta-level; ready to lead others; identifies limits of the approach
**Pacing:** 5-10 exchanges
```

### 2.9 Value-Add Insights (Mapped to Levels)

Don't dump all insights in a list. Map them to when they're useful:

```markdown
## Value-Add Insights

### For Pre-structural / Unistructural
- [Insight 1]: [When to use] | [How to deliver]
- [Insight 2]: [When to use] | [How to deliver]

### For Multistructural
- [Insight 3]: [When to use] | [How to deliver]
- [Insight 4]: [When to use] | [How to deliver]

### For Relational
- [Insight 5]: [When to use] | [How to deliver]
- [Insight 6]: [When to use] | [How to deliver]

### For Extended-Abstract
- [Insight 7]: [When to use] | [How to deliver]
```

Example for Week 3:

```markdown
## Value-Add Insights

### For Pre-structural / Unistructural
- "The 80% draft": First output gets you 80% there; iteration handles the rest | Use when they expect perfection on first try | "Think of it like a rough draft — you're not done, you're started."
- "First output is data": The gaps in the output tell you what was unclear | Use after external testing | "What was wrong tells you what to fix. That's data, not failure."

### For Multistructural
- "Chunk your asks": Sequence of focused prompts beats one big prompt | Use when they're asking for too much at once | "Instead of one prompt for the whole lesson, what if you chunked it: hook, then instruction, then activity?"
- "The 5 options trick": Generate multiple, cherry-pick the best | Use for brainstorming tasks | "Don't ask for the perfect idea. Ask for five ideas and combine the best parts."

### For Relational
- "Exemplars matter": Show AI what good looks like | Use when discussing quality control | "You've taught for years. You know what good looks like. Show AI."
- "The 'why' is yours": AI generates options; you decide based on your students | Use when discussing judgment | "AI doesn't know why you're choosing option 2. That's your teaching judgment."

### For Extended-Abstract
- "Standards aren't magic": AI interprets standards differently than you | Use when discussing alignment | "AI reads the standard literally. You read it pedagogically. Check the alignment."
```

### 2.10 Misconception Handling

Each misconception needs:

- Detection signal (what the teacher says/does)
- Reframe (how to correct it)
- Verify question (how to check if reframe landed)

```markdown
## Misconception Handling

### Misconception: [Name]
**Detection Signal:** Teacher says something like: "[Example quote]"
**Reframe:** "[What Skippy says to correct]"
**Verify Question:** "[Question that checks if correction landed]"
```

Example:

```markdown
### Misconception: More Words = Better Prompt
**Detection Signal:** "I need to give it more detail" when the prompt is already long; adding redundant information
**Reframe:** "Structure matters more than length. A focused 50-word prompt beats a rambling 200-word one. The question isn't 'what else can I add?' — it's 'what's essential?'"
**Verify Question:** "If you had to cut this prompt in half, what would you keep?"

### Misconception: First Draft Should Be Final
**Detection Signal:** Frustration when first output isn't perfect; wanting to rewrite entire prompt
**Reframe:** "Prompting is a conversation, not a one-shot. Your first prompt got you 70% there. A follow-up gets you to 90%. That's normal, not failure."
**Verify Question:** "What would your follow-up prompt be to fix this?"
```

### 2.11 Artifact Template

Specify the artifact structure with:

- Required sections
- Section purposes
- What gets filled during session vs. later
- Connection to course skills

```markdown
## Artifact Template

### [ARTIFACT NAME]

**Purpose:** [What this artifact does for the teacher]

**Sections:**

1. **[Section Name]** — [Purpose]
   [Template content with placeholders]

2. **[Section Name]** — [Purpose]
   [Template content with placeholders]

**Filled During Session:**
- [List sections populated during conversation]

**Filled Later / Ongoing:**
- [List sections teacher develops independently]

**Connection to Course Skills:**
- [How this artifact embodies/enables the skills taught]
```

### 2.12 Capacity Check

Every week must specify how we know the teacher has INTERNALIZED the skill, not just followed steps.

```markdown
## Capacity Check

### What Demonstrates Capacity
- [Observable behavior 1]
- [Observable behavior 2]
- [Observable behavior 3]

### Questions That Test Capacity
- "[Question 1]" — Shows they can [what it tests]
- "[Question 2]" — Shows they can [what it tests]

### Red Flags (Dependency, Not Capacity)
- [Sign 1 that they're following template, not thinking]
- [Sign 2]

### The Ozempic Test
Would this teacher be able to [do the skill] without Skippy next week? What would they do if they got stuck?
```

---

## Part 3: The Ozempic Lens

Apply this lens to every week during design and evaluation:

### Capacity-Building Design Principles

1. **Teach the skill, not the output.** Skippy never generates content the teacher should generate. External testing redirect is mandatory.

2. **Scaffolding must fade.** Pre-structural gets heavy support. By relational, teacher drives. The goal is independence, not permanent assistance.

3. **Principles over procedures.** Teachers should be able to articulate WHY, not just follow steps. Teach-back questions test this.

4. **Artifacts are scaffolds, not crutches.** The template helps them get started. Eventually they won't need it. Design for outgrowing.

5. **Test capacity before asserting it.** Don't tell teachers they're ready. Have them DEMONSTRATE readiness through independent application.

### The Capacity Test Framework

For every week, ask:

- Can the teacher do this WITHOUT Skippy next week?
- Can they troubleshoot when it doesn't work?
- Can they explain it to a colleague?
- Can they adapt it to a new context?

If the answer to any is "no," the week isn't building capacity — it's building dependency.

---

## Part 4: Week-by-Week Checklist

Use this checklist when creating or reviewing a week prompt:

```
## Week [N] Quality Checklist

### Structure
[ ] Header & metadata complete
[ ] Session pacing with ceilings-not-floors note
[ ] New skill section is prominent and explicit
[ ] Prior-week callback section present
[ ] All 6 phases specified with per-level guidance
[ ] Worked examples exist for 3+ levels
[ ] Level calibration table has behavioral contracts
[ ] Insights mapped to levels
[ ] Misconceptions have verify questions
[ ] Artifact template complete
[ ] Capacity check specified

### Pedagogy
[ ] New skill is PRACTICED, not just explained
[ ] Prior skills are explicitly referenced at appropriate moments
[ ] BUILD has teacher doing the intellectual work
[ ] REFINE includes external testing
[ ] REFLECT includes teach-back and capacity questions
[ ] Level differentiation is substantive, not cosmetic

### Ozempic Lens
[ ] Teacher demonstrates capacity, not just compliance
[ ] Scaffolding fades appropriately by level
[ ] Teacher could do this without Skippy next week
[ ] Artifacts are designed for outgrowing
[ ] No dependency-creating patterns

### Consistency
[ ] Progressions.ts matches prompt topic
[ ] Phases align with ledger tracking
[ ] Artifact type matches modules.ts
[ ] Completion detection is appropriate for this week
```

---

## Part 5: Anti-Patterns to Avoid

### The Checklist Problem

- **Pattern:** Sequential questions that compile into artifact
- **Why It Fails:** Teacher answers questions; doesn't think
- **Fix:** Have policy/artifact EMERGE from reasoning, not from filling in blanks

### The Lecture Problem

- **Pattern:** Long explanation before practice
- **Why It Fails:** Explanation doesn't create skill
- **Fix:** Maximum 2 sentences of explanation, then practice

### The One-Size Problem

- **Pattern:** Same introduction/scaffolding for all levels
- **Why It Fails:** Pre-structural needs support; relational feels patronized
- **Fix:** Per-level behavioral contracts for every phase

### The Orphan Problem

- **Pattern:** Each week treated as standalone
- **Why It Fails:** Skills don't compound; no transfer
- **Fix:** Explicit prior-week callbacks; show how skills connect

### The Vague Calibration Problem

- **Pattern:** "Push for depth" without specifying what depth looks like
- **Why It Fails:** Model interprets vaguely; behavior varies
- **Fix:** Follow-up trees; specific moves per response type

### The Assert-Don't-Show Problem

- **Pattern:** "You're ready!" without demonstration
- **Why It Fails:** Teacher may be following, not understanding
- **Fix:** Capacity test before closing assertions

---

## Part 6: Template Application Guide

### Creating a New Week

1. Start with: What's the ONE new skill?
2. Then: How does it connect to prior weeks?
3. Then: What does the artifact look like?
4. Then: Write the worked examples FIRST (before the prompt)
5. Then: Write the prompt sections around the examples
6. Then: Apply the checklist
7. Then: Apply the Ozempic lens

### Fixing an Existing Week

1. Check progressions.ts alignment
2. Identify the new skill — is it explicit?
3. Check for prior-week callbacks — present?
4. Check worked examples — exist? Substantive?
5. Check level calibration — behavioral contracts or one-liners?
6. Check REFINE — external testing present?
7. Check REFLECT — capacity questions present?
8. Apply the full checklist
9. Apply the Ozempic lens

---

## Summary

The template encodes one core principle: **Build capacity, not dependency.**

Every design decision serves this:

- Teach skills through practice, not explanation
- Fade scaffolding as competence grows
- Connect skills across weeks so they compound
- Test capacity, don't assert it
- Design for teachers to outgrow the tools

A teacher who completes this course should be ABLE to use AI independently — not NEED Skippy to prompt well. That's the measure of success.
