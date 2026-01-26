"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSTT, formatTime } from "@/lib/useVoice";

// Message with stable ID and state for update-in-place rendering
type MessageState = "speaking" | "ready" | "done";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  state?: MessageState; // Only used for assistant messages
};

type SkippyChatProps = {
  week: number;
  weekTitle: string;
};

// Minimum words required for a valid transcript
const MIN_TRANSCRIPT_WORDS = 3;

// Generate unique message ID
let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

export function SkippyChat({ week, weekTitle }: SkippyChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTextInstantly, setShowTextInstantly] = useState(false); // Accessibility toggle

  // Recording review state
  const [isReviewingTranscript, setIsReviewingTranscript] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptInputRef = useRef<HTMLTextAreaElement>(null);

  // TTS Manager refs - prevents double playback and handles cleanup
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const playedMessageIdsRef = useRef<Set<string>>(new Set());
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const textRevealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update a message by ID (for in-place updates)
  const updateMessageById = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  // Initialize audio element on mount (no state in callbacks - use refs)
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.onplay = () => {
      setIsSpeaking(true);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      const msgId = currentMessageIdRef.current;
      if (msgId) {
        updateMessageById(msgId, { state: "done" });
      }
    };

    audio.onpause = () => setIsSpeaking(false);

    audio.onerror = () => {
      setIsSpeaking(false);
      const msgId = currentMessageIdRef.current;
      if (msgId) {
        // On error, reveal text immediately
        updateMessageById(msgId, { state: "done" });
      }
      console.warn("Audio playback error");
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onpause = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (ttsAbortControllerRef.current) {
        ttsAbortControllerRef.current.abort();
      }
      if (textRevealTimeoutRef.current) {
        clearTimeout(textRevealTimeoutRef.current);
      }
    };
  }, [updateMessageById]);

  // Stop speaking and cleanup
  const stopSpeaking = useCallback(() => {
    // Cancel any in-flight TTS request
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }

    // Clear text reveal timeout
    if (textRevealTimeoutRef.current) {
      clearTimeout(textRevealTimeoutRef.current);
      textRevealTimeoutRef.current = null;
    }

    // Stop and cleanup audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }

    // Cleanup URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setIsSpeaking(false);
  }, []);

  // Speak assistant message with idempotency and proper state management
  const speakAssistantMessage = useCallback(
    async (text: string, messageId: string) => {
      // Idempotency check - don't play if already played
      if (playedMessageIdsRef.current.has(messageId)) {
        return;
      }

      // Stop any existing audio/request
      stopSpeaking();

      // Mark this message as current
      currentMessageIdRef.current = messageId;

      // Mark as played immediately to prevent double-invocation
      playedMessageIdsRef.current.add(messageId);

      // If accessibility mode, reveal text immediately and skip TTS
      if (showTextInstantly) {
        updateMessageById(messageId, { state: "done" });
        return;
      }

      try {
        // Create abort controller for this request
        const abortController = new AbortController();
        ttsAbortControllerRef.current = abortController;

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error("TTS request failed");
        }

        // Check if we were aborted during fetch
        if (abortController.signal.aborted) {
          return;
        }

        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Cleanup previous URL
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = audioUrl;

        // Check if this is still the current message (might have changed)
        if (currentMessageIdRef.current !== messageId) {
          URL.revokeObjectURL(audioUrl);
          return;
        }

        if (!audioRef.current) return;

        audioRef.current.src = audioUrl;
        await audioRef.current.play();

        // Reveal text 400ms after audio starts playing
        textRevealTimeoutRef.current = setTimeout(() => {
          if (currentMessageIdRef.current === messageId) {
            updateMessageById(messageId, { state: "ready" });
          }
        }, 400);

      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.warn("TTS error:", err);
        setIsSpeaking(false);
        // On error, reveal text immediately
        updateMessageById(messageId, { state: "done" });
      }
    },
    [stopSpeaking, showTextInstantly, updateMessageById]
  );

  // Create assistant message and speak it (single entry point)
  const addAssistantMessage = useCallback(
    (text: string, shouldSpeak: boolean = true) => {
      const messageId = generateMessageId();
      const initialState: MessageState = shouldSpeak && !showTextInstantly ? "speaking" : "done";

      const newMessage: Message = {
        id: messageId,
        role: "assistant",
        content: text,
        state: initialState,
      };

      setMessages((prev) => [...prev, newMessage]);

      if (shouldSpeak) {
        // Use setTimeout to ensure message is in state before TTS starts
        setTimeout(() => speakAssistantMessage(text, messageId), 0);
      }

      return messageId;
    },
    [showTextInstantly, speakAssistantMessage]
  );

  // STT hook - manual start/stop, no auto-cutoff
  const stt = useSTT({
    onRecordingComplete: (transcript) => {
      if (transcript) {
        setEditableTranscript(transcript);
        setIsReviewingTranscript(true);
      }
    },
    onError: (err) => setError(err),
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the week conversation on mount (guarded against StrictMode double-invoke)
  const startWeekCalledRef = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-invocation
    if (startWeekCalledRef.current) {
      return;
    }
    startWeekCalledRef.current = true;

    async function startWeek() {
      try {
        const res = await fetch("/api/skippy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "start_week", week }),
        });

        if (!res.ok) {
          throw new Error("Failed to start conversation");
        }

        const data = await res.json();

        // Load history with proper IDs
        if (data.history && data.history.length > 0) {
          const historyWithIds: Message[] = data.history.map(
            (msg: { role: "user" | "assistant"; content: string }, idx: number) => ({
              id: `history_${idx}`,
              role: msg.role,
              content: msg.content,
              state: "done" as MessageState,
            })
          );

          // Show all but last message immediately
          const lastMsg = historyWithIds[historyWithIds.length - 1];
          const previousMsgs = historyWithIds.slice(0, -1);

          if (lastMsg.role === "assistant") {
            // Set previous messages first
            setMessages(previousMsgs);
            // Then add and speak the last assistant message
            setTimeout(() => addAssistantMessage(lastMsg.content, true), 300);
          } else {
            setMessages(historyWithIds);
          }
        }
      } catch (err) {
        setError("Failed to load conversation. Please refresh the page.");
        console.error("Start week error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    startWeek();
  }, [week, addAssistantMessage]);

  // Focus input after loading
  useEffect(() => {
    if (!isLoading && !isReviewingTranscript && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isReviewingTranscript]);

  // Focus transcript input when reviewing
  useEffect(() => {
    if (isReviewingTranscript && transcriptInputRef.current) {
      transcriptInputRef.current.focus();
      transcriptInputRef.current.select();
    }
  }, [isReviewingTranscript]);

  // Cancel TTS when user starts typing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      if (value && isSpeaking) {
        stopSpeaking();
      }
    },
    [isSpeaking, stopSpeaking]
  );

  // Submit message function
  const submitMessage = useCallback(
    async (messageText: string) => {
      const trimmedInput = messageText.trim();
      if (!trimmedInput || isSending) return;

      setInput("");
      setIsSending(true);
      setError(null);

      // Add user message with ID
      const userMessageId = generateMessageId();
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        content: trimmedInput,
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const res = await fetch("/api/skippy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "user_message",
            week,
            message: trimmedInput,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const data = await res.json();
        // Add and speak assistant response (single message creation point)
        addAssistantMessage(data.response, true);
      } catch (err) {
        setError("Failed to send message. Please try again.");
        // Remove the user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
        console.error("Send message error:", err);
      } finally {
        setIsSending(false);
        inputRef.current?.focus();
      }
    },
    [week, isSending, addAssistantMessage]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage(input);
  }

  async function handleEndWeek() {
    stopSpeaking();
    setIsLoading(true);
    try {
      const res = await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "end_week", week }),
      });

      if (!res.ok) {
        throw new Error("Failed to complete week");
      }

      router.push("/home");
    } catch (err) {
      setError("Failed to mark week complete. Please try again.");
      console.error("End week error:", err);
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // Start recording (barge-in: stop audio first)
  function startRecording() {
    stopSpeaking(); // Barge-in: stop audio when user starts recording
    stt.startListening();
  }

  // Stop recording (goes to review step)
  function stopRecording() {
    stt.stopListening();
  }

  // Send reviewed transcript
  function sendTranscript() {
    const text = editableTranscript.trim();
    if (text && countWords(text) >= MIN_TRANSCRIPT_WORDS) {
      setIsReviewingTranscript(false);
      setEditableTranscript("");
      stt.resetTranscript();
      submitMessage(text);
    }
  }

  // Record again
  function recordAgain() {
    setIsReviewingTranscript(false);
    setEditableTranscript("");
    stt.resetTranscript();
    startRecording();
  }

  // Cancel review
  function cancelReview() {
    setIsReviewingTranscript(false);
    setEditableTranscript("");
    stt.resetTranscript();
  }

  // Clear errors
  function clearError() {
    setError(null);
    stt.clearError();
  }

  const wordCount = countWords(editableTranscript);
  const canSendTranscript = wordCount >= MIN_TRANSCRIPT_WORDS;

  return (
    <main className="flex min-h-screen flex-col bg-neutral-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
              Week {week}
            </p>
            <h1 className="text-lg font-semibold text-white">{weekTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Accessibility toggle */}
            <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
              <input
                type="checkbox"
                checked={showTextInstantly}
                onChange={(e) => setShowTextInstantly(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Show text instantly
            </label>
            <button
              onClick={handleEndWeek}
              disabled={isLoading}
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
            >
              Complete & Return
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-white/50">
                <LoadingDots />
                <span>Starting conversation...</span>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3">
                    <LoadingDots />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error message */}
      {(error || stt.error) && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <p className="text-sm text-red-400">{error || stt.error}</p>
            <button
              onClick={clearError}
              className="text-xs text-red-400/70 hover:text-red-400"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Recording indicator */}
      {stt.isListening && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RecordingIndicator />
                <div>
                  <span className="text-sm font-medium text-red-400">Recording</span>
                  <span className="ml-2 text-sm text-white/60">{formatTime(stt.elapsedTime)}</span>
                </div>
              </div>
              <button
                onClick={stopRecording}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition"
              >
                Stop Recording
              </button>
            </div>
            {stt.currentTranscript && (
              <p className="mt-3 text-sm text-white/60 italic">
                "{stt.currentTranscript}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Transcript review step */}
      {isReviewingTranscript && (
        <div className="border-t border-blue-500/20 bg-blue-500/10 px-6 py-4">
          <div className="mx-auto max-w-3xl space-y-3">
            <p className="text-sm font-medium text-blue-400">Review your message</p>
            <textarea
              ref={transcriptInputRef}
              value={editableTranscript}
              onChange={(e) => setEditableTranscript(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
              placeholder="Your message..."
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/50">
                {wordCount} word{wordCount !== 1 ? "s" : ""}
                {!canSendTranscript && (
                  <span className="ml-2 text-yellow-400">
                    (minimum {MIN_TRANSCRIPT_WORDS} words)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelReview}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={recordAgain}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
                >
                  Record Again
                </button>
                <button
                  onClick={sendTranscript}
                  disabled={!canSendTranscript}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input (hidden during recording/review) */}
      {!stt.isListening && !isReviewingTranscript && (
        <div className="border-t border-white/10 px-6 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type or tap Record..."
                disabled={isLoading || isSending}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none disabled:opacity-50"
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isSending}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
              {stt.isSupported && (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isLoading || isSending}
                  className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
                  aria-label="Start recording"
                >
                  <MicIcon />
                </button>
              )}
              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
                aria-label="Stop Skippy speaking"
              >
                <StopIcon />
              </button>
            </div>
            <p className="mt-2 text-xs text-white/30">
              {stt.isSupported
                ? "Type, press Cmd+Enter, or tap Record to speak"
                : "Press Cmd+Enter to send"}
            </p>
          </form>
        </div>
      )}
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSpeaking = message.state === "speaking";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-white/[0.06] text-white/90"
        }`}
      >
        {isSpeaking ? (
          <div className="flex items-center gap-2 text-white/70">
            <SpeakingIndicator />
            <span>Skippy is speaking...</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/40" />
    </div>
  );
}

function RecordingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
    </div>
  );
}

function SpeakingIndicator() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="h-3 w-1 animate-pulse rounded-full bg-white/50 [animation-delay:-0.3s]" />
      <div className="h-4 w-1 animate-pulse rounded-full bg-white/50 [animation-delay:-0.15s]" />
      <div className="h-3 w-1 animate-pulse rounded-full bg-white/50" />
      <div className="h-4 w-1 animate-pulse rounded-full bg-white/50 [animation-delay:-0.15s]" />
      <div className="h-3 w-1 animate-pulse rounded-full bg-white/50 [animation-delay:-0.3s]" />
    </div>
  );
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Icons
function SendIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
