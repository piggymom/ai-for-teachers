import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/consent?type=tos_pp
 * Check if the current user has granted a specific consent type.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type");

  const where: { userId: string; granted: boolean; type?: string } = {
    userId: session.user.id,
    granted: true,
  };
  if (type) {
    where.type = type;
  }

  const consents = await prisma.consent.findMany({
    where,
    orderBy: { timestamp: "desc" },
    select: { type: true, version: true, granted: true, timestamp: true },
  });

  return NextResponse.json({ consents });
}

/**
 * POST /api/consent
 * Record a new consent grant.
 * Body: { type: string, version: string }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, version } = await req.json();

  if (!type || !version) {
    return NextResponse.json(
      { error: "type and version are required" },
      { status: 400 }
    );
  }

  const validTypes = ["tos_pp", "ai_processing", "audio_features", "pilot_participation"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid consent type. Must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const consent = await prisma.consent.create({
    data: {
      userId: session.user.id,
      type,
      version,
      granted: true,
    },
  });

  return NextResponse.json({ consent: { id: consent.id, type: consent.type, version: consent.version, timestamp: consent.timestamp } });
}
