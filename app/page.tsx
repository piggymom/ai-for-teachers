import { getServerSession } from "next-auth/next";

import { WeekCard, type WeekCardProps } from "@/app/components/WeekCard";
import { authOptions } from "@/lib/auth";
import { getUserProgress } from "@/lib/progress";

const weeks: WeekCardProps[] = [
  {
    weekNumber: 0,
    title: "About This Course",
    description:
      "How this course is designed, who it’s for, and how to use AI in a way that supports—rather than replaces—professional judgment.",
    minutes: 5,
    status: "available",
    statusLabel: "Start here",
    href: "/week-0",
    variant: "orientation",
  },
  {
    weekNumber: 1,
    title: "Understanding AI in Teaching",
    description:
      "Understand what AI is (and isn’t), how it can support you, and the guardrails that keep it classroom-safe.",
    minutes: 25,
    status: "available",
    href: "/week-1",
    takeawaysHref: "/week-1/takeaways",
  },
  {
    weekNumber: 2,
    title: "Planning & Prep",
    description:
      "Plan lessons with AI-supported outlines, differentiation options, and resource shortlists you review and refine.",
    minutes: 30,
    status: "available",
    href: "/week-2",
    takeawaysHref: "/week-2/takeaways",
  },
  {
    weekNumber: 3,
    title: "Prompting Basics",
    description:
      "Write clear prompts, check outputs for accuracy and bias, and decide what fits your students.",
    minutes: 30,
    status: "available",
    href: "/week-3",
    takeawaysHref: "/week-3/takeaways",
  },
  {
    weekNumber: 4,
    title: "Classroom Workflows",
    description:
      "Design repeatable routines for feedback notes, family communication drafts, and classroom management supports you finalize.",
    minutes: 35,
    status: "available",
    href: "/week-4",
    takeawaysHref: "/week-4/takeaways",
  },
  {
    weekNumber: 5,
    title: "Assessment & Feedback",
    description:
      "Draft rubric-aligned feedback and exemplars, then edit to match your expectations and voice.",
    minutes: 35,
    status: "available",
    href: "/week-5",
    takeawaysHref: "/week-5/takeaways",
  },
  {
    weekNumber: 6,
    title: "Safety, Policy & Norms",
    description:
      "Establish guardrails, privacy expectations, and classroom norms with your professional judgment at the center.",
    minutes: 25,
    status: "available",
    href: "/week-6",
    takeawaysHref: "/week-6/takeaways",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const completedWeeks: Record<number, boolean> = {};

  if (session?.user?.id) {
    const progress = await getUserProgress(session.user.id);
    progress.forEach((entry) => {
      completedWeeks[entry.weekNumber] = entry.status === "completed";
    });
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Course Index
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              AI for Teachers
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              Practical, classroom-safe guidance for using AI with clarity and no hype.
            </p>
          </div>
        </header>

        <section className="grid gap-5 sm:gap-6">
          {weeks.map((week) => (
            <WeekCard
              key={week.weekNumber}
              {...week}
              completed={completedWeeks[week.weekNumber] ?? false}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
