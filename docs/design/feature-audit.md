# Feature Audit — AI for Teachers

*Last updated: 2026-03-01 | Based on full codebase + UX audit*

## Feature Status Matrix

| Feature | Status | Completeness | Quality | Priority to Fix |
|---------|--------|--------------|---------|-----------------|
| Week 0: Onboarding | Live | 95% | Good | Low |
| Week 1: AI Understanding | Live | 90% | Good | Low |
| Week 2: Prompting (4C) | Live | 90% | Strong | Low |
| Week 3: Lesson Planning | Live | 60% | Needs Work | High |
| Week 4: Feedback & Assessment | Live | 60% | Needs Work | High |
| Week 5: Differentiation | Live | 50% | **Broken** | Critical |
| Week 6: Integration & Ethics | Live | 55% | Needs Work | High |
| Skippy Text Chat | Live | 75% | Good | High |
| Skippy Voice Mode | Disabled | 70% | Untested | Low |
| Ledger/Classifier System | Live | 85% | Strong | Medium |
| Podcast Generation | Live | 75% | MVP | High |
| Welcome Video (HeyGen) | Live | 70% | MVP | Medium |
| Artifact Gallery | Live | 65% | MVP | High |
| Progress Tracking | Live | 80% | Good | Medium |
| Authentication (Google SSO) | Live | 95% | Good | Low |
| Dashboard/Home | Live | 75% | Good | Medium |
| Profile Management | Partial | 40% | Poor | High |
| Error Handling | Missing | 15% | Poor | **Critical** |
| Streaming Responses | Missing | 0% | N/A | **Critical** |
| Analytics/Admin | Missing | 0% | N/A | Medium |

---

## Detailed Feature Assessment

### Week 0: Onboarding (95% — Good)

**What works well:**
- Clean 3-step form flow (role → context → goals)
- Captures rich teacher context that feeds every subsequent interaction
- RequireProfile middleware gate ensures no one skips it
- Field-level validation with error messages
- Subject tag management with add/remove UI

**What's missing:**
- No ability to edit profile after submission (write-once — no `updateProfile()` function exists in `lib/profile.ts`)
- No "preview what you entered" confirmation step before saving
- No back button navigation in form steps
- No success confirmation before redirect to `/home`

---

### Weeks 1-2: Foundation Weeks (90% — Good to Strong)

**What works well:**
- Deeply researched pedagogical design (SOLO taxonomy, scaffolded progression)
- Each week builds explicitly on prior weeks
- Worked examples in prompts give Claude clear behavioral models
- 4C framework in Week 2 is exceptionally well-scaffolded with multiple worked examples
- Sticky 4C booleans provide reliable skill tracking

**What's missing:**
- No way to preview week content before starting
- No estimated time per week shown to user
- No progress indicator within a conversation

---

### Weeks 3-6: Skills Weeks (50-60% — Needs Work)

**CRITICAL BUG (Week 5):** `progressions.ts` defines Week 5 as "Communication & Admin" instead of "Differentiation with AI" — wrong diagnostic descriptors are injected into the classifier, producing incorrect level assessments.

**What needs work (per fix specs in `/docs/`):**
- **Week 3:** Iteration/chunking mentioned but not taught; no worked examples; no prior-week callbacks
- **Week 4:** Calibration is 1 paragraph; no worked examples; no connection to Week 3's iteration moves
- **Week 5:** Topic mismatch bug; no worked examples; VARIATION not taught; no level calibration
- **Week 6:** Questionnaire → checklist model (too passive); no capacity testing; no stress-test scenarios

**What's missing across all:**
- Worked examples at each SOLO level (3+ per week, per fix specs)
- Prior-week skill integration (each week should build on previous frameworks)
- Level-calibrated scaffolding (pre-structural needs explicit modeling; relational+ needs peer mode)
- External testing loop could lose engagement if not carefully orchestrated

**Fix specs exist** at `docs/week-3-fix-spec.md` through `docs/week-6-fix-spec.md` with detailed requirements. These represent substantial curriculum rewrites (~30-50% of prompt content per week).

---

### Skippy Text Chat (75% — Good)

**What works well:**
- 6-layer prompt composition is sophisticated and effective
- Last-10-messages windowing keeps latency manageable
- Timing instrumentation provides observability
- Completion detection ("I'm done") prevents over-tutoring
- 3-strike frustration protocol for graceful exits
- Consent flow gates first use appropriately

**What needs work:**
- **No streaming responses** — full response loads at once after 3-8 seconds of dead silence
- No "Skippy is thinking..." skeleton state (only shows "Thinking..." text)
- No retry mechanism if Claude call fails — user hits a dead end
- No markdown rendering in chat messages
- `confirm()` dialog for "Finish Session" is unprofessional — should be a modal

**What's missing:**
- No conversation export (download as PDF/text)
- No explicit session timeout handling
- No rate-limit feedback to user (just generic error)
- Mobile: phase indicator hidden, no alternative

---

### Skippy Voice Mode (70% — Disabled)

**What works well:**
- Architecture is solid (WebRTC → OpenAI Realtime API)
- Same 6-layer prompt system as text
- Transcripts saved to same database as text messages

**What needs work:**
- Feature-flagged off (`VOICE_ENABLED = false`)
- No visual feedback during recording (no waveform)
- No fallback if WebRTC connection fails
- Voice hardcoded to "sage" — no user preference

**What's missing:**
- No voice/text toggle during conversation
- No transcript display alongside voice
- No "say that again" or playback of assistant responses

**Recommendation:** Defer until text experience is bulletproof. Voice is a "wow" feature but text is the core.

---

### Ledger/Classifier System (85% — Strong)

**What works well:**
- Zero-latency async design (fire-and-forget after response)
- Sticky booleans prevent regression from classifier noise
- Phase-based state machine provides clear conversation arc (DISCOVER → BUILD → REFINE → REFLECT → SAVE → BRIDGE)
- Rich context injection back into prompts
- 3-exchange limit before forcing wrap-up prevents session overshoot

**What needs work:**
- Classifier sometimes misreads energy/engagement
- Phase transitions could be more granular
- Complex JSON parsing with regex fallback (fragile at edges)
- Debug panel exists but is dev-only
- Fetches after every single message (could be optimized)

**What's missing:**
- No ledger visualization for users (they can't see phase progress — only the simplified 4-dot indicator)
- No historical ledger data across sessions
- No manual phase override for edge cases

---

### Podcast Generation (75% — MVP)

**What works well:**
- Two-host format with distinct personalities (Sam: warm/curious, Alex: connector/pattern-spotter)
- Personalized to actual conversation content
- Quoting teacher directly creates emotional connection
- Two prompt types: intro week vs. standard weeks

**What needs work:**
- **~30 second generation time with zero progress feedback** — users think it's broken
- Simple MP3 buffer concatenation (comment says "use ffmpeg for production")
- In-memory cache lost on every Vercel deploy
- No error type distinction (network vs. generation failure)

**What's missing:**
- No download button for podcast audio
- No transcript display alongside audio
- No playback speed control
- No skip forward/back controls
- No generation progress steps ("Generating script... Creating audio segment 3/12...")

---

### Welcome Video — HeyGen (70% — MVP)

**What works well:**
- Personalized script from teacher profile
- Avatar adds a human touch to onboarding

**What needs work:**
- 5-second polling interval with **no timeout** — if HeyGen fails, polls forever (memory leak)
- In-memory cache lost on server restart
- No error recovery if HeyGen is down
- Unused Prisma import in route file

**What's missing:**
- No fallback if HeyGen is down (should show text welcome instead)
- No option to regenerate
- Cache should be persistent (database or storage)

---

### Artifact Gallery (65% — MVP)

**What works well:**
- Dual extraction strategy (regex first, Claude Haiku fallback) — cost-efficient
- Metadata generation (title, description, tags)
- Card-based responsive layout
- Expandable/collapsible content
- Copy-to-clipboard with success feedback

**What needs work:**
- No editing artifacts after extraction
- Gallery layout is basic — no visual differentiation between types
- `<pre>` tag for content doesn't wrap well on mobile
- No pagination (all artifacts loaded at once)

**What's missing:**
- No export (PDF, Google Doc)
- No sharing artifacts with colleagues
- No search/filter across artifacts
- No "use this artifact" flow to bring it back into a conversation
- Gallery is below the fold on dashboard — easy to miss

---

### Progress Tracking (80% — Good)

**What works well:**
- Hybrid API + localStorage architecture is resilient
- Cross-tab sync via custom events
- `useSyncExternalStore` for reactive updates
- Visual progress journey on dashboard (7 dots)

**What needs work:**
- Week 0 not tracked in localStorage version (known bug)
- No partial progress within a week (just not_started/in_progress/completed)
- No "resume where I left off" within a conversation

**What's missing:**
- No time-spent tracking
- No streak/engagement metrics
- No completion certificate or badge

---

### Dashboard/Home (75% — Good)

**What works well:**
- Contextual header (first visit vs. returning user)
- Skeleton loading state matches final layout
- Auto-scroll to completed week

**What needs work:**
- **Profile data hardcoded** — `primaryGoal: "save_time"` and empty `biggestTimeDrains` instead of fetching real onboarding data
- No error handling if progress API fails (Promise.all rejects)
- No refresh mechanism (data fetched once on mount)

**What's missing:**
- No aggregate stats (total time, artifacts created, weeks completed)
- No "what's next" guidance beyond week card ordering

---

### Profile Management (40% — Poor)

**What works well:**
- Initial onboarding capture is thorough (9 fields)

**What's broken:**
- **Profile is write-once** — `lib/profile.ts` has `createUserProfile()` but no `updateUserProfile()`
- No way to view your own profile after onboarding
- If a teacher changes grade levels, subjects, or goals mid-course, they're stuck

**What's missing:**
- Profile edit page
- Profile display on settings/account page
- Ability to update goals mid-course

---

### Error Handling (15% — Critical)

**What exists:**
- Error display in chat component (dismissible banner)
- Try-catch in some API routes

**What's missing:**
- **No React error boundaries** — any component crash shows white screen
- No retry mechanisms on API failures (user hits dead end)
- No offline detection or graceful degradation
- No user-facing error messages for common failures (network, rate limit, timeout)
- No Sentry or error tracking service
- No fallback UI for failed loads
- Welcome video polls forever on failure (memory leak)
- Promise.all on dashboard has no error handling

---

### Streaming Responses (0% — Missing)

**Impact:** This is the single biggest UX issue. Users wait 3-8 seconds staring at "Thinking..." while Claude generates a full response. For a conversational product, this breaks the flow of dialogue. Both Next.js and the Anthropic SDK natively support streaming — the infrastructure is ready, but the implementation hasn't been done.

---

### Analytics/Admin (0% — Missing)

**What exists:**
- `/api/stats/participants` endpoint (basic count, appears underused)
- Ledger data contains rich engagement metrics (but no dashboard to view them)

**What's missing:**
- No admin dashboard
- No user engagement analytics
- No conversation quality metrics
- No completion funnel visualization
- No aggregate artifact data
- No teacher satisfaction tracking
- No cost-per-user monitoring

---

## Gap Analysis

### Must-Have Gaps (blocking core use cases)

| Gap | Impact |
|-----|--------|
| **Week 5 progressions.ts topic bug** | Wrong diagnostic descriptors injected — classifier gives incorrect assessments for an entire week |
| **No streaming responses** | 3-8s dead silence after every message; users think app is frozen |
| **No error boundaries** | Single component crash kills entire app — white screen, no recovery |
| **No profile editing** | Teachers stuck with wrong personalization for entire 6-week course |
| **Weeks 3-6 missing worked examples** | Core curriculum content is underbuilt — pedagogical quality drops after Week 2 |
| **Podcast has no progress indicator** | 30s wait with zero feedback = users abandon |
| **Dashboard loads hardcoded profile data** | Personalization promise broken — everyone sees "save_time" regardless of actual goal |

### Should-Have Gaps (significantly improve experience)

| Gap | Impact |
|-----|--------|
| No conversation export | Teachers can't save/share their learning for PD documentation |
| No artifact copy/export to external formats | Artifacts trapped in the app — can't paste into lesson plans |
| Podcast/video caches are in-memory | Lost on every Vercel deploy — expensive content regenerated repeatedly |
| No retry on API failures | Transient errors = dead end with no recovery |
| No in-conversation progress indicator | Teachers don't know how many exchanges remain |
| No markdown rendering in chat | Code blocks, lists, and emphasis lost in plain text |
| Mobile UX gaps | Phase indicator, support panel, sidebar all hidden on mobile |

### Nice-to-Have Gaps (delight, differentiation)

| Gap | Impact |
|-----|--------|
| No completion certificate | No tangible PD credit proof — teachers need documentation |
| No artifact sharing | Can't share with colleagues — missed viral loop |
| Voice mode disabled | Missing multimodal option for teachers who prefer talking |
| No admin analytics dashboard | Can't measure program effectiveness for grant reporting |
| No playback speed/skip for podcasts | Minor UX friction |
| No week preview before starting | Teachers can't see what's coming |

### Technical Debt

| Item | Risk Level |
|------|------------|
| **Zero test coverage** | High — any refactor risks silent breakage; ledger is 1,091 lines of untested state machine logic |
| **In-memory caches (podcast, video)** | Medium — data loss on every deploy; cost implications at scale |
| **No RLS on Supabase tables** | Medium — all rows accessible if anon key leaks |
| **In-memory rate limiting** | Medium — not suitable for multi-server; lost on restart |
| **Loose `any` types** | Low — multiple files use `any`, reducing type safety |
| **MP3 buffer concatenation** | Low — audio quality issue; comment says "use ffmpeg" |
| **Unused imports** | Low — dead code (e.g., Prisma import in welcome-video route) |

---

## User Journey Analysis

### Journey 1: New Teacher Onboarding

**Steps:** Landing page → "Sign in with Google" → 3-step form → Dashboard → Welcome video

**Pain points:**
- No preview of course content before signing in (skeptical teachers bounce)
- No back button in form steps
- No confirmation of what they entered before saving
- Can't edit later if they made a mistake or their situation changes
- No clear value proposition showing sample artifacts on landing page

**Drop-off risks:**
- Teacher sees "Sign in with Google" and hesitates (institutional email concerns)
- Form asks for "biggest time drains" — may feel evaluative
- Welcome video generation takes time with no fallback if it fails

**Recommendations:**
- Add profile review step before final submission
- Add "What you'll build" preview on landing page (show sample artifacts from each week)
- Consider allowing anonymous preview of Week 0 content
- Add text-based welcome fallback if HeyGen fails

### Journey 2: Completing Week 2 (First Skills Week)

**Steps:** Click Week 2 card → Chat with Skippy → Build prompt using 4C → Test externally → Reflect → Artifact saved → View takeaways → Listen to podcast

**Pain points:**
- No sense of progress within the conversation (just chat messages scrolling)
- 3-8 second wait after each message with no streaming feedback
- External testing loop breaks flow (leave app, come back, context lost)
- No clear signal that "you're done" — Skippy's wrap-up can be ambiguous
- `confirm()` dialog for "Finish Session" feels janky
- Podcast generation takes 30s with no progress steps

**Success criteria:**
- Teacher produces a working 4C prompt template they can use immediately
- Teacher demonstrates understanding of each 4C component (tracked by sticky booleans)
- Clean conversation wrap-up with explicit artifact presentation

**Recommendations:**
- Implement streaming responses (eliminates perceived wait)
- Add visible phase indicator that syncs with ledger state
- More explicit completion moment: "Your artifact has been saved! Here's what you built:"
- Replace `confirm()` with proper modal
- Add podcast generation progress steps

### Journey 3: Finding and Reusing an Artifact

**Steps:** Dashboard → Scroll past header and week cards → Find artifact gallery → Expand artifact → Read content → ... nothing else

**Pain points:**
- Gallery is below the fold — users may not know it exists
- No search or filter across artifacts
- Can't copy artifact content (copy button exists but content is in `<pre>` tags that don't render well)
- Can't export or share
- No visual hierarchy between artifact types (prompt template vs. lesson plan vs. policy)
- No way to bring an artifact back into a conversation

**Recommendations:**
- Elevate artifact gallery to its own tab or prominent dashboard section
- Add copy-to-clipboard on every artifact (verify it works well on mobile)
- Add type badges with color coding
- Add export to PDF or plain text
- Add "Use in Week N" flow for artifact reuse

---

## Competitive Positioning

### vs. Khan Academy AI Tutoring (Khanmigo)
- Khan focuses on **student tutoring**; AI4T focuses on **teacher capability building**
- Khan is general-purpose; AI4T is **structured curriculum with clear 6-week progression**
- AI4T advantage: produces concrete artifacts, not just conversation
- AI4T advantage: builds independence (external testing loop teaches tool-agnostic skills)
- AI4T risk: smaller initial market, but deeper value per user

### vs. Generic Teacher PD Platforms (Coursera, edX, ISTE)
- Traditional PD is video lectures + quizzes — **passive consumption**
- AI4T is **active construction** — every session builds something usable
- AI4T advantage: personalized to each teacher's actual classroom context
- AI4T advantage: ~$5/teacher vs. $50-200/session for traditional PD
- AI4T risk: higher marginal cost (AI API calls vs. video serving)

### vs. ChatGPT/Claude Direct Usage
- Raw AI tools have no pedagogy — teachers don't know what to ask or how to evaluate output
- AI4T provides the **scaffolding, progression, and quality assessment** that raw tools lack
- AI4T advantage: structured learning path with diagnostic assessment, not random exploration
- AI4T advantage: teaches *transferable skills* (4C Framework, iteration, calibration) not tool-specific tricks
- AI4T risk: some power users may feel constrained by the guided format

### vs. MagicSchool / SchoolAI / Diffit
- These are **tool products** (generate lesson plans, worksheets, rubrics)
- AI4T is a **learning product** (teaches you to generate your own, with any tool)
- AI4T advantage: addresses the "Ozempic problem" — what happens when the tool disappears?
- AI4T advantage: teachers who complete the course can use any AI tool effectively
- AI4T risk: tool products deliver instant gratification; AI4T requires 6-week commitment

### Key Differentiators to Protect
1. **Personalization depth** — profile → prompts → artifacts → podcasts (4 layers)
2. **Pedagogical rigor** — SOLO taxonomy, "One Win Then Wrap", 4C Framework, worked examples
3. **Artifact-first design** — every session produces something usable Monday morning
4. **External testing loop** — teaches independence, not dependency
5. **4,134 lines of curriculum IP** — not replicable by adding a wrapper around ChatGPT
