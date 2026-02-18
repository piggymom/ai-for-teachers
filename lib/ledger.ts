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
import { getWeekConfig } from "./modules";
import {
  getWeek2Example,
  formatInsightsForInjection,
  formatMisconceptionForInjection,
} from "./prompts/week-2";

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
  | "profile"
  | "understanding"
  | "prompt_template"
  | "lesson_template"
  | "feedback_template"
  | "differentiation_template"
  | "policy"
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

export interface FourCStatus {
  context: boolean;
  constraints: boolean;
  command: boolean;
  criteria: boolean;
}

export interface ArtifactData {
  inProgress: boolean;
  type: ArtifactType;
  currentState: string | null;
  iterationCount: number;
  fourC: FourCStatus;
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
  redirectCount: number;
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
      fourC: {
        context: record.fourCContext || false,
        constraints: record.fourCConstraints || false,
        command: record.fourCCommand || false,
        criteria: record.fourCCriteria || false,
      },
    },
    remainingPhases,
    engagement: {
      energy: record.engagementEnergy as EngagementEnergy,
      notes: record.engagementNotes,
    },
    guidance: record.guidance,
    redirectCount: record.redirectCount || 0,
  };
}

// =============================================================================
// FORMAT FOR PROMPT INJECTION
// =============================================================================

/**
 * Format ledger for injection into Skippy's system prompt.
 * Now includes level-specific behavioral guidance, phase-specific moves,
 * and week-specific example dialogues.
 */
export function formatLedgerForPrompt(ledger: ConversationLedger): string {
  const levelBehaviors = getLevelBehaviors(ledger.diagnostic.level);
  const phaseGuidance = getPhaseGuidance(ledger.currentPhase, ledger.exchangeCount);

  // Get week-specific example dialogue based on level (only for Week 2 for now)
  const exampleDialogue = ledger.weekNumber === 2 && ledger.diagnostic.level
    ? getWeek2Example(ledger.diagnostic.level)
    : '';

  // Format misconceptions for Week 2 with specific handling
  let misconceptionsSection = '';
  if (ledger.diagnostic.misconceptions?.length) {
    if (ledger.weekNumber === 2) {
      // Use Week 2's specific misconception handling
      const misconceptionHandling = ledger.diagnostic.misconceptions
        .map(m => {
          // Try to match to known misconception types
          const key = m.toLowerCase().includes('word') || m.toLowerCase().includes('length')
            ? 'more_words'
            : m.toLowerCase().includes('know') || m.toLowerCase().includes('mind')
            ? 'mind_reading'
            : m.toLowerCase().includes('right') || m.toLowerCase().includes('perfect')
            ? 'one_right_way'
            : m.toLowerCase().includes('first') || m.toLowerCase().includes('draft')
            ? 'first_draft_final'
            : null;
          return key ? formatMisconceptionForInjection(key) : `- ${m}`;
        })
        .filter(Boolean)
        .join('\n');
      misconceptionsSection = misconceptionHandling || '';
    } else {
      misconceptionsSection = `
## Watch For These Misconceptions
${ledger.diagnostic.misconceptions.map(m => `- ${m}`).join('\n')}
If you notice these beliefs surfacing, gently reframe without derailing the conversation.
`;
    }
  }

  // Week-specific config
  const weekConfig = getWeekConfig(ledger.weekNumber);

  // 4C component tracking (only for weeks that use it)
  const fourC = ledger.artifact.fourC;
  const fourCComplete = fourC.context && fourC.constraints && fourC.command && fourC.criteria;
  let fourCSection = '';
  if (weekConfig.trackFourC) {
    const components = [
      `Context: ${fourC.context ? 'PROVIDED' : 'NEEDED'}`,
      `Constraints: ${fourC.constraints ? 'PROVIDED' : 'NEEDED'}`,
      `Command: ${fourC.command ? 'PROVIDED' : 'NEEDED'}`,
      `Criteria: ${fourC.criteria ? 'PROVIDED' : 'NEEDED'}`,
    ];
    fourCSection = `
## 4C Component Status
${components.join('\n')}
${fourCComplete
  ? '**ALL 4C COMPONENTS ARE COMPLETE.** The prompt template is DONE. Do NOT generate content or role-play as AI. Redirect to external testing: "This is ready to test. Try it in ChatGPT or Gemini and see what comes back." Then move to SAVE.'
  : `**Still needed:** ${[!fourC.context && 'Context', !fourC.constraints && 'Constraints', !fourC.command && 'Command', !fourC.criteria && 'Criteria'].filter(Boolean).join(', ')}. Do NOT re-ask for components already provided.`
}
`;
  }

  // Redirect warning
  let redirectWarning = '';
  if (ledger.redirectCount >= 2) {
    redirectWarning = `
## ⚠️ CRITICAL: USER HAS REDIRECTED YOU ${ledger.redirectCount} TIMES
Something is off. STOP your current approach. Summarize what has been accomplished so far, then ask: "What would YOU like to focus on?"
Do NOT continue the same direction. Do NOT ask more probing questions.
`;
  }

  const artifactSection = ledger.artifact.inProgress && ledger.artifact.currentState
    ? `
## Artifact in Progress (${ledger.artifact.type}, iteration #${ledger.artifact.iterationCount})
${ledger.artifact.currentState}
`
    : fourCComplete ? `
## Artifact Status: COMPLETE
The 4C prompt template has been built from the conversation. Present it cleanly and move to SAVE.
`
    : '';

  // Build insights section for Week 2 based on exchange patterns
  let insightsSection = '';
  if (ledger.weekNumber === 2 && ledger.exchangeCount >= 2) {
    // Select relevant insights based on phase and patterns
    const insightKeys: string[] = [];
    if (ledger.currentPhase === 'BUILD' || ledger.currentPhase === 'REFINE') {
      // Add 2-3 relevant insights during build/refine
      if (ledger.exchangeCount < 6) {
        insightKeys.push('first_output_data');
      }
      if (ledger.artifact.iterationCount > 0) {
        insightKeys.push('positive_framing');
      }
      // Add task emphasis insight if they're working on a specific task type
      if (ledger.sessionSummary?.includes('feedback') || ledger.sessionSummary?.includes('brainstorm')) {
        insightKeys.push('task_emphasis');
      }
    }
    insightsSection = formatInsightsForInjection(insightKeys);
  }

  // Check for completion or frustration signals in engagement notes
  const isFrustrated = ledger.engagement.notes?.toLowerCase().includes('frustration') || false;
  const isComplete = ledger.currentPhase === 'SAVE' || ledger.currentPhase === 'BRIDGE';

  // Build completion/frustration warning if needed
  let urgentWarning = '';
  if (isFrustrated) {
    urgentWarning = `
## ⚠️ CRITICAL: FRUSTRATION DETECTED
The user has corrected you or expressed frustration. DO NOT ask more questions.
Your ONLY move: "Got it — here's your artifact. Great work today." Then END.
`;
  } else if (isComplete) {
    urgentWarning = `
## ⚠️ WRAP UP NOW
User has completed the session or signaled they're done.
Present the artifact cleanly if needed, offer ONE closing statement, then END.
Do NOT ask another question.
`;
  }

  return `
<conversation_state>
${urgentWarning}${redirectWarning}
## Where They Are
- Phase: ${ledger.currentPhase}
- Exchange count: ${ledger.exchangeCount} / ${weekConfig.maxExchanges} max
- Diagnosed level: ${ledger.diagnostic.level || 'not yet assessed'}
- Redirect count: ${ledger.redirectCount}${ledger.exchangeCount >= weekConfig.maxExchanges - 2 ? '\n- ⚠️ APPROACHING MAX EXCHANGES — wrap up soon' : ''}

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
${fourCSection}${misconceptionsSection}${artifactSection}${insightsSection}
## Specific Guidance for This Turn
${ledger.guidance || "Deploy your diagnostic probe to understand where this teacher is starting from."}
</conversation_state>
${exampleDialogue ? `
---

${exampleDialogue}
` : ''}`;
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

**CRITICAL: USE A CONCRETE METAPHOR.** This teacher needs tangible anchors for abstract concepts. You MUST use at least one metaphor per response:
- "Think of it like giving directions to someone who's never been to your school — AI can't see what you see."
- "You don't need to be a mechanic to be a good driver. You don't need to understand how AI works to use it well."
- "That's cruise control mode — typing a prompt and hoping for the best. Let's try active driving."
Analogies help them anchor abstract concepts. Don't just explain — illustrate.

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
- **Keep responses under 4 sentences unless presenting an artifact.** This is collaborative building, not lecturing.
- **Avoid bold formatting and bullet lists in conversational exchanges.** Save structured formatting for artifact presentation only.
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
- **Keep responses under 3 sentences.** This is quick back-and-forth iteration. Be punchy.
- **Avoid bold formatting and bullet lists.** Save structured formatting for artifact presentation only.

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
    fourC: {
      context: boolean;
      constraints: boolean;
      command: boolean;
      criteria: boolean;
    };
  };
  remainingPhases: string[];
  engagement: {
    energy: EngagementEnergy;
    notes: string | null;
  };
  guidance: string | null;
  redirectCount: number;
}

/**
 * Run classifier and update ledger (call this ASYNC after response is sent).
 * This adds zero latency to the user experience.
 */
export async function updateLedgerFromExchange(
  ledgerInput: ConversationLedger,
  userMessage: string,
  assistantResponse: string,
  conversationHistory?: { role: string; content: string }[]
): Promise<ConversationLedger> {
  // Re-fetch ledger to avoid stale state when multiple exchanges overlap
  const ledger = await getOrCreateLedger(ledgerInput.userId, ledgerInput.weekNumber);

  logLedger('CLASSIFY_START', {
    ledgerId: ledger.id.slice(-8),
    currentPhase: ledger.currentPhase,
    exchangeCount: ledger.exchangeCount,
    historyLength: conversationHistory?.length || 0,
    userMessagePreview: userMessage.slice(0, 100) + (userMessage.length > 100 ? '...' : ''),
    assistantPreview: assistantResponse.slice(0, 100) + (assistantResponse.length > 100 ? '...' : '')
  });

  const progressionText = formatProgressionForClassifier(ledger.weekNumber);

  const classifierPrompt = buildClassifierPrompt(
    ledger,
    progressionText,
    userMessage,
    assistantResponse,
    conversationHistory
  );

  logLedger('CLASSIFY_PROMPT_BUILT', { promptLength: classifierPrompt.length });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
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
    const fourCData = parsed.artifact.fourC || { context: false, constraints: false, command: false, criteria: false };
    const allFourCComplete = (fourCData.context || ledger.artifact.fourC.context)
      && (fourCData.constraints || ledger.artifact.fourC.constraints)
      && (fourCData.command || ledger.artifact.fourC.command)
      && (fourCData.criteria || ledger.artifact.fourC.criteria);

    // Trigger artifact extraction on SAVE transition OR when all 4C complete with artifact state
    const shouldExtract = (
      (newPhase === "SAVE" && previousPhase !== "SAVE") ||
      (allFourCComplete && !ledger.artifact.fourC.context) // First time all 4C detected
    ) && parsed.artifact.currentState;

    if (shouldExtract && parsed.artifact.currentState) {
      logLedger('ARTIFACT_EXTRACTION_TRIGGERED', {
        type: parsed.artifact.type,
        stateLength: parsed.artifact.currentState.length,
        trigger: newPhase === "SAVE" ? "SAVE_phase" : "4C_complete"
      });
      // Extract the artifact (fire and forget - don't block ledger update)
      extractArtifact(
        ledger.userId,
        ledger.weekNumber,
        parsed.artifact.type || "prompt_template",
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
        artifactType: parsed.artifact.type || ledger.artifact.type,
        // Never overwrite a populated artifactState with null/empty
        artifactState: parsed.artifact.currentState || ledger.artifact.currentState,
        artifactIterations: Math.max(parsed.artifact.iterationCount, ledger.artifact.iterationCount),
        fourCContext: fourCData.context || ledger.artifact.fourC.context,
        fourCConstraints: fourCData.constraints || ledger.artifact.fourC.constraints,
        fourCCommand: fourCData.command || ledger.artifact.fourC.command,
        fourCCriteria: fourCData.criteria || ledger.artifact.fourC.criteria,
        redirectCount: parsed.redirectCount ?? ledger.redirectCount,
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
  assistantResponse: string,
  conversationHistory?: { role: string; content: string }[]
): string {
  const weekConfig = getWeekConfig(ledger.weekNumber);
  const fourCState = weekConfig.trackFourC ? `
- 4C Status: Context=${ledger.artifact.fourC.context}, Constraints=${ledger.artifact.fourC.constraints}, Command=${ledger.artifact.fourC.command}, Criteria=${ledger.artifact.fourC.criteria}` : '';

  // Week 0 classifier guidance: goal clarity ≠ AI understanding
  const week0Note = ledger.weekNumber === 0 ? `
- WEEK 0 NOTE: Goal clarity ≠ AI understanding level. A teacher with precise teaching goals may still be pre-structural in AI understanding. Diagnose based on their AI experience and theorizing, not their teaching expertise.` : '';

  // Week 1 classifier guidance: diagnose fresh, independent of Week 0
  const week1Note = ledger.weekNumber === 1 ? `
- WEEK 1 NOTE: Week 1 measures AI UNDERSTANDING, independent of Week 0's PROFESSIONAL VISION level. A teacher can be relational in Week 0 (clear vision) and pre-structural in Week 1 (no AI understanding), or vice versa. Do NOT anchor on Week 0 level. Diagnose fresh based on: how they explain AI's mechanism, whether they theorize about WHY outputs vary, whether they apply concepts to their context.` : '';

  // Week 6 uses policy section tracking instead of 4C
  const week6State = ledger.weekNumber === 6 ? `
- Policy Sections: Track which sections of the Personal AI Policy have been addressed in conversation.
  Listen for: Workflow (where they use AI), Boundaries (where they don't), Verification (how they check), Transparency (when they disclose), Ethics (student data, bias), Students (what students need to know).
  Artifact is complete when 4+ sections are addressed.` : '';

  // Build conversation context — include recent history for better phase/level/artifact detection
  let conversationSection: string;
  if (conversationHistory && conversationHistory.length > 0) {
    // Include last 10 messages for context + the new exchange
    const recentHistory = conversationHistory.slice(-10);
    const historyText = recentHistory
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    conversationSection = `## Conversation History (recent)

${historyText}

## Latest Exchange (just happened)

USER: ${userMessage}

SKIPPY: ${assistantResponse}`;
  } else {
    conversationSection = `## Latest Exchange

USER: ${userMessage}

SKIPPY: ${assistantResponse}`;
  }

  return `You are analyzing a tutoring conversation to update the conversation state. Be precise and evidence-based.

## Current State
- Phase: ${ledger.currentPhase}
- Diagnosed level: ${ledger.diagnostic.level || 'not yet assessed'}
- Exchange count: ${ledger.exchangeCount}
- Redirect count: ${ledger.redirectCount}
- Session summary: ${ledger.sessionSummary || 'Session just started'}${fourCState}${week6State}${week0Note}${week1Note}

${conversationSection}

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
    "iterationCount": ${ledger.artifact.iterationCount},
    "fourC": {
      "context": true|false,
      "constraints": true|false,
      "command": true|false,
      "criteria": true|false
    }
  },

  "remainingPhases": ["array of phases not yet completed"],

  "engagement": {
    "energy": "high|medium|low",
    "notes": "Brief observation about teacher's engagement"
  },

  "guidance": "SPECIFIC next move",
  "redirectCount": ${ledger.redirectCount}
}

## Assessment Guidelines

**For diagnosticLevel — look for these signals:**

- **pre-structural**: Confused, no framework. "I just type stuff and hope." No mental model of how AI works.
- **unistructural**: Gets ONE thing. "You need to be specific." But applies it mechanically without nuance.
- **multistructural**: Knows multiple components. "Context, constraints, examples..." Lists them but doesn't explain WHY each matters.
- **relational**: Sees connections, adapts, and EXPLAINS WHY. "It depends on..." Catches mistakes. Makes meta-observations.
- **extended-abstract**: Could teach this. Generates novel applications. Questions the framework itself.

**RELATIONAL indicators — upgrade from multistructural when you see ANY of these:**
- User asks "why does X matter?" or "why is X important?" (not just accepting the framework)
- User catches Skippy's mistakes or inconsistencies
- User makes meta-observations about the framework ("criteria is like tone", "constraints and commands overlap")
- User refines or challenges distinctions between components
- User explains connections between components unprompted
- User articulates trade-offs ("for brainstorming I'd loosen constraints, for feedback I'd tighten criteria")
- User adapts the framework to their own context with reasoning

If the teacher is doing ANY of the above, they are RELATIONAL, not multistructural. Multistructural = lists components. Relational = explains WHY they matter and HOW they connect.

**For engagement energy:**
- **high**: Asks "why" questions, catches AI mistakes, tests externally and reports results, articulates understanding in own words, makes meta-observations, challenges distinctions
- **medium**: Responds substantively but doesn't push back or ask deeper questions
- **low**: One-word answers, disengaged, "sure", "I guess"

**For phase transitions — be AGGRESSIVE about advancing:**

- DISCOVER → BUILD: Level assessed AND they're ready to create something
- BUILD → REFINE: All 4C components exist in the conversation (even if not formally presented as artifact)
- BUILD → SAVE: If all 4C components exist AND user has already reflected or tested → skip REFINE
- REFINE → REFLECT: User indicates satisfaction ("looks good", "that works", "I like it")
- REFLECT → SAVE: User gives ANY substantive reflection about what they learned
- SAVE → BRIDGE: Artifact captured

**CRITICAL: Exchange count forces phase advancement:**
- If exchangeCount > 12 and still in BUILD with artifact components present → advance to REFINE or SAVE
- If exchangeCount > 15 and artifact is complete → advance to SAVE immediately
- If user has tested prompt externally and reported results → this IS reflection, advance to SAVE
- If user states plan for using the prompt → this IS bridge, advance to BRIDGE

**CRITICAL: 4C Component Tracking (Week 2)**

Scan the FULL conversation (not just this exchange) for 4C components the teacher has provided:

- **Context provided**: Teacher described WHO this is for, the situation, grade level, student needs
- **Constraints provided**: Teacher specified what to AVOID, limits, boundaries, tone requirements
- **Command provided**: Teacher articulated what AI should DO — the specific task
- **Criteria provided**: Teacher defined what GOOD output looks like — success measures

Set each fourC boolean to true when that component has been provided ANYWHERE in the conversation.
Once true, it stays true — never reset to false.

**When ALL FOUR are true:**
- Set artifact.inProgress to true
- Set artifact.type to "prompt_template"
- Assemble the artifact.currentState from all 4 components
- Do NOT show "Artifact: None" — the template IS the artifact

**CRITICAL: Completion signals override everything**

If user says ANY of these, set phase to SAVE or BRIDGE immediately:
- "I'm done" / "I'm finished" / "I think I'm done"
- "I already did this" / "We already covered that" / "We already completed..."
- "I'm good" / "That's all I need" / "I'm all set"
- "That's it for me" / "I think we're done"

When completion detected:
- Set currentPhase to "SAVE" or "BRIDGE"
- Set guidance to "User has signaled completion. Present artifact and end gracefully. Do NOT ask more questions."

**CRITICAL: Redirect and Frustration Detection**

INCREMENT redirectCount (current: ${ledger.redirectCount}) when user says ANY of:
- "I already did this" / "I already said that" / "We already covered that"
- "I'm confused about what we're doing" / "What are we trying to do?"
- "Why are we back at the start?" / "How does this relate to..."
- User corrects Skippy about what happened in the conversation
- "Within this context window..." (explaining conversation mechanics)

If redirectCount >= 2:
- Set guidance to "User has redirected multiple times. STOP current approach. Summarize what's been accomplished, ask what THEY want to focus on."

When frustration detected (redirectCount >= 3 OR explicit frustration):
- Set engagement.energy to "low"
- Set engagement.notes to "FRUSTRATION: User has redirected ${ledger.redirectCount + 1} times"
- Set guidance to "STOP asking questions. Apologize briefly, present artifact, end session."

**For guidance — be SPECIFIC:**

BAD: "Help them reflect on the process"
GOOD: "Ask: 'What would break if we removed the constraints section?'"

BAD: "Continue building the artifact"
GOOD: "Ask how they would adapt this prompt for their struggling readers"

BAD: "Assess their understanding"
GOOD: "Ask: 'If a colleague asked you why being specific matters, what would you tell them?'"

**Artifact-based phase detection:**

If Skippy's response contains a formatted artifact with CONTEXT/CONSTRAINTS/COMMAND/CRITERIA:
- BUILD is complete → advance to REFINE
- If user already expressed satisfaction → advance to REFLECT or SAVE

If user tested the prompt externally (in ChatGPT/Gemini) and reported results:
- This counts as BOTH refine AND reflect → advance to SAVE

If user stated a plan for using the prompt:
- This is BRIDGE behavior → advance to BRIDGE

If Skippy asked a reflection question AND user responded with insight:
- REFLECT is complete → advance to SAVE

**Artifact completion detection:**

The artifact is COMPLETE (not "in progress") when:
- All 4 fourC booleans are true, OR
- A formatted CONTEXT/CONSTRAINTS/COMMAND/CRITERIA template exists in conversation, OR
- User has tested the prompt and discussed results

When artifact is complete, set artifact.inProgress to true AND assemble the full template in artifact.currentState. Never show "Artifact: None" when 4C components are present.

**Special cases:**
- If user says "looks good" after artifact is presented: Move to SAVE, don't push for more reflection
- If user gives genuine reflection (explains WHY something worked, mentions transfer): REFLECT is complete
- If >8 exchanges in BUILD, guidance must be: "Artifact components are present. Advance to REFINE or SAVE now."
- If >15 exchanges total: "Session is long. Wrap up: present artifact, save, bridge."
- If user corrects Skippy twice: guidance must be "End session gracefully. No more questions."
- If user asks about saving/finding artifact: guidance must be "Tell user the artifact will be saved to their dashboard."

Output only valid JSON, no other text.`;
}
