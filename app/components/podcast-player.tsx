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

  // Check if podcast is available on mount
  useEffect(() => {
    checkPodcastStatus();
  }, [week]);

  // Cleanup audio URL on unmount
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
        // Try to parse error message, but handle non-JSON responses
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

      // Clean up previous URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = audioUrl;

      // Create audio element
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
      <div className="rounded-lg bg-white/[0.03] px-5 py-4">
        <p className="text-[14px] text-white/40">
          Complete your conversation with Skippy to unlock your personalized audio summary.
        </p>
      </div>
    );
  }

  // Checking status
  if (state === "checking") {
    return (
      <div className="rounded-lg bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          <span className="text-[14px] text-white/40">Checking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white/[0.03] px-5 py-4">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-medium text-white/80">Your Learning Recap</h3>
            <p className="mt-1 text-[13px] text-white/40">
              A personalized audio summary of your Week {week} session
            </p>
          </div>

          {/* Podcast icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
            <svg
              className="h-5 w-5 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          </div>
        </div>

        {/* Player controls */}
        {state === "idle" && (
          <button
            onClick={() => generatePodcast(false)}
            className="flex items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2.5 text-[14px] text-white/70 transition hover:bg-white/[0.1] hover:text-white/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
            </svg>
            Generate Audio Summary
          </button>
        )}

        {state === "loading" && (
          <div className="flex items-center justify-center gap-3 rounded-lg bg-white/[0.06] px-4 py-2.5">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400/60" />
            <span className="text-[14px] text-white/50">Generating your podcast...</span>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-red-400/80">{error}</p>
            <button
              onClick={() => generatePodcast(false)}
              className="text-[13px] text-white/50 underline hover:text-white/70"
            >
              Try again
            </button>
          </div>
        )}

        {(state === "ready" || state === "playing" || state === "paused") && (
          <div className="flex flex-col gap-3">
            {/* Progress bar */}
            <div
              className="group relative h-1.5 cursor-pointer rounded-full bg-white/10"
              onClick={seek}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-cyan-400/60 transition-all"
                style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : "0%" }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-400 opacity-0 transition group-hover:opacity-100"
                style={{ left: duration > 0 ? `calc(${(progress / duration) * 100}% - 6px)` : "0" }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayPause}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] transition hover:bg-white/[0.12]"
                >
                  {state === "playing" ? (
                    <svg className="h-5 w-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => generatePodcast(true)}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-white/[0.05] px-3 text-[12px] text-white/40 transition hover:bg-white/[0.08] hover:text-white/60"
                  title="Generate a new version"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>

              <span className="text-[13px] tabular-nums text-white/40">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
