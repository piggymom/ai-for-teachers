import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasUserProfile } from "@/lib/profile";

/**
 * Server component that checks if user has completed onboarding.
 * If not, redirects to /onboarding.
 * Use this in layouts for protected routes.
 */
export async function RequireProfile({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Not logged in - redirect to landing
    redirect("/");
  }

  const hasProfile = await hasUserProfile(session.user.id);
  if (!hasProfile) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}

/**
 * Check if user needs onboarding without redirecting.
 * Returns true if user has a profile, false otherwise.
 */
export async function checkHasProfile(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  return hasUserProfile(session.user.id);
}
