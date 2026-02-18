"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SkippyAvatar } from "./skippy-avatar";
import { ChatPhaseIndicator } from "./chat-phase-indicator";
import { LedgerDebugPanel } from "./debug/ledger-debug-panel";

// Feature flag: set to true to re-enable voice/realtime
const VOICE_ENABLED = false;

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming: boolean;
};

type Phase = "discover" | "build" | "refine" | "reflect" | "save" | "bridge";

export function SkippyChat({ week, weekTitle }: { week: number; weekTitle: string }) {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase>("discover");
  const [isReady, setIsReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initCalledRef = useRef(false);

  // Generate message ID
  const nextId = useRef(0);
  const genId = () => `msg_${++nextId.current}`;

  // Fetch ledger to get current phase
  const fetchLedger = useCallback(async () => {
    try {
      const res = await fetch(`/api/ledger?weekNumber=${week}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ledger?.currentPhase) {
          setCurrentPhase(data.ledger.currentPhase as Phase);
        }
      }
    } catch {
      // Ignore errors
    }
  }, [week]);

  // =============================================================================
  // TEXT-ONLY: Send message via standard API
  // =============================================================================

  const sendTextMessage = useCallback(async (text: string) => {
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "user_message", week, message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || "Failed to send message");
      }

      const data = await res.json();
      const assistantText = data.response || "";

      // Add assistant response
      setMessages(prev => [...prev, {
        id: genId(),
        role: "assistant",
        text: assistantText,
        isStreaming: false,
      }]);

      // Refresh ledger after each exchange
      fetchLedger();
    } catch (err) {
      console.error("[CHAT] Send error:", err);
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setIsSending(false);
    }
  }, [week, fetchLedger]);

  // =============================================================================
  // INIT
  // =============================================================================

  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    async function init() {
      try {
        const res = await fetch("/api/skippy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "start_week", week }),
        });

        if (!res.ok) throw new Error("Load failed");

        const data = await res.json();

        if (data.history?.length > 0) {
          setMessages(data.history.map((m: { role: string; content: string }, i: number) => ({
            id: `hist_${i}`,
            role: m.role as "user" | "assistant",
            text: m.content,
            isStreaming: false,
          })));
        }

        setIsLoading(false);
        setIsReady(true);

        // Fetch initial ledger state
        fetchLedger();

        // If new conversation, get opening message via text API
        if (!data.resumed && data.history?.length === 0) {
          // Send an empty-ish init to get the opening message
          // The start_week already set up the system prompt with opening instructions
          // We trigger a user_message with a start signal
          const openRes = await fetch("/api/skippy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "user_message", week, message: "[Session starting — deliver your opening message for this week]" }),
          });
          if (openRes.ok) {
            const openData = await openRes.json();
            if (openData.response) {
              setMessages([{
                id: genId(),
                role: "assistant",
                text: openData.response,
                isStreaming: false,
              }]);
            }
          }
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to start");
        setIsLoading(false);
      }
    }

    init();
  }, [week, fetchLedger, sendTextMessage]);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus
  useEffect(() => {
    if (!isLoading && !isSending) {
      inputRef.current?.focus();
    }
  }, [isLoading, isSending]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !isReady || isSending) return;

    setInput("");

    // Add user message
    setMessages(prev => [...prev, { id: genId(), role: "user", text, isStreaming: false }]);
    sendTextMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  async function handleEndWeek() {
    setIsLoading(true);
    try {
      await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "end_week", week }),
      });
      router.push(`/home?completed=${week}`);
    } catch {
      setError("Failed to complete");
      setIsLoading(false);
    }
  }

  const canSend = isReady && !isSending;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">

      {/* Header */}
      <header className="border-b border-[#262626] px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs text-[#737373] uppercase tracking-wider">Week {week}</p>
            <h1 className="text-lg font-semibold text-[#fafafa]">{weekTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Phase indicator - hidden on mobile */}
            <div className="hidden md:block">
              <ChatPhaseIndicator currentPhase={currentPhase} />
            </div>

            {/* Finish button */}
            <button
              onClick={handleEndWeek}
              disabled={isLoading}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1a1] hover:text-[#fafafa] text-sm font-medium rounded-lg border border-[#333333] transition-colors disabled:opacity-50"
            >
              Finish Session →
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-12 text-[#737373]">
              <LoadingDots /> <span className="ml-3">Starting...</span>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastAssistant={false}
                  isSpeaking={false}
                />
              ))}

              {isSending && (
                <div className="flex justify-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <SkippyAvatar state="thinking" size="sm" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-[#1a1a1a] px-4 py-3 text-[#a1a1a1] border border-[#262626]">
                    <LoadingDots /> <span className="ml-2">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-3">
          <div className="mx-auto flex max-w-3xl justify-between">
            <span className="text-sm text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="text-xs text-red-400/70">Dismiss</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#262626] px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isSending ? "Skippy is thinking..." : "Type your message..."}
            disabled={isLoading || isSending}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[#333333] bg-[#141414] px-4 py-3 text-[#fafafa] placeholder-[#525252] focus:outline-none focus:border-[#3b82f6] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || !canSend}
            className="rounded-xl bg-[#262626] hover:bg-[#333333] px-4 py-3 disabled:opacity-50 transition-colors"
          >
            <SendIcon />
          </button>
        </form>
        <p className="mt-2 text-xs text-[#525252] text-center">
          Cmd+Enter to send
        </p>
      </div>

      {/* Debug panel - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <LedgerDebugPanel weekNumber={week} />
      )}
    </main>
  );
}

// =============================================================================
// MESSAGE BUBBLE
// =============================================================================

function MessageBubble({
  message,
  isLastAssistant,
  isSpeaking
}: {
  message: Message;
  isLastAssistant: boolean;
  isSpeaking: boolean;
}) {
  const { role, text, isStreaming } = message;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#3b82f6] px-4 py-3 text-white">
          {text.split('\n\n').map((paragraph, pIndex) => (
            <p key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Determine Skippy's state based on message state
  const skippyState = isLastAssistant && isStreaming
    ? (isSpeaking ? "speaking" : "thinking")
    : "idle";

  return (
    <div className="flex justify-start gap-3">
      {/* Skippy avatar */}
      <div className="flex-shrink-0 mt-1">
        <SkippyAvatar state={skippyState} size="sm" />
      </div>

      {/* Message bubble */}
      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#1a1a1a] px-4 py-3 text-[#e5e5e5] border border-[#262626]">
        {text ? (
          <>
            {text.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
                {paragraph}
              </p>
            ))}
            {isStreaming && <span className="animate-pulse text-[#525252]">|</span>}
          </>
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-[#a1a1a1]">
            <LoadingDots />
            <span>Skippy is speaking...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// =============================================================================
// ICONS
// =============================================================================

function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#525252] [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#525252] [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#525252]" />
    </span>
  );
}

function SendIcon() {
  return (
    <svg className="h-5 w-5 text-[#a1a1a1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

// Voice icons preserved for re-enable (VOICE_ENABLED flag)
// function MicIcon() { ... }
// function StopIcon() { ... }
