import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOTAL_WEEKS = 7;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const formData = await request.formData();
  const role = formData.get("role");
  const gradeBand = formData.get("gradeBand");
  const subject = formData.get("subject");
  const goal = formData.get("goal");

  if (!role || !gradeBand || !subject || !goal) {
    return NextResponse.json(
      { error: "Missing onboarding fields." },
      { status: 400 }
    );
  }

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: {
      role: role.toString(),
      gradeBand: gradeBand.toString(),
      subject: subject.toString(),
      goal: goal.toString(),
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      role: role.toString(),
      gradeBand: gradeBand.toString(),
      subject: subject.toString(),
      goal: goal.toString(),
      completedAt: new Date(),
    },
  });

  const progressRows = Array.from({ length: TOTAL_WEEKS }, (_, index) => ({
    userId: session.user.id,
    weekNumber: index,
    status: "not_started" as const,
  }));

  await prisma.progress.createMany({
    data: progressRows,
    skipDuplicates: true,
  });

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("onboarding_complete", "true", {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
