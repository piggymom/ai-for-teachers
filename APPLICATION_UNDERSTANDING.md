# APPLICATION_UNDERSTANDING.md

## 1. One-Paragraph Summary

**AI for Teachers** is a 6-week interactive professional development course that teaches K-12 educators how to use AI tools practically and safely in their classrooms. The platform features "Skippy," a personalized AI tutor powered by Claude (text) and OpenAI Realtime API (voice) that adapts to each teacher's role, subjects, grade levels, and constraints. After each week's conversation, teachers receive a personalized two-host podcast recap generated from their actual dialogue. The course emphasizes building AI literacy—not just tool usage—through a "One Win Then Wrap" pedagogical framework that guides teachers toward creating one concrete artifact (prompt, template, workflow) per session with explicit reflection for transfer. The product differentiates itself by being personalized (not generic), practical (artifacts over theory), and respectful of teacher agency (AI as assistant, not replacement).

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.3 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19.2.3, Tailwind CSS 4 |
| **Database** | PostgreSQL (Supabase) via Prisma 5.22 |
| **Authentication** | NextAuth.js 4 with Google OAuth, Prisma Adapter |
| **AI - Text** | Anthropic Claude (claude-3-haiku for tutoring, claude-sonnet-4 for podcast scripts) |
| **AI - Voice** | OpenAI Realtime API (WebRTC), OpenAI TTS-1 (podcast audio) |
| **Video Generation** | HeyGen API (personalized welcome videos) |
| **Fonts** | Geist Sans, Geist Mono |
| **Build** | Turbopack (Next.js default) |
| **Package Manager** | npm |

---

## 3. Architecture Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Landing     │  │  Onboarding  │  │  Home        │  │  Week Pages  │    │
│  │  (/)         │  │  (/onboard)  │  │  (/home)     │  │  (/week-N)   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                            │                  │             │
│                                            ▼                  ▼             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    SkippyChat Component                             │    │
│  │  ┌─────────────────┐    ┌────────────────────────────────────┐     │    │
│  │  │ Text Input      │    │ useRealtimeConnection (WebRTC)     │     │    │
│  │  └────────┬────────┘    │  - Voice input/output              │     │    │
│  │           │             │  - Real-time transcription         │     │    │
│  │           │             └───────────────┬────────────────────┘     │    │
│  └───────────┼─────────────────────────────┼──────────────────────────┘    │
└──────────────┼─────────────────────────────┼────────────────────────────────┘
               │                             │
               ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API ROUTES (Server)                                │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ /api/skippy  │  │ /api/realtime│  │ /api/podcast │  │ /api/welcome │    │
│  │  - start_week│  │   /token     │  │  - Generate  │  │   -video     │    │
│  │  - message   │  │  - Ephemeral │  │    script    │  │  - HeyGen    │    │
│  │  - end_week  │  │    keys      │  │  - TTS audio │  │    video gen │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         ▼                 ▼                 ▼                 ▼             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                        lib/ (Business Logic)                        │    │
│  │  skippy.ts, modules.ts, profile.ts, progress.ts, auth.ts           │    │
│  └─────────────────────────────────┬──────────────────────────────────┘    │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────┐
    │                                ▼                                │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
    │  │  Supabase    │  │  Anthropic   │  │  OpenAI      │          │
    │  │  PostgreSQL  │  │  Claude API  │  │  Realtime/   │          │
    │  │              │  │              │  │  TTS APIs    │          │
    │  └──────────────┘  └──────────────┘  └──────────────┘          │
    │                                                                 │
    │  ┌──────────────┐                                              │
    │  │  HeyGen API  │                                              │
    │  │  (Video Gen) │                                              │
    │  └──────────────┘                                              │
    │                         EXTERNAL SERVICES                       │
    └─────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### Prisma Schema Entities

```
User (NextAuth)
├── id: String (cuid)
├── name, email, emailVerified, image
├── accounts: Account[]
├── sessions: Session[]
├── progress: Progress[]
├── profile: UserProfile?
└── skippyMessages: SkippyMessage[]

UserProfile (Onboarding Data)
├── role: String (Classroom teacher, Special education, etc.)
├── roleOther: String?
├── gradeLevels: String[] (PreK, K, 1-2, 3-5, 6-8, 9-12, Higher Ed)
├── subjects: String[] (user-entered tags)
├── schoolContext: String?
├── aiExperienceLevel: String (new | some | advanced)
├── constraints: String?
├── biggestTimeDrains: String[] (Lesson planning, Differentiation, etc.)
├── goals: String
├── successLooksLike: String?
└── tonePreference: String? (direct | supportive | collaborative | no-fluff)

Progress (Week Completion)
├── userId: String
├── weekNumber: Int (0-6)
└── status: String (not_started | in_progress | completed)

SkippyMessage (Conversation History)
├── userId: String
├── week: Int
├── role: String (user | assistant)
├── content: String (Text)
└── createdAt: DateTime

Account, Session, VerificationToken (NextAuth standard)
```

### Key Relationships
- User 1:1 UserProfile (onboarding creates profile)
- User 1:N Progress (one record per week)
- User 1:N SkippyMessage (all conversation history)

---

## 5. Core Flows

### Flow 1: First-Time User Onboarding
1. User lands on `/` → sees landing page with "Sign in with Google"
2. Google OAuth → NextAuth creates User record
3. Redirect to `/home` → `RequireProfile` middleware checks for profile
4. No profile → redirect to `/onboarding`
5. 4-step form collects: role, grades, subjects, school context, AI experience, constraints, goals, tone preference
6. Server action `saveOnboardingProfile()` creates UserProfile
7. Redirect to `/home` → WelcomeVideo component triggers HeyGen video generation
8. Dashboard shows all 7 weeks (0-6) with completion status

### Flow 2: Weekly Conversation with Skippy
1. User clicks week card → navigates to `/week-N`
2. `SkippyChat` component loads, calls `POST /api/skippy` with `event: start_week`
3. API returns: systemPrompt (global + module + profile context), conversation history
4. Component connects to OpenAI Realtime API via WebRTC (gets ephemeral token from `/api/realtime/token`)
5. For new conversations, `triggerResponse()` generates opening message
6. User types or speaks → messages sent via WebRTC data channel
7. Skippy responds with voice + transcript, streamed to UI
8. Messages saved to database via `save_message` event
9. User clicks "Complete & Return" → `end_week` event marks week completed
10. Redirect to `/home`

### Flow 3: Podcast Generation
1. User navigates to `/week-N/takeaways`
2. `PodcastPlayer` component renders
3. User clicks "Generate Audio Summary"
4. `POST /api/podcast` with week number
5. API fetches: conversation history, user profile, module context
6. Claude Sonnet generates 16-22 exchange script for two hosts (Sam & Alex)
7. OpenAI TTS generates audio for each segment (batched 3 at a time)
8. Audio buffers concatenated and returned as MP3
9. Client caches and plays audio with progress controls

### Flow 4: Welcome Video Generation
1. After onboarding, `WelcomeVideo` component checks `/api/welcome-video`
2. If profile exists but no cached video → `POST` to generate
3. API generates personalized script using profile data (name, role, grades, goals)
4. HeyGen API creates avatar video with script
5. Component polls for completion every 5 seconds
6. When ready, video URL cached (24h TTL) and displayed with play button

### Flow 5: Progress Tracking (Hybrid)
1. Authenticated users: progress stored in PostgreSQL via `/api/progress`
2. Unauthenticated users: progress stored in localStorage
3. `useCompletionState` hook uses `useSyncExternalStore` for reactive updates
4. Cross-tab sync via custom `ai4t-storage` event
5. Fallback to localStorage if API fails

---

## 6. AI Integration Points

### 6.1 Skippy Text Conversations (Claude Haiku)
**Location:** `app/api/skippy/route.ts`, `lib/skippy.ts`

**Prompt Structure:**
```
GLOBAL SYSTEM PROMPT (lib/skippy.ts:9-107)
├── Personality: "Warm British sensibility, knowledgeable, curious, direct"
├── Conversation Arc: "ONE WIN, THEN WRAP"
│   ├── DISCOVER → BUILD → REFINE → REFLECT → SAVE → BRIDGE
├── Response Style: 2-4 sentences, no filler, use teacher's specifics
├── When to Teach vs Ask: Direct answers for direct questions, questions for personalization
└── Wrap-up Protocol: Reflection question → Present artifact → Bridge forward

+ MODULE PROMPT (lib/modules.ts)
├── Week-specific focus and learning objectives
└── Personalized opening message template

+ PROFILE CONTEXT (lib/profile.ts)
├── Teacher: [role], grades [X]
├── Subjects: [list]
├── AI experience: [level]
├── Constraints: [text]
├── Biggest time drains: [list]
├── Goals: [text]
└── Tone preference: [type]
```

**Model:** `claude-3-haiku-20240307`
**Parameters:** max_tokens=300, temperature=0.7
**History Limit:** Last 10 messages only (latency optimization)

### 6.2 Skippy Voice Conversations (OpenAI Realtime)
**Location:** `app/api/realtime/token/route.ts`, `lib/useRealtimeConnection.ts`

**Flow:**
1. Server generates ephemeral client secret with session config
2. Session includes full Skippy system prompt
3. Client establishes WebRTC connection to OpenAI
4. Voice: "sage" (configurable)
5. Manual turn detection (user controls recording)
6. Whisper transcription of user speech
7. Transcripts saved to database for podcast generation

### 6.3 Podcast Script Generation (Claude Sonnet)
**Location:** `app/api/podcast/route.ts`

**Two Prompt Types:**

**Intro Week (Week 0):**
- Two hosts: Sam (warm, curious) and Alex (connector, sees patterns)
- Structure: Open with story → Reflect what they shared → Deeper why → What's ahead → Close with confidence
- Must quote teacher 2-3 times, connect to 2-3 course weeks

**Standard Weeks (1-6):**
- Structure: Hook → Celebrate wins → Consolidate learning → Connect to goals → Preview next week
- Must quote 3+ things, name 2+ key concepts, preview next week
- End with energy and forward momentum

**Model:** `claude-sonnet-4-20250514`
**Output:** A:/B: formatted script, 16-22 exchanges

### 6.4 Podcast Audio (OpenAI TTS)
**Location:** `app/api/podcast/route.ts`

**Model:** `tts-1`
**Voices:**
- Host A (Sam): `nova` (warm, friendly)
- Host B (Alex): `onyx` (deeper, authoritative)

**Process:** Batch 3 segments at a time, concatenate MP3 buffers

### 6.5 Welcome Video (HeyGen)
**Location:** `app/api/welcome-video/route.ts`

**Script Generation:** Template-based using profile data
**Avatar:** Configurable via `HEYGEN_AVATAR_ID`
**Voice:** Configurable via `HEYGEN_VOICE_ID`
**Resolution:** 1280x720

---

## 7. Domain Knowledge Embedded

### 7.1 Pedagogical Framework: "One Win, Then Wrap"
A structured conversation arc designed for effective tutoring:
1. **DISCOVER** - Understand challenge/goal
2. **BUILD** - Collaborate on ONE concrete output
3. **REFINE** - Iterate for specific context
4. **REFLECT** - Articulate learning about AI (metacognition)
5. **SAVE** - Present artifact for reuse
6. **BRIDGE** - Connect to next topic

### 7.2 The 4C Prompting Framework (Week 2)
- **Context**: Background information
- **Constraints**: Limitations and requirements
- **Command**: The specific task
- **Criteria**: Success measures

### 7.3 AI Literacy Principles
- AI predicts patterns, doesn't understand meaning
- "Fast assistant, not source of truth"
- Teachers maintain pedagogical ownership
- Quality control: accept, edit, or reject AI output

### 7.4 Teacher Time Drain Categories
Predefined list reflecting common pain points:
- Lesson planning, Differentiation, Feedback
- IEP/admin paperwork, Family communications
- Assessment design, Classroom management, Data analysis

### 7.5 6-Week Curriculum Progression
| Week | Focus | Outcome |
|------|-------|---------|
| 0 | Getting Started | Course orientation, expectations |
| 1 | Understanding AI | Foundations, guardrails, mental model |
| 2 | Prompting Fundamentals | 4C framework mastery |
| 3 | Lesson Planning | AI as brainstorming partner |
| 4 | Feedback & Assessment | Draft feedback workflows |
| 5 | Communication & Admin | Email templates, newsletters |
| 6 | Building Your Practice | Sustainable 2-3 workflow integration |

---

## 8. Current Gaps & Opportunities

### Missing Features
1. **No test coverage** - No test files found (`*.test.*`, `*.spec.*`)
2. **No error boundary** - Client errors could crash the app
3. **No offline support** - Requires internet for all AI features
4. **No edit profile** - Users can't update onboarding answers
5. **No conversation export** - Can't download conversation history
6. **No admin dashboard** - No way to see aggregate user data

### Technical Debt
1. **In-memory caching** - Podcast and video caches use `Map`, lost on restart
   - `podcastCache` in `/api/podcast` (1h TTL)
   - `videoCache` in `/api/welcome-video` (24h TTL)
   - Should use Redis or database

2. **MP3 concatenation** - Simple buffer concat, comment notes "use ffmpeg for production"

3. **Missing Week 0 in localStorage** - `useCompletionState.ts` only has keys for weeks 1-6

4. **Unused prisma import** - `app/api/welcome-video/route.ts:5` imports `prisma` but doesn't use it

5. **Session strategy mismatch potential** - Using database sessions with pooled connections could cause issues under load

### Hardcoded Values
- `MAX_HISTORY_MESSAGES = 10` (lib/skippy conversation context limit)
- `SKIPPY_MAX_TOKENS = 300` (response length)
- `REALTIME_VOICE = "sage"` (could be user preference)
- `BATCH_SIZE = 3` (TTS generation batching)
- Week numbers hardcoded throughout (0-6)

### Security Considerations
- RLS not enabled on Supabase tables (as seen in linter warnings)
- API keys in `.env.local` - standard but noted
- No rate limiting on AI endpoints

### UX Opportunities
1. Conversation can feel open-ended - wrap-up triggers could be more explicit
2. No way to skip weeks or see progress preview
3. Podcast generation is slow (~30s) with no progress indicator
4. Voice recording has no visual waveform feedback

---

## 9. Key Files Index

### Core Logic
| File | Description |
|------|-------------|
| `lib/skippy.ts` | Global Skippy system prompt, conversation history, context building |
| `lib/modules.ts` | Week-specific prompts and opening messages (0-6) |
| `lib/profile.ts` | User profile CRUD and context string generation |
| `lib/progress.ts` | Week completion tracking |
| `lib/auth.ts` | NextAuth configuration with Google + Prisma adapter |
| `lib/useRealtimeConnection.ts` | OpenAI Realtime WebRTC hook |
| `lib/useCompletionState.ts` | Hybrid progress tracking (API + localStorage) |

### API Routes
| File | Description |
|------|-------------|
| `app/api/skippy/route.ts` | Main conversation API (start, message, end, save) |
| `app/api/realtime/token/route.ts` | Mints ephemeral keys for OpenAI Realtime |
| `app/api/podcast/route.ts` | Generates personalized podcast scripts + audio |
| `app/api/welcome-video/route.ts` | HeyGen video generation and status polling |
| `app/api/progress/route.ts` | Progress persistence for authenticated users |

### Components
| File | Description |
|------|-------------|
| `app/components/skippy-chat.tsx` | Main conversation UI with text/voice input |
| `app/components/podcast-player.tsx` | Audio player with generate/regenerate |
| `app/components/welcome-video.tsx` | Video player with generation status |
| `app/components/require-profile.tsx` | Server component for onboarding gate |
| `app/components/auth-button.tsx` | Sign in/out button |

### Pages
| File | Description |
|------|-------------|
| `app/page.tsx` | Landing page for unauthenticated users |
| `app/onboarding/page.tsx` | 4-step profile collection form |
| `app/home/page.tsx` | Dashboard with week cards and progress |
| `app/week-N/page.tsx` | Skippy chat for each week |
| `app/week-N/takeaways/page.tsx` | Summary content + podcast player |

### Configuration
| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Database schema (User, Profile, Progress, Messages) |
| `.env.local` | Environment variables (API keys, database URL) |
| `package.json` | Dependencies and scripts |

---

## 10. Questions for the Developer

1. **Caching strategy**: Is Redis planned for production, or should I implement database-backed caching for podcasts/videos?

2. **Week 0 progress**: The localStorage fallback doesn't track Week 0 completion. Is this intentional?

3. **Conversation length**: What's the expected typical conversation length? The 10-message history limit may truncate important context.

4. **Voice preference**: Should users be able to choose Skippy's voice? Currently hardcoded to "sage".

5. **Multi-tenancy**: Is this a single-tenant app (one school/organization) or multi-tenant? This affects data isolation needs.

6. **Podcast regeneration**: When a user regenerates a podcast, should the previous version be preserved? Currently overwrites cache.

7. **Profile editing**: Is editing the onboarding profile a planned feature, or is it intentionally one-time?

8. **Offline mode**: Any plans for offline capability? Some teachers may have unreliable internet.

9. **Analytics**: What metrics matter most? User engagement, completion rates, time spent, conversation quality?

10. **HeyGen cost**: Videos are generated per-user. Is there a budget cap or fallback for video generation failures?

---

*Generated: 2026-02-04*
*Codebase version: commit 6539a54*
