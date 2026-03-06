import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConversationHistory } from "@/lib/skippy";
import { generatePodcast } from "@/lib/podcast";
import { prisma } from "@/lib/prisma";

/**
 * POST — Serve or generate a podcast for a given week.
 *
 * If the podcast already exists in DB, serve it immediately.
 * Otherwise, generate it (script + TTS) and return the audio.
 */
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

    // Check DB for existing podcast (unless force regenerate)
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
    }

    // Not cached — generate now
    const success = await generatePodcast(userId, week);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to generate podcast" },
        { status: 500 }
      );
    }

    // Fetch the just-saved audio from DB
    const dbPodcast = await prisma.podcast.findUnique({
      where: { userId_weekNumber: { userId, weekNumber: week } },
      select: { audioData: true },
    });

    if (!dbPodcast?.audioData) {
      return NextResponse.json(
        { error: "Podcast generated but not found" },
        { status: 500 }
      );
    }

    console.log(`[PODCAST] Generated and served - ${Date.now() - startTime}ms`);

    return new NextResponse(new Uint8Array(dbPodcast.audioData), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Podcast-Cache": "MISS",
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
 * GET — Check if a podcast exists for a given week.
 * Used by WeekCard to decide whether to show the "Listen to Takeaways" button.
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

    // Check conversation + podcast existence in parallel
    const [history, dbPodcast] = await Promise.all([
      getConversationHistory(userId, week),
      prisma.podcast.findUnique({
        where: { userId_weekNumber: { userId, weekNumber: week } },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      hasConversation: history.length > 0,
      isCached: !!dbPodcast,
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
