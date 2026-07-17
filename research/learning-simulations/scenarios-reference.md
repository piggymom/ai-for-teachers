# Scenarios Reference

All 11 disciplines share the same spine: 16 turns, 4 rounds, 3 reflection breaks. Each starts at 50 on a 0-100 scale (some exceptions noted) with a single resource meter that gets spent on choices and replenished by reflection. Each has one "special mechanic" that fires at unpredictable points to add stakes.

What varies: stats, role, narrative framing, special mechanic, the resource being spent, and the framing of the failure state.

## Matrix

| Discipline | Role | Stats (start at 50 unless noted) | Resource | Special Mechanic | Time Unit |
|---|---|---|---|---|---|
| Business Management | General Manager | Revenue / Customer Satisfaction / Employee Morale / Reputation | Budget | Market Pulse (boom / bust / stable round modifier) | Quarter |
| Accounting | Senior Accountant | Accuracy / Client Trust / Compliance / Firm Profit | Billable Hours | Audit Roulette (random IRS / state audit) | Quarter |
| Finance | Financial Advisor | Portfolio Value / Risk Exposure (35) / Client Confidence / Compliance Score | Capital | Market Shock (sudden volatility event) | Quarter |
| Culinary Arts | Head Chef & Owner | Food Quality / Customer Reviews / Budget / Kitchen Morale | Energy | Critic's Table (Lowell Sun food critic visit) | Week |
| Fashion Merchandising | Merchandising Director | Trend Score / Sales / Brand Image / Inventory Health | Influence | Trend Forecast (one-time future-peek) | Season |
| Entrepreneurship | Founder & CEO | Innovation / Funding / Market Fit (30) / Team | Hustle | Pivot Point (one-time full pivot) | Sprint |
| Paralegal Studies | Lead Paralegal | Case Progress / Client Satisfaction / Accuracy / Firm Reputation | Work Hours | Discovery Bombshell (case-changing revelation) | Week |
| Criminal Justice | Program Director | Public Safety / Community Trust / Rehabilitation / Program Budget | Authority | Cold Case File (resurfacing community incident) | Month |
| Education | Program Coordinator | Student Success / Enrollment / Budget / Faculty Morale | Initiative | Accreditation Visit (periodic review) | Semester |
| Personal Finance | MCC Graduate | Net Worth (35) / Emergency Fund (15) / Credit Score / Financial Stress (45) | Monthly Income | Life Happens (random life event) | Month |
| Hotel Management | General Manager | RevPAR / Guest Satisfaction / Staff Retention / Brand Equity | GM Capacity | Moments of Truth (high-stakes guest moment) | Week |

Note: Personal Finance is the most punishing of the eleven by design. Three of its four meters start below 50, and "Financial Stress" is inverted (lower is better). Captured run failed at turn 3 with the title "One Emergency Away" and an F grade chip. The other ten use the standard 50-50-50-50 starting symmetry.

## Sample first-turn (Business Management)

Topic chip: `LEGAL_AND_COMPLIANCE`
Title: "A Local Designer Claims You Copied Their Product Design"
Setup (paragraph): small Lowell manufacturing company hit with a patent infringement claim from a local designer. Three-year-old patent on file. Choice required.
Surfaced key terms (highlighted in the prose): Patent, Licensing Agreement.

Choice options A through G with budget cost shown on right:
- A. Hire top IP lawyer, fight in court (Budget: 20)
- B. Negotiate licensing agreement (Budget: 8)
- C. Redesign product, stop selling current version (Budget: 14)
- D. Apologize, offer small settlement (Budget: 6)
- E. Find other Merrimack Valley companies using this design, build joint defense (Budget: 10)
- F. Ask MCC IP expert for free or low-cost advice first (Budget: 4)
- G. Wait one month to see if designer actually sues (Budget: 0)

After choosing A: outcome modal with narrative paragraph ("Legal fees are very high. The public learns about the lawsuit and many customers worry about buying from you...") and stat deltas: Revenue 50 → 42 (-8), Customer Satisfaction 50 → 47 (-3), Employee Morale 50 → 48 (-2), Reputation 50 → 45 (-5), Budget Spent 20.

Notable design choices in this single example:
- 7 options is unusually generous. Most decision-game UI caps at 4. The seven-way choice avoids the "obvious right answer + decoy" trap that ruins most ed-game decision design.
- Cost varies meaningfully (0 to 20 of 100 starting budget). The "wait" option costs nothing, the lawsuit costs 20% of total budget. The asymmetry forces resource management to interact with judgment.
- The "ask MCC IP expert for free advice" option (F) is a quiet recurring nudge: cheap, civic, depends on local infrastructure. Same pattern shows up across disciplines (Lowell National Park partnerships in hotel, Middlesex Community College referrals in personal finance, etc.). It is the platform's worldview embedded in the choice space.
- Outcome paragraph is specific enough to teach ("the public learns about the lawsuit") rather than generic ("you lose stats"). This is consistently good across the eleven.

## Reflection prompts (mid-game, captured)

Triggered roughly every 5-6 turns. Each prompt is template-shaped per discipline.

| Discipline | Sample prompt |
|---|---|
| Business Management | "What assumptions are guiding your business decisions? Think about what you believe makes a business successful. Are you prioritizing short-term profits or long-term relationships?" |
| Criminal Justice | "What values guide your justice decisions? Think about how you balance punishment, prevention, and rehabilitation." |
| Entrepreneurship | "What assumptions underlie your startup strategy? Think about what you believe about your customers, market, and product." |
| Culinary Arts | "Where do quality and business clash? Are you chasing perfection, popularity, or profitability?" |
| Personal Finance | "What assumptions are guiding how you spend and save? How do emotions affect your financial decisions?" |

Common UI: 4 sentence-starter chips ("My approach is...", "I'm balancing...", "I notice I tend to...", "I prioritize..."), free-text area, Skip button, and a reward button labeled "Save & Continue (+10 [Resource])". The reward varies by discipline: +10 Budget, +10 Authority, +10 Hustle, etc. The line "Reflecting replenishes your [resource]" sits underneath.

## Failure state (Personal Finance, captured)

Title card: "One Emergency Away"
Final stats with red bars
Grade chip: F
Stats summary: 1 Decision / 1 Month / 0 Reflections
Narrative line: "A flat tire or ER visit was all it took. Without a safety net, a single bad month cascaded into disaster."
Buttons: "View Decision History (1 decisions)", "Try Another Discipline", "Play Again"

This is the strongest single moment of writing in the simulation. The narrative text is recognizable, not abstract; the Decision History affordance turns the failure into a debrief opportunity. Other disciplines have analog failure titles in the bundle source ("Best of the Valley", "Program of the Year", "Financial Freedom" for success states; "Chronic budget problems led to program defunding", "Community trust collapsed", "Mass turnover hollowed out the front desk" for failures).
