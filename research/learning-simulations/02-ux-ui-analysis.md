# UX / UI Analysis: MCC Decision Lab

What's actually wrong, what's actually good, and what's missing to make it beautiful.

This analysis is about visual and interaction design, not learning design (see 01-). The two interact: a polished surface would make the substantive learning ideas land much harder. The substantive learning ideas would survive a polish; the polish would not survive without them.

## What is actually working

Quick honest list before the criticism, because there's more here than the homepage suggests.

**Information hierarchy on the discipline detail card.** Role title, location strap, three-line synopsis, four stat icons with one-line definitions, the special mechanic with its own explanatory paragraph, then a clearly labeled time horizon ("16 quarters", "16 sprints", "16 months"). A new user knows what they are walking into in about 8 seconds.

**Choice cards.** A through G letters on the left, choice text in the middle, resource cost chip on the right, light selection state. This is restrained. The typical ed-game UI fails the "obvious right answer plus three decoys" trap. Seven options at varied costs (0 to 20) defeats that trap by design.

**Decision Made modal.** Outcome paragraph, then four stat rows with before-arrow-after readouts, then resource spent, then Continue. Compact, readable, the delta arrows do real work.

**Reflection break.** Title + stat strip + question + sub-prompt + four sentence-starter chips + textarea + Skip + "Save & Continue (+10 [Resource])". The mechanical reward for reflecting and the small line of copy underneath ("Reflecting replenishes your [Resource]") together do a great deal of work to defeat the "skip the reflection" instinct that ed-tech usually lets win. This is good design.

**Failure card on Personal Finance.** Title typography ("One Emergency Away"), warm-orange gradient, F-grade chip, "View Decision History" affordance offering the debrief. This is the most emotionally complete moment in the whole simulation.

**Local-flavor specificity.** Lowell, Merrimack Valley, MCC, the National Park, the Sun food critic. The system never goes generic. This is rare and is doing more for engagement than the visual design recognizes.

## What is actually wrong

### 1. One dashboard for eleven disciplines

Every single discipline uses the identical chrome: same gridded green-and-white background, same hand-drawn brick buildings ghost-imaged behind the modal, same translucent illustrations across the canvas. A restaurant scenario and a community justice scenario feel visually identical. The only thing that changes is the text in the title bar and the role illustration on the picker.

This is the single biggest design failure in the system. Eleven distinct professions are made to feel like one job. The setting that matters most for immersion (am I in a kitchen, a courtroom, a hotel lobby, a finance desk?) is undifferentiated.

### 2. Source Serif 4 used at all sizes as UI type

The display font is appropriate for the hero title, the discipline name, the long-form intro narrative. It looks bookish and serious there.

It is then used for modal titles, dashboard chrome, choice card section headers, every "Decision Made" header, every "Reflection Break" header. At smaller sizes on a dashboard surface it reads as textbook PDF, not interactive software. It fights the gamified pretense the system has otherwise committed to.

The fix is straightforward: keep Source Serif 4 for the hero, the discipline name, the scenario intro narrative paragraph, and the failure-card title. Use Inter (or Inter Tight) for everything else: dashboard labels, modal titles, button text, choice cards, stat labels.

### 3. Default shadcn indigo + green/red status

Indigo `#6366f1` (the most common color in the bundle) is the default Tailwind/shadcn primary. It has been used so consistently in ed-tech and dev-tool UI for the last three years that it now reads as "Replit project, hasn't met a designer." Same with the success-green / danger-red status semantics.

No discipline has its own palette. A culinary sim could be amber and oxblood. A finance sim could be navy and money green. A community justice sim could be civic blue with warm accent. Right now they are all the same indigo.

### 4. The five-stat top bar is hard to scan

Each stat is shown as a colored bar with a tiny numeric readout and a small icon. Five of them sit shoulder-to-shoulder across the top, plus the resource meter on the far right. There is no big-number readout for any single stat, no trend indicator (am I rising or falling), no recent-history sparkline.

This matters because the entire game asks the player to monitor whether any stat is approaching the death zone. The current presentation makes that monitoring labor: you have to consciously read each bar, parse the number, and remember whether it's worse than last turn.

A "biggest mover this turn" callout, or a compact sparkline per stat, or a single highlighted critical-stat alert, would all help.

### 5. Every modal is the same modal

Decision Made, Reflection Break, Special Mechanic Trigger, Failure Card all use the same general dialog pattern: white card, centered, dim background. This flattens what should feel like different cognitive moments. A decision outcome is a feedback beat. A reflection prompt is a slow-down beat. A special-mechanic trigger should feel like a stakes-raise. They should look and feel different.

Specifically:
- Decision Made should feel snappy, animated, almost ticker-tape (numbers rolling up or down)
- Reflection Break should feel quieter, slower, with reduced visual noise around the prompt to make the writing affordance the only thing on screen
- Special-mechanic events (Audit Roulette, Critic's Table, Cold Case File) should feel like a moment of dread or excitement: full-screen takeover, distinctive type, sound cue

Right now they all whisper at the same volume.

### 6. "Generating scenario..." loading state is broken

The 3-8 second wait between turns while the LLM produces the next event currently shows the literal text "Generating scenario..." in the modal area. No animation, no skeleton state, no preview of what category of event is loading. It feels like a bug. Players wait, see nothing, wait more, then a wall of text appears.

A typewriter-style streaming reveal of the title as it generates, or a skeleton card with the topic chip filling in first, or even a thoughtful "consulting your books..." flavor line per discipline, would all be better than the current state.

### 7. No sense of progression or arc

The only progress indicator is "Quarter 1 of 16" in the top bar. There is no visible roadmap, no chapter break, no narrative crescendo. Sixteen turns is a lot of repetition of the same Decision Made → Continue → Next Turn loop.

The system already has a natural three-act structure (3 reflection breaks divide the game into 4 rounds). The UI does almost nothing with that structure. A simple horizontal timeline ribbon at the top, showing where in the journey you are with the three reflection breaks marked, would make the run feel like a story instead of a treadmill. Each round transition could carry a beat-defining card ("Q3: Holiday Season opens with new pressure on inventory").

### 8. Choice cards offer no preview

The choice card shows: option letter, option text, resource cost. It does not show: which stat this might affect, what kind of risk this carries, what the "optimistic" and "pessimistic" outcomes look like. A student picks blind every turn, learns the consequences after.

That blindness is partly intentional (it's how you simulate decision-under-uncertainty), but the system could afford to show *something*: an icon hinting which stat is most at stake (a stake icon, not a prediction), a risk level chip ("low risk", "high risk"), even just a different visual treatment for the cheap-and-passive option (G, "wait one month, do nothing") versus the expensive-and-aggressive option (A, "hire top lawyer, sue").

### 9. The role-illustration set on the picker is inconsistent

Eleven discipline cards, each with a person illustration. Some are drawn against plain colored backgrounds, some against textured patterns. The drawing style varies. Some have stronger contrast than others. They look like multiple AI-generation passes that were not unified.

Either commission a consistent set, or apply a global treatment (duotone, color overlay, frame) that makes the inconsistency invisible.

### 10. "Exit Simulation" is full prominence

The button to abandon the run sits in the top toolbar at full styling, no confirmation. Easy to misclick after 30 minutes of play. Should be tucked behind a settings menu or require a confirmation modal.

### 11. No mid-game history

You cannot pull up "what did I pick on turn 4 and what happened?" without exiting. For a 16-turn game with a debriefable arc, this is a significant gap. A drawer accessible at any time showing the last few turns at a glance would help students reason about their own pattern (which is, recursively, the entire point of the system).

### 12. No micro-feedback on numbers

When a stat moves from 50 to 47, the number changes. There is no animation, no easing, no satisfying tick, no haptic cue, no celebratory beat for big wins, no thud for big losses. Game design 101 says these "juice" beats are what make repeated mechanics feel fresh on the 14th rep. The system has none of them.

### 13. Mobile is unaddressed

The five-stat top bar plus dashboard plus modals plus choice cards have not been designed for phone-width. A 16-turn experience that takes 30+ minutes on a desktop is exactly the kind of thing students will try to do on a phone in bed. Right now they can't.

## Smaller things worth noting

- The "Sign Out" button on every page top-right is the same prominence as the discipline title. Could be tucked in a profile menu.
- The "Click any meter for details" affordance is text-only; the meters do not visually look clickable (no hover state, no cursor change visible in screenshots).
- The "KEY TERMS" section under each scenario presents terms as colored chips in the prose. Good idea, but they are not interactive (no glossary popover, no definition on hover).
- Round and Quarter counters use two different metaphors ("Quarter 1 of 16" and "Round 1/4") that confuse rather than clarify the time structure.
- Reflection sentence-starter chips collapse on small viewports so the user can't read them without scrolling.

## What's missing to make it beautiful

A consolidated punch list, prioritized.

**Tier 1 (the things that would change everything):**

1. Discipline-specific palette and dashboard treatment. Each of 11 disciplines gets its own color story and a bespoke chrome element (kitchen ticket rail for culinary, court docket strip for paralegal, P&L ribbon for accounting, hotel registry typography for hospitality).
2. Type pairing fix. Demote Source Serif 4 to display-only. Promote Inter for all UI chrome.
3. Replace the "Generating scenario..." text with a thoughtful loading state per discipline.
4. Add a 16-turn arc ribbon showing position and the three reflection breaks.

**Tier 2 (the polish that makes it feel finished):**

5. Differentiate the four modal types. Decision Made = ticker, Reflection Break = quiet, Special Mechanic = full-takeover, Failure = warm gradient and decision-history affordance.
6. Stat-bar interactive states: hover, click affordance, sparkline of recent history, "biggest mover" callout.
7. Choice-card preview: risk-level chip and stat-at-stake icon.
8. Animated number transitions (small ticks for ±1-3, sweeping bars for ±10+, screen-shake for any meter approaching zero).
9. Mid-game decision-history drawer.
10. Mobile-responsive layout. Whole experience needs to work on a 375-width viewport.

**Tier 3 (nice to haves):**

11. Unified illustration treatment on the picker.
12. Glossary popovers on KEY TERMS chips.
13. Confirmation modal on Exit Simulation.
14. Sound design (optional, off by default): muted UI sounds for choice select, decision resolution, reflection submission, mechanic trigger, failure.
15. End-of-run "share your card" image (the Personal Finance failure card is already 80% of the way to a Wordle-style shareable artifact).

## A short note on the picker page

The picker is the strongest visual moment in the whole product. Eleven illustrated cards in a tight grid, with the detail panel sliding in on the right when one is selected. The detail panel shows the role, the synopsis, the stats with one-line definitions, the special mechanic with a paragraph of explanation, and the time horizon. This is genuinely well-designed.

The problem is the contrast with everything that comes after. The picker promises a thoughtful, illustrated, considered experience. The dashboard delivers a generic indigo Replit chrome. The eleven illustrated cards on the picker are the only place each discipline has visual identity; once you click into a sim, it disappears.

The product needs to extend the picker's care across the rest of the surface, or the picker is going to feel like the lobby of a much better product than the one you actually entered.
