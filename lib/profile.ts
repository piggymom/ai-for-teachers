import { prisma } from "./prisma";

// New simplified onboarding data (v2)
export type UserProfileData = {
  teachesWhat: string;
  aiExperienceLevel: string; // "new" | "some" | "advanced"
  painPoint: string; // "lesson_planning" | "feedback" | "differentiation" | "admin"
};

// Legacy type for backward compatibility
export type LegacyProfileData = {
  role: string;
  roleOther?: string | null;
  gradeLevels: string[];
  subjects: string[];
  aiExperienceLevel: string;
  constraints?: string | null;
  biggestTimeDrains: string[];
  primaryGoal: string;
  goalDetails: string;
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
  const parsed = parseTeachesWhat(data.teachesWhat);
  return prisma.userProfile.create({
    data: {
      userId,
      teachesWhat: data.teachesWhat,
      aiExperienceLevel: data.aiExperienceLevel,
      painPoint: data.painPoint,
      // Also populate legacy fields from parsed data for backward compat
      gradeLevels: parsed.grades,
      subjects: parsed.subjects,
      biggestTimeDrains: [painPointToLabel(data.painPoint)],
      primaryGoal: painPointToGoal(data.painPoint),
    },
  });
}

const PAIN_POINT_LABELS: Record<string, string> = {
  lesson_planning: "Lesson planning",
  feedback: "Feedback & grading",
  differentiation: "Creating differentiated materials",
  admin: "Admin & paperwork",
};

const PAIN_POINT_TO_GOAL: Record<string, string> = {
  lesson_planning: "save_time",
  feedback: "faster_feedback",
  differentiation: "better_materials",
  admin: "handle_admin",
};

export function painPointToLabel(painPoint: string): string {
  return PAIN_POINT_LABELS[painPoint] || painPoint;
}

function painPointToGoal(painPoint: string): string {
  return PAIN_POINT_TO_GOAL[painPoint] || "save_time";
}

/**
 * Parse free-text "what do you teach?" into grades and subjects.
 * Gracefully degrades — stores raw input if parsing fails.
 */
export function parseTeachesWhat(input: string): { grades: string[]; subjects: string[] } {
  const text = input.toLowerCase().trim();
  const grades: string[] = [];
  const subjects: string[] = [];

  // Grade patterns
  const gradePatterns: [RegExp, string][] = [
    [/\bpre-?k\b/, "PreK"],
    [/\bkindergarten\b|\bkinder\b|\b(?:^|\s)k(?:\s|$|-)\b/, "K"],
    [/\b(?:1st|2nd|first|second|1-2|grades?\s*1\s*(?:and|&|,)\s*2)\b/, "1-2"],
    [/\b(?:3rd|4th|5th|third|fourth|fifth|3-5|grades?\s*3\s*(?:and|&|,|through|-)\s*5)\b/, "3-5"],
    [/\b(?:6th|7th|8th|sixth|seventh|eighth|6-8|middle\s*school|grades?\s*6\s*(?:and|&|,|through|-)\s*8)\b/, "6-8"],
    [/\b(?:9th|10th|11th|12th|ninth|tenth|eleventh|twelfth|9-12|high\s*school|grades?\s*9\s*(?:and|&|,|through|-)\s*12)\b/, "9-12"],
    [/\bhigher\s*ed\b|\bcollege\b|\buniversity\b/, "Higher Ed"],
  ];

  for (const [pattern, grade] of gradePatterns) {
    if (pattern.test(text) && !grades.includes(grade)) {
      grades.push(grade);
    }
  }

  // Subject patterns
  const subjectPatterns: [RegExp, string][] = [
    [/\bmath(?:ematics|s)?\b/, "Math"],
    [/\benglish\b|\bela\b|\blanguage\s*arts\b|\breading\b|\bliteracy\b/, "English/ELA"],
    [/\bscience\b/, "Science"],
    [/\bchemistry\b/, "Chemistry"],
    [/\bphysics\b/, "Physics"],
    [/\bbiology\b/, "Biology"],
    [/\bhistory\b|\bsocial\s*studies\b/, "Social Studies"],
    [/\bgeography\b/, "Geography"],
    [/\bart\b|\barts\b|\bvisual\s*arts?\b/, "Art"],
    [/\bmusic\b/, "Music"],
    [/\bpe\b|\bphysical\s*education\b/, "PE"],
    [/\bcomputer\s*science\b|\bcs\b|\bcoding\b/, "Computer Science"],
    [/\bworld\s*languages?\b|\bspanish\b|\bfrench\b|\bgerman\b|\bchinese\b|\bjapanese\b/, "World Languages"],
    [/\bspecial\s*ed\b|\bsped\b/, "Special Education"],
  ];

  for (const [pattern, subject] of subjectPatterns) {
    if (pattern.test(text) && !subjects.includes(subject)) {
      subjects.push(subject);
    }
  }

  // If no subjects matched, use the raw input as-is
  if (subjects.length === 0 && input.trim()) {
    subjects.push(input.trim());
  }

  return { grades, subjects };
}

/**
 * Resolve profile fields with backward compatibility.
 * New profiles have teachesWhat + painPoint.
 * Old profiles have gradeLevels + subjects + biggestTimeDrains.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveProfile(profile: Record<string, any>): {
  teachesWhat: string;
  grades: string[];
  subjects: string[];
  aiExperience: string;
  painPoint: string;
  painPointLabel: string;
} {
  // New-style profile
  if (profile.teachesWhat) {
    const parsed = parseTeachesWhat(profile.teachesWhat);
    return {
      teachesWhat: profile.teachesWhat,
      grades: parsed.grades.length > 0 ? parsed.grades : profile.gradeLevels || [],
      subjects: parsed.subjects.length > 0 ? parsed.subjects : profile.subjects || [],
      aiExperience: profile.aiExperienceLevel || "new",
      painPoint: profile.painPoint || "lesson_planning",
      painPointLabel: painPointToLabel(profile.painPoint || "lesson_planning"),
    };
  }

  // Legacy profile fallback
  const legacyPainPoint = profile.biggestTimeDrains?.[0] || "";
  const painPointMap: Record<string, string> = {
    "Lesson planning": "lesson_planning",
    "Differentiation": "differentiation",
    "Feedback": "feedback",
    "IEP/admin paperwork": "admin",
  };

  const mappedPainPoint = painPointMap[legacyPainPoint] || "lesson_planning";

  return {
    teachesWhat: [
      ...(profile.gradeLevels || []),
      ...(profile.subjects || []),
    ].join(", ") || "their students",
    grades: profile.gradeLevels || [],
    subjects: profile.subjects || [],
    aiExperience: profile.aiExperienceLevel || "new",
    painPoint: mappedPainPoint,
    painPointLabel: painPointToLabel(mappedPainPoint),
  };
}

const AI_EXP_MAP: Record<string, string> = {
  new: "New to AI tools",
  some: "Some AI experience",
  advanced: "Regular AI user",
};

/**
 * Build a concise system context string from the user's profile.
 * Works with both new and legacy profiles.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildProfileContext(profile: Record<string, any>): string {
  const r = resolveProfile(profile);

  const parts: string[] = [];
  parts.push(`Teaches: ${r.teachesWhat || [r.grades.join(", "), r.subjects.join(", ")].filter(Boolean).join(" — ")}`);
  parts.push(`AI Experience: ${AI_EXP_MAP[r.aiExperience] || r.aiExperience}`);
  parts.push(`Main challenge: ${r.painPointLabel}`);

  return parts.join("\n");
}

/**
 * Fetch profile and return context string, or null if no profile exists
 */
export async function getProfileContextForUser(userId: string): Promise<string | null> {
  const [profile, user] = await Promise.all([
    getUserProfile(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  if (!profile) return null;
  const context = buildProfileContext(profile);
  const name = user?.name || "Unknown";
  return `Name: ${name}\n${context}`;
}
