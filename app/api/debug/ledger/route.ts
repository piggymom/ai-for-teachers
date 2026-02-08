import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Only available in development
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekNumber = searchParams.get('weekNumber');

  // Get all ledgers for this user
  const ledgers = await prisma.conversationLedger.findMany({
    where: {
      userId: session.user.id,
      ...(weekNumber ? { weekNumber: parseInt(weekNumber) } : {})
    },
    orderBy: { updatedAt: 'desc' }
  });

  // Get recent messages for context
  const recentMessages = await prisma.skippyMessage.findMany({
    where: {
      userId: session.user.id,
      ...(weekNumber ? { week: parseInt(weekNumber) } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return NextResponse.json({
    userId: session.user.id,
    ledgerCount: ledgers.length,
    ledgers: ledgers.map(l => ({
      id: l.id,
      weekNumber: l.weekNumber,
      currentPhase: l.currentPhase,
      diagnosticLevel: l.diagnosticLevel,
      diagnosticAssessed: l.diagnosticAssessed,
      diagnosticEvidence: l.diagnosticEvidence?.slice(0, 200),
      exchangeCount: l.exchangeCount,
      sessionSummary: l.sessionSummary?.slice(0, 200),
      guidance: l.guidance,
      artifactInProgress: l.artifactInProgress,
      artifactType: l.artifactType,
      engagementEnergy: l.engagementEnergy,
      updatedAt: l.updatedAt,
      createdAt: l.createdAt
    })),
    recentMessages: recentMessages.map(m => ({
      role: m.role,
      week: m.week,
      contentPreview: m.content.slice(0, 150) + (m.content.length > 150 ? '...' : ''),
      createdAt: m.createdAt
    }))
  });
}

// Force ledger actions (reset or force classify)
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekNumber, action } = await request.json();

  if (action === 'reset') {
    // Delete existing ledger for this week
    await prisma.conversationLedger.deleteMany({
      where: { userId: session.user.id, weekNumber }
    });

    return NextResponse.json({ success: true, message: `Ledger reset for week ${weekNumber}` });
  }

  if (action === 'force_classify') {
    // Get the most recent exchange and re-run classifier
    const messages = await prisma.skippyMessage.findMany({
      where: { userId: session.user.id, week: weekNumber },
      orderBy: { createdAt: 'desc' },
      take: 4 // Get last 4 messages to find the most recent pair
    });

    if (messages.length < 2) {
      return NextResponse.json({ error: "Not enough messages to classify" }, { status: 400 });
    }

    const ledger = await prisma.conversationLedger.findFirst({
      where: { userId: session.user.id, weekNumber }
    });

    if (!ledger) {
      return NextResponse.json({ error: "No ledger found" }, { status: 404 });
    }

    // Find the most recent user message and the assistant response after it
    const userMsg = messages.find(m => m.role === 'user');
    const asstMsg = messages.find(m => m.role === 'assistant');

    if (!userMsg || !asstMsg) {
      return NextResponse.json({ error: "Could not find user/assistant pair" }, { status: 400 });
    }

    // Import and run classifier
    const { updateLedgerFromExchange, getOrCreateLedger } = await import('@/lib/ledger');
    const currentLedger = await getOrCreateLedger(session.user.id, weekNumber);

    try {
      const updatedLedger = await updateLedgerFromExchange(currentLedger, userMsg.content, asstMsg.content);

      return NextResponse.json({
        success: true,
        message: "Classifier re-run complete",
        before: {
          phase: currentLedger.currentPhase,
          level: currentLedger.diagnostic.level,
          exchangeCount: currentLedger.exchangeCount
        },
        after: {
          phase: updatedLedger.currentPhase,
          level: updatedLedger.diagnostic.level,
          exchangeCount: updatedLedger.exchangeCount,
          guidance: updatedLedger.guidance
        }
      });
    } catch (err) {
      return NextResponse.json({
        error: "Classifier failed",
        details: String(err)
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
