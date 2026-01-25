"use client";

import { useSyncExternalStore, useEffect } from "react";

// Storage keys for each week's completion state
const STORAGE_KEYS: Record<number, string> = {
  1: "ai4t_week1_complete",
  2: "ai4t_week2_complete",
  3: "ai4t_week3_complete",
  4: "ai4t_week4_complete",
  5: "ai4t_week5_complete",
  6: "ai4t_week6_complete",
};

// Module-level state - stable reference, mutated in place
let state: Record<number, boolean> = {};

// Listeners for state changes
const listeners = new Set<() => void>();

// Cached empty object for server snapshot - MUST be same reference every call
const SERVER_SNAPSHOT: Record<number, boolean> = {};

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
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

export function useCompletionState(): Record<number, boolean> {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    setState(readFromLocalStorage());

    // Listen for storage changes (cross-tab and same-tab custom event)
    const handleStorageChange = () => {
      setState(readFromLocalStorage());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("ai4t-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ai4t-storage", handleStorageChange);
    };
  }, []);

  return snapshot;
}
