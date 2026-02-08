"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SkippyAvatar } from "./skippy-avatar";

interface UserProgress {
  currentWeek: number;
  completedWeeks: number[];
  totalWeeks: number;
}

export function CourseSidebar() {
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [skippyMessage, setSkippyMessage] = useState("");

  useEffect(() => {
    // Fetch participant count
    fetch("/api/stats/participants")
      .then(res => res.json())
      .then(data => setParticipantCount(data.count))
      .catch(() => setParticipantCount(null));

    // Fetch user progress
    fetch("/api/progress")
      .then(res => res.json())
      .then(data => {
        const progressData = data.progress || [];
        const completed = progressData
          .filter((p: { status: string }) => p.status === "completed")
          .map((p: { weekNumber: number }) => p.weekNumber);

        // Find next incomplete week
        let nextWeek = 0;
        for (let i = 0; i <= 6; i++) {
          if (!completed.includes(i)) {
            nextWeek = i;
            break;
          }
        }
        if (completed.length === 7) nextWeek = 6;

        setProgress({
          currentWeek: nextWeek,
          completedWeeks: completed,
          totalWeeks: 7
        });

        // Set contextual Skippy message
        setSkippyMessage(getSkippyMessage(completed.length, nextWeek, data.daysSinceLastVisit));
      })
      .catch(() => setProgress(null));
  }, []);

  const handleChatToSkippy = () => {
    if (progress) {
      router.push(`/week-${progress.currentWeek}`);
    } else {
      router.push("/week-0");
    }
  };

  return (
    <aside className="hidden lg:flex w-60 bg-[#0a0a0a] border-r border-[#262626] p-5 flex-col h-screen">
      {/* Course Team Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-[#525252] uppercase tracking-wider">
          Course Team
        </h3>

        <div className="flex items-start gap-4">
          {/* Asher */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#262626] mb-1.5 flex items-center justify-center overflow-hidden">
              <span className="text-xl">👨‍🏫</span>
            </div>
            <p className="text-xs text-[#fafafa] font-medium">Asher</p>
            <p className="text-[10px] text-[#525252]">Creator</p>
          </div>

          {/* Skippy */}
          <div className="text-center">
            <div className="w-12 h-12 mb-1.5 flex items-center justify-center">
              <SkippyAvatar state="idle" size="sm" />
            </div>
            <p className="text-xs text-[#fafafa] font-medium">Skippy</p>
            <p className="text-[10px] text-[#525252]">AI Tutor</p>
          </div>
        </div>

        {/* Skippy Message Bubble */}
        {skippyMessage && (
          <div className="relative">
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <p className="text-xs text-[#a1a1a1] italic leading-relaxed">
                "{skippyMessage}"
              </p>
            </div>
            {/* Triangle pointer */}
            <div className="absolute -top-2 left-16 w-3 h-3 bg-[#141414] border-l border-t border-[#262626] rotate-45" />
          </div>
        )}

        {/* Chat to Skippy Button */}
        <button
          onClick={handleChatToSkippy}
          className="w-full py-2.5 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          Chat to Skippy
        </button>
      </div>

      {/* Participants Section */}
      <div className="mt-8 space-y-3">
        <h3 className="text-xs font-medium text-[#525252] uppercase tracking-wider">
          Participants
        </h3>
        <div className="flex items-center gap-2">
          {/* Stacked avatars */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#262626] border-2 border-[#0a0a0a]" />
            <div className="w-6 h-6 rounded-full bg-[#333333] border-2 border-[#0a0a0a]" />
            <div className="w-6 h-6 rounded-full bg-[#404040] border-2 border-[#0a0a0a]" />
          </div>
          <span className="text-sm text-[#a1a1a1]">
            {participantCount !== null
              ? `${participantCount} teacher${participantCount !== 1 ? 's' : ''}`
              : "..."}
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help Link */}
      <div className="pt-4 border-t border-[#262626]">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('openSupport'))}
          className="text-sm text-[#525252] hover:text-[#a1a1a1] transition-colors"
        >
          Need help? Contact support
        </button>
      </div>
    </aside>
  );
}

function getSkippyMessage(completedCount: number, currentWeek: number, daysSinceLastVisit?: number): string {
  // Returning after absence
  if (daysSinceLastVisit && daysSinceLastVisit > 3) {
    return `Welcome back! Ready to pick up where we left off on Week ${currentWeek}?`;
  }

  // Based on progress
  if (completedCount === 0) {
    return "Let's get you started. Week 0 takes about 5 minutes.";
  } else if (completedCount === 7) {
    return "You did it! Your artifacts are ready to use in your classroom.";
  } else if (completedCount >= 4) {
    return `You're in the home stretch! ${7 - completedCount} weeks to go.`;
  } else {
    return `You're making progress! Ready for Week ${currentWeek}?`;
  }
}
