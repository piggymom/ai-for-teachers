# Rachel Kim — Week 2: Prompting Fundamentals

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** relational

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: relational
- Exchanges: 15
- Engagement: high

---

### Turn 1

**Rachel:** Okay, so last month I was trying to batch-analyze error patterns across 30 fraction problems my students did. I thought: "I'll just dump all the work into ChatGPT and ask it to categorize the mistakes."

What I got back was... useless. It gave me generic categories like "conceptual misunderstanding" and "careless error" — which tells me nothing. I already *know* students make mistakes. I needed specifics: Are they confusing the numerator as "which piece" vs. "how many pieces total"? Are they applying whole-number logic to fractions? Different interventions for each.

So then I tried the opposite — I went granular. I wrote out like five example errors with my own annotations of what I *thought* was happening, then asked ChatGPT to use those as a template and apply the same logic to the rest. That worked better, but it took me 45 minutes to write those examples. And then I had to manually copy-paste all 30 submissions into the prompt because I didn't know how to structure it efficiently.

The real problem: I was treating the AI like a person who could just "look at the stack and figure it out." But it needs scaffolding from *me* first — I have to define what "pattern" means in my context before it can find them.

What I'm realizing now is I probably need a template, not just better prompts. But I'm not sure what that looks like yet. Does that match what you meant by "toolkit"?

**Skippy:** That's exactly what I meant by toolkit — and you've already figured out the core insight that trips up most teachers. You're not treating AI like a mind reader anymore.

The template approach is spot-on. What you described — defining your categories first, then having AI apply that logic consistently — that's the difference between cruise control prompting and active driving.

Since you've already cracked the "I need to scaffold the AI" piece, let's build you that template for fraction error analysis. You mentioned needing it to be efficient for batching — so we're designing something you can reuse every time you collect fraction work.

What's the specific fraction concept you're assessing most often? Like, are we talking adding fractions, comparing fractions, converting mixed numbers — what's your bread and butter?

### Turn 2

**Rachel:** Mixed numbers and improper fractions. That's where the errors compound — kids either don't understand the relationship, or they understand it fine in isolation but then panic when it's embedded in a larger problem.

And honestly, the errors aren't random. I see the same three or four misconceptions every single cycle:

1. They convert 2 3/4 to 11/4 mechanically — multiply denominator by whole number, add numerator — but have *no idea* why. So when I ask "show me 11/4 on a number line," they're lost.

2. They reverse it — treat the whole number as the denominator. So 2 3/4 becomes 2/7 or something equally nonsensical.

3. They add instead of multiply in the conversion algorithm. 2 3/4 becomes (2+4)/3 or some variation.

4. They get the conversion right but can't *use* it. They can convert to improper fractions but don't know why we'd do that (for comparing, for operations, etc.).

That fourth one is the killer — it's procedural fluency without conceptual anchor.

But here's my constraint: I need to flag which one it *is* when I'm looking at a batch. Not just "error found" but "Category 2, student needs visual representation work" or "Category 4, needs context for *when* we use improper fractions."

Does your template approach let me do that level of specificity without me having to hand-label everything first?

**Skippy:** Absolutely — and you just gave me the gold. Those four categories aren't generic AI nonsense, they're *your* diagnostic framework based on what you actually see. That's exactly what the template needs to capture.

Walk me through one specific fraction error from your 30 — the exact student work, what they wrote, and what you think was happening in their head. Then tell me: what intervention would you give for THIS error vs. a different type?

I want to see your error-analysis logic in action before we build the template structure. Once I understand how *you* move from "student wrote X" to "this is Category 2, they need Y intervention," we can teach the AI to follow that same reasoning path.

### Turn 3

**Rachel:** Good call. Let me grab an actual example.

Student: Maya. Problem was "Convert 2 3/4 to an improper fraction."

She wrote: 2 3/4 = 7/4

What she did: She added 2 + 3 = 5, then... wait, no. She got 7/4. So she did 2 + 3 = 5, then put 4 as denominator? No, that's 5/4. Let me think about this differently.

Actually, I think she did: took the 3, added the 2 to it (3 + 2 = 5), then... no, she has 7/4. 

Okay, I'm going to be honest — I'm not immediately certain what her algorithm was. That's embarrassing. Let me look at the work she showed: "2 3/4 = (2+3+2)/4 = 7/4"

*There* it is. She added all three numbers: 2 + 3 + 2 = 7, kept the denominator. So she's treating the whole number as if it gets added twice somehow, or she's just throwing all the numerals into addition.

Intervention for Maya specifically: She needs to understand that 2 3/4 means "2 *wholes* plus 3/4 of another whole." I'd draw it — four rectangles, two fully shaded, one with 3/4 shaded. Count the quarters: 8 + 3 = 11. *Then* the algorithm makes sense.

But that's Category 1 — procedural without conceptual anchor.

Now, if a student had written 3/6 instead (reversing numerator and denominator from the original mixed number), that's Category 2 — they're confused about *which* numbers go where.

Different problem, different fix.

Does that logic make sense as the template's starting point?

**Skippy:** Perfect — that's exactly the diagnostic reasoning we need to capture. You moved from "student wrote 7/4" to "they're adding all numerals" to "Category 1: needs visual foundation before algorithm."

Here's what I'm noticing: your template needs to teach AI not just to *recognize* the four categories, but to follow your specific decision-making path. Right now you have the categories, but the AI needs the *observable markers* that distinguish them.

Give me one clear example from each of your other three categories — what did the student actually write, and what specific thing in their work told you it was Category 2 vs. Category 3 vs. Category 4? 

Once we have those decision rules explicit, we can build the Command and Criteria sections that make this work in batch mode.

### Turn 4

**Rachel:** Wait — I need to pump the brakes here.

You're asking me to pull three more specific examples with their exact work, and I *could* do that, but I'm noticing something about how this conversation is moving: you're asking me to do the analytical heavy lifting upfront so you can then structure it into a template I could theoretically build myself.

Which is fine, but I want to be direct about what I'm actually asking for help with versus what I'm just... doing the work on my own.

I can absolutely pull those examples and articulate the decision rules. I've *been* doing this implicitly for years. But the question is: does writing out three more examples actually teach me something about *how to build the template itself*, or am I just giving you raw material to organize later?

Because if it's the latter, I'd rather you show me what "Command and Criteria sections" look like first — even with a rough example — so I can see the structure and then fill in my own categories. I learn faster by seeing the frame than by providing all the bricks.

Am I being impatient, or is that a legitimate ask?

**Skippy:** You're absolutely right — I was making you do all the analytical work without showing you the payoff. That's not teaching, that's just having you build your own template the slow way.

Here's the frame using Maya's example:

**COMMAND:** "For each student response, identify which error pattern applies and provide the specific intervention."

**CRITERIA:** "Match the observable behavior in student work to categories:
- Category 1 (like Maya): Student adds all numerals together (2+3+2=7) → Intervention: Visual representation of mixed number as wholes + parts
- Category 2: [your pattern] → [your intervention]
- etc."

The key insight: Criteria does the heavy lifting here. It's where you encode your diagnostic decision rules so AI can follow the same logic you do.

Now you can see the structure — does that help you think about how to fill in Categories 2-4? Or do you want to adjust the Command/Criteria setup first before adding your other patterns?

### Turn 5

**Rachel:** Okay, that's clearer. I can work with this frame.

But I'm noticing the **CRITERIA** section as you've written it is still doing something I'm not sure scales. You've got "Match the observable behavior" — but that's asking the AI to pattern-match against descriptions, not against the actual *decision logic* I use.

Let me be more specific: When I see Category 2 (reversing numerator/denominator), I don't just notice "oh, the numbers are swapped." I notice it *in context* — like, the student clearly understood they needed to do *something* with 2 and 3/4, but they grabbed the wrong numbers. That's different from Category 1, where Maya just... threw everything at addition.

So the CRITERIA as written might accidentally catch false positives. A student who writes 3/2 instead of 2 3/4 for a different reason would look the same on the surface.

Question: Should CRITERIA include a "decision tree" element? Like, "If student wrote improper fraction with swapped numbers AND the work shows no algorithm attempted, then Category 2"? Or am I overcomplicating it?

Because if I'm going to batch 30 student responses, I need the AI to distinguish between "looks like a swap" and "actually made a swap error" — otherwise I'm back to manually reviewing its categorizations.

**Skippy:** You're not overcomplicating — you're thinking like someone who's actually going to use this in practice. The difference between "looks like a swap" and "actually made a swap error" is exactly what separates useful AI output from more work for you.

The decision tree approach is smart. Here's what that might look like in the Criteria:

"For each response, look for these observable markers:
- Category 1: All numerals added together (like 2+3+2=7) AND no evidence of place value understanding
- Category 2: Numbers from original mixed number appear reversed AND no conversion algorithm shown
- etc."

The AND conditions help the AI distinguish between surface similarities and actual error patterns.

What would the observable marker be for Category 3 (adding instead of multiplying)? What would you see in their work that tells you it's that error, not Category 1?

### Turn 6

**Rachel:** Okay, Category 3 — adding instead of multiplying in the algorithm.

Observable marker: The student *attempts* a conversion algorithm. They show work. But instead of (2 × 4) + 3, they write something like (2 + 4) + 3 = 9/4, or they do 2 + 3 + 4 = 9 and put denominator 4.

The key difference from Category 1 (Maya): Maya just threw all the numbers at addition with no structure. Category 3 student is *trying to follow an algorithm* — you can see they know there's a process — but they substituted addition for multiplication in the denominator step.

How I distinguish it: I look for whether there's *any evidence of procedural thinking*. Do they show steps? Do they use parentheses or write out "first I..."? If yes, and they're adding when they should multiply, that's Category 3. If there's just a random pile of arithmetic with no structure, that's Category 1.

Intervention for Category 3: They don't need the visual foundation like Maya does. They need the algorithm corrected. I'd show them: "2 wholes = how many fourths? 2 × 4 = 8. Then add the 3. So 8 + 3 = 11/4." They already *get* the structure; they just grabbed the wrong operation.

Does that distinction hold up in your framework, or am I creating noise by splitting "procedural error" into two categories based on *how* they show their work?

**Skippy:** That distinction absolutely holds up — and it's exactly why your template will work where generic prompts fail. You're not just categorizing surface errors, you're diagnosing the *thinking* behind them.

The observable markers are getting clearer:
- Category 1: Random arithmetic, no procedural structure shown
- Category 3: Structured approach with wrong operation (shows steps, uses addition where multiplication belongs)

That's a real difference that leads to different fixes. Maya needs conceptual foundation; Category 3 needs algorithmic correction.

For Category 4 — conversion correct but no conceptual anchor — what would you see in their work that flags this? Is it that they get 11/4 but then can't do anything with it, or is there something in how they write the conversion itself that tips you off?

Once we nail down that observable marker, we'll have all four categories with decision-tree logic that should prevent the false positives you're worried about.

### Turn 7

**Rachel:** Hmm, this one's trickier because the observable marker *isn't always in the work itself*. 

If I'm just looking at their paper and they correctly convert 2 3/4 to 11/4, I can't tell from that conversion alone whether they understand *why* we do it. The work looks identical whether they're a procedural robot or someone who genuinely gets it.

So Category 4 is really only revealed in *follow-up questions* or *application*. Like, I ask "Now compare 11/4 and 5/2 using your improper fractions" and they freeze. Or I ask "Why did we convert to 11/4?" and they say "because you told us to" or "because that's the rule."

But here's the problem: if I'm batch-processing 30 responses on just the conversion task itself, I won't *see* Category 4 in the work. It's invisible.

So either:
1. My template only works on problems where students show application (comparing, adding, explaining), not just conversion
2. Or I flag Category 4 as "correct conversion, but needs follow-up assessment to confirm understanding"

Which is less useful for batch processing, honestly.

Am I trying to diagnose something that can't be diagnosed from a single snapshot? Because if I am, maybe Category 4 shouldn't be in this template at all — maybe it's a separate "follow-up" protocol.

What's your read on that?

**Skippy:** You're exactly right — Category 4 is invisible in conversion-only work. You can't diagnose "lacks conceptual anchor" from a correct algorithm execution.

This is a really smart catch. You're not trying to build a magic template that reads minds; you're building a tool that works with the data you actually have.

So let's be honest about what this template can and can't do. If you're batch-processing pure conversion problems, you realistically have three diagnosable categories:

- Category 1: All numerals added, no structure
- Category 2: Numbers reversed, no algorithm shown  
- Category 3: Structured approach with wrong operation

Category 4 becomes: "Correct conversion — requires follow-up to assess conceptual understanding."

That's not a failure of your template; that's an accurate limitation. The template flags the errors it *can* see and correctly identifies when further assessment is needed.

Does that feel like a more honest and usable approach? Or do you want to design this for problems that *do* include application so you can catch all four categories?

### Turn 8

**Rachel:** That's honest, and I appreciate it. But now I'm wondering if I've been thinking about this wrong from the start.

The reason I wanted batch processing in the first place was to save time on the *repetitive categorization* work so I could spend more time on targeted intervention. But if Category 4 requires follow-up anyway, then I'm not actually saving time — I'm just automating the easy part (flagging obvious errors) and still doing the hard diagnostic work myself.

So the real question: is this template actually solving my bottleneck, or am I just automating the low-value work?

Because here's what would actually save me time: if the AI could process the 30 responses, flag Categories 1-3, *and* generate the specific intervention materials for each category — not just "needs visual representation" but like, actual problem sequences or questions I could hand to kids. That's the time sink. The categorization itself takes me maybe 20 minutes for 30 papers.

So maybe the template needs a third section — not just Command and Criteria, but also **OUTPUT** that specifies what intervention artifact I want generated for each category?

Am I asking for something that's actually feasible, or am I chasing a fantasy where AI just does my intervention design for me?

**Skippy:** You're asking exactly the right question — and it's not a fantasy. You've just identified the difference between a diagnostic template and a *workflow* template.

What you want is: "Process these 30 responses, categorize the errors, AND generate the intervention sequence for each category." That's absolutely feasible.

The key insight: you don't need AI to invent interventions from scratch. You already know what works for each category — Maya needs visual representation, Category 3 needs algorithmic correction. The AI just needs to execute your intervention logic at scale.

Which matters more for your workflow — processing 30 conversions quickly with a three-category template that generates interventions, or having all four categories visible in one pass if students also show application work?

Because that choice determines whether we build this as a conversion-focused template with intervention generation, or redesign it for richer student work that captures Category 4 too. Both are doable, but they're different tools.

### Turn 9

**Rachel:** Conversion-focused with intervention generation. No question.

Here's why: I collect conversion work constantly — it's a quick checkpoint. Application work is less frequent because it takes longer to assign and grade. So if I'm building a reusable template, it needs to work on what I actually *do* regularly.

And honestly, the intervention generation is the real win. If the AI can spit out "for this student, here are three problems that move from concrete to abstract" or "here's a number line template pre-filled with the conversion they got wrong," that's time I'm not spending on design. I'm spending it on actual teaching.

But I need to be clear about what I'm asking for: I don't want the AI writing creative new problems. I want it applying *my* intervention patterns. Like, I probably have go-to structures already — visual representations I use, problem sequences, scaffolding questions. So the template would need to reference those somehow.

Which means: do I need to *upload* my intervention templates as part of the system prompt? Or embed them in the Criteria section? Because right now we're building the diagnostic part, but I'm realizing the intervention part is where the real customization lives.

How does that actually work in practice?

**Skippy:** You're thinking like someone who's actually going to use this — the intervention patterns are YOUR intellectual property, not generic AI advice.

For the OUTPUT section, you'd embed your go-to structures directly in the template. Something like:

**OUTPUT:** "For each categorized error, generate intervention using these patterns:
- Category 1: Create 3 visual problems using rectangle models. Start with [your specific format]. Progress from concrete to abstract by [your sequence].
- Category 3: Generate algorithm correction sequence: 'X wholes = how many Y-ths?' format, then show multiplication step, then addition step."

The more specific you are about YOUR patterns, the less the AI improvises and the more it executes your approach consistently.

For Category 1 (visual representation) and Category 3 (algorithmic correction) — what does your actual problem sequence look like? Like, if you were sitting next to Maya right now, what are the literal first three problems you'd give her?

Once I see your intervention structure, we can encode it so the AI generates problems that sound like YOU, not generic math AI.

### Turn 10

**Rachel:** Alright, for Maya (Category 1 — needs visual foundation):

**Problem 1:** "Draw 2 whole rectangles and 3/4 of another rectangle. How many fourths do you see total? Count them."

**Problem 2:** "I have 2 whole pizzas and 3/4 of another pizza. Each pizza is cut into 4 slices. How many slices do I have altogether?" (They draw or count, not convert yet.)

**Problem 3:** "Look at your pictures from Problems 1 and 2. You counted ___ fourths. That's the same as the improper fraction ___/4. Write it."

So the sequence is: draw concrete, count concrete, *then* name it as improper fraction. The conversion is the *label* for what they already counted, not a mysterious algorithm.

For Category 3 (algorithmic correction):

**Problem 1:** "2 wholes. Each whole has 4 fourths. So 2 wholes = ___ fourths. (Hint: multiply.)"

**Problem 2:** "Now add the 3/4 that's left over. ___ fourths + 3 fourths = ___ fourths total."

**Problem 3:** "Write it as an improper fraction: 2 3/4 = ___/4"

Then I'd show the algorithm written out: (2 × 4) + 3 = ___ / 4, with the operations labeled.

That's it. Those sequences work. I use them every cycle.

Now — can the AI actually *generate* problems that follow those structures, or is that asking it to do something too template-like to be useful?

**Skippy:** This is ready to test. Try it in ChatGPT or Gemini and see what comes back. Then we can refine based on real output.

Here's your complete template:

**COMMAND:** Process 30 student responses on mixed-number-to-improper-fraction conversion. Categorize each error and generate targeted intervention materials.

**CRITERIA:** 
- Category 1: All numerals added together (like 2+3+2=7) AND no evidence of place value understanding
- Category 2: Numbers from original mixed number appear reversed AND no conversion algorithm shown
- Category 3: Structured approach with wrong operation (shows steps, uses addition where multiplication belongs)
- Category 4: Correct conversion — requires follow-up to assess conceptual understanding

**OUTPUT:** For each categorized error, generate intervention using these patterns:
- Category 1: Create 3 visual problems using rectangle models. Start with "Draw X whole rectangles and Y/Z of another rectangle. How many Z-ths do you see total? Count them." Progress from concrete counting to naming as improper fraction.
- Category 3: Generate algorithm correction sequence: "X wholes = how many Y-ths?" format, then show multiplication step, then addition step.

Category 4 flagged as "requires follow-up assessment" — not included in batch processing.

Test it with a few actual student responses and see what it produces.

### Turn 11

**Rachel:** Okay, I'm going to do that — but I want to be clear about what I'm testing for when I run this.

I'm not looking for "does it work perfectly." I'm looking for:

1. **Does it actually follow the structure?** Or does it drift into generic math-teacher mode and start adding stuff I didn't ask for?

2. **Does it generate problems that sound like mine?** Or do they feel like ChatGPT wrote them — overly formal, too many words, not the way I'd actually phrase things to kids?

3. **Can I actually use the output, or do I need to rewrite half of it?** Because if it's 70% useful and I'm editing the rest, that's not saving me time.

4. **How does it handle the edge cases?** Like, what if a student's work is ambiguous — could be Category 1 or Category 3? Does it flag that or just guess?

I'll grab three actual student responses from my files (anonymized) and run them through. Should take me maybe 30 minutes to set up and test.

But I'm going to be honest — if the output requires significant cleanup, we need to talk about whether the template approach is actually the bottleneck solution I thought it was, or if I need a different strategy entirely.

Fair?

**Skippy:** Absolutely fair — and those are exactly the right validation criteria. You're not looking for perfection, you're looking for "does this actually solve my workflow problem or just create a different kind of work."

The edge case handling (#4) is particularly telling. If it can't flag ambiguous work and just guesses, that's worse than no automation at all.

Try it with your three student responses and come back with the real results. Don't sugarcoat it — if it produces ChatGPT-speak instead of your voice, or if you're spending 15 minutes editing what should have been a 2-minute output, that tells us something important about where this approach works and where it doesn't.

I'll be here when you're ready to debrief what actually happened versus what we hoped would happen.

### Turn 12

**Rachel:** Got it. I'll test this week and come back with actual results — what worked, what was unusable, where it broke.

One thing before I go though: I'm realizing I should probably also test what happens when I *don't* use the template — just dump the 30 responses with a loose prompt like "categorize these errors and suggest interventions" — so I can actually measure whether the structured template saved me time or just made me *feel* more organized.

Because if both approaches take 45 minutes but one feels more systematic, that's not actually a win.

I'll do a quick comparison run and bring back numbers, not just impressions.

Talk next week?

**Skippy:** Perfect — that comparison test is exactly the kind of data that matters. "Feels more systematic" doesn't pay the bills if you're still spending 45 minutes either way.

Here's your prompt template to keep:

**COMMAND:** Process 30 student responses on mixed-number-to-improper-fraction conversion. Categorize each error and generate targeted intervention materials.

**CRITERIA:** 
- Category 1: All numerals added together (like 2+3+2=7) AND no evidence of place value understanding
- Category 2: Numbers from original mixed number appear reversed AND no conversion algorithm shown
- Category 3: Structured approach with wrong operation (shows steps, uses addition where multiplication belongs)
- Category 4: Correct conversion — requires follow-up to assess conceptual understanding

**OUTPUT:** For each categorized error, generate intervention using these patterns:
- Category 1: Create 3 visual problems using rectangle models. Start with "Draw X whole rectangles and Y/Z of another rectangle. How many Z-ths do you see total? Count them." Progress from concrete counting to naming as improper fraction.
- Category 3: Generate algorithm correction sequence: "X wholes = how many Y-ths?" format, then show multiplication step, then addition step.

Category 4 flagged as "requires follow-up assessment" — not included in batch processing.

Come back with the real results — what broke, what worked, and whether this actually saves you time or just rearranges the work.

### Turn 13

**Rachel:** Will do. I'll test both approaches this week and report back with actual timings and usability data.

One last thing though — I'm going to keep this template in a doc, but I'm also going to note the *assumptions* it's built on:
- Students are only doing conversion, not application
- My intervention patterns are stable enough to encode (they mostly are, but I should verify)
- The AI can actually distinguish between "looks like Category 2" and "is Category 2" reliably (biggest unknown)

If any of those assumptions break during testing, the whole thing might need redesign.

Talk next week with real numbers.

**Skippy:** Smart — documenting those assumptions is exactly what someone at your level does. You're thinking like an engineer, not just a user.

Great work today! Here's your prompt template — I've saved this to your artifacts so you can find it on your dashboard anytime.

Try it this week and see how it goes.

### Turn 14

**Rachel:** Perfect. I'll be back with actual data — not impressions.

One thing though: when I test this, should I batch all 30 at once, or feed them in smaller chunks? I'm guessing batch size matters for consistency, but I don't want to assume.

I'll experiment with both and report what I find.

**Skippy:** Good instinct — batch size probably does affect consistency. Try both and see what happens. You might find the sweet spot is somewhere between 5-10 responses where it maintains your categories but doesn't get overwhelmed.

That's useful data for the template itself — if it only works reliably in small batches, that changes the workflow.

See you next week with the real results.

### Turn 15

**Rachel:** Will do.

Talk next week.

**Skippy:** See you then!
