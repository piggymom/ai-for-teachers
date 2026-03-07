"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type WeekStatus = "not_started" | "in_progress" | "completed";

interface WeekCardProps {
  weekNumber: number;
  title: string;
  description: string;
  duration: string;
  status: WeekStatus;
  isLocked?: boolean;
}

export function WeekCard({
  weekNumber,
  title,
  description,
  duration,
  status,
  isLocked = false
}: WeekCardProps) {
  const router = useRouter();
  const [podcastState, setPodcastState] = useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const [podcastReady, setPodcastReady] = useState(false);
  const [podcastCached, setPodcastCached] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== "completed") return;

    let cancelled = false;

    function checkPodcast() {
      fetch(`/api/podcast?week=${weekNumber}`)
        .then(res => res.json())
        .then(data => {
          if (cancelled) return;
          if (data.hasConversation) setPodcastReady(true);
          if (data.isCached) {
            setPodcastCached(true);
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          } else if (data.hasConversation && !pollRef.current) {
            pollRef.current = setInterval(checkPodcast, 5000);
          }
        })
        .catch(() => {});
    }

    checkPodcast();

    return () => {
      cancelled = true;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [status, weekNumber]);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (!isLocked) {
      router.push(`/week-${weekNumber}`);
    }
  };

  const handlePodcast = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (podcastState === "loading") return;

    if (podcastState === "playing") {
      audioRef.current?.pause();
      setPodcastState("paused");
      return;
    }

    if (podcastState === "paused" && audioRef.current) {
      audioRef.current.play();
      setPodcastState("playing");
      return;
    }

    setPodcastState("loading");
    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: weekNumber }),
      });
      if (!res.ok) {
        setPodcastState("error");
        return;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("audio")) {
        setPodcastState("error");
        return;
      }
      const blob = await res.blob();
      if (blob.size < 100) {
        setPodcastState("error");
        return;
      }
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPodcastState("idle");
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPodcastState("error");
        URL.revokeObjectURL(url);
      };
      await audio.play();
      setPodcastState("playing");
    } catch {
      setPodcastState("error");
    }
  };

  if (isLocked) {
    return (
      <div className="p-6 rounded-xl border border-border/50 bg-card">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="text-[13px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
            Week {weekNumber}
          </span>
          <span className="text-[12px] text-border">&middot;</span>
          <span className="text-[13px] text-muted-foreground/30">{duration}</span>
        </div>
        <h3 className="text-[17px] font-medium text-muted-foreground/40 mb-1.5">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground/25">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="group p-6 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
              Week {weekNumber}
            </span>
            <span className="text-[12px] text-border">&middot;</span>
            <span className="text-[13px] text-muted-foreground/60">{duration}</span>
            {status === "completed" && (
              <span className="text-[13px] font-medium text-success">Completed</span>
            )}
          </div>

          <h3 className="text-[17px] font-medium text-foreground mb-1.5">
            {title}
          </h3>

          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          {/* Inline podcast player for completed weeks */}
          {status === "completed" && podcastReady && (
            podcastCached || podcastState !== "idle" ? (
              <button
                type="button"
                onClick={handlePodcast}
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  podcastState === "playing"
                    ? "bg-primary text-primary-foreground"
                    : podcastState === "loading"
                    ? "bg-muted text-muted-foreground cursor-wait"
                    : podcastState === "error"
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/15"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {podcastState === "loading" ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                    Loading...
                  </>
                ) : podcastState === "playing" ? (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    Pause
                  </>
                ) : podcastState === "paused" ? (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Resume
                  </>
                ) : podcastState === "error" ? (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    Failed — tap to retry
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Listen to Takeaways
                    <span className="text-muted-foreground">~90 sec</span>
                  </>
                )}
              </button>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium bg-muted text-muted-foreground">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                Generating recap...
              </div>
            )
          )}
        </div>

        {/* Right: Actions */}
        <div className="ml-6 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {status === "completed" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/week-${weekNumber}`);
              }}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Review
            </button>
          ) : status === "not_started" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/week-${weekNumber}`);
              }}
              className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
            >
              Start &rarr;
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
