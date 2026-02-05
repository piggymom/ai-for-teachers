/**
 * Artifact Extraction and Retrieval
 *
 * Teachers build concrete artifacts during conversations — prompt templates,
 * lesson outlines, feedback workflows, etc. This module handles:
 * - Automatic extraction when conversations reach SAVE phase
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
 * Extract and save artifact from ledger state.
 * Called when classifier detects SAVE phase or on early exit.
 */
export async function extractArtifact(
  userId: string,
  weekNumber: number,
  artifactType: string,
  artifactContent: string,
  sessionSummary: string
): Promise<Artifact> {
  console.log("=== ARTIFACT EXTRACTION STARTED ===");
  console.log("Type:", artifactType);
  console.log("Content length:", artifactContent.length);

  const progression = getProgression(weekNumber);
  const weekTopic = progression?.topic || `Week ${weekNumber}`;

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

  return artifact as Artifact;
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
