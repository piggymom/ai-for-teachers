import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConversationHistory } from "@/lib/skippy";
import { getModulePrompt } from "@/lib/modules";
import { getProfileContextForUser } from "@/lib/profile";
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
Week 5: Communication & Admin - Parent communications, newsletters, administrative tasks
Week 6: Building Your Practice - Creating sustainable routines, personal prompt library, staying current
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
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  // Parse the script into segments
  const scriptText = response.content[0].type === "text" ? response.content[0].text : "";
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

  return segments;
}

function generateIntroWeekPrompt(
  conversationText: string,
  teacherQuotes: string,
  profileContext: string | null
): string {
  return `You are writing a script for a 2-3 minute podcast episode. Two hosts are welcoming a teacher who just started the "AI for Teachers" course. This is their INTRODUCTION episode—it should feel warm, personal, and set up excitement for the journey ahead.

## THE TWO HOSTS

**Sam** (Host A): The curious one. Gets genuinely excited about learning who this teacher is. Warm and welcoming. Uses phrases like "Oh I love that...", "That's such an interesting background...", "You know what excites me about their goals?". Picks up on personal details.

**Alex** (Host B): The synthesizer. Connects the teacher's goals to what they'll learn in the course. Offers previews like "and that connects perfectly to Week 3 where they'll..." Grounds things in practical value. Builds anticipation.

## CRITICAL PODCAST QUALITIES (NotebookLM-style)

1. **Interruptions & reactions**: Hosts should interrupt naturally ("Oh!" "Wait—" "Yes!" "Mmm"). Not every line is a complete thought.
2. **Building on each other**: Alex might say "And building on that..." or Sam might say "That reminds me of something else they mentioned..."
3. **Genuine warmth**: This is a welcome episode! Be encouraging about their decision to take the course.
4. **Specific references**: Quote or paraphrase SPECIFIC things about this teacher. Not generic welcomes.
5. **Course preview**: Naturally mention 2-3 specific weeks that connect to their goals/interests.
6. **Brief moments**: Many exchanges should be short (5-15 words). Not every turn is a paragraph.

## WHAT THIS COURSE COVERS
${COURSE_OVERVIEW}

Reference specific weeks that connect to what this teacher cares about! "When they get to Week 4, they're going to love..."

## ABOUT THIS TEACHER
${profileContext || "No specific profile context available."}

This is the star of the episode! Reference their role, subjects, grade levels, goals, and constraints throughout.

## WHAT THEY SHARED IN THEIR INTRO CONVERSATION
${teacherQuotes}

Use these heavily! This podcast is about THEM—their background, goals, what brought them here.

## THE FULL INTRO CONVERSATION
${conversationText}

## OUTPUT FORMAT

Write ONLY the script, formatted exactly like this:
A: [Sam's line]
B: [Alex's line]
A: [Sam's line]
...

Guidelines:
- 14-20 exchanges total
- Start with something like "So we just met [their role]..." or "I'm so excited about this teacher..."—make it personal immediately
- Celebrate what makes this teacher's context interesting
- Preview 2-3 specific weeks that connect to their stated goals
- End with genuine encouragement for the journey ahead
- Include natural interruptions and reactions
- Reference their specific subject area, grade level, and constraints

Do NOT include any preamble, notes, or commentary. ONLY the A:/B: script.`;
}

function generateStandardWeekPrompt(
  conversationText: string,
  teacherQuotes: string,
  profileContext: string | null,
  weekNumber: number,
  weekTitle: string,
  moduleContext: string
): string {
  return `You are writing a script for a 2-3 minute podcast episode. Two hosts are discussing a teacher's recent AI learning session. This should sound like a REAL podcast—natural, warm, with genuine reactions.

## THE TWO HOSTS

**Sam** (Host A): The curious one. Gets genuinely excited about insights. Asks "wait, say more about that" type questions. Uses phrases like "Oh that's interesting...", "I love that they...", "You know what strikes me?". Tends to pick up on the human/emotional elements.

**Alex** (Host B): The synthesizer. Connects ideas to bigger concepts. Offers "the thing that's actually happening here is..." type insights. Grounds things in practical application. Sometimes gently pushes back or adds nuance.

## CRITICAL PODCAST QUALITIES (NotebookLM-style)

1. **Interruptions & reactions**: Hosts should interrupt naturally ("Oh!" "Wait—" "Yes!" "Mmm"). Not every line is a complete thought.
2. **Building on each other**: Alex might say "And building on that..." or Sam might say "That connects to something else they said..."
3. **Genuine surprise/delight**: When something interesting comes up, react to it. "I didn't expect them to say..."
4. **Specific references**: Quote or paraphrase SPECIFIC things the teacher said. Not generic summaries.
5. **Thinking out loud**: "I wonder if..." "What I'm hearing is..." "The way I'd put it..."
6. **Brief moments**: Many exchanges should be short (5-15 words). Not every turn is a paragraph.

## THIS WEEK'S KEY THEMES (Week ${weekNumber}: ${weekTitle})
${moduleContext}

IMPORTANT: The hosts MUST explicitly discuss 2-3 of these key themes/concepts during the episode. Weave them naturally into the conversation:
- "This connects to one of the big ideas this week—[concept]"
- "And that's really the heart of what Week ${weekNumber} is about: [concept]"
- "The key insight here is [concept from the week]"

Don't just summarize what the teacher said—connect it to the learning objectives!

## ABOUT THIS TEACHER
${profileContext || "No specific profile context available."}

Reference their teaching context (grade level, subject, constraints) when relevant. Make it feel like you're talking about a REAL person.

## TEACHER QUOTES TO REFERENCE
${teacherQuotes}

Use these! Paraphrase or quote directly. "They said something like..." or "I loved when they mentioned..."

## THE FULL CONVERSATION
${conversationText}

## OUTPUT FORMAT

Write ONLY the script, formatted exactly like this:
A: [Sam's line]
B: [Alex's line]
A: [Sam's line]
...

Guidelines:
- 14-20 exchanges total
- Vary line length: some short reactions (3-8 words), some longer insights (1-2 sentences)
- Start with a warm, personalized hook—NOT "Welcome to the podcast"
- MUST explicitly mention 2-3 key concepts from this week's learning objectives
- End with something encouraging and forward-looking
- Include at least 3-4 interruption moments
- Reference at least 2-3 specific things the teacher said

Do NOT include any preamble, notes, or commentary. ONLY the A:/B: script.`;
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

    // Check cache (skip if forceRegenerate)
    if (!forceRegenerate) {
      const cached = podcastCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        console.log(`[PODCAST] Cache HIT - ${Date.now() - startTime}ms`);
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

    // Cache the result
    podcastCache.set(cacheKey, { audio: finalAudio, timestamp: Date.now() });

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

    // Check if podcast is cached
    const cacheKey = crypto
      .createHash("sha256")
      .update(`${userId}:${week}`)
      .digest("hex");
    const cached = podcastCache.get(cacheKey);
    const isCached = cached && Date.now() - cached.timestamp < CACHE_TTL_MS;

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
