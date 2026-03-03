# Rachel Kim — Week 5: Differentiation with AI

**Persona:** Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.
**Subject:** Mathematics | **Grades:** 5th, 6th
**AI Experience:** advanced | **Goal:** faster_feedback
**Target Level:** extended-abstract

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: extended-abstract
- Exchanges: 8
- Engagement: high

---

### Turn 1

**Rachel:** Okay, real talk: I have maybe 15-20% of my class that genuinely needs differentiated instruction, and I'm *already* doing it — but it's unsustainable because I'm doing it manually.

The hard part isn't understanding *what* they need. I can diagnose that in my sleep. It's the *execution*.

I've got three groups that keep me up:

**The "almost there" kids** — they understand place value, can do single-digit addition with regrouping, but multi-digit stuff breaks down. They need more scaffolded practice, fewer distractors on the page. I can generate that with ChatGPT, but then I have to manually edit every problem set because the AI doesn't understand *my* specific sequencing logic.

**The advanced kids** — they're bored. They can do the algorithm, but they're not thinking *about* math. I want them working on "why does this work?" stuff, pattern exploration. The problem is I can't just hand them a worksheet; it needs to be something they can't just skip through in 5 minutes.

**The processing-speed kids** — they get it conceptually but need more time and fewer problems per page. Not harder, not easier. Just... different format.

What kills me is that I'm generating content for 5-6 different configurations, and it's manual work. I do it because my kids deserve it, but it's eating into actual planning time.

What are you thinking? Is there a way to batch-process this that doesn't require me to build a whole custom system?

**Skippy:** You're already doing the hard part — you know exactly what each group needs and why. That diagnostic skill is what most teachers struggle with.

The batch-processing piece is absolutely doable. Instead of generating each version separately, you can create one template that produces all your variations at once. Same prompt, multiple outputs that match your specific sequencing logic.

Here's what I'm hearing: you need the AI to understand YOUR progression rules, not generic math rules. And you need it to produce all versions simultaneously so you're not doing this six separate times.

Before we build that system — when you say "my specific sequencing logic," what's an example? Like, what does ChatGPT get wrong about how you want problems ordered?

### Turn 2

**Rachel:** Good question — and yeah, you're right that it's the sequencing that's the real blocker.

Here's a concrete example: I'm teaching multi-digit addition with regrouping. ChatGPT will give me problems in random difficulty order — like it'll throw a 47+36 right next to a 128+145. That's not how I sequence it.

My logic is: **problems cluster by the *type* of regrouping required, in order of cognitive load.**

So I'd do:
1. Ones place regrouping only (23+18, 35+27) — maybe 4-5 problems
2. Tens place regrouping only (120+80, 140+60) — 4-5 problems  
3. Both places regrouping (128+145, 237+156) — then the hard stuff

*Within* each cluster, I vary the numbers but keep the structure consistent. And I deliberately space the "almost there" kids' versions so they get more repetition in cluster 1 before moving to cluster 2.

When I ask ChatGPT for 15 problems on regrouping, it gives me a random mix. So I end up manually reorganizing, which defeats the purpose.

The advanced kids' version? They need the *same* clusters but with a "explain why this works" prompt after each cluster, and maybe one open-ended "what if" problem at the end.

Does that make sense? It's not that ChatGPT can't generate problems. It's that it doesn't understand *my* pedagogical sequencing rules — the intentionality behind the order.

Can a prompt template actually capture that, or am I asking for too much?

**Skippy:** Absolutely it can capture that — and you've just given me the exact blueprint for how to encode your sequencing logic.

The key insight: you don't need ChatGPT to *understand* your pedagogy. You need to *explicitly specify* the clustering and progression rules so it can't deviate.

Here's the frame: one master prompt that generates all your versions simultaneously, with your clustering rules baked in as hard constraints. Same cognitive progression for all groups, but different formatting and extensions per group.

Let's build this. I want to start with your Needs-to-Supports Matrix — map each group to their specific accommodation, then encode your clustering logic as invariant rules.

For your three groups:
- "Almost there" kids need: scaffolded practice, fewer distractors, more repetition in early clusters
- Advanced kids need: same progression + "why does this work" analysis after each cluster  
- Processing-speed kids need: same problems, different formatting (fewer per page, more white space)

What stays absolutely constant across all versions? Your clustering sequence is one invariant — what else can't change?

### Turn 3

**Rachel:** Wait — I need to pump the brakes here because I'm not sure you're not just repackaging what I already do manually.

You're saying "encode your clustering rules as hard constraints." But I already *have* those rules — they're in my head and in my lesson plans. The constraint isn't that ChatGPT doesn't know them; it's that I have to *tell it every single time*.

So here's my pushback: **Is the actual win that I write the rules once in a master prompt, and then I can reuse that prompt for every unit?** Because that's genuinely useful. But if I'm spending 30 minutes building a "Needs-to-Supports Matrix" and encoding invariant rules just to generate *this week's* problems, I haven't saved time — I've just moved the work around.

What stays constant: Yes, the clustering sequence is invariant. The cognitive progression is invariant. The number of problems per cluster is probably invariant (though I adjust it sometimes based on how a lesson goes).

But here's what I'm actually asking: **Can I build a reusable template that works across units?** Like, I encode my clustering logic *once*, and then for the next topic (fractions, multi-digit multiplication, whatever), I just swap in different numbers and problem types, and it auto-generates all three versions?

Because if that's what you're proposing, that's actually worth the upfront investment. If you're asking me to do detailed scaffolding analysis for each unit, that's just... my job with extra steps.

Which one is this?

**Skippy:** You're absolutely right to push back — and yes, it's the first one. Build the template once, reuse it everywhere.

Your clustering logic transfers across units. "Problems cluster by regrouping type, ordered by cognitive load" works for addition, subtraction, multiplication. "Scaffold group gets more repetition in early clusters, advanced group gets analysis prompts after each cluster, processing group gets same problems with different formatting" — that's your system, not topic-specific.

So you'd encode those rules once: cluster structure, cognitive progression, per-group accommodations. Then for fractions, you just swap in "cluster by denominator type" instead of "cluster by regrouping type." The template handles the rest.

The real test: could you take your finished template, change three variables (topic, problem types, number ranges), and generate differentiated problem sets for a completely different unit without rebuilding anything?

If yes, you've got a system. If no, we're just digitizing busywork.

What's your instinct — does your pedagogical logic actually transfer across math topics, or is each unit genuinely different?

### Turn 4

**Rachel:** My instinct: **it transfers more than I initially thought, but not cleanly.**

The clustering *principle* transfers — "order by cognitive load, cluster by the structural feature that's causing difficulty." That works across topics.

But here's where it gets messy: the *specific* structural features change, and so does the repetition ratio. With regrouping, I want heavy repetition in cluster 1 (maybe 5-6 problems). With fractions, cluster 1 (same denominator) might only need 3 problems before kids are ready to move on. The cognitive load curve isn't identical.

And — this is the thing that makes me hesitate — **I don't always know upfront what the optimal repetition ratio is.** I adjust mid-unit based on how kids actually perform. So if I encode "cluster 1 gets 5 problems" into a rigid template, I'm locking myself into something that might not work.

So my honest answer: the *framework* transfers. The template could definitely work for generating initial versions. But I'd need some flexibility to adjust the clustering ratios and problem counts without rebuilding the whole thing.

Is that a limitation of the template approach, or am I just being overly cautious? Because I *could* try it with fractions next unit and see if it actually saves time or if I'm just fighting the system.

What would you actually build first to test whether this works?

**Skippy:** Your instinct is exactly right — and that flexibility concern is actually what makes a good template powerful, not what breaks it.

Let's build the actual template. For multi-digit addition with regrouping, show me the exact structure: how do you want the prompt to specify the three clusters, the problem count per cluster, and the per-group variations?

Then once we have that structure, what would we change to make it work for fractions? For multiplication?

This tests whether the template is truly reusable BEFORE you invest time building it. Get the variable slots clear — topic, cluster-type, problem-type, number-range — so the template becomes a fill-in-the-blanks system, not a rebuild-from-scratch system.

What would that look like for your regrouping unit?

### Turn 5

**Rachel:** Okay, I see what you're doing — you want me to actually *design* the template structure before we commit to building it. Fair. Let me think this through out loud.

For regrouping, here's what I'd specify:

```
UNIT: Multi-digit addition with regrouping
CLUSTER LOGIC: [ones-place regrouping only] → [tens-place regrouping only] → [both places]
PROBLEM COUNT: [5 problems per cluster for "almost there," 4 per cluster for advanced/processing]
NUMBER RANGES: [Cluster 1: 10-50 + 10-50] [Cluster 2: 100-150 + 50-100] [Cluster 3: 100-250 + 100-250]

GROUP VARIATIONS:
- Almost there: Standard format + extra visual scaffolding (maybe bundled tens/ones boxes)
- Advanced: Same problems + "Why does regrouping work?" prompt after each cluster + 1 extension problem
- Processing-speed: Same problems, fewer per page, more white space
```

For fractions, I'd swap:
```
CLUSTER LOGIC: [same denominator, simple fractions] → [same denominator, mixed numbers] → [different denominators]
PROBLEM COUNT: [probably 3-4 per cluster — fractions move faster]
NUMBER RANGES: [halves/thirds/fourths] [up to eighths] [cross-denominator]
```

For multiplication, same idea — cluster by regrouping type again.

**But here's where I get stuck:** How do I encode this so ChatGPT doesn't just... forget the structure? Do I paste this matrix into *every* prompt? Do I build a system prompt that holds these rules? Because if I'm copy-pasting this structure every time, I haven't really solved the problem.

What's the mechanism that makes this actually *reusable*?

**Skippy:** Perfect — you've designed exactly what you need. Now the mechanism: you save this as a template with variable slots, then swap out just the variables each time.

Your template becomes:

```
UNIT: [TOPIC]
CLUSTER LOGIC: [CLUSTER 1 TYPE] → [CLUSTER 2 TYPE] → [CLUSTER 3 TYPE]
PROBLEM COUNT: [X problems per cluster for "almost there," Y per cluster for advanced/processing]
NUMBER RANGES: [CLUSTER 1 RANGE] [CLUSTER 2 RANGE] [CLUSTER 3 RANGE]

[Same group variations structure - this part never changes]
```

For regrouping, you fill in: TOPIC = "Multi-digit addition with regrouping", CLUSTER 1 TYPE = "ones-place regrouping only", etc.

For fractions, you fill in: TOPIC = "Adding fractions", CLUSTER 1 TYPE = "same denominator, simple fractions", etc.

The group variations, the clustering principle, the progression logic — that's all encoded once and reused.

Test it: take your regrouping version, change just those 6-7 variables to fractions, and see if it generates what you want. If it works, you've got a system. If ChatGPT ignores your structure, that tells us what constraints to strengthen.

Want to draft the actual prompt with your regrouping variables filled in?

### Turn 6

**Rachel:** Hold on — I need to be direct here because I think we're about to do something I already know how to do.

I can *absolutely* fill in those variables and create a prompt. I've been doing this kind of templating with ChatGPT for two years. I know how to structure a prompt so it doesn't ignore my rules. I can test it with fractions.

**But that's not actually the problem I brought to you.**

The problem I said was: "I'm generating content for 5-6 different configurations, and it's manual work." What I meant was — I'm *already* creating these problem sets. I'm *already* thinking about clustering. I'm *already* adjusting for each group.

What I need is not a template I can build myself. **I need to know if there's a way to actually batch-process this so the AI generates all three versions *simultaneously* from one prompt, instead of me running three separate requests.**

Because right now, even with a template, I'm still doing:
- Run prompt for "almost there" version
- Run prompt for advanced version  
- Run prompt for processing-speed version
- Manually compile them into one document

That's three separate cycles. If I'm being honest, a reusable template is nice, but it doesn't actually solve the time problem unless the *generation* itself happens in one shot.

So: **Can I write one prompt that outputs all three differentiated versions at once?** Or am I asking for something that doesn't really work in practice?

**Skippy:** You're absolutely right — and yes, you can generate all three versions in one shot.

One prompt that says: "Generate three versions of this problem set: Version A (almost there), Version B (advanced), Version C (processing-speed)" with your clustering logic and specific accommodations for each version built into the single command.

The AI outputs all three simultaneously. You paste once, get three formatted versions back.

Let's write out the full prompt you'd paste into ChatGPT for regrouping. Once we see it, we can test whether swapping just those 6-7 variables actually works for fractions, or if we're missing something.

What would that single, comprehensive prompt look like?

### Turn 7

**Rachel:** Okay, I'm going to write this out, but I need to flag something first: **I'm about to spend 15-20 minutes drafting a prompt that I could honestly just... build myself in ChatGPT in real time.** And I'm wondering if that's actually the best use of our time together, or if I'm missing what you're actually trying to teach me.

Because here's what I suspect: you want me to *see* the structure so I can recognize what makes a prompt reusable. That's useful. But I also suspect there's a point where I just need to go do this myself and come back when something breaks.

So let me ask directly: **Is the value in me drafting this prompt with you right now? Or is the value in me understanding the *principle* — that one prompt with explicit three-version output is better than three separate prompts — and then me actually building and testing it on my own time?**

Because if it's the latter, I get it. I can do that. I'll draft the regrouping prompt, test it on fractions, and come back if the template doesn't transfer or if ChatGPT starts ignoring my clustering rules.

If it's the former, I'm ready to write it out, but I want to make sure we're not just doing work together that I'd do faster alone.

What's the actual goal here?

**Skippy:** You're absolutely right — the value is in understanding the principle, not in me watching you draft a prompt you can build faster alone.

Here's what we've established: single-prompt multi-output is viable, your clustering logic transfers across units, and you've got the template structure mapped out. That's the core insight.

Go test it. Draft the regrouping prompt that generates all three versions simultaneously, run it, then swap just the variables for fractions and see if it holds up.

When you come back, I want to know: does it actually generate all three versions correctly, or does one of them degrade? Does ChatGPT maintain your clustering logic across all versions, or does it start cutting corners on the advanced/processing versions?

That's where the real learning happens — seeing what breaks and why.

### Turn 8

**Rachel:** Good. That's actually useful.

I'll test it this week — regrouping first, then fractions. I'll run it exactly as I described and see where it fails. My guess is the advanced version will degrade slightly (the "why does this work" analysis might get generic), and the processing-speed formatting might not be as clean as I need.

I'll come back with actual results — what worked, what didn't, what I had to manually adjust — so we're not theorizing about a system that doesn't work in practice.

One thing though: if the template *does* hold up across both units, what's the next problem? Because batch-generating differentiated problem sets is one thing, but I've also got the assessment side — I need to actually *analyze* how each group performed on these problems so I know whether to move forward or reteach. That's where I'm really drowning in manual work.

Is that something we tackle after I test this, or is that a separate system entirely?

**Skippy:** That's exactly the next problem — and yes, it's a separate system, but it connects directly to what you're building now.

If your differentiated problem sets are working, you'll have clean data on exactly what each group struggled with. That makes the analysis piece much more systematic — you're not just looking at random work, you're looking at performance on specific cognitive clusters you designed.

Test the generation system first. When you come back with results, we'll tackle the batch analysis workflow — how to feed student work back into AI to get targeted intervention suggestions without manually sorting through 25 different papers.

But get the input side working first. The assessment analysis is only as good as the intentional structure you're generating.

Go test it. See you next week with real data.
