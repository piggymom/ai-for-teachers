import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { getSkippyContext, saveMessage, hasConversationStarted } from "@/lib/skippy";
import { markWeekCompleted } from "@/lib/progress";

// Validate API key at startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("[SKIPPY] ANTHROPIC_API_KEY is not set!");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// =============================================================================
// LATENCY INSTRUMENTATION
// =============================================================================
type TimingLog = {
  t0_requestReceived: number;
  t1_authVerified: number;
  t2_contextFetched: number;
  t3_llmStart: number;
  t4_llmDone: number;
  t5_messageSaved: number;
  t6_responseSent: number;
};

function logTiming(label: string, timing: Partial<TimingLog>) {
  const t0 = timing.t0_requestReceived || 0;
  const durations: Record<string, number> = {};

  if (timing.t1_authVerified) durations.auth = timing.t1_authVerified - t0;
  if (timing.t2_contextFetched) durations.context = timing.t2_contextFetched - (timing.t1_authVerified || t0);
  if (timing.t3_llmStart && timing.t4_llmDone) durations.llm = timing.t4_llmDone - timing.t3_llmStart;
  if (timing.t5_messageSaved) durations.save = timing.t5_messageSaved - (timing.t4_llmDone || t0);
  if (timing.t6_responseSent) durations.total = timing.t6_responseSent - t0;

  console.log(`[SKIPPY TIMING] ${label}:`, JSON.stringify(durations));
}

// Model configuration for speed
const SKIPPY_MODEL = "claude-3-haiku-20240307"; // Fast model for tutoring
const SKIPPY_MAX_TOKENS = 300; // Short responses for conversation
const SKIPPY_TEMPERATURE = 0.7;
const MAX_HISTORY_MESSAGES = 10; // Only send last N messages

type SkippyEventType = "start_week" | "user_message" | "end_week";

type SkippyRequest = {
  event: SkippyEventType;
  week: number;
  message?: string; // Required for user_message event
};

export async function POST(req: NextRequest) {
  const timing: Partial<TimingLog> = { t0_requestReceived: Date.now() };

  try {
    // Check for required env vars
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: { message: "Server misconfiguration: Missing ANTHROPIC_API_KEY", code: "MISSING_API_KEY" } },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    timing.t1_authVerified = Date.now();

    if (!session?.user?.id) {
      return NextResponse.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, { status: 401 });
    }

    const userId = session.user.id;
    const body: SkippyRequest = await req.json();
    const { event, week, message } = body;

    // Validate week number
    if (typeof week !== "number" || week < 0 || week > 6) {
      return NextResponse.json({ error: "Invalid week number" }, { status: 400 });
    }

    // Handle different event types
    switch (event) {
      case "start_week":
        return handleStartWeek(userId, week);

      case "user_message":
        if (!message || typeof message !== "string") {
          return NextResponse.json({ error: "Message required" }, { status: 400 });
        }
        return handleUserMessage(userId, week, message, timing);

      case "end_week":
        return handleEndWeek(userId, week);

      default:
        return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Skippy API error:", error);

    // Extract meaningful error info
    let message = "Internal server error";
    let code = "INTERNAL_ERROR";
    let status = 500;

    if (error instanceof Error) {
      message = error.message;
      // Check for Anthropic API errors
      if ("status" in error && typeof (error as { status: number }).status === "number") {
        status = (error as { status: number }).status;
        code = "ANTHROPIC_API_ERROR";
      }
    }

    return NextResponse.json(
      { error: { message, code } },
      { status }
    );
  }
}

async function handleStartWeek(userId: string, week: number) {
  try {
    const context = await getSkippyContext(userId, week);
    const alreadyStarted = await hasConversationStarted(userId, week);

    if (alreadyStarted) {
      // Return existing conversation
      return NextResponse.json({
        event: "start_week",
        week,
        history: context.history,
        resumed: true,
      });
    }

    // Start new conversation with opening message
    const openingMessage = context.modulePrompt.openingMessage;
    await saveMessage(userId, week, "assistant", openingMessage);

    return NextResponse.json({
      event: "start_week",
      week,
      history: [{ role: "assistant", content: openingMessage }],
      resumed: false,
    });
  } catch (error) {
    console.error("Start week error:", error);
    throw error;
  }
}

async function handleUserMessage(
  userId: string,
  week: number,
  message: string,
  timing: Partial<TimingLog>
) {
  try {
    // OPTIMIZATION: Parallelize user message save with context fetch
    const [, context] = await Promise.all([
      saveMessage(userId, week, "user", message),
      getSkippyContext(userId, week),
    ]);
    timing.t2_contextFetched = Date.now();

    // Build messages array for Anthropic - LIMIT to last N messages
    let historyMessages = context.history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Keep only last N messages to reduce context size and latency
    if (historyMessages.length > MAX_HISTORY_MESSAGES) {
      historyMessages = historyMessages.slice(-MAX_HISTORY_MESSAGES);
    }

    // Add the new user message
    historyMessages.push({ role: "user", content: message });

    // Call Anthropic API with optimized settings
    timing.t3_llmStart = Date.now();
    const response = await anthropic.messages.create({
      model: SKIPPY_MODEL,
      max_tokens: SKIPPY_MAX_TOKENS,
      temperature: SKIPPY_TEMPERATURE,
      system: context.systemPrompt,
      messages: historyMessages,
    });
    timing.t4_llmDone = Date.now();

    // Extract text response
    const assistantMessage = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    // Save assistant response (don't await - fire and forget for speed)
    saveMessage(userId, week, "assistant", assistantMessage).catch((err) =>
      console.error("Failed to save assistant message:", err)
    );
    timing.t5_messageSaved = Date.now();

    timing.t6_responseSent = Date.now();
    logTiming("user_message", timing);

    return NextResponse.json({
      event: "user_message",
      week,
      response: assistantMessage,
      // Include timing for client-side logging
      serverTiming: {
        auth: (timing.t1_authVerified || 0) - (timing.t0_requestReceived || 0),
        context: (timing.t2_contextFetched || 0) - (timing.t1_authVerified || 0),
        llm: (timing.t4_llmDone || 0) - (timing.t3_llmStart || 0),
        total: (timing.t6_responseSent || 0) - (timing.t0_requestReceived || 0),
      },
    });
  } catch (error) {
    console.error("User message error:", error);
    throw error;
  }
}

async function handleEndWeek(userId: string, week: number) {
  try {
    // Mark week as completed
    await markWeekCompleted(userId, week);

    return NextResponse.json({
      event: "end_week",
      week,
      completed: true,
    });
  } catch (error) {
    console.error("End week error:", error);
    throw error;
  }
}
