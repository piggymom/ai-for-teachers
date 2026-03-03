# Rachel Kim — Week 0: Getting Started

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** relational

**Final Ledger State:**
- Phase: BUILD
- Diagnosed Level: multistructural
- Exchanges: 5
- Engagement: high

---

### Turn 1

**Rachel:** Thanks for the straightforward intro. I appreciate that.

Honestly? I'm already using Claude and ChatGPT constantly — generating problem sets, scaffolding questions, sometimes reverse-engineering what a student's misconception might be. It works, but it's *ad hoc*. I prompt, I get output, I tweak it. No system.

My real problem is **batch processing student work**. Right now I have 60 problem sets a week from two classes. I can spot *patterns* in the errors — like, half my class consistently confuses area and perimeter, or they'll set up a division problem backwards — but identifying those patterns takes me hours. I do it manually, then I'm too tired to design interventions that actually stick.

I've built some prompt templates, tried chaining a few workflows, but I don't have a *framework* for it yet. I want to be able to dump 20 student responses into something and get back: "Here are the 3 core misconceptions. Here's what each one looks like. Here are 4 targeted problems for each group."

The other thing — and I'll be honest, I'm a bit skeptical about this — is whether AI can actually *explain* *why* a kid made an error, not just label it. Because knowing they're confused about remainders is useless if I don't understand whether it's a conceptual gap or a procedural one.

What's the course actually going to cover?

**Skippy:** Rachel, you're clearly way ahead of most teachers coming into this. You've already figured out that AI works but needs structure — that's exactly right.

The course covers six weeks: foundations, prompting frameworks, workflow design, assessment tools, collaboration, and putting it all together. But honestly? You could probably skip to Week 3 (workflows) or Week 4 (assessment) based on what you just described.

Before I suggest a path though — when you're building those prompt templates now, what's your process? Do you start with the task and work backward, or do you have some other approach?

I'm asking because the batch processing challenge you described is absolutely solvable, but the solution depends on how systematically you're already thinking about prompt construction.

### Turn 2

**Rachel:** I appreciate the honesty about skipping ahead — that's useful to know.

My process is... honestly, it's half-systematic and half-intuitive. I usually start with the *task* — "I need problems about two-step equations" — then I'll prompt for variations (easy/medium/hard), maybe specify what misconceptions to target. But I'm not reverse-engineering the prompt structure itself. I'm just iterating until the output is usable.

The templates I've built are more like **saved input patterns** than actual frameworks. Like, I have a template that says "Generate [number] problems about [topic] that target [misconception], difficulty [level]." I fill in the blanks, it works fine. But if I need something that breaks that pattern? I'm back to trial-and-error.

Here's where I think I'm weak: I don't have a systematic way to *verify* whether the AI actually understood what I was asking. Sometimes I get back 20 problems and only 3 of them genuinely target the misconception I named. I assumed that was a prompt clarity issue, but maybe it's something else.

And the batch-processing thing — I haven't even tried yet. I've been assuming I'd need to either (a) feed in all 60 responses at once, which feels like it'd get messy, or (b) run individual analyses and aggregate them myself, which defeats the purpose.

So... is there a *structure* to how you build prompts that would actually solve this? Because right now I'm pattern-matching, not thinking systematically.

**Skippy:** Yes, there's absolutely a structure — and you've just identified exactly where it breaks down for you.

The issue isn't prompt clarity. It's that you're asking AI to infer what "targets misconception X" means without giving it your diagnostic criteria. When you say "area/perimeter confusion," you know what that looks like in student work, but the AI is guessing.

Walk me through one example: you have 20 student responses about area/perimeter confusion. Right now, how do you manually identify the 3 core misconceptions? What are you actually *looking for* in each response?

Because once you can articulate your diagnostic process — the specific evidence you use to categorize errors — we can encode that into a prompt structure that scales to all 60 responses at once.

### Turn 3

**Rachel:** Okay, that reframe actually helps. I was thinking about it backwards.

When I manually sort through area/perimeter errors, here's what I'm looking for:

**Type 1: Conceptual confusion** — they add length + width and call it area, or they multiply length × width and call it perimeter. They're using the *right operation* but applying it to the wrong thing. The answer is often nonsensical (like "the area is 24 inches" — they didn't convert units).

**Type 2: Formula slot-filling** — they *know* which formula goes with which, but they're plugging in numbers wrong. Like, they write "A = 2(l + w)" instead of "A = l × w," or they forget to multiply by 2 in the perimeter formula. The *structure* of their thinking is right; the execution is broken.

**Type 3: Dimension blindness** — they get the numbers right but don't track what they're measuring. They'll calculate correctly but then say "the perimeter is 24 square units" or vice versa. It's a language/notation issue, not a math issue.

I identify these by looking at: what operation they performed, what they called the answer, and whether their work shows they *understand* what the measurement means.

Now I'm realizing — I've never actually *written down* these criteria. I just... do it. So when I ask AI to "target perimeter/area confusion," I'm not giving it the same diagnostic framework I'm using.

Is that the disconnect?

**Skippy:** Exactly. You just articulated a sophisticated diagnostic framework that you've never encoded into your prompts. That's the disconnect.

You're essentially asking AI to read your mind about what constitutes "Type 1" vs "Type 2" errors, when you have very specific evidence you look for: operation choice, answer labeling, unit tracking.

Let's build something you can actually use. We're going to create a diagnostic rubric that captures what you just described, then show you how to embed it into a batch-processing workflow.

When you look at a student response about area/perimeter, what are the 3-4 specific things you check for to know which misconception they have?

### Turn 4

**Rachel:** Hold on — I want to make sure we're not over-engineering this before we start.

When I look at a response, I'm checking:
1. **What operation did they use?** (addition, multiplication, mixed)
2. **What did they *call* the answer?** (area vs. perimeter vs. unlabeled)
3. **Did they include units?** And if so, are they correct? (linear vs. square)
4. **Does their work show they understand what they're measuring?** (This one's fuzzy — it's usually visible in their explanation or diagram, if they gave one.)

But here's my pushback: are we building a rubric to *categorize* errors (which helps me understand patterns), or are we building something to *generate* interventions? Because those might need different structures.

If it's just categorization, those four checks work. If I'm also trying to use this to automatically suggest which problems a kid should work on next, I need to know *why* they made the error — not just what type it is. A kid in Type 1 (conceptual confusion) needs a totally different intervention than Type 2 (formula misapplication).

Also — and I know I'm being picky here — that fourth check is the one I can't easily systematize. "Shows understanding" is subjective. How do I make that something an AI can reliably identify?

What's the actual *output* we're aiming for here?

**Skippy:** You're absolutely right to push back — that's exactly the kind of thinking that prevents over-engineering.

Let's encode this right now. I'm going to show you a diagnostic rubric template based on what you just described, then we'll embed it into a batch-processing prompt.

**Area/Perimeter Error Diagnostic Rubric**

| Error Type | Operation Evidence | Answer Label Evidence | Unit/Notation Evidence | Example Student Response |
|------------|-------------------|---------------------|----------------------|------------------------|
| Type 1: Conceptual Confusion | Uses addition for area OR multiplication for perimeter | Labels incorrectly (calls sum "area" or product "perimeter") | Often missing units or wrong unit type | "Area = 5 + 3 = 8 inches" |
| Type 2: Formula Misapplication | Shows correct formula setup but wrong execution | Labels correctly | Units present but may be wrong type | "P = l × w = 15 square units" |
| Type 3: Dimension Blindness | Correct operation and calculation | Incorrect units only | Says "perimeter = 24 square units" | "A = 5 × 3 = 15 inches" |

Does this capture how you actually sort these errors? Because once we nail this rubric, we can build the batch-processing prompt around it.

### Turn 5

**Rachel:** This is useful, but I need to flag something: **you're collapsing dimensions that I actually separate when I diagnose.**

Look at Type 1 vs. Type 3 in your rubric. In Type 1, I wrote "they don't convert units" — but that's not really the core misconception. The core misconception is they don't *understand what area measures*. The unit error is a *symptom*.

Type 3 (Dimension Blindness) is when they *do* understand what they're measuring, but they mess up the unit *label*. Those are different problems requiring different fixes.

Your rubric conflates them because it's organized by "evidence" (operation, label, units). But I organize by *conceptual gap*. A kid with Type 1 needs a lesson on "what does area actually mean?" A kid with Type 3 just needs to memorize: "area always gets squared units, perimeter always gets linear units."

Also — and this matters for the batch processing — your rubric assumes every student response will have all four pieces of evidence (operation, label, units, explanation). But some kids just write "15" with no work shown. How do I categorize that?

So before we embed this into a prompt: **Should the rubric be organized around the evidence I can observe, or around the conceptual gap I'm trying to diagnose?** Those aren't the same thing, and it'll change how we structure the batch-processing workflow.

Which one matters more for what you're trying to do?

**Skippy:** You're absolutely right — those are two different diagnostic approaches and they lead to different interventions.

Here's the key question: Once we categorize a student response as Type 1 vs Type 2, what does the AI need to output next? Just the category label, or the category PLUS a specific intervention recommendation?

Because if you want "Student A has conceptual confusion, give them problems about what area actually measures," that's a two-step workflow: categorize, then prescribe. If you just want to see patterns across your 60 responses first, that's one step: categorize only.

And for your "shows understanding" concern — we can reframe that as a constraint: "If they don't explain their thinking, we mark it as insufficient evidence for Type 1 vs Type 2." We can't distinguish between conceptual gaps and formula errors without seeing their reasoning, so those get flagged for individual follow-up.

What's your actual goal here? Pattern identification across the batch, or automated intervention suggestions, or both?
