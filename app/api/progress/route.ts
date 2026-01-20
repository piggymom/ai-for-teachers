import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getUserProgress, markWeekCompleted } from "@/lib/progress";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ status: "not_started" }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const weekNumberParam = searchParams.get("weekNumber");
  const weekNumber = weekNumberParam ? Number(weekNumberParam) : null;

  if (weekNumber !== null && Number.isNaN(weekNumber)) {
    return NextResponse.json({ error: "Invalid week number" }, { status: 400 });
  }

  if (weekNumber !== null) {
    const progress = await getUserProgress(session.user.id);
    const entry = progress.find((item) => item.weekNumber === weekNumber);
    return NextResponse.json({ status: entry?.status ?? "not_started" });
  }

  const progress = await getUserProgress(session.user.id);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekNumber } = (await request.json()) as { weekNumber?: number };

  if (typeof weekNumber !== "number") {
    return NextResponse.json({ error: "Invalid week number" }, { status: 400 });
  }

  await markWeekCompleted(session.user.id, weekNumber);

  return NextResponse.json({ status: "ok" });
}
