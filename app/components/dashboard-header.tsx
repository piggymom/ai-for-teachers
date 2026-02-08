"use client";

import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  primaryGoal: string;
  biggestTimeDrains: string[];
}

interface Progress {
  currentWeek: number;
  completedWeeks: number[];
  isFirstVisit: boolean;
}

interface DashboardHeaderProps {
  profile: UserProfile | null;
  progress: Progress | null;
}

export function DashboardHeader({ profile, progress }: DashboardHeaderProps) {
  const router = useRouter();

  if (!profile || !progress) {
    return <DashboardHeaderSkeleton />;
  }

  const firstName = profile.name?.split(" ")[0] || "there";
  const isFirstVisit = progress.isFirstVisit;
  const completedCount = progress.completedWeeks.length;
  const currentWeek = progress.currentWeek;

  // First visit experience
  if (isFirstVisit) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-[#fafafa] tracking-tight">
          Welcome to AI for Teachers, {firstName}.
        </h1>
        <p className="text-lg text-[#a1a1a1]">
          Your personalized course is ready. Let's start with a quick orientation.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => router.push("/week-0")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          Begin Week 0
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Personalization echo */}
        <p className="text-sm text-[#737373]">
          Based on what you shared, you'll build workflows for:{" "}
          <span className="text-[#a1a1a1]">
            {profile.biggestTimeDrains?.slice(0, 3).join(", ").toLowerCase() || "saving time and working smarter"}
          </span>
        </p>
      </div>
    );
  }

  // Returning user experience
  const weekTopics = [
    "Getting Started",
    "Understanding AI",
    "Prompting Fundamentals",
    "Lesson Planning",
    "Feedback & Assessment",
    "Communication & Admin",
    "Building Your Practice"
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#fafafa]">Welcome back, {firstName}</h1>
      <p className="text-[#a1a1a1]">
        {completedCount === 7
          ? "You've completed the course!"
          : `You're on Week ${currentWeek}`}
      </p>

      {completedCount < 7 && (
        <>
          <p className="text-sm text-[#737373]">
            Next up: {weekTopics[currentWeek]}
          </p>

          {/* Primary CTA */}
          <button
            onClick={() => router.push(`/week-${currentWeek}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
          >
            Continue Week {currentWeek}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Progress Journey */}
      <div className="pt-4">
        <ProgressJourney completedWeeks={progress.completedWeeks} currentWeek={currentWeek} />
      </div>
    </div>
  );
}

function ProgressJourney({ completedWeeks, currentWeek }: { completedWeeks: number[], currentWeek: number }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((week) => {
        const isCompleted = completedWeeks.includes(week);
        const isCurrent = week === currentWeek;

        return (
          <div key={week} className="flex items-center">
            {/* Node */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${isCompleted
                  ? "bg-[#22c55e] text-white"
                  : isCurrent
                    ? "bg-[#3b82f6] text-white ring-4 ring-blue-500/20"
                    : "bg-[#262626] text-[#737373]"
                }
              `}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                week
              )}
            </div>

            {/* Connector */}
            {week < 6 && (
              <div className={`w-4 h-0.5 ${completedWeeks.includes(week) ? "bg-[#22c55e]" : "bg-[#262626]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-[#1a1a1a] rounded w-2/3" />
      <div className="h-5 bg-[#1a1a1a] rounded w-1/2" />
      <div className="h-12 bg-[#1a1a1a] rounded w-40" />
      <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
    </div>
  );
}
