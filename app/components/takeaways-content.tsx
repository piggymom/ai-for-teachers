"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PodcastPlayer } from "./podcast-player";

interface Artifact {
  id: string;
  title: string;
  type: string;
  content: string;
  description: string | null;
}

interface Ledger {
  sessionSummary: string | null;
  keyInsights: string[];
  diagnosticLevel: string | null;
}

interface Profile {
  primaryGoal: string | null;
  biggestTimeDrains: string[];
}

interface TakeawaysContentProps {
  weekNumber: number;
  artifacts: Artifact[];
  ledger: Ledger | null;
  profile: Profile | null;
  hasNextWeek: boolean;
  nextWeekNumber: number;
}

const WEEK_DATA = [
  { title: "Getting Started", subtitle: "Your foundation for the course" },
  { title: "Understanding AI", subtitle: "Your quick reference for classroom-safe AI use" },
  { title: "Prompting Fundamentals", subtitle: "The 4C framework in action" },
  { title: "Lesson Planning", subtitle: "AI as your brainstorming partner" },
  { title: "Feedback & Assessment", subtitle: "Faster, more useful feedback workflows" },
  { title: "Differentiation with AI", subtitle: "Adapting lessons for every learner" },
  { title: "Integration & Ethics", subtitle: "Your sustainable AI toolkit & policy" },
];

const NEXT_WEEK_PREVIEWS = [
  "In Week 1, you'll learn what AI actually is (and isn't), and how to use it safely in your classroom.",
  "In Week 2, you'll master the 4C framework for writing prompts that actually work.",
  "In Week 3, you'll use AI as a brainstorming partner for lesson design — while keeping pedagogical ownership.",
  "In Week 4, you'll build workflows for faster, rubric-aligned feedback on student work.",
  "In Week 5, you'll learn to design differentiated materials for diverse learners with AI support.",
  "In Week 6, you'll develop your personal AI policy and plan for ethical, sustainable integration.",
  "You've completed the course! Your artifacts are ready to use in your classroom.",
];

export function TakeawaysContent({
  weekNumber,
  artifacts,
  ledger,
  profile,
  hasNextWeek,
  nextWeekNumber
}: TakeawaysContentProps) {
  const router = useRouter();
  const weekInfo = WEEK_DATA[weekNumber];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyArtifact = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-[13px]">
          <li>
            <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </li>
          <li className="text-muted-foreground/30">/</li>
          <li>
            <Link
              href={`/week-${weekNumber}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Week {weekNumber}
            </Link>
          </li>
          <li className="text-muted-foreground/30">/</li>
          <li className="text-foreground">Takeaways</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
          Week {weekNumber} Takeaways
        </p>
        <h1 className="text-[30px] font-semibold text-foreground font-display mb-2">
          {weekInfo.title}
        </h1>
        <p className="text-[17px] text-muted-foreground">
          {weekInfo.subtitle}
        </p>
      </header>

      {/* Podcast Recap */}
      <section className="mb-10">
        <div className="p-6 bg-secondary rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-medium text-foreground">Your Learning Recap</h2>
            <span className="text-[12px] text-muted-foreground/40">~3 min</span>
          </div>
          <p className="text-[13px] text-muted-foreground mb-4">
            A personalized audio summary based on your conversation with Skippy
          </p>
          <PodcastPlayer week={weekNumber} />
        </div>
      </section>

      {/* Personalized Summary (from ledger) */}
      {ledger?.sessionSummary && (
        <section className="mb-10">
          <div className="p-6 bg-secondary rounded-xl">
            <h2 className="text-[15px] font-medium text-foreground mb-3">Your Session</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              {ledger.sessionSummary}
            </p>

            {profile?.primaryGoal && (
              <p className="mt-4 text-[13px] text-muted-foreground italic">
                This connects to your goal of {formatGoal(profile.primaryGoal)}.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Artifacts */}
      {artifacts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[15px] font-medium text-foreground mb-5">
            What You Built
          </h2>
          <div className="space-y-4">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="p-5 border border-border rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-medium text-foreground">
                      {artifact.title}
                    </h3>
                    {artifact.description && (
                      <p className="text-[13px] text-muted-foreground mt-1">
                        {artifact.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => copyArtifact(artifact.content, artifact.id)}
                    className="px-3 py-1.5 text-[13px] text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {copiedId === artifact.id ? "Copied!" : "Copy"}
                  </button>
                </div>

                <pre className="text-[13px] text-muted-foreground bg-secondary p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                  {artifact.content}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Concepts */}
      <section className="mb-10">
        <h2 className="text-[15px] font-medium text-foreground mb-5">
          Key Concepts
        </h2>
        <div className="space-y-5">
          {getKeyConceptsForWeek(weekNumber).map((concept, index) => (
            <div key={index}>
              <h3 className="text-[14px] font-medium text-foreground mb-3">
                {concept.title}
              </h3>
              <ul className="space-y-2">
                {concept.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-2.5 text-[14px] text-muted-foreground">
                    <span className="text-muted-foreground/30 mt-0.5">&#x2022;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What's Next */}
      <section className="mb-10">
        <div className="p-6 bg-secondary rounded-xl">
          <h2 className="text-[15px] font-medium text-foreground mb-2">
            {hasNextWeek ? "What's Next" : "You Did It!"}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-5">
            {NEXT_WEEK_PREVIEWS[weekNumber]}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/home")}
              className="px-4 py-2 border border-border hover:bg-card text-foreground text-[13px] font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>

            {hasNextWeek && (
              <button
                onClick={() => router.push(`/week-${nextWeekNumber}`)}
                className="text-[13px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Start Week {nextWeekNumber}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Reflection */}
      <section>
        <div className="p-5 border border-dashed border-border rounded-xl">
          <p className="text-[14px] text-muted-foreground italic">
            Quick reflection: What&apos;s one thing from this week you&apos;re excited to try in your classroom?
          </p>
        </div>
      </section>
    </div>
  );
}

function formatGoal(goal: string): string {
  const goalMap: Record<string, string> = {
    save_time: "saving time on repetitive tasks",
    differentiation: "creating better differentiated materials",
    feedback: "giving faster, more useful feedback",
    admin: "handling admin and communication tasks",
    confidence: "feeling more confident using AI"
  };
  return goalMap[goal] || goal.replace(/_/g, ' ');
}

function getKeyConceptsForWeek(weekNumber: number): Array<{ title: string; points: string[] }> {
  const concepts: Record<number, Array<{ title: string; points: string[] }>> = {
    0: [
      {
        title: "How This Course Works",
        points: [
          "Each week builds one practical skill through conversation with Skippy",
          "You'll create real artifacts — prompts, templates, workflows — that you keep",
          "Focus on what works for YOUR classroom, not generic advice"
        ]
      }
    ],
    1: [
      {
        title: "What AI Is (and Isn't)",
        points: [
          "Generates drafts and ideas from patterns, not facts or truth",
          "Can be fast and useful, but also wrong or overconfident",
          "Works best as a starting point you edit and verify"
        ]
      },
      {
        title: "Classroom-Safe Uses",
        points: [
          "Draft parent messages and adjust tone (you approve final)",
          "Create lesson variations for supports or extensions",
          "Generate practice questions you can refine",
          "Summarize your notes into clearer feedback language"
        ]
      }
    ],
    2: [
      {
        title: "The 4C Framework",
        points: [
          "Context: Who is this for? What's the situation?",
          "Constraints: What should AI avoid or limit?",
          "Command: What exactly do you want AI to do?",
          "Criteria: What does good output look like?"
        ]
      },
      {
        title: "Prompting Principles",
        points: [
          "Structure matters more than length",
          "Different tasks need different emphasis",
          "Iteration is normal — first output is data, not the answer"
        ]
      }
    ],
    3: [
      {
        title: "AI as Brainstorming Partner",
        points: [
          "Generate multiple options quickly, then apply your judgment",
          "Use AI for the first draft, not the final product",
          "You maintain pedagogical ownership — AI suggests, you decide"
        ]
      },
      {
        title: "Lesson Planning Patterns",
        points: [
          "Brainstorm hooks, activities, or differentiation options",
          "Generate variations for different learning needs",
          "Draft objectives or assessments for your review"
        ]
      }
    ],
    4: [
      {
        title: "Feedback Workflows",
        points: [
          "AI generates draft comments, you personalize and approve",
          "Rubric-aligned feedback is faster with AI assistance",
          "Batch similar feedback needs for efficiency"
        ]
      },
      {
        title: "Assessment Support",
        points: [
          "Generate practice questions at different levels",
          "Create answer keys and rubrics",
          "Draft feedback for common errors"
        ]
      }
    ],
    5: [
      {
        title: "Differentiation Strategies",
        points: [
          "Generate varied materials for different readiness levels",
          "Adapt content for learning styles, interests, and needs",
          "Create scaffolded versions of the same activity"
        ]
      },
      {
        title: "AI-Assisted Adaptation",
        points: [
          "Use AI to brainstorm modifications quickly",
          "Build reusable differentiation templates",
          "Maintain rigor while increasing accessibility"
        ]
      }
    ],
    6: [
      {
        title: "Your Personal AI Policy",
        points: [
          "Define where AI helps and where it doesn't in your practice",
          "Set boundaries for ethical use with students",
          "Create guidelines you can share with colleagues and parents"
        ]
      },
      {
        title: "Sustainable Integration",
        points: [
          "Start small — one task at a time",
          "Iterate and refine as you learn what works",
          "Balance efficiency with maintaining your voice and judgment"
        ]
      }
    ]
  };

  return concepts[weekNumber] || [];
}
