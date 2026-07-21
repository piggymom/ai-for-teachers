/**
 * Podcast generation logic — extracted from the route handler
 * so it can be called directly from handleEndWeek (no HTTP round-trip).
 */

import { getConversationHistory } from "@/lib/skippy";
import { getModulePrompt } from "@/lib/modules";
import { getProfileContextForUser } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const anthropic = new Anthropic();
const openai = new OpenAI();

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

const HOST_A_VOICE: Voice = "nova";
const HOST_B_VOICE: Voice = "onyx";

interface PodcastSegment {
  speaker: "A" | "B";
  text: string;
}

// Intellectual concepts to weave in per week
const WEEK_CONCEPTS: Record<number, string> = {
  0: "workflow architecture, planning debt (time spent creating vs iterating), intrinsic motivation theory, the difference between a time problem and a systems problem",
  1: "pattern matching vs understanding, prediction engines, hallucination as confident confabulation, the 'tool not replacement' mental model, automation bias",
  2: "4C framework, cognitive load theory (fewer decisions = better output), constraint as creative focus, the difference between specific and redundant, iterative refinement",
  3: "iteration over perfection, AI as brainstorming partner vs generator, pedagogical ownership, the 'voice' problem (AI averaging vs your specificity)",
  4: "Hattie's feedback research (effect size 0.7), formative vs summative, draft vs final judgment, calibration, the difference between AI feedback and teacher feedback",
  5: "Tomlinson's differentiation framework, Universal Design for Learning (UDL), scaffolding vs simplifying, the 'easy version' trap, maintaining rigor while increasing access",
  6: "sustainable integration, knowing when NOT to use AI, personal policy as professional identity, ethical boundaries, the automation paradox",
};

function extractKeyMoments(history: { role: string; content: string }[]): string {
  const teacherMessages = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .slice(0, 10);
  return teacherMessages.map((msg, i) => `[Quote ${i + 1}]: "${msg}"`).join("\n");
}

async function generatePodcastScript(
  conversationHistory: { role: string; content: string }[],
  weekTitle: string,
  weekNumber: number,
  moduleContext: string,
  profileContext: string | null
): Promise<PodcastSegment[]> {
  const conversationText = conversationHistory
    .map((msg) => `${msg.role === "user" ? "TEACHER" : "SKIPPY"}: ${msg.content}`)
    .join("\n\n");

  const teacherQuotes = extractKeyMoments(conversationHistory);
  const isIntroWeek = weekNumber === 0;

  const prompt = isIntroWeek
    ? generateIntroWeekPrompt(conversationText, teacherQuotes, profileContext)
    : generateStandardWeekPrompt(conversationText, teacherQuotes, profileContext, weekNumber, weekTitle, moduleContext);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const scriptText = response.content[0].type === "text" ? response.content[0].text : "";
  console.log("[PODCAST] Generated script:\n" + scriptText);

  const lines = scriptText.trim().split("\n").filter((line) => line.trim());
  const segments: PodcastSegment[] = [];
  for (const line of lines) {
    const match = line.match(/^([AB]):\s*(.+)$/);
    if (match) {
      segments.push({ speaker: match[1] as "A" | "B", text: match[2].trim() });
    }
  }
  return segments.slice(0, 10);
}

function generateIntroWeekPrompt(
  conversationText: string,
  teacherQuotes: string,
  profileContext: string | null
): string {
  return `Write a 90-second podcast for a teacher who just completed onboarding. Two hosts. This is NOT a recap — it's an intellectual reframe that helps them see their situation more clearly.

HOSTS:
- Sam (A): Learning scientist. References research, explains underlying principles. Warm but substantive.
- Alex (B): Former teacher turned coach. Makes it practical, validates the struggle without cheerleading.

## TEACHER PROFILE
${profileContext || "No profile available."}

## WHAT THEY SAID (use specific details, not generic summaries)
${teacherQuotes}

## INTELLECTUAL CONCEPTS TO WEAVE IN
${WEEK_CONCEPTS[0]}

## CONVERSATION
${conversationText.slice(-3000)}

## ARC (8-10 exchanges, 200-250 words)

1. CALLBACK (A): Start with their NAME and something SPECIFIC they said. Quote or closely paraphrase.
2. DIAGNOSIS (B): Name the real problem beneath the surface. Not "you're busy" — what's the structural issue? Use a concept like "planning debt" or "workflow architecture."
3. REFRAME (A): Explain WHY this matters using a principle. "That's not a discipline problem, it's a systems problem."
4. EVIDENCE (B): Connect to their specific situation. What did they reveal that confirms this diagnosis?
5. COURSE CONNECTION (A): Name ONE specific week that addresses their core issue and explain WHY (not just "Week 3 covers lesson planning" but what they'll actually learn to do differently).
6. SECOND CONNECTION (B): Name one more week, same depth.
7. THE TENSION (A): Acknowledge their stated concern about AI honestly — don't dismiss it, reframe it.
8. SIGN-OFF (B): Brief, warm, forward-looking. No cheerleading.

## OUTPUT — ONLY this format:
A: [line]
B: [line]

STRICT RULES:
- Use their ACTUAL NAME from the profile. Never "this teacher" or "our teacher."
- 8-10 exchanges, 200-250 words
- Each line 1-3 sentences. Vary length — some short, some longer.
- NEVER say "great job", "you're doing amazing", "you're not alone"
- NEVER use generic validation. Every sentence must add intellectual substance.
- Reference at least ONE concept from the intellectual concepts list
- Do NOT include preamble, notes, or commentary — ONLY the A:/B: lines`;
}

function generateStandardWeekPrompt(
  conversationText: string,
  teacherQuotes: string,
  profileContext: string | null,
  weekNumber: number,
  weekTitle: string,
  moduleContext: string
): string {
  const nextWeekTeases: Record<number, string> = {
    1: "Next week they learn the 4C framework — a structure for telling AI exactly what you need. The key insight: most prompts fail not because they're too short, but because they're ambiguous at the wrong decision points.",
    2: "Next week they apply this to lesson planning — and here's what most people get wrong: they ask AI to write the whole lesson instead of using it as a brainstorming partner. That's the difference between getting generic output and getting something that sounds like you.",
    3: "Next week is feedback and assessment — and here's the thing Hattie's research shows: feedback has an effect size of 0.7, but only when it's specific and actionable. AI can draft that specificity at scale, but the teacher has to calibrate it.",
    4: "Next week is differentiation — and most teachers think it means 'make an easier version.' It doesn't. It means maintaining rigor while changing access. That distinction changes everything about how you prompt.",
    5: "Next week they build their personal AI policy — which sounds bureaucratic, but it's actually about professional identity. What role does AI play in YOUR practice? That answer is different for every teacher.",
    6: "They've finished the course. The real question now isn't 'can I use AI?' — it's 'when should I NOT use it?' That judgment is the real skill.",
  };

  return `Write a 90-second podcast for a teacher who just completed Week ${weekNumber}: ${weekTitle}. Two hosts. This is NOT a recap — it's an intellectual reframe that helps them see what they learned in a deeper way.

HOSTS:
- Sam (A): Learning scientist. References research, explains underlying principles. Warm but substantive.
- Alex (B): Former teacher turned coach. Makes it practical, connects to classroom reality.

## TEACHER PROFILE
${profileContext || "No profile available."}

## WHAT THEY SAID (use specific details)
${teacherQuotes}

## CONVERSATION
${conversationText.slice(-3000)}

## INTELLECTUAL CONCEPTS FOR THIS WEEK
${WEEK_CONCEPTS[weekNumber] || ""}

## NEXT WEEK TEASE
${nextWeekTeases[weekNumber] || "More to come."}

## ARC (8-10 exchanges, 200-250 words)

1. CALLBACK (A): Start with their NAME and something SPECIFIC they said or built. Quote them briefly.
2. THE SHIFT (B): Name what actually changed in their thinking. Not "you learned X" — what do they understand NOW that they didn't before? Be specific.
3. THE PRINCIPLE (A): Explain WHY this matters using a real concept from the intellectual concepts list. Don't dumb it down — teachers are professionals.
4. THE EVIDENCE (B): Point to something specific from their conversation that demonstrates understanding. "When you said [X], that showed you get [principle]."
5. THE APPLICATION (A): One specific thing they can do THIS WEEK. Not vague ("try it out") — specific ("Next time you're writing a prompt and it feels too long, ask yourself: am I being specific or being redundant?").
6. THE TEASE (B): Preview next week with intellectual substance. What's the specific problem they'll tackle, and what do most people get wrong about it?
7. THE FRAME (A): One sentence that captures the meta-skill they're building. Connect this week to the larger arc.
8. SIGN-OFF (B): Brief, warm. Not cheerleader.

## OUTPUT — ONLY this format:
A: [line]
B: [line]

STRICT RULES:
- Use their ACTUAL NAME from the profile. Never "this teacher."
- 8-10 exchanges, 200-250 words
- Each line 1-3 sentences. Vary length naturally.
- NEVER say "great job", "you're doing amazing", "that's real progress"
- NEVER use generic validation. Every sentence must teach something or add substance.
- Reference at least ONE concept from the intellectual concepts list by name
- The tone is two smart colleagues who find this genuinely interesting
- Do NOT include preamble, notes, or commentary — ONLY the A:/B: lines`;
}

async function generateSegmentAudio(text: string, voice: Voice): Promise<ArrayBuffer> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice,
    input: text,
    response_format: "mp3",
  });
  return response.arrayBuffer();
}

function concatenateAudioBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }
  return result.buffer;
}

/**
 * Generate a podcast for a given user + week.
 * Called directly from handleEndWeek (no HTTP needed).
 * Returns true if generated successfully, false otherwise.
 */
export async function generatePodcast(userId: string, week: number): Promise<boolean> {
  const startTime = Date.now();

  try {
    // Check if already exists in DB
    const existing = await prisma.podcast.findUnique({
      where: { userId_weekNumber: { userId, weekNumber: week } },
      select: { id: true },
    });
    if (existing) {
      console.log(`[PODCAST] Already exists for week ${week}, skipping`);
      return true;
    }

    // Get conversation history and profile in parallel
    const [history, profileContext, modulePrompt] = await Promise.all([
      getConversationHistory(userId, week),
      getProfileContextForUser(userId),
      Promise.resolve(getModulePrompt(week)),
    ]);

    if (history.length === 0) {
      console.log(`[PODCAST] No conversation for week ${week}, skipping`);
      return false;
    }

    const weekTitle = modulePrompt?.title || `Week ${week}`;
    const moduleContext = modulePrompt?.prompt || "";

    console.log(`[PODCAST] Generating script for week ${week} (${history.length} messages)...`);

    const segments = await generatePodcastScript(history, weekTitle, week, moduleContext, profileContext);
    if (segments.length === 0) {
      console.error("[PODCAST] Failed to generate script");
      return false;
    }

    const transcriptText = segments
      .map((s) => `${s.speaker === "A" ? "Sam" : "Alex"}: ${s.text}`)
      .join("\n");

    console.log(`[PODCAST] Generated ${segments.length} segments, generating audio...`);

    // Generate audio in batches
    const audioBuffers: ArrayBuffer[] = [];
    const BATCH_SIZE = 3;

    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      const batch = segments.slice(i, i + BATCH_SIZE);
      const batchAudio = await Promise.all(
        batch.map((seg) =>
          generateSegmentAudio(seg.text, seg.speaker === "A" ? HOST_A_VOICE : HOST_B_VOICE)
        )
      );
      audioBuffers.push(...batchAudio);
    }

    const finalAudio = concatenateAudioBuffers(audioBuffers);

    // Save to DB
    await prisma.podcast.upsert({
      where: { userId_weekNumber: { userId, weekNumber: week } },
      update: { audioData: Buffer.from(finalAudio), transcript: transcriptText },
      create: { userId, weekNumber: week, audioData: Buffer.from(finalAudio), transcript: transcriptText },
    });

    console.log(`[PODCAST] Complete for week ${week} - ${Date.now() - startTime}ms`);
    return true;
  } catch (error) {
    console.error(`[PODCAST] Generation failed for week ${week}:`, error);
    return false;
  }
}
