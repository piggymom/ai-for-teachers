import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConversationHistory } from "@/lib/skippy";
import { getModulePrompt } from "@/lib/modules";
import { getProfileContextForUser } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import crypto from "crypto";

const anthropic = new Anthropic();
const openai = new OpenAI();

// Cache for generated podcasts (in production, use Redis/DB)
const podcastCache = new Map<string, { audio: ArrayBuffer; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

// Two contrasting voices for the podcast hosts
const HOST_A_VOICE: Voice = "nova"; // Warm, friendly
const HOST_B_VOICE: Voice = "onyx"; // Deeper, authoritative

interface PodcastSegment {
  speaker: "A" | "B";
  text: string;
}

/**
 * Extract key quotes from the conversation for the hosts to reference
 */
function extractKeyMoments(history: { role: string; content: string }[]): string {
  const teacherMessages = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .slice(0, 10); // Focus on first 10 teacher messages

  return teacherMessages.map((msg, i) => `[Quote ${i + 1}]: "${msg}"`).join("\n");
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

/**
 * Generate a two-host podcast script from the conversation history
 */
async function generatePodcastScript(
  conversationHistory: { role: string; content: string }[],
  weekTitle: string,
  weekNumber: number,
  moduleContext: string,
  profileContext: string | null
): Promise<PodcastSegment[]> {
  // Format conversation for the prompt
  const conversationText = conversationHistory
    .map((msg) => `${msg.role === "user" ? "TEACHER" : "SKIPPY"}: ${msg.content}`)
    .join("\n\n");

  const teacherQuotes = extractKeyMoments(conversationHistory);

  // Special prompt for Week 0 (Getting Started / Intro)
  const isIntroWeek = weekNumber === 0;

  const prompt = isIntroWeek
    ? generateIntroWeekPrompt(conversationText, teacherQuotes, profileContext)
    : generateStandardWeekPrompt(conversationText, teacherQuotes, profileContext, weekNumber, weekTitle, moduleContext);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  // Parse the script into segments
  const scriptText = response.content[0].type === "text" ? response.content[0].text : "";

  console.log("[PODCAST] Generated script:\n" + scriptText);

  const lines = scriptText.trim().split("\n").filter((line) => line.trim());

  const segments: PodcastSegment[] = [];
  for (const line of lines) {
    const match = line.match(/^([AB]):\s*(.+)$/);
    if (match) {
      segments.push({
        speaker: match[1] as "A" | "B",
        text: match[2].trim(),
      });
    }
  }

  // Hard cap at 10 exchanges
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
  // What's coming next week (for the preview/hook)
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

/**
 * Generate audio for a single segment
 */
async function generateSegmentAudio(
  text: string,
  voice: Voice
): Promise<ArrayBuffer> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice,
    input: text,
    response_format: "mp3",
  });

  return response.arrayBuffer();
}

/**
 * Concatenate MP3 audio buffers (simple concatenation - works for streaming playback)
 * Note: For production, consider using ffmpeg for proper concatenation
 */
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

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { week, forceRegenerate } = await req.json();
    if (typeof week !== "number" || week < 0 || week > 6) {
      return NextResponse.json({ error: "Invalid week" }, { status: 400 });
    }

    const userId = session.user.id;
    const cacheKey = crypto
      .createHash("sha256")
      .update(`${userId}:${week}`)
      .digest("hex");

    // Check DB first (persistent), then in-memory cache
    if (!forceRegenerate) {
      const dbPodcast = await prisma.podcast.findUnique({
        where: { userId_weekNumber: { userId, weekNumber: week } },
        select: { audioData: true },
      });
      if (dbPodcast?.audioData) {
        console.log(`[PODCAST] DB HIT - ${Date.now() - startTime}ms`);
        return new NextResponse(new Uint8Array(dbPodcast.audioData), {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "X-Podcast-Cache": "DB",
          },
        });
      }

      const cached = podcastCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        console.log(`[PODCAST] Memory cache HIT - ${Date.now() - startTime}ms`);
        return new NextResponse(cached.audio, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "X-Podcast-Cache": "HIT",
          },
        });
      }
    } else {
      console.log(`[PODCAST] Force regenerate requested`);
    }

    // Get conversation history and profile in parallel
    const [history, profileContext, modulePrompt] = await Promise.all([
      getConversationHistory(userId, week),
      getProfileContextForUser(userId),
      Promise.resolve(getModulePrompt(week)),
    ]);

    if (history.length === 0) {
      return NextResponse.json(
        { error: "No conversation found for this week" },
        { status: 404 }
      );
    }

    const weekTitle = modulePrompt?.title || `Week ${week}`;
    const moduleContext = modulePrompt?.prompt || "";

    console.log(`[PODCAST] Generating script for ${history.length} messages...`);

    // Generate podcast script with full context
    const segments = await generatePodcastScript(
      history,
      weekTitle,
      week,
      moduleContext,
      profileContext
    );
    if (segments.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate podcast script" },
        { status: 500 }
      );
    }

    // Build transcript text for persistence
    const transcriptText = segments
      .map((s) => `${s.speaker === "A" ? "Sam" : "Alex"}: ${s.text}`)
      .join("\n");

    console.log(`[PODCAST] Generated ${segments.length} segments, generating audio...`);

    // Generate audio for each segment in parallel (with some batching to avoid rate limits)
    const audioBuffers: ArrayBuffer[] = [];
    const BATCH_SIZE = 3;

    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      const batch = segments.slice(i, i + BATCH_SIZE);
      const batchAudio = await Promise.all(
        batch.map((seg) =>
          generateSegmentAudio(
            seg.text,
            seg.speaker === "A" ? HOST_A_VOICE : HOST_B_VOICE
          )
        )
      );
      audioBuffers.push(...batchAudio);
    }

    // Concatenate all audio
    const finalAudio = concatenateAudioBuffers(audioBuffers);

    // Cache in memory and persist to DB
    podcastCache.set(cacheKey, { audio: finalAudio, timestamp: Date.now() });

    // Save to DB for persistence across restarts (audio + transcript)
    await prisma.podcast.upsert({
      where: { userId_weekNumber: { userId, weekNumber: week } },
      update: { audioData: Buffer.from(finalAudio), transcript: transcriptText },
      create: { userId, weekNumber: week, audioData: Buffer.from(finalAudio), transcript: transcriptText },
    }).catch((err: unknown) => console.error("[PODCAST] DB save failed:", err));

    console.log(`[PODCAST] Complete - ${Date.now() - startTime}ms`);

    return new NextResponse(finalAudio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": finalAudio.byteLength.toString(),
        "X-Podcast-Cache": "MISS",
        "X-Podcast-Segments": segments.length.toString(),
      },
    });
  } catch (error) {
    console.error("[PODCAST] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if a podcast exists/is cached
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const week = parseInt(req.nextUrl.searchParams.get("week") || "");
    if (isNaN(week) || week < 0 || week > 6) {
      return NextResponse.json({ error: "Invalid week" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if there's conversation history for this week
    const history = await getConversationHistory(userId, week);
    const hasConversation = history.length > 0;

    // Check DB first, then in-memory cache
    const dbPodcast = await prisma.podcast.findUnique({
      where: { userId_weekNumber: { userId, weekNumber: week } },
      select: { id: true },
    });

    const cacheKey = crypto
      .createHash("sha256")
      .update(`${userId}:${week}`)
      .digest("hex");
    const cached = podcastCache.get(cacheKey);
    const isCached = !!dbPodcast || (cached && Date.now() - cached.timestamp < CACHE_TTL_MS);

    return NextResponse.json({
      hasConversation,
      isCached,
      messageCount: history.length,
    });
  } catch (error) {
    console.error("[PODCAST] Check error:", error);
    return NextResponse.json(
      { error: "Failed to check podcast status" },
      { status: 500 }
    );
  }
}
