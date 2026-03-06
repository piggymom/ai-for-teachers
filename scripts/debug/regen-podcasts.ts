#!/usr/bin/env npx tsx
/**
 * Regenerate podcasts for all completed weeks.
 * Usage: npx tsx debug-loop/regen-podcasts.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../..", ".env.local") });

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const { generatePodcast } = await import("../../lib/podcast");

  const user = await prisma.user.findFirst({ select: { id: true, name: true } });
  if (!user) {
    console.log("No user found");
    process.exit(1);
  }
  console.log(`User: ${user.name} (${user.id})`);

  // Find completed weeks
  const progress = await prisma.progress.findMany({
    where: { userId: user.id, status: "completed" },
    select: { weekNumber: true },
    orderBy: { weekNumber: "asc" },
  });

  const weeks = progress.map((p: { weekNumber: number }) => p.weekNumber);
  console.log(`Completed weeks: ${weeks.join(", ")}`);

  for (const week of weeks) {
    // Check if already cached
    const existing = await prisma.podcast.findUnique({
      where: { userId_weekNumber: { userId: user.id, weekNumber: week } },
      select: { id: true },
    });
    if (existing) {
      console.log(`Week ${week}: already cached, skipping`);
      continue;
    }

    console.log(`Week ${week}: generating...`);
    const start = Date.now();
    const ok = await generatePodcast(user.id, week);
    console.log(`Week ${week}: ${ok ? "done" : "failed"} (${Date.now() - start}ms)`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
