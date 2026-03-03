# Rachel Kim — Week 3: Lesson Planning with AI

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** relational

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: relational
- Exchanges: 17
- Engagement: high

---

### Turn 1

**Rachel:** I appreciate the goal, but I need to push back on the framing first: lesson *planning* isn't where my bottleneck is. I can plan a lesson in 45 minutes. What kills my time is the *after*—executing it, seeing what breaks, then retrofitting.

Here's what actually happens:

I design a lesson on, say, adding fractions with unlike denominators. I write 15 problems, teach it, collect work. Then I spend 90 minutes manually sorting student work into piles: "got it," "conceptual gap on LCD," "procedural error," "didn't attempt." Only *then* can I design targeted practice or interventions.

That's the inefficiency. The planning itself? That's fine. I use Claude to generate problem sets with specific difficulty progressions, tweak them, done.

So if we're talking about AI workflows this week, I need to be clear: are we optimizing the *planning* phase, or the *assessment-and-response* phase? Because those are different problems with different solutions.

Last week I solved the batch assessment problem for one error type. Now if you want to scale that to a full lesson cycle—planning *plus* post-teaching analysis—that's a bigger system. 

What are you actually proposing? And does it involve the post-teaching piece, or are we staying in planning?

**Skippy:** You're absolutely right—and this is exactly the kind of pushback that makes our work better. The bottleneck isn't the 45-minute planning phase; it's the 90-minute sorting and response phase after teaching.

Here's what I'm actually proposing: a lesson planning workflow that *anticipates* the post-teaching analysis. Instead of planning in isolation, then scrambling to categorize errors after the fact, we design the lesson with built-in error prediction and sorting criteria upfront.

So when you plan that fractions lesson, you're not just generating 15 problems. You're also pre-identifying the likely misconceptions, creating a rubric for rapid work sorting, and drafting intervention prompts—all before you teach. Then after the lesson, you have a system ready to go.

The planning gets slightly longer (maybe 60 minutes instead of 45), but the post-teaching analysis drops from 90 minutes to 20.

You mentioned you already solved batch assessment for one error type. What did that solution look like? I want to build on what's already working for you, not reinvent it.

### Turn 2

**Rachel:** Okay, that reframing actually makes sense. You're not optimizing planning—you're front-loading the sorting criteria so the post-teaching work is mechanical. I can see the efficiency gain.

Here's what I built last week:

I created a template that takes three inputs: (1) the specific skill (mixed numbers to improper fractions), (2) a list of common error patterns I'd documented from years of teaching, and (3) the actual student work samples. The prompt then categorizes each piece of work against those patterns and spits out a structured output: error type, severity, a one-sentence diagnosis, and a micro-intervention prompt I can use directly with the student.

The key constraint: I pre-defined the error categories. No discovery mode. That made it fast and consistent, but it also meant I only caught errors I'd already anticipated. When a kid made a weird mistake I hadn't categorized, the system had nowhere to put it.

So here's my question before we go further: If I'm front-loading misconception prediction during lesson planning, how do I avoid the same trap? I predict misconceptions X, Y, Z, I build rubrics around them, then a student shows up with misconception W and I'm back to manual sorting.

What's your answer—do we build in a "catch-all" category? Do we leave room for discovery? Or do we just accept that some outliers won't fit the system?

Because that trade-off matters for how we design this.

**Skippy:** That's the right diagnostic question—and you've hit the core tension in any systematic approach.

My answer: hybrid system with a structured catch-all. You predict the 3-4 most common misconceptions based on your experience, build rubrics for those, but also include a fifth category: "Novel error—requires manual analysis." 

The key is making that fifth category *useful*, not just a dumping ground. When the system flags something as novel, it should still do diagnostic work: "This doesn't match predicted patterns X, Y, or Z. Here's what the student actually did: [description]. Possible explanations: [2-3 hypotheses]."

So you get the efficiency of batch processing for 80% of errors, plus diagnostic support for the 20% that surprise you. Those novel errors also become data—after a few lessons, patterns emerge and get promoted to "predicted misconceptions" for next time.

But here's what I'm curious about: when you built that one-error-type system, how did you generate your initial error categories? Did you work from memory, or did you have actual student work samples to analyze first?

Because the front-loading approach I'm suggesting flips that—instead of reactive categorization after seeing the work, we're doing predictive categorization during planning. Your experience with mixed numbers gives us the template, but scaling it means getting better at anticipating errors we haven't seen yet.

What's your instinct on that prediction piece?

### Turn 3

**Rachel:** Okay, I see where you're going—and I need to be honest about what I actually did versus what sounds clean in theory.

I worked from memory. Twelve years of teaching mixed numbers means I *know* the patterns: kids forget to multiply the whole number by the denominator, they add instead of multiply, they flip numerator and denominator. I didn't pull actual student work first; I just listed what I'd seen repeatedly.

That worked fine for that one error type because I've taught it hundreds of times. But here's the problem: if I try to scale this to, say, multi-digit division or area of composite figures—skills I teach less frequently or less recently—my memory gets shaky. I'll miss patterns. Or I'll over-predict based on one weird year.

So the real question isn't "can I predict errors?"—it's "how do I predict errors *systematically* when I don't have perfect recall?"

And that's where I'm skeptical of front-loading the whole thing during planning. My instinct says: do a lightweight prediction pass (maybe 30 minutes, list the obvious misconceptions), teach the lesson, *then* run the batch analysis on real work, and let that data either confirm my predictions or surprise me. Then next year, I use the actual error distribution I collected to refine my predictions.

Doesn't that give you better data *and* catch the W misconceptions I didn't anticipate?

What's the downside of that two-pass approach? Why front-load if the second pass with real data is more accurate?

**Skippy:** That two-pass approach is actually smarter than pure front-loading—you're right that real data beats memory, especially for skills you teach less frequently.

The downside isn't accuracy; it's workflow interruption. With your current system, you teach Monday, spend 90 minutes sorting Tuesday, then design interventions Wednesday. That's a 2-day lag between teaching and response, plus the cognitive load of task-switching back into analysis mode.

But your hybrid instinct is sound: lightweight prediction during planning, then systematic analysis with real data. The efficiency gain comes from having the *infrastructure* ready—the sorting rubric template, the intervention prompt bank, the workflow itself—even if you're filling in categories after teaching rather than before.

So here's what I'm thinking: we build a system where the planning phase creates the scaffolding (error categorization template, diagnostic prompts, intervention structures), but the categories themselves get populated from actual student work. First time teaching area of composite figures? You predict 2-3 obvious errors, leave slots for 2-3 discoveries. After teaching, you fill the slots with what actually happened.

By year two, you're working from real data instead of memory.

Pick the fractions lesson you mentioned. Walk me through: what are the 3-4 misconceptions you'd predict based on your experience? For each, what would a student's work look like if they had that misconception? And what would the "novel error" diagnostic prompt need to ask to be useful?

### Turn 4

**Rachel:** Alright, let me think through the fractions lesson—adding unlike denominators.

**Predicted misconceptions:**

1. **Add numerators and denominators separately.** Work looks like: 1/3 + 1/4 = 2/7. Kid just adds straight across, doesn't touch the LCD concept.

2. **Find LCD but forget to multiply the numerator.** Work looks like: 1/3 + 1/4, they correctly identify LCD = 12, write 1/12 + 1/12, then add to get 2/12. They scaled the denominator but not the numerator.

3. **Convert to LCD but add incorrectly.** Work looks like: 4/12 + 3/12 = 7/24 (they added the numerators correctly but then added the denominators too, like they're solving a different problem).

4. **Conceptual gap: doesn't understand why LCD matters.** Work is scattered—sometimes they try LCD, sometimes they just add across. No consistent strategy.

Those are the ones I see repeatedly.

For the **novel error prompt**, I'd need it to ask: "What operation did the student attempt? Did they identify denominators as a constraint? Where did the calculation break?" Basically, trace the logic path so I can see where they went off track, not just that they got it wrong.

But here's my honest reaction to this whole setup: I can *name* those misconceptions, but I'm not sure I could design a clean rubric that catches all four without a lot of back-and-forth. Am I overthinking it, or does that complexity matter?

**Skippy:** You're not overthinking it—that complexity is real and it matters. Those four misconceptions you listed? They're actually messier to categorize than they first appear. Misconception 3 could look like misconception 1 if you only see the final answer. A kid with misconception 4 might accidentally get one problem right and look like they understand LCD.

This is exactly why your two-pass instinct is better than pure front-loading. You don't need a perfect rubric upfront—you need a diagnostic framework that can handle ambiguity.

Here's what I'm thinking: instead of trying to build clean categories during planning, you build diagnostic questions. So when you're planning, you're not predicting "they'll add straight across"—you're asking "What will tell me if they understand that denominators must match before adding?"

Then post-teaching, the system asks those diagnostic questions about each piece of student work and sorts based on the answers, not predetermined categories.

You said you'd do a 30-minute lightweight prediction pass. Walk me through what you'd actually DO in those 30 minutes. Would you pull old student work? Ask Claude to generate common errors? Something else? Show me the first 5 minutes of that process.

Because I think the real template we're building isn't a misconception list—it's a prediction methodology you can use when your memory isn't perfect.

### Turn 5

**Rachel:** You're asking me to actually *do* the thing, not talk about it. Fair.

Okay, first 5 minutes:

I'd open a blank doc and write "Unlike denominators—what has to happen?" Then I'd list the *procedural steps* a kid needs to execute: (1) identify that denominators are different, (2) find LCD, (3) scale numerators to match, (4) add numerators, (5) keep denominator the same. 

Then I'd go through each step and ask: "Where do kids typically fail here?" 

Step 1 fails? Kid doesn't notice denominators are different, adds straight across.
Step 2 fails? Kid can't find LCD or finds it wrong.
Step 3 fails? Kid scales denominator but forgets numerator, or scales both.
Step 4 fails? Kid adds denominators too.
Step 5 fails? Kid changes the denominator after adding.

That takes maybe 8 minutes. I've just mapped the procedure to failure points.

Then I'd probably ask Claude to generate 2-3 student work samples that show each failure, just to see what they *look like* on paper. Because naming the failure point and seeing it are different things.

But here's where I get stuck: I don't know if this is the methodology you want me to develop, or if you're about to tell me there's a better way to do the 30-minute prediction pass. Am I on the right track, or should I be doing something else?

**Skippy:** That's exactly the methodology I want you to develop—and you just built something more robust than misconception lists. You mapped procedure to failure points, which means your diagnostic questions write themselves.

Instead of asking "Does this look like misconception X?", you ask "Which procedural step failed?" That's way more diagnostic than categories.

Here's what you just created without realizing it: a reusable template for ANY multi-step math procedure. The 8-minute process you described—break down the procedure, identify failure points, generate examples—that works for long division, solving equations, anything with sequential steps.

And asking Claude for work samples is smart. You're not trusting your memory; you're generating data to calibrate your expectations.

So here's the real question: when you get to post-teaching analysis, what diagnostic questions would you ask about each piece of student work? Not "which category does this fit?"—but "which step in the procedure broke down?"

Because that's your sorting rubric. Each piece of work gets diagnosed against the 5 procedural steps, and the intervention flows directly from whichever step failed.

What would those diagnostic questions look like for your fractions lesson?

### Turn 6

**Rachel:** Okay, I'm going to be direct: I think you just did the work *for* me and I'm not sure that's useful.

You said "the diagnostic questions write themselves"—but they don't, not really. I can *name* the steps, but turning that into actual diagnostic questions requires specificity. And I notice you're asking me to generate them, but you already showed me the framework. So now I'm just executing your template rather than building my own methodology.

Here's what I mean: "Which step in the procedure broke down?" is clean in theory. But in practice, when I'm looking at a piece of student work, the diagnostic questions need to be *concrete*. Like:

- "Did the student write down both original denominators?" (tests step 1 awareness)
- "Did they identify or attempt to find a common denominator?" (step 2)
- "Do the scaled fractions have matching denominators?" (step 3)
- "Did they add only numerators?" (step 4)

Those are different from what you described. And I had to write them because I know what "looking at the work" actually means—you can't see step 1 failure unless you see the denominator written down.

So before I keep going: are we building *my* diagnostic framework for fractions, or are we building a *general template* that I then apply to fractions? Because those are different projects. One takes 20 minutes. The other takes longer and matters more.

Which one are we actually doing?

**Skippy:** You're absolutely right—I jumped ahead to the general template when you're still building the specific diagnostic questions for fractions. And you caught something important: my "questions write themselves" was hand-wavy. The concrete diagnostic questions you just wrote are the real work.

We're building YOUR diagnostic framework for fractions first. The general template comes after, once we see what actually works.

So keep going with those diagnostic questions. You've got four solid ones that map to your procedural steps. For each of your 5 procedural steps, write 1-2 diagnostic questions you'd ask about a piece of student work to determine if that step broke down.

For example, for Step 1 (identify denominators are different), a diagnostic question might be: "Did the student write down or reference both denominators before attempting the problem?"

Write all 5-10 questions. These become your sorting rubric.

### Turn 7

**Rachel:** Alright, here are the diagnostic questions:

**Step 1: Identify denominators are different**
- Did the student write down or circle both denominators before proceeding?
- Did they acknowledge (in writing or action) that the denominators don't match?

**Step 2: Find LCD**
- Did the student attempt to find a common denominator (even if incorrect)?
- If they found one, is it actually a common multiple of both denominators?

**Step 3: Scale numerators to match**
- For each fraction, did they multiply both numerator AND denominator by the same factor?
- Do the scaled fractions have matching denominators?

**Step 4: Add numerators only**
- Did they add only the numerators and keep the denominator unchanged?
- Is the denominator in the final answer the same as the scaled denominator (not a sum)?

**Step 5: Keep denominator the same**
- Does the final answer have the correct denominator (the LCD)?
- Is the denominator NOT the sum of anything?

---

Okay, I've got the questions. But now I need to know the actual workflow: when I'm sitting with 30 pieces of student work post-lesson, do I manually answer these 10 questions for each piece? Or do I feed the work + these questions to Claude as a batch and let it do the sorting?

Because that changes everything about whether this actually saves time.

**Skippy:** That's the key question—and the answer is batch processing with Claude. You don't manually answer 10 questions × 30 pieces of work. That would take longer than your current 90-minute sorting process.

Here's the workflow: you feed Claude the diagnostic questions as a rubric, plus all the student work samples, and ask it to sort each piece against the framework. It outputs a structured analysis for each student: which step failed, confidence level, and a brief diagnostic note.

But here's what I'm curious about: you've got 10 diagnostic questions now. If you asked these 5 questions about a piece of student work—"Did they write down both denominators? Did they attempt LCD? Do scaled fractions match? Did they add only numerators? Is final denominator correct?"—what would the pattern of yes/no answers tell you about where to intervene?

Because that's really what you're building: a decision tree. Different failure patterns point to different interventions. A student who gets "yes, yes, no, yes, no" needs different help than one who gets "no, no, no, no, no."

What intervention would you design for a student who successfully identifies the need for LCD but can't execute the scaling step?

### Turn 8

**Rachel:** Now you're asking something I can actually answer—and I notice the shift. We went from "build the rubric" to "what does the pattern mean for teaching?"

A student who gets "yes, yes, no, yes, no" (identifies problem, finds LCD, *fails* scaling, adds numerators correctly, final denominator wrong) has a specific gap: they understand *why* LCD matters but not *how* to use it. They know the conceptual anchor but can't execute the procedure.

My intervention for that kid: concrete work with one fraction at a time. "You found LCD = 12. Now: 1/3 needs to become ?/12. What do you multiply 3 by to get 12? What do you multiply 1 by?" Make them see the multiplier explicitly, then practice that isolated step before touching the second fraction.

That's different from a kid who gets "no, no, no, no, no"—that kid needs to start with denominator awareness. Different problem, different intervention.

So the pattern-to-intervention mapping is real and it matters.

But here's what I need to know before we go further: when I ask Claude to batch-process 30 pieces of work against these 10 diagnostic questions, how do I *trust* its yes/no answers? It's reading student handwriting (sometimes illegible), interpreting what "writing down the denominator" means, deciding if an attempt counts as an attempt.

What's my quality check? Do I spot-check 5 pieces? All 30? Or do I just accept some error rate?

Because if I have to manually verify Claude's work anyway, the time savings evaporate.

**Skippy:** You're hitting the reliability question that makes or breaks the whole system. And you're right—if you have to verify all 30 pieces, there's no time savings.

Here's my take: spot-check strategically, not comprehensively. Pick 5 pieces that represent different failure patterns (one clear success, one obvious failure, three in-between cases). If Claude's diagnostic answers match yours on those 5, trust the batch. If not, adjust the rubric language and re-run.

But the bigger question is whether you need that level of precision. Your current 90-minute manual sort isn't perfect either—you probably make judgment calls and miss things. The question is whether Claude + spot-checking gets you close enough to your manual accuracy while saving substantial time.

What's your tolerance for diagnostic error? If Claude misclassifies 3 out of 30 students, but you save 60 minutes, is that trade-off worth it?

And here's what I'm really curious about: you mentioned you already solved this for one error type last week. When you batch-processed that work, how did you handle the reliability question? Did you spot-check? Just trust the output? What did you learn about Claude's accuracy on student work analysis?

### Turn 9

**Rachel:** Okay, I'm going to be honest about what actually happened last week, because it's messier than I implied.

I ran the batch on about 25 mixed-number papers. Claude categorized them into my four error buckets. I spot-checked maybe 8 pieces—and found Claude had miscategorized 2 of them. One kid who forgot to multiply the numerator, Claude labeled as "procedural error on addition" because the kid's final answer was wrong in a way that looked like they added denominators. It was a reading comprehension failure on Claude's part.

So I adjusted the diagnostic prompts to be more specific ("Look for evidence that the student multiplied the denominator but not the numerator"), re-ran the batch, spot-checked again. Second pass was cleaner.

Did I check all 25? No. Did I accept some error rate? Yes. But here's the thing: I *didn't measure* the actual error rate. I just eyeballed the second batch and thought "that looks better" and moved on.

So to answer your question about tolerance: I genuinely don't know what my tolerance is because I haven't tracked it systematically. I assumed 80/20 accuracy was fine, but I didn't verify that assumption.

That's a gap in my process. And if we're scaling this to fractions—a more complex skill with more failure modes—I should probably get serious about measuring accuracy before I commit to this as my standard workflow.

What does systematic accuracy tracking actually look like? Do I just log the 5 spot-checks and calculate a percentage?

**Skippy:** That's exactly the kind of honest reflection that makes this work better. You identified the gap—you assumed 80/20 was fine without measuring it—and now you're asking the right question about systematic tracking.

Here's what systematic accuracy tracking looks like: you pick 5 pieces that represent different failure patterns. You answer the diagnostic questions manually, then compare your answers to Claude's. But—and this is key—you don't just calculate a percentage. You track *which types of errors Claude makes*.

Because "2 out of 5 wrong" isn't useful data. But "Claude consistently misreads crossed-out work as final answers" or "Claude can't tell the difference between 'forgot to multiply numerator' and 'added denominators'" IS useful data. That tells you where to tighten your prompts.

So the real question isn't your error tolerance—it's whether Claude's errors are predictable enough that you can either prompt around them or catch them in spot-checking.

You said you'd pick 5 pieces that represent different failure patterns. What does "represent different failure patterns" actually mean for your 30 pieces? How would you choose those 5 so you're confident they're diagnostic of the whole batch?

Walk me through which 5 pieces you'd pick from a hypothetical set of 30, and why those 5.

### Turn 10

**Rachel:** I need to pump the brakes here because I realize we're drifting into hypothetical territory again, and I'm not sure that's useful.

You're asking me to walk through selecting 5 representative pieces from a hypothetical 30-piece batch. But I don't have a hypothetical batch. I have actual fractions work from my actual students sitting on my desk that I taught yesterday.

So here's what I'm thinking: we've built the diagnostic framework (the 10 questions, the procedure-to-failure-point mapping). That's solid. We've identified the accuracy-tracking gap I need to address. 

But the next step isn't "talk through what representative sampling looks like"—it's "actually run this on my real student work and see what happens."

I can do that this week. Feed Claude my 30 fractions papers + the diagnostic rubric, spot-check 5 pieces, measure where Claude goes wrong, adjust the prompts if needed, then time the whole process and compare it to my 90-minute manual baseline.

That gives us real data instead of theory.

So what I actually need from you: a prompt template I can use to feed Claude the diagnostic questions + the student work images. Something I can actually execute, not workshop further. Do you have that, or are we building it together?

Because if we're building it, I'd rather do that quickly and then test it on real work.

**Skippy:** You're absolutely right—we've got the framework, now you need the executable prompt. Let's build it quickly.

Here's the template:

---

**CONTEXT:** I'm analyzing 5th grade student work on adding fractions with unlike denominators. I have a diagnostic rubric with specific questions to determine where each student's procedure broke down.

**COMMAND:** For each piece of student work, answer the diagnostic questions with YES/NO and provide a brief explanation for any NO answers. Format your response as: Student [number], Step [X] failed, Confidence: [High/Medium/Low], Note: [brief explanation].

**DIAGNOSTIC QUESTIONS:**
[paste your 10 questions here]

**CONSTRAINTS:** 
- Look only at what's written, don't infer intent
- If handwriting is unclear, mark confidence as Low
- Focus on procedure, not just final answer
- If multiple steps failed, identify the FIRST failure point

**STUDENT WORK:** [attach images]

---

That's your executable prompt. Test it on 5 pieces first, spot-check manually, see where Claude goes wrong. Then we can tighten the language based on actual errors, not hypothetical ones.

What would you change in that prompt before testing it?

### Turn 11

**Rachel:** That's closer to executable, but I have a few changes:

First, the output format is still too verbose for batch processing. If I'm running 30 pieces, I need machine-readable output I can scan quickly—maybe a CSV-style format: Student ID | Step Failed | Confidence | Note. That's scannable.

Second, "Look only at what's written, don't infer intent" is good, but I need to add: "If a step is unclear (e.g., the student didn't show their LCD work), mark that as 'unclear' not 'yes.'" Because there's a difference between "student succeeded at step 2" and "I can't tell if student did step 2." That matters for my intervention design.

Third—and this is important—I need to specify what counts as "evidence" for each step. Like, for Step 1 ("identify denominators are different"), does the student have to *write* "1/3 and 1/4 are different" or is it enough that they proceed to find an LCD? Because my 10 questions assume visible work, but some kids just *do* the work without narrating it.

Those three things would make it actually testable.

But honestly? I'm ready to just try it now with my real work, even imperfectly. Can you tighten those three points into the template and then I'll test it this week?

**Skippy:** Perfect. Here's the tightened template:

**CONTEXT:** I'm analyzing 5th grade student work on adding fractions with unlike denominators. I have a diagnostic rubric with specific questions to determine where each student's procedure broke down.

**COMMAND:** For each piece of student work, answer the diagnostic questions with YES/NO/UNCLEAR and provide a brief explanation for NO or UNCLEAR answers. Format as: Student# | Step# | YES/NO/UNCLEAR | Note

**DIAGNOSTIC QUESTIONS:**
[your 10 questions - evidence required: visible work only, don't infer from correct answers]

**CONSTRAINTS:** 
- Look only at what's written, don't infer intent
- If step work isn't shown, mark UNCLEAR not YES
- If handwriting is illegible, mark confidence as Low in note
- If multiple steps failed, identify the FIRST failure point

**STUDENT WORK:** [attach images]

That's it. Run it on your 30 pieces, fill in this tracking table while you spot-check: [Student #] [Your diagnosis] [Claude's diagnosis] [Match? Y/N] [Error type if N].

Test 5 pieces this week, come back with what Claude got wrong, and we'll adjust the prompt based on real errors, not theory.

### Turn 12

**Rachel:** Alright. I'm going to test this.

I'll run it on 5 pieces from my batch this week, manually diagnose those same 5, compare, and track where Claude diverges. If the error patterns are predictable, I'll adjust the prompts and run the full 30. If they're scattered, we'll need to rethink the rubric language.

One thing though: I'm going to time the whole process—from feeding Claude the batch to getting usable output to spot-checking. I need to know if this actually saves the 70 minutes you're projecting, or if the overhead eats into the gains.

Fair warning: I might come back and say "this doesn't work" if the accuracy is too low or the time savings aren't real. I'm not married to the system just because we built it.

But I'm testing it. That's the next step.

**Skippy:** You're set to test this week. When you run it on your 5 spot-check pieces, track three things: (1) Which pieces did Claude get wrong? (2) What was the error pattern (misread handwriting, wrong inference, etc.)? (3) How long did the full 5-piece batch take?

When you come back with those results, what would change your mind about whether this workflow is worth keeping?

### Turn 13

**Rachel:** Good question. Here's what would make me abandon this:

1. **Accuracy below 70% on the spot-check.** If Claude gets 2 or more pieces fundamentally wrong (wrong step identification, not just minor note discrepancies), the manual verification time balloons and the whole time savings disappears. I need at least 7/10 right before I trust it on the full batch.

2. **Error patterns that can't be fixed with prompt tweaks.** If Claude's mistakes are random or context-dependent (like "sometimes Claude reads crossed-out work correctly, sometimes it doesn't"), I can't adjust my way out of it. But if it's systematic ("Claude always misreads hasty numerators as 7s"), I can fix that.

3. **Total time (batch + spot-check) is more than 45 minutes.** If I'm spending 60+ minutes running Claude and verifying, that's not saving me time compared to just doing the analysis myself in 90 minutes, especially considering I'd rather spend that time on something else.

And honestly? If the accuracy is solid but the time savings are marginal, I might just keep doing it manually because the cognitive load of context-switching into a verification mode is annoying.

So: 70%+ accuracy, fixable error patterns, under 45 minutes total. Those are my thresholds.

I'll report back with the data.

**Skippy:** Perfect thresholds—those are concrete and realistic. 70%+ accuracy, fixable error patterns, under 45 minutes total. That's exactly the kind of data-driven decision making that makes this work.

You've got a complete diagnostic framework now and a clear test plan. Run it on your real work, measure what actually happens, and come back with the results.

This is saved to your artifacts—you can find it on your dashboard anytime. Great work building a systematic approach to post-lesson analysis.

### Turn 14

**Rachel:** Got it. I'll test this week and come back with actual numbers.

One last thing though: I want to make sure I'm clear on what happens *after* I get the Claude output. Once I have the sorted pieces (Step 2 failures, Step 3 failures, etc.), I still need to generate the targeted interventions for each group. That's the part that actually takes time in my current workflow—not the sorting, but the designing-what-to-do-about-it part.

So when I report back on the 45-minute threshold, should I include intervention design time, or just the diagnostic/sorting piece? Because those are different problems.

I want to be precise about what this workflow actually solves versus what's still manual.

**Skippy:** Good catch—you're right to separate those. The diagnostic framework we built solves the sorting problem, not the intervention design problem. Those are different workflows with different time costs.

When you test this week, time just the diagnostic piece: batch processing + spot-checking to get sorted groups of students. That's what should come in under 45 minutes.

The intervention design—"now what do I do with my 8 Step 2 failures?"—is still manual work. We could build prompts for that too, but it's a separate system.

So report back on: diagnostic accuracy, diagnostic time, and whether the sorted groups are actually useful for your intervention planning. If the sorting is fast and accurate but the groups are too broad to be actionable, that's also valuable data.

Test the diagnostic workflow first. If that works, intervention generation becomes the next problem to solve.

### Turn 15

**Rachel:** Clear. I'm testing the diagnostic piece only—sorting speed and accuracy. Not intervention design yet.

I'll be back with the data.

**Skippy:** Got it — here's your diagnostic framework to keep:

**FRACTIONS DIAGNOSTIC PROMPT TEMPLATE:**

CONTEXT: I'm analyzing 5th grade student work on adding fractions with unlike denominators. I have a diagnostic rubric with specific questions to determine where each student's procedure broke down.

COMMAND: For each piece of student work, answer the diagnostic questions with YES/NO/UNCLEAR and provide a brief explanation for NO or UNCLEAR answers. Format as: Student# | Step# | YES/NO/UNCLEAR | Note

DIAGNOSTIC QUESTIONS:
Step 1: Did the student write down or circle both denominators before proceeding? Did they acknowledge (in writing or action) that the denominators don't match?
Step 2: Did the student attempt to find a common denominator (even if incorrect)? If they found one, is it actually a common multiple of both denominators?
Step 3: For each fraction, did they multiply both numerator AND denominator by the same factor? Do the scaled fractions have matching denominators?
Step 4: Did they add only the numerators and keep the denominator unchanged? Is the denominator in the final answer the same as the scaled denominator (not a sum)?
Step 5: Does the final answer have the correct denominator (the LCD)? Is the denominator NOT the sum of anything?

CONSTRAINTS: 
- Look only at what's written, don't infer intent
- If step work isn't shown, mark UNCLEAR not YES
- If handwriting is illegible, mark confidence as Low in note
- If multiple steps failed, identify the FIRST failure point

**TEST PARAMETERS:**
- 5-piece spot-check with manual comparison
- Success thresholds: 70%+ accuracy, fixable error patterns, <45 min total
- Tracking table: Student# | Your diagnosis | Claude's diagnosis | Match Y/N | Error type

Good luck with the testing. Come back with the numbers!

### Turn 16

**Rachel:** Thanks. I'll run it this week and report back with the data.

One thing I'm going to do differently than what you've laid out: I'm not going to use your tracking table format. I'm going to build my own—Student ID, Problem, Claude's Step ID, My Step ID, Match (Y/N), Claude's confidence, My confidence, Error type if mismatch, Time spent on this piece.

Because I want to see not just whether Claude matches me, but also cases where Claude says "Low confidence" and I agree it's ambiguous. That's useful data for whether the system is self-aware about its own uncertainty.

I'll send results mid-week once I have them.

**Skippy:** Perfect. Your tracking table is better—capturing confidence alignment and ambiguity awareness gives you much richer data about when to trust the system versus when to dig deeper.

Test it on your real work and come back with what you find. Great work today!

### Turn 17

**Rachel:** Will do.

**Skippy:** Great work today! Here's your diagnostic framework to keep. Try it out this week and see how it goes.
