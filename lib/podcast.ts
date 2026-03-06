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

// Course overview for Week 0 podcasts
const COURSE_OVERVIEW = `
Week 1: Understanding AI in Teaching - What AI is (and isn't), classroom-safe uses, limitations and guardrails
Week 2: Prompting Fundamentals - The 4C framework (Context, Constraints, Command, Criteria), iterating on prompts
Week 3: Lesson Planning with AI - Using AI as a brainstorming partner, generating differentiated materials
Week 4: Feedback & Assessment - Drafting feedback, rubric-aligned comments, practice questions
Week 5: Differentiation with AI - Adapting lessons for diverse learners, differentiated materials
Week 6: Integration & Ethics - Personal AI policy, ethical integration, sustainable practice
`;

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
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
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
  return `Write a SHORT 90-second podcast welcome. Two hosts, 8 exchanges max, 200 words max.

Hosts: Sam (A) = warm, curious. Alex (B) = grounded, encouraging.

## TEACHER PROFILE
${profileContext || "No profile available."}

## KEY QUOTES
${teacherQuotes}

## COURSE OVERVIEW
${COURSE_OVERVIEW}

## STRUCTURE (8 exchanges, 1-2 sentences each)
1. A: Who this teacher is + what brought them here (specific)
2. B: Their main challenge (reference one quote)
3. A: The insight — what's really going on beneath the surface
4. B: Why that matters + they're not alone in this
5. A: Connect to 1 specific course week that fits their situation
6. B: Connect to 1 more course week
7. A: Encouragement — they're in the right place
8. B: Quick sign-off

## OUTPUT — ONLY this format:
A: [line]
B: [line]

STRICT RULES:
- 8 exchanges MAXIMUM
- Each line is 1-2 sentences, never more
- 200 words total max
- Do NOT quote the teacher at length — paraphrase briefly
- Do NOT recap every topic discussed
- Do NOT include preamble, notes, or commentary
- Warm and genuine, not hyped`;
}

function generateStandardWeekPrompt(
  conversationText: string,
  teacherQuotes: string,
  profileContext: string | null,
  weekNumber: number,
  weekTitle: string,
  moduleContext: string
): string {
  const nextWeekPreview: Record<number, string> = {
    1: "Week 2 is all about prompting fundamentals—the 4C framework: Context, Constraints, Command, Criteria. They're going to learn how to get exactly what they need from AI, every time.",
    2: "Week 3 is where it gets really practical—lesson planning with AI. They'll use AI as a brainstorming partner while staying in the driver's seat.",
    3: "Week 4 tackles feedback and assessment—generating feedback drafts, rubric-aligned comments. This is where AI starts saving serious time.",
    4: "Week 5 is differentiation with AI—designing materials for diverse learners, adapting lessons so every student gets what they need. This is going to be huge for them.",
    5: "Week 6 is about integration and ethics—developing their personal AI policy and figuring out sustainable, ethical ways to keep AI in their practice.",
    6: "They've completed the course! Now it's about putting it all into practice and building those sustainable routines.",
  };

  return `Write a SHORT 90-second podcast recap for Week ${weekNumber}: ${weekTitle}. Two hosts, 8 exchanges max, 200 words max.

Hosts: Sam (A) = warm, celebrates wins. Alex (B) = names what they learned, previews what's next.

## TEACHER PROFILE
${profileContext || "No profile available."}

## KEY QUOTES
${teacherQuotes}

## WEEK ${weekNumber} CONCEPTS
${moduleContext}

## NEXT WEEK
${nextWeekPreview[weekNumber] || "More learning ahead!"}

## STRUCTURE (8 exchanges, 1-2 sentences each)
1. A: Personal hook — their role + a specific win from this session
2. B: The key thing they built or realized this week
3. A: Name one concept they now understand (from the week's objectives)
4. B: Name a second concept + tie to their goals
5. A: What they can DO with this right now
6. B: Preview next week — one specific thing to look forward to
7. A: Celebration — they should feel accomplished
8. B: Quick sign-off with energy

## OUTPUT — ONLY this format:
A: [line]
B: [line]

STRICT RULES:
- 8 exchanges MAXIMUM
- Each line is 1-2 sentences, never more
- 200 words total max
- Do NOT quote the teacher at length — paraphrase briefly
- Do NOT recap every topic — pick the ONE big takeaway
- Do NOT include preamble, notes, or commentary
- Energetic and personal, not a dry summary`;
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
