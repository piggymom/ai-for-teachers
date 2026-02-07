"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SkippyAvatar } from "./skippy-avatar";

export function CourseSidebar() {
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [nextIncompleteWeek, setNextIncompleteWeek] = useState<number>(0);

  useEffect(() => {
    // Fetch participant count
    fetch("/api/stats/participants")
      .then(res => res.json())
      .then(data => setParticipantCount(data.count))
      .catch(() => setParticipantCount(null));

    // Fetch user's next incomplete week
    fetch("/api/progress")
      .then(res => res.json())
      .then(data => {
        const progress = data.progress || [];
        // Find first incomplete week (0-6)
        for (let week = 0; week <= 6; week++) {
          const weekProgress = progress.find((p: any) => p.weekNumber === week);
          if (!weekProgress || weekProgress.status !== "completed") {
            setNextIncompleteWeek(week);
            return;
          }
        }
        // All complete, go to last week
        setNextIncompleteWeek(6);
      })
      .catch(() => setNextIncompleteWeek(0));
  }, []);

  const handleChatToSkippy = () => {
    router.push(`/week-${nextIncompleteWeek}`);
  };

  return (
    <aside className="hidden lg:flex w-64 bg-neutral-900 border-r border-white/10 p-6 flex-col gap-6">
      {/* Course Team */}
      <div>
        <h3 className="text-sm font-medium text-white/50 mb-4">Course Team</h3>
        <div className="flex gap-4">
          {/* Asher */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 mb-2 flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <p className="text-xs text-white font-medium">Asher</p>
            <p className="text-xs text-white/50">Creator</p>
          </div>

          {/* Skippy */}
          <div className="text-center">
            <div className="w-14 h-14 mb-2 flex items-center justify-center">
              <SkippyAvatar state="idle" size="sm" />
            </div>
            <p className="text-xs text-white font-medium">Skippy</p>
            <p className="text-xs text-white/50">AI Tutor</p>
          </div>
        </div>

        <button
          onClick={handleChatToSkippy}
          className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Chat to Skippy
        </button>
      </div>

      {/* Participants */}
      <div>
        <h3 className="text-sm font-medium text-white/50 mb-2">Participants</h3>
        <div className="flex items-center gap-2 text-white/70">
          <span className="text-lg">👤</span>
          <span className="text-sm">
            {participantCount !== null
              ? `${participantCount} teacher${participantCount !== 1 ? 's' : ''} enrolled`
              : "Loading..."}
          </span>
        </div>
      </div>
    </aside>
  );
}
