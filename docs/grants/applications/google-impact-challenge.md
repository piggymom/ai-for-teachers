# Google.org Impact Challenge — Application Draft

> **Note:** Google.org does not maintain a continuously open application. This draft is prepared for when the next AI-focused education challenge is announced. Monitor google.org and ISTE for announcements. Some sections may need adjustment based on the specific challenge criteria.

---

## Project Title
**AI for Teachers: Personalized AI Literacy for Every Educator**

## One-Line Summary
A 7-week AI-guided professional development course that teaches K-12 teachers practical AI literacy through personalized conversations, producing one classroom-ready artifact per week at 50-100x lower cost than traditional PD.

---

## The Challenge (Problem Statement)

Artificial intelligence is transforming how the world works, but the 3.7 million U.S. public school teachers responsible for preparing students for this transformation have been largely left behind. While 40% of teachers report experimenting with AI tools, fewer than 25% have received any formal training — and the training that exists is overwhelmingly generic, passive, and disconnected from teachers' actual classrooms.

This creates three compounding problems:

**1. The capability gap.** Teachers who lack AI literacy cannot model responsible AI use, cannot design AI-enhanced learning experiences, and cannot help students develop critical AI thinking skills.

**2. The equity gap.** Teachers in under-resourced schools — disproportionately serving students of color and low-income communities — are least likely to receive quality AI professional development. Without intervention, AI literacy becomes another axis of educational inequality.

**3. The dependency problem.** Most AI training for educators is thinly disguised product training — teaching teachers to use one specific tool rather than developing transferable skills. When tools change (and they change monthly), the training becomes worthless.

The urgency is real: AI tools are already in classrooms, being used by both teachers and students, with minimal guidance. Every month of delay compounds the gap between thoughtful AI integration and unguided experimentation.

---

## Our Solution

AI for Teachers uses AI to teach about AI — a personalized AI tutor named Skippy guides each teacher through a 7-week curriculum that builds practical AI literacy, one concrete artifact at a time.

### How It Works

**Personalized from minute one.** During a 5-minute onboarding, Skippy learns each teacher's role, grade levels, subjects, AI experience, constraints, and goals. A 3rd-grade reading teacher and a high school chemistry teacher have completely different conversations within the same curriculum framework.

**Seven weeks, seven artifacts.** Each 20-minute weekly session produces a specific, classroom-ready output:
- Week 1: An "AI Understanding Card" (mental model of how AI actually works)
- Week 2: A reusable prompt template using the 4C Framework
- Week 3: An AI-assisted lesson planning workflow
- Week 4: A feedback/rubric calibration template
- Week 5: A differentiation strategy using AI for access without reducing rigor
- Week 6: A personal AI policy — principles for when and how to use AI

**Adaptive, not scripted.** Skippy uses SOLO taxonomy to diagnose each teacher's understanding level in real time and adapts scaffolding accordingly. A teacher who already understands prompt engineering gets advanced challenges. A teacher struggling with AI limitations gets additional worked examples. This diagnostic-adaptive loop runs through an asynchronous classifier that analyzes each exchange without adding response latency.

**Builds independence, not dependency.** In every skills week, Skippy explicitly asks teachers to test their artifacts in external AI tools — ChatGPT, Gemini, Copilot — and report back. This "external testing loop" ensures teachers develop transferable skills rather than Skippy-specific habits.

### The Technology

The platform is built and functional, running on:
- **Anthropic Claude** for adaptive tutoring and async conversation classification
- **OpenAI** for voice mode (WebRTC) and personalized podcast recaps
- **Next.js + PostgreSQL** for the web application and data layer

The sophistication is in the orchestration: a 6-layer dynamic prompt system, an asynchronous conversation classifier running SOLO-based diagnostics, a phase-based state machine tracking 20+ learning dimensions, and a dual-strategy artifact extraction system. Together, these create a tutoring experience that is meaningfully adaptive — not a chatbot with a lesson plan wrapper.

---

## Why This Matters for Google.org

### 1. Responsible AI deployment at scale
AI for Teachers demonstrates how AI can be deployed responsibly in education — not replacing teachers, but empowering them. The course explicitly teaches critical evaluation of AI output, ethical considerations, and the limits of AI systems. Teachers leave not as AI enthusiasts, but as informed practitioners who can make sound judgments.

### 2. Novel application with field-building potential
While the AI-in-education space has focused almost entirely on student-facing applications, AI for Teachers addresses the upstream problem: teacher capability. The learnings from this project — how to build adaptive AI tutoring systems, how to integrate learning science frameworks with LLMs, how to measure AI literacy — are transferable to the broader field.

### 3. Equity through economics
At $8-15 per teacher for the full 7-week program, AI for Teachers costs 50-100x less than traditional PD workshops. This cost structure makes universal teacher AI literacy economically feasible for the first time — even for the most under-resourced districts.

### 4. Built on Google-adjacent technology
The platform uses Anthropic Claude for tutoring, but the external testing loop sends teachers to practice with multiple AI tools including Google's Gemini. The project is tool-agnostic by design, which aligns with Google's interest in building the AI-literate ecosystem rather than product lock-in.

---

## Impact & Measurement

### Year 1 Targets (Pilot)
- **100 teachers** across 5 NYC schools (priority: Title I schools)
- **70%+ completion rate** (vs. 30-50% typical for online PD)
- **80%+ advance** at least one SOLO taxonomy level
- **60%+ use** at least one artifact in their classroom within 30 days
- **NPS > 50** among completers

### Year 2-3 Targets (Scale)
- **5,000+ teachers** across 50+ districts nationally
- **Peer-reviewed publication** on AI-guided teacher PD outcomes
- **3+ state education agencies** recommending the program for PD credit
- **Self-sustaining revenue** from district licensing by end of Year 3

### Measurement Approach
- Pre/post SOLO taxonomy assessment (automatic, built into the platform)
- Artifact quality scoring (rubric-based, independent evaluator)
- Teacher confidence surveys (pre, post, 30/60/90 day follow-up)
- Classroom integration surveys (30/60/90 day follow-up)
- Student surveys on AI exposure (6 months post)

---

## Team

**Asher Scott, Founder** — 15+ years classroom teaching (US, Australia), Master's in Education (Finland), builder of TimeSaveAI (100+ weekly users). Rare combination of deep pedagogical expertise and AI engineering capability. Built the entire Skippy platform: 4,134 lines of curriculum prompt content, diagnostic-adaptive tutoring system, async classification, artifact extraction.

---

## Budget Summary

| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| Personnel | $180K | $250K | $350K |
| Technology (AI APIs, hosting) | $10K | $50K | $100K |
| Research & Evaluation | $23K | $40K | $30K |
| Pilot Operations | $15K | $30K | $50K |
| Dissemination | $6K | $15K | $20K |
| **Total** | **$234K** | **$385K** | **$550K** |

**3-Year Total: $1.17M**

---

## Sustainability

AI for Teachers is designed for financial sustainability by Year 3:
- **District licensing**: $5K-20K per district annually
- **Individual teacher subscriptions**: Freemium model ($49-99 for full course)
- **Advanced modules**: Subject-specific add-ons
- **Certification partnerships**: PD credit programs with state agencies

The marginal cost per teacher ($8-15) and the absence of per-teacher content creation costs create a business model that becomes profitable at modest scale (~500 paying teachers or ~20 district partnerships).
