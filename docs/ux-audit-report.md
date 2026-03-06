# AI for Teachers — UX Audit Report

**Date:** 2026-03-05
**Auditor:** Claude Code (automated walkthrough)
**Method:** Code-level review of all routes, components, imports, and API wiring

## Summary

- Total issues found: 5
- Critical (blocking): 2
- Minor (polish): 3
- Missing features: 0 — everything is wired

---

## Section Results

### 1. Authentication

- **Status:** Working (with caveats)
- **Flow:** Landing (`/`) → Sign In (`/auth/signin`) → Google OAuth → Callback → `/home` (or `/onboarding` if no profile)
- **Components:**
  - Landing page (`app/page.tsx`): Server-side session check, redirects authenticated users to `/home`
  - Sign-in page (`app/auth/signin/page.tsx`): Terms checkbox, Google OAuth, session detection with redirect
  - Auth config (`lib/auth.ts`): Google provider, PrismaAdapter, database sessions
  - Middleware (`middleware.ts`): Protects `/home/*`, `/week/*`, `/onboarding`; public: `/`, `/auth/*`, `/legal/*`, `/api/auth/*`
  - Sign-out (`app/components/auth-button.tsx`): `signOut({ callbackUrl: "/" })`
- **Issues:**
  - **CRITICAL:** `useSearchParams()` in `app/auth/signin/page.tsx` has no Suspense boundary — causes build failure during static generation
  - **CRITICAL:** `useSearchParams()` in `app/home/page.tsx` also missing Suspense boundary — same issue

### 2. Onboarding

- **Status:** Working
- **Steps:** 1 page, 3 fields (single-screen onboarding)
  - "What do you teach?" (free text, required)
  - "How familiar are you with AI?" (3 radio options: new/some/advanced)
  - "What's eating most of your time?" (4 radio options: lesson_planning/feedback/differentiation/admin)
- **Validation:** Client-side — all 3 fields required, errors shown inline
- **Save:** `saveOnboardingProfile()` server action → `createUserProfile()` → redirect to `/home`
- **Guards:** Layout checks auth (redirects to `/` if not signed in) and existing profile (redirects to `/home` if already onboarded)
- **No skip/back capability** — all 3 questions mandatory, single screen so back is unnecessary
- **Issues:** None

### 3. Home / Dashboard

- **Status:** Working
- **Components rendered:**
  - `AuthButton` — fixed top-right (sign out)
  - `WelcomeVideo` — first-visit only (HeyGen personalized video)
  - `DashboardHeader` — greeting with first name, CTA based on progress
  - `WeekCardsGrid` — all 7 weeks (0-6), with lock/unlock logic
  - `ArtifactGallery` — saved artifacts grid below week cards
- **Week cards:** Expand/collapse UI, status indicators (locked/in-progress/completed), click navigates to `/week-{N}`
- **Locking logic:** Week N unlocked only when Week N-1 completed; Week 0 always open
- **Scroll-to-week:** After completing a week, redirects to `/home?completed=N` and auto-scrolls
- **Issues:** None

### 4. HeyGen Welcome Video

- **Status:** Working (fully wired)
- **Component:** `app/components/welcome-video.tsx` — 8 states (checking/generating/processing/ready/playing/paused/ended/hidden)
- **Mounted:** `app/home/page.tsx` line 105, conditional on `progress?.isFirstVisit`
- **API:** `app/api/welcome-video/route.ts`
  - POST: Generates personalized script → calls HeyGen v2 API → returns videoId for polling
  - GET: Checks status, returns cached URL from DB, or polls HeyGen
- **Env vars:** `HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID` (optional) — all referenced
- **Persistence:** Completed video URL saved to `UserProfile.welcomeVideoUrl` in DB
- **Timeout:** 24 polls x 5s = 2 minutes max wait, then hides
- **Post-video CTA:** "Continue to Week 0" button appears after video ends
- **Issues:** None

### 5. Chat Interface

- **Status:** Working
- **Route pattern:** `/week-{0-6}` → `app/week-{N}/page.tsx` → renders `<SkippyChat week={N} weekTitle="..." />`
- **Component:** `app/components/skippy-chat.tsx`
  - Header: week number, title, voice toggle, phase indicator, "Finish Session" button
  - AI consent banner on first use
  - Message area with user/assistant bubbles
  - Input textarea with Cmd+Enter support, auto-height
- **API:** `app/api/skippy/route.ts` — 5 events: `start_week`, `user_message`, `end_week`, `save_message`, `reset_week`
- **Model:** Claude Sonnet 4 (`claude-sonnet-4-20250514`), temp 0.7, max 1500 tokens
- **Phase indicator:** `app/components/chat-phase-indicator.tsx` — Discover/Build/Refine/Reflect
- **Finish Session:** Confirmation dialog → artifact extraction → redirect to `/home?completed={N}`
- **Issues:**
  - **MINOR:** Markdown rendering is basic (paragraph splits on `\n\n`). No bold, italic, code block styling. Functional but plain.
  - **MINOR:** Phase indicator hidden on mobile (`hidden md:block`)

### 6. Voice Mode UI

- **Status:** Working (fully wired for TTS output)
- **Voice toggle:** In chat header, persisted to localStorage
- **States:** `idle` | `thinking` | `generating` | `speaking`
- **Flow:** User sends text → Skippy responds → TTS audio plays → transcript reveals after audio ends
- **TTS API:** `app/api/tts/route.ts` — OpenAI `tts-1` model, `fable` voice (British), in-memory cache (30min TTL, 50 items)
- **Safety:** `sanitizeForSpeech()` strips instruction-like text before synthesis
- **VoiceStatusDisplay:** Waveform animation (5 bars with stagger), stop button, avatar in speaking state
- **CSS:** `animate-voice-bar` keyframes defined in `app/globals.css` lines 129-136
- **Avatar:** `app/components/skippy-avatar/skippy-avatar.tsx` supports `"speaking"` state with pulsing/glow animations
- **Limitation:** Output-only (TTS). No speech-to-text input — user still types.
- **Issues:** None

### 7. Takeaways Screen

- **Status:** Working
- **Route:** `/week-{0-6}/takeaways` → `app/week-{N}/takeaways/page.tsx`
- **Component:** `app/components/takeaways-content.tsx`
- **Sections:**
  1. Breadcrumb navigation (Dashboard > Week X > Takeaways)
  2. Header with week title/subtitle
  3. "Your Learning Recap" — podcast player (generates ~3min audio summary)
  4. "Your Session" — session summary from conversation ledger
  5. "What You Built" — artifacts with copy buttons
  6. "Key Concepts" — week-specific learning objectives
  7. "What's Next" — preview of next week or completion message
  8. "Quick Reflection" — open-ended prompt (no storage)
- **Access:** From week card "Takeaways" action button (completed weeks only)
- **Issues:** None

### 8. Artifact Library

- **Status:** Working
- **Flow:** Chat conversation → "Finish Session" → artifact extraction (if >2 exchanges) → saved to DB
- **Database:** `prisma.artifact` table — id, userId, weekNumber, weekTopic, title, type, content, description, tags
- **Types:** prompt_template, workflow, lesson_outline, draft_feedback, email_template, communication_template, reflection, other
- **Display:**
  - Home page: `ArtifactGallery` component below week cards (2-column grid, expand/copy)
  - Takeaways page: "What You Built" section with week-specific artifacts
- **API:** GET `/api/artifacts` (all), GET `/api/artifacts/[id]` (single), DELETE `/api/artifacts/[id]`
- **Empty state:** Gallery returns null (renders nothing) — no empty state message
- **Issues:**
  - **MINOR:** No empty state message in artifact gallery when user has no artifacts yet

### 9. Podcast / Audio Content

- **Status:** Working (fully implemented, on-demand generation)
- **Player:** `app/components/podcast-player.tsx` — play/pause, progress bar, seek, regenerate
- **Generation:** `app/api/podcast/route.ts`
  - Script: Claude Sonnet 4 generates 2-host conversation (Sam/Alex)
  - Audio: OpenAI TTS (`tts-1`), voices `nova` + `onyx`, concatenated MP3
  - Cache: In-memory, 1-hour TTL
- **Personalization:** Quotes teacher, references their subject/role/goals, adapts to week content
- **Format:** 16-22 host exchanges, ~3 minutes
- **Display:** Embedded in takeaways page under "Your Learning Recap"
- **No static audio files** — everything generated on-demand
- **Issues:** None (in-memory cache is acceptable for current scale)

### 10. Navigation & Global UI

- **Status:** Working
- **Sidebar:** `app/components/course-sidebar.tsx`
  - Two variants: "full" (200px, home dashboard) and "minimal" (64px, week chat)
  - Hidden on mobile (`hidden lg:flex`)
  - Content: Course team (Asher + Skippy), "Chat to Skippy" button, Help/Support button
- **Support panel:** `app/components/support-panel.tsx` — floating chat panel, full-screen on mobile, side panel on desktop
- **Global layout:** `app/layout.tsx` — SessionProvider, Geist + DM Serif Display fonts, viewport meta (auto by Next.js)
- **Error boundary:** `app/error.tsx` — "Something went wrong" with "Try again" and "Go to Dashboard" CTAs
- **Loading states:** Per-component skeleton loaders (DashboardHeader, ArtifactGallery, WelcomeVideo), no global loading.tsx
- **Mobile:** Sidebar hidden, support panel goes full-screen, responsive padding/grids
- **No mobile nav hamburger menu** — sidebar simply disappears on mobile
- **Issues:** None blocking. Mobile users lose sidebar navigation (can still use browser back).

### 11. Week-by-Week Content

- **Status:** Working (all 7 weeks complete)
- **Prompt files:** All present in `lib/prompts/`
  | Week | File | Lines | Title |
  |------|------|-------|-------|
  | 0 | `week-0.ts` | 135 | Getting Started |
  | 1 | `week-1.ts` | 521 | Understanding AI in Teaching |
  | 2 | `week-2.ts` | 799 | Prompting Fundamentals (4C framework) |
  | 3 | `week-3.ts` | 642 | Lesson Planning with AI |
  | 4 | `week-4.ts` | 646 | Feedback & Assessment |
  | 5 | `week-5.ts` | 672 | Differentiation with AI |
  | 6 | `week-6.ts` | 709 | Integration & Ethics |
- **Routes:** All `/app/week-{0-6}/page.tsx` exist with `layout.tsx` and `takeaways/page.tsx`
- **Module config:** `lib/modules.ts` — `modulePrompts` object with system prompts and opening messages for all 7 weeks
- **Key concepts:** Defined in `takeaways-content.tsx` for all weeks
- **Issues:** None

---

## Critical Issues (Must Fix)

1. **Missing Suspense boundary — `app/auth/signin/page.tsx`**
   `useSearchParams()` at line 5 needs a Suspense wrapper. Causes production build failure ("useSearchParams() should be wrapped in a suspense boundary"). Fix: Extract the component using `useSearchParams` into a child component wrapped in `<Suspense>`.

2. **Missing Suspense boundary — `app/home/page.tsx`**
   `useSearchParams()` at line 4 has the same issue. Same fix needed.

---

## Minor Issues (Should Fix)

1. **Basic markdown rendering in chat** (`app/components/skippy-chat.tsx`)
   Messages split on `\n\n` only. No bold, italic, lists, or code block styling. Consider adding `react-markdown` or a lightweight renderer.

2. **Phase indicator hidden on mobile** (`app/components/chat-phase-indicator.tsx`)
   Uses `hidden md:block`. Mobile users can't see their progress phase. Consider a compact mobile version.

3. **No empty state in artifact gallery** (`app/components/artifact-gallery.tsx`)
   Returns `null` when no artifacts exist. New users see nothing in that section — could show an encouraging placeholder.

---

## Missing Features (Not Wired)

None. All advertised features are fully wired and functional:
- Auth flow complete
- Onboarding complete
- Dashboard complete
- Welcome video complete
- Chat with Skippy complete
- Voice mode (TTS output) complete
- Takeaways complete
- Artifact library complete
- Podcast generation complete
- All 7 weeks of content complete
- Navigation and support complete

---

## Recommendations

1. **Fix Suspense boundaries** — both critical issues are straightforward. Extract `useSearchParams()` usage into a child component and wrap with `<Suspense fallback={...}>`.

2. **Add markdown rendering** — `react-markdown` with `remark-gfm` would make Skippy's responses much more readable (bullet lists, bold, code blocks).

3. **Add mobile navigation** — sidebar disappears on mobile with no replacement. A hamburger menu or bottom tab bar would help mobile users navigate between weeks without using browser back.

4. **Add artifact empty state** — show a message like "Complete a week to see your artifacts here" when gallery is empty.

5. **Consider persistent podcast cache** — in-memory cache clears on server restart. For production, consider storing generated audio in Supabase Storage or similar.
