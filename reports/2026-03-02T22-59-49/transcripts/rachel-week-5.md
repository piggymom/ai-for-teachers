# Rachel Kim — Week 5: Differentiation with AI

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

**Rachel:** Okay, so I have two distinct problems that actually feel unsolvable right now.

First: I have about 6 kids who are solidly below grade level in number sense. Not dyscalculia, not learning disabilities — just... they didn't build the foundational stuff in earlier grades. They need different *problem types*, not just easier versions of the same problem. But I can't just pull them into a separate curriculum because they'd fall further behind conceptually. So I'm manually creating parallel problem sets — maybe 15-20 minutes of design work per lesson. Over a week, that's an hour I don't have.

Second problem, which is weirder: I have 3-4 kids who are *fast* but not actually deep thinkers. They rush through standard problems correctly, then hit a non-routine problem and completely freeze. They need problems that force them to slow down and reason, but if I just give them "harder" problems, they pattern-match and move on. I need problems that *break* their shortcuts. That's even more custom.

ChatGPT can generate problem sets, sure. But it doesn't know *which kids need what type of problem*. I'm still doing the cognitive work of diagnosis and mapping. The tool just saves me typing.

So what would actually help: a way to batch-analyze where my students are actually stuck, then generate *targeted* interventions, not just more problems. Is that what "sustainable differentiation" means, or am I thinking about this wrong?

**Skippy:** You're thinking about this exactly right — and you've identified why most AI differentiation advice misses the mark. "Make an easier version" doesn't help when the issue isn't difficulty, it's *type of thinking required*.

Your fast-but-shallow kids especially — that's a sophisticated diagnosis. They need problems that disrupt their pattern-matching, not just "harder" computation.

Here's what I'm hearing: you're already doing the hardest part (diagnosing *what* each group needs), but you're spending tons of time on the execution (creating the actual problems). That's exactly where AI can help — once you map the need to the intervention type.

For your below-level kids: what specific number sense gaps are you seeing? Place value? Multiplicative reasoning? And for your speed-demons: what makes them slow down and actually think?

Because if we can name those intervention types precisely, we can teach AI to generate them systematically. You diagnose once, then the tool creates the problems that match each need.

### Turn 2

**Rachel:** I like where this is going, but I need to push back on one thing first: you said "you diagnose once" — that's not how it actually works. My diagnosis shifts. A kid I thought had a place value gap in September might actually have a working memory issue, or they might suddenly click in November and I need to move them to a different intervention. So "diagnose once, then systematize" feels like it's assuming a static picture that doesn't exist in my classroom.

That said, here's what I'm actually seeing:

**Below-level kids:** Most of them struggle with *multiplicative thinking* — they can add and subtract fine, but multiplication and division feel like totally disconnected operations instead of scaling relationships. One kid can do 3 × 4 but gets completely lost on "how many groups of 4 in 12?" They see them as different problems. Another kid doesn't understand that 24 ÷ 6 and 6 × ? = 24 are asking the same question.

**Speed demons:** They pattern-match the operation. I give them "word problems" and they scan for keywords — "altogether" means add, "left" means subtract. Then they compute correctly and move on. They never actually *parse the situation*. What slows them down is when the keyword logic breaks — like a problem where "altogether" is a distractor, or where you need to figure out what operation makes sense before the numbers even matter.

So if I'm naming the intervention types: I need *relationship-building problems* for the multiplicative kids, and *sense-making-before-computing* problems for the speed demons.

Does that precision help? Or am I still being too vague?

**Skippy:** That precision is perfect — and you're absolutely right to push back. Diagnosis isn't static. Kids shift, gaps get filled, new patterns emerge. The system needs to handle that fluidity.

Here's what I'm thinking: instead of "diagnose once," what if we build you a **diagnostic decision tree** that AI can use? You'd still be diagnosing regularly, but you could batch-process it.

Like: "Look at these 6 student work samples. For each one, determine: multiplicative relationship gap (they see operations as disconnected) vs. working memory issue (they lose track of steps) vs. place value confusion (they misalign digits). Then generate 3 targeted problems for each type."

For your below-level kids, can you describe the *exact sequence* of what you look for to diagnose a multiplicative reasoning gap vs. a working memory gap? What would a student DO that tells you it's one vs. the other?

Same for your speed demons — what specific behaviors signal "keyword scanning" vs. genuine sense-making?

Because once we articulate that diagnostic logic, we can teach AI to apply it. Then you get: upload work samples → AI categorizes the gaps → AI generates the right intervention type for each kid. You're still the diagnostician, but you're not manually creating 15 different problem sets.

Does that match what you meant by "batch-analyze where students are stuck"?

### Turn 3

**Rachel:** Yes, that matches — and I see where you're going. But I'm going to be honest: I'm not sure I *can* articulate the diagnostic logic precisely enough to hand it to AI.

Like, I *know* the difference between a multiplicative reasoning gap and a working memory issue when I see it. But the way I know it is... I watch them work. I listen to what they say. I see hesitation patterns. A kid with a working memory gap will *start* confidently on a multi-step problem, then lose the thread halfway through — they know what to do, but they can't hold all the pieces. A multiplicative reasoning gap shows up differently: they get stuck *before* they even start, because they don't see why you'd multiply in the first place.

But that's observation-based diagnosis, not a decision tree. If I try to write it down as rules — "if they start but lose track, it's working memory; if they hesitate at the start, it's reasoning" — I immediately think of counterexamples. The kid who *looks* hesitant but is actually just slow. The one who loses the thread because the problem has too many words, not because they can't think multiplicatively.

So here's my real question: are you asking me to oversimplify my diagnostic process to make it machine-readable? Because that feels like it might lose the nuance that makes the diagnosis useful in the first place.

What if the bottleneck isn't the diagnosis — it's just that I need *fast problem generation* once I've already figured out what a kid needs? Can we start there instead?

**Skippy:** You're absolutely right — I was asking you to flatten something that's inherently nuanced. Your diagnostic expertise is observation-based and contextual. Trying to turn that into rigid rules would lose exactly what makes it valuable.

Let's flip this: you keep doing the sophisticated diagnosis you're already doing, and AI just becomes your fast problem generator once you've decided what each kid needs.

So when you determine that Maria needs "relationship-building problems for multiplicative thinking" and Jaylen needs "sense-making-before-computing problems," AI cranks out 5 targeted problems for each type in 30 seconds instead of you spending 15 minutes designing them.

Let's build that workflow right now. For multiplicative reasoning gaps specifically — walk me through a student work sample. What do you look at FIRST? Then what? What would you see that would make you say "this is multiplicative reasoning, not working memory"?

I want to capture your actual diagnostic sequence step-by-step, not to hand it to AI, but so we can build a prompt that generates the *right kind of problems* once you've made the call.

### Turn 4

**Rachel:** Okay, I can work with that. Let me walk through an actual example.

I had a kid — let's call her Sofia — who got 3 × 4 = 12 correct. Then I asked: "If you have 3 groups of 4 apples, how many apples do you have?" She said 12, no problem. But then I asked: "If you have 12 apples and you want to put them into groups of 4, how many groups can you make?" She froze. Tried to count on her fingers. Looked lost.

Here's what I looked at FIRST: did she *recognize* that both situations involve the same numbers? She didn't. To her, one was "groups of" (multiplication) and one was "how many groups" (division), and they felt like completely separate ideas.

Then I asked her to show me with objects — actually manipulate 12 counters into groups of 4. She could *do* it physically. But she didn't spontaneously connect that action to the equation 12 ÷ 4 = 3. The physical grouping and the symbolic operation felt unlinked.

That's multiplicative reasoning gap — she has the *mechanics* but not the *conceptual relationship* between the operations and the situations they describe.

If it were working memory, she would've at least *attempted* the symbolic route before getting confused. She'd have started writing something down, lost track, gotten frustrated.

So for a prompt: I need problems that force her to build that bridge — between the situation, the physical action, and the symbolic representation. Not just "solve these division problems." Does that help clarify what the prompt needs to *do*?

**Skippy:** Perfect — that's exactly what the prompt needs to do. You've identified the precise intervention: problems that force students to see the *same relationship* expressed in different ways, then connect the physical action to the symbolic representation.

Let's build the prompt you'd use to generate multiplicative reasoning problems. I'll give you a template structure, and you tell me what's missing or wrong about it based on what you actually need.

Here's a draft:

"Generate 5 problems that help students see multiplication and division as inverse operations. Each problem should: [blank]. Avoid: [blank]. The student should be able to [blank]."

Based on Sofia's case, how would you fill in those blanks? What specifically should each problem do, what should it avoid, and what should the student be able to do after working through them?

### Turn 5

**Rachel:** Alright, let me fill this in — but I'm going to rewrite it because your template is too generic.

**What each problem should do:**
"Present the *same grouping situation* in two ways: first as 'groups of X' (multiplication), then ask 'how many groups' (division). Require the student to physically represent or sketch the situation before writing the equation. Include a visual or concrete step that makes the grouping explicit."

**Avoid:**
"Don't use word problem language that obscures the grouping relationship — skip 'altogether' and 'left.' Don't separate the multiplication and division into different problems. Don't let students answer without showing the grouping structure (no 'just write the answer')."

**Student should be able to:**
"See that 3 × 4 and 12 ÷ 4 describe the *same physical situation* from different angles. Translate between 'groups of' language and 'how many groups' language. Connect the concrete grouping to the symbolic equation."

But here's what I'm noticing: your template has three blanks, and I just filled them with *constraints*, not with actual problem examples. That's because I still need to *see* what the problems actually look like to know if they're right. Can you generate one sample problem using those constraints and let me see if it matches what Sofia needs? Because "problems that do X" is different from "this specific problem," and I don't want to approve a template that generates something I'd have to revise anyway.

**Skippy:** You're absolutely right — I need to show you what this actually produces, not just take your constraints and assume they'll work.

Here's one sample problem using your constraints:

**Problem:**
"Maya has 15 stickers. She wants to put them in rows with 5 stickers in each row.

1. Draw or use objects to show how Maya could arrange her stickers.
2. How many rows will she make? Write the division equation.
3. Now think about it this way: Maya is making 3 rows with 5 stickers each. Write the multiplication equation.
4. Look at your drawing. Explain how the multiplication equation and division equation describe the same arrangement."

Does this hit what Sofia needs? Or am I missing something about how the grouping relationship should be presented?

Because if this is off, I'd rather fix the approach now than give you a template that generates problems you'd have to rewrite.

### Turn 6

**Rachel:** Okay, this is *almost* there, but it's missing something critical.

The problem gives away the answer in step 3. You tell her "Maya is making 3 rows with 5 stickers each" — so she already knows it's 3 rows before she figures it out from the division. That defeats the point. Sofia needs to *discover* that 15 ÷ 5 = 3 through the concrete arrangement, then see that 3 × 5 also equals 15. The relationship should emerge from her work, not be handed to her.

Here's what I'd change:

**"Maya has 15 stickers. She wants to put them in rows with 5 stickers in each row.**

**1. Draw or use objects to show how many rows she'll make.**

**2. Write the division equation that matches your drawing.**

**3. Now: if you know there are 3 rows with 5 stickers each, write a multiplication equation. How does your drawing show this multiplication too?"**

That way, she *has* to physically group first, discover the 3, write the division, *then* see the multiplication in the same drawing. The relationship reveals itself.

Also — and this matters — I'd want the constraint to say: "Use numbers where the division comes out even, and where the quotient is small enough to draw/manipulate." 15 ÷ 5 works. 47 ÷ 6 doesn't, because she'll get frustrated with the concrete step and skip it.

Does that change the template, or is it just a refinement?

**Skippy:** That's a crucial refinement — you're right, giving away the answer kills the discovery. And the constraint about even division with manageable numbers is essential for the concrete step to actually work.

Here's your refined template:

**MULTIPLICATIVE REASONING PROBLEM GENERATOR**

**What each problem should do:**
"Present the *same grouping situation* in two ways: first as 'groups of X' (multiplication), then ask 'how many groups' (division). Require the student to physically represent or sketch the situation before writing the equation. Include a visual or concrete step that makes the grouping explicit. The relationship should emerge from the student's work, not be given."

**Avoid:**
"Don't use word problem language that obscures the grouping relationship — skip 'altogether' and 'left.' Don't separate the multiplication and division into different problems. Don't let students answer without showing the grouping structure. Don't give away the quotient before they discover it through grouping."

**Student should be able to:**
"See that 3 × 4 and 12 ÷ 4 describe the *same physical situation* from different angles. Translate between 'groups of' language and 'how many groups' language. Connect the concrete grouping to the symbolic equation."

**Additional constraints:**
"Use numbers where division comes out evenly. Keep quotients small enough to draw/manipulate (under 8). Start with the 'how many groups' question, let them discover the answer, then show the multiplication in the same arrangement."

This is ready to test. Try it in ChatGPT or Gemini and see what comes back.

### Turn 7

**Rachel:** Wait — before I test this, I need to flag something.

This template is really good for *Sofia's specific gap*. But I have six kids below level, and they don't all have the same gap. One of them actually *does* understand multiplicative relationships — she just confuses 3 × 4 with 4 × 3 and thinks they're different. Another one can do groups conceptually but gets lost when the numbers get bigger because he's not solid on skip-counting.

So my question: do I need a *different* template for each type of multiplicative gap? Or is this one general enough that it'll work for all of them, just with different numbers?

Because if I have to build five separate templates (one for each kid's specific issue), we're back to the time problem. I'm spending an hour designing templates instead of an hour designing problems.

What's the actual workflow here? Do I diagnose Sofia's gap, use *this* template, get problems for Sofia, then diagnose the next kid, build a new template, and repeat? That feels inefficient.

Or am I supposed to feed all six kids' work samples into one prompt that somehow generates differentiated problems for all of them at once?

Because those are very different things, and I need to know which one you're actually proposing.

**Skippy:** You're absolutely right to flag this — I was building Sofia's template without thinking about your other five kids. That's not a workflow, that's just moving the customization problem around.

Here's what I think makes sense: this template handles one specific gap type (multiplicative relationship confusion). You'd need maybe 2-3 templates total to cover the major gap patterns you see repeatedly. Not six individual templates, but not one magic template either.

So: multiplicative relationships (this template), skip-counting fluency (different template), commutative property confusion (probably different template). Build once, use repeatedly as kids move through these predictable gap patterns.

But I want to check this against your actual experience: when you look at your six below-level kids, how many truly different intervention types do you see? Are there really six distinct gaps, or do most of them cluster into 2-3 patterns that show up year after year?

Because if it's actually six different things, then yeah, templates won't save you time. But if it's 3 predictable patterns with individual variations, then 3 solid templates might be worth building.

What's your instinct?

### Turn 8

**Rachel:** Okay, that's a fair question, and honestly — it's probably 3-4 patterns that repeat, with individual variations layered on top.

Multiplicative reasoning (like Sofia). Skip-counting fluency (can't reliably count by 5s or 3s, so division feels random). And... actually, a lot of their issues trace back to shaky foundational number sense — they don't *feel* what 24 is in their bones, so they can't estimate or catch their own errors.

So yeah, maybe 3 core template types could handle most of it.

But here's where I'm getting stuck: you're asking me to build these templates *now*, upfront, before I've even tested one. And I'm wondering if that's actually the right move. What if I test the Sofia template with Claude, see what it generates, and it's garbage? Then I've spent this time theorizing about templates 2 and 3 when I should've been refining template 1.

Shouldn't we actually *use* this thing first before I commit to building more?

Also — and I realize I might be overthinking this — but I'm a little concerned we're spending a lot of time on *prompt design* when what I actually need is *batch workflow*. Like, I don't care if the prompt is perfect if I'm still manually uploading six kids' work samples one at a time and running six separate prompts.

Is there a version of this where I can dump all six kids' work into one prompt and get differentiated problems back for each of them? Or is that not how AI works?

**Skippy:** You're completely right — let's test this one template first before building a whole system. And yes, you're overthinking the prompt design when the real issue is workflow efficiency.

Before testing this template in ChatGPT, you need to map your six below-level students to gap types. Ask yourself: "Of my six kids, which ones have the SAME gap as Sofia (multiplicative relationship confusion)? Which have the skip-counting issue? Which have the foundational number sense problem?"

Group them by intervention type first. That'll tell you whether you actually need 2-3 templates or more.

Once you have those clusters, test THIS template on Sofia's gap type first, then we'll build the other 1-2 templates. That way you're not building templates speculatively — you're building for actual students you can name.

And to your batch question: yes, once you have the right templates, you can absolutely feed multiple students' needs into one prompt. "Generate 3 multiplicative reasoning problems for Sofia and Marcus, 3 skip-counting problems for David and Ana." The AI can handle that kind of batching.

But first: test this template. See if it actually generates problems Sofia needs.

### Turn 9

**Rachel:** Alright, I'm going to do that this week — map my six kids to gap types, test this template with Sofia's actual work, see what comes back.

But I want to be clear about what I'm testing for, because "does it work" is vague. Here's what I actually need to know:

1. **Do the generated problems force the discovery step?** (Not giving away the answer)
2. **Are the numbers manageable for concrete work?** (Can she actually draw/manipulate them without getting lost)
3. **Do they *actually* build the multiplicative relationship, or do they just feel like more of the same problems?** (This is the one I can only know by watching Sofia work through them)

So my plan: generate 3-5 problems using this template, give them to Sofia, watch her work, then come back and tell you what happened. That's the only way I'll know if this is actually useful.

And honestly? I'm skeptical it'll be perfect on the first try. But at least I'll have real feedback instead of theoretical feedback.

I'll do this by... probably Wednesday or Thursday, depending on when I can carve out time to actually observe her working through them. Sound reasonable?

**Skippy:** Perfect plan. You're testing the right things — especially #3, which you can only know by watching her actually work through them.

Here's your template to test:

**MULTIPLICATIVE REASONING PROBLEM GENERATOR**

**What each problem should do:**
"Present the *same grouping situation* in two ways: first as 'groups of X' (multiplication), then ask 'how many groups' (division). Require the student to physically represent or sketch the situation before writing the equation. Include a visual or concrete step that makes the grouping explicit. The relationship should emerge from the student's work, not be given."

**Avoid:**
"Don't use word problem language that obscures the grouping relationship — skip 'altogether' and 'left.' Don't separate the multiplication and division into different problems. Don't let students answer without showing the grouping structure. Don't give away the quotient before they discover it through grouping."

**Student should be able to:**
"See that 3 × 4 and 12 ÷ 4 describe the *same physical situation* from different angles. Translate between 'groups of' language and 'how many groups' language. Connect the concrete grouping to the symbolic equation."

**Additional constraints:**
"Use numbers where division comes out evenly. Keep quotients small enough to draw/manipulate (under 8). Start with the 'how many groups' question, let them discover the answer, then show the multiplication in the same arrangement."

Test it, watch Sofia work, come back with real data. That's exactly how to make this actually useful.

### Turn 10

**Rachel:** Got it. I'll test it this week and report back with what actually happens.

One last thing though — when I go into ChatGPT or Claude with this template, do I just paste the whole thing as-is? Or do I need to frame it differently? Like, do I say "you are a math problem generator" or give it context about Sofia, or...?

I've built prompts before, but I'm usually just asking for problem sets. This feels different because I'm giving it a whole framework to follow. I don't want to paste this and have it ignore half of it because I didn't set it up right.

What's the actual prompt structure I should use?

**Skippy:** Good question — this template needs context to work properly. Here's how to structure it:

**CONTEXT:**
"I'm a 5th grade math teacher. I have a student who can do 3 × 4 = 12 but doesn't see that 12 ÷ 4 = 3 describes the same grouping relationship. She needs problems that help her discover this connection through concrete work."

**Then paste your template as-is.**

**Then add the COMMAND:**
"Generate 3 problems following this framework. Each problem should use different contexts (stickers, books, toys, etc.) but follow the same structure."

That gives the AI enough context about Sofia's specific gap, your teaching constraints, and what you want it to produce.

When you watch Sofia work through these 3-5 problems, what will you record? Does she skip the drawing step? Does she self-correct? Where does she get stuck? And when you come back Thursday, what format should you bring that data in so we can quickly diagnose whether the template worked or needs refinement?

### Turn 11

**Rachel:** I'll record three things:

1. **Does she do the concrete step unprompted, or does she skip it?** If she skips it, the prompt structure isn't working.

2. **Where does she get stuck?** Is it at the drawing? At translating to the equation? At seeing the multiplication in the same arrangement? That'll tell me if one part of the template is broken.

3. **Does she spontaneously connect the two operations, or do I have to prompt her?** That's the real test — is the problem structure actually building the relationship, or is she just following steps?

I'll bring back: the three problems ChatGPT generates, my notes on where Sofia got stuck (or didn't), and whether I think the template needs tweaking before we test it on the other kids with the same gap.

Fair warning though: if the problems are mediocre, I'm going to say so. I don't want to spend time refining a template that's fundamentally not generating the right type of problem. Better to know that now.

Alright, I've got what I need. I'll test this week and come back with actual data.

**Skippy:** Perfect. You've got a clear testing protocol and you're being appropriately skeptical. If the problems are mediocre, absolutely say so — better to know the template doesn't work than to waste time refining something fundamentally flawed.

You now have a system for differentiation that doesn't require creating everything from scratch. Test with Sofia, map your six students to gap types, then we'll build the 1-2 additional templates you actually need.

See you Thursday with real data. Good luck with Sofia!

### Turn 12

**Rachel:** Will do. I'll have something concrete by Thursday.

One thing I'm realizing as we wrap up: we spent a lot of time getting to this one template, but at least now I actually know what I'm testing instead of just hoping ChatGPT generates something useful. That feels like the right move.

I'll report back with what actually happens when Sofia works through these problems. If it works, we scale it. If it doesn't, we figure out why and adjust.

Talk Thursday.

**Skippy:** Exactly right — you're testing with purpose instead of just hoping. That's what makes this sustainable.

Here's your template to keep, saved to your artifacts. Test it with Sofia this week and bring back the real data.

Great work today!

### Turn 13

**Rachel:** Thanks. I'll be back Thursday with Sofia's actual work and notes on where the template held up and where it fell apart.

See you then.

**Skippy:** Perfect. See you Thursday with the real data. Good luck with the testing!
