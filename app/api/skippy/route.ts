import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { getSkippyContext, saveMessage, hasConversationStarted } from "@/lib/skippy";
import { markWeekCompleted } from "@/lib/progress";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type SkippyEventType = "start_week" | "user_message" | "end_week";

type SkippyRequest = {
  event: SkippyEventType;
  week: number;
  message?: string; // Required for user_message event
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        return handleUserMessage(userId, week, message);

      case "end_week":
        return handleEndWeek(userId, week);

      default:
        return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Skippy API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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

async function handleUserMessage(userId: string, week: number, message: string) {
  try {
    // Save user message
    await saveMessage(userId, week, "user", message);

    // Get context and history
    const context = await getSkippyContext(userId, week);

    // Build messages array for Anthropic
    const messages = context.history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Add the new user message
    messages.push({ role: "user", content: message });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: context.systemPrompt,
      messages,
    });

    // Extract text response
    const assistantMessage = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    // Save assistant response
    await saveMessage(userId, week, "assistant", assistantMessage);

    return NextResponse.json({
      event: "user_message",
      week,
      response: assistantMessage,
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
