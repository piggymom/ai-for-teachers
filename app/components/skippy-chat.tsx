"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [showAiConsent, setShowAiConsent] = useState(false);
  const [aiConsentChecked, setAiConsentChecked] = useState(false);

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
        // Check if user has already granted AI processing consent
        const consentRes = await fetch("/api/consent?type=ai_processing");
        if (consentRes.ok) {
          const consentData = await consentRes.json();
          const hasAiConsent = consentData.consents?.length > 0;
          if (!hasAiConsent) {
            setShowAiConsent(true);
            setIsLoading(false);
            return; // Wait for consent before initializing
          }
        }

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
    if (!confirm("Ready to finish this session? Your artifacts will be saved.")) return;
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

  async function handleAcceptAiConsent() {
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ai_processing", version: "1.0" }),
      });
      setShowAiConsent(false);
      setIsLoading(true);

      // Now initialize the conversation
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
      fetchLedger();

      if (!data.resumed && data.history?.length === 0) {
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
      console.error("Consent/init error:", err);
      setError("Failed to start");
      setIsLoading(false);
    }
  }

  const canSend = isReady && !isSending;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <main className="flex min-h-screen flex-col bg-white">

      {/* Header — clean, minimal */}
      <header className="border-b border-[#f3f4f6] px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/home"
              className="text-[#9ca3af] hover:text-[#4b5563] transition-colors p-1"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-widest">Week {week}</p>
              <h1 className="text-[16px] font-medium text-[#111827]">{weekTitle}</h1>
            </div>
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
              className="px-4 py-2 text-[#4b5563] hover:text-[#111827] text-[13px] font-medium rounded-lg border border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              Finish Session
            </button>
          </div>
        </div>
      </header>

      {/* AI Consent Banner — shown once before first conversation */}
      {showAiConsent && (
        <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-6 py-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-[16px] font-medium text-[#111827]">Before you start</h2>
            <p className="text-[14px] leading-relaxed text-[#4b5563]">
              Skippy is powered by Claude, an AI from Anthropic. Here&apos;s what to know:
            </p>
            <ul className="text-[14px] text-[#4b5563] space-y-2 list-disc pl-5">
              <li>Your messages are processed by AI to generate personalized responses</li>
              <li>Your professional profile helps tailor the experience to you</li>
              <li>Your readiness level is assessed to adjust conversation complexity</li>
              <li>Conversations are stored so you can pick up where you left off</li>
            </ul>
            <p className="text-[13px] font-medium text-[#b91c1c]">
              Please do not share student names or identifiable student information.
            </p>
            <p className="text-[13px] text-[#9ca3af]">
              Learn more:{" "}
              <Link href="/legal/ai-disclosure" className="text-[#20B2AA] hover:underline" target="_blank">
                AI Disclosure
              </Link>
              {" "}&middot;{" "}
              <Link href="/legal/privacy" className="text-[#20B2AA] hover:underline" target="_blank">
                Privacy Policy
              </Link>
            </p>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aiConsentChecked}
                onChange={(e) => setAiConsentChecked(e.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db] text-[#20B2AA] focus:ring-[#20B2AA]/25 cursor-pointer"
              />
              <span className="text-[13px] text-[#4b5563]">I understand and want to continue</span>
            </label>
            <button
              onClick={handleAcceptAiConsent}
              disabled={!aiConsentChecked}
              className="rounded-lg bg-[#20B2AA] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#1a9b94] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-16 text-[#9ca3af]">
              <LoadingDots /> <span className="ml-3 text-[14px]">Starting...</span>
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
                  <div className="rounded-2xl rounded-bl-md bg-[#f9fafb] px-4 py-3 text-[#4b5563]">
                    <LoadingDots /> <span className="ml-2 text-[14px]">Thinking...</span>
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
        <div className="border-t border-red-100 bg-red-50 px-6 py-3">
          <div className="mx-auto flex max-w-3xl justify-between">
            <span className="text-[13px] text-red-600">{error}</span>
            <button onClick={() => setError(null)} className="text-[12px] text-red-400 hover:text-red-600">Dismiss</button>
          </div>
        </div>
      )}

      {/* Input — Perplexity-style clean input */}
      <div className="border-t border-[#f3f4f6] px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-grow textarea
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={isSending ? "Skippy is thinking..." : "Type your message..."}
            disabled={isLoading || isSending}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[15px] text-[#111827] placeholder-[#d1d5db] focus:outline-none focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA]/10 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || !canSend}
            className={`rounded-xl px-4 py-3 transition-colors ${
              input.trim() && canSend
                ? "bg-[#20B2AA] hover:bg-[#1a9b94]"
                : "bg-[#f3f4f6] disabled:opacity-30"
            }`}
          >
            <SendIcon active={!!(input.trim() && canSend)} />
          </button>
        </form>
        <p className="mt-2 text-[11px] text-[#d1d5db] text-center">
          {typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl'}+Enter to send &middot; Skippy is AI-powered — review responses before classroom use &middot; Do not share student names
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
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#20B2AA] px-4 py-3 text-white">
          {text.split('\n\n').map((paragraph, pIndex) => (
            <p key={pIndex} className={`text-[15px] ${pIndex > 0 ? 'mt-3' : ''}`}>
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

      {/* Message */}
      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#f9fafb] px-4 py-3 text-[#111827]">
        {text ? (
          <>
            {text.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className={`text-[15px] leading-relaxed ${pIndex > 0 ? 'mt-3' : ''}`}>
                {paragraph}
              </p>
            ))}
            {isStreaming && <span className="animate-pulse text-[#d1d5db]">|</span>}
          </>
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-[#9ca3af]">
            <LoadingDots />
            <span className="text-[14px]">Skippy is speaking...</span>
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
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d1d5db] [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d1d5db] [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d1d5db]" />
    </span>
  );
}

function SendIcon({ active = false }: { active?: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? "text-white" : "text-[#9ca3af]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

// Voice icons preserved for re-enable (VOICE_ENABLED flag)
// function MicIcon() { ... }
// function StopIcon() { ... }
