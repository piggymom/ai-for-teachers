import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekNumber = parseInt(searchParams.get("weekNumber") || "0", 10);

  try {
    const ledger = await prisma.conversationLedger.findFirst({
      where: {
        userId: session.user.id,
        weekNumber: weekNumber,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ ledger });
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return NextResponse.json({ error: "Failed to fetch ledger" }, { status: 500 });
  }
}
