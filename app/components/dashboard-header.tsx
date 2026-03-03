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

  const weekTopics = [
    "Getting Started",
    "Understanding AI",
    "Prompting Fundamentals",
    "Lesson Planning",
    "Feedback & Assessment",
    "Differentiation with AI",
    "Integration & Ethics"
  ];

  // First visit experience
  if (isFirstVisit) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-[13px] text-[#9ca3af] mb-2">Your course is ready</p>
          <h1 className="text-[36px] text-[#111827]" style={{ fontFamily: 'var(--font-display), serif', letterSpacing: '-0.01em' }}>
            Welcome, {firstName}.
          </h1>
        </div>

        <button
          onClick={() => router.push("/week-0")}
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#111827] hover:bg-[#1e293b] text-white text-[14px] font-medium rounded-full transition-all hover:shadow-lg"
        >
          Begin Week 0
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    );
  }

  // Returning user
  return (
    <div className="space-y-6">
      <h1 className="text-[36px] text-[#111827]" style={{ fontFamily: 'var(--font-display), serif', letterSpacing: '-0.01em' }}>
        Welcome back, {firstName}.
      </h1>

      {completedCount < 7 ? (
        <button
          onClick={() => router.push(`/week-${currentWeek}`)}
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#111827] hover:bg-[#1e293b] text-white text-[14px] font-medium rounded-full transition-all hover:shadow-lg"
        >
          Pick up where you left off
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      ) : (
        <p className="text-[15px] text-[#6B7280]">You&apos;ve completed the course.</p>
      )}
    </div>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[#f3f4f6] rounded w-2/3" />
      <div className="h-5 bg-[#f3f4f6] rounded w-1/2" />
      <div className="h-4 bg-[#f3f4f6] rounded w-40" />
    </div>
  );
}
