"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type VideoState = "checking" | "generating" | "processing" | "ready" | "playing" | "paused" | "ended" | "hidden";

export function WelcomeVideo() {
  const [state, setState] = useState<VideoState>("checking");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const MAX_POLLS = 24; // 2 minutes at 5s intervals

  useEffect(() => {
    checkForVideo();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if ((state === "processing" || state === "generating") && videoId) {
      pollIntervalRef.current = setInterval(() => {
        setPollCount((c) => {
          if (c >= MAX_POLLS) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setState("hidden");
            return c;
          }
          checkVideoStatus();
          return c + 1;
        });
      }, 5000);
      return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      };
    }
  }, [state, videoId]);

  async function checkForVideo() {
    try {
      const res = await fetch("/api/welcome-video");
      if (!res.ok) { setState("hidden"); return; }
      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setState("ready");
      } else if (data.hasProfile) {
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
      } else {
        setState("hidden");
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
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      } else if (data.status === "failed") {
        setState("hidden");
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
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
    setState("ended");
  }

  if (state === "hidden") return null;

  // Loading/generating
  if (state === "checking" || state === "generating" || state === "processing") {
    return (
      <div className="mb-8 overflow-hidden rounded-xl bg-[#f9fafb] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#111827]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#111827]">Preparing your welcome</p>
            <p className="text-[13px] text-[#9ca3af]">A personalized video is being created...</p>
          </div>
        </div>
      </div>
    );
  }

  // Video ready / playing / paused / ended
  if (videoUrl) {
    return (
      <div className="mb-8 overflow-hidden rounded-xl border border-[#f3f4f6]">
        <div className="relative aspect-video bg-[#111827]">
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full"
            onEnded={handleEnded}
            onPause={handlePause}
            playsInline
            controls={state === "playing" || state === "paused"}
          />

          {/* Play button overlay */}
          {(state === "ready" || state === "ended") && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition hover:scale-105">
                <svg className="ml-0.5 h-6 w-6 text-[#111827]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Caption + CTA */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[14px] font-medium text-[#111827]">Your personalized welcome</p>
            <p className="text-[13px] text-[#9ca3af]">A message from Asher, your course creator</p>
          </div>

          {state === "ended" && (
            <button
              onClick={() => router.push("/week-0")}
              className="rounded-lg bg-[#111827] px-5 py-2 text-[13px] font-medium text-white transition hover:bg-[#374151]"
            >
              Continue to Week 0 &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
