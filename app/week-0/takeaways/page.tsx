import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/app/components/layouts/dashboard-layout";
import { TakeawaysContent } from "@/app/components/takeaways-content";

export default async function Week0TakeawaysPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const weekNumber = 0;

  // Fetch artifacts for this week
  const artifacts = await prisma.artifact.findMany({
    where: {
      userId: session.user.id,
      weekNumber: weekNumber,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch conversation summary from ledger
  const ledger = await prisma.conversationLedger.findFirst({
    where: {
      userId: session.user.id,
      weekNumber: weekNumber,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch user profile for personalization
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Check if next week exists
  const nextWeekNumber = weekNumber + 1;
  const hasNextWeek = nextWeekNumber <= 6;

  return (
    <DashboardLayout>
      <TakeawaysContent
        weekNumber={weekNumber}
        artifacts={artifacts.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          content: a.content,
          description: a.description,
        }))}
        ledger={
          ledger
            ? {
                sessionSummary: ledger.sessionSummary,
                keyInsights: [],
                diagnosticLevel: ledger.diagnosticLevel,
              }
            : null
        }
        profile={
          profile
            ? {
                primaryGoal: profile.primaryGoal,
                biggestTimeDrains: profile.biggestTimeDrains,
              }
            : null
        }
        hasNextWeek={hasNextWeek}
        nextWeekNumber={nextWeekNumber}
      />
    </DashboardLayout>
  );
}
