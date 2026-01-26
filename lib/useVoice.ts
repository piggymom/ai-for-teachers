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

// ==================== TTS Hook ====================

type UseTTSOptions = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

export function useTTS(options: UseTTSOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices and select preferred Australian voice
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Prefer Australian English, fallback to any English
      const auVoice = availableVoices.find((v) => v.lang.startsWith("en-AU"));
      const enVoice = availableVoices.find((v) => v.lang.startsWith("en-"));
      setPreferredVoice(auVoice || enVoice || availableVoices[0] || null);
    }

    // Load immediately if voices are available
    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      // Always cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice and warm delivery settings
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        options.onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        // Don't report "interrupted" as an error - it's expected when we cancel
        if (event.error !== "interrupted") {
          options.onError?.(event.error);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [preferredVoice, options]
  );

  return {
    speak,
    cancel,
    isSpeaking,
    voices,
    preferredVoice,
    isSupported: typeof window !== "undefined" && !!window.speechSynthesis,
  };
}

// ==================== STT Hook ====================

type UseSTTOptions = {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
};

export function useSTT(options: UseSTTOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if speech recognition is supported
  const isSupported =
    typeof window !== "undefined" &&
    !!(window.webkitSpeechRecognition || window.SpeechRecognition);

  // Initialize recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-AU"; // Prefer Australian English for input too

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setInterimTranscript("");
      options.onStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        options.onResult?.(final, true);
        setInterimTranscript("");
      } else if (interim) {
        options.onResult?.(interim, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't report "aborted" or "no-speech" as errors
      if (event.error !== "aborted" && event.error !== "no-speech") {
        const errorMessage = getErrorMessage(event.error);
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      options.onEnd?.();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported]); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch (err) {
      // Recognition might already be started
      console.error("Failed to start recognition:", err);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
  }, [isListening]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearError,
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
