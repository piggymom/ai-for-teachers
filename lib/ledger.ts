/**
 * Conversation Ledger System
 *
 * Provides Skippy with explicit awareness of where each tutoring session stands.
 * The ledger tracks: conversation phase, teacher's diagnosed readiness level,
 * session summary, artifact-in-progress, and engagement signals.
 *
 * The classifier runs AFTER the response is sent (async), so there's zero
 * added latency for the teacher.
 */

import { prisma } from "./prisma";
import Anthropic from "@anthropic-ai/sdk";
import { formatProgressionForClassifier } from "./progressions";

const anthropic = new Anthropic();

// =============================================================================
// TYPES
// =============================================================================

export type ConversationPhase =
  | "DISCOVER"
  | "BUILD"
  | "REFINE"
  | "REFLECT"
  | "SAVE"
  | "BRIDGE";

export type EngagementEnergy = "high" | "medium" | "low";

export type ArtifactType =
  | "prompt_template"
  | "workflow"
  | "draft_feedback"
  | "lesson_outline"
  | "email_template"
  | "communication_template"
  | "reflection"
  | "other"
  | null;

export interface DiagnosticData {
  hasBeenAssessed: boolean;
  level: string | null;
  evidence: string | null;
  readyFor: string | null;
  misconceptions: string[];
}

export interface ArtifactData {
  inProgress: boolean;
  type: ArtifactType;
  currentState: string | null;
  iterationCount: number;
}

export interface EngagementData {
  energy: EngagementEnergy;
  notes: string | null;
}

export interface ConversationLedger {
  id: string;
  userId: string;
  weekNumber: number;
  currentPhase: ConversationPhase;
  phaseHistory: string[];
  exchangeCount: number;
  diagnostic: DiagnosticData;
  sessionSummary: string;
  artifact: ArtifactData;
  remainingPhases: string[];
  engagement: EngagementData;
  guidance: string | null;
}

// =============================================================================
// CRUD OPERATIONS
// =============================================================================

/**
 * Fetch existing ledger or create a new one for the user's week.
 */
export async function getOrCreateLedger(
  userId: string,
  weekNumber: number
): Promise<ConversationLedger> {
  const existing = await prisma.conversationLedger.findUnique({
    where: {
      userId_weekNumber: { userId, weekNumber },
    },
  });

  if (existing) {
    return transformFromDb(existing);
  }

  // Create new ledger with defaults
  const created = await prisma.conversationLedger.create({
    data: {
      userId,
      weekNumber,
      currentPhase: "DISCOVER",
      phaseHistory: ["DISCOVER"],
      exchangeCount: 0,
      diagnosticAssessed: false,
      sessionSummary: "",
      artifactInProgress: false,
      artifactIterations: 0,
      engagementEnergy: "medium",
    },
  });

  return transformFromDb(created);
}

/**
 * Reset a ledger for a week (when user wants to start over).
 */
export async function resetLedger(
  userId: string,
  weekNumber: number
): Promise<ConversationLedger> {
  // Delete existing if present
  await prisma.conversationLedger
    .delete({
      where: {
        userId_weekNumber: { userId, weekNumber },
      },
    })
    .catch(() => {
      // Ignore if doesn't exist
    });

  // Create fresh
  const created = await prisma.conversationLedger.create({
    data: {
      userId,
      weekNumber,
      currentPhase: "DISCOVER",
      phaseHistory: ["DISCOVER"],
      exchangeCount: 0,
      diagnosticAssessed: false,
      sessionSummary: "",
      artifactInProgress: false,
      artifactIterations: 0,
      engagementEnergy: "medium",
    },
  });

  return transformFromDb(created);
}

// =============================================================================
// TRANSFORM
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFromDb(record: any): ConversationLedger {
  const allPhases: ConversationPhase[] = [
    "DISCOVER",
    "BUILD",
    "REFINE",
    "REFLECT",
    "SAVE",
    "BRIDGE",
  ];
  const completedIndex = allPhases.indexOf(record.currentPhase);
  const remainingPhases = allPhases.slice(completedIndex + 1);

  return {
    id: record.id,
    userId: record.userId,
    weekNumber: record.weekNumber,
    currentPhase: record.currentPhase as ConversationPhase,
    phaseHistory: record.phaseHistory || ["DISCOVER"],
    exchangeCount: record.exchangeCount,
    diagnostic: {
      hasBeenAssessed: record.diagnosticAssessed,
      level: record.diagnosticLevel,
      evidence: record.diagnosticEvidence,
      readyFor: record.diagnosticReadyFor,
      misconceptions: record.diagnosticMisconceptions || [],
    },
    sessionSummary: record.sessionSummary || "",
    artifact: {
      inProgress: record.artifactInProgress,
      type: record.artifactType as ArtifactType,
      currentState: record.artifactState,
      iterationCount: record.artifactIterations,
    },
    remainingPhases,
    engagement: {
      energy: record.engagementEnergy as EngagementEnergy,
      notes: record.engagementNotes,
    },
    guidance: record.guidance,
  };
}

// =============================================================================
// FORMAT FOR PROMPT INJECTION
// =============================================================================

/**
 * Format ledger for injection into Skippy's system prompt.
 */
export function formatLedgerForPrompt(ledger: ConversationLedger): string {
  const diagnosticSection = ledger.diagnostic.hasBeenAssessed
    ? `TEACHER READINESS:
- Level: ${ledger.diagnostic.level}
- Evidence: ${ledger.diagnostic.evidence}
- Ready for: ${ledger.diagnostic.readyFor}${
        ledger.diagnostic.misconceptions.length > 0
          ? `\n- Watch for: ${ledger.diagnostic.misconceptions.join(", ")}`
          : ""
      }`
    : `TEACHER READINESS:
- Not yet assessed. Use your diagnostic probe this turn to understand where they're starting from.`;

  const artifactSection = ledger.artifact.inProgress
    ? `ARTIFACT IN PROGRESS (${ledger.artifact.type}, iteration #${ledger.artifact.iterationCount}):
${ledger.artifact.currentState}`
    : "No artifact started yet.";

  return `=== SESSION STATE (Week ${ledger.weekNumber}) ===

CONVERSATION PROGRESS:
- Phase: ${ledger.currentPhase} (exchange #${ledger.exchangeCount})
- Completed: ${ledger.phaseHistory.join(" → ")}
- Remaining: ${ledger.remainingPhases.length > 0 ? ledger.remainingPhases.join(" → ") : "None"}

${diagnosticSection}

SESSION SUMMARY:
${ledger.sessionSummary || "Session just started."}

${artifactSection}

TEACHER ENGAGEMENT: ${ledger.engagement.energy}
${ledger.engagement.notes || "No observations yet."}

GUIDANCE FOR THIS TURN:
${ledger.guidance || "Begin with your diagnostic probe to understand where this teacher is starting from."}

===

Use this context to calibrate your response. Match your vocabulary and explanations to the teacher's demonstrated level. If they're at multistructural, don't over-explain basics they already grasp. If they're at pre-structural, don't assume framework knowledge.`;
}

// =============================================================================
// CLASSIFIER
// =============================================================================

interface ClassifierOutput {
  currentPhase: ConversationPhase;
  phaseHistory: string[];
  exchangeCount: number;
  diagnostic: {
    hasBeenAssessed: boolean;
    level: string | null;
    evidence: string | null;
    readyFor: string | null;
    misconceptions: string[];
  };
  sessionSummary: string;
  artifact: {
    inProgress: boolean;
    type: ArtifactType;
    currentState: string | null;
    iterationCount: number;
  };
  remainingPhases: string[];
  engagement: {
    energy: EngagementEnergy;
    notes: string | null;
  };
  guidance: string | null;
}

/**
 * Run classifier and update ledger (call this ASYNC after response is sent).
 * This adds zero latency to the user experience.
 */
export async function updateLedgerFromExchange(
  ledger: ConversationLedger,
  userMessage: string,
  assistantResponse: string
): Promise<ConversationLedger> {
  const progressionText = formatProgressionForClassifier(ledger.weekNumber);

  const classifierPrompt = buildClassifierPrompt(
    ledger,
    progressionText,
    userMessage,
    assistantResponse
  );

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: classifierPrompt }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    let parsed: ClassifierOutput;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("[LEDGER] Failed to parse classifier response:", responseText);
      // Return ledger with incremented exchange count
      return incrementExchangeCount(ledger);
    }

    // Update database
    const updated = await prisma.conversationLedger.update({
      where: { id: ledger.id },
      data: {
        currentPhase: parsed.currentPhase,
        phaseHistory: parsed.phaseHistory,
        exchangeCount: parsed.exchangeCount,
        diagnosticAssessed: parsed.diagnostic.hasBeenAssessed,
        diagnosticLevel: parsed.diagnostic.level,
        diagnosticEvidence: parsed.diagnostic.evidence,
        diagnosticReadyFor: parsed.diagnostic.readyFor,
        diagnosticMisconceptions: parsed.diagnostic.misconceptions || [],
        sessionSummary: parsed.sessionSummary,
        artifactInProgress: parsed.artifact.inProgress,
        artifactType: parsed.artifact.type,
        artifactState: parsed.artifact.currentState,
        artifactIterations: parsed.artifact.iterationCount,
        engagementEnergy: parsed.engagement.energy,
        engagementNotes: parsed.engagement.notes,
        guidance: parsed.guidance,
      },
    });

    console.log(
      `[LEDGER] Updated: phase=${parsed.currentPhase}, exchange=${parsed.exchangeCount}, level=${parsed.diagnostic.level}`
    );

    return transformFromDb(updated);
  } catch (error) {
    console.error("[LEDGER] Classifier error:", error);
    // Graceful degradation: increment exchange count only
    return incrementExchangeCount(ledger);
  }
}

/**
 * Fallback: just increment exchange count if classifier fails.
 */
async function incrementExchangeCount(
  ledger: ConversationLedger
): Promise<ConversationLedger> {
  const updated = await prisma.conversationLedger.update({
    where: { id: ledger.id },
    data: {
      exchangeCount: ledger.exchangeCount + 1,
    },
  });
  return transformFromDb(updated);
}

// =============================================================================
// CLASSIFIER PROMPT
// =============================================================================

function buildClassifierPrompt(
  ledger: ConversationLedger,
  progressionText: string,
  userMessage: string,
  assistantResponse: string
): string {
  return `You are a conversation analyst for Skippy, an AI tutor helping K-12 teachers learn to use AI tools. Your job is to read each conversation exchange and update a structured ledger that helps Skippy track progress through the session.

## The Pedagogical Framework

Skippy uses "One Win, Then Wrap" — a conversation arc with six phases:

1. DISCOVER — Understand the teacher's challenge, goal, and current understanding. Includes a diagnostic probe to identify readiness level.
2. BUILD — Collaborate on ONE concrete artifact (prompt template, workflow, draft, etc.)
3. REFINE — Iterate on the artifact for the teacher's specific context
4. REFLECT — Teacher articulates what they learned about working with AI (metacognition)
5. SAVE — Present the finalized artifact for future reuse
6. BRIDGE — Connect to next week's topic or broader practice

Transitions are fluid, not rigid. Teachers may loop back (e.g., REFINE → BUILD if they want to try a different approach). Your job is to track where the conversation IS, not enforce where it should be.

## Readiness Levels for Week ${ledger.weekNumber}

${progressionText}

## Your Task

Given the current ledger state and the latest exchange, produce an updated ledger.

### Input

Current ledger:
${JSON.stringify(ledger, null, 2)}

Latest user message:
${userMessage}

Latest assistant (Skippy) response:
${assistantResponse}

### Output

Return a JSON object with these fields:

{
  "currentPhase": "DISCOVER|BUILD|REFINE|REFLECT|SAVE|BRIDGE",
  "phaseHistory": ["DISCOVER", "BUILD", ...],
  "exchangeCount": <integer>,

  "diagnostic": {
    "hasBeenAssessed": true|false,
    "level": "pre-structural|unistructural|multistructural|relational|extended-abstract",
    "evidence": "<1-2 sentences: what the teacher said/did that reveals this level>",
    "readyFor": "<1 sentence: what concept or skill is in their ZPD>",
    "misconceptions": ["<specific misconception if any>"]
  },

  "sessionSummary": "<2-4 sentences: what has happened so far, written as a briefing for Skippy>",

  "artifact": {
    "inProgress": true|false,
    "type": "prompt_template|workflow|draft_feedback|lesson_outline|email_template|communication_template|reflection|other|null",
    "currentState": "<the artifact as it currently exists, or null>",
    "iterationCount": <integer>
  },

  "remainingPhases": ["REFLECT", "SAVE", "BRIDGE"],

  "engagement": {
    "energy": "high|medium|low",
    "notes": "<brief observation about teacher's engagement, questions, or emotional state>"
  },

  "guidance": "<1-2 sentences: tactical suggestion for Skippy's next move based on phase and progress>"
}

### Classification Rules

**Phase transitions:**
- → DISCOVER: Session start, OR teacher raises a fundamentally new goal mid-session
- → BUILD: Teacher and Skippy have agreed on what to create; first draft attempt begins
- → REFINE: A draft artifact exists and they're iterating on specifics
- → REFLECT: Conversation shifts to metacognition — teacher articulates what they learned about AI (not just the content)
- → SAVE: Artifact is finalized and Skippy presents it as a reusable resource
- → BRIDGE: Connection made to future application, next week, or broader practice

**Diagnostic classification:**
- Assess the teacher's level based on what they DEMONSTRATE in conversation, not what you wish they knew
- Look for the highest level they consistently show, not their peak moment
- If no clear diagnostic evidence yet, set hasBeenAssessed to false
- Misconceptions are only beliefs that will interfere with learning — don't list gaps as misconceptions

**Artifact tracking:**
- An artifact is "in progress" once Skippy and the teacher have started creating something concrete
- Capture the artifact's current state as accurately as possible — this will be used for retrieval later
- Increment iterationCount each time the artifact is meaningfully revised

**Guidance generation:**
- If in DISCOVER/BUILD with >8 exchanges, suggest beginning transition toward REFINE/REFLECT
- If in REFINE with >10 exchanges, suggest moving toward REFLECT
- If teacher seems stuck or frustrated, suggest Skippy offer a different approach
- If teacher is highly engaged and productive, suggest letting them run
- If diagnostic reveals misconception that will block BUILD, suggest brief reframe first

Respond ONLY with the JSON object. No preamble, no explanation.`;
}
