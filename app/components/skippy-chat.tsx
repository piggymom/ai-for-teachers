"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTTS, useSTT } from "@/lib/useVoice";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SkippyChatProps = {
  week: number;
  weekTitle: string;
};

export function SkippyChat({ week, weekTitle }: SkippyChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingMessageRef = useRef<string | null>(null);

  // TTS hook
  const tts = useTTS({
    onError: (err) => console.warn("TTS error:", err),
  });

  // STT hook with auto-submit on final transcript
  const stt = useSTT({
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        // Store the final transcript for submission
        pendingMessageRef.current = transcript;
      } else {
        // Show interim transcript in input field
        setInput(transcript);
      }
    },
    onStart: () => {
      // Cancel any ongoing TTS when user starts talking
      tts.cancel();
    },
    onEnd: () => {
      // Submit the pending message if we have one
      if (pendingMessageRef.current) {
        const message = pendingMessageRef.current;
        pendingMessageRef.current = null;
        setInput(message);
        // Use setTimeout to ensure state is updated before submission
        setTimeout(() => submitMessage(message), 0);
      }
    },
    onError: (err) => setError(err),
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak new assistant messages
  const lastMessageCountRef = useRef(0);
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      const newMessage = messages[messages.length - 1];
      if (newMessage.role === "assistant") {
        tts.speak(newMessage.content);
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, tts]);

  // Start the week conversation on mount
  useEffect(() => {
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
        setMessages(data.history);
      } catch (err) {
        setError("Failed to load conversation. Please refresh the page.");
        console.error("Start week error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    startWeek();
  }, [week]);

  // Focus input after loading
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Cancel TTS when user starts typing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      // Cancel speech if user starts typing manually
      if (value && tts.isSpeaking) {
        tts.cancel();
      }
    },
    [tts]
  );

  // Submit message function (shared between form submit and voice input)
  const submitMessage = useCallback(
    async (messageText: string) => {
      const trimmedInput = messageText.trim();
      if (!trimmedInput || isSending) return;

      setInput("");
      setIsSending(true);
      setError(null);

      // Optimistically add user message
      const userMessage: Message = { role: "user", content: trimmedInput };
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
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError("Failed to send message. Please try again.");
        // Remove optimistic message on error
        setMessages((prev) => prev.slice(0, -1));
        console.error("Send message error:", err);
      } finally {
        setIsSending(false);
        inputRef.current?.focus();
      }
    },
    [week, isSending]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage(input);
  }

  async function handleEndWeek() {
    tts.cancel(); // Stop any speech before navigating
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

  // Handle Cmd/Ctrl + Enter to submit
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // Toggle voice recording
  function toggleListening() {
    if (stt.isListening) {
      stt.stopListening();
    } else {
      tts.cancel(); // Cancel speech before starting to listen
      stt.startListening();
    }
  }

  // Stop TTS
  function handleStop() {
    tts.cancel();
  }

  // Clear STT error
  function clearError() {
    setError(null);
    stt.clearError();
  }

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
          <button
            onClick={handleEndWeek}
            disabled={isLoading}
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
          >
            Complete & Return
          </button>
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
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isSpeaking={
                    tts.isSpeaking &&
                    index === messages.length - 1 &&
                    message.role === "assistant"
                  }
                />
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

      {/* Listening indicator */}
      {stt.isListening && (
        <div className="border-t border-blue-500/20 bg-blue-500/10 px-6 py-3">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <ListeningIndicator />
            <span className="text-sm text-blue-400">
              Listening...{" "}
              {stt.interimTranscript && (
                <span className="text-white/60">"{stt.interimTranscript}"</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                stt.isListening ? "Listening..." : "Type or tap Talk..."
              }
              disabled={isLoading || isSending || stt.isListening}
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
                onClick={toggleListening}
                disabled={isLoading || isSending}
                className={`rounded-xl px-4 py-3 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 ${
                  stt.isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-label={stt.isListening ? "Stop listening" : "Start voice input"}
              >
                <MicIcon isActive={stt.isListening} />
              </button>
            )}
            {tts.isSupported && (
              <button
                type="button"
                onClick={handleStop}
                disabled={!tts.isSpeaking}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
                aria-label="Stop Skippy speaking"
              >
                <StopIcon />
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-white/30">
            {stt.isSupported
              ? "Type, press Cmd+Enter, or tap the mic to talk"
              : "Press Cmd+Enter to send"}
          </p>
        </form>
      </div>
    </main>
  );
}

function MessageBubble({
  message,
  isSpeaking,
}: {
  message: Message;
  isSpeaking?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-white/[0.06] text-white/90"
        }`}
      >
        <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
          {message.content}
        </div>
        {isSpeaking && (
          <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
            <SpeakingIndicator />
            <span>Speaking...</span>
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

function ListeningIndicator() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="h-3 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:-0.3s]" />
      <div className="h-4 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:-0.15s]" />
      <div className="h-3 w-1 animate-pulse rounded-full bg-blue-400" />
      <div className="h-4 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:-0.15s]" />
      <div className="h-3 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:-0.3s]" />
    </div>
  );
}

function SpeakingIndicator() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="h-2 w-0.5 animate-pulse rounded-full bg-white/50 [animation-delay:-0.3s]" />
      <div className="h-3 w-0.5 animate-pulse rounded-full bg-white/50 [animation-delay:-0.15s]" />
      <div className="h-2 w-0.5 animate-pulse rounded-full bg-white/50" />
    </div>
  );
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

function MicIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={isActive ? "currentColor" : "none"}
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
