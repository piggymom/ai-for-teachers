"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { markWeekCompleted } from "@/lib/progress";

export async function completeWeekAndReturn(weekNumber: number) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    await markWeekCompleted(session.user.id, weekNumber);
  }

  redirect("/home");
}
