import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/progress - Get all progress for current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ progress: {} }, { status: 200 });
  }

  const progressRecords = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  const progress: Record<number, string> = {};
  for (const record of progressRecords) {
    progress[record.weekNumber] = record.status;
  }

  return NextResponse.json({ progress });
}

// POST /api/progress - Update progress for a week
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in to save progress" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { weekNumber, status } = body;

  if (typeof weekNumber !== "number" || weekNumber < 1 || weekNumber > 6) {
    return NextResponse.json(
      { error: "Invalid week number" },
      { status: 400 }
    );
  }

  const validStatuses = ["not_started", "in_progress", "completed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_weekNumber: {
        userId: session.user.id,
        weekNumber,
      },
    },
    update: { status },
    create: {
      userId: session.user.id,
      weekNumber,
      status,
    },
  });

  return NextResponse.json({ progress });
}
