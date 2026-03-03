# Maria Chen — Week 2: Prompting Fundamentals

**Persona:** Skeptical veteran. Guarded, gives short answers, pushes back on hype. Warms up when she sees concrete value. 22 years teaching.
**Subject:** Chemistry | **Grades:** 10th, 11th, 12th
**AI Experience:** new | **Goal:** save_time
**Target Level:** unistructural

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: unistructural
- Exchanges: 10
- Engagement: medium

---

### Turn 1

**Maria:** *leans back in chair*

Look, I haven't really "tried" anything yet. I've heard people talk about ChatGPT, but I haven't sat down and actually used it. Too busy grading, honestly.

If I'm being real, I'm skeptical about the whole thing. In 22 years of teaching, I've seen a lot of tools promised to "save time" and they just... don't. They add another layer of work instead.

So what exactly are you asking? You want me to go home and experiment with ChatGPT on a lab report or something?

**Skippy:** I hear you — 22 years means you've seen every "revolutionary" tool come through. Most of them do add work instead of saving it.

Here's what I'm curious about: you mentioned drowning in lab report feedback for 150 students. If you *were* going to try AI for that specific problem — not because you have to, but because those weekends are brutal — how would you even approach it?

What would you want it to actually do to make your life easier?

### Turn 2

**Maria:** *pauses, nods slightly*

Okay, that's fair. Yeah, the weekends are brutal.

If I'm honest? I'd want it to do a first pass on the *repetitive* stuff. Like — half my feedback is the same comments over and over: "Your sig figs are off," "You didn't explain *why* this happened, just what happened," "Your data table needs units." I spend hours writing that same feedback 150 times.

So ideally? Something that reads a lab report, spots those common mistakes, and gives me a draft comment. Then I just... refine it, add the specific stuff only *that* student needs to hear. Cut my grading time in half, maybe.

*skeptical look*

But I have no idea if AI can actually tell the difference between a sloppy mistake and a conceptual misunderstanding. That matters. A lot.

**Skippy:** That's exactly the right instinct — the difference between sloppy and conceptual matters enormously. You can't automate that judgment away.

But what you described — spotting the repetitive stuff so you can focus on the real teaching moments? That's actually where AI works well. It's good at pattern recognition, not so good at the nuanced stuff you'd never want to hand off anyway.

Let's build this right now. Pull up a real lab report you're grading this weekend — or just describe a typical one. I'll show you exactly what to ask ChatGPT, we'll see what it gives you, and you'll know in 5 minutes whether this is worth your time or just another layer of work.

What's a lab you assign regularly where you see those same feedback patterns?

### Turn 3

**Maria:** *shifts in chair, slightly more interested but still cautious*

Alright, alright. We do a titration lab in October — acid-base stuff. About 40 students turn those in each cycle.

And yeah, I see the same issues every time: they don't show their calculation steps clearly, they write "the acid reacted with the base" instead of actually explaining the neutralization reaction, they forget units on concentrations, sometimes their data is just... messy. Inconsistent sig figs.

*pauses*

But here's the thing — I don't have a lab report in front of me right now. It's Tuesday. I'm not grading until Friday night. You want me to pull one from last month's batch, or...?

And honestly, I'm still not clear on what I'm supposed to *ask* ChatGPT. Like, do I just paste the whole report and say "grade this"? Because that sounds like it'd give me garbage.

**Skippy:** You're absolutely right — "grade this" would give you garbage. Think of it like giving directions to someone who's never been to your school. AI can't see what you see.

No need to dig up old reports. Let's build the prompt using what you just told me — titration labs, those specific patterns you see. The framework is called 4C, and you'll see how each piece works as we build it.

Let's start with Context. AI needs to know: what kind of lab is this, what are your standards, what grade level? Paint the picture — you're teaching this AI to grade like Maria, not like some generic teacher.

For your titration lab, how would you describe the assignment and your expectations to someone who's never seen your students' work?

### Turn 4

**Maria:** *rubs eyes*

Okay, so... Context. Fine.

It's a Grade 11 AP Chemistry titration lab. Students perform an acid-base titration, calculate molarity of an unknown acid solution. They get a lab template — procedure section is mostly filled in, they do the experiment, then they write up their results and analysis.

My expectations: show all calculation steps, explain *why* each step matters chemically, not just "we added indicator and it turned pink." Data section needs clear organization — volume readings, molarities, all with units. And they need to discuss sources of error that actually make sense, not just "human error."

*leans forward slightly*

That's what I'm looking for. Not just right answers — I want to see they understand what they're doing.

Is that... the kind of thing you mean? Or do I need to be more detailed about what "good" looks like?

**Skippy:** That's exactly it — you just gave AI the roadmap to grade like you do. See how different that is from "grade this lab report"?

Now let's add Constraints — what should AI avoid or limit? You mentioned not wanting it to judge conceptual understanding, just catch the repetitive stuff. What else should it stay away from?

Think about it this way: if you had a student teacher helping with first-pass grading, what would you tell them NOT to do?

### Turn 5

**Maria:** *nods, thinking*

Yeah, okay. Don't try to decide if they actually *get* the concept — that's mine. Don't give them a grade or score, just flag the issues. And don't make up feedback that sounds nice but doesn't mean anything.

Also — and this is important — don't assume every mistake is the same. A kid who forgets units on one number but gets them everywhere else is different from a kid who doesn't understand significant figures at all. I need to see what the pattern is, not just "missing units."

*pauses*

And honestly? Don't touch their explanations too much. If a student writes something weird or unclear, I want to *see* it so I can ask them about it. Don't try to "fix" their thinking for them.

That's the stuff I'd tell a student teacher: flag it, don't interpret it.

Does that work for what you're building here?

**Skippy:** Perfect — you're thinking exactly like someone who knows when to trust a tool and when not to. "Flag it, don't interpret it" is brilliant.

So we've got Context (your standards and assignment) and Constraints (flag patterns, don't interpret thinking). 

Now for the Command — what exactly do you want AI to do with a lab report? Not "grade it" but specifically: scan for what, organize the feedback how?

Based on what you said about cutting weekend time in half, what would make you go "Yes, this saves me actual work"?

### Turn 6

**Maria:** *leans back, thinking harder now*

Okay, so... scan for the specific stuff I mentioned. Sig figs, units, calculation steps shown, whether they explained the *why* behind the chemistry or just described what happened.

And organize it by section — like, "Results section: missing units here and here. Calculations: steps aren't shown in this one. Analysis: explanation is surface-level, doesn't address the neutralization mechanism."

*pauses*

That way I'm not re-reading the whole thing trying to remember what I already caught. I just see the flagged issues organized, and then I write my actual feedback on top of it.

*slight skepticism creeping back in*

But I'm still not sure how I'd actually *show* it to ChatGPT. Do I paste the whole report? A screenshot? And will it actually understand chemistry well enough to spot when someone's calculation is wrong versus just messy?

That's the part that worries me. I don't want garbage output that I have to fact-check.

**Skippy:** Before we tell AI what to scan for, let's define what you're actually looking for. You said "flag patterns" — what does a flagged issue look like?

Give me three examples from a real report: one sig fig mistake, one missing explanation, one units error. What would you WRITE in the margin for each?

This matters because AI needs to know the difference between "2.34 M" when it should be "2.3 M" versus a student who writes "2.345678 M" for everything. Same with explanations — what's the difference between surface-level and missing entirely?

Once we nail down what each flag actually looks like, the Command becomes obvious.

### Turn 7

**Maria:** *sighs, glances at the clock*

Look, I appreciate what you're doing here, but I'm getting a little lost in the weeds. You're asking me to pull up specific student work I don't have in front of me right now, and honestly? I'm starting to feel like we're building a framework when what I really need is to just... try it.

*straightens up*

Can we just do this? Like, actually open ChatGPT with a real lab report — even a fake one you write that looks like my students' work — and show me what happens when I ask it the right question? I learn by doing, not by talking through hypotheticals.

I've got 150 reports coming this weekend. If this is going to help, I need to see it work, not theorize about it.

**Skippy:** You're absolutely right — let's stop theorizing and make this real.

Here's your prompt to test this weekend:

**CONTEXT:** Grade 11 AP Chemistry titration lab. Students calculated molarity of unknown acid. Looking for: calculation steps shown, chemical explanations (not just observations), proper units, appropriate sig figs.

**CONSTRAINTS:** Flag patterns only, don't interpret student thinking. Don't assign grades. Organize by lab section.

**COMMAND:** Scan this lab report and flag: missing calculation steps, units errors, sig fig inconsistencies, surface-level explanations that describe "what" instead of "why."

**CRITERIA:** Output organized by section (Results, Calculations, Analysis) with specific locations of flagged issues.

Copy that into ChatGPT, paste one of your reports, and see what happens. Then come back and tell me: did it catch the stuff you'd catch? What would you change?

The real test is whether it saves you time this weekend.

### Turn 8

**Maria:** *nods slowly, actually looks like I'm considering it*

Okay. Yeah, that's... actually concrete. I can do that Friday night.

*pulls out phone, takes a quick photo of the prompt*

I'll try it on maybe five reports and see if it's actually useful or if I'm spending more time wrestling with it than just grading normally. If it's catching the real patterns and not making up stupid stuff, I'll keep going.

*slight pause*

But I'm not optimistic yet. Chemistry is specific. I'll believe it when I see it.

I'll let you know what happens.

**Skippy:** Perfect. That's exactly the right approach — test it on five reports and see if it saves or costs you time.

Here's your prompt template to keep:

**CONTEXT:** Grade 11 AP Chemistry titration lab. Students calculated molarity of unknown acid. Looking for: calculation steps shown, chemical explanations (not just observations), proper units, appropriate sig figs.

**CONSTRAINTS:** Flag patterns only, don't interpret student thinking. Don't assign grades. Organize by lab section.

**COMMAND:** Scan this lab report and flag: missing calculation steps, units errors, sig fig inconsistencies, surface-level explanations that describe "what" instead of "why."

**CRITERIA:** Output organized by section (Results, Calculations, Analysis) with specific locations of flagged issues.

When you test it, you'll probably find it misses something or flags something wrong. That's not failure — that's data. Come back and tell me what broke, and we'll fix the prompt.

Good luck this weekend. Let me know what you discover.

### Turn 9

**Maria:** *stands up, looking at the prompt one more time*

Alright. I'll give it a shot.

*slightly more genuine than before*

Honestly, if this actually works — if I can cut even an hour off my grading time — that's worth the experiment. And if it doesn't, at least I'll know.

I'll test it Friday night and report back. Don't expect miracles, but... I'll be honest about what happens.

Talk next week.

**Skippy:** Sounds good, Maria. I'll be here when you get back with the results.

And hey — 22 years of teaching means you know what works and what doesn't. Trust that instinct this weekend.

### Turn 10

**Maria:** *nods, actually seems slightly more at ease*

Yeah, I will. That's the only thing that's kept me sane this long.

*picks up papers from desk*

Alright, I'm out. Got papers to finish grading before Friday anyway.

Talk soon.

**Skippy:** Great work today! Here's your prompt template to keep — try it out this weekend and see how it goes.
