"use client";

import { useRouter } from "next/navigation";

type WeekStatus = "not_started" | "in_progress" | "completed";

interface WeekCardProps {
  weekNumber: number;
  title: string;
  description: string;
  duration: string;
  status: WeekStatus;
  isLocked?: boolean;
}

export function WeekCard({
  weekNumber,
  title,
  description,
  duration,
  status,
  isLocked = false
}: WeekCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isLocked) {
      router.push(`/week-${weekNumber}`);
    }
  };

  // Handle takeaways click for completed weeks
  const handleTakeawaysClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/week-${weekNumber}/takeaways`);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-6 rounded-xl border transition-all
        ${isLocked
          ? "bg-[#080808] border-[#1a1a1a] cursor-not-allowed"
          : status === "completed"
            ? "bg-[#141414] border-[#22c55e]/30 hover:border-[#22c55e]/50 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer"
            : status === "in_progress"
              ? "bg-[#141414] border-[#3b82f6]/50 hover:border-[#3b82f6] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20 cursor-pointer"
              : "bg-[#141414] border-[#262626] hover:border-[#333333] hover:shadow-lg hover:shadow-black/20 cursor-pointer"
        }
      `}
    >
      <div className="flex items-start justify-between">
        {/* Left side: Content */}
        <div className={`flex-1 ${isLocked ? "opacity-40" : ""}`}>
          {/* Status Badge + Duration */}
          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={status} isLocked={isLocked} />
            <span className={`text-xs ${isLocked ? "text-[#525252]" : "text-[#737373]"}`}>
              {duration}
            </span>
          </div>

          {/* Week Number + Title */}
          <div className="mb-2">
            <span className={`text-xs font-medium ${isLocked ? "text-[#404040]" : "text-[#737373]"}`}>
              Week {weekNumber}
            </span>
            <h3 className={`text-lg font-medium mt-0.5 ${isLocked ? "text-[#525252]" : "text-[#fafafa]"}`}>
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${isLocked ? "text-[#404040]" : "text-[#a1a1a1]"}`}>
            {description}
          </p>
        </div>

        {/* Right side: Actions */}
        <div className="ml-6 flex flex-col items-end gap-2">
          {status === "completed" ? (
            <>
              <button
                onClick={handleTakeawaysClick}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#262626] text-[#22c55e] text-sm font-medium rounded-lg transition-colors"
              >
                Takeaways
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/week-${weekNumber}`);
                }}
                className="text-xs text-[#737373] hover:text-[#a1a1a1] transition-colors"
              >
                Review &rarr;
              </button>
            </>
          ) : status === "in_progress" ? (
            <button className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-lg transition-colors">
              Continue &rarr;
            </button>
          ) : isLocked ? (
            <div className="flex items-center gap-1.5 text-xs text-[#404040]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </div>
          ) : (
            <button className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-[#fafafa] text-sm font-medium rounded-lg transition-colors">
              Start &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar for In Progress */}
      {status === "in_progress" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#262626] rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]"
            style={{ width: "40%" }}
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, isLocked }: { status: WeekStatus; isLocked: boolean }) {
  if (isLocked) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0f0f0f] rounded-full">
        <div className="w-2 h-2 rounded-full bg-[#333333]" />
        <span className="text-xs font-medium text-[#404040]">Locked</span>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#22c55e]/10 rounded-full">
        <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs font-medium text-[#22c55e]">Completed</span>
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#3b82f6]/10 rounded-full">
        <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
        <span className="text-xs font-medium text-[#3b82f6]">In Progress</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] rounded-full">
      <div className="w-2 h-2 rounded-full bg-[#525252]" />
      <span className="text-xs font-medium text-[#737373]">Not Started</span>
    </div>
  );
}
