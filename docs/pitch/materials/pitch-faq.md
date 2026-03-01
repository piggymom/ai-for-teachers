# Pitch FAQ — AI for Teachers

## Product Questions

### "What exactly is Skippy?"
Skippy is an AI tutor (powered by Claude) that teaches teachers to use AI through a structured 7-week course. Each week, teachers have a 20-minute conversation with Skippy and build one concrete classroom artifact — a prompt template, lesson planning workflow, feedback rubric, differentiation strategy, or personal AI policy. Skippy adapts to each teacher's subject, grade level, goals, and current understanding level in real time.

### "How is this different from just using ChatGPT?"
ChatGPT has no pedagogy. It doesn't know what you should learn next, it can't diagnose your understanding level, and it won't push you toward a concrete outcome. Skippy provides the structure, progression, and scaffolding that transforms random AI exploration into genuine skill building. Think of it this way: you can learn to swim by jumping in a lake, or you can learn with a coach. ChatGPT is the lake. Skippy is the coach.

### "How is this different from MagicSchool or similar tools?"
MagicSchool generates content *for* teachers — lesson plans, rubrics, emails. When you stop paying for MagicSchool, you lose the capability. Skippy teaches teachers the *skills* to generate that content themselves, using any AI tool. When you stop using Skippy, you keep the skills. That's the capacity vs. dependency distinction.

### "Why 7 weeks? Is that enough?"
Seven weeks is enough to move a teacher from "I've never used AI" to "I have a personal AI policy and a portfolio of tools I built myself." The curriculum is designed around SOLO taxonomy progression — each week builds on the previous one, moving from foundational understanding to complex application to reflective synthesis. After 7 weeks, advanced modules are available for specialized topics (special ed, ELL, STEM).

### "What if a teacher already knows how to use AI?"
Skippy's SOLO taxonomy classifier diagnoses each teacher's level in the opening exchange and adapts accordingly. A teacher who already uses ChatGPT regularly won't get the "what is AI?" treatment — they'll be challenged with edge cases, framework critique, and peer-level discourse. The system meets every teacher where they are.

### "Do teachers need to install anything?"
No. Skippy is web-based. Teachers sign in with Google (their existing school account) and start immediately. Works on any device — laptop, tablet, or phone.

---

## Learning Science Questions

### "What's SOLO taxonomy?"
SOLO (Structure of Observed Learning Outcomes) is a framework developed by Biggs and Collis in 1982 that describes five levels of understanding: pre-structural, unistructural, multistructural, relational, and extended abstract. It's been validated across 40+ years of education research. We use it to diagnose teacher understanding in real time and adapt instruction — the same framework used in university education programs worldwide.

### "How does the real-time classifier work?"
After every teacher response, an async classifier (a second AI call, running in the background with zero latency impact) analyzes the conversation and updates a "ledger" — the teacher's current SOLO level, conversation phase, skill component completion, artifact state, and engagement level. This ledger shapes every subsequent response from Skippy. It's like having a teaching assistant who takes notes on every student and whispers suggestions to the teacher in real time.

### "What's the 4C Framework?"
Context, Constraints, Command, Criteria — a transferable structure for writing effective AI prompts. Teachers learn it in Week 2 and apply it across Weeks 3-5. It's designed to be tool-agnostic: a 4C prompt works in ChatGPT, Gemini, Claude, or any future AI tool. The framework gives teachers a mental model for prompt construction rather than a list of tricks.

### "What evidence do you have that this works?"
The curriculum is grounded in SOLO taxonomy (40+ years of validation) and scaffolding theory. The product design builds on TimeSaveAI (100+ weekly users). We are seeking funding for a formal pilot study with an education research partner to generate empirical efficacy data — specifically, SOLO level progression, artifact quality, and independent AI use at 30/60/90 days post-completion.

---

## Business Questions

### "How much does it cost?"
For individual teachers: free during the launch phase. For districts: $25-50 per teacher per year, which includes the 7-week core course, admin dashboard, cohort management, PD credit documentation, and advanced modules.

### "What's the cost to deliver?"
Approximately $5 per teacher for the full 7-week course in API costs (Claude for tutoring and classification, OpenAI for podcast generation). Infrastructure is serverless (Vercel + Supabase), so hosting costs scale linearly. No human facilitators required.

### "How do you make money?"
B2B district licensing. The core curriculum is the hook — the revenue comes from admin tools (analytics dashboards, cohort management, completion reporting) and advanced modules (subject-specific, role-specific). At $50/teacher on a $5 cost base, gross margins are ~90%.

### "What's the market size?"
3.7 million K-12 teachers in the U.S. $18 billion spent annually on professional development. AI-specific PD is less than 1% of that market today. At $50/teacher/year, the domestic addressable market is $185 million. International expansion (70M+ teachers globally) extends this significantly.

### "Who are your competitors?"
**Khanmigo** (Khan Academy) tutors students, not teachers. **MagicSchool** generates content for teachers but doesn't build capability. **ISTE/Coursera AI courses** are passive video content without personalization or adaptive scaffolding. **ChatGPT/Claude directly** has no pedagogy, progression, or structured outcomes. We don't compete with these — we fill the gap they leave.

### "Won't OpenAI or Anthropic just build this?"
A general-purpose AI company adding a PD course would be like Google Docs adding a creative writing MFA. The pedagogy is the product — 4,134 lines of scaffolded curriculum content tied to a diagnostic classification system. That's curriculum IP with learning science foundations, not a feature to bolt on.

---

## Technical Questions

### "What AI models do you use?"
Claude Sonnet for tutoring and diagnostic classification (the core intelligence). Claude Haiku for artifact extraction and metadata generation (lower-cost tasks). OpenAI TTS-1 for podcast audio generation. The architecture is model-agnostic — we can switch providers if better options emerge.

### "What about data privacy?"
No student data is ever collected — Skippy works with teachers only. Teacher data (profile, conversations, artifacts) is stored in Supabase (SOC2 compliant PostgreSQL). Authentication is Google OAuth via NextAuth.js. We are pursuing FERPA and COPPA compliance documentation for district sales. No data is shared with third parties.

### "Is the product live?"
Yes. Skippy is a fully functional application deployed on Vercel. It is not a prototype, mockup, or pitch deck with screenshots. The 7-week course, authentication, onboarding, adaptive tutoring, artifact extraction, podcast generation, and progress tracking all work.

### "What's the tech stack?"
Next.js 16 (App Router), TypeScript, React 19, Tailwind CSS 4, Prisma ORM, Supabase (PostgreSQL), NextAuth.js (Google OAuth), Anthropic Claude API, OpenAI API, Vercel (serverless hosting).

---

## Objection Handling

### "There's no efficacy data."
Correct — and that's exactly what we're raising for. The product is built. The learning science foundation is validated (40+ years of SOLO taxonomy research). The next step is a formal pilot with an education research partner to generate empirical data. We're asking for funding to run the study, not to validate the hypothesis.

### "Teachers won't use another tech tool."
Skippy doesn't feel like a tech tool. It feels like a conversation with a knowledgeable colleague. 20 minutes, once a week, and they walk away with something they use Monday morning. The teachers most likely to resist are exactly the ones Skippy is designed for — the SOLO taxonomy scaffolding starts at pre-structural ("I don't know what AI can do") with concrete analogies and small wins.

### "AI is changing too fast — won't this be obsolete?"
The 4C Framework and prompting skills are tool-agnostic by design. We don't teach "how to use ChatGPT" — we teach "how to think about working with any AI." The underlying skills (structured prompting, output evaluation, iterative refinement) transfer to whatever comes next. The curriculum *content* can be updated without changing the architecture.

### "Why not just train teachers in person?"
Cost: $50-200 per teacher per session vs. $5. Scale: one facilitator can train 30 teachers per session; Skippy can train 30,000 simultaneously. Personalization: workshops are one-size-fits-all; Skippy adapts to every teacher's context. Scheduling: workshops require coverage, travel, and coordination; Skippy is 20 minutes from any device, any time.

### "$5 per teacher sounds too cheap. What's the catch?"
No catch — that's the marginal cost of API calls. The expensive work (curriculum design, classifier architecture, 4,134 lines of prompt content) is already done. This is the structural advantage of AI-delivered curriculum: the content creation cost is fixed, and the delivery cost is near-zero per additional teacher. Traditional PD costs scale linearly because every session needs a facilitator.
