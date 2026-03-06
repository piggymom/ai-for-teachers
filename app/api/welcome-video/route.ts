import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile, resolveProfile, painPointToLabel } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_AVATAR_ID = process.env.HEYGEN_AVATAR_ID;

/**
 * Generate a personalized welcome script based on user profile.
 * Works with both new (v2) and legacy (v1) profiles.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateWelcomeScript(profile: Record<string, any>, userName?: string | null): string {
  const name = userName?.split(" ")[0] || "there";
  const r = resolveProfile(profile);

  const grades = r.grades.length > 0 ? formatGrades(r.grades) : "";
  const subjects = r.subjects.length > 0 ? r.subjects.slice(0, 2).join(" and ") : "";

  // Build the "teaching X to Y students" phrase
  let teachingPhrase = "your students";
  if (subjects && grades) {
    teachingPhrase = `${subjects} to ${grades} students`;
  } else if (subjects) {
    teachingPhrase = subjects;
  } else if (grades) {
    teachingPhrase = `${grades} students`;
  }

  const painText = r.painPointLabel.toLowerCase();

  return `Hey ${name}! Welcome to AI for Teachers.

I'm so glad you're here. As someone teaching ${teachingPhrase}, you're exactly who this course was built for.

I see that ${painText} is taking up too much of your time. I get it. That's exactly what we're going to fix.

Over the next six weeks, you'll build real AI skills you can use in your classroom. Not theory. Not hype. Actual prompts, templates, and workflows you'll keep using.

Now, I want to introduce you to Skippy. He's your AI tutor, and he's going to personalize everything based on what you just shared. Think of him as your guide through the course — he'll help you build something useful every single week.

Ready? Let's do this.`;
}

function formatGrades(gradeLevels: string[]): string {
  if (!gradeLevels || gradeLevels.length === 0) return "";
  if (gradeLevels.length === 1) return gradeLevels[0];
  if (gradeLevels.length === 2) return `${gradeLevels[0]} and ${gradeLevels[1]}`;
  return `${gradeLevels[0]} through ${gradeLevels[gradeLevels.length - 1]}`;
}

/**
 * POST - Generate a new welcome video
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!HEYGEN_API_KEY || !HEYGEN_AVATAR_ID) {
      return NextResponse.json(
        { error: "HeyGen not configured" },
        { status: 500 }
      );
    }

    const userId = session.user.id;

    // CHECK 1: Video URL already completed and persisted?
    const existing = await prisma.userProfile.findUnique({
      where: { userId },
      select: { welcomeVideoUrl: true, welcomeVideoId: true },
    });

    if (existing?.welcomeVideoUrl) {
      console.log("[HEYGEN] Returning cached video URL");
      return NextResponse.json({
        videoUrl: existing.welcomeVideoUrl,
        status: "completed",
        cached: true,
      });
    }

    // CHECK 2: Video already in progress? Resume polling instead of regenerating.
    if (existing?.welcomeVideoId) {
      console.log("[HEYGEN] Video already in progress:", existing.welcomeVideoId);
      return NextResponse.json({
        videoId: existing.welcomeVideoId,
        status: "processing",
        message: "Video is already being generated. Poll GET endpoint for status.",
      });
    }

    // CHECK 3: Only now generate a brand-new video
    const profile = await getUserProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const script = generateWelcomeScript(profile, session.user.name);
    console.log("[HEYGEN] Generating NEW video with script:", script.substring(0, 100) + "...");

    const voiceId = process.env.HEYGEN_VOICE_ID;

    const createResponse = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: HEYGEN_AVATAR_ID,
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: script,
              voice_id: voiceId || "90dd58f828dc4903ac5386f92d9c7e83",
            },
          },
        ],
        dimension: { width: 1280, height: 720 },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error("[HEYGEN] Create video error:", error);
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }

    const createData = await createResponse.json();
    const videoId = createData.data?.video_id;

    if (!videoId) {
      console.error("[HEYGEN] No video ID returned:", createData);
      return NextResponse.json({ error: "No video ID returned" }, { status: 500 });
    }

    // IMMEDIATELY persist videoId so refreshes don't re-generate
    await prisma.userProfile.update({
      where: { userId },
      data: { welcomeVideoId: videoId },
    });

    console.log("[HEYGEN] Video created and ID persisted:", videoId);

    return NextResponse.json({
      videoId,
      status: "processing",
      message: "Video is being generated. Poll GET endpoint for status.",
    });
  } catch (error) {
    console.error("[HEYGEN] Error:", error);
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 });
  }
}

/**
 * GET - Check video status or get cached video
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videoIdParam = req.nextUrl.searchParams.get("videoId");
    const userId = session.user.id;

    // Check DB for persisted video URL or in-progress videoId
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { welcomeVideoUrl: true, welcomeVideoId: true },
    });

    if (profile?.welcomeVideoUrl) {
      return NextResponse.json({
        videoUrl: profile.welcomeVideoUrl,
        status: "completed",
        cached: true,
      });
    }

    // Use param videoId, or fall back to DB-persisted in-progress videoId
    const videoId = videoIdParam || profile?.welcomeVideoId;

    // If no videoId at all, check if user has a profile (eligible for video)
    if (!videoId) {
      const hasProfile = await getUserProfile(userId);
      return NextResponse.json({
        hasProfile: !!hasProfile,
        hasCachedVideo: false,
        // Tell the client if there's an in-progress video to resume
        videoId: profile?.welcomeVideoId || null,
      });
    }

    if (!HEYGEN_API_KEY) {
      return NextResponse.json({ error: "HeyGen not configured" }, { status: 500 });
    }

    // Check video status from HeyGen
    const statusResponse = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      { headers: { "X-Api-Key": HEYGEN_API_KEY } }
    );

    if (!statusResponse.ok) {
      const error = await statusResponse.text();
      console.error("[HEYGEN] Status check error:", error);
      return NextResponse.json({ error: "Failed to check video status" }, { status: 500 });
    }

    const statusData = await statusResponse.json();
    const status = statusData.data?.status;
    const videoUrl = statusData.data?.video_url;

    console.log("[HEYGEN] Video status:", status);

    if (status === "completed" && videoUrl) {
      // Persist URL and clear in-progress videoId
      await prisma.userProfile.update({
        where: { userId },
        data: { welcomeVideoUrl: videoUrl, welcomeVideoId: null },
      });

      return NextResponse.json({ videoUrl, status: "completed" });
    }

    if (status === "failed") {
      // Clear the failed videoId so a fresh one can be generated
      await prisma.userProfile.update({
        where: { userId },
        data: { welcomeVideoId: null },
      });

      return NextResponse.json({
        status: "failed",
        error: statusData.data?.error || "Video generation failed",
      });
    }

    return NextResponse.json({ status: status || "processing" });
  } catch (error) {
    console.error("[HEYGEN] Status error:", error);
    return NextResponse.json({ error: "Failed to check video status" }, { status: 500 });
  }
}
