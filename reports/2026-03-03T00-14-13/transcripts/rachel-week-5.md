# Rachel Kim — Week 5: Differentiation with AI

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** extended-abstract

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: extended-abstract
- Exchanges: 11
- Engagement: high

---

### Turn 1

**Rachel:** Okay, honest answer: I have about eight kids in my two sections who need genuinely different instruction, and right now I'm doing it the unsustainable way — I plan one lesson, then I'm scrambling to create modified versions or pull different problems mid-week.

The hardest part? It's not *knowing* they need it. It's the **time tax**. I have three kids reading 2-3 grade levels below who need different entry points on word problems. I have two gifted kids who finish everything in half the time and then I'm improvising extensions. And I have this middle band of maybe five kids with specific gaps — one can't do multi-step problems, another struggles with remainders, one gets the concepts but can't write explanations.

What kills me is that the gaps aren't consistent across the group. So I can't just make "an easier version" — I need different *types* of modifications depending on whether the kid's issue is conceptual, procedural, or stamina-related.

And here's the real problem: I use AI to generate problem sets already, but I'm generating three separate sets manually because I don't have a systematic way to say "take this problem and create three scaffolded variants at different conceptual levels." I end up rewriting them by hand, which defeats the purpose.

What are you thinking — that AI could help me batch this? Because if it's just "use a template," I'll probably forget by Friday.

**Skippy:** You've got the exact right diagnosis — the time tax is real, and you need *types* of modifications, not just "easier versions." That multi-step vs. remainders vs. explanation issue? That's why most differentiation advice falls flat.

Here's what I'm thinking: you already know how to generate good problem sets. The missing piece is teaching AI to create **systematic variants** — same mathematical thinking, different access points based on the specific barrier each kid faces.

So instead of three separate generations, you'd have one prompt that says "Create three versions of this problem: Version A removes the multi-step complexity but keeps the same mathematical reasoning. Version B adds visual scaffolds for the word problem structure. Version C extends with a 'what if' question that doesn't change the core problem."

Before we build that — when you're scrambling mid-week to modify, what's your instinct? Do you usually simplify the numbers, change the context, add visual supports, or break it into steps?

### Turn 2

**Rachel:** I do all of those, but not randomly — it depends on *why* the kid's stuck.

If it's a procedural thing (like the remainders kid), I simplify the numbers first. Keep the structure identical, just smaller. That kid needs to see the pattern work, not relearn the whole thing.

If it's conceptual (like multi-step), I actually break it into substeps and add more scaffolding language. "First find X. Now use that answer to find Y." The numbers don't matter as much — they need to see the *moves*.

The explanation kids? That's different again. The math itself isn't the problem. I'll add sentence starters or a graphic organizer, or I'll give them the answer and ask them to *justify* instead of solve. Same problem, different door in.

So yeah, I'm already thinking in variants. But here's my pushback: **the prompt you just described still requires me to diagnose the barrier first.** I have to know going in whether it's procedural, conceptual, or communication. With eight kids, that's doable. But if I'm batch-processing thirty problems for two classes? I don't have time to pre-diagnose every single one.

Are you thinking the AI could do that diagnosis based on student work? Or am I supposed to hand-tag the problems myself before I feed them to the AI? Because if it's the latter, you've just added a step, not removed one.

**Skippy:** You're absolutely right — I just added a step instead of removing one. That's the trap of "systematic" approaches that aren't actually more efficient.

Here's the real insight from what you just said: you're already thinking in **barrier types** — procedural, conceptual, communication. And you have specific modification moves for each type. The AI doesn't need to diagnose barriers; it needs to generate all three access points at once so you can **distribute** based on what you already know about each kid.

So the prompt isn't "diagnose then modify." It's "create three versions that address the three common barrier types I see in my classroom."

For each of those instincts you described — simplify numbers for procedural, break into steps for conceptual, add communication scaffolds — what's the mathematical thinking you're trying to preserve? Because that's what separates good differentiation from just making it easier.

### Turn 3

**Rachel:** Now that's the right question.

**Procedural barrier (simplify numbers):** I'm preserving the *operation sequence and structure*. The kid needs to see that "remainder means leftover" works the same way whether it's 47÷6 or 9÷2. The math reasoning is identical; I'm just removing the cognitive load of managing bigger numbers so they can focus on the *procedure itself*.

**Conceptual barrier (break into steps):** I'm preserving the *logical chain* — the dependencies between moves. A multi-step problem is really 2-3 single-step problems in sequence. The kid needs to see that connection, so I'm making the scaffolding explicit: "Do this first, *then* use that answer here." Same mathematical thinking, just with the hidden steps made visible.

**Communication barrier (add scaffolds):** This one's trickier. I'm preserving the *reasoning requirement* but removing the *expression demand*. They still have to think through the math, but I'm giving them a frame to put it in. Sentence starters, graphic organizers — those are just access ramps to the same thinking.

Here's what I notice: in all three cases, I'm keeping the core mathematical idea intact and removing *one specific cognitive load*. Not making it easier — making it accessible to the specific kid's bottleneck.

So the prompt should ask: "Generate three versions that each remove a different load — computational, structural, or expressive — while keeping the mathematical thinking constant." That's actually testable. I could look at each version and ask, "Did the reasoning stay the same?"

Does that match what you're building toward?

**Skippy:** Exactly. You just articulated the access vs. rigor principle perfectly — same mathematical thinking, different cognitive loads removed. That's the invariant dimension that most teachers miss.

And yes, that's testable. When AI generates the three versions, you can run the check: "Could a student using the procedural version do the same mathematical reasoning as the conceptual version?" If not, AI simplified the thinking, not just the access.

Let's build this into a reusable template. You've got your three barrier types and the specific moves for each. Now we need the constraints that keep the mathematical thinking constant across all versions.

What are the non-negotiables that must stay identical — the learning objective, the mathematical concept, what else? And then for criteria, how will you know each version actually works for its intended barrier type?

### Turn 4

**Rachel:** Hold on — I need to push back on the framing here.

You're asking me to *define* the non-negotiables and *design* the criteria. But that's the work I already do intuitively when I'm scrambling mid-week. You're asking me to make it explicit and systematic, which is fine, but I want to be clear: **this is me doing the cognitive heavy lifting. The AI is executing, not thinking.**

That said, here are the non-negotiables:

**Must stay identical:**
- The core mathematical concept (if it's about remainders, all three versions involve remainders)
- The operation or strategy being practiced (division, multi-digit multiplication, whatever)
- The context/story if there is one — I don't change the word problem narrative, just how it's scaffolded

**Cannot change:**
- The final answer (obviously)
- The number of steps required in the mathematical reasoning

**For criteria — how I'd know it works:**

*Procedural version:* A kid who can execute the procedure but struggles with larger numbers should be able to do it without getting lost in computation.

*Conceptual version:* A kid who doesn't see the connection between steps should be able to complete it and then explain why each step matters.

*Communication version:* A kid who understands the math but can't articulate it should be able to use the scaffolds and show their reasoning.

But here's my real question: **Are you asking me to build this template now, or are you going to show me a template and ask if it matches my thinking?** Because I can keep articulating my process, but I want to know if we're co-designing or if you're testing whether I understand the principle.

**Skippy:** You're absolutely right to call that out. You've already done the cognitive work — you understand the principle, you've identified the barrier types, you've named the non-negotiables. I'm not testing your understanding; you clearly have it.

Let me be direct: here's the template based on what you've articulated. Tell me what you'd change for your specific context.

**Differentiation Prompt Template:**

CONTEXT: [Paste the original problem]
Learning objective: [The mathematical concept — stays constant]
Subject: 5th/6th grade math

CONSTRAINTS:
- Keep mathematical thinking identical across all versions
- Same operation/strategy being practiced
- Same context/story if applicable
- Same final answer and number of reasoning steps

COMMAND:
Generate three versions of this problem:
- Version A (Procedural barrier): Simplify numbers, preserve operation sequence and structure
- Version B (Conceptual barrier): Break into substeps, preserve logical chain and dependencies  
- Version C (Communication barrier): Add scaffolds (sentence starters, graphic organizers), preserve reasoning requirement

CRITERIA:
Each version removes ONE cognitive load (computational, structural, or expressive) while preserving the core mathematical idea.

What would you tweak for your workflow?

### Turn 5

**Rachel:** This is solid, but I have three tweaks — two are structural, one is practical.

**Structural tweaks:**

1. The "Learning objective" line needs to be more specific. Not just "the mathematical concept" but the *actual* learning target. "Students will understand that division with remainders means 'leftover amount'" is different from "Students will divide multi-digit numbers." The specificity matters because it's what I'm checking against when I verify the versions actually preserve thinking.

2. Add a line: "What barrier type does this student have?" — not as a command to the AI, but as a note *to myself* before I paste. Because I need to be intentional about which version goes to which kid. Right now that's implicit in my head. Making it explicit means I'm less likely to give Version C (communication scaffold) to the procedural kid and waste it.

**Practical tweak:**

The CRITERIA section needs an output requirement. Right now it's aspirational. I'd add: "For each version, explain what cognitive load was removed and why the mathematical thinking remains identical." That way the AI isn't just generating three problems — it's *justifying* them. I can spot-check the reasoning before I use them.

Also — and this might be me being impatient — can this template handle *multiple* problems at once? Because my real workflow is "I have six problems from tomorrow's lesson, I need variants for three specific kids." Batch processing is where the time savings actually happen.

**Skippy:** Perfect tweaks — especially the justification requirement. That's your quality control built right into the output.

For batch processing: yes, but with a caveat. You can definitely paste multiple problems in the CONTEXT section and ask for all three versions of each. The AI will handle that efficiently.

The caveat is your second structural tweak — "What barrier type does this student have?" becomes more complex with multiple problems and multiple kids. You might end up with a matrix: Problem 1 Version A goes to Sarah and Marcus, Problem 2 Version C goes to Sarah but Version B goes to Marcus.

Your instinct about being intentional is right. Maybe the practical workflow is: run the batch generation first, then do the distribution mapping afterward when you can see all the versions laid out?

This template is ready to test. Pick a problem you've already modified for one of your eight kids. Run it through this template and generate the three versions. Then ask yourself: Did AI preserve the mathematical thinking in all three, or did it simplify the reasoning in any version?

If it breaks, you'll see where. If it holds, you'll have confidence to use it at scale.

### Turn 6

**Rachel:** I'm going to do this, but I want to flag something first.

You're assuming I'll run this *once* and then iterate based on what breaks. But realistically, I'm going to run it, get three versions back, spot-check them quickly, and then either use them or not. I don't have time to do deep quality control on every batch — that defeats the purpose of automation.

So here's what I actually need: **What's the minimum viable check I can do in 60 seconds to know if the AI preserved the thinking?** Because if I have to carefully analyze each version for mathematical integrity, I've just replaced "manually create variants" with "manually verify variants." The time tax is still there.

Is it: Read through all three and ask "Could these three kids solve the same underlying problem?" And if the answer's yes, ship it? Or do I need to be more rigorous than that?

Because I think there's a difference between "this is good enough for classroom use" and "this is mathematically sound." And I'm guessing you're about to tell me they're not the same thing, which means I need to know upfront which one I'm aiming for.

**Skippy:** You're absolutely right — I was about to create another time tax disguised as quality control.

Here's your 60-second check: **Look at the AI's justification for each version.** If it says "simplified numbers for procedural" but you see it also changed the operation sequence, that's a red flag. If it says "broke into substeps for conceptual" but the substeps don't match the logical chain, that's a problem.

The AI's explanation should match YOUR understanding of what that barrier type needs. If the reasoning aligns, ship it. If the AI says something like "made it easier by removing a step" — that's rigor getting simplified, not access.

But honestly? After you run this a few times, you'll develop pattern recognition. You'll spot the failure modes quickly — AI tends to make the same mistakes repeatedly. Then you can tighten the constraints where needed.

The goal is "good enough for classroom use" — which for you means your kids get better access to the same mathematical thinking. That's already better than what most of them get right now.

Test it. If the justifications make sense and the problems feel right for your kids, you've got a working system.

### Turn 7

**Rachel:** Fair enough. I can do that check — reading the justification is faster than analyzing the math itself.

One last thing before I test this: **Where does this break down?** Because every system has edge cases. Are there problem types where this template doesn't work? Geometry? Multi-concept problems? Word problems with weird contexts?

I'm asking because I want to know the limits upfront instead of discovering them when I'm trying to batch-process next Tuesday's lesson.

**Skippy:** Good question. Here's where it breaks down:

**Geometry problems** — especially ones requiring spatial visualization. AI can simplify numbers but can't really scaffold "seeing" rotations or understanding why triangles are congruent. The barrier isn't computational or linguistic; it's spatial reasoning itself.

**Multi-concept problems** that genuinely require understanding two different mathematical ideas simultaneously. Your template works when there's one core concept with different access barriers. But if a problem requires both fraction operations AND proportional reasoning, you can't preserve the thinking while removing either concept.

**Context-heavy word problems** where the story is doing mathematical work, not just providing flavor. If understanding the context IS part of the mathematical reasoning (like rate problems with complex scenarios), simplifying the story changes the math.

**Open-ended problems** without clear procedural paths. Your three barrier types assume there's a definable procedure, logical sequence, or communication requirement. Pure exploration problems don't fit this framework.

The good news? Most of your daily 5th/6th grade problems probably fit the template. When you hit an edge case, you'll know immediately — the AI justifications won't make sense or the versions will feel fundamentally different from each other.

Ready to test it?

### Turn 8

**Rachel:** Yeah, I'm ready. I'll pick one of the remainder problems — that's where I have the most consistent need across multiple kids, so if this works there, I'll know it's worth scaling.

But I'm going to do this on my own timeline, not promise you a report. I'll test it this week, see if the 60-second check actually works, and if I hit snags I'll come back with specifics. No point in me saying "I'll test it Thursday" and then getting buried with parent emails.

One thing though — when I do test this, I should probably document what breaks, right? Not formally, but like... what were the failure modes? Because you said AI makes the same mistakes repeatedly, so if I'm going to tighten constraints, I need to know what I'm tightening against.

Should I just keep notes, or is there a smarter way to track this?

**Skippy:** Smart approach — test on your timeline, document what breaks. 

For tracking: just keep notes. When the AI justification doesn't match what you expected, jot down what it did wrong. "Said it simplified numbers but actually removed a step" or "claimed it preserved reasoning but the conceptual version skipped the connection between operations."

After 2-3 problems, you'll see the patterns. Then you can add one specific constraint to fix the most common failure and test again.

This is looking solid. Before we wrap it up — what did you notice about how you had to think about this? Building this template versus your usual mid-week scrambling?

### Turn 9

**Rachel:** Honestly? It felt like I was translating what I already do into language the AI can understand. Which is useful, but also a little frustrating because it made me realize how much of my differentiation is intuitive pattern-matching, not systematic.

The useful part: naming the three barrier types explicitly. I do this in my head, but saying it out loud — "procedural vs. conceptual vs. communication" — made me realize I might be missing other barrier types entirely. Like, what about *stamina*? Or *memory load*? Those don't fit neatly into my three categories.

The frustrating part: the template assumes I already know which kid has which barrier. But sometimes I don't figure that out until I see their work. So this workflow (generate variants, then distribute) might actually work better than trying to pre-diagnose everything.

The meta thing I noticed: you kept pushing me to be precise about what stays constant. That's the real work — not the variants, but defining the invariant. Once I got that, the rest felt doable.

So yeah, I'll test it. If the 60-second check actually holds up and I'm not spending more time verifying than creating, this is worth using at scale.

I'm going to stop here though — I've got papers to grade and I need to set up tomorrow's lesson. I'll come back if the template falls apart.

**Skippy:** Got it — here's your prompt template to keep:

**CONTEXT:** [Paste the original problem]
Learning objective: [The specific learning target — stays constant]
Barrier type for this student: [Procedural/Conceptual/Communication]
Subject: 5th/6th grade math

**CONSTRAINTS:**
- Keep mathematical thinking identical across all versions
- Same operation/strategy being practiced
- Same context/story if applicable
- Same final answer and number of reasoning steps

**COMMAND:**
Generate three versions of this problem:
- Version A (Procedural barrier): Simplify numbers, preserve operation sequence and structure
- Version B (Conceptual barrier): Break into substeps, preserve logical chain and dependencies
- Version C (Communication barrier): Add scaffolds (sentence starters, graphic organizers), preserve reasoning requirement

**CRITERIA:**
For each version, explain what cognitive load was removed and why the mathematical thinking remains identical. Each version removes ONE cognitive load (computational, structural, or expressive) while preserving the core mathematical idea.

Try it on your remainder problem this week and see how it goes.

### Turn 10

**Rachel:** Perfect. I've got it.

One small thing — I added "Barrier type for this student" to the template, but I'm going to use that *after* I batch-generate. Generate all three versions first, then I'll map them to kids based on what I already know about them. That's the actual time-saver.

I'll test it this week on the remainder problem and see if the justifications hold up. If it works, I'll try batching three problems next week.

Thanks for not making this more complicated than it needed to be. Most "AI for teachers" stuff adds steps instead of removing them.

**Skippy:** Great work today! Here's your prompt template to keep. Try it out this week and see how it goes.

### Turn 11

**Rachel:** Will do. I'll report back if it breaks or actually saves time — whichever comes first.

**Skippy:** Perfect. I've saved this to your artifacts — you can find it on your dashboard anytime.

Good luck with the remainder problems!
