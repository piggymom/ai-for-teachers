import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/export
 * Export all user data as JSON for data portability (GDPR/privacy rights).
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, profile, messages, ledgers, artifacts, progress, consents] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.userProfile.findUnique({
        where: { userId },
        select: {
          role: true,
          roleOther: true,
          gradeLevels: true,
          subjects: true,
          aiExperienceLevel: true,
          constraints: true,
          biggestTimeDrains: true,
          primaryGoal: true,
          goalDetails: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.skippyMessage.findMany({
        where: { userId },
        select: {
          week: true,
          role: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.conversationLedger.findMany({
        where: { userId },
        select: {
          weekNumber: true,
          currentPhase: true,
          exchangeCount: true,
          diagnosticAssessed: true,
          diagnosticLevel: true,
          diagnosticEvidence: true,
          diagnosticReadyFor: true,
          diagnosticMisconceptions: true,
          sessionSummary: true,
          artifactInProgress: true,
          artifactType: true,
          artifactIterations: true,
          engagementEnergy: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { weekNumber: "asc" },
      }),
      prisma.artifact.findMany({
        where: { userId },
        select: {
          weekNumber: true,
          weekTopic: true,
          title: true,
          type: true,
          content: true,
          description: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.progress.findMany({
        where: { userId },
        select: {
          weekNumber: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { weekNumber: "asc" },
      }),
      prisma.consent.findMany({
        where: { userId },
        select: {
          type: true,
          version: true,
          granted: true,
          timestamp: true,
        },
        orderBy: { timestamp: "asc" },
      }),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user,
    profile,
    conversations: messages,
    assessments: ledgers,
    artifacts,
    progress,
    consents,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="ai-for-teachers-data-${userId.slice(-8)}.json"`,
    },
  });
}
