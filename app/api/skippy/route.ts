import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { getSkippyContext, saveMessage, hasConversationStarted } from "@/lib/skippy";
import { markWeekCompleted } from "@/lib/progress";
import {
  getOrCreateLedger,
  formatLedgerForPrompt,
  updateLedgerFromExchange,
  resetLedger,
  type ConversationLedger,
} from "@/lib/ledger";
import { getDiagnosticProbe } from "@/lib/progressions";
import { extractArtifact } from "@/lib/artifacts";

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

type SkippyEventType = "start_week" | "user_message" | "end_week" | "save_message" | "reset_week";

type SkippyRequest = {
  event: SkippyEventType;
  week: number;
  message?: string; // Required for user_message event
  role?: "user" | "assistant"; // Required for save_message event
  content?: string; // Required for save_message event
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

    // Get user's first name for personalization
    const userName = session.user.name?.split(" ")[0] || "there";

    // Handle different event types
    switch (event) {
      case "start_week":
        return handleStartWeek(userId, week, userName);

      case "user_message":
        if (!message || typeof message !== "string") {
          return NextResponse.json({ error: "Message required" }, { status: 400 });
        }
        return handleUserMessage(userId, week, message, timing);

      case "end_week":
        return handleEndWeek(userId, week);

      case "save_message":
        // Used by Realtime API client to persist messages after conversation
        if (!body.role || !body.content) {
          return NextResponse.json({ error: "Role and content required" }, { status: 400 });
        }
        return handleSaveMessage(userId, week, body.role, body.content);

      case "reset_week":
        return handleResetWeek(userId, week, userName);

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

async function handleStartWeek(userId: string, week: number, userName: string) {
  try {
    // Fetch context and ledger in parallel
    const [context, ledger] = await Promise.all([
      getSkippyContext(userId, week, userName),
      getOrCreateLedger(userId, week),
    ]);

    // Log ledger state
    console.log('[SKIPPY:LEDGER_FETCHED]', {
      event: 'start_week',
      week,
      found: !!ledger,
      phase: ledger?.currentPhase,
      level: ledger?.diagnostic?.level,
      guidance: ledger?.guidance?.slice(0, 100),
      exchangeCount: ledger?.exchangeCount
    });

    const alreadyStarted = await hasConversationStarted(userId, week);

    // Build system prompt with ledger context
    const ledgerContext = formatLedgerForPrompt(ledger);
    console.log('[SKIPPY:LEDGER_INJECTION]', ledgerContext.slice(0, 500) + '...');

    const diagnosticProbe = getDiagnosticProbe(week);
    const fullSystemPrompt = `${context.systemPrompt}\n\n${ledgerContext}${
      diagnosticProbe && !ledger.diagnostic.hasBeenAssessed
        ? `\n\nDIAGNOSTIC PROBE FOR THIS WEEK:\n"${diagnosticProbe}"\n\nUse this probe naturally in your opening or early in the conversation to assess where this teacher is starting from.`
        : ""
    }`;

    console.log('[SKIPPY:SYSTEM_PROMPT_PREVIEW]', {
      totalLength: fullSystemPrompt.length,
      preview: fullSystemPrompt.slice(0, 300) + '...'
    });

    if (alreadyStarted) {
      // Return existing conversation with ledger-enhanced system prompt
      return NextResponse.json({
        event: "start_week",
        week,
        history: context.history,
        systemPrompt: fullSystemPrompt,
        ledger, // Include ledger for client-side awareness if needed
        resumed: true,
      });
    }

    // NEW conversation - don't pre-save opening message
    // The realtime API will generate and speak the opening based on system prompt
    // Pass the personalized opening template for the system prompt to use
    const openingHint = context.modulePrompt.openingMessage.replace(/\{\{name\}\}/g, userName);

    return NextResponse.json({
      event: "start_week",
      week,
      history: [],
      systemPrompt: fullSystemPrompt,
      openingHint, // The UI will inject this into the first response request
      ledger, // Include ledger for client-side awareness
      resumed: false,
      userName, // Pass name for system prompt personalization
    });
  } catch (error) {
    console.error("Start week error:", error);
    throw error;
  }
}

async function handleSaveMessage(
  userId: string,
  week: number,
  role: "user" | "assistant",
  content: string
) {
  try {
    await saveMessage(userId, week, role, content);
    console.log('[SKIPPY:SAVE_MESSAGE]', { week, role, contentLength: content.length });

    // When saving an assistant message, trigger the classifier
    // to update the ledger based on this exchange
    if (role === "assistant") {
      // Fetch the ledger and last user message to update
      const [ledger, context] = await Promise.all([
        getOrCreateLedger(userId, week),
        getSkippyContext(userId, week),
      ]);

      console.log('[SKIPPY:CLASSIFIER_TRIGGER]', {
        week,
        ledgerId: ledger.id.slice(-8),
        currentPhase: ledger.currentPhase,
        exchangeCount: ledger.exchangeCount
      });

      // Find the most recent user message (should be the one just before this assistant message)
      const userMessages = context.history.filter((m) => m.role === "user");
      const lastUserMessage = userMessages[userMessages.length - 1]?.content || "";

      if (lastUserMessage && content) {
        console.log('[SKIPPY:CLASSIFIER_INPUTS]', {
          userMessagePreview: lastUserMessage.slice(0, 100),
          assistantPreview: content.slice(0, 100)
        });
        // ASYNC: Update ledger (fire and forget - zero latency impact)
        updateLedgerFromExchange(ledger, lastUserMessage, content).catch((err) =>
          console.error("Failed to update ledger from save_message:", err)
        );
      } else {
        console.log('[SKIPPY:CLASSIFIER_SKIPPED]', { reason: 'missing messages', hasUser: !!lastUserMessage, hasAssistant: !!content });
      }
    }

    return NextResponse.json({
      event: "save_message",
      success: true,
    });
  } catch (error) {
    console.error("Save message error:", error);
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
    // OPTIMIZATION: Parallelize user message save with context and ledger fetch
    const [, context, ledger] = await Promise.all([
      saveMessage(userId, week, "user", message),
      getSkippyContext(userId, week),
      getOrCreateLedger(userId, week),
    ]);
    timing.t2_contextFetched = Date.now();

    // Log ledger state
    console.log('[SKIPPY:LEDGER_FETCHED]', {
      event: 'user_message',
      week,
      found: !!ledger,
      phase: ledger?.currentPhase,
      level: ledger?.diagnostic?.level,
      guidance: ledger?.guidance?.slice(0, 100),
      exchangeCount: ledger?.exchangeCount
    });

    // Build system prompt with ledger context
    const ledgerContext = formatLedgerForPrompt(ledger);
    console.log('[SKIPPY:LEDGER_INJECTION]', ledgerContext.slice(0, 500) + '...');

    const fullSystemPrompt = `${context.systemPrompt}\n\n${ledgerContext}`;
    console.log('[SKIPPY:SYSTEM_PROMPT_PREVIEW]', {
      totalLength: fullSystemPrompt.length,
      preview: fullSystemPrompt.slice(0, 300) + '...'
    });

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
      system: fullSystemPrompt,
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

    // ASYNC: Update ledger from this exchange (fire and forget - zero latency impact)
    updateLedgerFromExchange(ledger, message, assistantMessage).catch((err) =>
      console.error("Failed to update ledger:", err)
    );

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
    // Get ledger to check for unsaved artifact
    const ledger = await getOrCreateLedger(userId, week);

    // Extract artifact if one exists and hasn't been saved yet (backup for early exit)
    if (
      ledger.artifact.inProgress &&
      ledger.artifact.currentState &&
      ledger.currentPhase !== "SAVE" // Only if we haven't already extracted in SAVE
    ) {
      try {
        await extractArtifact(
          userId,
          week,
          ledger.artifact.type || "other",
          ledger.artifact.currentState,
          ledger.sessionSummary
        );
        console.log("[SKIPPY] Artifact extracted on early exit");
      } catch (err) {
        console.error("[SKIPPY] Artifact extraction on complete failed:", err);
      }
    }

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

async function handleResetWeek(userId: string, week: number, userName: string) {
  try {
    // Reset the ledger for this week
    const ledger = await resetLedger(userId, week);

    // Get fresh context
    const context = await getSkippyContext(userId, week, userName);

    // Build system prompt with fresh ledger
    const ledgerContext = formatLedgerForPrompt(ledger);
    const diagnosticProbe = getDiagnosticProbe(week);
    const fullSystemPrompt = `${context.systemPrompt}\n\n${ledgerContext}${
      diagnosticProbe
        ? `\n\nDIAGNOSTIC PROBE FOR THIS WEEK:\n"${diagnosticProbe}"\n\nUse this probe naturally in your opening or early in the conversation to assess where this teacher is starting from.`
        : ""
    }`;

    const openingHint = context.modulePrompt.openingMessage.replace(/\{\{name\}\}/g, userName);

    return NextResponse.json({
      event: "reset_week",
      week,
      history: [], // Start fresh
      systemPrompt: fullSystemPrompt,
      openingHint,
      ledger,
      resumed: false,
      userName,
    });
  } catch (error) {
    console.error("Reset week error:", error);
    throw error;
  }
}
