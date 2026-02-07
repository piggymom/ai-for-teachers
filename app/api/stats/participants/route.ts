import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Count users who have completed onboarding (have a profile)
    const count = await prisma.userProfile.count();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get participant count:", error);
    return NextResponse.json({ count: 0 });
  }
}
