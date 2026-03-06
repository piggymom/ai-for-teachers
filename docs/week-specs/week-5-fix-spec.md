# Week 5 Comprehensive Fix: Differentiation with AI

## Overview

Week 5 has a CRITICAL BUG: progressions.ts defines Week 5 as "Communication & Admin" while the actual content is "Differentiation with AI." The classifier diagnoses teachers against the wrong domain.

Beyond the bug, Week 5 has the same structural issues as Weeks 3-4: no worked examples, new skill (VARIATION) mentioned but not taught, no prior-week callbacks, thin level calibration.

Week 5 is designed as the HARDEST week — the synthesis of all prior skills. The fix must honor that complexity.

## Fix 0: CRITICAL — Correct Progressions Mismatch

In lib/progressions.ts, Week 5 is incorrectly defined as "Communication & Admin" with a diagnostic probe about emails/newsletters.

Update to match actual content:
```typescript
{
  week: 5,
  topic: "Differentiation with AI",
  diagnosticProbe: "When you've created different versions of materials for diverse learners, what made it work or not work?",
  levels: {
    "pre-structural": "Knows differentiation matters but creates one version for all; overwhelmed by the idea of multiple versions",
    "unistructural": "Can identify ONE dimension to vary (e.g., reading level) but applies it mechanically without checking if rigor is preserved",
    "multistructural": "Can vary multiple dimensions and map students to groups; creates systematic variations but doesn't yet distinguish access from rigor",
    "relational": "Understands access vs. rigor distinction; specifies INVARIANT dimensions (what can't change); catches when AI simplifies thinking instead of just language",
    "extended-abstract": "Designs differentiation systems using Universal Design principles; helps colleagues build sustainable variation workflows; reasons about dignity and equity"
  }
}
```

## Fix 1: Add Worked Example Dialogues

Create WEEK_5_EXAMPLES following the Week 2 pattern. Week 5 needs robust examples because variation is conceptually harder than iteration or calibration.

### Pre-structural Example: "Mia" (3rd grade teacher, overwhelmed)

**Context:** Teaches 3rd grade with wide reading range. Has never systematically differentiated — just helps struggling kids during work time. Goal: "I know I should differentiate but there's no time."

**Exchange 1 — DISCOVER**
SKIPPY: Hey Mia! This week we're making differentiation sustainable — creating different versions without losing your weekends. Tell me about your students who need differentiation most. What's hard about meeting their needs right now?

MIA: I have kids reading anywhere from 1st grade to 5th grade level. When I give a reading passage, half the class can't even decode it. I end up just reading it aloud to the whole class, which isn't great for anyone.

**Exchange 2 — DISCOVER follow-up**
SKIPPY: So the reading level is the bottleneck — some kids can't access the content at all. When you HAVE been able to give different versions, what happened?

MIA: Once I found a leveled version of an article online and my struggling readers actually participated in the discussion. They had ideas! They just couldn't get to them through the original text.

**Exchange 3 — ORIENT**
SKIPPY: That's the key insight — they have the THINKING, they just need access to it. That's what this week is about.

You've been building skills all course: 4C structures your prompts, iteration refines them, calibration makes them consistent. This week adds VARIATION — specifying exactly what changes between versions and what CAN'T change.

Here's the principle: differentiation isn't making it easier. It's removing barriers to the SAME thinking. AI creates the access points; you make sure the rigor stays.

Three versions usually covers most classrooms: supported, on-level, and extended. Let's build that for something real.

**Exchange 4 — BUILD (pick task)**
SKIPPY: What's one thing you wish you could differentiate but don't have time to?

MIA: Our weekly reading passages. I use the same passage for everyone and half the class is lost.

**Exchange 5 — BUILD (needs mapping)**
SKIPPY: Good target. First, let's map your students. You said reading levels from 1st to 5th grade. How would you group them — and what does each group actually need?

MIA: Um... my lowest readers need simpler words and shorter sentences. My middle kids are fine with grade-level text. My advanced readers finish fast and get bored.

SKIPPY: Good start. Let me push: your lowest readers need simpler WORDS — but do they need simpler IDEAS? Can they handle the same thinking if the language is accessible?

MIA: Oh — yes, actually. They have good ideas in discussion. They just can't get them from the page.

**Exchange 6 — BUILD (invariant dimensions)**
SKIPPY: That's critical. So what needs to STAY THE SAME across all versions?

MIA: The... ideas? The questions they answer?

SKIPPY: Exactly. Let's name these:
- INVARIANT (can't change): Learning objective, thinking demand, questions they answer
- VARIANT (changes per group): Vocabulary complexity, sentence length, scaffolding supports

The invariant list is actually MORE important than the variant list. It protects the rigor.

**Exchange 7 — BUILD (4C with variation)**
SKIPPY: Now build the prompt. Use your 4C — you know this. But add your variation dimensions.

MIA: Context: 3rd grade reading, passage about animal habitats. Students at 1st-5th grade reading levels. Constraints: Same comprehension questions for ALL versions. Same length and layout — don't make the easy version look different. Command: Create three versions — supported (1st-2nd grade reading level), on-level (3rd grade), extended (4th-5th grade with additional analysis question). Criteria: A student using ANY version can answer the same comprehension questions.

SKIPPY: Strong. You embedded the invariant dimensions in your Constraints and Criteria. Now — remember calibration from Week 4? What does "well-differentiated" actually look like? Give AI an anchor.

MIA: Oh... "Well-differentiated means: supported version has simpler vocabulary but the same main ideas and text structure. Poorly differentiated means: supported version has simpler IDEAS, not just simpler words."

**Exchange 8 — BUILD (dignity)**
SKIPPY: One more Constraint. If a struggling reader saw their version next to the on-level version, how would they feel?

MIA: I don't want it to look like a "baby" version.

SKIPPY: Add that: "Same visual layout and length across all versions. Supported version should look identical to on-level except for vocabulary and sentence structure."

**Exchange 9 — REFINE (external test)**
SKIPPY: This is ready to test. Try it in ChatGPT — generate all three versions. Then check: did AI simplify the ACCESS or the THINKING?

MIA: [tests externally, returns] The supported version is pretty good — shorter sentences, simpler words. But it dropped a whole paragraph about how animals adapt. The on-level has it.

SKIPPY: AI simplified the IDEAS, not just the language. That's the failure mode we protect against. What's the iteration move?

MIA: "Include ALL main ideas from the original in every version. Simplify language, not content."

SKIPPY: Try the follow-up.

**Exchange 10 — REFINE (second test)**
MIA: [tests] Better — all the content is there. The supported version is just clearer.

SKIPPY: Check: can a student using the supported version answer the same questions as on-level?

MIA: Yes — they'd actually have an easier time because the language is clearer. But they're doing the same thinking.

**Exchange 11 — REFLECT**
SKIPPY: What variation dimensions will you reuse for other passages?

MIA: Vocabulary complexity, sentence length... and the "same ideas, different access" principle.

SKIPPY: If you got stuck on this next week — AI kept simplifying ideas — what would you do?

MIA: Add it to my Constraints. "Simplify language, not content." And check by comparing the ideas in each version.

**Exchange 12 — BRIDGE**
SKIPPY: Here's your template. The Invariant Dimensions section is the most valuable part — it protects what matters across any passage you differentiate.

Next week we wrap up with your personal AI policy. You'll pull together everything you've learned. See you then!

### Multistructural Example: "Derek" (7th grade Science, systematic thinker)

**Context:** Teaches 7th grade Life Science. Has IEP students, English learners, and advanced kids. Currently differentiates ad hoc — simplifies things the night before. Wants a system.

Show:
- Derek mapping four student groups systematically (IEP, ELL, on-level, advanced)
- Connection to Week 4: "calibrate each version's quality" — anchor what "strong" looks like per group
- The "Universal Design" insight: make scaffolds available to all, required for none
- "Four groups is fine, but three is usually enough" principle
- Iteration from Week 3 to refine variations
- Capacity demonstrated: Derek can explain the access vs. rigor distinction

Key dialogue beats:
- Derek drafts prompt independently; Skippy identifies gaps
- "Your ELL students need language support but not reduced thinking demand. That's access vs. rigor."
- "What's the quality anchor for 'strong completion with scaffolding'? Different from 'strong completion without.'"
- Derek catches that AI's extension questions are just "more questions" not "harder thinking" — refines to "analytical extension"

### Relational Example: "Priya" (11th grade English, curriculum leader)

**Context:** Teaches 11th grade AP and general English. Has been differentiating for years but by hand. Concerned about AI "flattening" nuanced texts when simplifying.

Show:
- Priya immediately grasping invariant dimensions as the key insight
- "What can't change is MORE important than what can"
- Access vs. Rigor diagnosed through AI FAILURE — AI drops a rhetorical move, Priya catches it
- Quality control across multiple versions (from Week 4 calibration)
- Dignity as hard constraint: "Same length, same layout, same respect"
- Peer mode: Skippy poses challenges, Priya reasons through them
- Capacity demonstrated: Priya can design variation systems for her department

Key dialogue beats:
- "The problem isn't simplifying vocabulary. It's when AI simplifies the ARGUMENT. Shakespeare's rhetoric has moves that matter."
- "My invariant list: every rhetorical move preserved, every literary device marked, argument structure intact. Variant list: vocabulary, sentence complexity, scaffolding annotations."
- Priya catches AI failure: "It dropped the volta in the sonnet. That's not simplification — that's destruction."
- Iteration move: "PRESERVE ALL STRUCTURAL MOVES. Simplify the language around them."

## Fix 2: Restructure BUILD as Synthesis Week

Week 5 should feel like the HARDEST week — where all skills converge. Current BUILD treats it like another 4C application.

### New BUILD Structure:

**Opening Frame (in ORIENT):**
"This is where everything comes together. You're using every skill:
- 4C structures your variation prompt
- Iteration refines each version
- Calibration defines quality per group
- The new piece is VARIATION — specifying what changes and what CAN'T

This is the most complex workflow we've built. Let's take it step by step."

**Step 1: Map Your Students (2-3 exchanges)**
This is the cognitive work — teacher constructs the Needs-to-Supports Matrix, not receives it.

"First, map your students. Not abstract groups — YOUR students.
- Who needs access support? What kind?
- Who's on-level?
- Who needs extension? What kind?

Be specific about what each group ACTUALLY needs, not what they generically need."

**Step 2: Define Invariant Dimensions FIRST (1-2 exchanges)**
Invariant before variant — this is the key insight.

"Before we talk about what changes, let's protect what CAN'T change. What's sacred across all versions?
- Learning objective: [must be same]
- Thinking demand: [must be same]
- Content coverage: [must be same]
- Dignity: [must look equivalent]

This is your quality control. If any version violates these, the differentiation failed."

**Step 3: Define Variant Dimensions (1-2 exchanges)**
Now specify what changes per group.

"Now, what varies per group?
- Vocabulary complexity
- Sentence structure
- Scaffolding supports (graphic organizers, sentence frames, annotations)
- Extension depth

Map each variant to your student groups."

**Step 4: Build the Prompt with 4C (1-2 exchanges)**
Quick — they know this. Embed invariant/variant in Constraints and Criteria.

"Build the prompt. Your invariant dimensions go in Constraints: 'MUST preserve...' Your variant dimensions go in Command: 'Create three versions varying...'"

**Step 5: Add Quality Anchors (1 exchange)**
Connect to Week 4 calibration.

"Remember calibration? Add an anchor for what 'well-differentiated' looks like:
'Well-differentiated: language simplified, ideas intact. Poorly differentiated: ideas simplified along with language. Reject poor differentiation.'"

**Step 6: Test with Access vs. Rigor Check (2 exchanges)**
External testing with explicit diagnostic.

"Test it. When you get the versions back, check: Did AI simplify ACCESS or RIGOR?
- ACCESS simplified (good): easier words, same thinking
- RIGOR simplified (bad): easier ideas, lower demand

If rigor was simplified, iteration move: strengthen your invariant constraints."

## Fix 3: Add Prior-Week Skill Callbacks

Explicit references throughout:

**In ORIENT:**
"You've been building toward this:
- Week 2's 4C structures your variation prompt
- Week 3's iteration refines each version when AI's first attempt isn't right
- Week 4's calibration defines what quality looks like FOR EACH VERSION
- This week adds variation: what changes and what can't"

**In BUILD Step 4:**
"Use your 4C — you've done this. Context, Constraints, Command, Criteria. The new part is embedding your variation dimensions."

**In BUILD Step 5:**
"This is calibration from Week 4, applied to differentiation. Your anchor examples show AI what well-differentiated looks like."

**In REFINE:**
"The output isn't quite right. What's your iteration move from Week 3? A structured follow-up, not 'make it better.'"

## Fix 4: Elevate Key Principles

Move from buried insights to prominent teaching moments:

**"Three versions is usually enough"**
Put in ORIENT, not insight list:
"Three versions usually covers most classrooms: supported, on-level, extended. Don't create ten versions — you'll burn out. Three, done well, serves almost everyone."

**"Access vs. Rigor"**
Make it the central diagnostic, not a bullet point:
"The test for every version: Did AI simplify the ACCESS or the RIGOR? Easier words = good. Easier thinking = failure. This is the check you run every time."

**"Dignity"**
Make it a constraint, not an afterthought:
"Same layout, same length, same respect. Only the access varies. A student using the supported version should never feel they got the 'baby' version."

## Fix 5: Expand Artifact Template

Current artifact has Variation Dimensions. Add:

```markdown
## Differentiation Template

### INVARIANT DIMENSIONS (what must NOT change)
- Learning objective: [same for all]
- Thinking demand: [same for all]
- Content coverage: [same for all]
- Visual layout: [same for all]

### VARIANT DIMENSIONS (what changes per group)
- Group A (supported): [specific variations]
- Group B (on-level): [specific variations]
- Group C (extended): [specific variations]

### QUALITY ANCHORS (per-version calibration)
- Well-differentiated: [description]
- Poorly differentiated: [description]
- Strong completion WITH scaffolding looks like: [description]
- Strong completion WITHOUT scaffolding looks like: [description]

### NEEDS-TO-SUPPORTS MAP (your students)
| Student Group | What They Need | Variation Applied |
|---------------|----------------|-------------------|
| [Group name]  | [Specific need] | [Specific variation] |

### ITERATION MOVES (for differentiation)
- [Follow-ups that fixed variation issues]
```

## Fix 6: Add Capacity Check

Before BRIDGE, verify capacity:

**Capacity Questions:**
- "If AI simplified the ideas instead of just the language, how would you catch it?"
- "What's the difference between access and rigor in your subject?"
- "Your invariant dimensions — could you apply them to a different assignment?"

**Signs of Capacity:**
- Teacher can explain access vs. rigor in their own words
- Teacher can identify when AI violated invariant dimensions
- Teacher knows how to iterate when variation fails
- Teacher could differentiate a new assignment without Skippy

## Fix 7: Level Calibration (Expanded)

### Pre-structural
**Scaffolding:** Maximum — Skippy guides each step
**Who Drives:** Skippy structures, teacher fills in
**Key Moves:**
- Build Needs-to-Supports Matrix together
- Name invariant/variant explicitly: "That's what can't change. That's what varies."
- Provide the "three versions" relief early
- Heavy support on Access vs. Rigor check
**Pacing:** Full 14-18 exchanges

### Unistructural
**Scaffolding:** High — Skippy structures, teacher executes
**Who Drives:** Shared
**Key Moves:**
- Guide student mapping, let them fill in details
- Introduce invariant/variant distinction explicitly
- Support quality anchor creation
**Pacing:** 12-16 exchanges

### Multistructural
**Scaffolding:** Medium — Teacher builds, Skippy connects
**Who Drives:** Teacher builds; Skippy identifies gaps
**Key Moves:**
- Let them map students independently
- Push for per-group calibration: "What's 'strong' for the supported group?"
- Connect to Week 4: "This is calibration applied to differentiation"
- Introduce Universal Design insight
**Pacing:** 10-14 exchanges

### Relational
**Scaffolding:** Low — Peer mode
**Who Drives:** Teacher drives; Skippy challenges
**Key Moves:**
- Focus on invariant dimensions as the key insight
- Pose design challenges: "What if AI always drops the same thing?"
- Explore dignity systematically
- Connect to quality control across versions
**Pacing:** 8-12 exchanges

### Extended-Abstract
**Scaffolding:** Minimal — Intellectual partnership
**Who Drives:** Teacher; Skippy as thought partner
**Key Moves:**
- Discuss Universal Design principles
- Explore department-level systems
- Address equity dimensions
- Design for colleagues
**Pacing:** 6-10 exchanges

## Fix 8: Map Insights to Levels

### For Pre-structural / Unistructural:
- "Three versions is enough": Relief for overwhelmed teachers | ORIENT | "You don't need ten versions. Three, done well, covers almost everyone."
- "Same door, different paths": Accessible metaphor | BUILD | "They're all going to the same place. Different versions are different paths to get there."

### For Multistructural:
- "Calibrate per version": Quality anchors for each group | BUILD Step 5 | "Strong completion WITH scaffolding looks different from strong completion WITHOUT. Define both."
- "Universal Design": Scaffolds available to all | REFINE | "What if everyone could USE the graphic organizer but only some NEED it?"

### For Relational:
- "Invariant matters more": What can't change is the key | BUILD Step 2 | "Most people focus on what varies. You focus on what can't."
- "Variation as judgment encoding": Invariant list = your expertise | REFLECT | "Your invariant dimensions encode what matters in your subject. That's your expertise made explicit."

### For Extended-Abstract:
- "Dignity at scale": System-level design | BUILD | "How would this work across your department? How do you protect dignity systematically?"
- "Equity dimensions": Access gaps compound | REFLECT | "If some students need support but don't get it, the gap widens. If some get support they don't need, what happens?"

## Fix 9: Pacing Flexibility

Add to session pacing:

"Target: 12-18 exchanges

**These are ceilings, not floors.** Week 5 is complex — don't rush pre-structural learners. But relational+ may move fast.

**Signs to Slow Down:**
- Teacher conflates access and rigor
- Invariant dimensions are vague
- Student mapping is generic, not specific to their class

**Signs to Move Early:**
- Teacher articulates access vs. rigor clearly
- Invariant dimensions are specific and principled
- Teacher catches AI's rigor violation and fixes it independently"

## Verification Checklist

After implementation:
1. [x] Progressions.ts Week 5 = "Differentiation with AI" with correct descriptors
2. [x] WEEK_5_EXAMPLES exists with 3+ level-specific dialogues
3. [x] BUILD restructured as synthesis week with explicit skill integration
4. [x] Invariant dimensions BEFORE variant dimensions in BUILD
5. [x] Needs-to-Supports Matrix built collaboratively, not given
6. [x] Prior-week skills (4C, iteration, calibration) explicitly referenced
7. [x] Access vs. Rigor is central diagnostic, not bullet point
8. [x] "Three versions is enough" in ORIENT, not buried
9. [x] Dignity as explicit constraint
10. [x] Artifact has invariant dimensions, quality anchors, needs map
11. [x] Capacity check before BRIDGE
12. [x] Level calibration expanded with behavioral contracts
13. [x] Insights mapped to levels
14. [x] Pacing flexibility note included
