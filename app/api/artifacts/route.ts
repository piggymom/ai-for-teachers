import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserArtifacts } from "@/lib/artifacts";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const week = searchParams.get("week");

  const artifacts = await getUserArtifacts(
    session.user.id,
    week ? parseInt(week) : undefined
  );

  return NextResponse.json({ artifacts });
}
