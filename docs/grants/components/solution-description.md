# Solution Description

## AI for Teachers: Personalized AI Literacy Through Guided Conversation

AI for Teachers is a 7-week AI-guided professional development course that teaches K-12 educators practical AI literacy through personalized conversations with an AI tutor named Skippy. Each week, teachers spend approximately 20 minutes in guided dialogue, building one concrete, classroom-ready artifact — a prompt template, a lesson planning workflow, a feedback rubric, or a personal AI policy.

### How It Works

**Personalized from the first minute.** During a 5-minute onboarding, Skippy learns each teacher's role, grade levels, subjects, AI experience level, biggest time constraints, and professional goals. Every subsequent interaction is shaped by this context. A 3rd-grade reading teacher and a high school chemistry teacher have fundamentally different conversations, even within the same week's curriculum.

**Seven weeks, seven artifacts.** The curriculum follows a deliberate progression:

| Week | Skill | What Teachers Build |
|------|-------|---------------------|
| 0 | Orientation | Teaching profile |
| 1 | Mental model of AI | "AI Understanding Card" — how AI actually works, what it can and can't do |
| 2 | Prompt engineering | A reusable prompt template using the 4C Framework (Context, Constraints, Command, Criteria) |
| 3 | Lesson planning | An AI-assisted lesson planning workflow |
| 4 | Feedback & assessment | A feedback/rubric template with AI calibration |
| 5 | Differentiation | A differentiation strategy using AI for access without reducing rigor |
| 6 | Integration & ethics | A personal AI policy — principles for when and how to use AI in their practice |

**Grounded in learning science.** Skippy uses SOLO taxonomy (Structure of Observed Learning Outcomes) to diagnose each teacher's current understanding level and adapt scaffolding in real time. A teacher who already understands prompt engineering doesn't get a beginner tutorial — they get advanced challenges. A teacher struggling with the concept of AI limitations gets additional worked examples and guided practice. This diagnostic-adaptive loop runs continuously through an asynchronous classifier that analyzes each exchange without adding latency.

**Builds independence, not dependency.** A distinctive feature: in every skills week, Skippy explicitly asks teachers to take their artifact to a different AI tool — ChatGPT, Gemini, Copilot — and test it there. Then they return to discuss what happened. This "external testing loop" ensures teachers develop transferable skills rather than Skippy-specific habits. The goal is a teacher who can walk into any AI tool and use it effectively, not a teacher who needs Skippy forever.

**Artifact-first pedagogy.** Every session uses a framework called "One Win, Then Wrap" — the conversation is designed to produce exactly one concrete, usable output. Not a discussion. Not an exploration. A *thing* the teacher can use in their classroom Monday morning. This respects teachers' time (they're busy) and ensures every 20-minute session delivers tangible value.

### What Makes This Different

**Versus workshops and webinars:** Skippy is personalized to each teacher's actual classroom. A workshop with 30 teachers must target the median. Skippy targets you.

**Versus self-paced courses:** Skippy is interactive and adaptive. A video course delivers the same content regardless of whether you understood it. Skippy checks understanding, adjusts scaffolding, and doesn't move forward until you've demonstrated the skill.

**Versus ChatGPT or Claude directly:** Raw AI tools are powerful but unpedagogical. They'll answer any question but can't structure a learning progression, diagnose misconceptions, or ensure you're building transferable skills rather than just getting answers. Skippy is the teacher; ChatGPT is the tool.

### Technical Architecture

AI for Teachers is built on a modern, scalable stack:
- **AI backbone:** Anthropic Claude (for adaptive tutoring and async classification)
- **Voice mode:** OpenAI Realtime API (for teachers who prefer speaking to typing)
- **Personalized recaps:** AI-generated podcast summarizing each week's learning
- **Infrastructure:** Next.js, PostgreSQL (Supabase), deployed on Vercel

The system's sophistication lies not in any single AI call but in the orchestration: a 6-layer dynamic prompt system, an asynchronous conversation classifier running SOLO-based diagnostics, a state machine tracking learning phases and skill components, and a dual-strategy artifact extraction system. Together, these create a tutoring experience that is meaningfully adaptive, not just responsive.

### Cost Efficiency

The marginal cost per teacher is approximately $8-15 for the full 7-week program (AI API costs + hosting). This compares to $500-2,000 for a traditional multi-day PD workshop — a 50-100x cost reduction at comparable or greater learning outcomes. This cost structure makes universal teacher AI literacy economically feasible for the first time.
