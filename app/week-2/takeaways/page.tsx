import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/app/components/layouts/dashboard-layout";
import { TakeawaysContent } from "@/app/components/takeaways-content";

export default async function Week2TakeawaysPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const weekNumber = 2;

  const artifacts = await prisma.artifact.findMany({
    where: {
      userId: session.user.id,
      weekNumber: weekNumber,
    },
    orderBy: { createdAt: "desc" },
  });

  const ledger = await prisma.conversationLedger.findFirst({
    where: {
      userId: session.user.id,
      weekNumber: weekNumber,
    },
    orderBy: { updatedAt: "desc" },
  });

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

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
