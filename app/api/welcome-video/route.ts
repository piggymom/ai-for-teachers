import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_AVATAR_ID = process.env.HEYGEN_AVATAR_ID;

// Cache for video URLs (in production, store in DB)
const videoCache = new Map<string, { videoUrl: string; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a personalized welcome script based on user profile
 */
function generateWelcomeScript(profile: {
  role: string;
  roleOther?: string | null;
  gradeLevels: string[];
  subjects: string[];
  goals: string;
  aiExperienceLevel: string;
}, userName?: string | null): string {
  const name = userName?.split(" ")[0] || "there";
  const role = profile.roleOther || profile.role;
  const grades = profile.gradeLevels.join(" and ");
  const subjects = profile.subjects.length > 0
    ? profile.subjects.slice(0, 2).join(" and ")
    : "your classes";

  const experienceIntro = profile.aiExperienceLevel === "new"
    ? "I know AI might feel new and maybe a bit overwhelming"
    : profile.aiExperienceLevel === "advanced"
    ? "I can see you've already got some AI experience under your belt"
    : "It sounds like you've started exploring AI a bit";

  return `Hey ${name}! Welcome to AI for Teachers.

I'm so glad you're here. As a ${role} teaching ${grades}, working with ${subjects}, you're exactly who this course was built for.

${experienceIntro}, and that's totally fine. Over the next six weeks, we're going to explore practical ways AI can save you time, without any of the hype or overwhelm.

Your goal of "${profile.goals.slice(0, 100)}" is something we'll work toward together.

Skippy, your AI tutor, is ready to meet you. He's going to personalize everything based on what you just shared. No generic advice here.

Ready to get started? Let's do this.`;
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
    const cacheKey = crypto.createHash("sha256").update(userId).digest("hex");

    // Check cache first
    const cached = videoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        videoUrl: cached.videoUrl,
        status: "completed",
        cached: true
      });
    }

    // Get user profile
    const profile = await getUserProfile(userId);
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Generate personalized script
    const script = generateWelcomeScript(profile, session.user.name);

    console.log("[HEYGEN] Generating video with script:", script.substring(0, 100) + "...");

    // Get the voice ID from env or use avatar's default
    const voiceId = process.env.HEYGEN_VOICE_ID;

    // Create video via HeyGen API
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
              voice_id: voiceId || "90dd58f828dc4903ac5386f92d9c7e83", // Asher Scott voice
            },
          },
        ],
        dimension: {
          width: 1280,
          height: 720,
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error("[HEYGEN] Create video error:", error);
      return NextResponse.json(
        { error: "Failed to create video" },
        { status: 500 }
      );
    }

    const createData = await createResponse.json();
    const videoId = createData.data?.video_id;

    if (!videoId) {
      console.error("[HEYGEN] No video ID returned:", createData);
      return NextResponse.json(
        { error: "No video ID returned" },
        { status: 500 }
      );
    }

    console.log("[HEYGEN] Video created with ID:", videoId);

    return NextResponse.json({
      videoId,
      status: "processing",
      message: "Video is being generated. Poll GET endpoint for status.",
    });
  } catch (error) {
    console.error("[HEYGEN] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
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

    const videoId = req.nextUrl.searchParams.get("videoId");
    const userId = session.user.id;
    const cacheKey = crypto.createHash("sha256").update(userId).digest("hex");

    // Check cache first
    const cached = videoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        videoUrl: cached.videoUrl,
        status: "completed",
        cached: true,
      });
    }

    // If no videoId provided, check if user has a profile (eligible for video)
    if (!videoId) {
      const profile = await getUserProfile(userId);
      return NextResponse.json({
        hasProfile: !!profile,
        hasCachedVideo: false,
      });
    }

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { error: "HeyGen not configured" },
        { status: 500 }
      );
    }

    // Check video status
    const statusResponse = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        headers: {
          "X-Api-Key": HEYGEN_API_KEY,
        },
      }
    );

    if (!statusResponse.ok) {
      const error = await statusResponse.text();
      console.error("[HEYGEN] Status check error:", error);
      return NextResponse.json(
        { error: "Failed to check video status" },
        { status: 500 }
      );
    }

    const statusData = await statusResponse.json();
    const status = statusData.data?.status;
    const videoUrl = statusData.data?.video_url;

    console.log("[HEYGEN] Video status:", status);

    if (status === "completed" && videoUrl) {
      // Cache the video URL
      videoCache.set(cacheKey, { videoUrl, timestamp: Date.now() });

      return NextResponse.json({
        videoUrl,
        status: "completed",
      });
    }

    if (status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: statusData.data?.error || "Video generation failed",
      });
    }

    return NextResponse.json({
      status: status || "processing",
    });
  } catch (error) {
    console.error("[HEYGEN] Status error:", error);
    return NextResponse.json(
      { error: "Failed to check video status" },
      { status: 500 }
    );
  }
}
