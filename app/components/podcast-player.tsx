"use client";

import { useState, useRef, useEffect } from "react";

interface PodcastPlayerProps {
  week: number;
}

type PlayerState = "idle" | "checking" | "loading" | "ready" | "playing" | "paused" | "error";

export function PodcastPlayer({ week }: PodcastPlayerProps) {
  const [state, setState] = useState<PlayerState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasConversation, setHasConversation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    checkPodcastStatus();
  }, [week]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  async function checkPodcastStatus() {
    setState("checking");
    try {
      const res = await fetch(`/api/podcast?week=${week}`);
      if (res.ok) {
        const data = await res.json();
        setHasConversation(data.hasConversation);
        setState(data.hasConversation ? "idle" : "idle");
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
    }
  }

  async function generatePodcast(forceRegenerate = false) {
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week, forceRegenerate }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to generate podcast";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const data = await res.json();
            errorMessage = data.error || errorMessage;
          } else {
            errorMessage = `Server error (${res.status})`;
          }
        } catch {
          errorMessage = `Server error (${res.status})`;
        }
        throw new Error(errorMessage);
      }

      const audioBlob = await res.blob();
      if (audioBlob.size === 0) {
        throw new Error("Received empty audio response");
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("timeupdate", () => {
        setProgress(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setState("ready");
        setProgress(0);
      });

      audio.addEventListener("error", () => {
        setState("error");
        setError("Failed to play audio");
      });

      setState("ready");
    } catch (err) {
      setState("error");
      const message = err instanceof Error ? err.message : "Failed to generate podcast";
      setError(message);
    }
  }

  function togglePlayPause() {
    if (!audioRef.current) return;

    if (state === "playing") {
      audioRef.current.pause();
      setState("paused");
    } else {
      audioRef.current.play();
      setState("playing");
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // No conversation yet
  if (!hasConversation && state !== "checking") {
    return (
      <div className="rounded-lg bg-secondary px-5 py-4">
        <p className="text-[13px] text-muted-foreground">
          Complete your conversation with Skippy to unlock your personalized audio summary.
        </p>
      </div>
    );
  }

  // Checking status
  if (state === "checking") {
    return (
      <div className="rounded-lg bg-secondary px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          <span className="text-[13px] text-muted-foreground">Checking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg px-1 py-1">
      <div className="flex flex-col gap-4">
        {/* Player controls */}
        {state === "idle" && (
          <button
            onClick={() => generatePodcast(false)}
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
            </svg>
            Generate Audio Summary
          </button>
        )}

        {state === "loading" && (
          <div className="flex items-center justify-center gap-3 rounded-lg bg-secondary px-4 py-2.5">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <span className="text-[13px] text-muted-foreground">Generating your podcast...</span>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-destructive">{error}</p>
            <button
              onClick={() => generatePodcast(false)}
              className="text-[12px] text-muted-foreground underline hover:text-foreground"
            >
              Try again
            </button>
          </div>
        )}

        {(state === "ready" || state === "playing" || state === "paused") && (
          <div className="flex flex-col gap-3">
            {/* Progress bar */}
            <div
              className="group relative h-1 cursor-pointer rounded-full bg-muted"
              onClick={seek}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
                style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : "0%" }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary opacity-0 transition group-hover:opacity-100"
                style={{ left: duration > 0 ? `calc(${(progress / duration) * 100}% - 6px)` : "0" }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayPause}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-accent"
                >
                  {state === "playing" ? (
                    <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => generatePodcast(true)}
                  className="flex h-7 items-center gap-1.5 rounded-full bg-secondary px-3 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  title="Generate a new version"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>

              <span className="text-[12px] tabular-nums text-muted-foreground">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
