# UX Recommendations — AI for Teachers

> Prioritized improvements organized by implementation complexity and impact.
> **Priority Score** = Impact / Complexity (higher is better — fix these first).

---

## Quick Wins (< 30 min each, implement now)

These require minimal code changes with outsized UX impact.

### QW-1: Add onClick handlers to week card buttons
**Problem:** "Continue →" and "Start →" buttons have no click handler — they're decorative. Teachers clicking the button directly get no response.
**Fix:** Add `onClick={() => router.push(`/week-${weekNumber}`)}` to both buttons in `week-card.tsx`.
**Files:** `app/components/week-card.tsx`
**Complexity:** Low | **Impact:** High | **Priority:** 10

### QW-2: Add error boundary at app root
**Problem:** Any unhandled error crashes to white screen.
**Fix:** Create `app/error.tsx` with a friendly "Something went wrong" message and "Try again" button.
**Files:** `app/error.tsx` (new)
**Complexity:** Low | **Impact:** High | **Priority:** 10

### QW-3: Show onboarding submit error
**Problem:** If `saveOnboardingProfile()` fails, the button just re-enables with no feedback.
**Fix:** Add an error state and display "Something went wrong. Please try again." below the submit button.
**Files:** `app/onboarding/page.tsx`
**Complexity:** Low | **Impact:** High | **Priority:** 10

### QW-4: Add "Finish Session" confirmation
**Problem:** Clicking "Finish Session" immediately ends the session with no confirmation.
**Fix:** Add `if (!confirm("Ready to finish? Your artifacts will be saved.")) return;` before the API call.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

### QW-5: Auto-add subject on blur/continue
**Problem:** Teachers may type a subject but not explicitly press Enter or "Add", losing it.
**Fix:** Call `addSubject()` in an `onBlur` handler on the subject input, and before advancing steps.
**Files:** `app/onboarding/page.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

### QW-6: Fix send button visibility
**Problem:** Send button is gray-on-gray, disabled state barely distinguishable.
**Fix:** Make send button teal (`bg-[#20B2AA]`) when input is present, gray when empty/disabled.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Low | **Priority:** 5

### QW-7: OS-aware keyboard shortcut hint
**Problem:** "Cmd+Enter to send" is wrong on Windows.
**Fix:** Detect OS via `navigator.platform` and show "Ctrl+Enter" on non-Mac systems.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Low | **Priority:** 5

### QW-8: Use Next.js Link in breadcrumbs
**Problem:** `<a href>` tags in takeaways breadcrumbs cause full page reloads.
**Fix:** Replace `<a href="/home">` with `<Link href="/home">` from `next/link`.
**Files:** `app/components/takeaways-content.tsx`
**Complexity:** Low | **Impact:** Low | **Priority:** 5

### QW-9: Make reflection prompt non-interactive
**Problem:** Dashed border on "Quick Reflection" suggests an input field, but it's static text.
**Fix:** Remove the dashed border styling or add a subtle textarea for actual input.
**Files:** `app/components/takeaways-content.tsx`
**Complexity:** Low | **Impact:** Low | **Priority:** 4

### QW-10: Add "Back to Dashboard" link in chat header
**Problem:** From the chat view, the only way out is "Finish Session" or browser back.
**Fix:** Add a home icon or "Dashboard" link in the chat header next to the week title.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

---

## Structural Improvements

### S-1: Implement response streaming
**Problem:** Teachers wait 10-30 seconds seeing only "Thinking..." before a complete response appears. This is the core experience and the wait feels like something is broken.
**Solution:** Replace the JSON response pattern in `/api/skippy` with Server-Sent Events (SSE). Use Anthropic's streaming API. Render text incrementally in the chat UI as tokens arrive. The `isStreaming` state and cursor animation already exist in the code — they just need real data.
**Files:** `app/api/skippy/route.ts`, `app/components/skippy-chat.tsx`
**Complexity:** High | **Impact:** High | **Priority:** 5

### S-2: Load real profile data on dashboard
**Problem:** `home/page.tsx` hardcodes `primaryGoal: "save_time"` and `biggestTimeDrains: []`. The personalization that Skippy provides is not reflected on the dashboard.
**Solution:** Create a `/api/profile` endpoint that returns the user's onboarding data. Fetch it alongside progress data on dashboard mount.
**Files:** `app/api/profile/route.ts` (new), `app/home/page.tsx`
**Complexity:** Low | **Impact:** High | **Priority:** 10

### S-3: Make support accessible on mobile
**Problem:** Both the support floating button and expanded panel are `hidden lg:flex`. Mobile/tablet users have no way to get help.
**Solution:** Change the floating button from `hidden lg:flex` to `flex`. For the expanded panel on mobile, use a modal overlay instead of a sidebar.
**Files:** `app/components/support-panel.tsx`
**Complexity:** Med | **Impact:** High | **Priority:** 7

### S-4: Add mobile navigation
**Problem:** On mobile, the sidebar is hidden, leaving no persistent navigation. Teachers on tablets/phones must scroll to find the auth button and have no quick access to dashboard, chat, or artifacts.
**Solution:** Add a bottom tab bar component visible on `lg:hidden` screens with 3-4 tabs: Home, Chat (current week), Artifacts, Profile.
**Files:** `app/components/mobile-nav.tsx` (new), `app/components/layouts/dashboard-layout.tsx`
**Complexity:** Med | **Impact:** High | **Priority:** 7

### S-5: Add message retry on failure
**Problem:** Failed messages are lost. The error banner says something went wrong but the teacher's text is gone.
**Solution:** Keep failed messages in the message array with a `status: "failed"` flag. Render them with a red border and a "Retry" button that resends the same text.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Med | **Impact:** Med | **Priority:** 5

### S-6: Add markdown rendering to chat
**Problem:** Skippy uses markdown (bold, lists, code) but messages render as plain text. Asterisks and dashes appear literally.
**Solution:** Add `react-markdown` (or similar lightweight renderer) to assistant message bubbles. Sanitize output.
**Files:** `app/components/skippy-chat.tsx`, package.json
**Complexity:** Med | **Impact:** Med | **Priority:** 5

### S-7: Auto-grow textarea
**Problem:** Chat input is fixed at 1 row. Multi-line messages scroll inside a tiny box.
**Solution:** Add auto-grow behavior: set textarea height to `scrollHeight` on change, capped at ~120px. Reset on send.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

### S-8: Calculate real progress percentage
**Problem:** In-progress week cards show a hardcoded 40% progress bar.
**Solution:** Fetch the exchange count or phase from the ledger and calculate actual progress. Map phases: discover=25%, build=50%, refine=75%, reflect=90%, save=100%.
**Files:** `app/components/week-card.tsx`, `app/components/week-cards-grid.tsx`
**Complexity:** Med | **Impact:** Med | **Priority:** 5

### S-9: Add profile editing
**Problem:** Profile is set once at onboarding with no way to update. Teachers can't change their role, grade level, or goals.
**Solution:** Add a `/settings` page with the same form fields as onboarding, pre-populated with current data. Link from the auth button dropdown or sidebar.
**Files:** `app/settings/page.tsx` (new), `app/api/profile/route.ts`
**Complexity:** Med | **Impact:** Med | **Priority:** 5

### S-10: Consolidate data fetching
**Problem:** Dashboard, sidebar, and artifact gallery each make independent API calls for overlapping data.
**Solution:** Create a single `/api/dashboard` endpoint returning profile + progress + artifacts. Use React context or pass data as props.
**Files:** `app/api/dashboard/route.ts` (new), `app/home/page.tsx`
**Complexity:** Med | **Impact:** Low | **Priority:** 3

### S-11: Add not-found and loading pages
**Problem:** No custom 404 page or Suspense-based loading boundaries.
**Solution:** Create `app/not-found.tsx` with branded design and navigation. Add `app/loading.tsx` with the existing skeleton pattern.
**Files:** `app/not-found.tsx` (new), `app/loading.tsx` (new)
**Complexity:** Low | **Impact:** Med | **Priority:** 7

### S-12: Add copy button to assistant messages
**Problem:** Teachers can't easily copy a specific Skippy response. They have to manually select text.
**Solution:** Add a small "Copy" icon that appears on hover over assistant message bubbles.
**Files:** `app/components/skippy-chat.tsx`
**Complexity:** Low | **Impact:** Low | **Priority:** 5

### S-13: Show compact phase indicator on mobile
**Problem:** Phase indicator is `hidden md:block`. Mobile users have no session progress feedback.
**Solution:** Show a simple horizontal progress bar below the chat header on mobile with phase labels.
**Files:** `app/components/skippy-chat.tsx`, `app/components/chat-phase-indicator.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

### S-14: Pass real email to support
**Problem:** Support panel sends `email: "via-chat@support.local"` — support team can't respond.
**Solution:** Access the user's session email and include it in the contact API call.
**Files:** `app/components/support-panel.tsx`
**Complexity:** Low | **Impact:** Med | **Priority:** 7

---

## Implementation Priority Matrix

### Tier 1: Do Now (High Impact, Low Complexity)
| Item | Type | Time Estimate |
|------|------|---------------|
| QW-1: Fix button click handlers | Quick win | 5 min |
| QW-2: Add error boundary | Quick win | 15 min |
| QW-3: Show onboarding error | Quick win | 10 min |
| S-2: Load real profile data | Structural | 30 min |
| QW-10: Dashboard link in chat | Quick win | 10 min |
| S-11: Not-found + loading pages | Structural | 20 min |

### Tier 2: Do Next (High Impact, Medium Complexity)
| Item | Type | Time Estimate |
|------|------|---------------|
| S-3: Mobile support access | Structural | 45 min |
| S-4: Mobile bottom nav | Structural | 1-2 hours |
| S-7: Auto-grow textarea | Structural | 20 min |
| S-13: Mobile phase indicator | Structural | 30 min |
| S-14: Real email in support | Structural | 15 min |

### Tier 3: Do Soon (Medium Impact)
| Item | Type | Time Estimate |
|------|------|---------------|
| QW-4: Finish Session confirmation | Quick win | 5 min |
| QW-5: Auto-add subject on blur | Quick win | 10 min |
| S-5: Message retry | Structural | 1 hour |
| S-6: Markdown rendering | Structural | 45 min |
| S-8: Real progress bar | Structural | 1 hour |
| S-9: Profile editing page | Structural | 2 hours |
| S-12: Copy button on messages | Structural | 20 min |

### Tier 4: Do When Possible (High Impact, High Complexity)
| Item | Type | Time Estimate |
|------|------|---------------|
| S-1: Response streaming | Structural | 4-8 hours |

---

## Architecture Notes

### Card click pattern (QW-1, #12, #14)
The current pattern of making the entire card clickable while also having buttons inside is an anti-pattern. The buttons either need their own handlers (which they currently lack) or the card should only be clickable through explicit buttons. Recommended: remove the card-level `onClick` and add handlers to each button. This is more accessible (keyboard navigation works correctly) and eliminates the `stopPropagation` hacks.

### Data architecture (S-2, S-10)
The home page currently fetches session + progress separately, and the profile data is never loaded from the database. The artifact gallery and sidebar also make independent requests. A single `/api/dashboard` endpoint returning `{ profile, progress, artifacts, participants }` would reduce requests from 4+ to 1 and ensure the profile personalization actually works.

### Mobile-first (S-3, S-4, S-13)
Teachers are time-poor and may access the platform from personal phones during commutes or lunch breaks. The current `hidden lg:flex` pattern on the sidebar, support panel, and phase indicator removes significant functionality for mobile users. A bottom tab bar and accessible support button would address the most critical mobile gaps.

### Streaming (S-1)
This is the single highest-impact change but also the most complex. The existing code already has `isStreaming` state and streaming cursor UI (`animate-pulse |`) — they're just not connected to actual streaming data. When implemented, it transforms the core experience from "wait and wonder" to "watch Skippy think in real time."
