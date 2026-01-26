import { prisma } from "./prisma";

export type UserProfileData = {
  role: string;
  roleOther?: string | null;
  gradeLevels: string[];
  subjects: string[];
  schoolContext?: string | null;
  aiExperienceLevel: string;
  constraints?: string | null;
  biggestTimeDrains: string[];
  goals: string;
  successLooksLike?: string | null;
  tonePreference?: string | null;
};

export async function getUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

export async function hasUserProfile(userId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return profile !== null;
}

export async function createUserProfile(userId: string, data: UserProfileData) {
  return prisma.userProfile.create({
    data: {
      userId,
      ...data,
    },
  });
}

/**
 * Build a concise system context string from the user's profile
 * for use in AI conversations. Max ~1200 characters.
 */
export function buildProfileContext(profile: UserProfileData): string {
  const parts: string[] = [];

  // Role and grades
  const role = profile.roleOther || profile.role;
  const grades = profile.gradeLevels.join(", ");
  parts.push(`Teacher: ${role}, grades ${grades}.`);

  // Subjects
  if (profile.subjects.length > 0) {
    parts.push(`Subjects: ${profile.subjects.join(", ")}.`);
  }

  // School context
  if (profile.schoolContext) {
    parts.push(`Context: ${profile.schoolContext}`);
  }

  // AI experience
  const expMap: Record<string, string> = {
    new: "New to AI tools",
    some: "Some AI experience",
    advanced: "Advanced AI user",
  };
  parts.push(`AI experience: ${expMap[profile.aiExperienceLevel] || profile.aiExperienceLevel}.`);

  // Constraints
  if (profile.constraints) {
    parts.push(`Constraints: ${profile.constraints}`);
  }

  // Time drains
  if (profile.biggestTimeDrains.length > 0) {
    parts.push(`Biggest time drains: ${profile.biggestTimeDrains.join(", ")}.`);
  }

  // Goals
  if (profile.goals) {
    parts.push(`Goals: ${profile.goals}`);
  }

  // Success
  if (profile.successLooksLike) {
    parts.push(`Success looks like: ${profile.successLooksLike}`);
  }

  // Tone preference
  if (profile.tonePreference) {
    const toneMap: Record<string, string> = {
      direct: "Prefer direct, concise responses",
      supportive: "Prefer supportive, encouraging tone",
      collaborative: "Prefer collaborative, exploratory tone",
      "no-fluff": "Prefer no-fluff, practical responses only",
    };
    parts.push(toneMap[profile.tonePreference] || `Tone: ${profile.tonePreference}`);
  }

  // Join and truncate if needed
  let context = parts.join(" ");
  if (context.length > 1200) {
    context = context.substring(0, 1197) + "...";
  }

  return context;
}

/**
 * Fetch profile and return context string, or null if no profile exists
 */
export async function getProfileContextForUser(userId: string): Promise<string | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  return buildProfileContext(profile);
}
