import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/realtime-token
 *
 * Mints an ephemeral client key for OpenAI Realtime API.
 * The client uses this key to establish a WebRTC connection directly with OpenAI.
 *
 * Returns: { client_secret: { value: string, expires_at: number } }
 */
export async function POST(_req: NextRequest) {
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

    // Request ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: process.env.OPENAI_REALTIME_VOICE || "shimmer",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[REALTIME-TOKEN] OpenAI API error:", response.status, errorText);
      return NextResponse.json(
        { error: { message: "Failed to get realtime token", code: "TOKEN_ERROR" } },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Return the ephemeral token to the client
    return NextResponse.json({
      client_secret: data.client_secret,
    });

  } catch (error) {
    console.error("[REALTIME-TOKEN] Error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
