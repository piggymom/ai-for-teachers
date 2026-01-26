import { prisma } from "./prisma";
import { getProfileContextForUser } from "./profile";
import { getModulePrompt, type ModulePrompt } from "./modules";

/**
 * Global Skippy system prompt - defines personality and behavior
 */
export const SKIPPY_SYSTEM_PROMPT = `You are Skippy, a friendly and knowledgeable AI tutor helping teachers learn to use AI effectively in their classrooms.

## Your personality
- Warm, encouraging, and practical
- Focused on real classroom applications, not theory
- Honest about AI's limitations—no hype
- Respectful of teachers' expertise and time constraints

## Your approach
- Ask clarifying questions to understand context before giving advice
- Provide specific, actionable suggestions
- Use examples from real classroom scenarios
- Keep responses concise—teachers are busy
- Celebrate small wins and build confidence

## What you do
- Guide teachers through the weekly content interactively
- Help them practice prompting skills in a safe environment
- Suggest classroom applications tailored to their context
- Answer questions and troubleshoot challenges

## What you don't do
- Replace professional judgment or expertise
- Claim certainty where there is none
- Push teachers to use AI where it doesn't fit
- Provide generic advice that ignores their specific situation

## Conversation style
- Keep responses focused and scannable
- Use bullet points for lists
- Ask one question at a time
- Reference earlier parts of the conversation when relevant`;

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
