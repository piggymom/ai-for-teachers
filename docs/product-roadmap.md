# Product Roadmap — AI for Teachers

*Last updated: 2026-03-01 | Based on full codebase + UX + curriculum audit*

---

## Now (Next 2 Weeks)
High-impact fixes that unblock core user experience and fix broken functionality.

| # | Item | Type | Effort | Impact | Rationale |
|---|------|------|--------|--------|-----------|
| 1 | **Fix Week 5 progressions.ts topic bug** | Bug | S | **Critical** | Wrong diagnostic descriptors ("Communication & Admin" instead of "Differentiation") injected into classifier. Entire week produces incorrect SOLO assessments. |
| 2 | **Add streaming responses to Skippy text chat** | Feature | M | **Critical** | 3-8s blank screen after every message. Users think app is broken. Both Next.js and Anthropic SDK support streaming natively — this is infrastructure work, not research. |
| 3 | **Add React error boundaries** | Debt | S | **Critical** | Any component crash kills the entire app with a white screen. Wrap: week pages, chat component, dashboard, artifact gallery, podcast player. |
| 4 | **Fix dashboard to load real profile data** | Bug | S | **High** | Dashboard hardcodes `primaryGoal: "save_time"` and empty `biggestTimeDrains`. Personalization promise is broken — everyone sees the same generic content. |
| 5 | **Add progress indicator to podcast generation** | Feature | S | **High** | 30s wait with zero feedback = abandonment. Show steps: "Generating script... Creating audio (3/12)..." |
| 6 | **Add retry + error messages on API failures** | Debt | S | **High** | Transient failures dead-end the user with no recovery path. Add retry buttons and human-readable error messages. |
| 7 | **Add profile editing page** | Feature | M | **High** | Teachers who change grade/subject mid-year are stuck with wrong personalization for entire course. `lib/profile.ts` needs `updateUserProfile()`. |
| 8 | **Add loading skeleton / "thinking" animation to chat** | Feature | S | **High** | Even before full streaming ships, a skeleton state eliminates the "is it frozen?" perception. |

---

## Next (2-6 Weeks)
Features that deepen engagement and deliver on the artifact-first promise.

| # | Item | Type | Effort | Impact | Rationale |
|---|------|------|--------|--------|-----------|
| 9 | **Implement Week 3 fix spec** (iteration + worked examples) | Content | L | **High** | Core curriculum gap — iteration/chunking mentioned but not taught. 3+ worked examples at different SOLO levels needed. |
| 10 | **Implement Week 4 fix spec** (calibration + worked examples) | Content | L | **High** | Calibration is 1 paragraph. Needs anchor examples, personalization layer, connection to Week 3. |
| 11 | **Implement Week 5 fix spec** (variation + invariant/variant) | Content | L | **High** | Beyond the topic bug: needs complete curriculum rewrite. "Access vs. Rigor" as central diagnostic. |
| 12 | **Implement Week 6 fix spec** (capstone + capacity test) | Content | L | **High** | Current questionnaire → checklist model is too passive. Needs stress-test scenarios and dependency question. |
| 13 | **Artifact copy-to-clipboard + export (text/PDF)** | Feature | S | **High** | Artifacts are the product's output — they must leave the app. Teachers want to paste into Google Docs and lesson plans. |
| 14 | **Move podcast + video caches to database/storage** | Debt | S | **Medium** | In-memory caches lost on every Vercel deploy. Store generated audio as Supabase Storage objects; store video URLs in DB. |
| 15 | **Conversation export (download transcript)** | Feature | S | **Medium** | Teachers reference past conversations. Some need PD documentation for professional development credit. |
| 16 | **Add rate limiting to all AI endpoints** | Debt | S | **High** | Unprotected Claude/OpenAI calls = uncapped cost exposure. One bad actor could run up thousands. Move from in-memory to Redis or database-backed. |
| 17 | **In-conversation progress indicator** | Feature | S | **Medium** | "Phase 2 of 4: Build" or exchange counter so teachers know pacing and how much longer to expect. |
| 18 | **Add markdown rendering to chat** | Feature | S | **Medium** | Code blocks, lists, bold/italic all lost in plain text. Use `react-markdown` or similar. |
| 19 | **Week preview before starting** | Feature | S | **Medium** | Show learning goal, estimated time (~20 min), and artifact type before entering. Reduces anxiety. |
| 20 | **Enable Supabase RLS** | Debt | S | **Medium** | Security gap — all rows accessible if anon key leaks. |

---

## Later (6+ Weeks)
Strategic features for scale, differentiation, and grant reporting.

| # | Item | Type | Effort | Impact | Dependencies |
|---|------|------|--------|--------|--------------|
| 21 | **Admin analytics dashboard** | Feature | L | **High** | Completion rates, engagement time, conversation quality, artifact count. Required for grant reporting and district sales. |
| 22 | **Completion certificate / PD credit proof** | Feature | M | **High** | PDF certificate with completion data. Teachers need documentation for PD hours. Critical for district adoption. |
| 23 | **Basic test coverage (API routes + ledger)** | Debt | L | **Medium** | Zero tests. Ledger is 1,091 lines of complex state machine logic. Even 30% coverage on critical paths prevents silent breakage. |
| 24 | **Enable voice mode** | Feature | M | **Medium** | Architecture exists but disabled. Needs UI polish (waveform), visual feedback, WebRTC fallback handling, voice preference. Depends on error boundaries (#3). |
| 25 | **Conversation resume / mid-session save** | Feature | M | **Medium** | Currently lose context if browser closes mid-conversation. Need explicit save points and resume flow. |
| 26 | **Artifact sharing (colleague link)** | Feature | M | **Medium** | Shareable read-only view of artifacts. Viral loop for organic adoption. |
| 27 | **Multi-language support** | Feature | L | **Medium** | System prompts + UI in Spanish, French, etc. Massively expands TAM for grants and districts. |
| 28 | **Podcast download + transcript display** | Feature | S | **Medium** | Teachers want to relisten offline. Transcript enables reading along. |
| 29 | **FFmpeg audio processing for podcasts** | Debt | M | **Low** | Clean audio joins, consistent volume, fade transitions. Current MP3 concatenation has artifacts. |
| 30 | **Mobile-optimized experience** | Feature | M | **Medium** | Phase indicator, support panel, sidebar all hidden on mobile. Need bottom tab nav or responsive alternatives. |

---

## Icebox (Ideas to Revisit)

| Idea | Why Deferred |
|------|-------------|
| **Cohort/group mode** (teachers do weeks together) | Requires social features, moderation, scheduling — large scope. Revisit after solo experience is polished. |
| **Custom week creation** (admin builds new modules) | Would need prompt authoring tools, testing framework. Premature until Weeks 3-6 curriculum is stable. |
| **Student-facing mode** (students use Skippy) | Completely different product with different safety requirements. Don't dilute teacher focus. |
| **Google Classroom/Canvas integration** | API complexity, auth scoping, maintenance burden. Wait for demand signal from district pilots. |
| **Gamification** (badges, leaderboards, streaks) | Could undermine professional tone. Teachers aren't students. Revisit carefully with user research. |
| **Native mobile app** | Web works fine on mobile (once mobile UX is fixed). Native adds maintenance without clear value. |
| **Offline mode (PWA)** | All AI features require internet. Only useful for reviewing artifacts/transcripts. Low ROI. |
| **In-app prompt sandbox** ("test your prompt here") | Appealing but creates a ChatGPT clone inside the product. External testing loop is intentional — teaches independence. |
| **Advanced modules (Weeks 7-12)** | Great idea but premature — Weeks 3-6 curriculum must be solid first. Content-only work once engine is stable. |

---

## Dependency Map

```
Error boundaries (#3) ──► Voice mode (#24)
                      ──► Streaming (#2) ──► Streaming all AI calls

Profile edit (#7) ──► Dashboard real data (#4)

Week 3-6 fix specs (#9-12) ──► Advanced modules (icebox)
                            ──► Completion certificate (#22)

Rate limiting (#16) ──► Any public launch
                    ──► District pilots

Cache migration (#14) ──► Podcast download (#28)

Admin dashboard (#21) ──► District sales
                      ──► Grant reporting
```

---

## Effort Definitions

| Size | Time Estimate | Examples |
|------|--------------|---------|
| **S** | < 1 day | Error boundaries, copy button, loading skeleton, cache migration |
| **M** | 2-5 days | Streaming, profile edit, voice mode, certificate generation |
| **L** | 1-2 weeks | Curriculum rewrites (per week), admin dashboard, test coverage, multi-language |
