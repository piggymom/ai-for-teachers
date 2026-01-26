"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedInput = input.trim();
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
  }

  async function handleEndWeek() {
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
                <MessageBubble key={index} message={message} />
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
      {error && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-3">
          <p className="mx-auto max-w-3xl text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading || isSending}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isSending}
              className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-white/30">
            Press Cmd+Enter to send
          </p>
        </form>
      </div>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
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
