"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const wantListeningRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function createRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = new Ctor();

    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    r.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript;
          setTranscript((prev) => (prev ? prev + " " + text : text));
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (event: any) => {
      console.log("[MIC] Recognition error:", event.error);

      // Non-fatal errors — keep listening
      if (event.error === "no-speech" || event.error === "aborted") return;

      if (event.error === "network") {
        // Network blip — restart after brief delay
        if (wantListeningRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (wantListeningRef.current) restartRecognition();
          }, 500);
        }
        return;
      }

      if (event.error === "not-allowed") {
        setError("Microphone access denied");
      }

      // Fatal error — actually stop
      wantListeningRef.current = false;
      setIsListening(false);
    };

    r.onend = () => {
      console.log("[MIC] Recognition ended, wantListening:", wantListeningRef.current);

      // Browser killed recognition (timeout, silence, etc.) — auto-restart
      if (wantListeningRef.current) {
        // Small delay prevents rapid restart loops
        restartTimeoutRef.current = setTimeout(() => {
          if (wantListeningRef.current) restartRecognition();
        }, 100);
        return;
      }

      setIsListening(false);
    };

    return r;
  }

  function restartRecognition() {
    console.log("[MIC] Restarting recognition...");

    // Try restarting existing instance first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log("[MIC] Restarted existing instance");
        return;
      } catch {
        // Old instance is stuck — create fresh one
      }
    }

    // Create a new instance
    try {
      const r = createRecognition();
      recognitionRef.current = r;
      r.start();
      console.log("[MIC] Started new instance");
    } catch {
      console.error("[MIC] Failed to create new instance");
      wantListeningRef.current = false;
      setIsListening(false);
    }
  }

  const startListening = useCallback(() => {
    if (!isSupported || wantListeningRef.current) return;

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Abort existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const r = createRecognition();
    recognitionRef.current = r;

    setTranscript("");
    setError(null);
    wantListeningRef.current = true;
    setIsListening(true);

    try {
      r.start();
      console.log("[MIC] Recognition started");
    } catch {
      wantListeningRef.current = false;
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    console.log("[MIC] Stopping recognition");

    // Clear intent FIRST so onend doesn't restart
    wantListeningRef.current = false;

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wantListeningRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    isSupported,
    error,
  };
}
