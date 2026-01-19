"use client";

import { useEffect } from "react";

type WeekCompletionMarkerProps = {
  weekNumber: number;
};

export default function WeekCompletionMarker({
  weekNumber,
}: WeekCompletionMarkerProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storageKey = `week-${weekNumber}-completed`;
    window.localStorage.setItem(storageKey, "true");
  }, [weekNumber]);

  return null;
}
