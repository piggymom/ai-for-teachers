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

  // Check if podcast exists for completed weeks, poll if generating
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
            // Stop polling once cached
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          } else if (data.hasConversation && !pollRef.current) {
            // Podcast not cached yet but conversation exists — poll every 5s
            // (it's probably being auto-generated right now)
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
    // Don't navigate if user clicked a button inside the card
    if ((e.target as HTMLElement).closest("button")) return;
    if (!isLocked) {
      router.push(`/week-${weekNumber}`);
    }
  };

  const handlePodcast = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("[PODCAST] Button clicked, current state:", podcastState);

    if (podcastState === "loading") return; // Already loading, don't double-fire

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

    // Reset error state on retry
    if (podcastState === "error") {
      // Fall through to regenerate
    }

    // Generate/fetch podcast
    setPodcastState("loading");
    console.log("[PODCAST] Fetching audio for week", weekNumber);
    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: weekNumber }),
      });
      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        console.error("[PODCAST] Fetch failed:", res.status, errorText);
        setPodcastState("error");
        return;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("audio")) {
        console.error("[PODCAST] Unexpected content type:", contentType);
        setPodcastState("error");
        return;
      }
      const blob = await res.blob();
      console.log("[PODCAST] Got audio blob:", blob.size, "bytes");
      if (blob.size < 100) {
        console.error("[PODCAST] Audio blob too small:", blob.size);
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
      audio.onerror = (err) => {
        console.error("[PODCAST] Audio playback error:", err);
        setPodcastState("error");
        URL.revokeObjectURL(url);
      };
      await audio.play();
      setPodcastState("playing");
    } catch (err) {
      console.error("[PODCAST] Error:", err);
      setPodcastState("error");
    }
  };

  if (isLocked) {
    return (
      <div className="p-6 rounded-xl border border-[#f3f4f6] bg-white">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="text-[13px] font-semibold text-[#d1d5db] uppercase tracking-wider">
            Week {weekNumber}
          </span>
          <span className="text-[12px] text-[#e5e7eb]">&middot;</span>
          <span className="text-[13px] text-[#e5e7eb]">{duration}</span>
        </div>
        <h3 className="text-[17px] font-medium text-[#d1d5db] mb-1.5">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-[#e5e7eb]">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="group p-6 rounded-xl border border-[#f3f4f6] bg-white hover:border-[#e5e7eb] hover:shadow-sm cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider">
              Week {weekNumber}
            </span>
            <span className="text-[12px] text-[#d1d5db]">&middot;</span>
            <span className="text-[13px] text-[#d1d5db]">{duration}</span>
            {status === "completed" && (
              <span className="text-[13px] font-medium text-[#10b981]">Completed</span>
            )}
          </div>

          <h3 className="text-[17px] font-medium text-[#111827] mb-1.5">
            {title}
          </h3>

          <p className="text-[15px] leading-relaxed text-[#9ca3af]">
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
                    ? "bg-[#111827] text-white"
                    : podcastState === "loading"
                    ? "bg-[#f3f4f6] text-[#9ca3af] cursor-wait"
                    : podcastState === "error"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]"
                }`}
              >
                {podcastState === "loading" ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#9ca3af]" />
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
                    <span className="text-[#9ca3af]">~90 sec</span>
                  </>
                )}
              </button>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium bg-[#f3f4f6] text-[#9ca3af]">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#9ca3af]" />
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
              className="text-[13px] text-[#9ca3af] hover:text-[#111827] transition-colors"
            >
              Review
            </button>
          ) : status === "not_started" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/week-${weekNumber}`);
              }}
              className="text-[14px] text-[#9ca3af] hover:text-[#111827] transition-colors"
            >
              Start &rarr;
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

