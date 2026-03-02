# UX Friction Audit — AI for Teachers

> Comprehensive analysis of every friction point in the user experience.
> Severity: **High** = blocks or confuses users, **Med** = slows users down, **Low** = minor annoyance.

---

## User Journey Maps

### Journey 1: New User (Signup → First Session)
```
Landing page → Sign in with Google → Onboarding (3 steps) → Dashboard → Week 0
```
**Steps:** 7-9 clicks minimum
**Time:** ~3-5 minutes (onboarding form is the bottleneck)

### Journey 2: Returning User (Login → Continue)
```
Landing page → Sign in → Dashboard → Continue Week X → Chat
```
**Steps:** 3 clicks
**Time:** <30 seconds (fast — good)

### Journey 3: Artifact Flow
```
Chat with Skippy → Finish Session → Dashboard → Scroll to Artifact Gallery → View → Copy
```
**Steps:** 4-5 clicks
**Time:** ~1 minute

### Journey 4: Takeaways Flow
```
Dashboard → Week Card "Takeaways" button → Takeaways page → Podcast / Artifacts / Next Week
```
**Steps:** 2-3 clicks
**Time:** ~30 seconds

---

## Friction Audit Table

### Authentication & Onboarding

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 1 | Onboarding Step 3 | `goalDetails` is required but unclear what "enough" is | Med | Teachers may type one sentence and wonder if it's sufficient. No character count, no example of a good response length. | Add a subtle character hint ("A few sentences is great") or show the placeholder as a filled example they can edit. |
| 2 | Onboarding Step 1 | Subject input requires explicit "Add" button or Enter key | Med | Teachers may type a subject and click "Continue" without adding it. The subject would be lost. No visual indicator that subjects need to be explicitly added. | Auto-add subject on blur or when Continue is clicked. Show a helper: "Press Enter to add." |
| 3 | Onboarding Step 2 | Only 2 fields — feels thin | Low | Step 2 has just AI experience level (required) and constraints (optional). The step feels disproportionately short compared to Steps 1 and 3. | Consider merging Step 2 into Step 1 (2-step onboarding instead of 3) or adding a brief warm-up question. |
| 4 | Onboarding | No way to go back and edit after submission | Med | Profile is set once at onboarding with no edit profile page. If a teacher changes roles or grade levels, there's no way to update. | Add a Settings/Profile page accessible from the dashboard. |
| 5 | Onboarding | Submit error shows nothing | High | `handleSubmit` catch block only sets `isSubmitting = false`. No error message is shown. If the server action fails, the teacher is stuck. | Show an error message: "Something went wrong. Please try again." |

### Dashboard

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 6 | Dashboard | Profile data is hardcoded, not loaded from profile | High | `home/page.tsx:64` sets `primaryGoal: "save_time"` and `biggestTimeDrains: []` regardless of what the teacher chose in onboarding. The personalization echo in the header will always say the same thing. | Fetch actual profile data from a `/api/profile` endpoint or include it in the session response. |
| 7 | Dashboard | Three separate data fetches on mount | Med | Dashboard, sidebar, and artifact gallery each independently fetch progress data. This means 4+ network requests on page load. | Consolidate into a single `/api/dashboard` endpoint or use React context to share data. |
| 8 | Dashboard | No error state if data fails to load | Med | `home/page.tsx:71` catch block just sets `loading = false`, rendering an empty/broken dashboard with no explanation. | Show a friendly error with a retry button. |
| 9 | Dashboard | AuthButton is positioned `fixed right-6 top-6` | Low | On the dashboard, the auth button floats over content. On narrow viewports or with long names, it can overlap the header text. | Move to a proper nav bar or make position-aware of content. |
| 10 | Dashboard | Duplicate progress visualizations | Low | ProgressJourney (header) and WeekCardsGrid both show completion state. Two visual representations of the same data adds cognitive load without clarity. | Consider removing ProgressJourney from the header since the week cards already convey status clearly. |

### Week Cards & Navigation

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 11 | Week Card | Card click vs. button click confusion | Med | The entire card is clickable (navigates to week chat), but individual buttons also have click handlers with `stopPropagation`. A teacher clicking near the "Takeaways" button might accidentally enter the chat instead. | Make the card body not clickable. Only the explicit action buttons should navigate. This is clearer and more accessible. |
| 12 | Week Card | "Continue →" button doesn't actually navigate | High | The "Continue →" button for in-progress weeks is just a styled `<button>` with no `onClick` handler — it relies on the parent card's `onClick`. But if a teacher clicks the button (not the card), it does nothing because buttons don't propagate clicks to parent divs in the same way. | Add an explicit `onClick` to the Continue button. |
| 13 | Week Card | Progress bar is hardcoded to 40% | Med | `week-card.tsx:124`: `style={{ width: "40%" }}` is static. Every in-progress week shows 40% regardless of actual progress. | Calculate actual progress from exchange count or phase position. |
| 14 | Week Card | "Start →" button also has no onClick | High | Same issue as Continue button — the "Start →" button for not-started weeks has no click handler. | Add explicit onClick handlers to all action buttons. |
| 15 | Week Navigation | No way to navigate between weeks without going back to dashboard | Med | From the chat view, "Finish Session" goes to dashboard. There's no "Next Week" button in chat or breadcrumb to navigate laterally. | Add a "Back to Dashboard" link in the chat header. |

### Skippy Chat (Core Experience)

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 16 | Chat | No streaming — full response appears at once | High | Responses are fetched as complete JSON, not streamed. For long responses (which Skippy often gives), the teacher stares at "Thinking..." for 10-30 seconds with no feedback. | Implement SSE/streaming so text appears incrementally. |
| 17 | Chat | No retry mechanism on send failure | Med | If a message fails to send, the error banner appears but the message is lost. No "Retry" button, no way to resend. | Keep failed messages in the UI with a "Retry" button. |
| 18 | Chat | "Finish Session" has no confirmation | Med | Clicking "Finish Session" immediately triggers `end_week` with no "Are you sure?" dialog. A misclick ends the session prematurely. | Add a brief confirmation: "Ready to finish? Your artifacts will be saved." |
| 19 | Chat | Send button appearance is ambiguous | Low | The send button uses a gray arrow icon on a light gray background. Disabled state is barely distinguishable from enabled (opacity: 0.3 vs 1.0). | Make send button teal when input is present. Show a clear disabled state. |
| 20 | Chat | Textarea doesn't auto-grow | Low | The textarea is set to `rows={1}` with `resize-none`. For multi-line responses (common when teachers describe their context), the text scrolls inside a tiny input area. | Add auto-grow behavior: expand textarea height as content grows, up to a max height. |
| 21 | Chat | "Cmd+Enter to send" hint is wrong on Windows | Low | The hint always says "Cmd+Enter" regardless of OS. Windows/Linux users need "Ctrl+Enter". | Detect OS and show appropriate modifier key. |
| 22 | Chat | No way to copy or share a message | Low | Individual messages have no copy button. Teachers who want to save a Skippy response have to manually select and copy text. | Add a small "Copy" icon on hover for assistant messages. |
| 23 | Chat | Phase indicator hidden on mobile | Med | The 4-phase progress indicator is `hidden md:block`. Mobile users (likely many teachers on tablets/phones) have no sense of where they are in the session. | Show a compact phase indicator on mobile, or add a progress bar. |
| 24 | Chat | Opening message uses fake system message | Low | The init sequence sends `"[Session starting — deliver your opening message for this week]"` as a "user message". If conversation history is displayed, this artificial message could appear. | Use a separate `event: "opening_message"` rather than disguising it as a user message. |
| 25 | Chat | No markdown rendering in messages | Med | Skippy's responses are split on `\n\n` for paragraph spacing but no formatting is applied. Bold text, lists, code blocks appear as raw markdown characters. | Add a markdown renderer (e.g., `react-markdown`) for assistant messages. |

### Artifact Gallery

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 26 | Artifacts | No search or filter | Low | With 7+ artifacts (one per week), finding a specific one requires scrolling and scanning. | Add a simple text filter or type filter. |
| 27 | Artifacts | No edit capability | Med | Artifacts are read-only snapshots extracted at session end. Teachers can't edit, annotate, or update them after the fact. | Allow inline editing or at minimum a "Notes" field teachers can add to. |
| 28 | Artifacts | Copy fails silently without HTTPS | Low | `navigator.clipboard.writeText()` requires a secure context. On localhost without HTTPS, the copy silently fails. | Add a fallback (textarea selection trick) or show an error. |
| 29 | Artifacts | No export option | Med | Teachers can only copy individual artifacts. No way to export all artifacts as a document (PDF, doc, etc.) for offline use. | Add an "Export All" button that generates a formatted document. |

### Takeaways Page

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 30 | Takeaways | Podcast generation can fail silently | Med | PodcastPlayer presumably handles errors internally, but the parent page shows no loading/error state for the podcast section. | Ensure the podcast section clearly shows "Generating...", "Error", or "Not available" states. |
| 31 | Takeaways | "Quick Reflection" is static, not interactive | Low | The reflection prompt at the bottom is just text — no input field. It looks like it should accept a response but doesn't. | Either make it interactive (save reflection) or remove the dashed border that suggests interactivity. |
| 32 | Takeaways | Breadcrumb uses `<a href>` instead of `<Link>` | Low | Breadcrumb navigation uses raw `<a>` tags instead of Next.js `<Link>`, causing full page reloads. | Use `next/link` for client-side navigation. |

### Support Panel

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 33 | Support | Not accessible on mobile | High | Support panel is `hidden lg:flex` and the floating button is `hidden lg:flex`. Mobile/tablet users have no way to access support. | Show the floating support button on all screen sizes. |
| 34 | Support | Sends placeholder email address | Med | `support-panel.tsx:28`: sends `email: "via-chat@support.local"` — the support team can't reply. | Pull the user's actual email from the session. |
| 35 | Support | No message history persistence | Low | Support messages are stored in component state. Refreshing the page or navigating away loses the conversation. | Persist messages in the database or at minimum in localStorage. |

### Mobile Experience

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 36 | Mobile | Left sidebar completely hidden | Med | CourseSidebar with "Chat to Skippy" CTA, participant count, and help link is `hidden lg:flex`. Mobile users lose these features entirely. | Add a mobile hamburger menu or bottom navigation bar. |
| 37 | Mobile | No bottom navigation | Med | Mobile users must scroll to the top to find the auth button or navigate. No persistent bottom nav for quick access to Dashboard, Chat, Artifacts. | Add a bottom tab bar: Home, Chat, Artifacts, Profile. |
| 38 | Mobile | Chat input at bottom can conflict with mobile keyboard | Low | When the mobile keyboard appears, the input area may be pushed behind it or cause layout jumps. | Use `visualViewport` API to adjust layout when keyboard appears. |

### Error Handling (Global)

| # | Screen/Flow | Friction Point | Severity | Details | Proposed Fix |
|---|-------------|----------------|----------|---------|--------------|
| 39 | Global | No error.tsx boundary | High | No `error.tsx` files exist in the app. An unhandled error in any page crashes to a white screen with no recovery option. | Add `error.tsx` at the root and key route levels with friendly error UI and "Try again" button. |
| 40 | Global | No not-found.tsx page | Med | No custom 404 page. Invalid URLs show the default Next.js 404. | Add a branded `not-found.tsx` with navigation back to dashboard. |
| 41 | Global | No loading.tsx pages | Low | No Suspense-based loading boundaries. Initial page loads show nothing until JavaScript hydrates. | Add `loading.tsx` at route group levels for instant loading feedback. |
| 42 | Global | No offline handling | Low | No service worker or offline detection. If a teacher loses connectivity mid-session, messages silently fail. | Add a connection status indicator and queue messages for retry. |

---

## Severity Summary

| Severity | Count | Examples |
|----------|-------|---------|
| **High** | 8 | No error boundaries, profile data hardcoded, buttons without handlers, no streaming, no mobile support access |
| **Med** | 19 | No retry on error, no confirmation dialogs, no markdown rendering, hidden mobile features |
| **Low** | 15 | Minor visual issues, OS-specific hints, static reflection box |

---

## Top 5 Critical Fixes

1. **Add error boundaries** (#39) — An unhandled error leaves teachers on a white screen with no recovery. This is the single most damaging UX gap.

2. **Fix button click handlers** (#12, #14) — The "Continue →" and "Start →" buttons on week cards have no onClick handlers. Teachers clicking these buttons directly may think the app is broken.

3. **Load real profile data** (#6) — The dashboard hardcodes `primaryGoal: "save_time"` instead of loading the teacher's actual onboarding responses. The personalization promise is broken.

4. **Add streaming responses** (#16) — 10-30 second waits with only "Thinking..." and no incremental feedback is the single biggest friction point in the core experience.

5. **Make support accessible on mobile** (#33) — Mobile/tablet users have zero access to support. The floating button and panel are both `hidden lg:flex`.
