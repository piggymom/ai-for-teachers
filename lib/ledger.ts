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
import { extractArtifact } from "./artifacts";

const anthropic = new Anthropic();

// =============================================================================
// DEBUG LOGGING
// =============================================================================

const DEBUG_LEDGER = process.env.DEBUG_LEDGER === 'true' || process.env.NODE_ENV === 'development';

function logLedger(step: string, data: Record<string, unknown>) {
  if (DEBUG_LEDGER) {
    console.log(`[LEDGER:${step}]`, JSON.stringify(data, null, 2));
  }
}

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
  logLedger('FETCH_START', { userId: userId.slice(-8), weekNumber });

  const existing = await prisma.conversationLedger.findUnique({
    where: {
      userId_weekNumber: { userId, weekNumber },
    },
  });

  if (existing) {
    const ledger = transformFromDb(existing);
    logLedger('FETCH_FOUND', {
      ledgerId: ledger.id.slice(-8),
      currentPhase: ledger.currentPhase,
      diagnosticLevel: ledger.diagnostic.level,
      exchangeCount: ledger.exchangeCount
    });
    return ledger;
  }

  logLedger('CREATE_START', { userId: userId.slice(-8), weekNumber });

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

  logLedger('CREATE_SUCCESS', { ledgerId: created.id.slice(-8), weekNumber });
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
 * Now includes level-specific behavioral guidance and phase-specific moves.
 */
export function formatLedgerForPrompt(ledger: ConversationLedger): string {
  const levelBehaviors = getLevelBehaviors(ledger.diagnostic.level);
  const phaseGuidance = getPhaseGuidance(ledger.currentPhase, ledger.exchangeCount);

  const misconceptionsSection = ledger.diagnostic.misconceptions?.length
    ? `
## Watch For These Misconceptions
${ledger.diagnostic.misconceptions.map(m => `- ${m}`).join('\n')}
If you notice these beliefs surfacing, gently reframe without derailing the conversation.
`
    : '';

  const artifactSection = ledger.artifact.inProgress && ledger.artifact.currentState
    ? `
## Artifact in Progress (${ledger.artifact.type}, iteration #${ledger.artifact.iterationCount})
${ledger.artifact.currentState}
`
    : '';

  return `
<conversation_state>
## Where They Are
- Phase: ${ledger.currentPhase}
- Exchange count: ${ledger.exchangeCount}
- Diagnosed level: ${ledger.diagnostic.level || 'not yet assessed'}

## What You Know About This Teacher
${ledger.sessionSummary || 'Session just started.'}

${ledger.diagnostic.hasBeenAssessed && ledger.diagnostic.level ? `
## How to Engage at ${ledger.diagnostic.level.toUpperCase()} Level
${levelBehaviors}
` : `
## Diagnostic Needed
This teacher hasn't been assessed yet. Use the diagnostic probe naturally in conversation to understand their current mental model. Don't rush to teach — listen first.
`}

## Current Phase: ${ledger.currentPhase}
${phaseGuidance}
${misconceptionsSection}${artifactSection}
## Specific Guidance for This Turn
${ledger.guidance || "Deploy your diagnostic probe to understand where this teacher is starting from."}
</conversation_state>
`;
}

/**
 * Get level-specific behavioral guidance for Skippy.
 */
function getLevelBehaviors(level: string | null): string {
  if (!level) return '';

  const behaviors: Record<string, string> = {
    'pre-structural': `
**Teaching Mode: Foundation Building**
- Use concrete analogies and examples from their classroom context
- Explain concepts step by step — don't assume prior knowledge
- Celebrate small wins to build confidence
- Keep the artifact simple and highly scaffolded
- Ask questions that help them discover insights rather than lecturing

**Tone:** Warm, encouraging, patient. "Let's explore this together."

**Good moves:**
- "Think of it like..." (concrete analogy)
- "Let's start with just one thing..."
- "That's exactly the right question to ask."

**Avoid:** Jargon, abstract frameworks, overwhelming options, moving too fast.
`,

    'unistructural': `
**Teaching Mode: Expanding Understanding**
- Build on what they already know — acknowledge their starting point
- Introduce ONE new concept at a time
- Use "Yes, and..." framing — validate then extend
- Scaffold the artifact with clear structure
- Check for understanding before moving on

**Tone:** Supportive, guiding. "You've got the foundation — let's build on it."

**Good moves:**
- "You're right that [X]. Here's another layer..."
- "Building on that idea..."
- "What if we added [one thing]?"

**Avoid:** Dumbing down (they know something), but also overwhelming with complexity.
`,

    'multistructural': `
**Teaching Mode: Connecting the Dots**
- They know the components — help them see relationships
- Ask "why does that matter?" and "how does this connect to...?"
- Introduce nuance: when does this apply vs. not apply?
- Give them choices in how to structure the artifact
- Push them to explain their reasoning

**Tone:** Collaborative, curious. "You know the pieces — let's see how they fit together."

**Good moves:**
- "How do you see [X] and [Y] connecting?"
- "When would you use this approach vs. that one?"
- "What's driving that choice?"

**Avoid:** Repeating what they already know, over-scaffolding, treating them as beginners.
`,

    'relational': `
**Teaching Mode: Peer Dialogue**
- They understand the system — engage as a thought partner
- Challenge their thinking with edge cases and exceptions
- Ask for their instincts before offering your perspective
- Let them drive artifact design with minimal scaffolding
- Discuss trade-offs and contextual judgment

**Tone:** Collegial, intellectually curious. "What's your take on...?"

**Good moves:**
- "What's your instinct here?"
- "What would you try first?"
- "What tradeoffs do you see?"
- "I'm curious — how do you think about [X]?"

**Never say:**
- "Let me explain how this works..."
- "The first step is..."
- "Here's what you should do..."

They're a peer, not a student.
`,

    'extended-abstract': `
**Teaching Mode: Generative Dialogue**
- They could teach this — learn from them too
- Explore novel applications and creative extensions
- Discuss how they might teach this to colleagues
- Focus on edge cases, limitations, and future evolution
- Co-create rather than instruct

**Tone:** Mutual exploration. "I'm curious what you think about..."

**Good moves:**
- "How would you explain this to a colleague?"
- "What edge cases have you encountered?"
- "Where do you see this breaking down?"
- "What would you add to this framework?"

**Avoid:** Any form of condescension, basic explanations, unnecessary scaffolding.
`
  };

  return behaviors[level] || behaviors['pre-structural'];
}

/**
 * Get phase-specific guidance with concrete moves.
 */
function getPhaseGuidance(phase: string, exchangeCount: number): string {
  const guidance: Record<string, string> = {
    'DISCOVER': `
**Goal:** Understand where this teacher is starting from.
${exchangeCount < 2
  ? "Deploy the diagnostic probe naturally — ask a question that reveals their mental model without feeling like a test."
  : "You should have enough to assess their level. When ready, transition toward building something practical."
}

**Good transition to BUILD:** "Based on what you've shared, let's create something you can actually use. How about we..."
`,

    'BUILD': `
**Goal:** Create something useful together.
- Keep them engaged by connecting to their specific context
- Build incrementally — don't dump a complete artifact on them
- Ask for their input at each step
${exchangeCount > 6
  ? "You've been building for a while. Look for a natural moment to move toward refinement."
  : ""
}

**Good transition to REFINE:** "Here's what we've got so far. What would you tweak for your specific students?"
`,

    'REFINE': `
**Goal:** Make the artifact actually useful for their context.
- Ask "what would you change for your specific students/situation?"
- Test edge cases: "what if a student did X?"
- Polish language and specificity
- Keep this focused — don't rebuild from scratch

**Good transition to REFLECT:** "This is looking solid. Before we wrap it up — what did you notice about how you had to think about this?"
`,

    'REFLECT': `
**Goal:** Consolidate learning through metacognition.
- Ask them to explain WHY the artifact works, not just THAT it works
- Push for transfer: "how would you adapt this for a different context?"
- Connect to their original goals

**Red flags that need follow-up:**
- "Looks good" / "That works" / "I like it" → Push: "What specifically makes it work? What would break if we removed [X]?"
- No explanation of WHY → Ask: "Walk me through your reasoning — why did you structure it that way?"
- No transfer thinking → Ask: "How would you adapt this for a different class/subject/situation?"

**Don't move to SAVE until:**
- Teacher has articulated WHY the artifact works (not just THAT it works)
- Teacher has considered at least one variation or transfer scenario
`,

    'SAVE': `
**Goal:** Capture and present the artifact clearly.
- Present the final artifact in a clean, copyable format
- Summarize what they built and why it works
- Offer to save and transition to wrap-up

**Good transition to BRIDGE:** "Here's your [artifact] to keep. When do you think you'll try this out?"
`,

    'BRIDGE': `
**Goal:** Connect to future application.
- Ask when/how they'll use this
- Preview what's coming next in the course
- End on an encouraging note

**Good closing:** "Nice work today. When you try this out, I'd love to hear how it goes. See you next time!"
`
  };

  return guidance[phase] || guidance['DISCOVER'];
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
  logLedger('CLASSIFY_START', {
    ledgerId: ledger.id.slice(-8),
    currentPhase: ledger.currentPhase,
    exchangeCount: ledger.exchangeCount,
    userMessagePreview: userMessage.slice(0, 100) + (userMessage.length > 100 ? '...' : ''),
    assistantPreview: assistantResponse.slice(0, 100) + (assistantResponse.length > 100 ? '...' : '')
  });

  const progressionText = formatProgressionForClassifier(ledger.weekNumber);

  const classifierPrompt = buildClassifierPrompt(
    ledger,
    progressionText,
    userMessage,
    assistantResponse
  );

  logLedger('CLASSIFY_PROMPT_BUILT', { promptLength: classifierPrompt.length });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: classifierPrompt }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    logLedger('CLASSIFY_RAW_RESPONSE', {
      responseLength: responseText.length,
      preview: responseText.slice(0, 300) + (responseText.length > 300 ? '...' : '')
    });

    let parsed: ClassifierOutput;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      parsed = JSON.parse(jsonMatch[0]);
      logLedger('CLASSIFY_PARSED', {
        phase: parsed.currentPhase,
        level: parsed.diagnostic?.level,
        hasBeenAssessed: parsed.diagnostic?.hasBeenAssessed,
        artifactInProgress: parsed.artifact?.inProgress,
        guidance: parsed.guidance?.slice(0, 100)
      });
    } catch (e) {
      logLedger('CLASSIFY_PARSE_ERROR', {
        error: String(e),
        rawResponse: responseText.slice(0, 500)
      });
      console.error("[LEDGER] Failed to parse classifier response:", responseText);
      // Return ledger with incremented exchange count
      return incrementExchangeCount(ledger);
    }

    // Check if we've transitioned to SAVE phase with an artifact - trigger extraction
    const previousPhase = ledger.currentPhase;
    const newPhase = parsed.currentPhase;

    if (
      newPhase === "SAVE" &&
      previousPhase !== "SAVE" &&
      parsed.artifact.inProgress &&
      parsed.artifact.currentState
    ) {
      logLedger('ARTIFACT_EXTRACTION_TRIGGERED', {
        type: parsed.artifact.type,
        stateLength: parsed.artifact.currentState?.length
      });
      // Extract the artifact (fire and forget - don't block ledger update)
      extractArtifact(
        ledger.userId,
        ledger.weekNumber,
        parsed.artifact.type || "other",
        parsed.artifact.currentState,
        parsed.sessionSummary
      ).catch((err) => console.error("[LEDGER] Artifact extraction failed:", err));
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

    logLedger('UPDATE_SUCCESS', {
      ledgerId: ledger.id.slice(-8),
      phase: parsed.currentPhase,
      previousPhase: previousPhase,
      level: parsed.diagnostic.level,
      exchangeCount: parsed.exchangeCount
    });

    return transformFromDb(updated);
  } catch (error) {
    logLedger('CLASSIFY_ERROR', {
      error: String(error),
      ledgerId: ledger.id.slice(-8)
    });
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
  return `You are analyzing a tutoring conversation to update the conversation state. Be precise and evidence-based.

## Current State
- Phase: ${ledger.currentPhase}
- Diagnosed level: ${ledger.diagnostic.level || 'not yet assessed'}
- Exchange count: ${ledger.exchangeCount}
- Session summary: ${ledger.sessionSummary || 'Session just started'}

## Latest Exchange

USER: ${userMessage}

SKIPPY: ${assistantResponse}

## Week ${ledger.weekNumber} Developmental Progression

${progressionText}

## Your Task

Analyze this exchange and output a JSON object. Be SPECIFIC in your guidance — not objectives, but concrete next moves.

### Output Format

{
  "currentPhase": "DISCOVER|BUILD|REFINE|REFLECT|SAVE|BRIDGE",
  "phaseHistory": ${JSON.stringify(ledger.phaseHistory)},
  "exchangeCount": ${ledger.exchangeCount + 1},

  "diagnostic": {
    "hasBeenAssessed": true|false,
    "level": "pre-structural|unistructural|multistructural|relational|extended-abstract|null",
    "evidence": "Quote or paraphrase the SPECIFIC thing the teacher said that reveals this level",
    "readyFor": "What concept or skill is in their zone of proximal development?",
    "misconceptions": ["Array of specific misconceptions detected, if any"]
  },

  "sessionSummary": "2-3 sentences: what the teacher cares about, what they're building, where they are",

  "artifact": {
    "inProgress": true|false,
    "type": "prompt_template|workflow|draft_feedback|lesson_outline|email_template|communication_template|reflection|other|null",
    "currentState": "The artifact as it currently exists (full text if possible), or null",
    "iterationCount": ${ledger.artifact.iterationCount}
  },

  "remainingPhases": ["array of phases not yet completed"],

  "engagement": {
    "energy": "high|medium|low",
    "notes": "Brief observation about teacher's engagement"
  },

  "guidance": "SPECIFIC next move — not an objective, but an ACTION. e.g., 'Ask how they would adapt this for ELL students' or 'Present the artifact and ask what would break if we removed the constraints section'"
}

## Assessment Guidelines

**For diagnosticLevel — look for these signals:**

- **pre-structural**: Confused, no framework. "I just type stuff and hope." No mental model of how AI works.
- **unistructural**: Gets ONE thing. "You need to be specific." But applies it mechanically without nuance.
- **multistructural**: Knows multiple components. "Context, constraints, examples..." Lists them but doesn't explain WHY.
- **relational**: Sees connections and adapts. "It depends on..." Explains tradeoffs. Uses analogies that show deep understanding.
- **extended-abstract**: Could teach this. Generates novel applications. Questions the framework itself.

**Key signals to look for:**
- Analogies and metaphors (relational+)
- "It depends on..." reasoning (relational+)
- Asking "why" questions (multistructural+)
- Mechanical application without understanding (unistructural)
- Confusion or "I don't know where to start" (pre-structural)

**For phase transitions:**
- DISCOVER → BUILD: Level assessed AND they're ready to create something
- BUILD → REFINE: Initial artifact exists, now polish
- REFINE → REFLECT: Artifact solid, time for metacognition
- REFLECT → SAVE: Genuine reflection occurred (not just "looks good")
- SAVE → BRIDGE: Artifact captured, closing

**For guidance — be SPECIFIC:**

BAD: "Help them reflect on the process"
GOOD: "Ask: 'What would break if we removed the constraints section?'"

BAD: "Continue building the artifact"
GOOD: "Ask how they would adapt this prompt for their struggling readers"

BAD: "Assess their understanding"
GOOD: "Ask: 'If a colleague asked you why being specific matters, what would you tell them?'"

**Special cases:**
- If user says "looks good" or "that works" in REFLECT phase: guidance should push deeper. "Ask them to explain WHY it works, not just that it does."
- If user demonstrates higher level than previously assessed: note this and suggest adjusting tone to peer-level.
- If >8 exchanges in BUILD, suggest transition: "Look for natural moment to ask what they'd refine."

Output only valid JSON, no other text.`;
}
