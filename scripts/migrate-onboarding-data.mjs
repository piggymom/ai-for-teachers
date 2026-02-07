import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateOnboardingData() {
  // This script migrates existing UserProfile data:
  // - Renames 'goals' to 'goalDetails'
  // - Adds default 'primaryGoal' of 'save_time'
  // - Removes: schoolContext, successLooksLike, tonePreference (handled by schema)

  const profiles = await prisma.$queryRaw`
    SELECT id, goals FROM "UserProfile" WHERE goals IS NOT NULL
  `;

  console.log(`Found ${profiles.length} profiles to migrate`);

  for (const profile of profiles) {
    await prisma.$executeRaw`
      UPDATE "UserProfile"
      SET "goalDetails" = ${profile.goals},
          "primaryGoal" = 'save_time'
      WHERE id = ${profile.id}
    `;
    console.log(`Migrated profile ${profile.id}`);
  }

  console.log("Migration complete!");
}

migrateOnboardingData()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
