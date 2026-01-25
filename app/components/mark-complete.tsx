"use client";

import { useCompletionState } from "@/lib/useCompletionState";

type MarkCompleteButtonProps = {
  weekNumber: number;
};

export default function MarkCompleteButton({ weekNumber }: MarkCompleteButtonProps) {
  const { completionState, markComplete } = useCompletionState();
  const isComplete = completionState[weekNumber] ?? false;

  const handleClick = () => {
    markComplete(weekNumber);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isComplete}
      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isComplete ? "Completed" : "Mark as complete"}
    </button>
  );
}
