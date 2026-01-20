"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

type WeekCompletionMarkerProps = {
  weekNumber: number;
};

export default function WeekCompletionMarker({
  weekNumber,
}: WeekCompletionMarkerProps) {
  const { status } = useSession();
  const hasSent = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || hasSent.current) {
      return;
    }

    hasSent.current = true;
    void fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weekNumber }),
    });
  }, [status, weekNumber]);

  return null;
}
