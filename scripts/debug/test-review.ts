#!/usr/bin/env npx tsx
/**
 * Test the podcast reviewer against week 3.
 * Usage: npx tsx scripts/debug/test-review.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "..", "..", ".env.local") });

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({ select: { id: true, name: true } });
  if (!user) {
    console.log("No user found");
    process.exit(1);
  }
  console.log(`User: ${user.name} (${user.id})`);

  // Delete existing week 3 podcast so it regenerates with review
  const deleted = await prisma.podcast.deleteMany({
    where: { userId: user.id, weekNumber: 3 },
  });
  console.log(`Deleted ${deleted.count} existing week 3 podcast(s)`);

  // Check conversation exists
  const msgCount = await prisma.skippyMessage.count({
    where: { userId: user.id, week: 3 },
  });
  console.log(`Week 3 messages: ${msgCount}`);

  if (msgCount === 0) {
    console.log("No week 3 conversation data — cannot test");
    process.exit(1);
  }

  // Generate with review loop
  const { generatePodcast } = await import("../../lib/podcast");
  console.log("\n--- Starting podcast generation with review ---\n");
  const start = Date.now();
  const ok = await generatePodcast(user.id, 3);
  console.log(`\nResult: ${ok ? "SUCCESS" : "FAILED"} (${Date.now() - start}ms)`);

  if (ok) {
    const podcast = await prisma.podcast.findUnique({
      where: { userId_weekNumber: { userId: user.id, weekNumber: 3 } },
      select: { transcript: true },
    });
    console.log("\n--- Final Transcript ---\n");
    console.log(podcast?.transcript);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
