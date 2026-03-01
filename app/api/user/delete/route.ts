import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/user/delete
 * Delete the current user's account and all associated data.
 * Prisma cascading deletes handle all related records.
 */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Cascading deletes in schema handle:
  // Account, Session, Progress, UserProfile, SkippyMessage,
  // ConversationLedger, Artifact, Consent
  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ success: true, message: "Account and all data deleted." });
}
