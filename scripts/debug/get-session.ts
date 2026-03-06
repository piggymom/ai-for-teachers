#!/usr/bin/env npx tsx
/**
 * Grabs a valid session token from the database and saves it to .session
 * so the debug loop browser can authenticate.
 *
 * Usage: npx tsx debug-loop/get-session.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";

config({ path: resolve(__dirname, "..", ".env.local") });

async function main() {
  // Dynamic import to get env vars loaded first
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // Find the most recent valid session
    const session = await prisma.session.findFirst({
      where: {
        expires: { gt: new Date() },
      },
      orderBy: { expires: "desc" },
      select: {
        sessionToken: true,
        expires: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!session) {
      console.log("❌ No valid session found in database.");
      console.log("   Log in at http://localhost:3000 first, then re-run.");
      process.exit(1);
    }

    console.log(`✅ Found session for ${session.user.name} (${session.user.email})`);
    console.log(`   Expires: ${session.expires}`);

    const outPath = resolve(__dirname, ".session");
    writeFileSync(outPath, session.sessionToken, "utf-8");
    console.log(`   Saved to: debug-loop/.session`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
