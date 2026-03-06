"use client";

import { useState, useCallback, useRef } from "react";

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
    r.interimResults = false; // Only final, committed results — no flicker
    r.lang = "en-US";

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
      // Ignore benign errors — keep listening
      if (event.error === "aborted" || event.error === "no-speech") return;
      if (event.error === "not-allowed") {
        setError("Microphone access denied");
        wantListeningRef.current = false;
        setIsListening(false);
      }
    };

    r.onend = () => {
      // Browser killed recognition (timeout, pause, etc.) — auto-restart if user still wants mic on
      if (wantListeningRef.current) {
        try {
          r.start();
          return; // Stay listening from user's perspective
        } catch {
          // Failed to restart — actually stop
        }
      }
      setIsListening(false);
    };

    return r;
  }

  const startListening = useCallback(() => {
    if (!isSupported || wantListeningRef.current) return;

    // Create a fresh instance each time to avoid stale state
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
    } catch {
      wantListeningRef.current = false;
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    wantListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
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
