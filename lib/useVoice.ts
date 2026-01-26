"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// TypeScript declarations for Chrome's webkitSpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

// ==================== STT Hook (Chrome webkitSpeechRecognition) ====================
// Manual tap-to-start, tap-to-stop with NO auto-stop on silence
// Max duration: 90 seconds safety limit

const MAX_RECORDING_DURATION = 90000; // 90 seconds

type UseSTTOptions = {
  onRecordingComplete?: (transcript: string) => void;
  onError?: (error: string) => void;
};

export function useSTT(options: UseSTTOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTranscriptRef = useRef<string>("");

  // Check if speech recognition is supported
  const isSupported =
    typeof window !== "undefined" &&
    !!(window.webkitSpeechRecognition || window.SpeechRecognition);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (maxDurationRef.current) {
      clearTimeout(maxDurationRef.current);
      maxDurationRef.current = null;
    }
  }, []);

  // Initialize recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    // CONTINUOUS mode - no auto-stop on silence
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setInterimTranscript("");
      setFinalTranscript("");
      setElapsedTime(0);
      accumulatedTranscriptRef.current = "";
      startTimeRef.current = Date.now();

      // Start elapsed time counter
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      // Set max duration safety limit
      maxDurationRef.current = setTimeout(() => {
        console.log("Max recording duration reached");
        recognition.stop();
      }, MAX_RECORDING_DURATION);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Accumulate final results
          accumulatedTranscriptRef.current += transcript + " ";
          setFinalTranscript(accumulatedTranscriptRef.current.trim());
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't report "aborted" or "no-speech" as errors
      if (event.error !== "aborted" && event.error !== "no-speech") {
        const errorMessage = getErrorMessage(event.error);
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    };

    recognition.onend = () => {
      clearTimers();
      setIsListening(false);

      // Combine final + any remaining interim transcript
      const fullTranscript = (
        accumulatedTranscriptRef.current + " " + interimTranscript
      ).trim();

      if (fullTranscript) {
        setFinalTranscript(fullTranscript);
        options.onRecordingComplete?.(fullTranscript);
      } else {
        options.onRecordingComplete?.("");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimers();
      recognition.abort();
    };
  }, [isSupported, clearTimers]); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setError(null);
    setFinalTranscript("");
    setInterimTranscript("");
    accumulatedTranscriptRef.current = "";

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    clearTimers();
    recognitionRef.current.stop();
  }, [isListening, clearTimers]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetTranscript = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
    accumulatedTranscriptRef.current = "";
  }, []);

  // Get full current transcript (final + interim)
  const currentTranscript = finalTranscript + (interimTranscript ? " " + interimTranscript : "");

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    currentTranscript: currentTranscript.trim(),
    elapsedTime,
    error,
    startListening,
    stopListening,
    clearError,
    resetTranscript,
    isSupported,
  };
}

function getErrorMessage(error: string): string {
  switch (error) {
    case "not-allowed":
      return "Microphone access denied. Please allow microphone access.";
    case "no-speech":
      return "No speech detected. Please try again.";
    case "network":
      return "Network error. Please check your connection.";
    case "audio-capture":
      return "No microphone found. Please connect a microphone.";
    default:
      return `Speech recognition error: ${error}`;
  }
}

// Format seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
