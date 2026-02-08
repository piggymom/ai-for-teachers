"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeConnection } from "@/lib/useRealtimeConnection";
import { SkippyAvatar } from "./skippy-avatar";
import { ChatPhaseIndicator } from "./chat-phase-indicator";

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
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase>("discover");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeMessageIdRef = useRef<string | null>(null);
  const pendingVoiceMessageIdRef = useRef<string | null>(null);
  const initCalledRef = useRef(false);

  // Generate message ID
  const nextId = useRef(0);
  const genId = () => `msg_${++nextId.current}`;

  // Save to server
  const saveMessage = useCallback(async (role: "user" | "assistant", content: string) => {
    if (!content) return;
    try {
      await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "save_message", week, role, content }),
      });
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, [week]);

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
  // REALTIME CONNECTION
  // =============================================================================

  const realtime = useRealtimeConnection({
    onConnectionStateChange: (state) => {
      if (state === "error") setError("Connection lost");
    },

    onResponseStart: () => {
      console.log("[UI] Response starting");
      const id = genId();
      activeMessageIdRef.current = id;
      setMessages(prev => [...prev, { id, role: "assistant", text: "", isStreaming: true }]);
    },

    onTranscriptDelta: (delta, fullText) => {
      // Show text immediately as it arrives
      const id = activeMessageIdRef.current;
      if (id) {
        console.log("[UI] Transcript delta, length:", fullText.length);
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, text: fullText } : m
        ));
      }
    },

    onResponseDone: (text) => {
      console.log("[UI] Response done, text:", text.length);
      const id = activeMessageIdRef.current;
      if (id) {
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, text: text || m.text, isStreaming: false } : m
        ));
        if (text) saveMessage("assistant", text);
        activeMessageIdRef.current = null;
        // Refresh ledger after each exchange
        fetchLedger();
      }
    },

    onError: (err) => {
      console.error("[UI] Error:", err);
      setError(err.message);
      const id = activeMessageIdRef.current;
      if (id) {
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, isStreaming: false } : m
        ));
        activeMessageIdRef.current = null;
      }
    },

    onUserTranscript: (transcript) => {
      console.log("[UI] User transcript:", transcript);
      const id = pendingVoiceMessageIdRef.current;
      if (id && transcript) {
        // Update the pending voice message with the transcript
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, text: transcript, isStreaming: false } : m
        ));
        saveMessage("user", transcript);
        pendingVoiceMessageIdRef.current = null;
      } else if (transcript) {
        // No pending message, create one
        const newId = genId();
        setMessages(prev => [...prev, { id: newId, role: "user", text: transcript, isStreaming: false }]);
        saveMessage("user", transcript);
      }
    },
  });

  // =============================================================================
  // INIT
  // =============================================================================

  const needsOpeningRef = useRef(false);

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

        // If this is a new conversation (not resumed), we'll need to trigger the opening
        needsOpeningRef.current = !data.resumed && data.history?.length === 0;

        setIsLoading(false);

        // Fetch initial ledger state
        fetchLedger();

        if (audioRef.current) {
          await realtime.connect(week, audioRef.current);
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to start");
        setIsLoading(false);
      }
    }

    init();
  }, [week, realtime, fetchLedger]);

  // Trigger opening message after realtime connects (for new conversations)
  useEffect(() => {
    if (realtime.isConnected && needsOpeningRef.current) {
      needsOpeningRef.current = false;
      realtime.triggerResponse();
    }
  }, [realtime.isConnected, realtime]);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus
  useEffect(() => {
    if (!isLoading && realtime.turnState === "idle") {
      inputRef.current?.focus();
    }
  }, [isLoading, realtime.turnState]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !realtime.isConnected || realtime.isResponseInFlight()) return;

    setInput("");
    setError(null);

    // Finalize any previous
    if (activeMessageIdRef.current) {
      setMessages(prev => prev.map(m =>
        m.id === activeMessageIdRef.current ? { ...m, isStreaming: false } : m
      ));
      activeMessageIdRef.current = null;
    }

    // Add user message
    setMessages(prev => [...prev, { id: genId(), role: "user", text, isStreaming: false }]);
    saveMessage("user", text);
    realtime.sendTextMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  async function handleEndWeek() {
    realtime.disconnect();
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

  async function startRecording() {
    if (!realtime.isConnected) return;
    if (realtime.hasActiveResponse()) {
      realtime.cancelResponse();
      realtime.stopAudio();
    }

    // Create a placeholder user message for voice recording
    const id = genId();
    pendingVoiceMessageIdRef.current = id;
    setMessages(prev => [...prev, { id, role: "user", text: "Recording...", isStreaming: true }]);

    await realtime.startMicrophone();
  }

  function stopRecording() {
    realtime.stopMicrophone();
    // Update placeholder to show "Processing..."
    const id = pendingVoiceMessageIdRef.current;
    if (id) {
      setMessages(prev => prev.map(m =>
        m.id === id ? { ...m, text: "Processing..." } : m
      ));

      // Fallback: if transcript doesn't arrive in 10s, show error
      setTimeout(() => {
        if (pendingVoiceMessageIdRef.current === id) {
          console.warn("[UI] Transcript timeout - clearing stuck message");
          setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, text: "(Recording failed - try again)", isStreaming: false } : m
          ));
          pendingVoiceMessageIdRef.current = null;
        }
      }, 10000);
    }
  }

  const isRecording = realtime.turnState === "listening";
  const isThinking = realtime.turnState === "thinking";
  const isSpeaking = realtime.turnState === "speaking";
  const canSend = realtime.isConnected && !realtime.isResponseInFlight();

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <audio ref={audioRef} autoPlay playsInline />

      {/* Debug - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 right-2 z-50 rounded bg-black/80 px-2 py-1 text-[10px] font-mono text-white/70">
          <div>Turn: {realtime.turnId} | {realtime.turnState}</div>
          <div>Conn: {realtime.connectionState}</div>
          {realtime.lastEvent && <div>Event: {realtime.lastEvent}</div>}
        </div>
      )}

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
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastAssistant={msg.role === "assistant" && index === messages.length - 1}
                  isSpeaking={isSpeaking}
                />
              ))}

              {isThinking && !activeMessageIdRef.current && (
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

      {/* Recording */}
      {isRecording && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-4">
          <div className="mx-auto max-w-3xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-red-400">Listening...</span>
            </div>
            <button onClick={stopRecording} className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      {!isRecording && (
        <div className="border-t border-[#262626] px-6 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={realtime.isConnected ? (isSpeaking ? "Type to interrupt..." : "Type or record...") : "Connecting..."}
              disabled={isLoading || !realtime.isConnected}
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
            <button
              type="button"
              onClick={startRecording}
              disabled={isLoading || !realtime.isConnected}
              className="rounded-xl bg-[#262626] hover:bg-[#333333] px-4 py-3 disabled:opacity-50 transition-colors"
            >
              <MicIcon />
            </button>
            <button
              type="button"
              onClick={() => {
                realtime.cancelResponse();
                realtime.stopAudio();
              }}
              disabled={!isSpeaking}
              className="rounded-xl bg-[#262626] hover:bg-[#333333] px-4 py-3 disabled:opacity-50 transition-colors"
            >
              <StopIcon />
            </button>
          </form>
          <p className="mt-2 text-xs text-[#525252] text-center">
            {realtime.isConnected ? "Cmd+Enter to send" : "Connecting..."}
          </p>
        </div>
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

function MicIcon() {
  return (
    <svg className="h-5 w-5 text-[#a1a1a1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="h-5 w-5 text-[#a1a1a1]" fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
