/**
 * Learner Agent Simulation System
 *
 * Runs 3 simulated teacher personas through full multi-turn conversations
 * with Skippy across all 7 weeks (0-6). Generates transcripts and feedback reports.
 *
 * Usage:
 *   npx tsx scripts/learner-agents.ts                         # Full run
 *   npx tsx scripts/learner-agents.ts --persona=maria         # One persona
 *   npx tsx scripts/learner-agents.ts --week=2                # One week
 *   npx tsx scripts/learner-agents.ts --persona=maria --week=0-2  # Range
 *   npx tsx scripts/learner-agents.ts --verbose               # Print live
 *   npx tsx scripts/learner-agents.ts --no-classifier         # Skip classifier
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { SKIPPY_SYSTEM_PROMPT } from "../lib/skippy";
import { getModulePrompt, getWeekConfig, weekConfigs } from "../lib/modules";
import { formatLedgerForPrompt, type ConversationLedger, type ConversationPhase, type EngagementEnergy, type ArtifactType } from "../lib/ledger";
import { buildProfileContext, type UserProfileData } from "../lib/profile";
import { formatProgressionForClassifier, getDiagnosticProbe } from "../lib/progressions";

const anthropic = new Anthropic();

// Models
const SKIPPY_MODEL = "claude-sonnet-4-20250514";
const PERSONA_MODEL = "claude-haiku-4-5-20251001";
const CLASSIFIER_MODEL = "claude-haiku-4-5-20251001";
const EVALUATOR_MODEL = "claude-sonnet-4-20250514";

const SKIPPY_MAX_TOKENS = 1500;
const PERSONA_MAX_TOKENS = 500;
const CLASSIFIER_MAX_TOKENS = 2500;
const EVALUATOR_MAX_TOKENS = 4000;

const RATE_LIMIT_MS = 750;

// =============================================================================
// TYPES
// =============================================================================

interface Persona {
  id: string;
  name: string;
  firstName: string;
  subject: string;
  gradeLevels: string[];
  aiExperience: string;
  primaryGoal: string;
  timeDrains: string[];
  goalDetails: string;
  personality: string;
  growthArc: Record<number, string>; // week -> target level
  systemPromptBase: string;
}

interface Exchange {
  turn: number;
  teacher: string;
  skippy: string;
}

interface WeekTranscript {
  persona: string;
  week: number;
  exchanges: Exchange[];
  finalLedger: InMemoryLedger;
}

interface InMemoryLedger {
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
    fourC: { context: boolean; constraints: boolean; command: boolean; criteria: boolean };
  };
  remainingPhases: string[];
  engagement: {
    energy: EngagementEnergy;
    notes: string | null;
  };
  guidance: string | null;
  redirectCount: number;
}

// =============================================================================
// PERSONAS
// =============================================================================

const PERSONAS: Persona[] = [
  {
    id: "maria",
    name: "Maria Chen",
    firstName: "Maria",
    subject: "Chemistry",
    gradeLevels: ["10th", "11th", "12th"],
    aiExperience: "new",
    primaryGoal: "save_time",
    timeDrains: ["Lab reports", "Grading lab assessments", "Creating safety protocols"],
    goalDetails: "I'm drowning in lab report feedback. 150 students, each writing 2-3 page reports every two weeks. I spend my weekends grading.",
    personality: "Skeptical veteran. Guarded, gives short answers, pushes back on hype. Warms up when she sees concrete value. 22 years teaching.",
    growthArc: {
      0: "unistructural",
      1: "unistructural",
      2: "unistructural",
      3: "multistructural",
      4: "multistructural",
      5: "multistructural",
      6: "relational",
    },
    systemPromptBase: `You are Maria Chen, a veteran chemistry teacher with 22 years of experience. You teach grades 10-12.

## Your personality
- Skeptical and guarded about AI. You've seen many "revolutionary" education tools come and go.
- You give SHORT, direct answers. Often just 1-2 sentences. You don't over-explain.
- You push back when something sounds like hype or marketing speak.
- You're practical — you care about what WORKS, not what's trendy.
- You warm up when you see genuine, concrete value for your specific situation.
- You're a bit protective of your teaching expertise. You don't like being talked down to.
- You occasionally reference your experience: "In 22 years of teaching..."

## Your situation
- You teach Chemistry to grades 10-12
- 150 students, lab reports every two weeks
- You spend your weekends grading and it's unsustainable
- Your primary motivation: saving time on lab report feedback
- You're new to AI — you've heard about ChatGPT but haven't really used it

## How you respond
- Keep responses short: 1-3 sentences typically
- Early on: guarded, monosyllabic, skeptical ("Sure." "I guess." "How is that different from a rubric?")
- When something resonates: slightly more engaged, still concise ("Okay, that actually makes sense for lab reports.")
- When pushed too hard: pushback ("I don't need a framework. I need to stop spending my weekends grading.")
- You sometimes express doubt: "I'm not sure AI can handle the nuance of chemistry feedback."`,
  },

  {
    id: "james",
    name: "James Robinson",
    firstName: "James",
    subject: "English/Language Arts",
    gradeLevels: ["7th", "8th"],
    aiExperience: "some",
    primaryGoal: "better_materials",
    timeDrains: ["Differentiated reading materials", "Creating writing rubrics", "Parent communication"],
    goalDetails: "I have students reading at 3rd grade level and others ready for high school texts. I need to differentiate without creating 5 versions of everything from scratch.",
    personality: "Eager novice. Enthusiastic, over-shares, goes on tangents, gives shallow reflections initially. Genuinely curious but sometimes misses the point.",
    growthArc: {
      0: "multistructural",
      1: "multistructural",
      2: "multistructural",
      3: "multistructural",
      4: "relational",
      5: "relational",
      6: "relational",
    },
    systemPromptBase: `You are James Robinson, an enthusiastic middle school English/Language Arts teacher with 6 years of experience.

## Your personality
- Eager and enthusiastic about AI. You've played with ChatGPT and are excited about possibilities.
- You OVER-SHARE. Your responses are often 3-5 sentences when 1-2 would do.
- You go on TANGENTS — you'll start talking about one thing and drift to something related but off-topic.
- Your reflections tend to be SHALLOW at first: "That's cool!" "I love it!" "This is awesome!" without explaining WHY.
- You sometimes miss the deeper point and need redirecting.
- You're genuinely curious and open to learning, but you need help going deeper.
- You reference your students a lot: "My 7th graders would..." "I have this one student who..."

## Your situation
- You teach English/Language Arts to grades 7-8
- Wide range of reading levels (3rd grade to high school ready)
- Primary need: differentiated reading materials
- You've used ChatGPT a few times — mostly for brainstorming lesson ideas
- You're excited but don't have a systematic approach yet

## How you respond
- Responses are medium-length: 2-5 sentences, sometimes more
- Enthusiastic: "Oh! That reminds me of..." "I love that because..."
- Goes on tangents: starts answering a question, drifts to a story about a student
- Shallow reflections early on: "That's great!" "I get it!" (without depth)
- Deeper reflections later: starts explaining WHY things work
- Sometimes asks too many questions at once: "So how would I... and also could I... and what about..."`,
  },

  {
    id: "rachel",
    name: "Rachel Kim",
    firstName: "Rachel",
    subject: "Mathematics",
    gradeLevels: ["5th", "6th"],
    aiExperience: "advanced",
    primaryGoal: "faster_feedback",
    timeDrains: ["Providing individualized math feedback", "Creating tiered problem sets", "Progress tracking"],
    goalDetails: "I already use AI for generating problem sets but I want a more systematic feedback workflow. I want to batch-process student work analysis and generate targeted intervention suggestions.",
    personality: "Advanced practitioner. Precise, analytical, challenges frameworks, catches repetition, makes meta-observations about the tutoring itself.",
    growthArc: {
      0: "relational",
      1: "relational",
      2: "relational",
      3: "relational",
      4: "extended-abstract",
      5: "extended-abstract",
      6: "extended-abstract",
    },
    systemPromptBase: `You are Rachel Kim, a precise and analytically-minded elementary math teacher with 10 years of experience.

## Your personality
- Precise and analytical. You think in systems and frameworks.
- You CHALLENGE frameworks — you don't just accept them, you test them against edge cases.
- You CATCH REPETITION immediately. If the tutor repeats itself, you call it out.
- You make META-OBSERVATIONS about the tutoring process itself ("I notice you're scaffolding me, but I've already demonstrated I understand this.")
- You're respectful but direct. You don't waste words.
- You value efficiency. If something could be said in fewer words, you'll say so.
- You often reframe ideas in your own terms to demonstrate understanding.

## Your situation
- You teach Mathematics to grades 5-6
- You already use AI extensively — ChatGPT and Claude for generating problem sets
- You want systematic feedback workflows, not basic prompting
- You've built prompt templates, experimented with chaining, used system prompts
- Your primary need: batch-process student work analysis + targeted interventions

## How you respond
- Precise: 2-3 sentences, each one counts
- Challenges: "That's the same as what you said before." "I'd push back on that — in math contexts, constraints matter more than context."
- Meta-observations: "You're using the Socratic method, but I already know the answer. Can we skip ahead?"
- Reframes: "So what you're really saying is..." (puts it in her own terms)
- Asks sharp questions: "Where does the 4C framework break down? What tasks don't fit?"
- Sometimes impatient with basics: "I already do this. What's the NEXT level?"`,
  },
];

// =============================================================================
// IN-MEMORY LEDGER
// =============================================================================

function createFreshLedger(weekNumber: number): InMemoryLedger {
  const allPhases: ConversationPhase[] = ["DISCOVER", "BUILD", "REFINE", "REFLECT", "SAVE", "BRIDGE"];
  return {
    currentPhase: "DISCOVER",
    phaseHistory: ["DISCOVER"],
    exchangeCount: 0,
    diagnostic: {
      hasBeenAssessed: false,
      level: null,
      evidence: null,
      readyFor: null,
      misconceptions: [],
    },
    sessionSummary: "",
    artifact: {
      inProgress: false,
      type: null,
      currentState: null,
      iterationCount: 0,
      fourC: { context: false, constraints: false, command: false, criteria: false },
    },
    remainingPhases: allPhases.slice(1).map(String),
    engagement: { energy: "medium", notes: null },
    guidance: null,
    redirectCount: 0,
  };
}

function ledgerToConversationLedger(ledger: InMemoryLedger, weekNumber: number): ConversationLedger {
  return {
    id: "sim-ledger",
    userId: "sim-user",
    weekNumber,
    ...ledger,
  };
}

// =============================================================================
// PROMPT BUILDERS
// =============================================================================

function buildPersonaProfile(persona: Persona): UserProfileData {
  return {
    role: "Classroom Teacher",
    gradeLevels: persona.gradeLevels,
    subjects: [persona.subject],
    aiExperienceLevel: persona.aiExperience,
    biggestTimeDrains: persona.timeDrains,
    primaryGoal: persona.primaryGoal,
    goalDetails: persona.goalDetails,
  };
}

function buildSkippyPrompt(persona: Persona, weekNumber: number, ledger: InMemoryLedger): string {
  const parts: string[] = [];

  // 1. Global Skippy prompt
  parts.push(SKIPPY_SYSTEM_PROMPT);

  // 2. Week-specific prompt
  const modulePrompt = getModulePrompt(weekNumber);
  if (modulePrompt) {
    parts.push(`\n## This week's focus\n${modulePrompt.prompt}`);
  }

  // 3. Opening message template
  const openingMessage = modulePrompt?.openingMessage || "";
  const openingTemplate = openingMessage.replace(/\{\{name\}\}/g, persona.firstName);
  if (openingTemplate) {
    parts.push(`\n## Your opening message for this week\nWhen starting a new conversation, say exactly this:\n\n"${openingTemplate}"`);
  }

  // 4. Profile context
  const profileData = buildPersonaProfile(persona);
  const profileContext = buildProfileContext(profileData);
  parts.push(`\n## About this teacher\n${profileContext}`);

  // 5. Ledger context
  const fullLedger = ledgerToConversationLedger(ledger, weekNumber);
  const ledgerContext = formatLedgerForPrompt(fullLedger);
  parts.push(`\n\n${ledgerContext}`);

  return parts.join("\n");
}

function buildPersonaSystemPrompt(
  persona: Persona,
  weekNumber: number,
  currentLevel: string,
  previousWeeksSummary: string
): string {
  return `${persona.systemPromptBase}

## Current week: Week ${weekNumber}
Your current AI understanding level: ${currentLevel}

## What you know from previous weeks
${previousWeeksSummary || "This is your first week. You're just getting started."}

## Important instructions
- Stay in character at all times
- Respond naturally as this teacher would — imperfect, opinionated, sometimes confused
- Your responses should reflect your current understanding level (${currentLevel})
- Don't be too helpful or cooperative — real teachers push back, get confused, go on tangents
- When you feel the conversation is wrapping up naturally, you can signal you're done
- Keep your responses realistic in length for your personality`;
}

function buildPreviousWeeksSummary(persona: Persona, completedWeeks: WeekTranscript[]): string {
  if (completedWeeks.length === 0) return "";

  const summaries = completedWeeks.map(w => {
    const lastLedger = w.finalLedger;
    const exchangeCount = w.exchanges.length;
    return `- Week ${w.week}: ${exchangeCount} exchanges. ${lastLedger.sessionSummary || "Completed session."}`;
  });

  return summaries.join("\n");
}

// =============================================================================
// OFFLINE CLASSIFIER (copied from lib/ledger.ts:848-1091)
// =============================================================================

function buildOfflineClassifierPrompt(
  ledger: InMemoryLedger,
  weekNumber: number,
  userMessage: string,
  assistantResponse: string,
  conversationHistory: { role: string; content: string }[]
): string {
  const progressionText = formatProgressionForClassifier(weekNumber);
  const weekConfig = getWeekConfig(weekNumber);

  const fourCState = weekConfig.trackFourC ? `
- 4C Status: Context=${ledger.artifact.fourC.context}, Constraints=${ledger.artifact.fourC.constraints}, Command=${ledger.artifact.fourC.command}, Criteria=${ledger.artifact.fourC.criteria}` : '';

  // Build conversation context
  let conversationSection: string;
  if (conversationHistory.length > 0) {
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

  // Week-specific classifier notes (matching production lib/ledger.ts)
  const week0Note = weekNumber === 0 ? `
- WEEK 0 NOTE: Goal clarity ≠ AI understanding level. A teacher with precise teaching goals may still be pre-structural in AI understanding. Diagnose based on their AI experience and theorizing, not their teaching expertise.` : '';

  const week1Note = weekNumber === 1 ? `
- WEEK 1 NOTE: Week 1 measures AI UNDERSTANDING, independent of Week 0's PROFESSIONAL VISION level. A teacher can be relational in Week 0 (clear vision) and pre-structural in Week 1 (no AI understanding), or vice versa. Do NOT anchor on Week 0 level. Diagnose fresh based on: how they explain AI's mechanism, whether they theorize about WHY outputs vary, whether they apply concepts to their context.` : '';

  const week6State = weekNumber === 6 ? `
- Policy Dimensions: Track which dimensions of the Personal AI Policy have been addressed in conversation.
  Listen for: Skill Integration (course skills connected to practice), Principles (articulated boundaries with reasoning), Student-Facing (grade-appropriate AI literacy plan), Stress-Tested (policy tested against scenarios), Capacity (demonstrated ability to work independently).
  Policy is complete when 3+ dimensions are addressed AND at least one stress-test scenario completed.
  Note: Week 6 STRESS-TEST maps to REFINE phase in the ledger.` : '';

  return `You are analyzing a tutoring conversation to update the conversation state. Be precise and evidence-based.

## Current State
- Phase: ${ledger.currentPhase}
- Diagnosed level: ${ledger.diagnostic.level || 'not yet assessed'}
- Exchange count: ${ledger.exchangeCount}
- Redirect count: ${ledger.redirectCount}
- Session summary: ${ledger.sessionSummary || 'Session just started'}${fourCState}${week6State}${week0Note}${week1Note}

${conversationSection}

## Week ${weekNumber} Developmental Progression

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

**CRITICAL: Diagnose AI SKILL, not general intelligence.**

Diagnose based on DEMONSTRATED AI PROMPTING SKILL, not general intelligence, communication ability, or teaching experience. A veteran teacher with no AI experience is pre-structural or unistructural, regardless of how articulate they sound.

Examples:
- "Being specific matters" (from teaching analogy) → unistructural (general insight, not AI skill)
- "Being specific matters BECAUSE AI predicts based on context window" → multistructural (understands AI mechanism)
- "For brainstorming I'd loosen constraints, for feedback I'd tighten criteria" (about AI prompting, with reasoning) → relational (adapts AI approach to task type)
- "I imagine it's like giving clear directions" (analogy, no AI experience) → pre-structural or unistructural

The KEY question: Is the teacher demonstrating understanding of HOW AI WORKS and how to MANIPULATE IT through prompting, or are they applying general intelligence to guess? Sophisticated guessing based on teaching experience ≠ AI prompting skill.

**For diagnosticLevel — look for these signals:**

- **pre-structural**: No AI experience. Guesses by analogy. "I imagine you need to be clear?" No demonstrated interaction with AI tools.
- **unistructural**: Has tried AI OR grasps ONE concrete principle from this session. "You need to be specific." But applies it mechanically without nuance.
- **multistructural**: Can name and apply multiple AI prompting components. Lists them but doesn't explain WHY each matters or WHEN to emphasize different ones.
- **relational**: Explains WHY components matter for AI specifically (not just "good communication"). Adapts approach based on task type FROM EXPERIENCE with AI.
- **extended-abstract**: Applies principles to new contexts without scaffolding. Designs own success criteria or testing protocols. Identifies limitations and proposes modifications. Could walk a colleague through the approach.

DO NOT upgrade to relational just because the teacher is articulate, asks probing questions, pushes back, or makes teaching analogies. Those indicate teaching expertise, not AI prompting skill.

**EXTENDED-ABSTRACT — MUST upgrade from relational when you see 2+ of:**
- User applies a framework to a NEW context without prompting
- User articulates WHY a principle works, not just THAT it works
- User designs their own success criteria or testing protocol
- User identifies limitations of the current approach and proposes modifications
- User explains how they would teach this to someone else

If relational indicators AND 2+ extended-abstract indicators are present,
diagnose EXTENDED-ABSTRACT. Do not cap at relational.

**For phase transitions — be AGGRESSIVE about advancing:**

- DISCOVER → BUILD: Level assessed AND they're ready to create something
- BUILD → REFINE: All 4C components exist in the conversation
- REFINE → REFLECT: User indicates satisfaction
- REFLECT → SAVE: User gives ANY substantive reflection
- SAVE → BRIDGE: Artifact captured

**CRITICAL: Completion signals override everything**

If user says ANY of these, set phase to SAVE or BRIDGE immediately:
- "I'm done" / "I'm finished" / "I think I'm done"
- "I'm good" / "That's all I need" / "I'm all set"

**CRITICAL: Exchange count forces phase advancement:**
- If exchangeCount > 12 and still in BUILD with artifact components present → advance to REFINE or SAVE
- If exchangeCount > 15 and artifact is complete → advance to SAVE immediately

**For guidance — be SPECIFIC:**

BAD: "Help them reflect on the process"
GOOD: "Ask: 'What would break if we removed the constraints section?'"

Output only valid JSON, no other text.`;
}

async function runOfflineClassifier(
  ledger: InMemoryLedger,
  weekNumber: number,
  userMessage: string,
  assistantResponse: string,
  conversationHistory: { role: string; content: string }[]
): Promise<InMemoryLedger> {
  const prompt = buildOfflineClassifierPrompt(
    ledger, weekNumber, userMessage, assistantResponse, conversationHistory
  );

  try {
    const response = await anthropic.messages.create({
      model: CLASSIFIER_MODEL,
      max_tokens: CLASSIFIER_MAX_TOKENS,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in classifier response");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      currentPhase: parsed.currentPhase || ledger.currentPhase,
      phaseHistory: parsed.phaseHistory || ledger.phaseHistory,
      exchangeCount: parsed.exchangeCount ?? ledger.exchangeCount + 1,
      diagnostic: {
        hasBeenAssessed: parsed.diagnostic?.hasBeenAssessed ?? ledger.diagnostic.hasBeenAssessed,
        level: parsed.diagnostic?.level ?? ledger.diagnostic.level,
        evidence: parsed.diagnostic?.evidence ?? ledger.diagnostic.evidence,
        readyFor: parsed.diagnostic?.readyFor ?? ledger.diagnostic.readyFor,
        misconceptions: parsed.diagnostic?.misconceptions ?? ledger.diagnostic.misconceptions,
      },
      sessionSummary: parsed.sessionSummary || ledger.sessionSummary,
      artifact: {
        inProgress: parsed.artifact?.inProgress ?? ledger.artifact.inProgress,
        type: parsed.artifact?.type ?? ledger.artifact.type,
        currentState: parsed.artifact?.currentState ?? ledger.artifact.currentState,
        iterationCount: Math.max(parsed.artifact?.iterationCount ?? 0, ledger.artifact.iterationCount),
        fourC: {
          context: (parsed.artifact?.fourC?.context ?? false) || ledger.artifact.fourC.context,
          constraints: (parsed.artifact?.fourC?.constraints ?? false) || ledger.artifact.fourC.constraints,
          command: (parsed.artifact?.fourC?.command ?? false) || ledger.artifact.fourC.command,
          criteria: (parsed.artifact?.fourC?.criteria ?? false) || ledger.artifact.fourC.criteria,
        },
      },
      remainingPhases: parsed.remainingPhases ?? ledger.remainingPhases,
      engagement: {
        energy: parsed.engagement?.energy ?? ledger.engagement.energy,
        notes: parsed.engagement?.notes ?? ledger.engagement.notes,
      },
      guidance: parsed.guidance ?? ledger.guidance,
      redirectCount: parsed.redirectCount ?? ledger.redirectCount,
    };
  } catch (error) {
    // Graceful fallback: just increment exchangeCount
    if (verbose) {
      console.log(`    [classifier error: ${error}]`);
    }
    return { ...ledger, exchangeCount: ledger.exchangeCount + 1 };
  }
}

// =============================================================================
// CONVERSATION ENGINE
// =============================================================================

let verbose = false;

function isDoneSignal(message: string): boolean {
  const signals = ["i'm done", "i'm finished", "that's all", "i'm good", "i'm all set", "stop here", "that's it for me"];
  const lowerMessage = message.toLowerCase().trim();

  // Short message with signal = likely real exit
  if (lowerMessage.split(" ").length < 20) {
    return signals.some(s => lowerMessage.includes(s));
  }

  // Signal at start of message = likely real exit
  if (signals.some(s => lowerMessage.startsWith(s))) {
    return true;
  }

  // Signal embedded in longer message = likely rhetorical
  return false;
}

async function runWeekConversation(
  persona: Persona,
  weekNumber: number,
  previousWeeks: WeekTranscript[],
  useClassifier: boolean
): Promise<WeekTranscript> {
  const weekConfig = getWeekConfig(weekNumber);
  const maxExchanges = weekConfig.maxExchanges;
  const targetLevel = persona.growthArc[weekNumber] || "unistructural";
  const previousSummary = buildPreviousWeeksSummary(persona, previousWeeks);

  let ledger = createFreshLedger(weekNumber);
  const exchanges: Exchange[] = [];
  const conversationHistory: { role: string; content: string }[] = [];

  // Step 1: Get Skippy's opening message
  const skippySystemPrompt = buildSkippyPrompt(persona, weekNumber, ledger);

  const openingResponse = await anthropic.messages.create({
    model: SKIPPY_MODEL,
    max_tokens: SKIPPY_MAX_TOKENS,
    temperature: 0.7,
    system: skippySystemPrompt,
    messages: [{ role: "user", content: "[START NEW CONVERSATION]" }],
  });

  let skippyMessage = openingResponse.content[0].type === "text" ? openingResponse.content[0].text : "";
  conversationHistory.push({ role: "assistant", content: skippyMessage });

  if (verbose) {
    console.log(`\n    SKIPPY: ${skippyMessage.slice(0, 120)}...`);
  }

  await delay(RATE_LIMIT_MS);

  // Step 2: Loop until termination
  for (let turn = 1; turn <= maxExchanges; turn++) {
    // (a) Persona responds
    const personaSystemPrompt = buildPersonaSystemPrompt(
      persona, weekNumber, targetLevel, previousSummary
    );

    // Build persona messages — full conversation so far
    const personaMessages: { role: "user" | "assistant"; content: string }[] = [];
    for (const msg of conversationHistory) {
      if (msg.role === "assistant") {
        // Skippy's messages appear as "user" to the persona (the tutor talking to them)
        personaMessages.push({ role: "user", content: msg.content });
      } else {
        // Persona's own previous messages
        personaMessages.push({ role: "assistant", content: msg.content });
      }
    }

    // If conversation is empty from persona's POV, add a user message
    if (personaMessages.length === 0 || personaMessages[personaMessages.length - 1].role !== "user") {
      // The last message should be from Skippy (as "user" for the persona)
    }

    const personaResponse = await anthropic.messages.create({
      model: PERSONA_MODEL,
      max_tokens: PERSONA_MAX_TOKENS,
      temperature: 0.8,
      system: personaSystemPrompt,
      messages: personaMessages,
    });

    const teacherMessage = personaResponse.content[0].type === "text" ? personaResponse.content[0].text : "";
    conversationHistory.push({ role: "user", content: teacherMessage });

    if (verbose) {
      console.log(`    ${persona.firstName.toUpperCase()}: ${teacherMessage.slice(0, 120)}${teacherMessage.length > 120 ? '...' : ''}`);
    }

    await delay(RATE_LIMIT_MS);

    // (b) Skippy responds
    const updatedSkippyPrompt = buildSkippyPrompt(persona, weekNumber, ledger);
    const skippyMessages: { role: "user" | "assistant"; content: string }[] = conversationHistory.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const skippyResponse = await anthropic.messages.create({
      model: SKIPPY_MODEL,
      max_tokens: SKIPPY_MAX_TOKENS,
      temperature: 0.7,
      system: updatedSkippyPrompt,
      messages: skippyMessages,
    });

    skippyMessage = skippyResponse.content[0].type === "text" ? skippyResponse.content[0].text : "";
    conversationHistory.push({ role: "assistant", content: skippyMessage });

    if (verbose) {
      console.log(`    SKIPPY: ${skippyMessage.slice(0, 120)}${skippyMessage.length > 120 ? '...' : ''}`);
    }

    exchanges.push({ turn, teacher: teacherMessage, skippy: skippyMessage });

    await delay(RATE_LIMIT_MS);

    // (c) Classifier updates ledger
    if (useClassifier) {
      ledger = await runOfflineClassifier(
        ledger, weekNumber, teacherMessage, skippyMessage, conversationHistory
      );

      if (verbose) {
        console.log(`    [ledger: phase=${ledger.currentPhase}, level=${ledger.diagnostic.level}, exchange=${ledger.exchangeCount}]`);
      }

      await delay(RATE_LIMIT_MS);
    } else {
      ledger = { ...ledger, exchangeCount: ledger.exchangeCount + 1 };
    }

    // (d) Check termination
    if (ledger.currentPhase === "BRIDGE") {
      if (verbose) console.log(`    [BRIDGE phase reached — ending conversation]`);
      break;
    }

    if (turn >= maxExchanges) {
      if (verbose) console.log(`    [Max exchanges (${maxExchanges}) reached]`);
      break;
    }

    // Check if the persona signaled they're done
    if (isDoneSignal(teacherMessage)) {
      if (verbose) console.log(`    [Persona signaled done]`);
      break;
    }
  }

  return {
    persona: persona.id,
    week: weekNumber,
    exchanges,
    finalLedger: ledger,
  };
}

// =============================================================================
// OUTPUT GENERATION
// =============================================================================

function formatTranscript(persona: Persona, transcript: WeekTranscript): string {
  const weekTitle = getModulePrompt(transcript.week)?.title || `Week ${transcript.week}`;
  const lines: string[] = [];

  lines.push(`# ${persona.name} — Week ${transcript.week}: ${weekTitle}`);
  lines.push('');
  lines.push(`**Persona:** ${persona.personality}`);
  lines.push(`**Subject:** ${persona.subject} | **Grades:** ${persona.gradeLevels.join(', ')}`);
  lines.push(`**AI Experience:** ${persona.aiExperience} | **Goal:** ${persona.primaryGoal}`);
  lines.push(`**Target Level:** ${persona.growthArc[transcript.week]}`);
  lines.push('');
  lines.push(`**Final Ledger State:**`);
  lines.push(`- Phase: ${transcript.finalLedger.currentPhase}`);
  lines.push(`- Diagnosed Level: ${transcript.finalLedger.diagnostic.level || 'not assessed'}`);
  lines.push(`- Exchanges: ${transcript.exchanges.length}`);
  lines.push(`- Engagement: ${transcript.finalLedger.engagement.energy}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Opening message from Skippy (stored as first assistant message but not in exchanges)
  // Exchanges start from turn 1 (after opening)

  for (const exchange of transcript.exchanges) {
    lines.push(`### Turn ${exchange.turn}`);
    lines.push('');
    lines.push(`**${persona.firstName}:** ${exchange.teacher}`);
    lines.push('');
    lines.push(`**Skippy:** ${exchange.skippy}`);
    lines.push('');
  }

  return lines.join('\n');
}

async function generateFeedbackReport(
  persona: Persona,
  transcripts: WeekTranscript[]
): Promise<string> {
  // Build a summary of all transcripts for this persona
  const transcriptSummaries = transcripts.map(t => {
    const excerpts = t.exchanges.slice(0, 3).map(e =>
      `  T: ${e.teacher.slice(0, 100)}...\n  S: ${e.skippy.slice(0, 100)}...`
    ).join('\n');

    return `### Week ${t.week}
Exchanges: ${t.exchanges.length}
Final phase: ${t.finalLedger.currentPhase}
Diagnosed level: ${t.finalLedger.diagnostic.level || 'not assessed'}
Engagement: ${t.finalLedger.engagement.energy}
Session summary: ${t.finalLedger.sessionSummary}

Sample exchanges:
${excerpts}`;
  }).join('\n\n');

  const evaluationPrompt = `You are evaluating Skippy, an AI tutor for teachers, based on simulated conversations with a specific teacher persona.

## Teacher Persona: ${persona.name}
- ${persona.personality}
- Subject: ${persona.subject}, Grades: ${persona.gradeLevels.join(', ')}
- AI Experience: ${persona.aiExperience}
- Goal: ${persona.primaryGoal} — ${persona.goalDetails}
- Expected growth arc: ${Object.entries(persona.growthArc).map(([w, l]) => `Week ${w}: ${l}`).join(', ')}

## Transcripts Summary
${transcriptSummaries}

## Evaluate Skippy's Performance

For each week, score 1-5 on these dimensions:
1. **Diagnostic Accuracy** — Did Skippy correctly identify their level?
2. **Level Adaptation** — Did language/approach match the diagnosed level?
3. **Phase Progression** — Clean transitions through DISCOVER→BUILD→REFINE→REFLECT→SAVE→BRIDGE?
4. **Artifact Quality** — Was an artifact built? Was it personalized to their context?
5. **Engagement Handling** — How did Skippy handle frustration, disengagement, or enthusiasm?
6. **Personalization** — Were subject, students, and goals referenced?

Then give an overall score 1-10 for this persona's full journey.

Format your response as a markdown report with:
- Per-week scores table
- Highlights (what worked well)
- Issues (what went wrong)
- Overall assessment
- Overall score`;

  const response = await anthropic.messages.create({
    model: EVALUATOR_MODEL,
    max_tokens: EVALUATOR_MAX_TOKENS,
    temperature: 0.3,
    messages: [{ role: "user", content: evaluationPrompt }],
  });

  const reportText = response.content[0].type === "text" ? response.content[0].text : "";

  return `# Feedback Report: ${persona.name}\n\n${reportText}`;
}

async function generateSummaryReport(
  allTranscripts: Map<string, WeekTranscript[]>,
  feedbackReports: Map<string, string>
): Promise<string> {
  const lines: string[] = [];
  lines.push('# Learner Agent Simulation — Summary Report');
  lines.push('');
  lines.push(`**Date:** ${new Date().toISOString().split('T')[0]}`);
  lines.push(`**Personas:** ${PERSONAS.map(p => p.name).join(', ')}`);
  lines.push('');

  // Stats
  lines.push('## Statistics');
  lines.push('');
  lines.push('| Persona | Weeks | Total Exchanges | Avg/Week |');
  lines.push('|---------|-------|-----------------|----------|');

  let totalExchanges = 0;
  for (const persona of PERSONAS) {
    const transcripts = allTranscripts.get(persona.id) || [];
    const exchanges = transcripts.reduce((sum, t) => sum + t.exchanges.length, 0);
    totalExchanges += exchanges;
    const avg = transcripts.length > 0 ? (exchanges / transcripts.length).toFixed(1) : '0';
    lines.push(`| ${persona.name} | ${transcripts.length} | ${exchanges} | ${avg} |`);
  }

  lines.push('');
  lines.push(`**Total exchanges across all personas:** ${totalExchanges}`);
  lines.push(`**Estimated cost:** ~$${(totalExchanges * 0.037).toFixed(2)}`);
  lines.push('');

  // Level progression tracking
  lines.push('## Level Progression');
  lines.push('');
  for (const persona of PERSONAS) {
    const transcripts = allTranscripts.get(persona.id) || [];
    lines.push(`### ${persona.name}`);
    lines.push(`Expected: ${Object.entries(persona.growthArc).map(([w, l]) => `W${w}:${l}`).join(' → ')}`);
    const actual = transcripts.map(t =>
      `W${t.week}:${t.finalLedger.diagnostic.level || '?'}`
    ).join(' → ');
    lines.push(`Actual:   ${actual}`);
    lines.push('');
  }

  // Phase completion tracking
  lines.push('## Phase Completion');
  lines.push('');
  lines.push('| Persona | Week | Final Phase | Exchanges |');
  lines.push('|---------|------|-------------|-----------|');
  for (const persona of PERSONAS) {
    const transcripts = allTranscripts.get(persona.id) || [];
    for (const t of transcripts) {
      lines.push(`| ${persona.firstName} | ${t.week} | ${t.finalLedger.currentPhase} | ${t.exchanges.length} |`);
    }
  }
  lines.push('');

  lines.push('## Individual Reports');
  lines.push('');
  lines.push('See individual feedback reports for detailed per-persona analysis.');

  return lines.join('\n');
}

// =============================================================================
// CLI & MAIN
// =============================================================================

function parseWeekRange(weekArg: string): number[] {
  if (weekArg.includes('-')) {
    const [start, end] = weekArg.split('-').map(Number);
    const weeks: number[] = [];
    for (let i = start; i <= end; i++) weeks.push(i);
    return weeks;
  }
  return [Number(weekArg)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const personaFilter = args.find(a => a.startsWith('--persona='))?.split('=')[1];
  const weekFilter = args.find(a => a.startsWith('--week='))?.split('=')[1];
  verbose = args.includes('--verbose');
  const useClassifier = !args.includes('--no-classifier');

  // Determine which personas and weeks to run
  let personas = PERSONAS;
  if (personaFilter) {
    personas = PERSONAS.filter(p => p.id === personaFilter || p.firstName.toLowerCase() === personaFilter.toLowerCase());
    if (personas.length === 0) {
      console.error(`Unknown persona: ${personaFilter}. Available: ${PERSONAS.map(p => p.id).join(', ')}`);
      process.exit(1);
    }
  }

  let weeks = [0, 1, 2, 3, 4, 5, 6];
  if (weekFilter) {
    weeks = parseWeekRange(weekFilter);
  }

  console.log('\n=== Learner Agent Simulation ===');
  console.log(`Personas: ${personas.map(p => p.name).join(', ')}`);
  console.log(`Weeks: ${weeks.join(', ')}`);
  console.log(`Classifier: ${useClassifier ? 'ON' : 'OFF'}`);
  console.log(`Verbose: ${verbose}`);
  console.log('================================\n');

  // Create output directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const reportDir = path.join(process.cwd(), 'reports', timestamp);
  const transcriptDir = path.join(reportDir, 'transcripts');
  const feedbackDir = path.join(reportDir, 'feedback');
  fs.mkdirSync(transcriptDir, { recursive: true });
  fs.mkdirSync(feedbackDir, { recursive: true });

  const allTranscripts = new Map<string, WeekTranscript[]>();
  const feedbackReports = new Map<string, string>();

  // Run conversations
  for (const persona of personas) {
    console.log(`\n--- ${persona.name} ---`);
    const personaTranscripts: WeekTranscript[] = [];

    for (const week of weeks) {
      const weekTitle = getModulePrompt(week)?.title || `Week ${week}`;
      process.stdout.write(`  Week ${week} (${weekTitle})... `);

      try {
        const transcript = await runWeekConversation(
          persona, week, personaTranscripts, useClassifier
        );

        personaTranscripts.push(transcript);

        // Write transcript file
        const transcriptContent = formatTranscript(persona, transcript);
        const transcriptFile = path.join(
          transcriptDir,
          `${persona.id}-week-${week}.md`
        );
        fs.writeFileSync(transcriptFile, transcriptContent);

        console.log(`${transcript.exchanges.length} exchanges, phase: ${transcript.finalLedger.currentPhase}, level: ${transcript.finalLedger.diagnostic.level || '?'}`);
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    }

    allTranscripts.set(persona.id, personaTranscripts);

    // Generate feedback report for this persona
    if (personaTranscripts.length > 0) {
      process.stdout.write(`  Generating feedback report... `);
      try {
        const report = await generateFeedbackReport(persona, personaTranscripts);
        feedbackReports.set(persona.id, report);

        const reportFile = path.join(
          feedbackDir,
          `${persona.id}-report.md`
        );
        fs.writeFileSync(reportFile, report);
        console.log('done');
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    }
  }

  // Generate summary report
  process.stdout.write('\nGenerating summary report... ');
  try {
    const summary = await generateSummaryReport(allTranscripts, feedbackReports);
    fs.writeFileSync(path.join(reportDir, 'summary.md'), summary);
    console.log('done');
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }

  console.log(`\nReports written to: ${reportDir}`);
  console.log('Done!\n');
}

main().catch(console.error);
