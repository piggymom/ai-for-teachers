#!/usr/bin/env npx tsx
/**
 * Learner Agent — Reviews conversation quality across weeks.
 *
 * Pulls all conversations from the database and analyzes:
 *   - Is Skippy staying on-topic for each week's learning goals?
 *   - Is the teacher progressing or stuck?
 *   - Is Skippy being too generic/cheerleadery vs. substantive?
 *   - Are artifacts being co-created or just dumped?
 *   - Is the teacher's voice/context showing up in responses?
 *
 * Usage:
 *   npx tsx debug-loop/review.ts              # Review all weeks
 *   npx tsx debug-loop/review.ts --week 2     # Review specific week
 *   npx tsx debug-loop/review.ts --latest     # Review most recent conversation
 */

import { config } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";
import Anthropic from "@anthropic-ai/sdk";

config({ path: resolve(__dirname, "..", ".env.local") });

const claude = new Anthropic();

const args = process.argv.slice(2);
const specificWeek = getFlag("--week") ? parseInt(getFlag("--week")!) : null;
const latestOnly = args.includes("--latest");
const verbose = args.includes("--verbose");

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const WEEK_GOALS: Record<number, { title: string; goal: string; artifact: string }> = {
  0: {
    title: "Getting Started",
    goal: "Understand the teacher's context, goals, concerns about AI. Build rapport.",
    artifact: "None (onboarding intake)",
  },
  1: {
    title: "Understanding AI",
    goal: "Teacher should leave understanding: AI as prediction engine, hallucination, tool-not-replacement mental model, automation bias.",
    artifact: "None (conceptual foundation)",
  },
  2: {
    title: "Prompting Fundamentals",
    goal: "Teacher learns 4C framework (Context, Constraints, Command, Criteria). Should build a reusable prompt template for their specific subject/grade.",
    artifact: "Prompt template using 4C framework",
  },
  3: {
    title: "Lesson Planning",
    goal: "Use AI as brainstorming partner (not generator). Teacher maintains pedagogical ownership. Iterate on a real lesson.",
    artifact: "AI-assisted lesson plan or activity",
  },
  4: {
    title: "Feedback & Assessment",
    goal: "Apply Hattie's feedback research. Use AI for draft feedback at scale. Calibrate AI feedback vs teacher judgment.",
    artifact: "Feedback template or rubric-based prompt",
  },
  5: {
    title: "Differentiation",
    goal: "Tomlinson's framework + UDL. Scaffold vs simplify. Maintain rigor while increasing access.",
    artifact: "Differentiated materials or scaffolding prompt",
  },
  6: {
    title: "Integration & Ethics",
    goal: "Build personal AI policy. When NOT to use AI. Sustainable integration. Professional identity.",
    artifact: "Personal AI use policy",
  },
};

interface ConversationMessage {
  role: string;
  content: string;
  createdAt: Date;
}

interface WeekReview {
  week: number;
  title: string;
  messageCount: number;
  review: string;
}

async function reviewConversation(
  week: number,
  messages: ConversationMessage[],
  profileContext: string | null
): Promise<string> {
  const goals = WEEK_GOALS[week];
  if (!goals) return "Unknown week";

  const conversationText = messages
    .map((m) => `${m.role === "user" ? "TEACHER" : "SKIPPY"}: ${m.content}`)
    .join("\n\n");

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: `You are a learning design reviewer analyzing AI tutor conversations. You evaluate whether the AI tutor (Skippy) is effectively facilitating learning.

Be specific and critical. Reference exact quotes. Grade honestly — don't be nice for the sake of it.

Output this EXACT format:

## Grade: [A/B/C/D/F]

### What Worked
(2-3 specific things with quotes)

### What Didn't Work
(2-3 specific issues with quotes)

### Teacher Growth
(What did the teacher actually learn? Evidence from their messages.)

### Skippy Issues
(Generic responses? Cheerleading? Missed opportunities? Off-topic?)

### Recommendation
(One specific thing to improve for next time)`,
    messages: [
      {
        role: "user",
        content: `## Week ${week}: ${goals.title}

## Learning Goals
${goals.goal}

## Expected Artifact
${goals.artifact}

## Teacher Profile
${profileContext || "No profile available."}

## Conversation (${messages.length} messages)
${conversationText.slice(-8000)}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function generateSummary(reviews: WeekReview[]): Promise<string> {
  const reviewsText = reviews
    .map((r) => `### Week ${r.week}: ${r.title} (${r.messageCount} messages)\n${r.review}`)
    .join("\n\n---\n\n");

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: `You are a learning design lead reviewing a full course of AI tutor conversations. Synthesize the individual week reviews into an overall assessment.

Output this format:

## Overall Course Grade: [A/B/C/D/F]

### Arc Summary
(How did the teacher progress across weeks? 3-4 sentences.)

### Strongest Week
(Which week and why — one sentence)

### Weakest Week
(Which week and why — one sentence)

### Recurring Skippy Issues
(Patterns across weeks — be specific)

### Teacher Growth Trajectory
(Where did they start vs where are they now?)

### Top 3 Recommendations
1. (specific)
2. (specific)
3. (specific)`,
    messages: [{ role: "user", content: reviewsText }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findFirst({
      select: { id: true, name: true },
    });
    if (!user) {
      console.log("No user found");
      process.exit(1);
    }

    // Get profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });
    const profileContext = profile
      ? `Name: ${user.name}\nSubject: ${profile.subject}\nGrade: ${profile.gradeLevel}\nExperience: ${profile.experience}\nGoals: ${profile.goals}`
      : null;

    console.log(`\n📚 Learner Agent — Reviewing conversations for ${user.name}\n`);

    // Determine which weeks to review
    let weeksToReview: number[];
    if (specificWeek !== null) {
      weeksToReview = [specificWeek];
    } else if (latestOnly) {
      const latest = await prisma.skippyMessage.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { week: true },
      });
      weeksToReview = latest ? [latest.week] : [];
    } else {
      const weeks = await prisma.skippyMessage.findMany({
        where: { userId: user.id },
        select: { week: true },
        distinct: ["week"],
        orderBy: { week: "asc" },
      });
      weeksToReview = weeks.map((w: { week: number }) => w.week);
    }

    if (weeksToReview.length === 0) {
      console.log("No conversations found.");
      process.exit(0);
    }

    console.log(`Reviewing weeks: ${weeksToReview.join(", ")}\n`);

    const reviews: WeekReview[] = [];

    for (const week of weeksToReview) {
      const messages = await prisma.skippyMessage.findMany({
        where: { userId: user.id, week },
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true, createdAt: true },
      });

      if (messages.length === 0) {
        console.log(`Week ${week}: no messages, skipping`);
        continue;
      }

      const title = WEEK_GOALS[week]?.title || `Week ${week}`;
      console.log(`━━━ Week ${week}: ${title} (${messages.length} messages) ━━━`);

      const review = await reviewConversation(week, messages, profileContext);
      reviews.push({ week, title, messageCount: messages.length, review });

      console.log(review);
      console.log("");
    }

    // Generate overall summary if reviewing multiple weeks
    if (reviews.length > 1) {
      console.log("━━━ OVERALL SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      const summary = await generateSummary(reviews);
      console.log(summary);

      // Save full report
      const report =
        `# Conversation Review — ${user.name}\n` +
        `Generated: ${new Date().toISOString()}\n\n` +
        reviews
          .map((r) => `## Week ${r.week}: ${r.title} (${r.messageCount} messages)\n\n${r.review}`)
          .join("\n\n---\n\n") +
        "\n\n---\n\n## Overall Summary\n\n" +
        summary;

      const outPath = resolve(__dirname, "review-report.md");
      writeFileSync(outPath, report, "utf-8");
      console.log(`\n📄 Full report saved to: debug-loop/review-report.md`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
