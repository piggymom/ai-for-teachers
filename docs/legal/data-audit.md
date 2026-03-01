# Data Audit — AI for Teachers (Skippy)

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Audit Date:** March 2026
**Auditor:** Automated (requires professional review)
**Application:** AI for Teachers — Skippy AI Tutor
**Tech Stack:** Next.js 16, Supabase (PostgreSQL), Vercel, Anthropic Claude API, OpenAI TTS API

---

## 1. Data Collection Summary

| Data Type | Collected? | Stored Where | Sent Externally | Retention | Sensitivity |
|-----------|------------|--------------|-----------------|-----------|-------------|
| Teacher name | Yes | Supabase (User table) | Anthropic (in system prompt context) | Indefinite | Medium |
| Teacher email | Yes | Supabase (User table) | No | Indefinite | Medium |
| Profile image URL | Yes | Supabase (User table, URL only — image hosted by Google) | No | Indefinite | Low |
| Google OAuth tokens | Yes | Supabase (Account table) | No | Indefinite | **Critical** |
| Session tokens | Yes | Supabase (Session table) | No | Until expiry | High |
| Teaching role | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Medium |
| Grade levels taught | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Low |
| Subjects taught | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Low |
| AI experience level | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Low |
| Personal constraints/concerns | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | **High** |
| Biggest time drains | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Medium |
| Professional goals + details | Yes | Supabase (UserProfile) | Anthropic (in system prompt) | Indefinite | Medium |
| Conversation messages (user) | Yes | Supabase (SkippyMessage) | Anthropic (last 10 per request) | Indefinite | **High** |
| Conversation messages (AI) | Yes | Supabase (SkippyMessage) | Anthropic (last 10 per request) | Indefinite | Medium |
| Diagnostic readiness level | Yes | Supabase (ConversationLedger) | Anthropic (in system prompt) | Indefinite | **High** |
| Diagnostic evidence/quotes | Yes | Supabase (ConversationLedger) | Anthropic (in system prompt) | Indefinite | **High** |
| Identified misconceptions | Yes | Supabase (ConversationLedger) | Anthropic (in system prompt) | Indefinite | **High** |
| Session summary | Yes | Supabase (ConversationLedger) | Anthropic (in system prompt) | Indefinite | Medium |
| Engagement energy level | Yes | Supabase (ConversationLedger) | Anthropic (in system prompt) | Indefinite | Medium |
| Conversation phase tracking | Yes | Supabase (ConversationLedger) | No | Indefinite | Low |
| Artifacts (prompts, templates) | Yes | Supabase (Artifact) | Anthropic (during extraction) | Indefinite | Medium |
| Week progress status | Yes | Supabase (Progress) | No | Indefinite | Low |
| Contact form submissions | Yes | Console logs + email (Resend) | Resend email API | Indefinite (logs) | Medium |
| IP addresses | No (not explicitly collected) | Vercel logs (hosting) | No | Per Vercel policy | Low |
| Usage analytics | No | N/A | N/A | N/A | N/A |
| Student PII | **No** | N/A | N/A | N/A | N/A |
| Payment/financial data | No | N/A | N/A | N/A | N/A |
| File uploads | No | N/A | N/A | N/A | N/A |

---

## 2. External Services & Data Transmission

### 2.1 Anthropic (Claude API)

| What is sent | When | Volume |
|-------------|------|--------|
| System prompt containing: teacher name, role, grades, subjects, AI experience, constraints, goals, goal details, diagnostic level, misconceptions, session summary, engagement signals | Every user message | ~3,000–5,000 tokens |
| Last 10 conversation messages (user + assistant) | Every user message | Variable |
| Full conversation history | Podcast generation, artifact extraction | Full history |
| Week/module context and learning objectives | Every user message | ~500 tokens |

**Anthropic Data Policy:** Per Anthropic's API terms, data sent via the API is not used to train models. Anthropic may retain API inputs/outputs for up to 30 days for trust & safety purposes.

**Model used:** `claude-sonnet-4-20250514`

### 2.2 OpenAI (TTS & Realtime)

| What is sent | When | Volume |
|-------------|------|--------|
| AI-generated text (Skippy responses) | TTS requests | Single response text |
| Podcast script segments | Podcast generation | ~16–22 dialogue segments |
| System prompt (for realtime voice) | Voice session start (currently disabled) | Full system prompt |

**Note:** Only AI-generated text is sent to OpenAI TTS, not raw user messages. However, the podcast generation sends scripts derived from conversation content.

### 2.3 HeyGen (Video Generation)

| What is sent | When | Volume |
|-------------|------|--------|
| Personalized welcome script (derived from user profile) | Welcome video generation | Single script |

### 2.4 Resend (Email)

| What is sent | When | Volume |
|-------------|------|--------|
| Contact form: name, email, message, user ID | Contact form submission | Per submission |

### 2.5 Google (OAuth)

| What is sent | When | Volume |
|-------------|------|--------|
| OAuth authorization requests | Login | Per sign-in |

### 2.6 Vercel (Hosting)

| What is sent | When | Volume |
|-------------|------|--------|
| All HTTP requests/responses pass through Vercel | Every request | All traffic |
| Server logs (including console.log output) | Runtime | Continuous |

### 2.7 Supabase (Database)

| What is stored | Encryption | Access |
|----------------|-----------|--------|
| All application data (users, messages, profiles, artifacts, ledgers) | Encrypted at rest (Supabase default) | Via DATABASE_URL connection string |

---

## 3. Data Flow Diagram

```
Teacher (Browser)
    │
    ├── Google OAuth ──→ Google (authentication)
    │                       │
    │                       ▼
    │               Supabase (User, Account, Session tables)
    │
    ├── Onboarding Form ──→ Supabase (UserProfile table)
    │
    ├── Chat Message ──→ Vercel (Next.js API Route)
    │                       │
    │                       ├──→ Supabase (SkippyMessage: save user msg)
    │                       │
    │                       ├──→ Anthropic Claude API
    │                       │       (system prompt + last 10 messages)
    │                       │       │
    │                       │       ▼
    │                       │    AI Response
    │                       │       │
    │                       ├──→ Supabase (SkippyMessage: save AI msg)
    │                       │
    │                       └──→ Supabase (ConversationLedger: async update)
    │                               (fires separate Claude call for classification)
    │
    ├── Podcast Request ──→ Anthropic Claude (full history → script)
    │                       └──→ OpenAI TTS (script → audio)
    │
    ├── TTS Request ──→ OpenAI TTS (AI text → audio)
    │
    ├── Welcome Video ──→ HeyGen (profile-derived script → video)
    │
    └── Contact Form ──→ Resend (email to support)
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### Tables and Record Counts

| Table | Purpose | Key Fields | Cascading Delete? |
|-------|---------|------------|-------------------|
| User | Core user record | id, name, email, image | Yes (deletes all related) |
| Account | OAuth credentials | provider, tokens, userId | Yes (on user delete) |
| Session | Active sessions | sessionToken, expires | Yes (on user delete) |
| VerificationToken | Email verification | identifier, token, expires | N/A |
| UserProfile | Onboarding data | role, grades, subjects, goals, constraints | Yes (on user delete) |
| SkippyMessage | Chat history | week, role, content | Yes (on user delete) |
| ConversationLedger | Session state/assessment | phase, diagnostic level/evidence, misconceptions, engagement | Yes (on user delete) |
| Artifact | Extracted outputs | title, type, content, tags | Yes (on user delete) |
| Progress | Week completion | weekNumber, status | Yes (on user delete) |

---

## 5. Console Logging (Server-Side)

The application logs extensively to `console.log`, which is captured by Vercel's logging infrastructure:

| What is logged | Sensitivity | Location |
|----------------|-------------|----------|
| User IDs (full and partial) | Medium | All API routes |
| Message content previews (first 100–500 chars) | **High** | `/api/skippy` |
| Diagnostic levels and evidence | **High** | Ledger classifier |
| System prompt previews | Medium | `/api/skippy` |
| API timing/latency metrics | Low | All API routes |
| Ledger state changes | Medium | Ledger updates |
| Contact form submissions (name, email, message) | **High** | `/api/contact` |
| Cache hit/miss data | Low | TTS, podcast |

**Concern:** Console logs in Vercel are retained per Vercel's log retention policy and may contain sensitive user data. These are accessible to project owners via Vercel dashboard.

---

## 6. Security Assessment

### Current Strengths
- Authentication required on nearly all endpoints
- Data scoped to authenticated userId (no cross-user access)
- Cascading deletes enabled (user deletion removes all data)
- TTS text sanitized to prevent prompt injection
- Debug endpoints restricted to development environment
- No third-party analytics or tracking scripts
- No student data collected directly

### Critical Concerns

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 1 | OAuth tokens stored as plaintext TEXT in database | **Critical** | Implement field-level encryption for refresh_token, access_token, id_token |
| 2 | No data retention policy — all data kept indefinitely | **High** | Define retention periods, implement automated purging |
| 3 | Console logs contain sensitive user data (message previews, diagnostics) | **High** | Sanitize logs in production; remove message content from logs |
| 4 | No rate limiting on API routes | **High** | Add rate limiting middleware (especially `/api/skippy`) |
| 5 | Diagnostic assessment data (SOLO taxonomy levels, misconceptions) is highly sensitive | **High** | Ensure this data is clearly disclosed; consider whether it should be deletable |
| 6 | No middleware-level route protection | Medium | Add Next.js middleware for auth checks |
| 7 | `/api/stats/participants` endpoint has no authentication | Medium | Consider whether participant count should be public |
| 8 | No data export functionality (for user data portability) | Medium | Implement "Download My Data" feature |
| 9 | No account deletion UI (cascading deletes exist but no user-facing trigger) | Medium | Add account deletion option in settings |
| 10 | Teacher profile context sent to Anthropic includes personal constraints/concerns | Medium | Disclose in privacy policy; consider opt-out |

---

## 7. FERPA Considerations

**Direct student data:** The application does not collect student PII. Users are teachers, not students.

**Indirect student data risk:** Teachers may discuss specific students in conversation with Skippy. This content would be:
- Stored in SkippyMessage table
- Sent to Anthropic Claude API
- Potentially logged in console output
- Included in podcast generation

**Recommendation:** Add clear guidance discouraging teachers from sharing student names or identifiable information in conversations. Consider implementing a content filter or reminder.

---

## 8. Data Subject Rights

| Right | Currently Supported? | Implementation Needed |
|-------|---------------------|----------------------|
| Right to access data | No | Build data export endpoint |
| Right to correct data | Partial (profile editable) | Extend to conversation data |
| Right to delete data | Schema supports (cascade) | Build user-facing deletion UI |
| Right to data portability | No | Build data export in standard format |
| Right to withdraw consent | No | Build consent withdrawal flow |
| Right to restrict processing | No | Build opt-out mechanisms |

---

## 9. Recommended Priority Actions

1. **Immediate:** Add privacy policy and terms of service links to signup flow
2. **Immediate:** Add AI disclosure in Skippy chat interface
3. **Before pilot:** Define and implement data retention policy
4. **Before pilot:** Sanitize production console logs
5. **Before pilot:** Add rate limiting to API routes
6. **Before pilot:** Implement consent recording mechanism
7. **Short-term:** Build data export and account deletion features
8. **Short-term:** Add guidance about not sharing student PII in conversations
9. **Medium-term:** Implement field-level encryption for sensitive data
10. **Medium-term:** Engage legal counsel for formal review
