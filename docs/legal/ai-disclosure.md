# AI Disclosure & Transparency — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

---

## Part 1: For Users (Teachers)

### How AI Powers Your Learning Experience

AI for Teachers uses artificial intelligence to provide you with a personalized professional development experience. Here's what you should know:

### What AI Does

**Skippy, Your AI Tutor**
- Skippy is powered by Claude, an AI model made by Anthropic
- Skippy engages you in conversation about using AI in your teaching practice
- Skippy personalizes responses based on your professional profile, conversation history, and your current readiness level
- Skippy helps you build practical artifacts (prompt templates, lesson outlines, feedback workflows) through guided conversation

**Readiness Assessment**
- Skippy assesses your current understanding using the SOLO taxonomy — an established educational framework — to adjust the complexity and approach of conversations
- This happens automatically during your conversations
- The assessment is used only to personalize your experience, not to evaluate you professionally

**Audio Features**
- Text-to-speech (Skippy's voice): AI converts Skippy's text responses to speech using OpenAI's TTS service
- Podcast recaps: AI generates a two-host podcast script summarizing your learning, then converts it to audio

**Artifact Extraction**
- When you complete a weekly module, AI identifies and saves useful artifacts from your conversation (templates, workflows, outlines you built together)

### What AI Does NOT Do
- Make decisions about your teaching ability or job performance
- Share your data with your school or district
- Access your students' information
- Replace professional judgment — you always decide what to use in your classroom
- Guarantee accuracy — always review AI-generated content before using it

### How to Identify AI-Generated Content
- All responses from Skippy are AI-generated
- Artifacts labeled as created during your Skippy sessions are AI-assisted (built collaboratively between you and Skippy)
- Podcast recaps are entirely AI-generated summaries of your conversations
- Your own messages and profile information are NOT AI-generated

### Your Data and AI
- Your conversation messages are sent to Anthropic's Claude API to generate responses
- Anthropic does not use your data to train AI models (per their API terms)
- Your professional profile context (role, grades, subjects, goals) is included in each request to personalize responses
- Only the last 10 messages are sent per request (not your entire history)
- See our [Privacy Policy](privacy-policy.md) for complete details

### Human Oversight
- The curriculum structure and teaching approach are designed by a human educator
- Skippy's personality, boundaries, and pedagogical framework are human-authored
- If Skippy provides inaccurate information, you can redirect the conversation
- You maintain full control over what artifacts to save and use
- You can contact a human at any time via the support form

---

## Part 2: For District Administrators & Decision-Makers

### AI Vendor Information

| Detail | Information |
|--------|------------|
| **AI Provider** | Anthropic (San Francisco, CA) |
| **AI Model** | Claude Sonnet 4 |
| **Integration** | API-based (messages API) |
| **Data Training** | API data is NOT used for model training |
| **Data Retention by Provider** | Up to 30 days for trust & safety (per Anthropic's API terms) |
| **SOC 2 Compliance** | Anthropic maintains SOC 2 Type II certification |

### Additional AI-Adjacent Services

| Service | Provider | Purpose | Data Sent |
|---------|----------|---------|-----------|
| Text-to-Speech | OpenAI | Voice output for Skippy | AI-generated text only |
| Podcast Generation | OpenAI (TTS) | Audio recaps | AI-generated scripts |
| Welcome Video | HeyGen | Personalized onboarding | Profile-derived scripts |

### Data Handling by AI Provider (Anthropic)

**What is sent to Anthropic:**
- Teacher's first name and professional context (role, grades, subjects, goals, professional constraints)
- Recent conversation messages (up to 10 per request)
- AI-assessed readiness level and session context
- Curriculum module context

**What is NOT sent to Anthropic:**
- Teacher email addresses
- Authentication credentials
- Student information (the system does not collect student data)
- School or district identifying information
- Other teachers' data

**Anthropic's data commitments (per API terms):**
- Does not use API customer data to train models
- May retain inputs/outputs for up to 30 days for trust and safety monitoring
- Does not share customer data with third parties for advertising
- Maintains SOC 2 Type II certification

### AI Limitations and Appropriate Use

**Known Limitations:**
- AI responses may occasionally be inaccurate, incomplete, or inappropriate
- AI cannot verify facts in real-time or access current events
- AI does not know your school's specific policies, culture, or requirements
- AI assessment of teacher readiness is an approximation, not a definitive measure
- AI cannot replace human professional development facilitators for sensitive topics

**Appropriate Use:**
- Professional development in AI literacy for teachers
- Building practical classroom artifacts (prompt templates, lesson structures)
- Exploring AI concepts in a safe, guided environment

**NOT Appropriate for:**
- Evaluating teacher performance
- Making employment decisions based on AI assessments
- Replacing required district professional development programs (unless approved)
- Processing student data or student-facing applications

### Human Review Processes

| Area | Human Oversight |
|------|----------------|
| Curriculum design | All module content, learning objectives, and pedagogical approach designed by human educator |
| AI system prompt | Skippy's behavior, personality, and boundaries authored and maintained by human |
| Assessment framework | SOLO taxonomy application reviewed by human educator |
| Content moderation | [TODO: Define process for reviewing flagged conversations] |
| Incident response | Human-led process for data incidents (see [Incident Response Plan](incident-response.md)) |

### Compliance Posture

| Requirement | Status |
|------------|--------|
| FERPA | No student data collected; teachers advised not to share student PII |
| COPPA | Not applicable — Service is for adult teachers, not children |
| NY Ed Law 2-d | No student data processed; teacher data handled per Privacy Policy |
| AI Transparency | This disclosure document; in-app AI notices |
| Data Portability | [TODO: Implement data export] |
| Data Deletion | Supported via cascading database deletes; [TODO: User-facing UI] |

### Questions for Your Review

Before approving AI for Teachers for your district, consider:

1. Does your district policy require additional AI vendor vetting beyond what's provided here?
2. Do your teachers need explicit district permission to use AI-powered professional development tools?
3. Does your district require a formal Data Processing Agreement? (See our [DPA template](data-processing-agreement.md))
4. Are there specific data residency requirements for your district?
5. Does your district have a policy on AI-generated content in professional development?

---

## Part 3: In-App Disclosure Language

### Suggested UI Text for Skippy Chat Interface

**First-time notice (before first conversation):**

> Skippy is an AI tutor powered by Claude (by Anthropic). Your messages are processed by AI to generate personalized responses. Your professional profile and conversation history are used to tailor your learning experience. AI-generated content should be reviewed before use in your classroom. See our [Privacy Policy] and [AI Disclosure] for details.
>
> [ ] I understand that Skippy is an AI tutor and that my conversations will be processed by Anthropic's Claude AI.
>
> [Continue]

**Persistent footer in chat:**

> Skippy is AI-powered. Responses may be inaccurate. Review before classroom use.

**On artifacts page:**

> These artifacts were created collaboratively with Skippy (AI). Review and adapt them for your specific classroom context before use.

**On podcast page:**

> This podcast was generated entirely by AI based on your conversation. It is a creative summary, not a transcript.

---

*This AI Disclosure was last reviewed on [DATE].*
