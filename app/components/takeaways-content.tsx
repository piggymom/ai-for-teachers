"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  { title: "Communication & Admin", subtitle: "Reclaiming time from admin tasks" },
  { title: "Building Your Practice", subtitle: "Your sustainable AI toolkit" },
];

const NEXT_WEEK_PREVIEWS = [
  "In Week 1, you'll learn what AI actually is (and isn't), and how to use it safely in your classroom.",
  "In Week 2, you'll master the 4C framework for writing prompts that actually work.",
  "In Week 3, you'll use AI as a brainstorming partner for lesson design — while keeping pedagogical ownership.",
  "In Week 4, you'll build workflows for faster, rubric-aligned feedback on student work.",
  "In Week 5, you'll tackle parent communications and admin tasks that eat up your time.",
  "In Week 6, you'll build your personal prompt library and sustainable AI practice.",
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <a href="/home" className="text-[#737373] hover:text-[#a1a1a1] transition-colors">
              Dashboard
            </a>
          </li>
          <li className="text-[#525252]">/</li>
          <li>
            <a
              href={`/week-${weekNumber}`}
              className="text-[#737373] hover:text-[#a1a1a1] transition-colors"
            >
              Week {weekNumber}
            </a>
          </li>
          <li className="text-[#525252]">/</li>
          <li className="text-[#fafafa]">Takeaways</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">
          Week {weekNumber} Takeaways
        </p>
        <h1 className="text-3xl font-semibold text-[#fafafa] mb-2">
          {weekInfo.title}
        </h1>
        <p className="text-lg text-[#a1a1a1]">
          {weekInfo.subtitle}
        </p>
      </header>

      {/* Podcast Recap */}
      <section className="mb-8">
        <div className="p-6 bg-[#141414] rounded-xl border border-[#262626]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-[#fafafa]">Your Learning Recap</h2>
            <span className="text-xs text-[#525252]">~3 min</span>
          </div>
          <p className="text-sm text-[#737373] mb-4">
            A personalized audio summary based on your conversation with Skippy
          </p>
          <PodcastPlayer week={weekNumber} />
        </div>
      </section>

      {/* Personalized Summary (from ledger) */}
      {ledger?.sessionSummary && (
        <section className="mb-8">
          <div className="p-6 bg-[#141414] rounded-xl border border-[#262626]">
            <h2 className="text-lg font-medium text-[#fafafa] mb-3">Your Session</h2>
            <p className="text-sm text-[#a1a1a1] leading-relaxed">
              {ledger.sessionSummary}
            </p>

            {/* Personalization echo */}
            {profile?.primaryGoal && (
              <p className="mt-4 text-sm text-[#737373] italic">
                This connects to your goal of {formatGoal(profile.primaryGoal)}.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Artifacts */}
      {artifacts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-medium text-[#fafafa] mb-4">
            What You Built
          </h2>
          <div className="space-y-4">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="p-5 bg-[#141414] rounded-xl border border-[#262626]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-medium text-[#fafafa]">
                      {artifact.title}
                    </h3>
                    {artifact.description && (
                      <p className="text-sm text-[#737373] mt-1">
                        {artifact.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => copyArtifact(artifact.content, artifact.id)}
                    className="px-3 py-1.5 text-sm text-[#3b82f6] hover:text-[#60a5fa] hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    {copiedId === artifact.id ? "Copied!" : "Copy"}
                  </button>
                </div>

                <pre className="text-sm text-[#a1a1a1] bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono border border-[#1a1a1a]">
                  {artifact.content}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Concepts (generic per week) */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[#fafafa] mb-4">
          Key Concepts
        </h2>
        <div className="space-y-4">
          {getKeyConceptsForWeek(weekNumber).map((concept, index) => (
            <div
              key={index}
              className="p-5 bg-[#141414] rounded-xl border border-[#262626]"
            >
              <h3 className="text-base font-medium text-[#fafafa] mb-3">
                {concept.title}
              </h3>
              <ul className="space-y-2">
                {concept.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-2 text-sm text-[#a1a1a1]">
                    <span className="text-[#525252] mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What's Next */}
      <section className="mb-8">
        <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#141414] rounded-xl border border-[#262626]">
          <h2 className="text-lg font-medium text-[#fafafa] mb-2">
            {hasNextWeek ? "What's Next" : "You Did It!"}
          </h2>
          <p className="text-sm text-[#a1a1a1] mb-4">
            {NEXT_WEEK_PREVIEWS[weekNumber]}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/home")}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-[#fafafa] text-sm font-medium rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>

            {hasNextWeek && (
              <button
                onClick={() => router.push(`/week-${nextWeekNumber}`)}
                className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Start Week {nextWeekNumber} →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Reflection Prompt */}
      <section>
        <div className="p-5 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] border-dashed">
          <p className="text-sm text-[#737373] italic">
            Quick reflection: What's one thing from this week you're excited to try in your classroom?
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
        title: "Communication Templates",
        points: [
          "Parent emails, newsletters, announcements",
          "Adjust tone for different audiences",
          "Translate or simplify complex information"
        ]
      },
      {
        title: "Admin Efficiency",
        points: [
          "Meeting agendas and summaries",
          "Documentation and reports",
          "Routine communications you personalize"
        ]
      }
    ],
    6: [
      {
        title: "Your Prompt Library",
        points: [
          "Save and organize prompts that work for you",
          "Adapt templates across different contexts",
          "Share effective patterns with colleagues"
        ]
      },
      {
        title: "Sustainable Practice",
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
