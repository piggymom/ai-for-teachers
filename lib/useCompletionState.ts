"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// Storage keys for localStorage fallback (unauthenticated users)
const STORAGE_KEYS: Record<number, string> = {
  1: "ai4t_week1_complete",
  2: "ai4t_week2_complete",
  3: "ai4t_week3_complete",
  4: "ai4t_week4_complete",
  5: "ai4t_week5_complete",
  6: "ai4t_week6_complete",
};

// Module-level state - stable reference
let state: Record<number, boolean> = {};
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: Record<number, boolean> = {};

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Record<number, boolean> {
  return state;
}

function getServerSnapshot(): Record<number, boolean> {
  return SERVER_SNAPSHOT;
}

function setState(next: Record<number, boolean>): void {
  state = next;
  listeners.forEach((listener) => listener());
}

function readFromLocalStorage(): Record<number, boolean> {
  const result: Record<number, boolean> = {};
  for (const [week, key] of Object.entries(STORAGE_KEYS)) {
    result[Number(week)] = window.localStorage.getItem(key) === "true";
  }
  return result;
}

export function useCompletionState() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Fetch progress from API when authenticated
  useEffect(() => {
    if (status === "loading") return;

    if (isAuthenticated) {
      // Fetch from API
      fetch("/api/progress")
        .then((res) => res.json())
        .then((data) => {
          const result: Record<number, boolean> = {};
          for (const [week, progressStatus] of Object.entries(data.progress || {})) {
            result[Number(week)] = progressStatus === "completed";
          }
          setState(result);
        })
        .catch(() => {
          // Fallback to localStorage on error
          setState(readFromLocalStorage());
        });
    } else {
      // Use localStorage for unauthenticated users
      setState(readFromLocalStorage());

      const handleStorageChange = () => setState(readFromLocalStorage());
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("ai4t-storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("ai4t-storage", handleStorageChange);
      };
    }
  }, [isAuthenticated, status]);

  // Function to mark a week as complete
  const markComplete = useCallback(
    async (weekNumber: number) => {
      if (isAuthenticated) {
        // Save to API
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weekNumber, status: "completed" }),
        });

        if (res.ok) {
          setState({ ...state, [weekNumber]: true });
        }
      } else {
        // Save to localStorage
        const key = STORAGE_KEYS[weekNumber];
        if (key) {
          window.localStorage.setItem(key, "true");
          window.dispatchEvent(new Event("ai4t-storage"));
        }
      }
    },
    [isAuthenticated]
  );

  return { completionState: snapshot, markComplete, isAuthenticated };
}
