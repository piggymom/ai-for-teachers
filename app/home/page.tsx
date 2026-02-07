"use client";

import Link from "next/link";
import { useCompletionState } from "@/lib/useCompletionState";
import { AuthButton } from "../components/auth-button";
import { WelcomeVideo } from "../components/welcome-video";
import { ArtifactGallery } from "../components/artifact-gallery";
import { CourseSidebar } from "../components/course-sidebar";
import { SupportChatPanel } from "../components/support-chat-panel";

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

const WeekCard = ({
  weekNumber,
  title,
  description,
  minutes,
  status,
  href,
  takeawaysHref,
  statusLabel,
}: WeekCardProps) => {
  const isInteractive = status !== "comingSoon" && Boolean(href);
  const isCompleted = status === "completed";
  const takeawaysLink = isCompleted && takeawaysHref ? takeawaysHref : undefined;

  const content = (
    <div className={`relative z-10 flex h-full flex-col gap-2.5 ${isInteractive ? "pointer-events-none" : ""}`}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className={`text-[13px] tabular-nums ${isCompleted ? "text-white/20" : "text-white/30"}`}>
            {weekNumber.toString().padStart(2, "0")}
          </span>
          <h2 className={`text-[15px] font-medium ${isCompleted ? "text-white/50" : "text-white/85"}`}>
            {title}
          </h2>
          {isCompleted && (
            <svg
              className="h-3.5 w-3.5 text-emerald-500/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={`text-[13px] ${isCompleted ? "text-white/15" : "text-white/25"}`}>
          {minutes}m
        </span>
      </div>
      <p className={`pl-7 text-[14px] leading-relaxed ${isCompleted ? "text-white/25" : "text-white/40"}`}>
        {description}
      </p>
      {takeawaysLink && (
        <div className="pl-7 pt-1">
          <Link
            aria-label={`View Week ${weekNumber} takeaways`}
            className="pointer-events-auto text-[13px] text-cyan-400/60 transition hover:text-cyan-400"
            href={takeawaysLink}
          >
            View takeaways
          </Link>
        </div>
      )}
    </div>
  );

  if (status === "comingSoon" || !href) {
    return (
      <div aria-disabled="true" className="group relative flex h-full flex-col py-5 text-left opacity-40">
        {content}
      </div>
    );
  }

  return (
    <div className="group relative flex h-full flex-col py-5 text-left transition-colors duration-150 hover:bg-white/[0.03]">
      <Link
        aria-label={`Go to Week ${weekNumber}`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/30"
        href={href}
      />
      {content}
    </div>
  );
};

export default function Home() {
  const { completionState } = useCompletionState();

  const weeks: WeekCardProps[] = [
    {
      weekNumber: 0,
      title: "Getting Started",
      description:
        "How this course is designed, who it's for, and how to use AI in a way that supports—rather than replaces—professional judgment.",
      minutes: 5,
      status: completionState[0] ? "completed" : "available",
      statusLabel: "Start here",
      href: "/week-0",
      takeawaysHref: "/week-0/takeaways",
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
      title: "Prompting Fundamentals",
      description:
        "Learn the building blocks of effective prompts using the 4C framework: Context, Constraints, Command, and Criteria.",
      minutes: 30,
      status: completionState[2] ? "completed" : "available",
      href: "/week-2",
      takeawaysHref: "/week-2/takeaways",
    },
    {
      weekNumber: 3,
      title: "Lesson Planning with AI",
      description:
        "Use AI as a brainstorming partner for lesson design while maintaining pedagogical ownership.",
      minutes: 30,
      status: completionState[3] ? "completed" : "available",
      href: "/week-3",
      takeawaysHref: "/week-3/takeaways",
    },
    {
      weekNumber: 4,
      title: "Feedback & Assessment",
      description:
        "Generate feedback drafts, rubric-aligned comments, and practice questions you personalize and finalize.",
      minutes: 35,
      status: completionState[4] ? "completed" : "available",
      href: "/week-4",
      takeawaysHref: "/week-4/takeaways",
    },
    {
      weekNumber: 5,
      title: "Communication & Admin",
      description:
        "Handle parent communications, newsletters, and administrative tasks that eat up planning time.",
      minutes: 35,
      status: completionState[5] ? "completed" : "available",
      href: "/week-5",
      takeawaysHref: "/week-5/takeaways",
    },
    {
      weekNumber: 6,
      title: "Building Your Practice",
      description:
        "Create sustainable AI routines and build your personal prompt library for long-term success.",
      minutes: 25,
      status: completionState[6] ? "completed" : "available",
      href: "/week-6",
      takeawaysHref: "/week-6/takeaways",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#191919] text-white">
      <CourseSidebar />
      <main className="flex-1">
        <div className="fixed right-6 top-6 z-10">
          <AuthButton />
        </div>
        <div className="mx-auto flex max-w-xl flex-col gap-12 px-6 py-20">
          {/* Welcome video tile - shows while generating, then video when ready */}
          <WelcomeVideo />

          <header className="space-y-3">
            <h1 className="text-2xl font-normal tracking-tight text-white/90">
              AI for Teachers
            </h1>
            <p className="text-[15px] font-light leading-relaxed text-white/40">
              Practical guidance for using AI with clarity.
            </p>
          </header>

          <section className="flex flex-col divide-y divide-white/[0.06]">
            {weeks.map((week) => (
              <WeekCard key={week.weekNumber} {...week} />
            ))}
          </section>

          <section className="mt-8 border-t border-white/[0.06] pt-8">
            <ArtifactGallery />
          </section>
        </div>
      </main>
      <SupportChatPanel />
    </div>
  );
}
