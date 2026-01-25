import { prisma } from "./prisma";

export async function markWeekCompleted(userId: string, weekNumber: number) {
  return prisma.progress.upsert({
    where: {
      userId_weekNumber: {
        userId,
        weekNumber,
      },
    },
    update: { status: "completed" },
    create: {
      userId,
      weekNumber,
      status: "completed",
    },
  });
}

export async function getUserProgress(userId: string) {
  const records = await prisma.progress.findMany({
    where: { userId },
  });

  const progress: Record<number, string> = {};
  for (const record of records) {
    progress[record.weekNumber] = record.status;
  }

  return progress;
}
