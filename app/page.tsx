"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const STORAGE_KEYS = {
  1: "ai4t_week1_complete",
  2: "ai4t_week2_complete",
  3: "ai4t_week3_complete",
  4: "ai4t_week4_complete",
  5: "ai4t_week5_complete",
  6: "ai4t_week6_complete",
} as const;

function useCompletionState(): Record<number, boolean> {
  return useSyncExternalStore(
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
    () => {
      if (typeof window === "undefined") return {};
      const result: Record<number, boolean> = {};
      for (const [week, key] of Object.entries(STORAGE_KEYS)) {
        result[Number(week)] = window.localStorage.getItem(key) === "true";
      }
      return result;
    },
    () => ({})
  );
}

type WeekStatus = "available" | "comingSoon" | "completed";

type WeekCardProps = {
  weekNumber: number;
  title: string;
  description: string;
  minutes: number;
  status: WeekStatus;
  href?: string;
  takeawaysHref?: string;
  statusLabel?: string;
  variant?: "default" | "orientation";
};

const statusCopy: Record<WeekStatus, string> = {
  available: "Available",
  comingSoon: "Releasing next",
  completed: "Completed",
};

const WeekCard = ({
  weekNumber,
  title,
  description,
  minutes,
  status,
  href,
  takeawaysHref,
  statusLabel,
  variant = "default",
}: WeekCardProps) => {
  const isInteractive = status !== "comingSoon" && Boolean(href);
  const isCompleted = status === "completed";
  const takeawaysLink = isCompleted && takeawaysHref ? takeawaysHref : undefined;
  const statusText =
    status === "completed" ? "Completed" : statusLabel ?? statusCopy[status];
  const cardClasses =
    "group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition";
  const hoverClasses = "hover:-translate-y-0.5 hover:border-white/25";
  const focusClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";
  const variantClasses =
    variant === "orientation" ? "border-white/8 bg-white/[0.03]" : "";
  const comingSoonClasses = "opacity-60";
  const completedClasses = isCompleted ? "bg-white/[0.035]" : "";
  const metaTextClass = isCompleted ? "text-white/35" : "text-white/40";
  const titleTextClass = isCompleted ? "text-white/85" : "text-white";
  const descriptionTextClass = isCompleted ? "text-white/60" : "text-white/70";
  const pillTextClass = isCompleted ? "text-white/35" : "text-white/45";
  const pillBorderClass = isCompleted ? "border-white/10" : "border-white/15";
  const contentWrapperClass = `relative z-10 flex h-full flex-col gap-5 ${
    isInteractive ? "pointer-events-none" : ""
  }`;
  const content = (
    <div className={contentWrapperClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.32em] ${metaTextClass}`}
          >
            Week {weekNumber}
          </p>
          <h2 className={`text-xl font-semibold ${titleTextClass} sm:text-2xl`}>
            {title}
          </h2>
        </div>
        <div
          className={`flex flex-col items-end gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${pillTextClass}`}
        >
          <span className={`rounded-full border ${pillBorderClass} px-3 py-1`}>
            {minutes} min
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {statusText}
          </span>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${descriptionTextClass} sm:text-base`}>
        {description}
      </p>
      {takeawaysLink ? (
        <div className="mt-auto flex justify-end">
          <Link
            aria-label={`View Week ${weekNumber} takeaways`}
            className="pointer-events-auto rounded-sm text-xs font-semibold text-white/60 underline decoration-white/25 underline-offset-4 transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            href={takeawaysLink}
          >
            View takeaways →
          </Link>
        </div>
      ) : null}
    </div>
  );

  if (status === "comingSoon" || !href) {
    return (
      <div
        aria-disabled="true"
        className={`${cardClasses} ${variantClasses} ${comingSoonClasses} ${completedClasses}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`${cardClasses} ${variantClasses} ${hoverClasses} ${completedClasses}`}
    >
      <Link
        aria-label={`Go to Week ${weekNumber}`}
        className={`absolute inset-0 rounded-2xl ${focusClasses}`}
        href={href}
      >
        <span className="sr-only">Go to Week {weekNumber}</span>
      </Link>
      {content}
    </div>
  );
};

export default function Home() {
  const completionState = useCompletionState();

  const weeks: WeekCardProps[] = [
    {
      weekNumber: 0,
      title: "About This Course",
      description:
        "How this course is designed, who it's for, and how to use AI in a way that supports—rather than replaces—professional judgment.",
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
        "Understand what AI is (and isn't), how it can support you, and the guardrails that keep it classroom-safe.",
      minutes: 25,
      status: completionState[1] ? "completed" : "available",
      href: "/week-1",
      takeawaysHref: "/week-1/takeaways",
    },
    {
      weekNumber: 2,
      title: "Planning & Prep",
      description:
        "Plan lessons with AI-supported outlines, differentiation options, and resource shortlists you review and refine.",
      minutes: 30,
      status: completionState[2] ? "completed" : "available",
      href: "/week-2",
      takeawaysHref: "/week-2/takeaways",
    },
    {
      weekNumber: 3,
      title: "Prompting Basics",
      description:
        "Write clear prompts, check outputs for accuracy and bias, and decide what fits your students.",
      minutes: 30,
      status: completionState[3] ? "completed" : "available",
      href: "/week-3",
      takeawaysHref: "/week-3/takeaways",
    },
    {
      weekNumber: 4,
      title: "Classroom Workflows",
      description:
        "Design repeatable routines for feedback notes, family communication drafts, and classroom management supports you finalize.",
      minutes: 35,
      status: completionState[4] ? "completed" : "available",
      href: "/week-4",
      takeawaysHref: "/week-4/takeaways",
    },
    {
      weekNumber: 5,
      title: "Assessment & Feedback",
      description:
        "Draft rubric-aligned feedback and exemplars, then edit to match your expectations and voice.",
      minutes: 35,
      status: completionState[5] ? "completed" : "available",
      href: "/week-5",
      takeawaysHref: "/week-5/takeaways",
    },
    {
      weekNumber: 6,
      title: "Safety, Policy & Norms",
      description:
        "Establish guardrails, privacy expectations, and classroom norms with your professional judgment at the center.",
      minutes: 25,
      status: completionState[6] ? "completed" : "available",
      href: "/week-6",
      takeawaysHref: "/week-6/takeaways",
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
