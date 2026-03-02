"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SkippyAvatar } from "./skippy-avatar";

interface UserProgress {
  currentWeek: number;
  completedWeeks: number[];
  totalWeeks: number;
}

interface CourseSidebarProps {
  variant?: "full" | "minimal";
}

export function CourseSidebar({ variant = "full" }: CourseSidebarProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then(res => res.json())
      .then(data => {
        const progressData = data.progress || [];
        const completed = progressData
          .filter((p: { status: string }) => p.status === "completed")
          .map((p: { weekNumber: number }) => p.weekNumber);

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

  // Minimal variant for chat view
  if (variant === "minimal") {
    return (
      <aside className="hidden lg:flex w-16 flex-col items-center py-5 h-screen sticky top-0" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="mb-4">
          <SkippyAvatar state="idle" size="sm" />
        </div>
        <div className="flex-1" />
        <a
          href="/home"
          className="text-[#64748b] hover:text-[#94a3b8] transition-colors p-2"
          title="Back to Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </aside>
    );
  }

  // Full variant — dark gradient sidebar
  return (
    <aside className="hidden lg:flex w-[200px] px-5 py-8 pb-12 flex-col h-screen sticky top-0" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Course Team */}
      <div className="space-y-5">
        <p className="text-[11px] font-medium text-[#475569] uppercase tracking-wider">Course Team</p>

        <div className="space-y-4">
          {/* Asher */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#94a3b8]">AS</span>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#0f172a]" />
            </div>
            <div>
              <span className="text-[13px] font-medium text-white block leading-tight">Asher Scott</span>
              <span className="text-[11px] text-[#64748b]">Instructor</span>
            </div>
          </div>

          {/* Skippy */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-9 h-9">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <div className="w-full h-full flex items-center justify-center" style={{ transform: 'scale(0.75)' }}>
                  <SkippyAvatar state="idle" size="sm" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#0f172a] z-10" />
            </div>
            <div>
              <span className="text-[13px] font-medium text-white block leading-tight">Skippy</span>
              <span className="text-[11px] text-[#64748b]">AI Tutor</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleChatToSkippy}
          className="w-full text-left text-[13px] text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat to Skippy
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help Link */}
      <div className="pt-5 border-t border-[#1e293b]">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('openSupport'))}
          className="text-[12px] text-[#64748b] hover:text-[#94a3b8] transition-colors flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          Need help?
        </button>
      </div>
    </aside>
  );
}
