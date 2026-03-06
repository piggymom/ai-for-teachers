import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating ConversationLedger table...');

  try {
    // Create table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ConversationLedger" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "weekNumber" INTEGER NOT NULL,
        "currentPhase" TEXT NOT NULL DEFAULT 'DISCOVER',
        "phaseHistory" TEXT[] DEFAULT ARRAY['DISCOVER']::TEXT[],
        "exchangeCount" INTEGER NOT NULL DEFAULT 0,
        "diagnosticAssessed" BOOLEAN NOT NULL DEFAULT false,
        "diagnosticLevel" TEXT,
        "diagnosticEvidence" TEXT,
        "diagnosticReadyFor" TEXT,
        "diagnosticMisconceptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "sessionSummary" TEXT NOT NULL DEFAULT '',
        "artifactInProgress" BOOLEAN NOT NULL DEFAULT false,
        "artifactType" TEXT,
        "artifactState" TEXT,
        "artifactIterations" INTEGER NOT NULL DEFAULT 0,
        "engagementEnergy" TEXT NOT NULL DEFAULT 'medium',
        "engagementNotes" TEXT,
        "guidance" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ConversationLedger_pkey" PRIMARY KEY ("id")
      )
    `);
    console.log('Table created.');

    // Create unique index
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ConversationLedger_userId_weekNumber_key"
      ON "ConversationLedger"("userId", "weekNumber")
    `);
    console.log('Unique index created.');

    // Create userId index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ConversationLedger_userId_idx"
      ON "ConversationLedger"("userId")
    `);
    console.log('userId index created.');

    // Add foreign key (may fail if already exists)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ConversationLedger"
        ADD CONSTRAINT "ConversationLedger_userId_fkey"
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
