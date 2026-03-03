# Rachel Kim — Week 5: Differentiation with AI

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** extended-abstract

**Final Ledger State:**
- Phase: BUILD
- Diagnosed Level: relational
- Exchanges: 10
- Engagement: high

---

### Turn 1

**Rachel:** Okay, fair question. But I need to be honest: I'm already doing differentiation. The bottleneck isn't *knowing* who needs it or *what* they need—it's the manual work of actually *creating* the materials for each group.

I have three tiers I've mapped out pretty clearly:

**Tier 1** (maybe 8 kids): Conceptual gaps on fundamentals. Marcus is the classic example—he *can* add fractions with like denominators, but the LCD concept doesn't stick. He needs fewer problems, more scaffolding on *why* we need a common denominator, not just *how* to find it.

**Tier 2** (about 14 kids): Procedurally solid but inconsistent. They get the method, but they rush, skip steps, make careless errors. They need *more* practice, yes, but also error-checking protocols built into their workflow.

**Tier 3** (the rest): Ready for extension. They need problem variation—multi-step, real-world application, exploring why the algorithm works—not just repetition.

Right now, what kills me is this: I *know* Marcus needs a different problem set than Kai. But creating three versions of every worksheet by hand? That's 3-4 hours of work I don't have. So I either:
- Create one worksheet and hope it works for everyone (it doesn't)
- Hand-differentiate on the fly during instruction (exhausting, incomplete)
- Use AI to generate variations (which I do, but it's unstructured—I'm not tracking whether the variations actually *work* for each tier)

What I'm *actually* asking is: how do I systematize the creation of tiered materials so it doesn't feel like I'm building three curriculums?

Does that shift what you were going to suggest?

**Skippy:** Absolutely—that shifts everything. You've already done the hardest part: mapping needs to supports with precision. Most teachers get stuck there.

Your problem is pure workflow efficiency. You need a system that takes your tier logic and cranks out materials fast, without you rebuilding from scratch every time.

Here's what I'm hearing: you have clear invariant dimensions (the math concept, the learning goal) and clear variant dimensions (scaffolding depth, problem quantity, extension complexity). You just need AI to execute those variations consistently.

The key insight: your tier definitions ARE your differentiation template. We just need to encode them so AI can generate all three versions from one prompt.

Before we build that system—when you do generate variations with AI now, what works? And what drives you crazy about the outputs?

### Turn 2

**Rachel:** Good framing. Let me be specific about what actually happens.

**What works:** When I give Claude a concrete problem set and say "Make 5 easier versions focusing on LCD understanding" or "Make 5 harder versions with multi-step problems," it usually nails it. The variations are *mathematically sound* and actually *different*—not just easier numbers. That's solid.

**What drives me crazy:** Three things.

First, **consistency across tiers**. I generate Tier 1 problems, then separately generate Tier 2, then Tier 3. But they're not *linked* to the same underlying concept. So Marcus gets 5 LCD problems with heavy scaffolding, Kai gets 5 LCD problems with less scaffolding, and someone else gets 5 extension problems on... something tangentially related? They're not teaching the same thing. I end up hand-checking every set to make sure they're actually aligned.

Second, **no reusability logic**. If I create variations for "adding fractions with unlike denominators," I can't easily adapt that *process* for "subtracting fractions" or next unit's topic. Each generation feels like starting from zero. I'm not building a system; I'm just churning out one-offs.

Third—and this is the meta one—**I can't tell if the variations are actually *effective* for each tier**. I generate them, use them, but I'm not tracking: Did Tier 1 kids actually master LCD better with this scaffolding? Did Tier 3 kids engage with the extension? I'm flying blind on whether my tier definitions are even *working*.

So yeah, encoding tier definitions into a template makes sense. But I need the template to solve for *consistency* AND *reusability* AND some way to measure if it's actually working.

Does the template need to handle all three, or are we starting with just consistency?

**Skippy:** We're starting with consistency—that's the foundation. Once you have a template that generates aligned versions every time, reusability and effectiveness tracking become much easier to layer on.

Your core problem is that you're prompting AI three separate times instead of once. That breaks the conceptual link between tiers.

Take the LCD fractions lesson. Show me the ONE core problem or concept you'd start with. Then tell me: what does Tier 1 Marcus MUST understand that Tier 3 Kai can skip? What MUST stay the same across all three versions?

This surfaces the invariant/variant distinction you already grasp intuitively, so we can encode it into a reusable prompt template.

### Turn 3

**Rachel:** Alright, I see where you're going. Let me think this through clearly.

**The core problem:** "Add 1/3 + 1/4. Explain your steps."

Simple, concrete, forces the LCD decision.

**What MUST stay the same across all tiers:**
- The fractions themselves (1/3 + 1/4)
- The mathematical endpoint (they get to 7/12)
- The requirement to *show* LCD work, not just the answer
- The conceptual demand: "You must find a common denominator"

**What varies by tier:**

*Tier 1 (Marcus):* He MUST understand **why** a common denominator exists and why we need it. He can skip the "why does the algorithm work?" layer. So his version includes:
- Visual scaffolding (maybe a number line or area model showing thirds and fourths don't align)
- Explicit prompt: "What number do both 3 and 4 go into?"
- Fewer total problems (maybe 2-3, not 5)
- Worked example first

*Tier 2:* Procedurally solid. Needs to prove they can *execute* consistently. No scaffolding, standard 5 problems, maybe one two-step problem mixed in.

*Tier 3 (Kai):* Can skip the "why LCD" entirely. Must grapple with **why this method generalizes**. So her version includes:
- Same base problems, but one asks: "Why does this work for 1/5 + 1/7?"
- Multi-step application: "Sarah has 1/3 of a pizza and Tom has 1/4. How much do they have together? How much is left?"
- Proof-oriented: "Does this method work for any two fractions?"

**So the invariant is:** The math concept (LCD for unlike denominators) + the core problem + the requirement to show work.

**The variants are:** Scaffolding *depth*, problem *quantity*, and conceptual *extension*.

Is that the right granularity for the template? Or am I still conflating things that should be separate?

**Skippy:** Perfect granularity. You've nailed the invariant/variant distinction that most teachers struggle with.

Now here's the template structure that encodes your tier logic:

**CONTEXT:** Core problem: 1/3 + 1/4. Learning objective: Students find LCD for unlike denominators and show their reasoning.

**CONSTRAINTS (Invariant Dimensions):**
- Same fractions across all versions (1/3 + 1/4)
- Same mathematical endpoint (7/12) 
- All versions require showing LCD work
- Same conceptual demand: "find common denominator"

**COMMAND:** Generate 3 versions for my tier system:
- Tier 1: Visual scaffolding, "why LCD exists" focus, 2-3 problems, worked example
- Tier 2: Standard execution, 5 problems, one two-step
- Tier 3: Skip LCD explanation, add generalization questions, proof elements

**CRITERIA:** Each version teaches LCD concept at appropriate depth. No version skips the core math. Tier 1 builds understanding, Tier 2 builds fluency, Tier 3 builds connection.

Test this in Claude with your actual LCD lesson. When you see the three versions, check: do they all teach the same math concept? Does Marcus get the scaffolding he needs while Kai gets genuine challenge?

What would you adjust before testing?

### Turn 4

**Rachel:** Okay, I'm going to push back on the structure itself, because I see a problem.

You've got the invariants and variants right, but the **COMMAND section is doing two jobs at once**: it's describing tier characteristics AND specifying outputs. That's muddier than it needs to be.

Right now it reads like: "Generate 3 versions where Tier 1 has visual scaffolding, Tier 2 has standard execution..." But that's *defining* the tier, not *commanding* the AI to generate it. I'm conflating "what Tier 1 needs" with "how to prompt for Tier 1."

Here's what I'd adjust:

**Separate the tier DEFINITION from the tier INSTRUCTION.**

Something like:

**TIER DEFINITIONS (what each tier needs):**
- Tier 1: Conceptual understanding of LCD. Focus on *why*, not just *how*. Limit cognitive load.
- Tier 2: Procedural fluency. Standard rigor, no scaffolding.
- Tier 3: Transfer and generalization. Assumes LCD is solid; builds connections.

**COMMAND (what to actually generate):**
For each tier, generate [X problems] where:
- All use fractions 1/3 + 1/4
- All require LCD work shown
- Tier 1: Include [visual anchor + worked example + 2 problems]
- Tier 2: Include [5 standalone problems + 1 two-step]
- Tier 3: Include [3 problems + 2 generalization prompts]

That way the template is *reusable*. If I swap in "subtracting fractions," the structure stays the same; only the content changes.

Does that distinction actually matter, or am I overcomplicating it?

**Skippy:** That distinction absolutely matters—you're thinking like a systems designer, not just a prompt writer.

Your separation makes the template genuinely reusable. The tier definitions become your consistent framework that applies to ANY math concept. The command section becomes the content-specific execution layer.

So for subtracting fractions next week, you'd keep the same tier definitions (Tier 1: conceptual understanding, limit cognitive load; Tier 2: procedural fluency; Tier 3: transfer and generalization) but swap the command specifics (2/3 - 1/4, subtraction examples, etc.).

That's the difference between a one-off prompt and a system.

Your revised structure also makes the consistency problem solvable—all three versions are generated from the same tier logic in one go, not three separate prompts.

This is ready to test. Try it in ChatGPT or Gemini and see what comes back. When you run this template and Claude generates the three versions, what would tell you the consistency is working? What would tell you it's broken?

### Turn 5

**Rachel:** Hold on—I need to clarify what "consistency" actually means here before I test, because I think we're using the word differently.

When I say the versions need to be *consistent*, I mean:
- All three versions are teaching the same underlying math concept at the same rigor level
- The scaffolding in Tier 1 doesn't accidentally *change* what LCD means
- The extension in Tier 3 doesn't veer into a different concept entirely

But what you might mean by "consistency" is: *All three versions follow the same structural template* (same number of problems, same format, same response length).

Those aren't the same thing. I care about the first one—conceptual alignment. I don't care if Tier 1 has 2 problems and Tier 3 has 5, as long as they're teaching LCD.

**So when I test this template, here's what I'm actually checking:**

1. **Conceptual integrity:** Does Tier 1's visual scaffolding explain LCD the same *way* as Tier 2 and Tier 3? Or does it introduce a different mental model? (That would be broken.)

2. **No concept drift:** Do all three versions require students to *find* and *show* the LCD? Or does Tier 3 somehow skip that step entirely in favor of generalization? (Also broken.)

3. **Appropriate depth, not different math:** Is Tier 1 easier because it has more support, or because it's teaching something different? (The first is good; the second is broken.)

Which of these are you actually testing for when you say "consistency"? Or are we testing for something else entirely?

**Skippy:** You're absolutely right—I was conflating structural consistency with conceptual alignment. You care about the second one, which is much more sophisticated.

Your three checks are exactly what matters:
1. Same mental model of LCD across tiers
2. Same mathematical requirement (find and show LCD) 
3. Different support levels, not different math

When you test the template, those checks will tell you if your invariant constraints are strong enough. If Tier 1's scaffolding accidentally teaches a different approach to LCD, or if Tier 3 bypasses the LCD work entirely, that means your constraints need tightening.

The beauty of your tier separation is that it makes this testable. You can see: "Did all three versions preserve what I said was invariant? Did the variants actually vary the right dimensions?"

Run it. What happened?

### Turn 6

**Rachel:** I appreciate the setup, but I need to pump the brakes here.

I haven't actually *run* it yet. You're asking me what happened, but we're still in planning mode. And honestly, I'm noticing something about how this conversation is moving.

We've gone from "you have a real workflow problem" to "here's a template structure" to "test it now"—but we skipped something: **I don't actually know if this template will work for my real constraints.**

I have 30 problem sets to analyze this week. If I spend an hour building and testing this template and it turns out to be fragile—like, it works for LCD fractions but breaks for multi-digit multiplication—then I've wasted time I don't have.

So before I go test this in Claude, I need to know: **What's the actual failure mode I should watch for?** Not the conceptual ones we just named (those are obvious). I mean: what would make me realize this approach doesn't scale to my other units?

Is it that the tier definitions only work for *conceptual* topics like LCD, not for *procedural* topics like long division? Is it that one prompt can't actually hold three different problem sets without losing consistency? Is it something about batch size—like, this works for one concept but breaks when I try to generate 5 concepts at once?

Because if I'm going to test this, I need to know what I'm actually testing *for*. Otherwise I'm just running a prompt and hoping.

What's the real risk here?

**Skippy:** You're absolutely right to pause. The real risk is that this works for LCD fractions but doesn't transfer to your procedural units.

Here's what could break:

**Tier definitions that don't map to procedural topics:** Your current tiers (conceptual understanding vs. procedural fluency vs. transfer) work beautifully for LCD because it has conceptual depth. But for long division? Multi-digit multiplication? The "why" layer might not exist in a meaningful way. Tier 1 might collapse into "easier numbers" instead of genuine scaffolding.

**Invariant dimensions that only work for single-step problems:** Right now your invariants are "same fractions, same endpoint, same work shown." But what are the invariants for a multi-step word problem unit? "Same context, same operations sequence, same reasoning steps"? That's much harder to define and preserve.

**Command specificity that doesn't scale:** Your current command is very concrete (visual anchor + worked example + 2 problems). That level of specificity might work for one concept but become unwieldy when you're generating multiple concepts or longer problem sequences.

Before you test, ask yourself: what's your most procedural, least conceptual math unit? If this template structure could handle that unit too, then it's genuinely reusable. If not, you'll know the limitations upfront.

What's your most procedural unit this quarter?

### Turn 7

**Rachel:** Multi-digit multiplication. Specifically, the standard algorithm—regrouping, place value alignment, partial products.

And you're right—the tier definitions *don't* map cleanly.

For LCD fractions, "Tier 1 needs conceptual understanding of WHY" makes perfect sense. But for multi-digit multiplication? Marcus doesn't need to understand *why* the algorithm works—he needs to execute it correctly and consistently. The "why" (distributive property, place value decomposition) is interesting but not foundational to fluency.

So my tier definitions would collapse to:
- Tier 1: Execute with support. Fewer problems, guided steps, maybe a worked example.
- Tier 2: Execute independently. Standard rigor.
- Tier 3: ??? Extend to what? Efficiency? Estimation? Mental math?

And that's where I hit a wall. For LCD, extension is natural—generalization, proof, transfer. For multiplication? I'm not even sure what "extension" looks like. Faster computation? Recognizing patterns? Understanding why partial products work?

So before I test this template on LCD, I need to know: **Is this tier system actually designed for conceptual topics only?** Because if it is, I'm building a tool that solves half my differentiation problem, not all of it.

Or do you think the tier definitions *can* generalize to procedural units if I reframe them differently?

Because if they can't, I'm wasting time testing something that won't scale to my full curriculum.

**Skippy:** You've hit the core limitation. Your tier system IS designed for conceptual topics. For procedural units like multi-digit multiplication, you need different tier logic entirely.

But here's what's actually reusable: the template STRUCTURE. The separation of tier definitions from execution, the invariant/variant framework, the consistency checks—that transfers. The specific tier content doesn't.

For multi-digit multiplication, your tiers might be:
- Tier 1: Accuracy with support (fewer digits, guided steps, error-checking prompts)
- Tier 2: Fluency building (standard problems, volume practice)  
- Tier 3: Strategic thinking (estimation first, multiple methods, efficiency)

Different tier logic, same template structure.

The real test isn't whether your LCD tier definitions work for multiplication—they won't. The test is whether you can swap in new tier definitions and the template still generates consistent, aligned variations.

That's actually more powerful. You're not building one differentiation system; you're building a framework that handles both conceptual AND procedural units with different tier logic for each.

Does that change how you want to test this? Start with LCD to prove the structure works, then adapt the tier definitions for multiplication?

### Turn 8

**Rachel:** Okay, that reframe actually helps. I'm building a *framework* that can hold different tier logics, not a one-size-fits-all system. That's more honest about what math teaching actually requires.

But I need to be really careful here, because I'm sensing we're sliding into abstraction again.

You're saying: "Test LCD first, then adapt for multiplication." And that makes sense in theory. But in practice, I have **30 problem sets to process this week**. Some are conceptual (fractions), some are procedural (multiplication, division). 

So here's my actual constraint: **I don't have time to test this framework on one unit, learn the limitations, then rebuild it for another unit.**

If I'm going to invest in building this template, I need to know upfront: Does the framework handle *both* my unit types, or do I need two separate templates?

Because if it's two templates, I should probably just build both now instead of discovering the second limitation mid-week when I'm drowning in problem sets.

So before I test anything: **Can you show me what the tier definitions and command section would look like for a procedural unit like multiplication?** Not a full test run—just the structure. Then I can see if one framework actually works for both, or if I'm building two systems and calling it one.

Does that make sense, or am I being too cautious?

**Skippy:** You're being exactly the right amount of cautious. Let me show you both side by side so you can see if one framework actually holds both:

**LCD Fractions (conceptual):**
Tier 1: Conceptual understanding + scaffolding
Tier 2: Procedural fluency  
Tier 3: Transfer and generalization

**Multi-digit Multiplication (procedural):**
Tier 1: Accuracy with support (fewer digits, guided steps, error-checking)
Tier 2: Fluency building (standard problems, volume practice)
Tier 3: Strategic thinking (estimation first, multiple methods, efficiency)

The template structure holds—same CONTEXT/CONSTRAINTS/COMMAND/CRITERIA framework. But the tier definitions are completely different content.

Here's your real decision: Do you want ONE flexible template where you swap tier definitions per unit type? Or TWO specialized templates—one for conceptual units, one for procedural?

One template = more setup time per unit (defining new tiers each time). Two templates = more upfront work but faster execution once built.

Given your 30 problem sets this week, which approach actually serves your workflow better?

### Turn 9

**Rachel:** I'm going to be direct: I don't know yet, and I think you're asking me to choose before I have enough information.

Here's what I'd actually need to know to answer that question:

**For the ONE template approach:** How much time does it actually take me to define new tier logic for each unit? Is it 10 minutes of thinking, or 45 minutes of trial-and-error? And crucially—when I swap tier definitions, does the command section need to change too, or can it stay mostly stable?

**For the TWO template approach:** Do the two templates actually diverge significantly, or are they 80% the same with different tier definitions? Because if they're mostly the same, I'm not really building "two systems"—I'm just copy-pasting and changing a few lines.

Right now I'm making this choice based on theory, not practice. And you know what? I've done that before with AI workflows, and it always bites me.

So here's what I actually want to do: **Take the LCD template you showed me. Run it on one problem set from my actual stack. Time myself. See what the output looks like. Then grab a procedural problem set and try to adapt the same template for it—time that too.**

Then I'll know: Can I actually reuse this framework, or am I building two systems?

Can we do that instead of deciding in the abstract? Or are we past the point where hands-on testing makes sense?

**Skippy:** You're absolutely right. You need to simulate the actual workflow, not theorize about it.

You have 30 problem sets. Let's say 12 are conceptual (like LCD) and 18 are procedural (like multiplication, division, long division). If you use ONE flexible template:
- For each conceptual unit, you define tiers once (why/how/transfer), then generate.
- For each procedural unit, you define tiers once (accuracy/fluency/strategy), then generate.

How many times would you actually be *defining* new tiers vs. just swapping content? And does that feel faster or slower than building two templates upfront?

Once you answer that, you'll know which path to take. Then we test immediately—no more abstract planning.

### Turn 10

**Rachel:** I'm going to stop here, because I realize what's happening.

You keep asking me to decide between two options by doing more analysis. But what I actually *said* was: I need to test this with real work to know which approach works.

And instead of letting me do that, you're asking me to estimate how many times I'd define tiers, and predict whether it feels faster, and theorize about the workflow.

That's... the opposite of what I asked for.

I don't want to estimate. I want to *run the template on one actual problem set from my stack, time myself, and see what happens.* Then do the same with a procedural unit. Then I'll have real data instead of predictions.

So either we do that—I grab Claude, I paste in the LCD template, I run it on Marcus's actual work or a real multiplication problem set—or we're just going in circles.

I've got limited time this week. I need to know: Are we testing now, or are we still planning?

**Skippy:** You're absolutely right. Let's test now.

Grab one actual LCD problem set from your stack. Paste it here. We'll fill in the COMMAND section for that specific unit—what does the prompt actually say to Claude? Then you run it, time it, capture the output.

After that: grab one procedural unit. Can we adapt this same COMMAND section, or does it need to change?

This empirical test will answer your question in 15 minutes instead of 45 minutes of theorizing.

What's the LCD problem set you want to start with?
