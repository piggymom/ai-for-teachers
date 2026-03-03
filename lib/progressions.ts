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
          "Can apply the 4C components to a real task with minimal scaffolding; includes appropriate content in each C but treats all four as equally important regardless of task type. Applies 4C mechanically rather than adapting emphasis — e.g., doesn't yet recognize that brainstorming needs loose Constraints while feedback needs tight Criteria.",
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
    topic: "Lesson Planning with AI",
    diagnosticProbe:
      "Walk me through how you currently plan a lesson. What's your process, and where does it feel inefficient?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Plans lessons from scratch each time; hasn't considered AI as planning tool; or tried AI once and gave up",
      },
      {
        level: "unistructural",
        description:
          "Can use AI for ONE planning task (e.g., generate activities) but treats it as one-shot — no iteration",
      },
      {
        level: "multistructural",
        description:
          "Uses AI for multiple planning tasks; iterates when output isn't right but through trial-and-error, not systematic refinement",
      },
      {
        level: "relational",
        description:
          "Understands prompting as conversation; can diagnose WHY output failed and write targeted follow-ups; maintains pedagogical control intentionally",
      },
      {
        level: "extended-abstract",
        description:
          "Applies iteration principles to new planning contexts without scaffolding. Tests prompts across different lesson types to validate the approach. Articulates when chunking helps vs. when a single prompt works better. Could walk a colleague through the iteration process.",
      },
    ],
  },
  {
    weekNumber: 4,
    topic: "Feedback & Assessment",
    diagnosticProbe:
      "When you give feedback on student work, what makes it effective? What's hardest about maintaining quality across many students?",
    levels: [
      {
        level: "pre-structural",
        description:
          "Gives feedback but quality degrades with volume; student 1 gets attention, student 25 gets 'good job'",
      },
      {
        level: "unistructural",
        description:
          "Can identify ONE technique for consistent feedback (e.g., rubric) but applies mechanically",
      },
      {
        level: "multistructural",
        description:
          "Uses multiple techniques (rubrics, templates, batch strategies) but doesn't see how they connect",
      },
      {
        level: "relational",
        description:
          "Understands calibration as quality control; can explain WHY anchor examples create consistency; sees personalization as distinct from drafting",
      },
      {
        level: "extended-abstract",
        description:
          "Applies calibration principles to new assessment contexts independently. Designs own quality anchors without examples. Identifies when AI feedback needs human override vs. when it's trustworthy. Explains the calibration logic to colleagues in own words.",
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
          "Applies invariant/variant framework to new content areas without prompting. Tests whether tier definitions hold across different topics. Identifies when differentiation templates break and redesigns them. Explains the access vs. rigor distinction using own examples.",
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
          "Synthesizes all course skills into a coherent personal practice. Tests principles against edge cases independently. Articulates own AI philosophy grounded in specific teaching decisions. Could explain their framework to a skeptical colleague and defend it.",
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
