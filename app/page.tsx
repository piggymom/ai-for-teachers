"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type WeekStatus = "available" | "comingSoon" | "completed";

type WeekCardProps = {
  weekNumber: number;
  title: string;
  description: string;
  minutes: number;
  status: WeekStatus;
  href?: string;
};

const statusCopy: Record<WeekStatus, string> = {
  available: "Available",
  comingSoon: "Coming soon",
  completed: "Completed",
};

const WeekCard = ({
  weekNumber,
  title,
  description,
  minutes,
  status,
  href,
}: WeekCardProps) => {
  const isInteractive = status !== "comingSoon" && href;
  const cardClasses =
    "group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition";
  const interactiveClasses =
    "hover:-translate-y-0.5 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";
  const comingSoonClasses = "opacity-60";
  const content = (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
            Week {weekNumber}
          </p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
        </div>
        <div className="flex flex-col items-end gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/45">
          <span className="rounded-full border border-white/15 px-3 py-1">
            {minutes} min
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {statusCopy[status]}
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-white/70 sm:text-base">{description}</p>
    </div>
  );

  if (!isInteractive) {
    return (
      <div
        aria-disabled="true"
        className={`${cardClasses} ${comingSoonClasses}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${cardClasses} ${interactiveClasses}`}
    >
      {content}
    </Link>
  );
};

export default function Home() {
  const week1Completed = useSyncExternalStore(
    (listener) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }
      window.addEventListener("storage", listener);
      window.addEventListener("ai4t-storage", listener);
      return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener("ai4t-storage", listener);
      };
    },
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("ai4t_week1_complete") === "true",
    () => false
  );

  const weeks: WeekCardProps[] = [
    {
      weekNumber: 1,
      title: "Understanding AI in Teaching",
      description:
        "Understand what AI is (and isn’t), how it can support you, and the guardrails that keep it classroom-safe.",
      minutes: 25,
      status: week1Completed ? "completed" : "available",
      href: "/week-1",
    },
    {
      weekNumber: 2,
      title: "Planning & Prep",
      description:
        "Speed up lesson planning with AI-assisted outlines, differentiation, and resource curation.",
      minutes: 30,
      status: "comingSoon",
    },
    {
      weekNumber: 3,
      title: "Prompting Basics",
      description:
        "Craft clear, reliable prompts and learn quick checks for accuracy and bias.",
      minutes: 25,
      status: "comingSoon",
    },
    {
      weekNumber: 4,
      title: "Classroom Workflows",
      description:
        "Build repeatable routines for feedback, communication, and classroom management support.",
      minutes: 35,
      status: "comingSoon",
    },
    {
      weekNumber: 5,
      title: "Assessment & Feedback",
      description:
        "Generate rubric-aligned feedback and exemplars while keeping your professional voice.",
      minutes: 30,
      status: "comingSoon",
    },
    {
      weekNumber: 6,
      title: "Safety & Policy",
      description:
        "Set guardrails, privacy expectations, and classroom norms for AI use.",
      minutes: 25,
      status: "comingSoon",
    },
  ];

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
            <WeekCard key={week.weekNumber} {...week} />
          ))}
        </section>
      </div>
    </main>
  );
}
