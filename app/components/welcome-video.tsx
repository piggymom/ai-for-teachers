"use client";

import { useState, useEffect, useRef } from "react";

type VideoState = "checking" | "generating" | "processing" | "ready" | "playing" | "paused" | "hidden";

export function WelcomeVideo() {
  const [state, setState] = useState<VideoState>("checking");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for existing video on mount
  useEffect(() => {
    checkForVideo();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Poll for video completion
  useEffect(() => {
    if ((state === "processing" || state === "generating") && videoId) {
      pollIntervalRef.current = setInterval(checkVideoStatus, 5000);
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [state, videoId]);

  async function checkForVideo() {
    try {
      const res = await fetch("/api/welcome-video");
      if (!res.ok) {
        setState("hidden");
        return;
      }

      const data = await res.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setState("ready");
      } else if (data.hasProfile) {
        // Has profile but no video - generate one in background
        generateVideo();
      } else {
        setState("hidden");
      }
    } catch {
      setState("hidden");
    }
  }

  async function generateVideo() {
    setState("generating");
    try {
      const res = await fetch("/api/welcome-video", { method: "POST" });
      const data = await res.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setState("ready");
      } else if (data.videoId) {
        setVideoId(data.videoId);
        setState("processing");
      } else if (data.error) {
        setState("hidden"); // Hide on error, don't block the experience
      }
    } catch {
      setState("hidden");
    }
  }

  async function checkVideoStatus() {
    if (!videoId) return;

    try {
      const res = await fetch(`/api/welcome-video?videoId=${videoId}`);
      const data = await res.json();

      if (data.status === "completed" && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setState("ready");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      } else if (data.status === "failed") {
        setState("hidden");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    } catch {
      // Keep polling on transient errors
    }
  }

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play();
      setState("playing");
    }
  }

  function handlePause() {
    setState("paused");
  }

  function handleEnded() {
    setState("ready"); // Return to ready state so they can replay
  }

  // Don't render anything if hidden (no profile)
  if (state === "hidden") {
    return null;
  }

  // Still loading/generating - show subtle loading tile
  if (state === "checking" || state === "generating" || state === "processing") {
    return (
      <div className="mb-8 overflow-hidden rounded-xl bg-white/[0.03] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400/60" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white/70">Preparing your welcome</p>
            <p className="text-[13px] text-white/40">A personalized video is being created...</p>
          </div>
        </div>
      </div>
    );
  }

  // Video ready, playing, or paused
  if ((state === "ready" || state === "playing" || state === "paused") && videoUrl) {
    return (
      <div className="overflow-hidden rounded-xl bg-white/[0.03]">
        {/* Video area */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full"
            onEnded={handleEnded}
            onPause={handlePause}
            playsInline
            controls={state === "playing" || state === "paused"}
          />

          {/* Play button overlay (only when ready to play) */}
          {state === "ready" && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/20"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:scale-105 hover:bg-white/30">
                <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Caption below video */}
        <div className="px-4 py-3">
          <p className="text-[14px] font-medium text-white/70">Your personalized welcome</p>
          <p className="text-[13px] text-white/40">A message from Asher, your course creator</p>
        </div>
      </div>
    );
  }

  return null;
}
