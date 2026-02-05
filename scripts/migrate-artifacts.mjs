import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating Artifact table...');

  try {
    // Create table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Artifact" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "weekNumber" INTEGER NOT NULL,
        "weekTopic" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "description" TEXT,
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
      )
    `);
    console.log('Table created.');

    // Create userId index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Artifact_userId_idx"
      ON "Artifact"("userId")
    `);
    console.log('userId index created.');

    // Create userId + weekNumber index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Artifact_userId_weekNumber_idx"
      ON "Artifact"("userId", "weekNumber")
    `);
    console.log('userId+weekNumber index created.');

    // Add foreign key (may fail if already exists)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Artifact"
        ADD CONSTRAINT "Artifact_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log('Foreign key created.');
    } catch (e) {
      console.log('Foreign key may already exist:', e.message);
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
