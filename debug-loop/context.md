## Bug Description
check that the homepage loads without console errors and shows week cards

## Reproduction
URL: http://localhost:3000/home
Steps: load the page, wait 2s

## Project Structure (Next.js App Router)
```
app/home/layout.tsx
app/home/page.tsx
app/week-4/layout.tsx
app/week-4/page.tsx
app/week-3/layout.tsx
app/week-3/page.tsx
app/week-2/layout.tsx
app/week-2/page.tsx
app/week-5/layout.tsx
app/week-5/page.tsx
app/auth/signin/page.tsx
app/postit-viz/page.tsx
app/week-0/layout.tsx
app/week-0/page.tsx
app/components/week-layout.tsx
app/components/require-profile.tsx
app/components/course-sidebar.tsx
app/components/chat-phase-indicator.tsx
app/components/podcast-player.tsx
app/components/contact-modal.tsx
app/components/takeaways-content.tsx
app/components/artifact-gallery.tsx
app/components/skippy-avatar/skippy-avatar.tsx
app/components/skippy-avatar/index.ts
app/components/layouts/dashboard-layout.tsx
app/components/skippy-chat.tsx
app/components/week-card.tsx
app/components/dashboard-header.tsx
app/components/sign-in-button.tsx
app/components/welcome-video.tsx
app/components/auth-button.tsx
app/components/week-cards-grid.tsx
app/components/support-panel.tsx
app/components/debug/ledger-debug-panel.tsx
app/components/providers.tsx
app/week-6/layout.tsx
app/week-6/page.tsx
app/week-1/layout.tsx
app/week-1/page.tsx
app/layout.tsx
app/actions/progress.ts
app/actions/onboarding.ts
app/error.tsx
app/api/artifacts/route.ts
app/api/artifacts/[id]/route.ts
app/api/ledger/route.ts
app/api/contact/route.ts
app/api/progress/route.ts
app/api/skippy/route.ts
app/api/auth/[...nextauth]/route.ts
app/api/health/route.ts
app/api/user/delete/route.ts
app/api/user/export/route.ts
app/api/welcome-video/route.ts
app/api/realtime/token/route.ts
app/api/consent/route.ts
app/api/tts/route.ts
app/api/podcast/route.ts
app/api/stats/participants/route.ts
app/api/debug/ledger/route.ts
```

### Iteration 1
Fix: app/home/page.tsx
Console errors: none
Result: VERDICT: FAIL
EXPLANATION: The homepage loads without console errors, but instead of showing week cards, it displays a sign-in page with "Sign in to AI for Teachers" and Google authentication options. This suggests the user is not authenticated or the route is redirecting to a login page.
NEXT: Check if authentication is required for the homepage or if there's a routing issue redirecting to the sign-in page instead of displaying the expected week cards.
