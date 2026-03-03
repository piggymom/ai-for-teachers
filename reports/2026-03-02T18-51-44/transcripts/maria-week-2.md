# Maria Chen — Week 2: Prompting Fundamentals

**Persona:** Skeptical veteran. Guarded, gives short answers, pushes back on hype. Warms up when she sees concrete value. 22 years teaching.
**Subject:** Chemistry | **Grades:** 10th, 11th, 12th
**AI Experience:** new | **Goal:** save_time
**Target Level:** unistructural

**Final Ledger State:**
- Phase: SAVE
- Diagnosed Level: relational
- Exchanges: 10
- Engagement: high

---

### Turn 1

**Maria:** *sighs* 

Look, I haven't really "tried" much with AI yet. I poked around with ChatGPT for maybe five minutes last week — asked it to write a generic chemistry lab rubric, and it spit out something so vague it was useless. "Demonstrates understanding of concepts" — tell me something I don't know.

That's why I'm skeptical about this whole thing. If I'm going to spend time learning how to "prompt" it, I need to see it actually solve my problem: giving my students real, specific feedback on their lab reports without me losing my entire weekend. So far, I haven't seen how that happens.

What are we actually building here?

**Skippy:** That rubric sounds completely useless — "demonstrates understanding" could mean anything. But here's what went wrong: you asked for something generic when what you need is deeply specific to your chemistry labs and your standards.

The framework we use is called 4C: Context, Constraints, Command, Criteria. You'll see how each piece works as we build.

Let's build a prompt for something that takes too much of your time. When you're grading those lab reports, what's the specific task that eats up your weekend? Is it the initial feedback pass, or something more targeted like checking their data analysis or conclusion quality?

### Turn 2

**Maria:** *leans back*

The initial feedback pass. I've got 150 students, two weeks between reports. I'm reading through each one, marking up methodology issues, data interpretation problems, writing clarity — it's scattered everywhere and takes forever because I'm jumping between different types of mistakes.

If I could at least get a first-pass summary of *what's actually wrong* with each report before I sit down to write feedback, that would cut my time in half. Right now I'm starting from zero every time.

But I'm not handing my grading to a robot. I still need to actually read what's there.

**Skippy:** Exactly — you're not handing grading to a robot. You're getting a diagnostic summary so you know where to focus your expert attention. Like a lab assistant who pre-sorts samples before you analyze them.

Let's build a prompt that gives you that first-pass summary. We'll structure it so AI identifies the specific issues you care about, in your language, for your standards.

First, Context — what does AI need to know about these reports? What are your students writing, what should they include, what level are we talking about?

### Turn 3

**Maria:** *nods slightly*

Okay, that makes sense actually.

So — grades 10-12, mostly 11th and 12th graders. Lab reports follow a standard format: hypothesis, methodology, data table, calculations, analysis of results, and conclusion. They're supposed to explain *why* their data turned out the way it did, not just report numbers. That's where most of them fall apart.

And I need to know: did they actually understand the chemistry, or did they just follow steps? That's the difference between "I heated the compound and it turned blue" and "I heated the compound and it turned blue because the copper sulfate underwent thermal decomposition."

That's what matters to me. Procedure-following versus actual understanding.

**Skippy:** Perfect — that's your Context. "Grades 10-12 chemistry lab reports with standard format. Key distinction: procedure-following versus actual chemistry understanding. Look for explanations of WHY results occurred, not just WHAT happened."

Now Constraints — what should AI avoid or limit? You mentioned you're not handing grading to a robot. What boundaries matter here?

Think of it like giving directions to someone who's never been to your school — you need to tell them what NOT to do so they don't take wrong turns.

### Turn 4

**Maria:** *pauses, thinking*

Right. So — don't give a grade or final judgment. I'm doing that. And don't try to be encouraging or use that fake teacher voice. I can write "good job" myself if it's warranted.

Also... don't miss sloppy methodology. If a student's procedure is unclear or skips steps, I need to know that specifically, not "the methodology section could be improved." And don't let them off the hook for vague conclusions — if they say "the experiment worked" without explaining what that means chemically, flag it.

*leans forward slightly*

Actually, here's the big one: don't assume the data is right. Sometimes students record garbage numbers or miscalculate, and that breaks the whole analysis. I need AI to point out when the data or math doesn't make sense, not just accept it.

That's the stuff I catch and they miss.

**Skippy:** Those are smart Constraints — you're protecting your role as the chemistry expert while getting AI to flag the specific issues that matter. "Don't grade, don't use teacher voice, don't soften methodology problems, don't accept vague conclusions, don't assume data accuracy."

Now the Command — what exactly should AI do with each report? You want a diagnostic summary, but what should that look like? A paragraph, bullet points, categories?

### Turn 5

**Maria:** *thinks for a second*

Bullet points. Three or four max — I don't want to read an essay. 

And organize it the same way every time: **Methodology issues** (if any), **Data/calculation problems** (if any), **Analysis gaps** (where they're not explaining the why), **Conclusion clarity** (vague or solid). If a section is fine, skip it. I don't need to hear "the hypothesis was clearly stated" — tell me what's broken.

*pauses*

Make it scannable. I'm reading 150 of these, so if it takes me more than 30 seconds to understand what's wrong with each report, it defeats the purpose.

**Skippy:** You said don't soften methodology problems and flag them specifically. If AI gives you a paragraph, can you quickly spot which reports have methodology issues? Or do you need a different shape?

Looking at your constraints — you want specific flags, not softened language, and you want to catch data errors and vague conclusions. How does that connect to getting something scannable in 30 seconds?

### Turn 6

**Maria:** *nods*

Yeah, you're right. If methodology issues are buried in a paragraph, I'll miss them or have to re-read it.

Split it into categories like I said, but lead with the *problem type* in bold. Like:

**Methodology:** Step 3 unclear — doesn't specify temperature range for heating.

**Data:** Calculation error in molar mass — shows 58g/mol but should be 46g/mol based on their numbers.

**Analysis:** Describes what happened (color change) but doesn't explain the chemistry behind it.

That way I can scan the bold parts in five seconds and know exactly what I'm walking into with each report. No fluff.

*slight pause*

I think that actually works.

**Skippy:** That structure makes your constraints actionable — you can spot methodology problems at a glance, catch data errors immediately, and see where they're missing the chemistry understanding you care about.

Now Criteria — what does a GOOD diagnostic summary look like? When this prompt works perfectly, what will tell you "yes, this caught what I needed to catch"?

Think about a report where a student got the procedure mostly right but drew completely wrong conclusions. What would you want to see in those bullet points?

### Turn 7

**Maria:** *sits back*

Okay, so a good diagnostic would catch that the methodology was solid but then flag: **Analysis:** Student concludes compound decomposed, but based on their data (mass increased, not decreased), that's chemically impossible. They didn't notice the contradiction.

That's the sweet spot — AI isn't telling me the student is wrong. It's saying "here's what the data actually shows versus what they concluded." Then *I* can decide how to guide them.

*gestures*

So the criteria: it catches real chemistry errors, not just writing problems. It points out contradictions between data and conclusions. And it's specific enough that I can write actual feedback based on it, not generic stuff.

If I read the bullet points and think "yeah, I see exactly what I need to address with this student," then it worked. If I read it and still have to dig through the report myself to figure out what's wrong, it failed.

Does that make sense?

**Skippy:** That's exactly it — you want AI to be your chemistry-savvy lab assistant, not just a writing checker. "Catches real chemistry errors, flags data-conclusion contradictions, specific enough to guide your feedback."

Here's your complete prompt template:

**CONTEXT:**
Grades 10-12 chemistry lab reports with standard format (hypothesis, methodology, data table, calculations, analysis of results, conclusion). Key distinction: procedure-following versus actual chemistry understanding. Look for explanations of WHY results occurred, not just WHAT happened.

**CONSTRAINTS:**
- Don't give a grade or final judgment
- Don't use encouraging or fake teacher voice
- Flag sloppy methodology specifically — not softened language
- Flag vague conclusions — if they say "the experiment worked" without chemical explanation, call it out
- Don't assume data is correct — point out when data or math doesn't make sense

**COMMAND:**
For each report, provide a diagnostic summary in bullet points (3-4 max). Lead with problem type in bold. Skip sections that are fine.

**Format:**
**Methodology:** [specific issue or skip]
**Data:** [specific issue or skip]  
**Analysis:** [specific issue or skip]
**Conclusion:** [specific issue or skip]

**CRITERIA:**
Catches real chemistry errors, flags contradictions between data and conclusions, specific enough to write targeted feedback from.

This is ready to test. Try it in ChatGPT or Gemini with one of your actual lab reports and see what comes back. What would you change based on real output?

### Turn 8

**Maria:** *reads through it carefully*

Yeah, okay. This is actually... concrete. Not vague marketing stuff.

*pauses*

I'll test it this week on a few reports — maybe three or four that I know have different problems. See if it actually catches the chemistry issues or if it just surfaces surface-level stuff. And I'll time myself to see if it actually saves me time or if I'm spending half an hour wrestling with the tool.

*slight skepticism creeping back in*

I'm guessing the real test is whether it misses things I would've caught, or worse, flags stuff that's actually fine and wastes my time defending student work. That's my concern.

But... I'll give it a shot. Better than another generic rubric.

**Skippy:** That's smart testing — different problem types, timing yourself, and watching for false positives. Those are exactly the failure modes that matter.

Here's your prompt template to keep:

**DIAGNOSTIC PROMPT FOR CHEMISTRY LAB REPORTS**

**CONTEXT:**
Grades 10-12 chemistry lab reports with standard format (hypothesis, methodology, data table, calculations, analysis of results, conclusion). Key distinction: procedure-following versus actual chemistry understanding. Look for explanations of WHY results occurred, not just WHAT happened.

**CONSTRAINTS:**
- Don't give a grade or final judgment
- Don't use encouraging or fake teacher voice
- Flag sloppy methodology specifically — not softened language
- Flag vague conclusions — if they say "the experiment worked" without chemical explanation, call it out
- Don't assume data is correct — point out when data or math doesn't make sense

**COMMAND:**
For each report, provide a diagnostic summary in bullet points (3-4 max). Lead with problem type in bold. Skip sections that are fine.

**Format:**
**Methodology:** [specific issue or skip]
**Data:** [specific issue or skip]
**Analysis:** [specific issue or skip]
**Conclusion:** [specific issue or skip]

**CRITERIA:**
Catches real chemistry errors, flags contradictions between data and conclusions, specific enough to write targeted feedback from.

Test it on those few reports and see what happens. If it saves you even 20 minutes per grading session, that's your weekend back.

### Turn 9

**Maria:** *nods, actually looking engaged*

Twenty minutes per session would be huge. That's real time.

I'll run it this weekend on maybe four reports — mix of decent ones and ones I know are messy. See if it actually does what we built it to do or if I'm chasing my tail.

*slight pause*

I'll let you know what breaks. And if the output is garbage, I'm not spending more time tweaking prompts. I've got actual chemistry to teach.

But... this makes more sense than what I was doing before. At least there's a logic to it instead of just "write me a rubric."

**Skippy:** That's the right approach — test it hard, see what breaks, and bail if it's not saving real time. You've got better things to do than babysit AI.

The logic you built here — Context sets the chemistry standards, Constraints protect your role, Command shapes the output format, Criteria define success — that transfers to any AI task. You can adapt this same structure for safety protocols, lab prep instructions, whatever eats your time.

When do you think you'll test those four reports?

### Turn 10

**Maria:** *glances at calendar*

This weekend. I've got grading piled up anyway, so I might as well run the prompt on a few while I'm at it. Shouldn't take more than an extra five minutes per report to see if it's worth my time.

*stands up slightly, signaling wrap-up*

I'll know by Monday if this is actually useful or just another thing I tried that didn't work. If it catches real problems and saves me time, we can talk about using it more systematically. If it's generating fluff, I'm done.

Fair?

**Skippy:** Fair. You'll know by Monday whether it's solving your actual problem or wasting your time.

Here's your prompt — this is saved to your artifacts so you can find it anytime. Try it this weekend and see what happens.

Great work building something concrete instead of settling for generic fluff.
