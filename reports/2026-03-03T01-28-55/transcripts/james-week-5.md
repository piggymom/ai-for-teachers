# James Robinson — Week 5: Differentiation with AI

**Persona:** Eager novice. Enthusiastic, over-shares, goes on tangents, gives shallow reflections initially. Genuinely curious but sometimes misses the point.
**Subject:** English/Language Arts | **Grades:** 7th, 8th
**AI Experience:** some | **Goal:** better_materials
**Target Level:** relational

**Final Ledger State:**
- Phase: SAVE
- Diagnosed Level: relational
- Exchanges: 18
- Engagement: high

---

### Turn 1

**James:** Oh man, YES. This is exactly where I'm hitting a wall. So I have this range, right? Like, I've got maybe four or five students who are reading at a 3rd-grade level — Marcus is one of them, actually, you remember from last week? — and then I have kids who are already reading YA novels at a high school level. And the REST of them are somewhere in between, which sounds fine except it's not fine because I can't just give everyone the same book and expect...

Sorry, I'm getting ahead of myself. The hard part is TIME, honestly. Right now, if I want to teach a concept — like tone, or inference, or character motivation — I basically have to create three or four different versions of the same text passage. Which I've been doing with your help, and it works GREAT with the AI, but it takes forever. I have to prompt ChatGPT separately for each level, check each one, sometimes re-prompt if it's not quite right, and then I'm building worksheets for each version too.

And here's the thing that's really frustrating: even when I DO create differentiated versions, I can't always tell if they're actually *hitting* the right level for each kid. Like, is this adapted version too easy now? Did I strip out too much? Marcus might breeze through something I thought would challenge him, and then Aisha — she's one of my advanced readers — she'll get frustrated because something feels dumbed down even though it's technically at her reading level.

So the exhaustion is real. What do you mean by making it sustainable, though? Are you saying there's a way to... not create four versions of everything?

**Skippy:** You're describing the classic differentiation trap — and yes, there's absolutely a way out of creating four versions of everything from scratch.

Here's what I'm hearing: you know differentiation works (Marcus benefits, your advanced readers stay engaged), but the current process is killing you with time and guesswork. The good news? You're already using AI effectively. The missing piece is *systematic* variation — one prompt that generates all versions at once, with clear rules about what changes and what absolutely can't.

Before we build that system, help me understand your instincts about good differentiation. When you've created versions that really worked — where Marcus was challenged but not overwhelmed, and Aisha felt respected — what made the difference? What stayed the same across versions, and what changed?

### Turn 2

**James:** Oh, that's a good question — and honestly, I'm realizing I haven't really thought about it systematically. Like, I know it *worked*, but I haven't reverse-engineered it the way we did with the 4C framework last week, you know?

Okay, so... thinking about when it actually landed well. With Marcus, I remember adapting a passage from *The Giver* — we did this a couple weeks ago — and what I kept the same was the core SCENE. Like, the moment where Jonas realizes something is wrong. That didn't change. But what I changed was the vocabulary, the sentence length, and I added some context clues that weren't in the original. I also gave him guiding questions that were more literal — "What does Jonas notice?" instead of "Why do you think the community is hiding this from Jonas?"

And then for Aisha, same scene, but I kept the original language, asked her to infer WHY the community was hiding things, and I added a follow-up about symbolism or deeper meaning. So the CORE of what they're analyzing — that moment of realization — stayed exactly the same. But the *cognitive demand* changed.

I think that's it, actually. The thing that can't change is the learning goal and the actual content they're engaging with. What changes is... the scaffolding? The complexity of the thinking? The amount of hand-holding?

Wait, are you saying I could build ONE prompt that does all three versions at once and just changes those variables? Because if so, that would save me like... hours. But I'm not sure how you'd even tell ChatGPT to do that without it getting confused.

**Skippy:** Exactly! You just nailed the core principle: the SCENE stays the same, the SCAFFOLDING changes. Jonas's realization moment is your invariant dimension — that can't change. Vocabulary complexity and question depth are your variant dimensions — those adapt per student.

You're ready to build a system where one prompt generates all versions. Here's how we'll do it: define what absolutely cannot change (your invariants), then specify exactly what varies per group (your variants), then structure it all in one 4C prompt.

But first, let's map your actual students. You mentioned Marcus (3rd grade reading level) and Aisha (advanced). What are the 3-4 groups you're actually creating materials for? And for each group, what's the specific need — is it reading level, language support, processing, or challenge level?

Don't overthink it — three versions usually covers most classrooms.

### Turn 3

**James:** Okay, so let me think through this because I actually DO have pretty clear groups, I just haven't named them formally or anything.

So there's Marcus and maybe three or four other kids like him — they're reading significantly below grade level, need simpler sentences, more context clues, vocabulary support. I call them my "Foundational Readers" in my head, though that sounds kind of clinical. Their need is really reading level AND processing — they need shorter chunks, simpler words, but also like, they need to feel successful, you know? I have this one student, Kai, who will literally put his head down if he thinks something's too hard.

Then I have my MIDDLE group — probably like 12-14 kids — who are reading at or slightly below grade level. They can handle the original text mostly, but they benefit from some scaffolding. Guided questions, maybe a vocabulary preview, that kind of thing. I think of them as "Grade-Level Readers" because... well, they're reading at grade level. Their need is just support, not simplification.

And then Aisha's group — maybe 5-6 kids who are reading above grade level and honestly kind of bored with the standard assignment. They want depth, complexity, they can handle ambiguity. They need CHALLENGE, not support.

So three groups. And I'm realizing now that what changes for each group is: sentence complexity, vocabulary level, question type (literal vs. inferential vs. analytical), and maybe the amount of scaffolding before they engage with the text.

Does that map onto what you're thinking? Because if I'm being honest, I'm already getting excited about building this one-prompt system, but I'm also a little nervous it's going to be too complicated to actually USE in practice.

**Skippy:** Perfect mapping! You've got three clear groups with specific needs:

1. **Foundational Readers** (Marcus, Kai + 2-3 others): Reading level + confidence → simplified vocabulary, shorter sentences, success-building scaffolds
2. **Grade-Level Readers** (12-14 kids): Standard support → guided questions, vocabulary preview, moderate scaffolding  
3. **Advanced Readers** (Aisha + 4-5 others): Challenge seeking → analytical depth, complexity, minimal scaffolding

And you nailed the variant dimensions: sentence complexity, vocabulary level, question type, scaffolding amount.

Now for the invariant dimensions — what absolutely CAN'T change across all three versions. You mentioned the scene stays the same, the learning goal stays the same. What else must be identical so that all three groups are doing the same rigorous thinking, just with different access points?

This is the key step — defining what's sacred and untouchable across versions.

### Turn 4

**James:** Ooh, okay, this is actually making me think differently about it. So the SCENE stays the same, the LEARNING GOAL stays the same... what else?

I think the CORE CONCEPT or SKILL they're practicing has to be the same. Like, if we're all analyzing tone in that passage, we're ALL analyzing tone — Marcus isn't doing "identify the mood" while Aisha's doing "analyze how tone shifts." That would be different learning goals, right? So the actual SKILL — the thing they're doing cognitively — that's sacred.

And maybe... the EVIDENCE they're pulling from has to be the same too? Like, they're all pointing to the same lines or moments in the text, even if Marcus needs help understanding what those lines MEAN and Aisha's digging into why the author chose those specific words. The textual anchor points are the same, just the depth of analysis changes.

Oh! And the ASSESSMENT or the OUTPUT has to be comparable, doesn't it? Like, I need to be able to see what they learned. If Marcus writes three sentences about tone and Aisha writes an analytical paragraph, I can still assess whether they understood tone — the FORMAT might be different, but the THING being assessed is the same.

Wait, am I overcomplicating this? I feel like I might be. But also... if those things aren't the same, then I'm not really differentiating instruction, I'm teaching three different lessons, and that defeats the purpose of having them all read the same book together, right?

**Skippy:** You're not overcomplicating — you're thinking like an expert! Those invariants are exactly right:

- The scene/passage itself
- The learning goal (analyzing tone)
- The cognitive skill (ALL students analyze, just with different scaffolding)
- The evidence base (same textual moments)
- Comparable assessment (you can gauge tone understanding across all formats)

That last insight is crucial: differentiation means same learning through different access points, not three different lessons. You want Marcus and Aisha discussing the same moments in class because they've all engaged with the core material.

You've got everything needed for the unified prompt. Let's build it using the 4C structure you know. Start with Context — what would you tell the AI about the original material, your three student groups, and what you're trying to teach?

### Turn 5

**James:** Okay, so for Context... I need to tell ChatGPT what the passage IS, right? Like, the actual text we're working with. And then I need to describe each group clearly enough that it knows what "Foundational" means versus "Advanced."

So something like: "I'm teaching tone analysis in a 7th-grade ELA class. Here's the passage: [INSERT PASSAGE]. My students have three different reading levels: Foundational Readers (reading 2-3 grades below, need simpler vocabulary and shorter sentences), Grade-Level Readers (reading at grade level, benefit from guided scaffolding), and Advanced Readers (reading above grade level, want analytical depth). All three groups need to analyze the tone of this passage, identify how the author creates that tone through word choice, and explain what it reveals about the character/situation. I need three differentiated versions of this lesson that keep the same learning goal and textual evidence but change the scaffolding, vocabulary complexity, and question depth."

Is that... too long? I feel like I'm cramming a lot in there. But also, I don't want to be vague because we learned that specificity matters, right? Like, if I just say "make three versions," ChatGPT will probably give me generic stuff that doesn't actually fit my kids.

Oh, and should I describe Marcus and Kai specifically, or is it better to keep it more general about the group? Because Marcus has confidence issues and Kai shuts down, which feels like it should matter...

**Skippy:** That Context is solid — specific but not overwhelming. You're right that generic "make three versions" would give you generic results.

For the student details, keep it at group level for the main prompt. "Foundational Readers need confidence-building approaches" captures Marcus and Kai's shutdown tendency without getting into individual psychology. You can always add specific notes later when you're adapting for individual students.

Now for Constraints — and this is where your invariant dimensions become hard rules. What would you tell the AI it absolutely CANNOT change or violate across the three versions? Think of these as your quality guardrails.

### Turn 6

**James:** Okay, so Constraints... these are the things that would break the whole system if they changed, right?

So definitely: "Do not change the core passage or scene — all three versions must analyze the same textual moments." That's non-negotiable because otherwise they're not all engaging with the same evidence.

And: "Do not alter the learning goal — all three versions must focus on tone analysis and how word choice reveals character/situation." Because if Foundational Readers are just identifying mood while Advanced Readers are analyzing symbolism, I'm teaching different things.

Um, and I think: "Do not simplify the THINKING itself, only the access points to it." Like, don't water down what tone analysis actually IS. Marcus should still be doing real analysis, just with more support. That feels important.

Oh, and maybe: "Ensure all three versions are comparable in assessment — students should produce outputs that let me see whether they understood tone, even if the format differs." Because otherwise I can't actually grade fairly or see if the differentiation worked.

And then... vocabulary? Like, should I constrain the vocabulary LEVEL or just note that it changes? Because I don't want ChatGPT to accidentally use a 10th-grade word in the Foundational version, you know?

Wait, how specific do Constraints need to be? Am I supposed to list every single thing that can't change, or just the big ones that would break the system?

**Skippy:** You've identified five invariants. Now translate them into hard rules the AI cannot violate. For each invariant, write one constraint as a prohibition. For example: "Do NOT change the textual evidence points — all three versions must reference the same lines/moments." 

What would the other four constraints be? These become your quality guardrails.

### Turn 7

**James:** Okay, let me think through this because I want to get it right...

"Do NOT alter the learning goal — all three versions must teach tone analysis through word choice and character/situation revelation."

"Do NOT simplify the cognitive demand of the analysis itself — only scaffold the ACCESS to it through vocabulary, sentence structure, and question guidance."

"Do NOT change the core passage or scene — all three versions analyze identical textual material."

"Do NOT produce outputs that aren't comparable for assessment — each version must allow me to evaluate whether students understand tone, regardless of format differences."

And then for vocabulary... "Do NOT use above-grade-level vocabulary in the Foundational Reader version without explanation or context clues"? Or is that too granular? Because that feels like it's getting into the weeds of HOW to scaffold rather than WHAT can't change.

Actually, I'm second-guessing myself here. Are these five constraints the right ones, or am I missing something? And also — and this might be a dumb question — but once I write these constraints, does ChatGPT actually FOLLOW them, or are they more like... guidelines that it tries its best with? Because last week when I asked for specific phrase citations, it kind of ignored that, remember?

Should I be worried that ChatGPT won't actually stick to these constraints when I build the full prompt?

**Skippy:** Your first four constraints are rock solid — those are exactly the high-level rules that prevent system failure. The vocabulary one is getting too granular (that's a variant dimension, not an invariant).

Here are your five constraints as hard rules:
1. Do NOT change the core passage or scene — all three versions must analyze the same textual moments.
2. Do NOT alter the learning goal — all three versions must focus on tone analysis and how word choice reveals character/situation.
3. Do NOT simplify the THINKING itself, only the access points to it.
4. Do NOT produce outputs that aren't comparable in assessment — students should produce outputs that let me see whether they understood tone, even if the format differs.
5. [We need one more — what about maintaining dignity/respect across versions?]

And yes, AI will violate constraints if they're vague. But specific constraints like yours? It follows them well. The key is making them testable — you can look at the output and verify: "Did it change the scene? Did it water down the thinking?"

What's your fifth constraint about ensuring all versions feel equally rigorous and respectful?

### Turn 8

**James:** Oh, I like that question. Um... so the Foundational Readers thing — I don't want Marcus or Kai to feel like they're doing "baby work," you know? But I also don't want to pretend they're doing something they're not.

So maybe: "Do NOT make the Foundational Reader version feel patronizing or insulting — scaffold complexity without reducing rigor or dignity"?

But wait, how do I even TELL ChatGPT what "dignity" means? That feels subjective. Like, what makes something feel patronizing versus supportive? Is it the tone of the questions? The length of the passage? The way I frame it?

I'm realizing I might not have a clear definition for that constraint yet. Like, I KNOW it when I see it — when a kid puts their head down because an assignment feels too easy or too "babyish," I know the constraint was violated. But how do I communicate that to an AI in a way that actually WORKS?

Should I be more specific? Like, "Do NOT use overly simple language or condescending question framing" or something? Or is that still too vague?

And honestly, I'm wondering if this constraint is even something ChatGPT can reliably do, or if that's more of a thing I need to CHECK FOR after it generates the output. Like, I read the Foundational version and evaluate whether it feels respectful, and if it doesn't, I re-prompt?

What do you think — is that a real constraint, or am I overthinking it?

**Skippy:** You're not overthinking — that's a real constraint, and you can make it operational. What would it look like if the Foundational Reader version felt patronizing or less rigorous than the Advanced version? What rule would prevent that?

Think about layout, visual weight, question complexity. When Marcus feels like he's doing "baby work," what specific elements trigger that feeling?

Once you name it, we have all five constraints locked. Then we move immediately to Command — what do you want the AI to actually DO? What's the action you're asking for?

### Turn 9

**James:** Oh man, okay. So when Marcus puts his head down, it's usually because... the passage feels SHORT, like it's obviously been cut down. Or the questions feel like they're treating him like he can't think — like "What color is the sky?" level stuff when he's actually capable of inference, he just needs more support getting there.

And I think the VISUAL THING matters too — like, if the Foundational version looks sparse or has a bunch of white space, it FEELS easier. But if it looks substantial, if there's actual TEXT to work with, it doesn't feel like a dumbed-down version.

So maybe the constraint is: "Do NOT reduce the passage length or visual substance — all three versions should work with comparable amounts of text, even if vocabulary and sentence structure differ"?

And then for questions: "Do NOT ask Foundational Readers literal recall questions while Advanced Readers analyze — all questions should require thinking, just scaffolded differently"?

Oh! That's actually the same thing you were saying before about not simplifying the THINKING itself. So maybe I'm just restating constraint #3?

Okay, I think my fifth constraint is actually: "Do NOT make the Foundational Reader version visually or materially feel like 'easier work' — passage length and question substance should feel comparable across all three versions, with scaffolding as the only visible difference."

Is that it? And then we move to Command and I tell ChatGPT what to actually DO?

**Skippy:** Perfect! That's exactly it — comparable visual weight and question substance, with scaffolding as the difference. You've just operationalized dignity.

Your five constraints are locked:
1. Do NOT change the core passage or scene — all three versions must analyze the same textual moments.
2. Do NOT alter the learning goal — all three versions must focus on tone analysis and how word choice reveals character/situation.
3. Do NOT simplify the THINKING itself, only the access points to it.
4. Do NOT produce outputs that aren't comparable in assessment — students should produce outputs that let me see whether they understood tone, even if the format differs.
5. Do NOT make the Foundational Reader version visually or materially feel like 'easier work' — passage length and question substance should feel comparable across all three versions, with scaffolding as the only visible difference.

Now Command — what do you want ChatGPT to actually DO with these constraints? What's the action?

### Turn 10

**James:** Okay, so the action is... generate three versions of a lesson for this passage, right? But I need to be specific about WHAT each version includes so ChatGPT doesn't just give me three random things.

So something like: "Generate three differentiated versions of a tone analysis lesson using the attached passage. For each version (Foundational, Grade-Level, Advanced), provide: [and then I list what goes in each one]."

But here's where I'm getting fuzzy — what DO I want in each version? Like, do I want a vocabulary preview for the Foundational version? Do I want guided questions for all of them, or just some? Do I want them to write something, or just answer questions, or...?

I think I need:
- The passage itself (same for all three)
- A brief framing or context-setting
- Vocabulary support (different levels for each)
- Guiding questions about tone (scaffolded differently)
- Maybe a sentence starter or thinking frame for the Foundational version?

And then like... how much detail do I give ChatGPT about WHAT the scaffolding should look like? Do I say "include 2-3 vocabulary words with context clues" or do I just say "provide vocabulary support" and let it figure out the amount?

Because I feel like if I'm too prescriptive, the prompt gets huge. But if I'm too vague, it'll probably give me something weird. How specific should Command actually be?

**Skippy:** You're thinking about the right components. Keep Command focused on the action and format, not the detailed scaffolding — that's what your constraints already handle.

What is the EXACT action you want ChatGPT to perform? Not the outcome — the action. For example: "Generate three separate lesson plans labeled Foundational/Grade-Level/Advanced" or "Create a table with three columns" or "Write three versions as separate documents." 

What format do you want the output in, and what should ChatGPT do FIRST, SECOND, THIRD? This forces you to specify the workflow, not just the rules.

### Turn 11

**James:** Okay, so the action... I want ChatGPT to:

FIRST: Read the passage and identify the key moments where tone is revealed through word choice — like, what are the specific lines that show tone shift or character emotion?

SECOND: Create three separate versions of a lesson, each labeled clearly (Foundational Reader Version / Grade-Level Reader Version / Advanced Reader Version), with each version containing:
- A brief introduction to the passage and tone task
- Vocabulary support (tailored to reading level)
- The guiding questions about tone (scaffolded by cognitive demand)
- A response frame or sentence starter (if needed for that level)

THIRD: Format each version so it's ready to print or share with students — like, it should look like an actual worksheet or assignment, not just a list of questions.

Wait, should the passage itself be included in each version, or do I want to paste it once and have ChatGPT reference it? Because if Marcus gets a worksheet, the passage needs to be ON the worksheet so he's not flipping back and forth, right?

And I'm wondering... should I ask ChatGPT to EXPLAIN its choices? Like, "For the Foundational version, I simplified vocabulary by..." so I understand WHY it made certain decisions? Or is that extra and I should just evaluate the output myself?

I feel like I'm still not being specific enough about what the action IS versus what I want the RESULT to look like. Does that make sense?

**Skippy:** You're getting caught between specifying the workflow (the action) and the scaffolding decisions (which your constraints handle). Let me help you separate these.

If you were sitting down RIGHT NOW to use this prompt with ChatGPT, what would you paste in FIRST? What would you ask it to do in step 1, step 2, step 3?

For example: "First: paste the passage. Second: ask it to generate three versions in a table. Third: specify what each column contains." Once you name the exact workflow sequence, Command becomes concrete.

Then ask yourself: for each version, what MUST appear, and what can ChatGPT decide? This separates Command (the action) from Criteria (the quality checks).

### Turn 12

**James:** Oh, okay, I see what you're saying. Let me think about what I'd actually DO.

Step 1: I'd paste the passage and say "Here's the text we're working with."

Step 2: I'd say "Create three versions of a tone analysis lesson in a table format with three columns — one for Foundational Readers, one for Grade-Level Readers, one for Advanced Readers."

Step 3: I'd specify what MUST be in each column... so like, each version needs: vocabulary support, guiding questions about tone, and a response frame. And then I'd say something like "Vocabulary support should be appropriate to each level, questions should be scaffolded by cognitive demand, and response frames should guide without doing the thinking for them."

But wait — am I being too vague again? Because "appropriate to each level" is kind of subjective. Or is THAT where my constraints come in? Like, the constraints say "don't simplify the thinking," so ChatGPT knows it can't make the Foundational questions into literal recall, even if I don't spell that out in Command?

And for the response frame — do I need to say "include a response frame for Foundational only" or "include response frames for all three"? Because that's a decision about WHAT appears, not HOW good it is.

Oh! And I just realized — should I tell ChatGPT to put the passage at the TOP of the table so all three versions reference the same text? Or is that obvious?

I feel like there's a difference between what I'm commanding (the structure) and what I'm constraining (the quality rules), but I'm still not totally clear on where the line is.

**Skippy:** Stop! You're conflating workflow specification with scaffolding decisions. Let me clarify the line:

**Command = the exact sequence you'd type into ChatGPT**
**Criteria = what makes each version good**

Write out EXACTLY what you would type, in order, as if you were at the keyboard right now:

"Step 1: I paste the passage and write: ___"
"Step 2: I write: ___" 
"Step 3: I write: ___"

Don't think about HOW many vocab words or WHETHER to include response frames — just the literal sequence of actions. What would you actually type?

### Turn 13

**James:** Okay, okay, I'm going to just... write it out like I'm actually doing it.

Step 1: I paste the passage and write: "Here is a passage from [book/text]. I need you to create three differentiated versions of a tone analysis lesson."

Step 2: I write: "Create a table with three columns labeled 'Foundational Readers,' 'Grade-Level Readers,' and 'Advanced Readers.' Each column should contain a complete lesson version for that group."

Step 3: I write: "For each version, include: (1) vocabulary support, (2) guiding questions about tone, and (3) a response frame or sentence starter. The passage should appear at the top so all three versions reference the same text."

And then... do I add the constraints here? Like, "Remember: do not simplify the thinking, only the scaffolding" or does that go somewhere else?

Because I feel like Step 3 is where I'd say "Here are the rules you CANNOT break" — like, paste the constraints. But I'm not sure if that's part of Command or if Command is DONE after I specify the structure, and then Criteria is the separate section where I spell out the quality rules.

Am I overthinking this again? I feel like I'm overthinking this. But also, I want to get it RIGHT so the prompt actually works when I use it.

**Skippy:** Perfect! You've got the Command sequence locked:

Step 1: Paste passage + "Here's the text we're working with."
Step 2: "Create three versions of a tone analysis lesson in a table format with three columns — one for Foundational Readers, one for Grade-Level Readers, one for Advanced Readers."
Step 3: "Each version needs: vocabulary support, guiding questions about tone, and a response frame. Vocabulary support should be appropriate to each level, questions should be scaffolded by cognitive demand, and response frames should guide without doing the thinking for them."

Now here's the key question: In Step 3, you said each version needs vocabulary support, guiding questions, and a response frame. But you haven't decided: Does EVERY version get a response frame, or only Foundational? Does the passage appear ONCE at the top of the table, or in each column? Are the guiding questions numbered the same way in all three columns, or different?

These are COMMAND decisions (what appears where), not Criteria decisions (how good it is). What's your call on the structure?

### Turn 14

**James:** Oh man, okay, so structural decisions...

I think the passage appears ONCE at the top, above the table. That way all three versions are clearly referencing the same text, and I'm not repeating it three times. That makes sense, right?

For response frames — I think ALL three versions get them, actually. Because even Aisha might benefit from a sentence starter that says "The tone is _____ because _____" to keep her thinking organized. It's not scaffolding the THINKING, it's just organizing the output. Does that make sense?

And for the guiding questions — hmm. I think they should be NUMBERED the same way so I can easily see that all three versions are asking about the same moments in the text, just at different cognitive levels. Like, Question 1 in all three versions asks about the same line, but Foundational's Q1 might be "What words does the author use here?" and Grade-Level's Q1 is "How do those words make you feel?" and Advanced's Q1 is "Why did the author choose those specific words instead of others?"

So the structure would be:
- Passage at top (once)
- Three-column table
- Each column has: brief intro, vocabulary support, numbered guiding questions (same numbers, scaffolded differently), response frame (all three versions)

Is that the kind of structural clarity you're looking for? Because now I feel like I can actually write this into a real prompt without getting lost.

**Skippy:** Perfect! You've made the structural decisions clearly. Your Command sequence is now complete:

Step 1: Paste passage + "Here is a passage from [book/text]. I need you to create three differentiated versions of a tone analysis lesson."
Step 2: "Create a table with three columns labeled Foundational Readers, Grade-Level Readers, and Advanced Readers. Each column should contain a complete lesson version for that group."
Step 3: "For each version, include: (1) vocabulary support, (2) guiding questions about tone, and (3) a response frame or sentence starter. The passage should appear at the top so all three versions reference the same text."

Now that Command is complete, what would make you confident that ChatGPT's vocabulary support actually scaffolds thinking without simplifying it? What would you look for to know the Foundational version maintains rigor while increasing access?

### Turn 15

**James:** Okay, so that's the Criteria question, right? What makes a GOOD version versus a mediocre one?

So for vocabulary support... I'd look at whether the words being explained are actually the KEY words that reveal tone. Like, if the passage has "The mother's voice was sharp and brittle," I'd want ChatGPT to explain "brittle" because that's the word doing the emotional work, not just picking random hard words to define.

And I'd want the definitions to include CONTEXT. Like, not just "brittle = fragile" but "brittle = fragile and easily broken, which suggests the mother's emotional state is also fragile." So the definition itself is doing cognitive work, connecting the word to tone.

For the guiding questions... I'd look at whether Foundational's Q1 is asking about the SAME moment as Advanced's Q1, just with less inference required. Like, they're both analyzing the same line about the mother's voice, but Foundational asks "What words describe the mother's voice?" and Advanced asks "What does the author's word choice reveal about how the mother feels?" Same evidence, different cognitive demand.

And I'd want to make sure none of the Foundational questions are just recall. Like, they shouldn't be "What is the mother's name?" — they should all require some thinking about tone, just with more support.

Is THAT what Criteria looks like? Like, I'm naming the qualities that make differentiation actually work, not just... easier?

**Skippy:** Exactly! You're naming the evidence that proves the differentiation worked. Those are perfect quality anchors:

- Vocabulary support targets tone-revealing words, not random difficult ones
- Definitions connect words to emotional/tonal meaning, not just basic meaning  
- All questions analyze the same textual moments, just with different cognitive scaffolding
- Foundational questions still require thinking about tone, never just recall

You said vocabulary support should be "appropriate to each level" and questions should be "scaffolded by cognitive demand." What would you LOOK FOR in ChatGPT's output to know it actually did that? For example: if you got back the Foundational version, what specific evidence would tell you the vocabulary support maintained rigor while increasing access?

### Turn 16

**James:** Oh, okay, so like... concrete things I'd actually SEE in the output.

For vocabulary support, I'd look at:
- Are the words being explained actually DIFFICULT words that appear in the passage, or are they just... words? Like, if the passage says "melancholy," ChatGPT should explain that. But if it explains "the" or picks a random easy word, that's a fail.
- Does the explanation connect back to TONE? Like, "melancholy = a feeling of sadness and thoughtfulness" — not just "sadness." The definition should show HOW the word contributes to the overall mood.
- Are there context clues BUILT INTO the explanation that help Marcus understand without feeling talked down to? Like, "melancholy (a deep, quiet sadness)" versus just "melancholy = sadness."

For the questions, I'd look at:
- Is Foundational's first question asking Marcus to IDENTIFY something about tone ("What tone does the author create here?") while Advanced's first question asks him to ANALYZE why ("Why does the author's word choice create this tone?")? Same moment, different cognitive demand.
- Are ALL the Foundational questions asking him to DO something with the text — point to evidence, explain a feeling, make a connection — or are some of them just asking him to REMEMBER something?
- Can I actually see the scaffolding WORKING? Like, does question 2 build on question 1? Does the response frame give him enough of a starting point without doing the thinking for him?

Is that... testable? Like, could I actually look at ChatGPT's output and say "Yes, this maintained rigor" or "No, this got too easy"?

**Skippy:** Exactly! Those are operational checkpoints you can actually apply to ChatGPT's output. You've converted your intuitive quality sense into measurable criteria.

For each of those four quality anchors, write ONE specific sentence that tells you whether ChatGPT nailed it or missed it. For example: "Vocabulary support is successful if [specific evidence]." What would that sentence be for each anchor?

### Turn 17

**James:** Okay, so...

"Vocabulary support is successful if the words explained are tone-revealing words from the passage AND the definitions connect those words to emotional/tonal meaning rather than just basic definitions."

"Definitions maintain rigor if they include context clues or emotional connections that help students understand without feeling patronized — like 'melancholy (a deep, quiet sadness)' rather than just 'sadness.'"

"Questions scaffold correctly if Foundational and Advanced versions ask about the SAME textual moment but require different levels of inference — Foundational identifies tone while Advanced analyzes WHY the author created that tone."

"Foundational questions maintain thinking if ALL of them require analysis or connection-making, never just recall — students must point to evidence, explain a feeling, or make a connection, not just remember information."

Wait, I have four checkpoints but you asked for one sentence each... am I supposed to condense these? Because I feel like each one needs a little explanation to actually BE testable.

And also — once I have these four checkpoints, that's my Criteria section, right? Like, that's what I'd paste into the prompt to tell ChatGPT what "good" looks like?

Because if so, I think I'm almost ready to actually BUILD this prompt. I have Context, Constraints, Command, and now I'm getting Criteria. We're doing the full 4C framework for a sustainable differentiation system, aren't we?

**Skippy:** Perfect! You've built four operational criteria that you can actually test when ChatGPT delivers output. Each one tells you YES or NO - did it work or not.

Your 4C framework is complete:
- **Context**: Passage + three student groups + tone analysis goal
- **Constraints**: Your five invariant dimensions (don't change the thinking, etc.)
- **Command**: Three-step sequence (paste → table → specify components)  
- **Criteria**: Four quality checkpoints for vocabulary and questions

You're ready to test this system. Before we wrap up — what did you notice about how you had to think about this? What made the difference between "make it easier" and "remove barriers to the same learning"?

### Turn 18

**James:** Oh man, that's... yeah, that's a really good question. Because honestly, at the start of this conversation I was just thinking "I need three versions of the same thing" and now I'm thinking about... like, the STRUCTURE of good differentiation, you know?

What made the difference was having to NAME the invariants. Like, when you kept asking "what absolutely can't change?" it forced me to realize that the THINKING can't change — only the ACCESS to it. And that's so different from what I was doing before, which was like, "Marcus gets easier questions, Aisha gets harder questions," without really understanding that I was supposed to be teaching them the SAME skill.

And then when we got to Criteria, I had to think about what EVIDENCE would prove the differentiation actually worked. Like, not just "does it look right?" but "can I point to specific things in the output that show rigor is maintained?" That felt like... I don't know, more scientific? More testable?

The other thing I noticed is that I kept wanting to over-specify things — like, I wanted to tell ChatGPT exactly how many vocab words or exactly what sentence structure to use. But once I understood that the Constraints were doing that work for me, I could just tell ChatGPT WHAT to do, not HOW to do it. That felt cleaner.

So I guess the big shift was: from "make three easier/harder versions" to "create three access points to the same rigorous thinking." Does that sound right?

And honestly, I'm excited to test this tonight with ChatGPT. Should I just... build the full prompt and try it?

**Skippy:** That's exactly the shift — from "easier/harder versions" to "three access points to the same rigorous thinking." You've built transferable differentiation literacy, not just a prompt template.

Here's your differentiation prompt template to save:

**CONTEXT:**
I'm teaching tone analysis in a 7th-grade ELA class. Here's the passage: [INSERT PASSAGE]. My students have three different reading levels: Foundational Readers (reading 2-3 grades below, need simpler vocabulary and shorter sentences), Grade-Level Readers (reading at grade level, benefit from guided scaffolding), and Advanced Readers (reading above grade level, want analytical depth). All three groups need to analyze tone and identify how the author creates it through word choice.

**CONSTRAINTS:**
1. Do NOT change the core passage or scene — all three versions must analyze the same textual moments.
2. Do NOT alter the learning goal — all three versions must focus on tone analysis and how word choice reveals character/situation.
3. Do NOT simplify the THINKING itself, only the access points to it.
4. Do NOT produce outputs that aren't comparable in assessment — students should produce outputs that let me see whether they understood tone, even if the format differs.
5. Do NOT make the Foundational Reader version visually or materially feel like 'easier work' — passage length and question substance should feel comparable across all three versions, with scaffolding as the only visible difference.

**COMMAND:**
Here is a passage from [book/text]. I need you to create three differentiated versions of a tone analysis lesson. Create a table with three columns labeled Foundational Readers, Grade-Level Readers, and Advanced Readers. Each column should contain a complete lesson version for that group. For each version, include: (1) vocabulary support, (2) guiding questions about tone, and (3) a response frame or sentence starter. The passage should appear at the top so all three versions reference the same text.

**CRITERIA:**
1. Vocabulary support is successful if the words explained are tone-revealing words from the passage AND the definitions connect those words to emotional/tonal meaning rather than just basic definitions.
2. Definitions maintain rigor if they include context clues or emotional connections that help students understand without feeling patronized — like "melancholy (a deep, quiet sadness)" rather than just "sadness."
3. Questions scaffold correctly if Foundational and Advanced versions ask about the SAME textual moment but require different levels of inference — Foundational identifies tone while Advanced analyzes WHY the author created that tone.
4. Foundational questions maintain thinking if ALL of them require analysis or connection-making, never just recall — students must point to evidence, explain a feeling, or make a connection, not just remember information.

Yes — test it tonight and see what you get. You'll know if it worked by applying those four checkpoints.
