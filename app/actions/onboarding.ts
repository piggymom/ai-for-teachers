"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createUserProfile, type UserProfileData } from "@/lib/profile";

export async function saveOnboardingProfile(data: UserProfileData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await createUserProfile(session.user.id, data);

  redirect("/home");
}
