import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSkippyContext } from "@/lib/skippy";

/**
 * POST /api/realtime/token
 *
 * Mints an ephemeral client secret for OpenAI Realtime API (GA).
 * Uses POST /v1/realtime/client_secrets with session configuration.
 *
 * The client uses this key to establish a WebRTC connection directly with OpenAI.
 *
 * Returns: { value: string, expires_at: number }
 */

// Voice selection - using "ash" for British-sounding warm voice
// Available voices: alloy, ash, ballad, coral, echo, sage, shimmer, verse
const REALTIME_VOICE = "ash";

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    // Check for required env var
    if (!process.env.OPENAI_API_KEY) {
      console.error("[REALTIME-TOKEN] OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: { message: "Server misconfiguration", code: "MISSING_API_KEY" } },
        { status: 500 }
      );
    }

    // Parse request body for week context
    let systemPrompt: string;
    try {
      const body = await req.json();
      const week = body.week ?? 1;

      // Get the full system prompt with module and profile context
      const context = await getSkippyContext(session.user.id, week);
      systemPrompt = context.systemPrompt;
    } catch {
      // Fallback to basic prompt if context fetch fails
      console.warn("[REALTIME-TOKEN] Failed to get context, using basic prompt");
      systemPrompt = "You are Skippy, a warm British AI tutor for teachers. Keep responses short: 1-4 sentences then one question.";
    }

    // Request ephemeral client secret from OpenAI GA API
    // Endpoint: POST /v1/realtime/client_secrets
    const requestBody = {
      session: {
        type: "realtime",
        model: "gpt-realtime",
        instructions: systemPrompt,
        audio: {
          input: {
            // Disable automatic turn detection - user manually controls recording
            turn_detection: null,
            // Enable transcription of user's speech
            transcription: {
              model: "whisper-1",
            },
          },
          output: {
            voice: REALTIME_VOICE,
          },
        },
      },
    };

    console.log("[REALTIME-TOKEN] Request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[REALTIME-TOKEN] OpenAI API error:", response.status);
      console.error("[REALTIME-TOKEN] Full error response:", errorText);

      // Parse error for better messaging
      let errorMessage = "Failed to get realtime token";
      let errorParam: string | undefined;
      let errorCode: string | undefined;
      try {
        const errorJson = JSON.parse(errorText);
        console.error("[REALTIME-TOKEN] Parsed error JSON:", JSON.stringify(errorJson, null, 2));
        errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
        errorParam = errorJson.error?.param;
        errorCode = errorJson.error?.code;
        if (errorParam) {
          console.error("[REALTIME-TOKEN] Invalid parameter:", errorParam);
        }
      } catch {
        // Keep default message
      }

      return NextResponse.json(
        {
          error: {
            message: errorMessage,
            code: errorCode || "TOKEN_ERROR",
            param: errorParam,
            status: response.status,
            details: errorText,
          }
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Return the ephemeral token to the client
    // Expected shape: { value: string, expires_at: number }
    return NextResponse.json({
      value: data.value || data.client_secret?.value,
      expires_at: data.expires_at || data.client_secret?.expires_at,
    });

  } catch (error) {
    console.error("[REALTIME-TOKEN] Error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
