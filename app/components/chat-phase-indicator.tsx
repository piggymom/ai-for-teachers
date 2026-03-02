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
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-1.5 h-1.5 rounded-full transition-all
                  ${isComplete ? 'bg-[#9ca3af]' : ''}
                  ${isCurrent ? 'bg-[#111827]' : ''}
                  ${isFuture ? 'bg-[#e5e7eb]' : ''}
                `}
              />
              <span
                className={`
                  text-[10px] mt-1 transition-colors whitespace-nowrap
                  ${isCurrent ? 'text-[#111827] font-medium' : 'text-[#d1d5db]'}
                `}
              >
                {phase.label}
              </span>
            </div>

            {index < PHASES.length - 1 && (
              <div
                className={`
                  w-6 h-[1px] mx-1 mb-4
                  ${isComplete ? 'bg-[#d1d5db]' : 'bg-[#f3f4f6]'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
