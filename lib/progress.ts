import { prisma } from "@/lib/prisma";

export async function getUserProgress(userId: string) {
  return prisma.progress.findMany({
    where: { userId },
    orderBy: { weekNumber: "asc" },
  });
}

export async function markWeekCompleted(userId: string, weekNumber: number) {
  return prisma.progress.upsert({
    where: {
      userId_weekNumber: {
        userId,
        weekNumber,
      },
    },
    update: {
      status: "completed",
    },
    create: {
      userId,
      weekNumber,
      status: "completed",
    },
  });
}
