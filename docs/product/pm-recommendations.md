# PM Recommendations — AI for Teachers

*Last updated: 2026-03-01 | Based on full codebase, UX, curriculum, and strategic audit*

---

## Top 3 Priorities

### 1. Fix the curriculum cliff after Week 2

**The problem:** Weeks 0-2 are excellent. The onboarding captures rich context, Week 1 diagnoses understanding with SOLO taxonomy, and Week 2 teaches the 4C Framework with multiple worked examples at different levels. Then Weeks 3-6 drop off sharply — iteration is mentioned but not taught, calibration gets one paragraph, Week 5 has a literal bug (wrong topic in progressions.ts), and Week 6's capstone is a checklist instead of a capacity demonstration.

**Why this matters:** Teachers who complete Weeks 1-2 and hit a noticeably weaker Week 3 will question the product's quality. For a 6-week course, the second half is where you prove the investment was worth it. Fix specs exist for each week — this is content work, not engineering.

**The fix:** Implement the fix specs for Weeks 3-6 in sequence. Each needs 3+ worked examples at different SOLO levels, explicit connection to prior-week frameworks, and level-calibrated scaffolding. Start with Week 5 (fix the bug) and Week 3 (first skills week after foundation), then Week 4 and Week 6.

**Effort:** Large (1-2 weeks per week of curriculum). **Impact:** Existential — the course is only as good as its weakest week.

**Success metric:** Teacher completion rate Week 3 → Week 6 stays above 70% (vs. current unknown baseline).

### 2. Ship streaming responses

**The problem:** Every teacher message is followed by 3-8 seconds of dead silence while Claude generates the full response. For a conversational product, this is devastating. Teachers are busy people — if they perceive slowness or think the app is frozen, they close the tab.

**Why this matters now:** The DOL AI Literacy Framework creates a window of urgency. Districts will evaluate AI PD tools in the coming months. A product that feels slow loses to one that feels instant, even if the pedagogical design is superior. Both Next.js and the Anthropic SDK natively support streaming — this is plumbing, not invention.

**The fix:** Refactor `app/api/skippy/route.ts` from `await messages.create()` to streaming. Update `skippy-chat.tsx` to render tokens incrementally. Keep the async classifier firing after stream completes.

**Effort:** Medium (2-5 days). **Impact:** Critical — transforms perceived performance from "broken" to "instant."

**Success metric:** Time-to-first-token < 500ms. Zero "is it broken?" support messages.

### 3. Make artifacts portable (copy + export + eventually share)

**The problem:** Artifacts are the product. They're what teachers take back to their classroom Monday morning. Right now they're trapped inside the app — the copy button exists but content renders in `<pre>` tags that don't display well on mobile, there's no export, and no sharing. A teacher who builds a perfect prompt template in Week 2 should be able to paste it into a Google Doc in one click.

**Why this matters:** The "artifact-first design" is the #1 differentiator in the pitch deck and grant applications. If teachers can't actually use the artifacts outside the app, the value proposition is hollow. This is the "last mile" of value delivery.

**The fix:** Phase 1 (now): robust copy-to-clipboard with proper formatting. Phase 2 (next): PDF/text export. Phase 3 (later): shareable colleague links.

**Effort:** Small for Phase 1 (< 1 day). **Impact:** High — completes the core value loop.

**Success metric:** >80% of completed artifacts are copied or exported within 24 hours of creation.

---

## Biggest Risks

### 1. No rate limiting on AI endpoints = uncapped cost exposure

**Risk:** Any authenticated user can make unlimited Claude and OpenAI API calls. Middleware rate limiting exists but uses an in-memory store that resets on every Vercel deploy. A single user running a script against `/api/skippy` could generate thousands of dollars in API costs in minutes. This is not a theoretical concern — it's a financial liability that must be closed before any public launch or pilot.

**Mitigation:** Move rate limiting to database-backed or Redis-backed store. Set hard per-user limits: 60 messages/hour (existing), 5 podcasts/day, 3 video generations/week. Add cost alerting in Vercel/Supabase. **Do this before any public-facing pilot.**

### 2. Week 5 bug undermines classifier integrity

**Risk:** `progressions.ts` defines Week 5 as "Communication & Admin" instead of "Differentiation with AI." This means the async classifier receives wrong diagnostic descriptors for the entire week, producing incorrect SOLO level assessments. Teachers in Week 5 get mischaracterized understanding levels, which corrupts the personalization pipeline. If any Week 5 data is used for grant reporting or pilot evaluation, it's unreliable.

**Mitigation:** Fix the topic string and descriptors in progressions.ts. Audit any existing Week 5 ledger data for corruption. Prioritize this as the first item in "Now."

### 3. Zero test coverage on complex state machine

**Risk:** The ledger/classifier system is 1,091 lines of complex state machine logic with phase transitions, sticky booleans, misconception detection, and JSON parsing with regex fallback. The prompt composition layer is 375 lines of string building with profile interpolation. Any refactor, dependency update, or feature addition (like streaming) could silently break these systems without anyone knowing until a teacher reports weird behavior.

**Mitigation:** Before any major refactor, add integration tests for: (1) Skippy API route (mock Claude, verify prompt composition), (2) ledger classifier (verify phase transitions and sticky booleans), (3) artifact extraction (verify regex + fallback). Even 30% coverage on these critical paths is transformative.

### 4. In-memory caches mean data loss on every deploy

**Risk:** Podcast audio and welcome video URLs are cached in JavaScript `Map` objects. Every Vercel deployment — including preview deploys triggered by any git push — wipes these caches. Teachers who generated a podcast can't re-listen after the next deploy. At scale, this means expensive content is regenerated repeatedly, multiplying API costs.

**Mitigation:** Store podcast audio as Supabase Storage objects (or S3). Store video URLs in the database Artifact table or a dedicated cache table. This also enables the podcast download feature.

---

## Quick Wins (< 1 Day Each)

| # | Win | Effort | Impact |
|---|-----|--------|--------|
| 1 | Fix Week 5 topic in progressions.ts | 15 min | Unblocks correct classifier for entire week |
| 2 | Fix dashboard hardcoded profile data (load real onboarding) | 1-2 hours | Personalization promise actually delivered |
| 3 | Add "Copy" button improvements to artifact gallery | 2 hours | Teachers can use their artifacts immediately |
| 4 | Add loading skeleton/animation to Skippy chat during LLM call | 1 hour | Eliminates "is it broken?" perception |
| 5 | Show estimated time on each week card ("~20 min") | 30 min | Reduces anxiety about time commitment |
| 6 | Add podcast generation progress steps | 2 hours | "Generating script... Creating audio (3/12)..." |
| 7 | Wrap week pages + dashboard in React error boundaries | 1 hour | Prevents full-app crashes |
| 8 | Replace `confirm()` dialog with proper modal for "Finish Session" | 1 hour | Professional UX for critical action |
| 9 | Add `<meta>` description + OG tags to landing page | 30 min | Better sharing/SEO |
| 10 | Fix unused Prisma import in welcome-video route | 5 min | Code hygiene |
| 11 | Track Week 0 in localStorage progress | 30 min | Consistent progress display |
| 12 | Add polling timeout to welcome video (max 2 min) | 30 min | Prevents infinite polling / memory leak |

---

## Strategic Questions to Resolve

### 1. What's the distribution model?

**Question:** Is this B2C (individual teachers sign up) or B2B (school districts purchase)?

**Options:**
- **B2C freemium:** Free for individual teachers, builds bottom-up demand. Risk: high CAC, hard to monetize.
- **B2B licensing:** Sell to districts/schools. Higher revenue per deal. Risk: longer sales cycle, needs admin dashboard, compliance docs (which exist).
- **Hybrid:** Free for individuals, paid tier for schools wanting analytics/management.

**Recommendation:** Start B2C to build user base and testimonials, then layer B2B features (admin dashboard, cohort management, completion reporting) when demand emerges. The legal/compliance docs are already written — that's unusually ahead for this stage.

### 2. When should voice mode ship?

**Question:** The architecture exists (WebRTC, OpenAI Realtime) but it's disabled. Is voice a differentiator worth investing in, or a distraction?

**Options:**
- **Ship now:** Multimodal is a strong differentiator. Teachers who prefer talking over typing get a better experience. Creates press-worthy "wow" moment.
- **Defer:** Text mode works. Voice adds complexity (WebRTC issues, transcription errors, higher API costs). Polish text first.

**Recommendation:** Defer until text experience is bulletproof (streaming, error handling, artifacts working). Voice is a launch moment for v2 — ship it when you can do a press push, not as a quiet add-on.

### 3. How to handle the capacity vs. dependency tension?

**Question:** The product explicitly teaches teachers to use AI tools like ChatGPT and Gemini (the "external testing" loop). This builds genuine capability but also reduces lock-in. Is that a problem for retention and monetization?

**Recommendation:** Lean in hard. Teaching transferable skills is the ethical choice, the pedagogically correct choice, and paradoxically the defensible moat. Districts will pay for the curriculum and personalized coaching engine, not another chatbot. The external testing loop builds trust — teachers tell their colleagues "this actually teaches you, it doesn't trap you." Retention comes from new curriculum modules (Weeks 7+), not from dependency.

### 4. What happens after Week 6?

**Question:** The course ends. Teachers completed the program — now what?

**Options:**
- **Advanced modules:** Weeks 7-12 covering specific use cases (special ed, ELL, STEM labs, etc.)
- **Open sandbox:** Skippy becomes an ongoing assistant for lesson planning
- **Community:** Teacher forums, artifact sharing, cohort discussions
- **Certification:** Formal PD credits, badges, portfolio

**Recommendation:** Start with advanced modules. The curriculum engine is built — new modules are content, not code. Each module can be sold as an add-on or bundled for districts. Prioritize modules by teacher demand data from pilot cohort. Certification should come with the admin dashboard (needed for both).

### 5. Should you pursue grants or revenue first?

**Question:** Grant funding offers runway but comes with strings (reporting, timeline commitments). Revenue is harder to start but more sustainable. The grant infrastructure (applications, funder landscape, compliance docs) is unusually well-prepared.

**Recommendation:** Both, in parallel. Spencer Foundation ($50K, individual PI, rolling deadline) is a no-regrets move — apply now. Simultaneously run a small pilot with 2-3 schools to generate the traction data that unlocks larger grants (NSF, Google.org) and district revenue. The compliance docs, pitch decks, and narrative are ready. The bottleneck is a working product with polished Weeks 3-6.

---

## Key Metrics to Track

### Engagement

| Metric | Why It Matters | Target |
|--------|---------------|--------|
| Week completion rate (per week) | Identifies drop-off points in curriculum | >70% Week 1→2, >60% overall |
| Return rate (% who start Week N+1 within 7 days) | Measures course momentum | >65% |
| Messages per session | Engagement depth | 10-18 (matches conversation arc design) |
| Time per session | Are sessions too long or too short? | 15-25 min |
| Podcast listen rate | Is this feature valued? | >40% of completed weeks |
| Artifact export/copy rate | Is output actually used? | >50% of completed weeks |

### Learning Outcomes

| Metric | Why It Matters | Target |
|--------|---------------|--------|
| SOLO level progression (Week 1 vs. Week 6) | Are teachers actually learning? | 1+ level gain |
| 4C framework adoption in Weeks 3-5 | Does the prompting framework stick? | All 4 components demonstrated |
| External testing completion rate | Are teachers applying skills outside the app? | >50% |
| Artifact quality score (LLM eval) | Are outputs genuinely useful? | TBD — establish baseline |

### Quality & Reliability

| Metric | Why It Matters | Target |
|--------|---------------|--------|
| Time-to-first-token (once streaming ships) | Perceived responsiveness | < 500ms |
| Error rate (API failures, crashes) | Reliability = trust | < 1% of sessions |
| Classifier accuracy (spot-check) | Is the ledger system working? | > 80% agreement |
| Conversation wrap-up rate (clean vs. abandoned) | Are sessions ending well? | > 70% clean endings |
| API cost per teacher per week | Financial sustainability | < $2 |

---

## User Journey Recommendations (Summary)

### Onboarding: Add confidence before commitment
- Show sample artifacts on landing page ("Here's what teachers build in Week 2")
- Add profile review step before final save
- Consider anonymous Week 0 preview
- Add text-based welcome if HeyGen video fails

### Weekly conversations: Reduce friction in the core loop
- Streaming responses (eliminate 3-8s dead silence)
- Visible phase indicator synced to ledger
- Proper "Finish Session" modal (not `confirm()`)
- Clear completion moment: "Your artifact has been saved!"

### Artifacts: Complete the value delivery
- Robust copy-to-clipboard with proper formatting
- Export to PDF/text
- Elevate gallery visibility (above the fold or dedicated tab)
- Type badges with visual hierarchy

---

## Competitive Moat Assessment

**What's defensible:**
1. 4,134 lines of curriculum IP tied to diagnostic classification — not replicable by wrapping ChatGPT
2. External testing loop builds trust and word-of-mouth — no competitor teaches independence
3. SOLO taxonomy-based assessment gives measurable progression data — valuable for grants and districts
4. Founder credibility (15-year teacher + builder) — authentic voice in a market of tech tourists

**What's vulnerable:**
1. Claude/OpenAI could add teacher PD features (but won't invest in 4,134 lines of curriculum)
2. ISTE or established PD providers could build similar (but move slowly and prefer video/lecture format)
3. Any well-funded EdTech startup could clone the approach (but would take 6+ months to build comparable curriculum depth)

**Time window:** 6-12 months to establish as the default AI PD tool before larger players notice the category. The DOL AI Literacy Framework creates urgency — districts are looking now.

---

## The One Thing

If you can only do one thing this month, **fix Weeks 3-6**. The product's pitch is "a 6-week course that produces classroom-ready artifacts." Right now it's a 2.5-week course with a strong start and a weak finish. Everything else — streaming, error handling, analytics, grants — matters less than delivering on the core promise. A teacher who finishes Week 6 and says "this changed how I teach" is worth more than any feature. A teacher who drops off after Week 3 because the quality dipped is a lost advocate and a lost data point.
