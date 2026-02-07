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
  primaryGoal: string;
  biggestTimeDrains: string[];
  aiExperienceLevel: string;
}, userName?: string | null): string {
  const name = userName?.split(" ")[0] || "there";
  const role = profile.roleOther || profile.role;
  const grades = formatGrades(profile.gradeLevels);
  const subjects = profile.subjects.length > 0
    ? profile.subjects.slice(0, 2).join(" and ")
    : "your students";

  // Experience intro
  const experienceIntro: Record<string, string> = {
    new: "I know AI might feel new and maybe a bit overwhelming",
    some: "It sounds like you've started exploring AI a bit",
    advanced: "I can see you've already got some AI experience under your belt"
  };
  const experienceText = experienceIntro[profile.aiExperienceLevel] || "Wherever you're starting from";

  // Pain acknowledgment (from top time drain)
  const painMap: Record<string, string> = {
    "Lesson planning": "I know lesson planning can eat up every free moment you have",
    "Differentiation": "I know differentiation is one of those things that sounds simple until you're making three versions of everything",
    "Feedback": "I know giving meaningful feedback to every student feels impossible some weeks",
    "IEP/admin paperwork": "I know the paperwork never stops piling up",
    "Family comms": "I know family communication takes way more time than anyone realizes",
    "Assessment design": "I know building good assessments is its own full-time job",
    "Classroom management": "I know some days the management piece takes everything you've got",
    "Data analysis": "I know you're drowning in data but starving for insights"
  };
  const topTimeDrain = profile.biggestTimeDrains?.[0];
  const painAcknowledgment = painMap[topTimeDrain] || "I know teaching asks more of you than any job should";

  // Goal statement (from primary goal)
  const goalMap: Record<string, string> = {
    save_time: "You're here because you want to reclaim some of your time — and that's exactly what we're going to do",
    better_materials: "You're here because you want to create better materials without working twice as hard — I've got you",
    faster_feedback: "You're here because you want to give better feedback without it taking all night — we'll build that",
    handle_admin: "You're here because you want the admin stuff off your plate so you can focus on teaching — let's make that happen",
    build_confidence: "You're here because you want to feel confident with these tools, not confused — that's exactly where we're headed"
  };
  const goalStatement = goalMap[profile.primaryGoal] || "Whatever brought you here, we're going to make it worth your time";

  return `Hey ${name}! Welcome to AI for Teachers.

I'm so glad you're here. As a ${role} teaching ${subjects} to ${grades} students, you're exactly who this course was built for.

${experienceText}, and that's totally fine.

${painAcknowledgment}. ${goalStatement}.

Over the next six weeks, we're going to build real prompts and workflows you can use in your classroom. No hype, no overwhelm — just practical tools that actually help.

Now, I want to introduce you to Skippy. He's your AI tutor, and he's going to personalize everything based on what you just shared. Think of him as your guide through the course — he'll help you build something useful every single week.

Ready? Let's do this.`;
}

function formatGrades(gradeLevels: string[]): string {
  if (!gradeLevels || gradeLevels.length === 0) return "your";
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
