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

  const handleTakeawaysClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/week-${weekNumber}/takeaways`);
  };

  // Locked: same card size, muted colors
  if (isLocked) {
    return (
      <div className="p-6 rounded-xl border border-[#f3f4f6] bg-white">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="text-[13px] font-semibold text-[#d1d5db] uppercase tracking-wider">
            Week {weekNumber}
          </span>
          <span className="text-[12px] text-[#e5e7eb]">&middot;</span>
          <span className="text-[13px] text-[#e5e7eb]">{duration}</span>
        </div>
        <h3 className="text-[17px] font-medium text-[#d1d5db] mb-1.5">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-[#e5e7eb]">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="group p-6 rounded-xl border border-[#f3f4f6] bg-white hover:border-[#e5e7eb] hover:shadow-sm cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        {/* Left: Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider">
              Week {weekNumber}
            </span>
            <span className="text-[12px] text-[#d1d5db]">&middot;</span>
            <span className="text-[13px] text-[#d1d5db]">{duration}</span>
            {status === "completed" && (
              <span className="text-[13px] font-medium text-[#10b981]">Completed</span>
            )}
          </div>

          <h3 className="text-[17px] font-medium text-[#111827] mb-1.5">
            {title}
          </h3>

          <p className="text-[15px] leading-relaxed text-[#9ca3af]">
            {description}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="ml-6 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {status === "completed" ? (
            <>
              <button
                onClick={handleTakeawaysClick}
                className="text-[14px] font-medium text-[#111827] hover:text-[#3B82F6] transition-colors"
              >
                Takeaways &rarr;
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/week-${weekNumber}`);
                }}
                className="text-[13px] text-[#9ca3af] hover:text-[#111827] transition-colors"
              >
                Review
              </button>
            </>
          ) : status === "not_started" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/week-${weekNumber}`);
              }}
              className="text-[14px] text-[#9ca3af] hover:text-[#111827] transition-colors"
            >
              Start &rarr;
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

