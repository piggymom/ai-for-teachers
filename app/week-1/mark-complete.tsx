"use client";

import { useSyncExternalStore } from "react";

type MarkCompleteButtonProps = {
  storageKey?: string;
};

export default function MarkCompleteButton({
  storageKey = "week-1-completed",
}: MarkCompleteButtonProps) {
  const isComplete = useSyncExternalStore(
    (listener) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }
      window.addEventListener("storage", listener);
      window.addEventListener("ai4t-storage", listener);
      return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener("ai4t-storage", listener);
      };
    },
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(storageKey) === "true",
    () => false
  );

  const handleClick = () => {
    window.localStorage.setItem(storageKey, "true");
    window.dispatchEvent(new Event("ai4t-storage"));
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
