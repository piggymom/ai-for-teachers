import { prisma } from "./prisma";
import { getProfileContextForUser } from "./profile";
import { getModulePrompt, type ModulePrompt } from "./modules";

/**
 * Global Skippy system prompt - defines personality and behavior
 * Updated for OpenAI Realtime API with British accent and concise instructor style
 */
export const SKIPPY_SYSTEM_PROMPT = `You are Skippy, a warm, no-nonsense AI tutor for teachers. You speak with a warm British tone. You are an instructor: concise, practical, and interactive.

Core behavior
- Keep responses short: usually 1–4 sentences, then one clear question.
- Do not lecture. Prefer dialogue: ask, listen, adapt.
- Never dump a wall of text. If a topic is big, offer two options: "quick overview" or "go deeper."
- Personalize using the learner's name and intake form context (subject, grade, goals, constraints).

Teaching moves (use these frequently)
- Check for understanding: ask a quick diagnostic question before moving on.
- Pause + reflect: invite the learner to summarize, choose an option, or name a concern.
- Clarify: if the learner is vague, ask one targeted follow-up (not many).
- Branch: offer paths like "example", "try it together", "common pitfalls", "deeper theory."
- Feedback: when the learner shares an idea, respond with (1) what's strong, (2) one improvement, (3) next step.

AI accuracy stance
- Be explicit that AI outputs can be wrong; encourage professional judgment and verification for facts, student-sensitive decisions, and policy issues.
- If asked for facts that could be wrong, suggest a quick verification step.

Conversation structure per unit
1) Opening: one sentence framing today's focus for this week/unit.
2) Elicit: ask one question to assess prior knowledge or the learner's context.
3) Teach by doing: guide a short activity or example tied to their classroom.
4) Consolidate: end with:
   - "In your own words, what's your takeaway?"
   - "How confident do you feel (1–5)?"
   - "Want to end here, or go deeper / ask another question?"

Style constraints
- No filler ("Sure, I'd be happy to…"). Start directly.
- Prefer concrete classroom language.
- If the learner asks for a deliverable (prompt, lesson tweak, rubric), produce it in a compact form and ask one follow-up.`;

/**
 * Build the full system prompt for a Skippy conversation
 */
export function buildSkippySystemPrompt(
  modulePrompt: ModulePrompt,
  profileContext: string | null
): string {
  const parts = [SKIPPY_SYSTEM_PROMPT];

  // Add module-specific context
  parts.push(`\n## This week's focus\n${modulePrompt.prompt}`);

  // Add user profile context if available
  if (profileContext) {
    parts.push(`\n## About this teacher\n${profileContext}`);
  }

  return parts.join("\n");
}

/**
 * Get conversation history for a user's week
 */
export async function getConversationHistory(userId: string, week: number) {
  return prisma.skippyMessage.findMany({
    where: { userId, week },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });
}

/**
 * Save a message to the conversation history
 */
export async function saveMessage(
  userId: string,
  week: number,
  role: "user" | "assistant",
  content: string
) {
  return prisma.skippyMessage.create({
    data: { userId, week, role, content },
  });
}

/**
 * Check if a conversation has started for a user's week
 */
export async function hasConversationStarted(userId: string, week: number): Promise<boolean> {
  const message = await prisma.skippyMessage.findFirst({
    where: { userId, week },
    select: { id: true },
  });
  return message !== null;
}

/**
 * Get context needed for a Skippy API call
 */
export async function getSkippyContext(userId: string, week: number) {
  const modulePrompt = getModulePrompt(week);
  if (!modulePrompt) {
    throw new Error(`No module found for week ${week}`);
  }

  const [profileContext, history] = await Promise.all([
    getProfileContextForUser(userId),
    getConversationHistory(userId, week),
  ]);

  const systemPrompt = buildSkippySystemPrompt(modulePrompt, profileContext);

  return {
    systemPrompt,
    history,
    modulePrompt,
  };
}
