"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type MarkCompleteButtonProps = {
  weekNumber?: number;
};

export default function MarkCompleteButton({
  weekNumber = 1,
}: MarkCompleteButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsComplete(false);
      return;
    }

    const checkStatus = async () => {
      const response = await fetch(`/api/progress?weekNumber=${weekNumber}`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { status?: string };
      setIsComplete(data.status === "completed");
    };

    void checkStatus();
  }, [status, weekNumber]);

  const handleClick = async () => {
    if (status !== "authenticated") {
      router.push("/onboarding");
      return;
    }

    const response = await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weekNumber }),
    });

    if (response.ok) {
      setIsComplete(true);
    }
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
