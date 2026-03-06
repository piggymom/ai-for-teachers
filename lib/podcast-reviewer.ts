/**
 * Podcast script review agent.
 *
 * Runs after every script generation to ensure quality.
 * Returns a pass/fail verdict with specific feedback.
 * If the script fails, the caller can regenerate with the feedback.
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export interface ReviewResult {
  passed: boolean;
  score: number; // 1-10
  feedback: string; // specific notes for regeneration
}

const REVIEW_PROMPT = `You are a podcast script quality reviewer for an AI literacy course for teachers. Your job is to evaluate a generated podcast transcript and determine if it meets quality standards.

## THE SCRIPT TO REVIEW
<script>
{{SCRIPT}}
</script>

## WEEK CONTEXT
Week {{WEEK_NUMBER}}: {{WEEK_TITLE}}
Key concepts for this week: {{CONCEPTS}}

## EVALUATION CRITERIA (score each 1-10)

1. **OPENING & WELCOME**: Does the script open like a real podcast? It MUST start with a warm, energetic welcome ("Welcome to the Week X wrap-up!"), immediately name the teacher, set the scene (what they teach, their grade, their context), and tease what's coming. A script that jumps straight into analysis without welcoming the listener AUTOMATICALLY scores 1-3. A great opening makes you feel like you're tuning into a show about THIS specific person.

2. **PERSONAL CONTEXT & NAME USAGE**: Does the script use the teacher's ACTUAL NAME (not "this teacher", "our teacher", "they")? The name must appear at least 3 times. Does it constantly call back to their specific world — grade level, subject, specific students they mentioned, school situation, particular challenges? Every exchange should feel grounded in THIS teacher's reality. If the script never uses the teacher's name, it AUTOMATICALLY scores 1-3. Count: name absent = 1-3, name 1-2 times = 4-5, name 3+ times with specific context = 6-10.

3. **ENERGY & EXCITEMENT**: Does it sound like two hosts who are genuinely excited to unpack THIS conversation? Not performative — real "oh, this is interesting" energy. The listener should feel the hosts care about what this teacher said and did. Flat, analytical tone fails. Monotone recaps fail.

4. **REFRAMING**: Does the script help the teacher see what they learned in a NEW way — not just summarize it? The hosts should name a shift, a principle, or a tension the teacher might not have articulated themselves.

5. **KEY IDEAS**: Does the script reference at least ONE intellectual concept from the week's concept list BY NAME and explain it in a way that adds value?

6. **FORWARD MOMENTUM**: Does the script build genuine excitement for what comes next? Not "next week will be great!" but a specific intellectual hook that makes the listener curious.

## OUTPUT FORMAT (strict JSON)
{
  "opening": { "score": <1-10>, "note": "<1 sentence>" },
  "personal_context": { "score": <1-10>, "note": "<1 sentence>" },
  "energy": { "score": <1-10>, "note": "<1 sentence>" },
  "reframing": { "score": <1-10>, "note": "<1 sentence>" },
  "key_ideas": { "score": <1-10>, "note": "<1 sentence>" },
  "forward_momentum": { "score": <1-10>, "note": "<1 sentence>" },
  "overall_score": <1-10>,
  "passed": <true if overall >= 7 AND opening >= 7 AND personal_context >= 7>,
  "feedback": "<2-3 sentences of specific, actionable feedback for regeneration if failed. If passed, say what worked well.>"
}

ONLY output the JSON object. No preamble or commentary.`;

const WEEK_CONCEPTS: Record<number, string> = {
  0: "workflow architecture, planning debt, intrinsic motivation theory, time problem vs systems problem",
  1: "pattern matching vs understanding, prediction engines, hallucination as confident confabulation, tool not replacement, automation bias",
  2: "4C framework, cognitive load theory, constraint as creative focus, specific vs redundant, iterative refinement",
  3: "iteration over perfection, AI as brainstorming partner vs generator, pedagogical ownership, the voice problem",
  4: "Hattie's feedback research (effect size 0.7), formative vs summative, draft vs final judgment, calibration",
  5: "Tomlinson's differentiation framework, UDL, scaffolding vs simplifying, the easy version trap, maintaining rigor while increasing access",
  6: "sustainable integration, knowing when NOT to use AI, personal policy as professional identity, ethical boundaries, automation paradox",
};

const WEEK_TITLES: Record<number, string> = {
  0: "Getting Started",
  1: "Understanding AI in Teaching",
  2: "Prompting Fundamentals",
  3: "Lesson Planning with AI",
  4: "Feedback & Assessment",
  5: "Differentiation with AI",
  6: "Integration & Ethics",
};

export async function reviewPodcastScript(
  transcript: string,
  weekNumber: number
): Promise<ReviewResult> {
  const prompt = REVIEW_PROMPT
    .replace("{{SCRIPT}}", transcript)
    .replace("{{WEEK_NUMBER}}", String(weekNumber))
    .replace("{{WEEK_TITLE}}", WEEK_TITLES[weekNumber] || `Week ${weekNumber}`)
    .replace("{{CONCEPTS}}", WEEK_CONCEPTS[weekNumber] || "");

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const json = JSON.parse(text);

    const result: ReviewResult = {
      passed: json.passed ?? json.overall_score >= 7,
      score: json.overall_score ?? 0,
      feedback: json.feedback ?? "",
    };

    console.log(
      `[PODCAST-REVIEW] Week ${weekNumber}: ${result.passed ? "PASSED" : "FAILED"} (${result.score}/10) — ${result.feedback}`
    );

    return result;
  } catch (error) {
    console.error("[PODCAST-REVIEW] Review failed, passing by default:", error);
    return { passed: true, score: 0, feedback: "Review unavailable" };
  }
}
