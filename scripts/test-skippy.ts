import { config } from "dotenv";
config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import { SKIPPY_SYSTEM_PROMPT } from "../lib/skippy";
import { WEEK_2_SYSTEM_PROMPT, WEEK_2_OPENING_MESSAGE } from "../lib/prompts/week-2";
import { formatLedgerForPrompt, type ConversationLedger, type ConversationPhase, type EngagementEnergy, type ArtifactType } from "../lib/ledger";
import { buildProfileContext, type UserProfileData } from "../lib/profile";
import { getModulePrompt } from "../lib/modules";

const anthropic = new Anthropic();

// Model to use for tests (should match production)
const TEST_MODEL = "claude-sonnet-4-20250514";
const TEST_MAX_TOKENS = 1500;

// ============================================
// TYPES
// ============================================

interface TestProfile {
  name: string;
  subjects: string[];
  gradeLevels: string[];
  primaryGoal: string;
  timeDrains: string[];
  goalDetails?: string;
  aiExperience?: string;
}

interface TestLedgerInput {
  currentPhase: string;
  diagnosticLevel: string | null;
  exchangeCount: number;
  sessionSummary?: string;
  artifactInProgress?: boolean;
  artifactType?: string | null;
  artifactState?: string | null;
  artifactIterations?: number;
  fourC?: { context: boolean; constraints: boolean; command: boolean; criteria: boolean };
  redirectCount?: number;
  engagementEnergy?: string;
  engagementNotes?: string | null;
  guidance?: string | null;
  phaseHistory?: string[];
  diagnosticEvidence?: string | null;
  diagnosticReadyFor?: string | null;
  misconceptions?: string[];
}

interface TestExpectations {
  shouldContain?: string[];
  shouldNotContain?: string[];
  shouldAskQuestion?: boolean;
  shouldNotAskQuestion?: boolean;
  shouldWrapUp?: boolean;
  shouldAcknowledgeMistake?: boolean;
  shouldPushDeeper?: boolean;
  shouldUseAnalogy?: boolean;
  shouldMentionTesting?: boolean;
  shouldReferenceProfile?: boolean;
  maxResponseLength?: number;
}

interface TestScenario {
  name: string;
  category: string;
  weekNumber: number;
  profile: TestProfile;
  ledger: TestLedgerInput;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  userMessage: string;
  expectations: TestExpectations;
}

// ============================================
// HELPERS: Build real prompt from test data
// ============================================

function buildTestLedger(input: TestLedgerInput): ConversationLedger {
  const allPhases: ConversationPhase[] = ["DISCOVER", "BUILD", "REFINE", "REFLECT", "SAVE", "BRIDGE"];
  const currentPhase = input.currentPhase as ConversationPhase;
  const completedIndex = allPhases.indexOf(currentPhase);
  const remainingPhases = allPhases.slice(completedIndex + 1);

  return {
    id: "test-ledger-id",
    userId: "test-user-id",
    weekNumber: 2,
    currentPhase,
    phaseHistory: input.phaseHistory || [currentPhase],
    exchangeCount: input.exchangeCount,
    diagnostic: {
      hasBeenAssessed: input.diagnosticLevel !== null,
      level: input.diagnosticLevel,
      evidence: input.diagnosticEvidence || null,
      readyFor: input.diagnosticReadyFor || null,
      misconceptions: input.misconceptions || [],
    },
    sessionSummary: input.sessionSummary || "",
    artifact: {
      inProgress: input.artifactInProgress || false,
      type: (input.artifactType as ArtifactType) || null,
      currentState: input.artifactState || null,
      iterationCount: input.artifactIterations || 0,
      fourC: input.fourC || { context: false, constraints: false, command: false, criteria: false },
    },
    remainingPhases: remainingPhases.map(String),
    engagement: {
      energy: (input.engagementEnergy as EngagementEnergy) || "medium",
      notes: input.engagementNotes || null,
    },
    guidance: input.guidance || null,
    redirectCount: input.redirectCount || 0,
  };
}

function buildTestProfileContext(profile: TestProfile): string {
  const profileData: UserProfileData = {
    role: "Classroom Teacher",
    gradeLevels: profile.gradeLevels,
    subjects: profile.subjects,
    aiExperienceLevel: profile.aiExperience || "some",
    biggestTimeDrains: profile.timeDrains,
    primaryGoal: profile.primaryGoal,
    goalDetails: profile.goalDetails || "",
  };
  return buildProfileContext(profileData);
}

function buildFullTestPrompt(scenario: TestScenario): string {
  const parts: string[] = [];

  // 1. Global Skippy prompt
  parts.push(SKIPPY_SYSTEM_PROMPT);

  // 2. Week-specific prompt
  const modulePrompt = getModulePrompt(scenario.weekNumber);
  if (modulePrompt) {
    parts.push(`\n## This week's focus\n${modulePrompt.prompt}`);
  }

  // 3. Opening message template
  const openingMessage = modulePrompt?.openingMessage || "";
  const name = scenario.profile.name.split(" ")[0];
  const openingTemplate = openingMessage.replace(/\{\{name\}\}/g, name);
  if (openingTemplate) {
    parts.push(`\n## Your opening message for this week\nWhen starting a new conversation, say exactly this:\n\n"${openingTemplate}"`);
  }

  // 4. Profile context
  const profileContext = buildTestProfileContext(scenario.profile);
  parts.push(`\n## About this teacher\n${profileContext}`);

  // 5. Ledger context
  const ledger = buildTestLedger(scenario.ledger);
  ledger.weekNumber = scenario.weekNumber;
  const ledgerContext = formatLedgerForPrompt(ledger);
  parts.push(`\n\n${ledgerContext}`);

  return parts.join("\n");
}

// ============================================
// DEFAULT PROFILE & LEDGER
// ============================================

const DEFAULT_PROFILE: TestProfile = {
  name: "Test Teacher",
  subjects: ["History", "Social Studies"],
  gradeLevels: ["10th"],
  primaryGoal: "better_materials",
  timeDrains: ["Differentiation", "Lesson planning"],
  goalDetails: "I have students with IEPs and multilingual learners",
  aiExperience: "some",
};

const DEFAULT_LEDGER: TestLedgerInput = {
  currentPhase: "BUILD",
  diagnosticLevel: "multistructural",
  exchangeCount: 6,
  sessionSummary: "Teacher is working on differentiated materials for 10th grade history. Has provided context about their students.",
};

// ============================================
// TEST SCENARIOS
// ============================================

const TEST_SCENARIOS: TestScenario[] = [

  // ==========================================
  // CATEGORY: COMPLETION DETECTION
  // ==========================================

  {
    name: "Completion: 'I think I'm done'",
    category: "completion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT", exchangeCount: 12 },
    conversationHistory: [
      { role: "assistant", content: "What did you notice about how the 4C framework helped structure your prompt?" },
      { role: "user", content: "I noticed being specific about context really helps get better output." },
    ],
    userMessage: "I think I'm done for today.",
    expectations: {
      shouldNotAskQuestion: true,
      shouldWrapUp: true,
      shouldNotContain: ["What else", "Can you tell me", "How would you", "Let's explore"],
    },
  },

  {
    name: "Completion: 'I'd like to stop'",
    category: "completion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "BUILD", exchangeCount: 8 },
    conversationHistory: [],
    userMessage: "I think that is probably where I'd like to stop.",
    expectations: {
      shouldNotAskQuestion: true,
      shouldWrapUp: true,
      shouldNotContain: ["Perfect. Let's", "Great! Now let's", "Next, we"],
    },
  },

  {
    name: "Completion: 'That's all I need'",
    category: "completion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFINE", exchangeCount: 10 },
    conversationHistory: [],
    userMessage: "That's all I need for now, thanks.",
    expectations: {
      shouldNotAskQuestion: true,
      shouldWrapUp: true,
    },
  },

  {
    name: "Completion: 'I'm finished'",
    category: "completion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT", exchangeCount: 14 },
    conversationHistory: [],
    userMessage: "I'm finished. I've learned what I need.",
    expectations: {
      shouldNotAskQuestion: true,
      shouldWrapUp: true,
      shouldNotContain: ["before we wrap", "one more thing", "What was your biggest"],
    },
  },

  // ==========================================
  // CATEGORY: FRUSTRATION HANDLING
  // ==========================================

  {
    name: "Frustration: 'I already did this'",
    category: "frustration",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: DEFAULT_LEDGER,
    conversationHistory: [
      { role: "assistant", content: "Let's define the context for your prompt. What background information should AI know?" },
    ],
    userMessage: "I already did this. We went through context earlier.",
    expectations: {
      shouldAcknowledgeMistake: true,
      shouldNotContain: ["Let's start with", "First, tell me", "What context"],
    },
  },

  {
    name: "Frustration: 'Why are we back at the start?'",
    category: "frustration",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, exchangeCount: 10 },
    conversationHistory: [
      { role: "user", content: "I gave you context, constraints, command, and criteria already." },
      { role: "assistant", content: "Great! Let's now think about the context for your prompt." },
    ],
    userMessage: "Why are we back at the start? I already gave you all four C's.",
    expectations: {
      shouldAcknowledgeMistake: true,
      shouldNotContain: ["Let me explain"],
    },
  },

  {
    name: "Frustration: 'You're just repeating what I said'",
    category: "frustration",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: DEFAULT_LEDGER,
    conversationHistory: [],
    userMessage: "You're just repeating back what I said to you. Can you actually add something?",
    expectations: {
      shouldAcknowledgeMistake: true,
      shouldNotContain: ["you mentioned", "you said", "as you noted"],
    },
  },

  {
    name: "Frustration: 'This doesn't feel helpful'",
    category: "frustration",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: DEFAULT_LEDGER,
    conversationHistory: [],
    userMessage: "I'm confused about what we're doing. This doesn't feel helpful.",
    expectations: {
      shouldAcknowledgeMistake: true,
      shouldAskQuestion: true,
    },
  },

  // ==========================================
  // CATEGORY: DISENGAGEMENT DETECTION
  // ==========================================

  {
    name: "Disengagement: One-word response 'Okay'",
    category: "disengagement",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "BUILD", exchangeCount: 8 },
    conversationHistory: [
      { role: "user", content: "I want to differentiate for reading levels - high, medium, and low. Each should have vocabulary support and comprehension questions aligned to that level." },
      { role: "assistant", content: "That's a clear set of constraints. Now let's think about the command - what exactly should AI do with this?" },
    ],
    userMessage: "Okay.",
    expectations: {
      shouldNotContain: ["Great!", "Perfect!", "Excellent!"],
    },
  },

  {
    name: "Disengagement: One-word response 'Sure'",
    category: "disengagement",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT" },
    conversationHistory: [
      { role: "assistant", content: "What did you notice about how the constraints shaped the output?" },
    ],
    userMessage: "Sure.",
    expectations: {
      shouldNotContain: ["Great observation", "Exactly", "You've captured"],
    },
  },

  // ==========================================
  // CATEGORY: LEVEL-APPROPRIATE BEHAVIOR
  // ==========================================

  {
    name: "Level: Pre-structural - needs scaffolding",
    category: "level",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "pre-structural", currentPhase: "DISCOVER", exchangeCount: 2 },
    conversationHistory: [],
    userMessage: "I tried ChatGPT once and it just gave me garbage. I don't know what I'm doing wrong.",
    expectations: {
      shouldUseAnalogy: true,
      shouldNotContain: ["Let's dive into"],
    },
  },

  {
    name: "Level: Unistructural - knows 'be specific'",
    category: "level",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "unistructural", currentPhase: "DISCOVER", exchangeCount: 2 },
    conversationHistory: [],
    userMessage: "I've learned that being more specific helps. The more detail I give, the better results I get.",
    expectations: {
      shouldNotContain: ["AI works by", "Let me explain the basics"],
    },
  },

  {
    name: "Level: Multistructural - knows components",
    category: "level",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "multistructural", currentPhase: "BUILD" },
    conversationHistory: [],
    userMessage: "I usually give context about my students, tell it what to avoid, and specify what I want. Works most of the time.",
    expectations: {
      shouldNotContain: ["Let me explain", "The components are", "Here's how it works"],
    },
  },

  {
    name: "Level: Relational - peer dialogue",
    category: "level",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "relational", currentPhase: "BUILD" },
    conversationHistory: [],
    userMessage: "I've been iterating on prompts for a while. I find that constraints are tricky - sometimes less is more, depending on the task.",
    expectations: {
      shouldNotContain: ["Let me explain", "You should", "The first step", "Here's how"],
    },
  },

  {
    name: "Level: Extended abstract - learn from them",
    category: "level",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "extended-abstract", currentPhase: "BUILD" },
    conversationHistory: [],
    userMessage: "I've developed a system for prompt testing - I run the same prompt three times and compare outputs to check for consistency. Then I iterate based on where it fails.",
    expectations: {
      shouldNotContain: ["should", "need to", "Let me show you", "The framework"],
    },
  },

  // ==========================================
  // CATEGORY: SHALLOW REFLECTION HANDLING
  // ==========================================

  {
    name: "Shallow reflection: 'Looks good'",
    category: "reflection",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT", exchangeCount: 12 },
    conversationHistory: [
      { role: "assistant", content: "Looking at your prompt, what did you notice about how the components work together?" },
    ],
    userMessage: "Looks good.",
    expectations: {
      shouldPushDeeper: true,
      shouldNotContain: ["Great!", "Excellent!", "Perfect!"],
    },
  },

  {
    name: "Shallow reflection: 'It works'",
    category: "reflection",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT" },
    conversationHistory: [
      { role: "assistant", content: "What made the biggest difference in getting useful output from AI?" },
    ],
    userMessage: "It works.",
    expectations: {
      shouldPushDeeper: true,
      shouldAskQuestion: true,
      shouldNotContain: ["Fantastic", "Amazing", "You got it"],
    },
  },

  {
    name: "Shallow reflection: 'Makes sense'",
    category: "reflection",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT" },
    conversationHistory: [
      { role: "assistant", content: "How would you explain the 4C framework to a colleague?" },
    ],
    userMessage: "Makes sense.",
    expectations: {
      shouldPushDeeper: true,
    },
  },

  {
    name: "Genuine reflection: Should accept and move on",
    category: "reflection",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFLECT" },
    conversationHistory: [
      { role: "assistant", content: "What did you notice about the prompting process?" },
    ],
    userMessage: "I noticed that being clear about constraints up front saves a lot of back-and-forth. Before, I would just describe what I wanted and then spend five rounds fixing it. Now I think about what to avoid from the start.",
    expectations: {
      shouldNotContain: ["tell me more", "can you explain", "what do you mean"],
      shouldWrapUp: true,
    },
  },

  // ==========================================
  // CATEGORY: VALUE-ADD (NOT A MIRROR)
  // ==========================================

  {
    name: "Value-add: Don't just summarize",
    category: "value",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: DEFAULT_LEDGER,
    conversationHistory: [],
    userMessage: "I want to create differentiated reading materials for my 10th graders. I have kids with IEPs and multilingual learners. The topic is World War II.",
    expectations: {
      shouldNotContain: ["So you want to create differentiated", "You mentioned that you"],
    },
  },

  {
    name: "Value-add: Teach something new",
    category: "value",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, diagnosticLevel: "unistructural" },
    conversationHistory: [
      { role: "user", content: "I know I need to be specific. What else matters?" },
    ],
    userMessage: "What makes a prompt actually good?",
    expectations: {
      shouldContain: ["4C|context|constraints|command|criteria"],
    },
  },

  // ==========================================
  // CATEGORY: CONFUSION DETECTION
  // ==========================================

  {
    name: "Confusion: 'What are we doing?'",
    category: "confusion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, exchangeCount: 8 },
    conversationHistory: [],
    userMessage: "I'm a little confused by the activity. What are we actually trying to do here?",
    expectations: {
      shouldContain: ["goal", "prompt"],
      shouldAskQuestion: true,
    },
  },

  {
    name: "Confusion: 'How does this relate?'",
    category: "confusion",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: DEFAULT_LEDGER,
    conversationHistory: [
      { role: "assistant", content: "Let's choose an excerpt from the Reichstag speech to adapt." },
    ],
    userMessage: "How is this going to relate back to prompting fundamentals? I feel like we're going down a rabbit hole.",
    expectations: {
      shouldContain: ["prompting|prompt", "skill|framework|approach|toolkit"],
      shouldNotContain: ["Let's continue", "Next we'll", "The excerpt"],
    },
  },

  // ==========================================
  // CATEGORY: REDIRECT TO TESTING
  // ==========================================

  {
    name: "Testing: Suggest external testing when 4C complete",
    category: "testing",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: {
      ...DEFAULT_LEDGER,
      currentPhase: "REFINE",
      fourC: { context: true, constraints: true, command: true, criteria: true },
      artifactInProgress: true,
      artifactType: "prompt_template",
      artifactState: "CONTEXT: 10th grade history...\nCONSTRAINTS: 3 reading levels...\nCOMMAND: Adapt the speech...\nCRITERIA: Age-appropriate...",
    },
    conversationHistory: [
      { role: "user", content: "CONTEXT: 10th grade history, students with IEPs and MLLs. CONSTRAINTS: 3 reading levels, highlight key terms. COMMAND: Adapt the speech excerpt. CRITERIA: Age-appropriate, comprehension questions for each level." },
    ],
    userMessage: "I think that covers all four C's. What now?",
    expectations: {
      shouldMentionTesting: true,
      shouldNotContain: ["Let me generate", "Here's the output", "I'll create"],
    },
  },

  // ==========================================
  // CATEGORY: PROFILE PERSONALIZATION
  // ==========================================

  {
    name: "Personalization: Use their subject area",
    category: "personalization",
    weekNumber: 2,
    profile: { ...DEFAULT_PROFILE, subjects: ["Chemistry"], timeDrains: ["Lab reports"] },
    ledger: { ...DEFAULT_LEDGER, currentPhase: "BUILD" },
    conversationHistory: [],
    userMessage: "What should I focus on for my first prompt?",
    expectations: {
      shouldReferenceProfile: true,
    },
  },

  {
    name: "Personalization: Reference their time drains",
    category: "personalization",
    weekNumber: 2,
    profile: { ...DEFAULT_PROFILE, timeDrains: ["Grading essays", "Parent emails"] },
    ledger: { ...DEFAULT_LEDGER, currentPhase: "BUILD" },
    conversationHistory: [
      { role: "assistant", content: "Let's build a prompt for something that takes up your time." },
    ],
    userMessage: "What do you suggest?",
    expectations: {
      shouldReferenceProfile: true,
    },
  },

  // ==========================================
  // CATEGORY: REPETITION GUARD
  // ==========================================

  {
    name: "Repetition: Don't repeat full artifact",
    category: "repetition",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "REFINE" },
    conversationHistory: [
      { role: "assistant", content: "Here's your prompt template:\n\nCONTEXT: 10th grade history with diverse learners\nCONSTRAINTS: 3 reading levels, highlight vocab\nCOMMAND: Adapt the Reichstag speech\nCRITERIA: Comprehension questions per level" },
      { role: "user", content: "Looks good!" },
      { role: "assistant", content: "Great! Here's your prompt template again:\n\nCONTEXT: 10th grade history with diverse learners\nCONSTRAINTS: 3 reading levels..." },
    ],
    userMessage: "You don't need to keep reading the whole thing to me.",
    expectations: {
      shouldAcknowledgeMistake: true,
      shouldNotContain: ["CONTEXT:", "CONSTRAINTS:", "COMMAND:", "CRITERIA:"],
    },
  },

  // ==========================================
  // CATEGORY: WEEK 0 (ONBOARDING)
  // ==========================================

  {
    name: "Week 0: Don't teach, just welcome",
    category: "week0",
    weekNumber: 0,
    profile: DEFAULT_PROFILE,
    ledger: { currentPhase: "DISCOVER", diagnosticLevel: null, exchangeCount: 2 },
    conversationHistory: [
      { role: "assistant", content: "Welcome! What are you hoping AI might help you with in your teaching?" },
    ],
    userMessage: "I want to differentiate materials more easily.",
    expectations: {
      shouldNotContain: ["4C", "context constraints command criteria"],
    },
  },

  {
    name: "Week 0: Respect stop signal",
    category: "week0",
    weekNumber: 0,
    profile: DEFAULT_PROFILE,
    ledger: { currentPhase: "DISCOVER", diagnosticLevel: null, exchangeCount: 3 },
    conversationHistory: [],
    userMessage: "I'd like to stop here for now.",
    expectations: {
      shouldNotAskQuestion: true,
      shouldWrapUp: true,
      shouldNotContain: ["What about", "Before you go", "One more"],
    },
  },

  // ==========================================
  // CATEGORY: ARTIFACT TRACKING
  // ==========================================

  {
    name: "Artifact: Recognize when 4C is complete",
    category: "artifact",
    weekNumber: 2,
    profile: DEFAULT_PROFILE,
    ledger: { ...DEFAULT_LEDGER, currentPhase: "BUILD" },
    conversationHistory: [],
    userMessage: "CONTEXT: I teach 10th grade history with diverse learners. CONSTRAINTS: Three reading levels, highlight vocabulary. COMMAND: Adapt the Reichstag speech excerpt into three versions. CRITERIA: Each version should have comprehension questions appropriate to the level.",
    expectations: {
      shouldNotContain: ["What about context", "Let's add constraints", "What criteria"],
    },
  },
];

// ============================================
// TEST RUNNER
// ============================================

async function runTest(scenario: TestScenario): Promise<{
  passed: boolean;
  response: string;
  failures: string[];
  warnings: string[];
}> {
  const systemPrompt = buildFullTestPrompt(scenario);

  const messages = [
    ...scenario.conversationHistory,
    { role: "user" as const, content: scenario.userMessage },
  ];

  const response = await anthropic.messages.create({
    model: TEST_MODEL,
    max_tokens: TEST_MAX_TOKENS,
    temperature: 0.7,
    system: systemPrompt,
    messages: messages,
  });

  const responseText = response.content[0].type === "text" ? response.content[0].text : "";

  const failures: string[] = [];
  const warnings: string[] = [];
  const responseLower = responseText.toLowerCase();

  // Check expectations
  if (scenario.expectations.shouldNotContain) {
    for (const phrase of scenario.expectations.shouldNotContain) {
      if (responseLower.includes(phrase.toLowerCase())) {
        failures.push(`Should NOT contain "${phrase}"`);
      }
    }
  }

  if (scenario.expectations.shouldContain) {
    for (const phrase of scenario.expectations.shouldContain) {
      // Support OR patterns with "|" (e.g. "4C|context|constraints")
      if (phrase.includes("|")) {
        const alternatives = phrase.split("|");
        const found = alternatives.some(alt => responseLower.includes(alt.toLowerCase()));
        if (!found) {
          failures.push(`Should contain one of: "${alternatives.join('", "')}"`);
        }
      } else if (!responseLower.includes(phrase.toLowerCase())) {
        failures.push(`Should contain "${phrase}"`);
      }
    }
  }

  if (scenario.expectations.shouldNotAskQuestion) {
    if (responseText.includes("?")) {
      failures.push(`Should NOT ask a question (found "?" in response)`);
    }
  }

  if (scenario.expectations.shouldAskQuestion) {
    if (!responseText.includes("?")) {
      failures.push("Should ask a question");
    }
  }

  if (scenario.expectations.shouldAcknowledgeMistake) {
    const ackPhrases = ["sorry", "apolog", "right", "you're right", "mistake", "my bad", "let me", "fair point", "good point", "hear you"];
    const hasAck = ackPhrases.some(p => responseLower.includes(p));
    if (!hasAck) {
      failures.push("Should acknowledge mistake/correction");
    }
  }

  if (scenario.expectations.shouldPushDeeper) {
    const pushPhrases = ["what", "why", "how", "tell me", "explain", "specifically", "curious", "which", "walk me"];
    const hasPush = pushPhrases.some(p => responseLower.includes(p));
    if (!hasPush) {
      failures.push("Should push for deeper reflection");
    }
  }

  if (scenario.expectations.shouldUseAnalogy) {
    const analogyPhrases = ["like", "think of", "imagine", "similar to", "just as", "same way", "analogy", "picture"];
    const hasAnalogy = analogyPhrases.some(p => responseLower.includes(p));
    if (!hasAnalogy) {
      warnings.push("Could use an analogy for pre-structural learner");
    }
  }

  if (scenario.expectations.shouldMentionTesting) {
    const testPhrases = ["test", "try", "chatgpt", "gemini", "claude", "paste", "run it", "see what you get"];
    const hasTest = testPhrases.some(p => responseLower.includes(p));
    if (!hasTest) {
      failures.push("Should mention testing in external AI tool");
    }
  }

  if (scenario.expectations.shouldReferenceProfile) {
    const profile = scenario.profile;
    const profileTerms = [...profile.subjects, ...profile.timeDrains].map(t => t.toLowerCase());
    const hasProfileRef = profileTerms.some(t => responseLower.includes(t));
    if (!hasProfileRef) {
      failures.push(`Should reference profile (subjects: ${profile.subjects}, drains: ${profile.timeDrains})`);
    }
  }

  if (scenario.expectations.shouldWrapUp) {
    const wrapPhrases = ["see you", "next time", "good luck", "take care", "great work", "nice work", "well done", "saved", "artifact", "keep", "try it", "good session", "here's your"];
    const hasWrap = wrapPhrases.some(p => responseLower.includes(p));
    if (!hasWrap) {
      warnings.push("Could have clearer wrap-up language");
    }
  }

  if (scenario.expectations.maxResponseLength) {
    if (responseText.length > scenario.expectations.maxResponseLength) {
      warnings.push(`Response too long: ${responseText.length} chars (max ${scenario.expectations.maxResponseLength})`);
    }
  }

  return {
    passed: failures.length === 0,
    response: responseText,
    failures,
    warnings,
  };
}

// ============================================
// MAIN
// ============================================

async function runAllTests() {
  const filterCategory = process.argv.find(a => a.startsWith("--category="))?.split("=")[1];
  const filterName = process.argv.find(a => a.startsWith("--name="))?.split("=")[1];
  const verbose = process.argv.includes("--verbose");

  let scenarios = TEST_SCENARIOS;
  if (filterCategory) {
    scenarios = scenarios.filter(s => s.category === filterCategory);
  }
  if (filterName) {
    scenarios = scenarios.filter(s => s.name.toLowerCase().includes(filterName.toLowerCase()));
  }

  console.log("\n🧪 Running Skippy Test Suite");
  console.log(`   Model: ${TEST_MODEL}`);
  console.log(`   Tests: ${scenarios.length}`);
  console.log("=".repeat(60) + "\n");

  let passed = 0;
  let failed = 0;
  let totalWarnings = 0;

  const categories = [...new Set(scenarios.map(s => s.category))];

  for (const category of categories) {
    const categoryTests = scenarios.filter(s => s.category === category);
    console.log(`\n📁 ${category.toUpperCase()}\n`);

    for (const scenario of categoryTests) {
      process.stdout.write(`  ${scenario.name}... `);

      try {
        const result = await runTest(scenario);

        if (result.passed) {
          console.log(`✅ PASSED`);
          if (result.warnings.length > 0) {
            result.warnings.forEach(w => console.log(`     ⚠️  ${w}`));
            totalWarnings += result.warnings.length;
          }
          if (verbose) {
            console.log(`     📝 "${result.response.slice(0, 120)}..."\n`);
          }
          passed++;
        } else {
          console.log(`❌ FAILED`);
          console.log(`     📝 "${result.response.slice(0, 150)}..."`);
          result.failures.forEach(f => console.log(`     ❌ ${f}`));
          if (result.warnings.length > 0) {
            result.warnings.forEach(w => console.log(`     ⚠️  ${w}`));
            totalWarnings += result.warnings.length;
          }
          console.log();
          failed++;
        }
      } catch (error) {
        console.log(`💥 ERROR: ${error}`);
        failed++;
      }

      // Rate limiting — avoid hitting API too hard
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed, ${totalWarnings} warnings`);
  console.log(`   Pass rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
