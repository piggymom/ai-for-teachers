"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const fatalRef = useRef(false);

  // Check support after mount (SSR-safe)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const supported = !!(w.SpeechRecognition || w.webkitSpeechRecognition);
    console.log("[MIC] Browser support check:", supported);
    setIsSupported(supported);
  }, []);

  const startListening = useCallback(() => {
    // Check support at call time, not via stale closure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      console.log("[MIC] SpeechRecognition not available");
      return;
    }

    console.log("[MIC] startListening called");

    // Clean up any existing instance
    if (recognitionRef.current) {
      const old = recognitionRef.current;
      recognitionRef.current = null;
      old.onend = null;
      old.onerror = null;
      old.onresult = null;
      try { old.abort(); } catch { /* ignore */ }
    }

    fatalRef.current = false;
    const recognition = new SR();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }
      // Build full transcript from all final results
      const full = finalText.trim();
      if (full) {
        setTranscript(full);
      } else if (interimText) {
        // Show interim results so user knows mic is working
        setTranscript(interimText);
      }
    };

    recognition.onend = () => {
      console.log("[MIC] onend fired, fatal:", fatalRef.current, "ref match:", recognitionRef.current === recognition);
      if (fatalRef.current) return;
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
          console.log("[MIC] Auto-restarted after browser timeout");
        } catch (e) {
          console.log("[MIC] Auto-restart failed:", e);
          recognitionRef.current = null;
          setIsListening(false);
        }
      }
    };

    recognition.onaudiostart = () => {
      console.log("[MIC] Audio stream started (mic is active)");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.log("[MIC] onerror:", event.error, "message:", event.message);

      if (event.error === "not-allowed") {
        fatalRef.current = true;
        recognitionRef.current = null;
        setIsListening(false);
        setError("Microphone access denied");
        return;
      }

      if (event.error === "service-not-allowed") {
        fatalRef.current = true;
        recognitionRef.current = null;
        setIsListening(false);
        setError("Speech service not available — try Chrome");
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
      console.log("[MIC] recognition.start() succeeded");
    } catch (e) {
      console.error("[MIC] recognition.start() threw:", e);
      setError("Failed to start microphone — " + (e instanceof Error ? e.message : String(e)));
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    console.log("[MIC] stopListening called");
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    fatalRef.current = true; // Prevent any restart
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
