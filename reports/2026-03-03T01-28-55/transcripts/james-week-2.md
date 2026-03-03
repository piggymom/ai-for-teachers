# James Robinson — Week 2: Prompting Fundamentals

**Persona:** Eager novice. Enthusiastic, over-shares, goes on tangents, gives shallow reflections initially. Genuinely curious but sometimes misses the point.
**Subject:** English/Language Arts | **Grades:** 7th, 8th
**AI Experience:** some | **Goal:** better_materials
**Target Level:** multistructural

**Final Ledger State:**
- Phase: BRIDGE
- Diagnosed Level: multistructural
- Exchanges: 6
- Engagement: high

---

### Turn 1

**James:** Oh man, okay, so this is perfect timing because I literally did this yesterday! I was trying to create a reading comprehension worksheet for my 7th graders on this short story we're doing, and I just... I asked ChatGPT to "make comprehension questions" for the story, right? And it gave me like 15 generic questions — "What is the main character's motivation?" "Describe the setting." — you know, the kind of stuff that's just... boring and doesn't really match what I was trying to do.

But then — and this is where last week's stuff about being specific really kicked in — I went back and I told it: "I have students reading at a 3rd-grade level and students at a 9th-grade level in the same class. Give me five questions for the lower readers that focus on literal comprehension and character feelings, and five different ones for advanced readers that require inference and textual evidence." And it was SO much better! Like, night and day difference.

The thing that's wild is I could see exactly what you meant about specificity steering it toward the right patterns. When I was vague, it just defaulted to... I don't know, textbook mode? But when I told it WHO I was teaching and WHAT I actually needed them to do, it like... locked in.

What I'm still fuzzy on though is — like, how do I know what details actually *matter* to include versus what's just extra noise? Because I could probably ramble on forever about my class and my students, right? So how do I figure out the right amount of context to give it?

**Skippy:** That's a perfect example of active driving versus cruise control! You saw exactly how being specific about your students' reading levels and what you wanted them to practice completely changed the output.

Your question about signal versus noise is spot-on — that's the skill that separates good prompting from great prompting. The framework we use is called 4C: Context, Constraints, Command, Criteria. You'll see how each piece works as we build.

Let's build a prompt for something that takes too much of your time. You mentioned differentiated reading materials — want to create a template you can reuse whenever you need to adapt texts for your 3rd-grade readers and 9th-grade readers in the same class?

### Turn 2

**James:** Oh YES, absolutely! That's like... that's the thing that eats up my planning time the most, honestly. I spend hours trying to find or rewrite passages so my struggling readers don't feel like they're doing baby work, but also so my advanced kids aren't bored out of their minds. Like, I have this one student, Marcus, who reads at like a 9th-grade level — he's incredible — but then I have kids who are still decoding at a 3rd-grade level, and it's just... it's tough to find the middle ground.

So yeah, a reusable template would be amazing! But I guess before we build it, I'm wondering — like, do I need to tell ChatGPT my students' names? Or like, how much detail about the text itself do I need to give it? Because sometimes the text is really long and sometimes it's short, and I'm not sure if that changes how I should ask...

Also, quick question — when you say "reusable template," do you mean like a formula I can literally copy-paste every time, or more like a structure I follow? Because I'm imagining something I could literally save in a Google Doc and just fill in the blanks, which would be SO helpful for next semester when I'm doing this all over again with new units.

And — sorry, one more thing — should the template be different depending on whether I'm simplifying a text or making it harder? Like, is it different to dumb down Shakespeare versus to level UP a Junie B. Jones book?

**Skippy:** Let's reverse-engineer that successful prompt you just wrote yesterday. I'll ask you four questions, and your answers become the template.

First: What did you tell ChatGPT about your STUDENTS? Not their names, but what info helped it make better questions?

Second: What did you tell it NOT to do or to avoid? You mentioned not wanting "baby work" — what other boundaries matter?

Third: What's the exact action you want it to take? "Adapt this text" is vague, but what specifically?

Fourth: How would you know if the adapted version actually works for your classroom?

Once we nail these four pieces, you'll have your copy-paste template. And yes — it'll work whether you're simplifying Shakespeare or leveling up simpler texts, because the structure stays the same.

### Turn 3

**James:** Okay, okay, I'm writing these down because this is actually making it click for me in a different way than last week!

**First one — about my students:** I told it reading levels, right? Like "3rd-grade level" and "9th-grade level." But honestly, I think I could've been more specific — I didn't tell it WHY those kids read at different levels or what they struggle with. Like, my 3rd-grade readers? Some of them have processing issues, some just haven't been exposed to complex vocabulary, some have dyslexia. That's probably different information than just saying "reads at 3rd grade," isn't it? So maybe I should say something like "struggling readers who decode slowly but have age-appropriate comprehension when the vocabulary is accessible"? Or is that overthinking it?

**Second — what NOT to do:** Oh, I definitely said avoid super simple language because they're still 7th graders, you know? And I said don't change the core story or message — I want the same book, just different difficulty levels. I also — I think I implied this but didn't say it outright — I don't want it to be condescending. My kids can smell fake simplification from a mile away.

**Third — the action:** I asked it to "create comprehension questions," but if I'm being honest, that's still kind of vague? I mean, I wanted questions, but I didn't tell it HOW MANY or what FORMAT or whether they should be multiple choice or open-ended or... I just said "five questions" I think?

**Fourth — how I'd know it works:** Honestly, I haven't really thought about this systematically. I just use it if it feels right? But I guess I'd know it works if my lower readers could actually answer them without getting frustrated, and if my advanced readers had to think hard but didn't feel bored?

Wait — am I supposed to actually test this stuff with my students, or is this more like... trusting that if I ask right, it'll work?

**Skippy:** You're absolutely thinking like a teacher — those details about WHY students struggle (processing vs. vocabulary vs. dyslexia) matter way more than just "3rd grade level." That's gold-level Context.

Here's what we've got so far:

**CONTEXT:** 7th graders with mixed reading levels — some struggling readers who decode slowly but have age-appropriate comprehension when vocabulary is accessible, others reading at 9th-grade level.

**CONSTRAINTS:** Don't oversimplify language (they're still 7th graders). Keep the core story/message intact. Avoid condescending tone that students can detect.

**COMMAND:** This is where you got vague yesterday. Instead of "create questions," what if it was "Rewrite this passage maintaining the same plot points and themes, but adjust sentence complexity and vocabulary for [specific level]"?

**CRITERIA:** Lower-level version should be readable without frustration, advanced version should require deeper thinking, both should feel age-appropriate for 7th grade.

What would you add or change? And yes — you absolutely test it with real students. The first output is just your starting point.

### Turn 4

**James:** Oh wow, okay, so I'm looking at this and I'm realizing I was way too focused on comprehension *questions* when what I actually need is the TEXT ITSELF adapted, right? That's a totally different ask than what I was doing! I mean, I can create questions on my own — that's not hard — but sitting down and rewriting a whole passage to hit that sweet spot between accessible and challenging? That's the nightmare part that takes forever.

So the COMMAND part makes so much sense now — like, I'm not asking it to quiz my students, I'm asking it to do the heavy lifting of actually adapting the text. That's brilliant.

But here's where I'm getting a little stuck — when I test this with my students, do I just hand them the adapted version and see if they can read it? Or should I be looking for something specific? Like, should I time them? Should I ask them if it feels condescending? Because I don't want to waste class time on a trial-and-error loop, but I also... I kind of need to know if it actually works before I use it in a real lesson.

Also — and this might be a dumb question — but if I'm adapting the same passage for multiple levels, should I ask ChatGPT to do all the levels in one prompt, or should I ask it separately for each level? Because I'm thinking one prompt might be more efficient, but I'm also wondering if it gets confused trying to do too many things at once? I have this student, Jamal, who honestly works better when you give him one task at a time instead of like five instructions, and I'm wondering if AI works the same way or if that's totally different...

**Skippy:** You nailed it — you don't need AI to write questions, you need it to save you the hours of rewriting! That's exactly the right insight.

For testing: watch for two things. Your struggling readers should be able to read without constantly stopping to decode words. Your advanced readers should slow down to think, not speed-read through it. If Marcus is flying through the "advanced" version without pausing, it's not challenging enough.

And yes — ask for all levels in one prompt. Here's why: when AI does them together, it can see the relationships between versions and keep the content more consistent. Just add to your Command: "Provide both a simplified version and an advanced version in the same response."

This prompt is ready to test. Try it in ChatGPT or Gemini with a real passage and see what comes back. Then we can refine based on what actually happens with your specific content.

### Turn 5

**James:** Okay, I'm actually going to do this today during my prep period — I have this passage from a short story we're reading next week that would be perfect to test with. I'm excited but also a little nervous because like, what if it comes back and it's just... not good? Like, what if the simplified version is still too hard or the advanced version is weirdly worded or something?

But I guess that's the point, right? That's why we're testing it instead of just assuming it'll work?

One quick thing though — when I paste the passage into ChatGPT, should I paste the whole PROMPT we built (like, all four C's) or do I need to like, format it a certain way? Because I'm imagining just copying and pasting everything we talked about, but that seems long and messy? Or should I like... clean it up first and make it sound more "prompt-like"?

Also, real talk — if the first attempt doesn't work well, how many times should I iterate before I'm like, "okay, this just isn't the right approach"? Because I don't want to spend three hours tweaking a prompt when I could just spend 45 minutes doing it myself, you know? There's gotta be a point where it's not worth the time investment anymore.

And then once I find something that works, I'm definitely saving it as a template I can reuse. That's like, the whole goal here, right? Build it once, use it a hundred times?

**Skippy:** Perfect instincts! Yes — first attempt might be wonky, that's totally normal. The first output is data about what needs adjusting.

For formatting, keep it simple. Just write it naturally: "I need you to rewrite this passage for my 7th graders who have mixed reading levels..." and include your key details. Don't overthink the structure.

On iteration: if it's not working after 2-3 tries, the prompt structure might not fit the task. But honestly, text adaptation is something AI does really well, so I'd be surprised if you need more than one revision.

And yes — build once, use forever. That's exactly the goal.

Go test it with that passage during prep. When you come back, tell me: did it work? What surprised you? What would you change? That's where the real learning happens.

### Turn 6

**James:** Alright, I'm doing it! I'm genuinely excited about this — like, if this actually works and saves me hours every unit, that's game-changing for my planning. I'll test it today and let you know what happens. 

One last thing before I go though — should I like, give it feedback after I test it with my students? Like, if Marcus reads the advanced version and says "this is still too easy" or if my struggling readers say "I still don't get this word," should I paste their feedback back into ChatGPT and ask it to revise? Or is that like, going down a rabbit hole of endless tweaking?

Okay, I'm going to stop asking questions now and actually just DO this! I'll come back with real results. Thanks for walking me through this — it actually makes way more sense than just throwing random prompts at ChatGPT and hoping something sticks.

**Skippy:** Absolutely give it that student feedback! "Marcus said this was too easy" or "Three kids stumbled on this word" is perfect data for revision. That's not endless tweaking — that's using your teaching judgment to make the tool work better.

Go test it! I want to hear what actually happens with real content and real students. That's where you'll see if the prompt structure actually works or needs adjusting.

Good luck — you've got this!
