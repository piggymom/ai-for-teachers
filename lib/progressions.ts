/**
 * Developmental progressions for each week of the AI for Teachers course.
 * Based on SOLO taxonomy (Structure of Observed Learning Outcomes).
 * Used by the ledger system to diagnose teacher readiness and calibrate responses.
 */

export type ReadinessLevel =
  | "pre-structural"
  | "unistructural"
  | "multistructural"
  | "relational"
  | "extended-abstract";

export interface LevelDescriptor {
  level: ReadinessLevel;
  description: string; // What the learner CAN DO at this level
}

export interface WeekProgression {
  weekNumber: number;
  topic: string;
  levels: LevelDescriptor[];
  diagnosticProbe: string;
}

export const progressions: WeekProgression[] = [
  {
    weekNumber: 0,
    topic: "Getting Started",
    diagnosticProbe:
      "What made you decide to take this course? I'm curious what you're hoping AI might help you with — or what concerns brought you here.",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can articulate interest in learning about AI; brings initial questions or concerns",
      },
      {
        level: "unistructural",
        description:
          "Can identify a specific area where AI might help their teaching practice",
      },
      {
        level: "multistructural",
        description:
          "Can describe multiple potential applications and articulate specific goals for the course",
      },
      {
        level: "relational",
        description:
          "Can connect AI learning goals to broader professional development; sees course as part of larger growth trajectory",
      },
      {
        level: "extended-abstract",
        description:
          "Can articulate a vision for how AI literacy will transform their practice; ready to mentor others",
      },
    ],
  },
  {
    weekNumber: 1,
    topic: "Understanding AI",
    diagnosticProbe:
      "Here's a question I find interesting: if a colleague asked you 'how does ChatGPT actually work?', how would you explain it to them?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can articulate feelings and concerns about AI; brings real questions about its role in education",
      },
      {
        level: "unistructural",
        description:
          "Can describe AI as a tool for finding or generating information; connects it to familiar tools like search",
      },
      {
        level: "multistructural",
        description:
          "Can explain that AI learns from patterns in data; recognizes that training matters",
      },
      {
        level: "relational",
        description:
          "Can reason about why AI outputs vary in quality; applies judgment about when to trust outputs",
      },
      {
        level: "extended-abstract",
        description:
          "Can evaluate AI's usefulness relative to task framing; sees prompt design as a lever for quality",
      },
    ],
  },
  {
    weekNumber: 2,
    topic: "Prompting Fundamentals",
    diagnosticProbe:
      "When you've tried asking AI for help with something — or imagined doing it — what do you think makes the difference between getting something useful versus something useless?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can express a need or request to an AI tool; willing to experiment",
      },
      {
        level: "unistructural",
        description:
          "Can add specificity to requests; recognizes that detail affects output",
      },
      {
        level: "multistructural",
        description:
          "Can identify components of effective prompts (context, constraints, etc.); applies frameworks",
      },
      {
        level: "relational",
        description:
          "Can select and adapt prompt structures based on task type; explains why components matter",
      },
      {
        level: "extended-abstract",
        description:
          "Can design iterative prompt sequences; evaluates outputs against criteria and refines approach",
      },
    ],
  },
  {
    weekNumber: 3,
    topic: "Lesson Planning",
    diagnosticProbe:
      "Think about how you typically plan lessons. Where in that process do you think AI could actually help — and where do you think it probably can't?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can describe their lesson planning challenges; open to exploring AI assistance",
      },
      {
        level: "unistructural",
        description:
          "Can use AI to generate lesson ideas or activity suggestions",
      },
      {
        level: "multistructural",
        description:
          "Can provide context (standards, student needs) to get more relevant lesson outputs",
      },
      {
        level: "relational",
        description:
          "Can evaluate AI-generated lessons against pedagogical criteria; edits and adapts outputs",
      },
      {
        level: "extended-abstract",
        description:
          "Can design reusable lesson planning workflows; integrates AI into existing planning routines",
      },
    ],
  },
  {
    weekNumber: 4,
    topic: "Feedback & Assessment",
    diagnosticProbe:
      "When it comes to giving students feedback, what's the hardest part for you? And what would 'good enough' AI help with feedback actually look like?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can articulate feedback and assessment pain points; interested in efficiency gains",
      },
      {
        level: "unistructural",
        description:
          "Can use AI to draft feedback comments or assessment items",
      },
      {
        level: "multistructural",
        description:
          "Can provide rubrics, exemplars, or criteria to improve AI-generated feedback quality",
      },
      {
        level: "relational",
        description:
          "Can evaluate AI feedback for accuracy, tone, and developmental appropriateness; revises systematically",
      },
      {
        level: "extended-abstract",
        description:
          "Can design feedback workflows that preserve teacher voice while leveraging AI for scale",
      },
    ],
  },
  {
    weekNumber: 5,
    topic: "Communication & Admin",
    diagnosticProbe:
      "What's a communication task — emails, newsletters, parent updates — that you'd love to spend less time on? What makes it tedious?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can identify communication tasks that consume time; open to templates",
      },
      {
        level: "unistructural",
        description:
          "Can use AI to draft emails, newsletters, or parent communications",
      },
      {
        level: "multistructural",
        description:
          "Can customize tone, reading level, and format for different audiences",
      },
      {
        level: "relational",
        description:
          "Can maintain authentic voice while using AI-generated drafts; adapts for sensitive contexts",
      },
      {
        level: "extended-abstract",
        description:
          "Can build reusable communication templates; systematizes routine correspondence",
      },
    ],
  },
  {
    weekNumber: 6,
    topic: "Building Your Practice",
    diagnosticProbe:
      "Looking back at the past five weeks, what's actually stuck? What are you realistically going to keep doing?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Can reflect on course learnings; has experimented with AI tools",
      },
      {
        level: "unistructural",
        description:
          "Can identify 1-2 AI workflows they want to continue using",
      },
      {
        level: "multistructural",
        description:
          "Can describe when and how they'll use specific AI tools in their practice",
      },
      {
        level: "relational",
        description:
          "Can anticipate obstacles and plan adaptations; connects AI use to professional goals",
      },
      {
        level: "extended-abstract",
        description:
          "Can mentor colleagues on AI integration; continuously evaluates and evolves their practice",
      },
    ],
  },
];

export function getProgression(weekNumber: number): WeekProgression | undefined {
  return progressions.find((p) => p.weekNumber === weekNumber);
}

export function formatProgressionForClassifier(weekNumber: number): string {
  const progression = getProgression(weekNumber);
  if (!progression) return "";

  return progression.levels
    .map((l) => `- ${l.level.toUpperCase()}: ${l.description}`)
    .join("\n");
}

export function getDiagnosticProbe(weekNumber: number): string | null {
  const progression = getProgression(weekNumber);
  return progression?.diagnosticProbe || null;
}
