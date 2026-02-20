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
          "Expresses vague interest or external motivation (e.g., 'my principal told me'); cannot identify specific AI applications for their teaching",
      },
      {
        level: "unistructural",
        description:
          "Can identify ONE specific area where AI might help their teaching",
      },
      {
        level: "multistructural",
        description:
          "Can name multiple potential AI applications and articulate specific course goals",
      },
      {
        level: "relational",
        description:
          "Connects AI learning to broader professional trajectory; sees course as part of larger growth vision",
      },
      {
        level: "extended-abstract",
        description:
          "Articulates a vision for AI integration that includes helping colleagues or shaping school/department practice",
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
          "Can list multiple components of how AI works (training data, prediction, not retrieval) but describes WHAT without explaining WHY they interact or WHEN different approaches apply",
      },
      {
        level: "relational",
        description:
          "Can explain WHY AI works for some tasks and not others; articulates WHEN to trust outputs and WHEN to verify; sees relationships between input specificity and output quality",
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
          "Can apply the 4C components to a real task with minimal scaffolding; includes appropriate content in each C but doesn't yet evaluate which components matter most for a given task type. May list all 4C mechanically without adapting emphasis to task.",
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
    topic: "Differentiation with AI",
    diagnosticProbe:
      "When you've differentiated materials for diverse learners, what made it effective or ineffective?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Knows differentiation matters but creates one version for all; unsure how to vary systematically",
      },
      {
        level: "unistructural",
        description:
          "Can identify ONE dimension to vary (e.g., reading level) but applies mechanically without checking rigor",
      },
      {
        level: "multistructural",
        description:
          "Can vary multiple dimensions and map students to groups; applies variation systematically across groups",
      },
      {
        level: "relational",
        description:
          "Understands access vs. rigor distinction; specifies what must NOT change; catches when AI simplifies thinking",
      },
      {
        level: "extended-abstract",
        description:
          "Designs differentiation systems using UDL principles; helps colleagues build sustainable variation workflows",
      },
    ],
  },
  {
    weekNumber: 6,
    topic: "Integration & Ethics",
    diagnosticProbe:
      "As you think about using AI in your teaching going forward, what principles guide your decisions about when to use it and when not to?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Wants to use AI but can't articulate guiding principles; decisions feel ad hoc",
      },
      {
        level: "unistructural",
        description:
          "Can name ONE principle (e.g., 'always check the output') but applies it mechanically without nuance",
      },
      {
        level: "multistructural",
        description:
          "Can list multiple principles and practices; has a mental checklist but doesn't see how they connect",
      },
      {
        level: "relational",
        description:
          "Articulates how principles interact; can reason through tradeoffs; sees policy as a coherent system",
      },
      {
        level: "extended-abstract",
        description:
          "Reasons about systemic implications; considers student AI literacy; ready to help colleagues develop their own frameworks",
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
