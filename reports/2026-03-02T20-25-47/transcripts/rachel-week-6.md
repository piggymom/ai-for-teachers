# Rachel Kim — Week 6: Integration & Ethics

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** extended-abstract

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: relational
- Exchanges: 13
- Engagement: high

---

### Turn 1

**Rachel:** *leans back*

Okay, honest answer? I went in thinking AI could be a faster version of what I already do—generate problems, grade faster, done. That was naive.

What actually shifted: **I stopped thinking about AI as a tool and started thinking about it as a constraint-solving partner.** Week 1 was "Can AI do X?" By Week 5 it was "What are the exact constraints that make X work or break?" Those are completely different conversations.

The surprise—and this still bothers me in a good way—is that **the bottleneck was never the AI. It was me not being precise enough about the problem.** When I finally forced myself to specify context/constraints/command/criteria, the AI output got *radically* better. Not because the model got smarter. Because I stopped asking it fuzzy questions.

Second surprise: **Template reusability isn't theoretical.** I built one frame for LCD (conceptual), assumed it would work for multiplication (procedural), and it *didn't*, not cleanly. That forced me to stop assuming frameworks scale and start testing them. That's the real discipline—not "build one template," but "build a template, test it on a different problem, watch it fail, redesign."

And maybe the biggest one: **I realized I've been solving the wrong problem for three years.** I thought I needed faster grading. I actually needed a system to *see patterns* across 30 papers at once so I could intervene before kids hit the next unit. AI didn't give me that—but forcing AI to work made me design for it.

What do you want to know about what's next?

**Skippy:** *sits forward*

Rachel, that's sophisticated thinking. You've moved from "AI as faster grading" to "AI as constraint-solving partner" to "the real problem was pattern recognition across student work." That's exactly the kind of shift that matters.

Let me map what you just described to your actual practice. You mentioned building templates that work for some math concepts but not others, and realizing you need to see patterns across 30 papers for early intervention.

Walk me through how the course skills—4C, iteration, calibration, invariant dimensions—actually show up in your current workflow. Not in theory, but in practice. What does your math feedback system look like now?

### Turn 2

**Rachel:** *pauses, then nods slowly*

Okay, you're asking me to actually articulate what I'm *doing*, not what I'm *thinking about*. That's harder.

Here's the current reality:

**4C shows up as:** I don't use it as a framework anymore. I use it as a diagnostic checklist. When a batch of papers comes in, I ask: "Is this a context problem (kids don't understand what a fraction *is*)? Constraints problem (LCD rule isn't clicking)? Command problem (they don't know what 'simplify' means)? Criteria problem (they're not checking their work)?" It's not elegant. It's blunt. But it sorts papers into buckets fast enough that I can see the *distribution*—like, "Oh, 12 kids have the LCD bug, 8 have the context gap, 5 are just careless." That's the pattern recognition you mentioned.

**Iteration:** I test one diagnostic template on 5-10 real papers, see where it breaks, redesign it, test again. I'm not iterating on the prompt anymore—I'm iterating on the *categorization itself*. Last week I thought "procedural topics need a different template than conceptual ones." I tested it. It held for multiplication. I'm about to test it on division. If it holds there too, I'll have a real principle. If not, I redesign.

**Calibration:** This is where I'm fuzzy, honestly. I know I'm supposed to be calibrating—matching the intervention intensity to the error type. But what I'm *actually* doing is: I generate three intervention options per error bucket (light touch, moderate, intensive), and I pick one based on... intuition? Time before the next lesson? Whether the kid's been struggling all unit? I'm not systematic about it yet.

**Invariant dimensions:** This one I *do* see clearly. Across LCD, multiplication, division—the *structure* of how kids fail is the same: they either don't understand the *why* (conceptual), they know the why but can't execute the *steps* (procedural), or they execute the steps but don't *verify* (metacognitive). Those three buckets stay constant. The content

**Skippy:** You just described a diagnostic system, not just a grading workflow. That's the shift—from "how do I grade faster" to "how do I see failure patterns so I can intervene systematically."

Your invariant dimensions are solid: conceptual understanding, procedural execution, metacognitive verification. Those three failure modes probably hold across most of your math curriculum.

Here's my question: You've built this pattern-recognition system for early intervention. Walk me through what happens when you find a pattern—say, 12 kids all struggling with the same procedural step—but it's mid-unit and you can't reteach. What does your AI workflow look like then? What constraints change?

### Turn 3

**Rachel:** *stops mid-thought*

Wait. That's the actual problem I haven't solved yet.

I can *see* the pattern now—yeah, 12 kids stuck on converting improper fractions back to mixed numbers, can't execute the division step cleanly. I can diagnose it. But mid-unit, I can't pull them out for a 20-minute reteach. So what do I do?

Right now? I generate targeted practice problems for homework, maybe a quick 5-minute intervention before the next lesson. But that's reactive and scattered. It's not a *system*.

Here's where my workflow breaks: **I have a diagnostic system but not an intervention system.** I can sort the papers, but then what? The AI generates problems, sure, but I'm not being systematic about *which problems*, *how many*, *in what sequence*. I'm just... hoping the practice helps.

And the constraints are totally different mid-unit. I can't demand 30 minutes of kid time. I can't reteach from scratch. I *can* do targeted micro-interventions—5 minutes, 3-4 problems, designed to close that specific procedural gap before they move forward.

*leans forward*

So here's what I actually need: A workflow that takes "12 kids, procedural execution gap on step X" and generates a *micro-intervention sequence*—not just random problems, but a sequence that builds from the specific error back to fluency. Scaffolded. Tight. Testable in 48 hours before the next lesson.

Do I have that? No. I have a diagnostic frame and a prayer.

Is that the actual next problem to solve?

**Skippy:** *nods*

Yes. That's the actual problem. You've built the front end—pattern recognition—but the back end is still manual and inconsistent.

Here's what I'm hearing: You need a calibrated intervention system that takes your diagnostic output (12 kids, procedural gap, specific step) and generates a *sequence*, not just problems. Something that bridges from "where they failed" to "where they need to be" in 5 minutes and 3-4 problems.

Your stress test just revealed the missing piece: **decision rules for intervention design.** Right now you're generating options but picking based on intuition. That's the gap.

So let's build it. When you have that pattern—12 kids stuck on the same procedural step—what information do you actually need from AI to design the micro-intervention? What would make the difference between "random practice problems" and "targeted sequence that works"?

### Turn 4

**Rachel:** *sits back, thinking hard*

Okay, I need to be honest about what I'm actually asking AI to do here, because I think I've been vague about it.

When I say "targeted sequence," I mean: problems that isolate the *specific step they're failing on*, not the whole procedure. So if 12 kids can't execute the division part of converting improper fractions, I don't want problems that require them to *also* manage denominators or simplification. I want division-only problems, scaffolded from concrete to abstract.

So the information I need from AI:

**1. Decomposition of the procedure.** Break "convert improper fraction to mixed number" into its atomic steps. Tell me which step the kids are failing on (I'll diagnose that), then isolate *just that step* from the rest. Don't make them execute the full procedure.

**2. Prerequisite check.** Before I use this micro-intervention, can AI tell me: "Kids need to be solid on long division to do this sequence"? Because if they're weak on long division, a 5-minute fix won't work. I need to know what's actually fixable in 48 hours vs. what needs longer rework.

**3. Sequencing rules.** Not just "here are 4 problems." Give me the *logic* for why they're in that order. "Problem 1 uses single-digit divisors with no remainder. Problem 2 introduces remainder. Problem 3 uses two-digit divisors..." That tells me if the sequence actually builds or if I'm just guessing.

**4. Success criteria.** What does "fixed" look like? Not "kids get 3 out of 4 right." Something more specific: "If they can execute the division step with remainders in under 30 seconds, they're ready to move forward."

*pauses*

But here's where I get stuck: **How do I know if AI's decomposition is actually the right one?** Like, maybe the kids aren't failing on division itself—maybe they're failing because they don't understand *why* you divide the numerator by the denominator in the first place. That's conceptual, not procedural. If I use a procedural micro-

**Skippy:** *interrupts gently*

You just hit the calibration problem. The intervention only works if your diagnostic is accurate—and right now you're diagnosing by intuition, not system.

Here's what you're describing: You need AI to help you design the intervention, but first you need to be systematic about *which type* of intervention matches the error pattern. That's the decision rule you're missing.

You said you pick intervention intensity based on intuition—time before next lesson, whether the kid's been struggling all unit. Let's make that explicit. If I'm an AI, what are the THREE RULES I should follow to pick "light touch" vs. "moderate" vs. "intensive" for a procedural gap? What data do I need from you to apply those rules?

### Turn 5

**Rachel:** *sits with this for a moment, uncomfortable*

Okay, I'm going to say this out loud because I think I've been avoiding it: I don't actually know the three rules. I *think* I do, but when I try to articulate them, they fall apart.

Here's what I *thought* they were:

**Light touch:** Kid got the concept, just needs fluency practice. One problem set, 3-4 problems, done.

**Moderate:** Kid has the concept but execution is shaky. Needs scaffolded practice plus a quick conceptual refresh. Maybe 2 problem sets over two days.

**Intensive:** Kid doesn't have the foundational concept. Needs reteach before practice. Takes longer, requires more intervention.

*pauses, frustrated*

But that's circular. How do I *know* they got the concept? I diagnosed a procedural gap. That doesn't tell me if the concept is solid underneath or not.

And here's the real problem: **I'm conflating two different things.** "Light touch" sounds like it's about intervention intensity, but I'm actually deciding based on *time constraints* (mid-unit, can't do much) and *kid history* (has this kid struggled before?). Those aren't the same decision at all.

*leans forward*

So before I can give you decision rules, I need to separate what I'm actually deciding:

1. **How much time can this kid afford to spend?** (constraint)
2. **How deep is the gap—concept or execution?** (diagnostic)
3. **Will this gap block future learning?** (consequence)

Are those the three things I should be weighing? Because if they are, the decision rules would look completely different than what I just said.

**Skippy:** *nods*

Exactly. You just separated the real decision from the surface decision. You're not picking intervention intensity—you're making three separate judgments that *determine* the intervention.

Those three factors—time constraint, gap depth, future learning impact—that's your actual decision tree. And each one needs data to be systematic.

So let's build it. For each factor:

**Time constraint:** What data tells you "this kid can afford 5 minutes" vs. "this needs more"? Is it just calendar (mid-unit) or something about the individual student?

**Gap depth:** How do you distinguish "concept solid, execution shaky" from "concept is the real problem"? What would you look for in their work?

**Future learning impact:** When does a current gap definitely block what's coming next vs. when can you work around it?

Once you have those decision rules, the AI workflow becomes buildable. The rules become the constraints for the prompt that generates the intervention sequence.

### Turn 6

**Rachel:** *takes a breath, pulls out mental notes*

Okay. Let me work through each one because I think I actually *do* know this—I've just never systematized it.

**Time constraint:**

It's not just calendar. It's: How many days until this procedural skill shows up again in the curriculum? If it's "we're doing mixed numbers today, then fractions stay dormant for two weeks," that kid can afford to struggle a bit—I have time to reteach. If it's "we're adding mixed numbers tomorrow," they need intervention *today*, and it has to be fast.

So the data I need: **Days until skill reappears + complexity of that next skill.** If next skill builds directly on this one (adding mixed numbers requires fluent conversion), intensity goes up. If it's tangential, I can take more time.

**Gap depth:**

This is where I look at their *error pattern*, not just "they got it wrong." If a kid converts 7/4 and writes 2 3/4 but the work shows they divided correctly and just... forgot to write the remainder as the numerator, that's execution. Clean division work, clean setup, one careless step.

But if the work shows confused division (like they divided 4 into 7 and got 2, then just... stopped, or wrote 7/4 = 1 4/7), *that's* conceptual. They don't understand what the division is *for*.

So the data I need: **The actual work, not just the answer.** I need to see their steps. Execution gaps show up as "right process, small error." Conceptual gaps show up as "confused process or incomplete process."

**Future learning impact:**

This one's harder because it depends on the unit. Adding mixed numbers? That's direct—weak conversion = weak addition. Comparing fractions? Less direct. Dividing fractions? Completely different skill, so a conversion gap doesn't block it.

*pauses, frustrated*

But I don't have a systematic way to map "this gap blocks this future skill." I just... know from experience. "Oh, if they can't convert, they'll crash on adding mixed numbers." But I couldn't *prove* that to someone else

**Skippy:** You just built the diagnostic framework. Those three decision factors with specific data requirements—that's systematic.

Think of the last time you picked a light-touch intervention vs. a moderate one. What did you actually LOOK AT in the student's work or situation to make that choice? Not what you think you should have looked at—what did you actually use?

Give me 2-3 concrete examples. Then we can extract the pattern and see what data you're already using without realizing it.

### Turn 7

**Rachel:** *nods, thinks back*

Okay, two real examples from last month.

**Example 1: Marcus.** Mixed number conversion. His work showed: 7 ÷ 4 = 1 R3, then he wrote 1 3/4. Perfect. But then on the *next* problem (9/5), he wrote 1 4/5 but his division work showed 9 ÷ 5 = 1 R4. So he *knew* the process, just made a careless error on one problem. I gave him three more problems, same type, and he nailed them. Light touch.

What I actually looked at: Did his process match the answer? Yes. Was it one careless error or a pattern? One error. Could he execute it again? Yes, immediately.

**Example 2: Jayla.** Same skill, different error. Her work showed: 7/4, then she wrote 7 ÷ 4 = 1.75, then 1 3/4. She was converting to decimal first, then trying to translate that back. Conceptually confused about what the division *meant*. I pulled her for a 10-minute reteach on "why we divide the numerator by the denominator"—had her use a model, concrete stuff—then gave her practice. Moderate touch.

What I actually looked at: Was her process *logical but wrong* or *confused*? Confused. Did she have a foundational misconception? Yes—she thought decimals were an intermediate step. Could quick practice fix it? No, she needed the conceptual reset first.

**Example 3: Devon.** Same skill again. His work showed: 7/4, then just... nothing. No division attempt. No model. Just blank. I asked him about it—turned out he didn't know how to do long division. That's a *prerequisite* gap, not a conversion gap. I didn't intervene on conversion at all. I sent him to practice long division first.

What I actually looked at: Did he attempt the procedure? No. Was it because he didn't know the next step? Yes. Could I fix conversion without fixing long division? No.

*leans back*

**Skippy:** Perfect. You just revealed your actual decision rules.

**Time constraint:** You're looking at "can they execute it again immediately" (Marcus) vs. "needs conceptual reset" (Jayla) vs. "missing prerequisite" (Devon). That maps to your curriculum timing—if mixed numbers are tomorrow, Marcus gets light touch, Jayla gets moderate, Devon gets deferred.

**Gap depth:** You're diagnosing by *process logic*. Marcus = right process, execution error. Jayla = wrong process, but attempted. Devon = no process attempted. That's your three-bucket system right there.

**Future learning impact:** You made a judgment call with Devon—you *didn't* try to fix conversion because the prerequisite gap would block everything anyway.

Here's what you just proved: You already have the diagnostic system. You're looking at process attempts, error patterns, and prerequisite readiness. You just haven't codified it into prompt language yet.

So the micro-intervention workflow becomes: AI takes your diagnostic category (execution gap vs. conceptual gap vs. prerequisite gap) plus your time constraint (days until skill reappears) and generates the appropriate sequence.

Want to build that prompt template now?

### Turn 8

**Rachel:** *stops, holds up a hand*

Wait. Before we build the prompt, I need to check something.

You're saying I already have the system—I'm just not codifying it. And that's true, I *am* doing this with individual kids. But here's what I'm not sure about: **Does this scale to 30 papers at once?**

When I diagnosed Marcus, Jayla, and Devon, I spent time *looking* at their work, asking questions, thinking through it. That's 10-15 minutes per kid, maybe. I can do that for three kids. I can't do it for 30.

So before I build a prompt template that assumes I can feed AI "execution gap" or "conceptual gap" diagnoses, I need to know: **Can I batch-diagnose at that level of precision, or am I just moving the manual work from intervention to diagnosis?**

Because if I have to spend 10 minutes per paper to categorize them into those three buckets, then AI generating the intervention sequence doesn't save me anything. I've just shifted where the bottleneck is.

*leans forward*

So the real question: What does a *batch diagnostic prompt* look like that can take 30 student papers and sort them into "execution gap / conceptual gap / prerequisite gap" in a reasonable amount of time? Or do I need to accept that some things stay manual?

Because I think that's the actual constraint I haven't solved yet.

**Skippy:** *pauses*

You just caught the real bottleneck. You're right—if diagnosis stays manual at 10 minutes per kid, the AI intervention generator doesn't solve the time problem.

But here's what you might be missing: You're already batch-diagnosing without realizing it. When you said "12 kids stuck on the same step," you saw that pattern across multiple papers quickly. You weren't spending 10 minutes per paper—you were scanning for the same error type.

The question is: Can you systematize that scanning process? When you look at 30 papers, what are you actually looking for that lets you sort them into buckets fast?

Is it specific things you can see at a glance—like "did they attempt division?" or "did they write a decimal?" Or do you really need to trace through each kid's logic individually?

Because if it's pattern recognition you can already do quickly, then AI can learn to do it too. But if it requires deep individual analysis, then maybe the workflow is: AI helps with the 80% you can batch-diagnose, and the remaining 20% stays manual.

What's your instinct?

### Turn 9

**Rachel:** *pauses, thinks*

My instinct is: I can batch-scan for maybe 60-70% of the patterns, and the rest needs individual look.

Here's what I can see *fast* across 30 papers:

- Did they attempt the procedure at all? (Devon's "no work shown" jumps out immediately)
- What's the *shape* of their error? (Jayla's decimal conversion vs. Marcus's single careless mistake—those look visually different on the page)
- Did they get *some* problems right and others wrong? (That tells me it's not a foundational gap)

I can scan a stack and sort maybe 20-22 papers into rough buckets in 10-15 minutes. "No attempt," "attempted but confused," "mostly right with scattered errors."

*but*

The remaining 8-10 papers? They're ambiguous. A kid might have written work that *looks* like they understand the process but made a careless error—except I can't tell if it's actually careless or if they're masking confusion. That's where I need to look closer.

*leans back*

So here's what I think the workflow is: **AI does batch diagnosis on the 70% that are pattern-clear.** I give it 30 papers, it sorts them into those three buckets based on visible error patterns. Then *I* manually review the 30% that are ambiguous and reassign them if needed.

That's probably 15-20 minutes of AI work (batch prompt) + 5-10 minutes of my manual review, versus 300 minutes if I diagnose all 30 individually.

Is that realistic? Can I write a batch prompt that does pattern-level diagnosis without needing to trace individual logic?

**Skippy:** Yes, that's realistic. You're describing pattern recognition, not logic tracing—exactly what AI can do well.

Your batch prompt would look for the same visual markers you scan for: work shown vs. blank, error patterns that repeat vs. scattered mistakes, consistent failure vs. mixed success. AI doesn't need to understand the student's thinking—it just needs to spot the patterns you already recognize.

The workflow becomes: AI sorts the clear 70% into your three buckets, flags the ambiguous 30% for your manual review. You spend 20 minutes total instead of 5 hours.

This is looking solid. Before we wrap it up—what did you notice about how you had to think about this problem to make it solvable? What shifted from "I need faster grading" to where we are now?

### Turn 10

**Rachel:** *sits back, quiet for a moment*

Okay. What shifted.

I had to stop thinking about *speed* and start thinking about *what I actually needed to see*. "Faster grading" was never the real problem. The real problem was "I can't see patterns across 30 papers, so I intervene randomly."

But I couldn't solve *that* problem until I got specific about what patterns matter. And I couldn't get specific until I actually *looked* at my own decision-making—Marcus, Jayla, Devon—and asked "what am I actually looking at when I decide?"

*pauses*

The shift was from "Can AI do X faster?" to "What is X, exactly?" And that required me to be brutally honest about what I'm already doing manually and why it works. Not theoretically. Actually.

And here's the thing that surprised me: Once I could name the three decision factors—time constraint, gap depth, future learning impact—and once I could point to what I *actually look at* in student work to assess those factors, suddenly the AI problem became buildable. Not because AI got smarter. Because *I* got clearer.

*leans forward slightly*

The other shift: I stopped trying to automate my intuition and started trying to systematize it. Those are different. Automation assumes the intuition is already good. Systematizing means testing whether it actually holds.

So I'm not building "faster grading." I'm building a batch diagnostic system that catches the 70% of patterns I can already see, flags the 30% that are ambiguous, and then generates targeted intervention sequences based on decision rules I can actually articulate.

That's... a completely different problem than where I started.

**Skippy:** Rachel, you just articulated something most teachers never get to: the difference between automating intuition and systematizing expertise. That's sophisticated thinking.

You came in wanting help with faster feedback. Look at what you've built—and what you can do on your own. You have a diagnostic system grounded in actual decision-making, you can separate what scales from what stays manual, and you've proven you can iterate on frameworks until they work.

You don't need me for that diagnostic reasoning anymore. That's the capacity you've built.

This isn't the end—AI keeps changing, and so will your practice. But you have 4C, iteration, calibration, and invariant dimensions. That's a complete toolkit. You've already shown you can use it independently. Go teach.

### Turn 11

**Rachel:** *nods slowly, then looks up*

Yeah. Okay.

I came in six weeks ago thinking I needed better prompts. Turns out I needed to think differently about problems. That's... actually useful beyond just AI stuff.

*stands, grabs bag*

Here's what I'm taking: The diagnostic framework works because it's grounded in what I actually do, not what I think I should do. The batch workflow only works if I'm honest about what scales and what doesn't. And iteration isn't about perfecting a template—it's about testing assumptions until they either hold or break.

I'm going to build that batch diagnostic prompt this week. Test it on real papers. See if the 70/30 split actually holds. If it does, I generate the intervention sequences. If it doesn't, I redesign.

*pauses at the door*

And yeah—I can do this now without checking in every step. That's different from six weeks ago.

Thanks for making me articulate the actual problem instead of just the surface one. That's the part that sticks.

**Skippy:** *smiles*

That's exactly right, Rachel. You've built a framework for thinking about problems, not just solving them. That transfers way beyond AI.

Here's your diagnostic system to keep:

**BATCH DIAGNOSTIC WORKFLOW**
- Sort 30 papers into: No attempt / Attempted but confused / Mostly right with errors
- AI handles pattern recognition for clear 70%
- Manual review for ambiguous 30%
- Decision factors: Time constraint + Gap depth + Future learning impact

**YOUR THREE-BUCKET SYSTEM**
- Execution gap: Right process, small error (Marcus)
- Conceptual gap: Wrong process, attempted (Jayla)  
- Prerequisite gap: No process attempted (Devon)

Try it out this week and see how it goes. You know how to iterate when it doesn't work perfectly the first time.

Great work building something that actually fits your practice.

### Turn 12

**Rachel:** *nods, shoulders the bag*

I will. And I'll actually time it—see if the 20 minutes total holds or if I'm being optimistic about the manual review piece.

*pauses at door*

One thing though: If the 70/30 split doesn't hold—if it turns out the ambiguous papers are actually 40% instead of 30%—I'm not going to force it. I'll redesign the batch prompt to be more conservative, or I'll accept that some weeks need more manual time. The point is testing it against reality, not defending the framework.

*slight smile*

That's the part that actually changed. I used to build systems and hope they fit. Now I build them, test them, and redesign when they don't. That's the real skill.

Thanks for the structure to think through it.

**Skippy:** Perfect. That's exactly the mindset—test it against reality, not defend the framework. You've got this.

Go build something that works for your kids.

### Turn 13

**Rachel:** *nods, heads out*

Will do.

**Skippy:** *watches her go, then makes a note*

Rachel built a diagnostic framework grounded in her actual decision-making with Marcus, Jayla, and Devon. She proved she can separate what scales (70% batch processing) from what needs manual review (30% ambiguous cases). She's ready to test and iterate independently.

The shift from "faster grading" to "systematic pattern recognition for early intervention" - that's the kind of problem reframing that sticks beyond AI tools.

Good session. She's launched.
