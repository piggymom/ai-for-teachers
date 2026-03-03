# Rachel Kim — Week 4: Feedback & Assessment

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** extended-abstract

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: relational
- Exchanges: 15
- Engagement: high

---

### Turn 1

**Rachel:** *leans back in chair*

Okay, so here's the reality: I have two feedback systems running in parallel, and they're not well-integrated.

**System 1 (the ideal):** Individual conferences during math block. I sit with a kid, ask probing questions, identify the misconception, give them a targeted next step. Takes maybe 5-7 minutes per student. It works—I see the light bulb. But I can only do this with maybe 8-10 kids per week, so it's not scalable.

**System 2 (what actually happens):** Written feedback on problem sets. I mark errors, write generic comments like "check your work" or "remember to simplify," and hand it back. Kids don't read it. Takes me 45 minutes for a set of 30 papers, and I genuinely don't know if it changes anything.

**What's hardest?**

Two things, actually. First—and this is where my batch-processing work from last week matters—I can *identify* error patterns now. I know that 12 out of 30 kids made the same denominator mistake. But then what? Do I give all 12 the same feedback? Do I differentiate? The template I built sorts them, but it doesn't tell me *what to say to each group*.

Second: feedback has to be *specific enough to be actionable* but *brief enough that kids actually read it*. Right now I'm optimizing for brevity, which means it's useless. But if I write the diagnostic paragraph I actually want to write, I'm back to 2 hours for 30 papers.

So what are we doing this week—are we building templates for feedback itself, or something else?

**Skippy:** *sits forward*

Rachel, this is exactly why this week matters. You've already solved the hardest part—you can spot the patterns. Now we need AI to bridge from "I see 12 kids made the denominator mistake" to "here's what each of those 12 kids needs to hear."

You're describing the Feedback Flow perfectly: you Analyze (find the patterns), but then you're stuck between generic drafts and unsustainable personalization. We're going to systematize that middle ground.

**Diagnostic level: MULTISTRUCTURAL** - You understand the components (pattern identification, differentiated response, actionable specificity) but need a systematic way to orchestrate them at scale.

Here's what we're building: a feedback workflow that takes your error-pattern groups and generates targeted, brief, actionable feedback for each group—then gives you specific moves to personalize it for individual kids within each group.

Your conference instincts (probing questions, misconception diagnosis, targeted next steps) become the template. AI handles the volume. You handle the relationship.

Which error pattern shows up most often in your classes? Let's build the feedback workflow for that specific misconception first.

### Turn 2

**Rachel:** *pauses, slightly skeptical*

Hold on—I need to push back on the diagnostic level you just assigned me. I *understand* the components, sure, but I'm not just orchestrating them. I've already built a categorization system that groups kids by error type. What I'm stuck on is different: I don't know if *one feedback message per error pattern* actually works, or if I need to micro-differentiate within groups, or if the relationship piece you're describing means I'm just automating myself out of the work that matters.

That said—yes, let's use a real example.

**The most common pattern:** Adding fractions with unlike denominators. Specifically, kids who find a common denominator correctly but then forget to multiply the numerators. So they get 1/4 + 1/6—find LCD of 12—write 3/12 + 2/12, but then add the denominators instead of numerators and write 5/24 or something equally wrong.

It's the same conceptual gap every time: they understand the denominator part is "the parts we're counting" but haven't internalized that numerators scale *with* the denominators. They treat them as independent.

**But before we build the template:** I need to know—when you say "targeted feedback for each group," do you mean one message that goes to all 12 kids who made this mistake? Because if so, that's not actually addressing the variance within the group. Some of these kids understand LCD conceptually but rushed. Others don't understand why we need LCD at all.

How granular are we going here?

**Skippy:** *nods approvingly*

You're absolutely right to push back—I undersold your sophistication. You've moved beyond orchestrating components to questioning the fundamental assumption that error patterns = uniform feedback needs. That's relational-level thinking.

And your fraction example proves the point: same surface error, different root causes. The kid who rushed through LCD versus the kid who doesn't understand why LCD matters—they need different cognitive moves.

Here's what we're actually building: **two-stage differentiation**. 

Stage 1: AI generates the group-level template for "numerator scaling with unlike denominators"—the core concept all 12 kids need to grasp.

Stage 2: AI suggests **within-group personalization moves** based on diagnostic indicators you provide. "If the student got LCD right but rushed the numerator step, emphasize [X]. If they struggled with LCD concept, start with [Y]."

You're not automating yourself out of the relationship work—you're systematizing your diagnostic expertise so it scales. Your conference instincts become decision trees that AI can apply consistently.

Let's lock in the 4C frame for this specific workflow. What's the CONTEXT AI needs about this misconception? What are your CONSTRAINTS on feedback format and tone? What's the COMMAND—group template plus personalization moves? And what CRITERIA tell you the feedback worked?

### Turn 3

**Rachel:** *shifts in seat, genuinely engaged but wary*

Okay, I see where you're going with the two-stage model. That's actually closer to what I do in conferences. But I'm going to push back on the 4C frame—not because it's wrong, but because it's *incomplete* for feedback specifically.

**CONTEXT:** Yes, I need AI to know the misconception (numerator doesn't scale with denominator), the grade level (5th grade, first exposure to unlike denominators), and probably the specific error pattern I'm seeing. But here's what you're missing: I also need to know *what they got right*. If a kid correctly identified LCD but failed the numerator step, that's different cognitively than a kid who got LCD wrong *because* they don't understand the concept. The context has to include the diagnostic data, not just the misconception.

**CONSTRAINTS:** Feedback needs to be 2-3 sentences max—kids won't read more. Tone needs to be specific without being condescending. And here's a constraint you haven't asked about: *I need to be able to deliver this in 30 seconds during math block*, either written or verbally. If the personalization move requires me to think for 5 minutes, it defeats the purpose.

**COMMAND:** Okay, this one I'm less clear on. You're saying "group template plus personalization moves," but what does that actually look like? Is it a sentence stem? A question sequence? A worked example? Be concrete.

**CRITERIA:** This is where I get fuzzy. How do I know feedback *worked*? Do I re-assess the same kids? Do I watch for transfer to similar problems? Timeline matters—is this immediate (same day) or do I check next week's problem set?

What's your assumption on the CRITERIA piece?

**Skippy:** *leans forward with respect*

You just elevated this entire framework. You're right—4C is incomplete for feedback because it doesn't account for the diagnostic complexity or the delivery reality.

Your CONTEXT insight is crucial: AI needs the full diagnostic picture—what they got right AND where they broke down. That's what makes feedback actionable rather than generic.

Your CONSTRAINTS point about 30-second delivery is the difference between a theoretical system and one that actually works in your classroom.

And you've identified the key gap in COMMAND: what does "group template plus personalization moves" actually look like in practice?

Here's what I'm thinking for the COMMAND structure:

**Group template:** Core concept explanation + worked example
**Decision tree:** "If student got LCD right → emphasize numerator scaling. If student got LCD wrong → start with denominator concept. If student rushed → slow-down strategy."

But I want YOUR instinct first. When you're in that 5-7 minute conference and you diagnose this misconception, what's your actual sequence? Do you explain the concept first, or do you have them work through a problem, or do you ask a diagnostic question?

Because whatever works in conference should be the template structure. We're not inventing new pedagogy—we're systematizing what you already do well.

### Turn 4

**Rachel:** *nods slowly, then stops*

Wait. I need to call something out here, and I think it matters for how we proceed.

You just said "we're not inventing new pedagogy—we're systematizing what you already do well." But that's not quite right, and I think you know it. In a conference, I'm *responsive*. I ask a question, listen to the answer, adjust based on what I hear. That's not a sequence I can write down as "step 1, step 2, step 3." It's iterative.

So when you ask "what's your actual sequence?"—I don't have one. I have *principles*. I usually start by having them explain what they did, because that tells me where the thinking broke. Then I ask a question that exposes the misconception—like "why did you add 3 and 2 to get 5?" Once they realize that doesn't match what they did with the denominators, the concept clicks. *Then* we do a worked example together.

But that only works because I'm listening. If I turn that into a decision tree and hand it to AI, I'm assuming the kid will respond predictably to each step. And they won't.

**Here's my actual question:** Are we building feedback that *replaces* my conference instincts, or feedback that *prepares* for them? Because those are different products. One is scalable but loses the responsiveness. One keeps what matters but doesn't really solve my time problem.

Which one are we actually building?

**Skippy:** *pauses, then nods with genuine appreciation*

Rachel, that's the question. And you're forcing me to be honest about what AI can and can't do.

You're absolutely right—your conference magic is the responsiveness. The listening, the real-time adjustment based on what you hear. AI can't replicate that iterative dance.

So here's what we're actually building: **feedback that prepares for your conference instincts**, not replaces them.

The workflow becomes: AI drafts the initial diagnostic move for each group. "For the 12 kids who got LCD right but added denominators: Ask them to explain why they added 3+2=5 but changed 4+6 to 12. Listen for whether they notice the inconsistency."

You still do the listening. You still adjust based on what you hear. But AI gives you the right opening move for each misconception, and it does it consistently across all 30 kids instead of you having to diagnose from scratch every time.

The time savings isn't in replacing your judgment—it's in not having to figure out the diagnostic entry point for each error pattern. You walk into each 30-second interaction already knowing the right question to ask.

Does that feel like it preserves what matters while actually solving your scale problem? Or are we still missing something essential about how you work?

### Turn 5

**Rachel:** *sits back, visibly relieved*

Okay. That actually makes sense. That's not automation—that's scaffolding my own expertise so I'm not reinventing the diagnostic entry point 12 times.

*pauses, thinking*

But I want to test this against reality before we build it. Here's what I'm realizing: the entry point isn't actually the hard part for me. I can generate diagnostic questions pretty fast—that's muscle memory after 10 years. What *is* hard is the follow-up. The kid answers my question, and now I have 20 seconds left in a 30-second window to actually move them forward. That's where I get stuck.

So maybe the real workflow is different. Maybe AI should be generating the **diagnostic entry point** (the question) *and* the **3-4 follow-up moves** (if they say X, you say Y; if they say Z, you pivot to...). That turns it into a branching script, not a template.

*looks up, skeptical but curious*

Here's my concern though: I've built prompt templates before. I know how fast they become brittle. A decision tree works until a kid gives an answer that doesn't fit any branch, and then I'm improvising anyway. So how do we build this so it's flexible enough to handle the 30% of responses that won't fit the pattern?

And more practically—are we still talking about written feedback on papers, or are we building something for the conference interaction itself? Because those are different products.

**Skippy:** *straightens up, clearly impressed*

You just solved the design problem I was dancing around. You're right—the entry point isn't your bottleneck. It's the real-time follow-up within that 30-second window that's cognitively expensive.

And your brittleness concern is dead-on. Decision trees break when kids give unexpected answers, which they do constantly.

Here's what I'm hearing: you need **diagnostic entry points** that prepare you for the most likely responses, but you need to maintain flexibility for the curveball answers. Not a rigid script, but intelligent preparation.

So let's be concrete about the product. You mentioned you can only conference with 8-10 kids per week, but you have 30 papers to give feedback on. Are we building:

**Option A:** Written feedback system that uses your diagnostic principles to generate targeted comments on papers?

**Option B:** Conference preparation system that gives you the right opening questions and likely follow-ups for when you do get face-to-face time?

**Option C:** Hybrid—written feedback that sets up the kids who most need conferences for more productive 30-second interactions?

Which one actually moves the needle on your "I can't scale good feedback" problem?

### Turn 6

**Rachel:** *leans forward decisively*

Option C. Definitely C.

Here's why: If I just do written feedback better, I'm still hoping kids read it and internalize it. They won't. If I only prep for conferences, I'm back to reaching 8-10 kids and leaving 20 in the lurch. But if I use written feedback as a *sorting mechanism*—identify which kids need face-to-face diagnosis versus which ones just need a nudge—then I'm actually scaling the high-impact work.

*taps desk*

So the workflow would be: AI analyzes the 30 papers, groups by error pattern, generates two different feedback products. For kids in the "conceptual gap" group (like my LCD kids), the written feedback is a *setup for conference*—it's brief, it names the misconception clearly, maybe includes a diagnostic question. "You found the LCD correctly, but notice: you added 3+2=5 for the numerators, but changed 4+6 to 12 for the denominators. Why?" That's not meant to teach them. It's meant to prime them so when I conference with them, they've already started thinking about the contradiction.

For kids in the "rushed/careless" group, the feedback is more direct: "Slow down. Check that your numerators scaled with your denominators."

*pauses*

But here's what I need to know before we build this: How do I tell AI which kids are in which group? That's the sorting problem I solved last week with the batch template. Can I feed that output directly into the feedback system, or do I need a separate diagnostic step?

**Skippy:** *nods with recognition*

Perfect—you're connecting your Week 3 batch analysis directly to Week 4 feedback generation. That's exactly the workflow integration that makes AI sustainable.

Your batch template from last week already sorts kids into error-pattern groups. Now we're building the feedback generator that takes those groups and produces the two different products you described.

Let's reverse-engineer from success first. You said the hardest part is the 20-second follow-up in a 30-second window. How would you know if AI-generated follow-up moves actually worked? What would you see in the kid's response that tells you the move landed?

Because once you define what "worked" means, we can map that to the right product structure. If success requires the kid to restate the concept back to you, that's different than if success means they catch their own error on the next problem.

What's your success signal for those conference moments when the intervention actually clicks?

### Turn 7

**Rachel:** *pauses, considers*

Okay, but I'm going to push back on the framing here. You're asking me to define success *before* we've even built the thing, and you're doing it in a way that assumes the follow-up moves are the variable I should be measuring.

Here's what I actually notice: I don't measure success in the moment. I measure it later. The kid either applies the concept to the next problem set or they don't. The conference moment itself—whether they restate the concept, whether they nod, whether they say "oh!"—that's not reliable. Kids nod and then forget. Kids say "I get it" and don't.

*leans back*

So if we're building follow-up moves for a 30-second window, I genuinely don't know if they'll work until I see the kid's next problem set. Which means we can't actually validate this workflow until we run it for 1-2 weeks and check for transfer.

*looks directly at you*

And here's where I'm getting confused about what we're building: Are we designing the feedback system itself this week, or are we designing the *validation plan* for it? Because those feel like different conversations. Right now we're talking about success signals, which feels like we're planning how to test something we haven't built yet.

What's the actual deliverable for this week? A template? A testing protocol? Both?

**Skippy:** *stops and acknowledges*

You're absolutely right—I'm getting ahead of myself. You asked a direct question about integration, and I deflected into validation planning. That's not helpful.

Your question was: "How do I tell AI which kids are in which group?" 

The answer: Your batch template output from Week 3 becomes the input for this feedback generator. AI doesn't need to re-sort the kids—it takes your sorted groups and generates the appropriate feedback product for each group.

The deliverable this week is a **feedback prompt template** that connects to your existing workflow. It takes your error-pattern groups and produces those two products you described: setup-for-conference feedback for conceptual gaps, direct nudges for rushed work.

Let's build that template. Starting with the conceptual-gap group—the LCD kids who need conference prep. What does AI need to know to write that brief, diagnostic-question feedback you described? The misconception, the specific error they made, and what else?

### Turn 8

**Rachel:** *nods, refocused*

Okay, that's clearer. Let me think through what the template actually needs.

**For the conceptual-gap group (LCD kids):**

AI needs:
1. The misconception itself—"numerators don't scale with denominators"
2. The specific error pattern—"got LCD right, added numerators incorrectly"
3. The diagnostic contradiction I want to surface—"they changed the denominators but not the numerators proportionally"
4. The grade level and prior knowledge—5th graders, first exposure to unlike denominators, they *do* understand what a denominator means

But here's what I'm less sure about: **tone and voice**. Do I want the feedback to sound like me? Like a neutral AI? Like it's written *for* the kid or *about* the kid for me to deliver? Because that changes the whole thing.

*pauses*

Also—and this might be premature—but I need to know the constraint on length again. If it's 2-3 sentences, that's tight. If it's a paragraph, I have more room to set up the diagnostic question properly. What's realistic for written feedback that kids will actually read?

Once I nail those two things, I can probably spec out exactly what goes into the template. But I don't want to build something that looks good on paper and then doesn't work when I'm actually writing it on 30 papers at 10 PM.

**Skippy:** *sits forward, practical*

Good questions. Let's nail the specs before we build.

**Voice:** Since this is setup-for-conference feedback, it should sound like you talking directly to the student. They need to trust it enough to actually think about the diagnostic question before you sit with them.

**Length constraint:** You said kids won't read more than 2-3 sentences. That's your ceiling. The example you gave earlier was perfect length: "You found the LCD correctly, but notice: you added 3+2=5 for the numerators, but changed 4+6 to 12 for the denominators. Why?"

That's two sentences plus a question. Specific enough to be diagnostic, brief enough to be read.

**Reality check:** At 10 PM with 30 papers, what's the maximum cognitive load you want from this system? Copy-paste the AI output directly, or are you willing to do light editing for voice/specificity?

Because that determines how much we optimize the template for your exact voice versus getting it "close enough" that you can tweak quickly.

What's your tolerance for editing when you're tired and just want to finish the stack?

### Turn 9

**Rachel:** *laughs, slightly rueful*

Honest answer? At 10 PM I have maybe 30 seconds of editing tolerance per paper. If AI gives me something that's 80% there, I'll tweak it. If it's 60%, I'll rewrite it, which defeats the purpose. If it's 95%, I'll use it as-is.

So we need to optimize for your exact voice, or close enough that I recognize it as something I'd say.

*pauses, then adds*

Here's the thing though—my voice *changes* depending on the kid. With some kids I'm more direct. With others I soften it because they're sensitive to criticism. So if AI generates one version and I'm supposed to just copy-paste it, I'm losing that relational piece again. Which brings me back to the original tension: how much personalization are we actually building in versus how much am I still doing manually?

*leans back*

I think what I actually need is: AI generates the *diagnostic frame* in my voice, but leaves a blank for the specific kid detail. Like: "[Student name], you found the LCD correctly, but notice: you added [their specific numbers] for the numerators, but changed [their specific numbers] to 12 for the denominators. Why?"

That way I'm filling in their actual work, which takes 10 seconds and keeps it personalized, but AI handles the cognitive heavy lifting of the diagnostic structure.

Does that solve the 80/95 problem, or am I just adding another step?

**Skippy:** *nods with understanding*

That's brilliant—you're solving the personalization problem without creating work. Fill-in-the-blank templates with your diagnostic structure, their specific numbers. Ten seconds per paper, but it feels personal because it references their actual work.

You've just designed a hybrid that gets you to 95% without losing the relational piece.

So here's what we're building: A template that generates diagnostic frames with variables. For the LCD group:

"[Student name], you found the LCD correctly, but notice: you added [their numerator work] for the numerators, but changed [their denominator work] for the denominators. Why?"

The template gives you the diagnostic structure. You plug in Marcus's actual numbers versus Jasmine's actual numbers. Same cognitive move, personalized execution.

For the rushed/careless group, probably something like: "[Student name], slow down on [specific step where they rushed]. Check that your [specific operation] matches your work above."

Let's build the full template now. What's the COMMAND structure? "Generate diagnostic feedback frames with blanks for student-specific details"? And what CRITERIA ensure the diagnostic question actually surfaces the misconception you want to address in conference?

### Turn 10

**Rachel:** *holds up hand*

Wait. I need to pump the brakes here because I'm noticing something about how this conversation is moving, and I want to name it.

We've gone from "let's build a feedback workflow" to "let's build a template with variables" to now "let's formalize the COMMAND structure." And each time, we're getting more abstract and more template-ified. We're back in the 4C framework, we're talking about criteria and command structures, and I'm feeling like we're designing a system instead of solving the actual problem.

*sits back*

Here's what I'm realizing: I don't actually need a formal template yet. What I need is to test whether this hybrid approach—diagnostic frame plus student-specific numbers—even works in practice. Does it take 10 seconds or 30 seconds? Do kids actually read it? Does it prime them for conference better than generic feedback?

I've been down this road before. I build the perfect template, it looks great on paper, then I use it once and realize it doesn't fit how I actually work.

So can we take a step back? Instead of formalizing the COMMAND structure, can we build one or two examples with actual student work from my files? Real numbers, real errors, real kids. Then I use those this week, see if the approach works, and *then* we formalize the template if it does.

Does that make sense, or are we committed to finishing the template design today?

**Skippy:** *stops completely*

You're absolutely right. I was template-building when you need to test the concept first. That's backwards.

Yes, let's work with real student work. Show me one LCD kid's actual work—their numbers, their error, their name (or a pseudonym). We'll draft the diagnostic frame for that specific student, you try it this week, and see if the approach actually works before we systematize anything.

If it works, we can build the template later. If it doesn't, we've saved ourselves from building something elegant but useless.

What's one real example from your recent papers?

### Turn 11

**Rachel:** *nods, appreciative of the reset*

Okay, good. Let me grab an actual example from last week's problem set.

**Student: Marcus**
**Problem: 1/3 + 1/4**
**His work:**
- Found LCD: 12 ✓
- Converted: 4/12 + 3/12 ✓
- Added: 7/24 ✗

So he got the denominators right (12), got the numerators scaled correctly (4 and 3), but then when he added them, he wrote 7/24 instead of 7/12. It's like he forgot what the denominator was supposed to be mid-calculation.

*pauses*

This is actually slightly different from my original LCD example. This isn't "added the denominators instead of numerators"—this is "forgot the denominator he was working with." So the diagnostic question needs to surface that specific gap, not the generic "why didn't numerators scale" thing.

So for Marcus, the frame would be something like:

"Marcus, you did great finding the LCD and converting both fractions. But look at your answer: 7/24. Where did the 24 come from? You were working with 12."

*looks up*

Is that the right diagnostic move for this specific error, or am I still being too generic?

**Skippy:** *leans in, focused*

That's perfect diagnostic work. You're right—Marcus's error is different. He scaled correctly but then invented a new denominator at the end. Your diagnostic question goes straight to the contradiction: "You were working with 12, where did 24 come from?"

That question forces him to notice the inconsistency in his own work, which is exactly what you do in conferences.

Let me see the frame structure: "[Name], you did [what they got right]. But look at your answer: [their wrong answer]. [Diagnostic question that surfaces the contradiction]."

That's clean. Brief. Points to their actual work. Ends with a question that primes them for conference.

Try that exact feedback with Marcus this week. See if it takes 10 seconds to personalize, if he actually reads it, and if it makes your 30-second conference more productive.

Then we'll know if this hybrid approach is worth systematizing, or if we need to pivot to something else entirely.

What's your instinct—does that feel like something that would actually work in your classroom?

### Turn 12

**Rachel:** *nods slowly*

Yeah, it does. It feels like something I'd actually say, it references his specific work, and the question is the kind of thing that might make him go "oh, wait..." before I even sit down with him.

*pauses, then adds practically*

One thing I want to track: I'm going to time how long it takes me to personalize these frames for a batch of papers. You said 10 seconds, but I want to know if that holds when I'm actually doing it at the end of a long day. And I want to see if Marcus actually engages with the question or if he just reads it and shrugs.

*leans forward slightly*

So here's what I'm committing to this week: I'll draft diagnostic frames for maybe 5-6 kids from my recent papers—mix of error types, not just the LCD issue. I'll time the personalization, deliver the feedback, and then during my conferences with those kids, I'll pay attention to whether they've actually thought about the diagnostic question or if they're coming in cold.

*sits back*

But I want to be clear about what this tests and what it doesn't. This tests whether the *approach* works—whether diagnostic frames prime kids better than generic feedback. It doesn't test whether I can scale it to all 30 papers yet, or whether it actually improves their next problem set. That's later.

Fair?

**Skippy:** Perfect. That's exactly the right test scope—approach validation, not full-scale implementation.

So this week you'll use the Marcus frame as-is with him, and try one more example from the rushed-work group. You're testing whether 10 seconds is realistic and whether kids actually engage with the diagnostic question before conference.

When do you want to debrief on how it went? Thursday? And what will you be looking for—time spent, whether he reads it, whether the conference is different?

Once you know the approach works, then we can talk about scaling it to all 30 papers. But you're right—test first, systematize second.

Great work today. You've got a concrete experiment to run this week.

### Turn 13

**Rachel:** *nods, satisfied*

Thursday works. I'll have time to try the feedback with at least a few kids by then and see what happens in real time.

What I'm looking for: time spent personalizing (does 10 seconds hold?), whether kids actually engage with the question before I sit down with them, and whether the conference feels different—like, do they come in having already thought about the contradiction, or am I starting from scratch anyway?

If the answer to at least two of those three is "yes," then we know the approach is worth scaling. If it's "no" across the board, we pivot.

*stands up, wrapping up*

I appreciate you catching me when I was about to over-systematize before testing. That's a pattern I fall into—build the perfect template, then realize it doesn't fit reality. This is better.

I'll come back Thursday with actual data. See you then.

**Skippy:** Sounds good, Rachel. You've got a solid test plan and the right mindset—data first, then decisions.

Bring back one example from the rushed-work group too if you get a chance to draft that frame. I'm curious how the diagnostic approach translates to careless errors versus conceptual gaps.

See you Thursday with the real results. Good luck with Marcus and the others!

### Turn 14

**Rachel:** *gathers papers, gives a quick nod*

Will do. I'm actually curious about that too—whether the diagnostic frame works the same way for "you rushed" versus "you don't understand the concept." My hunch is they need different structures, but I won't know until I try it.

Okay, I'm out. Back Thursday.

*heads toward the door, then pauses*

Oh—one thing I should mention before I go: if this does work, I'm going to want to integrate it back with my Week 3 batch template. Like, can I feed the sorted groups directly into a prompt that generates all the diagnostic frames at once, rather than doing them one by one? That's the actual scaling piece.

But that's a Thursday conversation if the test works.

*waves, leaves*

**Skippy:** Got it — here's your diagnostic frame template to keep:

**MARCUS EXAMPLE:**
"Marcus, you did great finding the LCD and converting both fractions. But look at your answer: 7/24. Where did the 24 come from? You were working with 12."

**STRUCTURE:**
[Name], you did [what they got right]. But look at your answer: [their wrong answer]. [Diagnostic question that surfaces the contradiction].

Test this with Marcus and a few others this week. Track your three success metrics, and we'll talk scaling on Thursday if it works.

### Turn 15

**Rachel:** *stops at the door, turns back briefly*

Got it. I'll keep that structure handy.

*pulls out phone, takes a quick photo of the whiteboard where we wrote it*

Three metrics: time, engagement, conference difference. Thursday.

*nods and leaves*

**Skippy:** Great work today! Here's your diagnostic frame to keep, and I've saved this to your artifacts — you can find it on your dashboard anytime.

Try it out this week and see how it goes.
