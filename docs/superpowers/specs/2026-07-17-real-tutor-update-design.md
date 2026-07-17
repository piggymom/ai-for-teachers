# Real Tutor Update: Design

Date: 2026-07-17
Status: Approved by Asher (sections 1-4 approved in session)

## Why this update

Three findings drive the scope:

1. **The curriculum cliff.** Weeks 0-2 are strong. Weeks 3-6 have fix-specs in `docs/week-specs/` that were never implemented: thin worked examples, under-taught core skills (iteration, calibration, variation, stress-testing). The PM docs call this existential: the course is only as good as its weakest week.
2. **Skippy is fragmented.** Skippy speaks with three different voices today: the HeyGen avatar voice in the welcome video, OpenAI "fable" in chat TTS, and "sage" in the disabled realtime mode. The chat avatar (SVG orb) and the video avatar (HeyGen stock) don't match. A real tutor has one voice and one face.
3. **HeyGen is the wrong cost structure.** HeyGen's Avatar IV engine runs $3-4/min, so each 45s personalized welcome video costs $0.75-$3.00 per teacher, against ~$5/teacher total Claude cost. Verified July 2026 pricing: Lemon Slice (rebranded Infinity AI) generates the same video for ~$0.12-0.17, supports stylized characters, and animates to caller-supplied audio, which enables the one-voice unification.

Ship target: the product polished and coherent, with a mockup kit for visual iteration in Claude Design (claude.ai/design).

## Decisions made

| Decision | Choice | Rationale |
|---|---|---|
| Skippy's human presence | Async video at key moments; no realtime avatar | Personalization is the cost driver; generated video where it lands hardest. Realtime streaming avatars (best option: Simli at $0.05/min) stay open for later. |
| Video provider | Lemon Slice, gated by a bake-off, HeyGen standard engine as fallback | 4-18x cheaper; accepts our own audio; same-company realtime path exists. |
| Skippy's voice | OpenAI TTS "fable" everywhere Skippy speaks | Already the chat voice; teachers should hear one tutor. Podcast hosts (nova/onyx) are separate characters and keep their voices. |
| Curriculum | Implement all four fix-specs (Weeks 3-6) | Content work only; the specs already exist. |
| Claude Design workflow | Screen-mockup kit, ported back by hand with residue scrubbing | Claude Design edits self-contained pages, not a Next.js repo. Matches Asher's proven deck workflow. |

## Section 1: Skippy presence system

### One voice
- All Skippy video narration is generated as OpenAI TTS "fable" audio first, then animated by the video provider.
- Chat TTS already uses fable; no change.
- The realtime route's "sage" voice is out of scope (feature stays disabled) but noted for whenever it's revived.

### Provider abstraction
- New `lib/video.ts` exposing `generateAvatarVideo({ script | audioUrl }) -> { videoId }` and `getVideoStatus(videoId) -> { status, url }`.
- Implementations: `lemonslice` (default) and `heygen` (fallback), selected by env var `VIDEO_PROVIDER`.
- `app/api/welcome-video/route.ts` refactors onto the abstraction. The existing flow is kept as-is: trigger on first `/home` visit, poll every 5s with a cap, persist URL to `UserProfile.welcomeVideoUrl`, `FAILED` marker for permanent billing errors, transient errors cleared for retry.

### Quality gate (bake-off)
- Before cutover: generate 10 test videos on Lemon Slice with varied names, subjects, and script lengths; compare against HeyGen output for lipsync accuracy, visual artifacts, and generation latency. Results saved to `reports/`.
- Pass: Lemon Slice becomes default. Fail: fallback is HeyGen pinned to the standard $1/min engine (still a 3-4x cost cut); revisit providers next quarter.

### Video moments
- **Personalized welcome** (existing): per teacher, ~45s, ~$0.15 each on Lemon Slice.
- **Week intros** (new): seven generic 30-45s videos, Skippy introduces the week's skill and artifact. Generated once, stored as static assets, shown on each week page before the chat. Script sourced from each week's teaching goal. Total one-time cost ~$1.
- Week-intro component reuses the welcome-video player UI.

### Canonical Skippy look
- One character image drives the Lemon Slice avatar. Asher picks the face during the Claude Design phase from side-by-side options.
- The chat SVG avatar's palette aligns to the chosen character so chat and video read as the same entity.

### Housekeeping
- `.env.example` gains all AI vars, currently undocumented: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENAI_TTS_VOICE`, `VIDEO_PROVIDER`, `LEMONSLICE_API_KEY`, `HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID`.

## Section 2: Curriculum completion (Weeks 3-6)

Implement the four fix-specs at `docs/week-specs/week-{3,4,5,6}-fix-spec.md` into `lib/prompts/week-{3,4,5,6}.ts`:

- **Week 3 (Lesson Planning / ITERATION):** full worked-example dialogues at all SOLO levels (Tanya, Kenji, Dr. Okafor sketches in the spec), explicit Week 2 4C callbacks, iteration taught through contrast (vague vs. specific follow-ups), chunking practiced for multistructural and above.
- **Week 4 (Feedback / CALIBRATION):** worked examples implemented (Aisha, Jordan, Marcus), BUILD restructured so anchor-example creation is the centerpiece, personalization layer given real practice, Feedback Flow (Analyze, Draft, Personalize, Deliver) taught through doing.
- **Week 5 (Differentiation / VARIATION):** worked examples at all levels, invariant dimensions taught explicitly (objective, thinking demand, rigor protected; vocabulary, scaffolding, time varied), access vs. rigor distinction exercised in REFINE.
- **Week 6 (Capstone / SYNTHESIS):** worked examples implemented, concrete stress-test scenario bank, capacity-demonstration framework made specific, extended-abstract example deepened.

Quality gates, per week:
1. Passes the 40-item checklist in `docs/content/week-prompt-template.md`.
2. Re-verified with the learner-agent simulation harness in `scripts/testing/`; reports to `reports/` with timestamps.

## Section 3: Experience polish

In scope:
- **Streaming responses** in Skippy chat: Anthropic SDK streaming, incremental render, typing indicator. The async classifier and ledger flow are untouched (they fire after the full response as today).
- **Markdown rendering** in chat messages (bold, lists, code blocks).
- **Error boundaries** at app level and around the chat component; friendly fallback with a retry.
- **Dashboard profile fix:** load real profile data; remove the hardcoded `primaryGoal: "save_time"`.
- **Portable artifacts:** copy-to-clipboard and markdown/text download on every artifact card.
- **Podcast:** generation progress indicator; cache moved from in-memory Map to the existing `Podcast` DB model so deploys stop discarding paid audio.
- **Cost guardrail:** DB-backed per-user daily message cap on AI endpoints (replaces reliance on in-memory rate limiting, the PM doc's #1 risk).
- **Small fixes:** proper modal for Finish Session (replace `confirm()`), wire up dead week-card buttons.

Out of scope (deliberate deferrals): realtime voice mode (stays disabled), admin dashboard, cohort management, automated test coverage beyond the simulation harness, Supabase RLS hardening, conversation export, multi-language.

## Section 4: Claude Design handoff kit

- `design/tokens.css`: single source of design tokens matching the current violet-bloom theme.
- `design/mockups/*.html`: self-contained, pixel-faithful mockups (tokens inlined per file) for: landing, onboarding, dashboard, chat (default, streaming, and video states), takeaways with podcast player, artifact gallery, week-intro video card.
- `design/HANDOFF.md`: how to load mockups into Claude Design, the port-back workflow, and the known edit-residue checklist (baked-in selection outlines, nested empty h2 wrappers, bare divs replacing styled paragraphs, empty `<p><br></p>` placeholders, vestigial inline color spans, stray letter-spacing).
- `scripts/design/scan-residue.mjs`: greps a returned mockup for the residue patterns and prints findings, run after every Claude Design pull before porting changes into the React components.
- Built last so mockups capture the final post-update UI.

## Delivery order

1. Experience polish (fast wins; makes everything else easier to see).
2. Skippy presence system (bake-off first, then swap and week intros).
3. Curriculum completion (one week at a time, checklist plus simulation gate each).
4. Claude Design kit.

## Verification

- Polish: manual pass per item plus the debug-loop browser tester in `scripts/debug/`.
- Video: bake-off report; then one end-to-end welcome-video run against the live provider in a test account.
- Curriculum: 40-item checklist plus learner-agent simulation per week.
- Design kit: each mockup visually diffed against the running app; residue scanner run on a round-trip sample.

## Risks

- **Lemon Slice output quality** below HeyGen Avatar IV: mitigated by the bake-off gate and the HeyGen standard-engine fallback.
- **Lemon Slice API maturity** (relaunched late 2025): the provider abstraction keeps switching cost near zero.
- **Streaming regressions** in ledger/classifier timing: classifier stays post-completion; verified in the debug loop.
- **Curriculum rewrites drifting from voice:** the template checklist and simulation reports are the guard.
