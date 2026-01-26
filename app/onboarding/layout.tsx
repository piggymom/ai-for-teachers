import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasUserProfile } from "@/lib/profile";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Must be logged in to access onboarding
  if (!session?.user?.id) {
    redirect("/");
  }

  // If already has profile, redirect to home
  const hasProfile = await hasUserProfile(session.user.id);
  if (hasProfile) {
    redirect("/home");
  }

  return <>{children}</>;
}
