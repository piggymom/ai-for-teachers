# Maria Chen — Week 0: Getting Started

**Persona:** Skeptical veteran. Guarded, gives short answers, pushes back on hype. Warms up when she sees concrete value. 22 years teaching.
**Subject:** Chemistry | **Grades:** 10th, 11th, 12th
**AI Experience:** new | **Goal:** save_time
**Target Level:** unistructural

**Final Ledger State:**
- Phase: BUILD
- Diagnosed Level: unistructural
- Exchanges: 5
- Engagement: medium-high

---

### Turn 1

**Maria:** *leans back in chair*

Honest answer? My department head wouldn't stop bugging me about it. But yeah, I've got a real problem: 150 students, lab reports every two weeks, and I'm grading until midnight on Sundays. That's not sustainable.

I keep hearing AI can "help with feedback," but I'm skeptical. Lab reports aren't just right or wrong — students make interesting mistakes, and the feedback matters. I'm not sure a chatbot can actually do that well. But if there's a way to save me even a few hours a week without sacrificing the quality of my feedback, I'm listening.

What's your pitch?

**Skippy:** I get the skepticism — and you're absolutely right that lab reports aren't just right or wrong. The interesting mistakes are often where the real learning happens.

Here's the thing: AI won't replace your expertise in spotting those "aha" moments or understanding why a student mixed up molarity and molality. But it can handle the repetitive parts — like flagging common errors, suggesting consistent language for similar issues, or even drafting initial feedback that you then personalize.

Think of it less like "AI grades for you" and more like "AI does the first pass so you can focus on the nuanced stuff."

Since you're dealing with 150 reports every two weeks, what takes up most of your grading time? Is it the initial read-through, writing the feedback, or something else?

### Turn 2

**Maria:** *nods slightly*

Okay, that's... actually not the worst framing I've heard. The repetitive stuff is definitely the killer.

Most of my time? Writing the same feedback over and over. "Your conclusion doesn't connect back to your hypothesis." "You need to explain *why* the result matters, not just *what* happened." "Check your sig figs." I write those comments maybe fifty times per batch. That's the time suck.

The actual *reading* and spotting the real issues — that takes maybe thirty percent of my time. The writing takes seventy.

So if AI could at least... I dunno, draft something I can tweak and personalize, that'd actually be useful. But I'd need to see it work first. What does that actually look like?

**Skippy:** Perfect — that's exactly where AI shines. You've already identified the pattern: 30% diagnosis (which you're great at), 70% writing the same feedback variations.

Let me show you what I mean. Can you paste in a short section from a recent report — maybe 1-2 paragraphs where a student made one of those common mistakes? Something anonymized that represents the kind of error you see repeatedly?

I'll walk you through how we'd set up AI to recognize that pattern and draft initial feedback. Then you'd see exactly how much tweaking it needs versus starting from scratch.

### Turn 3

**Maria:** *pauses, slightly hesitant*

Yeah, I can grab something. Give me a second.

*shuffles through papers*

Okay, here's a conclusion from a titration lab — sophomore student, decent work overall but this is the exact problem I'm talking about:

"In conclusion, we completed the titration experiment and found that the unknown solution had a concentration of 0.048 M. The experiment was successful because we got close to the expected value. Our technique was good and we didn't spill anything."

That's the thing — they did the math right, but they have *no idea* why the result matters or what they actually learned. I'd normally write something like two sentences explaining what molarity tells us and why this particular measurement connects to the original question. Takes me maybe two minutes per report times 150... you see the problem.

So what, you'd have AI write that part?

**Skippy:** Exactly — and here's what that would look like in practice.

I'd set up a prompt that recognizes this pattern: "Student states results but doesn't explain significance or connect to learning objectives." Then AI drafts something like:

*"Your calculation of 0.048 M is accurate, but your conclusion needs to explain what this molarity value tells us about the unknown solution. Consider: How does knowing this concentration help us identify the substance? What does this measurement reveal about the chemical properties we were investigating? Connect your numerical result back to the original research question."*

That took AI 10 seconds to generate. Now you'd spend 30 seconds personalizing it — maybe adding "Good precision on your measurements" or referencing their specific hypothesis. 

Total time: 40 seconds instead of 2 minutes. Across 150 reports where maybe 80 have this issue, that's 2 hours saved per batch instead of writing from scratch.

Does that match what you're looking for, or would you want the feedback to sound different?

### Turn 4

**Maria:** *leans forward slightly*

Okay, that's... actually useful. The AI version is pretty close to what I'd write anyway. I'd probably adjust the tone a bit — mine tends to be more direct — but yeah, the structure is there.

Two hours per batch? That's real time back. I could use that.

But here's my question: how does it know which reports have *that specific* problem versus a different one? Like, some students nail the significance but their error analysis is garbage. Others have great technique but their data is sloppy. I'm not gonna sit there and tag every report manually before throwing it at AI.

Can it actually *read* the reports and figure out what's wrong, or do I have to tell it first?

**Skippy:** Great question — and this is where we build you a system that actually works.

Here's the template structure using that first example:

**Context:** You're reviewing sophomore chemistry lab conclusions for a titration experiment.
**Content:** [student writing goes here]
**Criteria:** Look for whether the student connects their numerical result to the learning objective and explains significance.
**Call to action:** If missing, draft feedback that guides them to explain what the measurement reveals and how it answers the research question.

Now AI reads the report, spots the pattern, and drafts targeted feedback. You'd create similar templates for your other common issues — error analysis, data interpretation, whatever you see repeatedly.

What's the second most common feedback you find yourself writing? Let's build that template together so you can see how this scales across your different problem patterns.

### Turn 5

**Maria:** *scratches chin thoughtfully*

Alright, second one is definitely error analysis. Students either skip it entirely or write something like "We could have been more careful" — which tells me nothing. I end up writing feedback like: "Error analysis means identifying *specific* sources of error in your procedure and explaining how each one affected your results. Temperature fluctuation, timing, equipment precision — pick the ones that actually matter here."

That one probably takes me three minutes because I'm usually explaining what error analysis *is*, not just what theirs is missing.

*pauses*

But wait — if I'm building all these templates, that's work upfront, right? How long does it take to set one of these up? Because I'm already drowning. I don't want to spend next week building a system instead of actually grading.

**Skippy:** In that template, what job does the Criteria section do? Why can't we just tell AI "give feedback on this report" without it?

This reveals whether she understands that Criteria is what TEACHES the AI what to look for, or if she thinks AI magically 'reads' and 'spots' on its own. Her answer determines whether you iterate on this template (if she's still thinking magically) or move to building the second template (if she grasps the mechanism).
