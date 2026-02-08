"use client";

type Phase = "discover" | "build" | "refine" | "reflect" | "save" | "bridge";

interface ChatPhaseIndicatorProps {
  currentPhase: Phase;
  className?: string;
}

const PHASES: { key: Phase; label: string }[] = [
  { key: "discover", label: "Discover" },
  { key: "build", label: "Build" },
  { key: "refine", label: "Refine" },
  { key: "reflect", label: "Reflect" },
];

export function ChatPhaseIndicator({ currentPhase, className = "" }: ChatPhaseIndicatorProps) {
  const currentIndex = PHASES.findIndex(p => p.key === currentPhase);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {PHASES.map((phase, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={phase.key} className="flex items-center">
            {/* Phase dot/indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${isComplete ? 'bg-[#22c55e]' : ''}
                  ${isCurrent ? 'bg-[#3b82f6] ring-4 ring-blue-500/20' : ''}
                  ${isFuture ? 'bg-[#333333]' : ''}
                `}
              />
              <span
                className={`
                  text-[10px] mt-1 transition-colors whitespace-nowrap
                  ${isCurrent ? 'text-[#3b82f6] font-medium' : 'text-[#525252]'}
                `}
              >
                {phase.label}
              </span>
            </div>

            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div
                className={`
                  w-6 h-0.5 mx-1 mb-4
                  ${isComplete ? 'bg-[#22c55e]' : 'bg-[#262626]'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
