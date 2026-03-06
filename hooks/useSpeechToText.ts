"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const fatalErrorRef = useRef(false); // Prevents restart after permission denial

  // Check support after mount (SSR-safe)
  useEffect(() => {
    setIsSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    // Detach old instance (don't abort — can disrupt permissions)
    if (recognitionRef.current) {
      const old = recognitionRef.current;
      recognitionRef.current = null;
      old.onend = null;
      old.onerror = null;
      old.onresult = null;
      try { old.abort(); } catch { /* ignore */ }
    }

    fatalErrorRef.current = false;

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
      console.log("[MIC] onend — fatal:", fatalErrorRef.current, "ref match:", recognitionRef.current === recognition);

      // NEVER restart after a fatal error (permission denied, etc.)
      if (fatalErrorRef.current) return;

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
      console.log("[MIC] onerror:", event.error);

      if (event.error === "not-allowed") {
        // FATAL: Mark as fatal FIRST so onend won't restart
        fatalErrorRef.current = true;
        recognitionRef.current = null;
        setIsListening(false);
        setError("Microphone access denied");
        return;
      }

      // no-speech and aborted are benign
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("[MIC] Unexpected error:", event.error);
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
      console.error("[MIC] start() threw:", e);
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
      try { recognition.stop(); } catch { /* ignore */ }
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
