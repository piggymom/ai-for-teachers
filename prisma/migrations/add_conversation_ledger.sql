-- CreateTable
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ConversationLedger_userId_weekNumber_key" ON "ConversationLedger"("userId", "weekNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ConversationLedger_userId_idx" ON "ConversationLedger"("userId");

-- AddForeignKey
ALTER TABLE "ConversationLedger" ADD CONSTRAINT "ConversationLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
