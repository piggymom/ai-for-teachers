"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeConnection } from "@/lib/useRealtimeConnection";

// =============================================================================
// SIMPLIFIED: Show text as it arrives via onTranscriptDelta
// =============================================================================

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming: boolean;
};

export function SkippyChat({ week, weekTitle }: { week: number; weekTitle: string }) {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // =============================================================================
  // REALTIME CONNECTION
  // =============================================================================

  const realtime = useRealtimeConnection({
    onConnectionStateChange: (state) => {
      if (state === "error") setError("Connection lost");
    },

    onResponseStart: () => {
      console.log("[UI] Response starting");
      // Create empty assistant message
      const id = genId();
      activeMessageIdRef.current = id;
      setMessages(prev => [...prev, { id, role: "assistant", text: "", isStreaming: true }]);
    },

    onTranscriptDelta: (delta, fullText) => {
      // Update the message text as it streams in
      const id = activeMessageIdRef.current;
      if (id) {
        console.log("[UI] Text delta, total:", fullText.length);
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
  }, [week, realtime]);

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
      router.push("/home");
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
    <main className="flex min-h-screen flex-col bg-neutral-900 text-white">
      <audio ref={audioRef} autoPlay playsInline />

      {/* Debug */}
      <div className="fixed top-2 right-2 z-50 rounded bg-black/80 px-2 py-1 text-[10px] font-mono text-white/70">
        <div>Turn: {realtime.turnId} | {realtime.turnState}</div>
        <div>Conn: {realtime.connectionState}</div>
        {realtime.lastEvent && <div>Event: {realtime.lastEvent}</div>}
      </div>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">Week {week}</p>
            <h1 className="text-lg font-semibold">{weekTitle}</h1>
          </div>
          <button
            onClick={handleEndWeek}
            disabled={isLoading}
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 hover:border-white/30 disabled:opacity-50"
          >
            Complete & Return
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-12 text-white/50">
              <LoadingDots /> <span className="ml-3">Starting...</span>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isThinking && !activeMessageIdRef.current && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3 text-white/70">
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
        <div className="border-t border-white/10 px-6 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={realtime.isConnected ? (isSpeaking ? "Type to interrupt..." : "Type or record...") : "Connecting..."}
              disabled={isLoading || !realtime.isConnected}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !canSend}
              className="rounded-xl bg-white/10 px-4 py-3 disabled:opacity-50"
            >
              <SendIcon />
            </button>
            <button
              type="button"
              onClick={startRecording}
              disabled={isLoading || !realtime.isConnected}
              className="rounded-xl bg-white/10 px-4 py-3 disabled:opacity-50"
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
              className="rounded-xl bg-white/10 px-4 py-3 disabled:opacity-50"
            >
              <StopIcon />
            </button>
          </form>
          <p className="mt-2 text-xs text-white/30 text-center">
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

function MessageBubble({ message }: { message: Message }) {
  const { role, text, isStreaming } = message;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3">
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3 text-white/90">
        {text ? (
          <div className="whitespace-pre-wrap">
            {text}
            {isStreaming && <span className="animate-pulse text-white/50">|</span>}
          </div>
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-white/70">
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
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" />
    </span>
  );
}

function SendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
