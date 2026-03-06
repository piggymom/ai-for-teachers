"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Check support after mount (SSR-safe)
  useEffect(() => {
    setIsSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    // Abort any existing instance first to avoid collisions
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null; // Prevent auto-restart
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    const recognition = new SR();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript((prev) => (prev ? prev + " " + text : text));
    };

    recognition.onend = () => {
      console.log("[MIC] Recognition ended, ref exists:", !!recognitionRef.current);
      // Auto-restart if still supposed to be listening
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
          console.log("[MIC] Auto-restarted");
        } catch (e) {
          console.log("[MIC] Auto-restart failed:", e);
          recognitionRef.current = null;
          setIsListening(false);
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.log("[MIC] Error event:", event.error);

      if (event.error === "not-allowed") {
        setError("Microphone access denied");
        recognitionRef.current = null;
        setIsListening(false);
        return;
      }
      // no-speech and aborted are benign — ignore
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("[MIC] Speech error:", event.error);
      }
    };

    setTranscript("");
    setError(null);

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      console.log("[MIC] Started successfully");
    } catch (e) {
      console.error("[MIC] Failed to start:", e);
      setError("Failed to start microphone");
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    console.log("[MIC] stopListening called");
    const recognition = recognitionRef.current;
    recognitionRef.current = null; // Clear ref FIRST to prevent auto-restart
    setIsListening(false);
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }
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
