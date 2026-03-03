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
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  // Parse the script into segments
  const scriptText = response.content[0].type === "text" ? response.content[0].text : "";

  // Log the full script for debugging (dev only — contains conversation-derived content)
  if (process.env.NODE_ENV !== "production") {
    console.log("[PODCAST] Generated script:\n" + scriptText);
  }

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
  return `You are writing a script for a 2-3 minute podcast episode. Two hosts are creating a PERSONALIZED WELCOME for a teacher who just joined "AI for Teachers." The tone should be warm, genuine, and conversational—like two thoughtful friends who are genuinely interested in this person's story.

## THE TWO HOSTS

**Sam** (Host A): Warm and curious. Notices the personal details—their specific context, challenges, what they said. Asks good questions and makes observations that show they were really listening. Friendly without being performative.

**Alex** (Host B): The connector. Links this teacher's specific situation to what's ahead in the course. Sees patterns and possibilities. Offers reassurance and clarity about the journey ahead. Grounded but encouraging.

## THE TONE WE'RE GOING FOR

Think: Two thoughtful educators having coffee, genuinely interested in a new colleague's story. NOT morning radio DJs. NOT two analysts presenting a case study.

Natural warmth, not manufactured hype:
- "What stood out to me was when they said..."
- "That's actually really common—and it's exactly what Week 3 addresses."
- "I think they're going to get a lot out of this."
- "The fact that they mentioned [specific thing]—that tells me a lot about where they're at."

## PODCAST STRUCTURE

1. **OPEN WITH THEIR STORY (2-3 exchanges)**: Ground it in who they are. Their role, context, what brought them here. Make it specific and real.

2. **WHAT THEY SHARED (3-4 exchanges)**: Reflect back what they said—their challenges, constraints, goals. Quote them naturally. Show you were listening.

3. **THE DEEPER WHY (2-3 exchanges)**: What's really driving them? Usually it's about time, stress, being better at their craft, or feeling behind. Name it without overdramatizing.

4. **WHAT'S AHEAD (3-4 exchanges)**: Connect their specific situation to 2-3 course moments that will resonate for them. Be specific: "Given that they're dealing with [challenge], Week X is going to be particularly useful."

5. **CLOSE WITH CONFIDENCE (2-3 exchanges)**: Reassure them they're in the right place. End with genuine encouragement—not a sales pitch.

## WHAT THIS COURSE COVERS
${COURSE_OVERVIEW}

Pick 2-3 weeks that genuinely connect to their situation. Don't list—weave them into the conversation naturally.

## THIS TEACHER'S PROFILE
${profileContext || "No specific profile context available."}

Use their specifics—role, subjects, grades, constraints, goals. This makes the conversation feel like it's truly for them.

## QUOTES FROM THEIR CONVERSATION
${teacherQuotes}

Reference these naturally: "When they said [quote], that really stood out to me."

## THE FULL CONVERSATION
${conversationText}

## OUTPUT FORMAT

Write ONLY the script:
A: [Sam's line]
B: [Alex's line]
...

REQUIREMENTS:
- 16-22 exchanges total
- Quote them at least 2-3 times (naturally, not forced)
- Identify their emotional core without overdramatizing
- Connect to 2-3 specific course moments
- Warm and genuine, not hyped or performative
- End with reassurance and encouragement
- Conversation should feel natural—varied pace, some shorter responses, some longer

Do NOT include preamble or notes. ONLY the A:/B: script.`;
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

  return `You are writing a script for a 2-3 minute podcast episode. Two hosts are creating a PERSONALIZED RECAP for a specific teacher who just completed Week ${weekNumber}. This is FOR them—make them feel seen, celebrated, and excited to continue.

## THE TWO HOSTS

**Sam** (Host A): Warm, enthusiastic, picks up on personal details. Gets excited about the teacher's specific wins. Uses their context naturally ("As a high school Social Studies teacher, that's huge!"). Asks rhetorical questions that make the listener reflect.

**Alex** (Host B): The insight-giver. Connects what the teacher did to the bigger "why." Names the skills they've built. Creates "aha" moments. Previews what's coming next to build anticipation.

## PODCAST STRUCTURE (Follow this arc!)

1. **HOOK (2-3 exchanges)**: Open with something specific and personal. NOT generic. Use their role, subject, or a specific moment from their conversation. Make them think "oh, they're talking about ME."

2. **CELEBRATE WINS (3-4 exchanges)**: What did they DO in this session? What breakthroughs did they have? Quote specific things they said or tried. Be genuinely impressed.

3. **CONSOLIDATE LEARNING (4-5 exchanges)**: Name 2-3 key concepts from this week that they now understand. Make it explicit: "What you've learned here is [concept]." Connect their experience to the learning objectives.

4. **CONNECT TO GOALS (2-3 exchanges)**: Tie back to their stated goals (saving time, better planning, etc.). "Remember, they said they wanted to [goal]—and this is exactly how that happens."

5. **PREVIEW & HOOK FOR NEXT WEEK (2-3 exchanges)**: Build genuine excitement for what's coming. Be specific about Week ${weekNumber + 1}. End with energy—they should WANT to start the next session.

## CRITICAL QUALITIES

- **ENERGY**: This should feel exciting, not like a dry summary. Use exclamations, genuine reactions.
- **SPECIFIC**: Quote them. Reference their exact subject, grade level, school context, constraints.
- **ACTIONABLE**: They should walk away knowing what they learned and what they can DO with it.
- **FORWARD MOMENTUM**: End with them eager for Week ${weekNumber + 1}, not just satisfied with Week ${weekNumber}.

## THIS TEACHER'S PROFILE
${profileContext || "No specific profile context available."}

USE THIS! Reference their role, subjects, grade levels, constraints, and goals throughout. Make it personal.

## WHAT'S COMING NEXT
${nextWeekPreview[weekNumber] || "More exciting learning ahead!"}

Build anticipation for this! "Wait until they get to Week ${weekNumber + 1}..."

## WEEK ${weekNumber} KEY CONCEPTS (${weekTitle})
${moduleContext}

These are the learning objectives. The hosts should explicitly name 2-3 of these as things the teacher NOW understands. "What they've really learned here is [concept]."

## SPECIFIC QUOTES FROM THEIR CONVERSATION
${teacherQuotes}

QUOTE THESE DIRECTLY. "They literally said '[quote]'—I love that!" This is what makes it feel personalized.

## THE FULL CONVERSATION
${conversationText}

## OUTPUT FORMAT

Write ONLY the script:
A: [Sam's line]
B: [Alex's line]
...

Requirements:
- 16-22 exchanges total
- Mix short reactions ("Yes!" "Oh wow." "Exactly.") with fuller thoughts
- Start with their specific context, not a generic opener
- Must quote at least 3 specific things they said
- Must name at least 2 key concepts from this week as "things you now know"
- Must preview Week ${weekNumber + 1} with genuine excitement
- Must reference their stated goals at least once
- End on a high note—they should feel accomplished AND eager for more

Do NOT include any preamble or notes. ONLY the A:/B: formatted script.`;
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
