/**
 * Artifact Extraction and Retrieval
 *
 * Teachers build concrete artifacts during conversations — prompt templates,
 * lesson outlines, feedback workflows, etc. This module handles:
 * - Extraction from ACTUAL conversation history (not classifier summaries)
 * - Persistent storage with generated metadata
 * - Retrieval for the artifact gallery
 */

import { prisma } from "./prisma";
import Anthropic from "@anthropic-ai/sdk";
import { getProgression } from "./progressions";

const anthropic = new Anthropic();

export interface Artifact {
  id: string;
  userId: string;
  weekNumber: number;
  weekTopic: string;
  title: string;
  type: string;
  content: string;
  description: string | null;
  tags: string[];
  createdAt: Date;
}

/**
 * Extract and save artifact from the ACTUAL conversation history.
 *
 * CRITICAL: We fetch the real messages and extract the artifact from them.
 * We do NOT trust the classifier's artifact.currentState, which is assembled
 * from limited context (one exchange + session summary) and often hallucinated.
 */
export async function extractArtifact(
  userId: string,
  weekNumber: number,
  artifactType: string,
  classifierArtifact: string, // Classifier's guess — used as fallback only
  sessionSummary: string
): Promise<Artifact> {
  console.log("=== ARTIFACT EXTRACTION STARTED ===");
  console.log("Type:", artifactType);

  // Prevent duplicate saves
  const existing = await prisma.artifact.findFirst({
    where: { userId, weekNumber },
    select: { id: true },
  });
  if (existing) {
    console.log("=== ARTIFACT ALREADY EXISTS, SKIPPING ===", existing.id);
    return existing as unknown as Artifact;
  }

  const progression = getProgression(weekNumber);
  const weekTopic = progression?.topic || `Week ${weekNumber}`;

  // Fetch the ACTUAL conversation history
  const messages = await prisma.skippyMessage.findMany({
    where: { userId, week: weekNumber },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  console.log("Conversation messages found:", messages.length);

  // Extract the real artifact from conversation history
  let artifactContent: string;

  if (messages.length > 0) {
    artifactContent = await extractArtifactFromConversation(messages, artifactType, weekTopic);
    console.log("Extracted from conversation, length:", artifactContent.length);
  } else {
    // Fallback to classifier's version if no messages found
    artifactContent = classifierArtifact;
    console.log("FALLBACK: Using classifier artifact, length:", artifactContent.length);
  }

  // Generate title and description using Claude
  const { title, description, tags } = await generateArtifactMetadata(
    artifactType,
    artifactContent,
    sessionSummary,
    weekTopic
  );

  const artifact = await prisma.artifact.create({
    data: {
      userId,
      weekNumber,
      weekTopic,
      title,
      type: artifactType,
      content: artifactContent,
      description,
      tags,
    },
  });

  console.log("=== ARTIFACT SAVED ===");
  console.log("ID:", artifact.id);
  console.log("Title:", title);
  console.log("Content preview:", artifactContent.slice(0, 200));

  return artifact as Artifact;
}

/**
 * Extract the artifact from the actual conversation messages.
 *
 * Strategy:
 * 1. Look for the LAST assistant message that contains a structured artifact
 *    (CONTEXT/CONSTRAINTS/COMMAND/CRITERIA sections, or similar structure)
 * 2. If found, extract it directly — no LLM needed
 * 3. If no structured artifact found, use Claude to identify and extract
 *    the artifact from the full conversation
 */
async function extractArtifactFromConversation(
  messages: { role: string; content: string }[],
  artifactType: string,
  weekTopic: string
): Promise<string> {
  // Strategy 1: Find structured artifact in assistant messages (most reliable)
  // Search from the END of conversation backwards — the last presentation is most refined
  const assistantMessages = messages
    .filter(m => m.role === "assistant")
    .reverse();

  for (const msg of assistantMessages) {
    const extracted = tryExtractStructuredArtifact(msg.content);
    if (extracted) {
      console.log("[ARTIFACT] Found structured artifact in assistant message");
      return extracted;
    }
  }

  // Strategy 2: Use Claude to extract from full conversation
  console.log("[ARTIFACT] No structured artifact found, using Claude extraction");
  return await llmExtractFromConversation(messages, artifactType, weekTopic);
}

/**
 * Try to extract a structured 4C artifact from a message.
 * Returns the artifact text if found, null otherwise.
 */
function tryExtractStructuredArtifact(text: string): string | null {
  // Look for messages containing CONTEXT + COMMAND (minimum for a prompt template)
  const hasContext = /\b(?:CONTEXT|Context)\s*:/i.test(text);
  const hasCommand = /\b(?:COMMAND|Command)\s*:/i.test(text);

  if (!hasContext || !hasCommand) return null;

  // Extract the artifact portion — look for the structured block
  // It may be preceded by conversational text like "Here's your prompt template:"
  const lines = text.split('\n');
  let artifactStart = -1;
  let artifactEnd = lines.length;

  // Find where the structured content starts
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*\**(?:CONTEXT|Context)\s*:\**\s*/i.test(lines[i])) {
      artifactStart = i;
      break;
    }
  }

  if (artifactStart === -1) return null;

  // Find where the artifact ends — look for conversational text after the structure
  // The artifact ends when we hit a line that's clearly conversational
  // (starts with "You can", "Try", "When", "Next", etc.) after all 4C sections
  let foundCriteria = false;
  for (let i = artifactStart; i < lines.length; i++) {
    if (/\b(?:CRITERIA|Criteria)\s*:/i.test(lines[i])) {
      foundCriteria = true;
    }
    if (foundCriteria && i > artifactStart + 2) {
      // After CRITERIA, look for the end of the artifact content
      const line = lines[i].trim();
      if (line === '') continue; // Skip blank lines
      // If this line looks like post-artifact conversation, stop here
      if (/^(?:You can|Try |When |Next |This is|I'd |Let me|How|What|Nice|Great|Good|---)/i.test(line) &&
          !/^\s*\**(?:CONTEXT|CONSTRAINTS|COMMAND|CRITERIA)\s*:/i.test(line)) {
        artifactEnd = i;
        break;
      }
    }
  }

  const artifactLines = lines.slice(artifactStart, artifactEnd);
  const artifact = artifactLines.join('\n').trim();

  // Validate: must have at least CONTEXT and COMMAND with actual content
  if (artifact.length < 50) return null;

  return artifact;
}

/**
 * Use Claude to extract the artifact from the full conversation.
 * This is the fallback when no structured artifact is found.
 */
async function llmExtractFromConversation(
  messages: { role: string; content: string }[],
  artifactType: string,
  weekTopic: string
): Promise<string> {
  // Format conversation for Claude
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  // Limit to last ~8000 chars to stay within Haiku's sweet spot
  const truncated = conversationText.length > 8000
    ? '...\n\n' + conversationText.slice(-8000)
    : conversationText;

  const prompt = `You are extracting the artifact that was built during a tutoring conversation.

## Conversation
${truncated}

## Task
Find the EXACT artifact (${artifactType}) that was collaboratively built in this conversation. This is typically a prompt template with CONTEXT, CONSTRAINTS, COMMAND, and CRITERIA sections.

CRITICAL RULES:
1. Extract the artifact EXACTLY as it appeared in the conversation — do NOT rewrite, improve, or change it
2. If multiple versions exist, use the LAST/MOST REFINED version
3. If the assistant presented it in a formatted block, extract that exact block
4. Include all sections that were part of the artifact
5. Do NOT add sections that weren't discussed
6. Do NOT change the teacher's wording

Output ONLY the artifact text. No preamble, no explanation, no JSON wrapping.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    if (text.length > 30) {
      return text.trim();
    }
  } catch (e) {
    console.error("[ARTIFACT] LLM extraction failed:", e);
  }

  // Last resort fallback
  return `[Artifact extraction failed — please copy from your conversation]`;
}

/**
 * Generate metadata for the artifact using Claude.
 */
async function generateArtifactMetadata(
  type: string,
  content: string,
  sessionSummary: string,
  weekTopic: string
): Promise<{ title: string; description: string | null; tags: string[] }> {
  const prompt = `You are helping organize a teacher's AI-generated artifacts.

Given this artifact created during a "${weekTopic}" session:

TYPE: ${type}
CONTENT:
${content}

SESSION CONTEXT:
${sessionSummary}

Generate:
1. A concise, descriptive title (3-7 words) that a teacher would recognize later
2. A one-sentence description of what this artifact does
3. 2-4 tags for categorization (e.g., "math", "differentiation", "5th-grade", "feedback")

Respond in JSON format:
{
  "title": "...",
  "description": "...",
  "tags": ["...", "..."]
}

Respond ONLY with the JSON. No preamble.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title: parsed.title || `${formatType(type)} from ${weekTopic}`,
      description: parsed.description || null,
      tags: parsed.tags || [],
    };
  } catch (e) {
    console.error("Artifact metadata generation failed:", e);
    // Fallback if parsing fails
    return {
      title: `${formatType(type)} - ${weekTopic}`,
      description: null,
      tags: [],
    };
  }
}

function formatType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Retrieve all artifacts for a user, optionally filtered by week.
 */
export async function getUserArtifacts(
  userId: string,
  weekNumber?: number
): Promise<Artifact[]> {
  return prisma.artifact.findMany({
    where: {
      userId,
      ...(weekNumber !== undefined ? { weekNumber } : {}),
    },
    orderBy: { createdAt: "desc" },
  }) as Promise<Artifact[]>;
}

/**
 * Retrieve a single artifact (with ownership check).
 */
export async function getArtifact(
  artifactId: string,
  userId: string
): Promise<Artifact | null> {
  return prisma.artifact.findFirst({
    where: {
      id: artifactId,
      userId, // Ensure user owns this artifact
    },
  }) as Promise<Artifact | null>;
}

/**
 * Delete an artifact (with ownership check).
 */
export async function deleteArtifact(
  artifactId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.artifact.deleteMany({
    where: {
      id: artifactId,
      userId,
    },
  });
  return result.count > 0;
}
