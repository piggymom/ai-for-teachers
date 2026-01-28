"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeConnection, ConnectionState } from "@/lib/useRealtimeConnection";

// =============================================================================
// OPENAI REALTIME API VOICE-FIRST IMPLEMENTATION
// Rules:
// 1. NO text shown until audio starts streaming
// 2. Transcript appears progressively as audio plays
// 3. User can barge-in by speaking or typing
// 4. Voice is primary, text is optional support
// =============================================================================

// Simplified pipeline states for streaming
type AssistantPipelineStatus =
  | "idle"        // Not yet processed
  | "streaming"   // Audio + transcript streaming
  | "done"        // Complete
  | "error";      // Failed

type Message = {
  id: string;
  role: "user" | "assistant";
  fullText: string;
  revealedText: string;
  status: AssistantPipelineStatus;
  errorMessage: string | null;
};

type SkippyChatProps = {
  week: number;
  weekTitle: string;
};

// Generate unique message ID
let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SkippyChat({ week, weekTitle }: SkippyChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTextInstantly, setShowTextInstantly] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    connectionState: "disconnected" as ConnectionState,
    lastEvent: null as string | null,
    streamingMessageId: null as string | null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Current streaming message tracking
  const streamingMessageIdRef = useRef<string | null>(null);
  const systemPromptRef = useRef<string>("");
  const initCalledRef = useRef(false);

  // Update message by ID
  const updateMessageById = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  // Append to revealed text
  const appendToRevealedText = useCallback((id: string, delta: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, revealedText: msg.revealedText + delta }
          : msg
      )
    );
  }, []);

  // Save message to server (for persistence)
  const saveMessageToServer = useCallback(async (role: "user" | "assistant", content: string) => {
    try {
      await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "save_message",
          week,
          role,
          content,
        }),
      });
    } catch (err) {
      console.error("Failed to save message:", err);
      // Non-blocking - conversation continues
    }
  }, [week]);

  // Realtime connection hook
  const realtime = useRealtimeConnection({
    onConnectionStateChange: (state) => {
      setDebugInfo((prev) => ({ ...prev, connectionState: state }));
      if (state === "error") {
        setError("Connection lost. Please refresh the page.");
      }
    },

    onResponseStart: (_responseId) => {
      // Create streaming assistant message
      const msgId = generateMessageId();
      streamingMessageIdRef.current = msgId;
      setDebugInfo((prev) => ({ ...prev, streamingMessageId: msgId }));

      const newMessage: Message = {
        id: msgId,
        role: "assistant",
        fullText: "",
        revealedText: "",
        status: "streaming",
        errorMessage: null,
      };
      setMessages((prev) => [...prev, newMessage]);
    },

    onTranscriptDelta: (delta, _itemId) => {
      const msgId = streamingMessageIdRef.current;
      if (msgId) {
        appendToRevealedText(msgId, delta);
      }
    },

    onResponseDone: (transcript, _responseId) => {
      const msgId = streamingMessageIdRef.current;
      if (msgId && transcript) {
        updateMessageById(msgId, {
          fullText: transcript,
          revealedText: transcript,
          status: "done",
        });
        // Save to database
        saveMessageToServer("assistant", transcript);
      }
      streamingMessageIdRef.current = null;
      setDebugInfo((prev) => ({ ...prev, streamingMessageId: null }));
      setIsSending(false);
    },

    onUserSpeechStarted: () => {
      // Barge-in: cancel current response
      const msgId = streamingMessageIdRef.current;
      if (msgId) {
        // Remove incomplete message
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        streamingMessageIdRef.current = null;
        setDebugInfo((prev) => ({ ...prev, streamingMessageId: null }));
      }
      realtime.cancelResponse();
      realtime.stopAudio();
    },

    onUserSpeechStopped: () => {
      // VAD detected end of speech - response will start automatically
      setIsRecording(false);
    },

    onError: (err) => {
      console.error("Realtime error:", err);
      setError(err.message);
      const msgId = streamingMessageIdRef.current;
      if (msgId) {
        updateMessageById(msgId, {
          status: "error",
          errorMessage: err.message,
        });
        streamingMessageIdRef.current = null;
      }
      setIsSending(false);
    },
  });

  // Update debug info with last event
  useEffect(() => {
    if (realtime.lastEvent) {
      setDebugInfo((prev) => ({ ...prev, lastEvent: realtime.lastEvent }));
    }
  }, [realtime.lastEvent]);

  // Initialize connection on mount
  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    async function initConnection() {
      try {
        // Fetch context and history
        const res = await fetch("/api/skippy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "start_week", week }),
        });

        if (!res.ok) throw new Error("Failed to load conversation");

        const data = await res.json();

        // Store system prompt for session config
        systemPromptRef.current = data.systemPrompt;

        // Load history
        if (data.history && data.history.length > 0) {
          const historyMsgs = data.history.map(
            (msg: { role: "user" | "assistant"; content: string }, idx: number) => ({
              id: `history_${idx}`,
              role: msg.role,
              fullText: msg.content,
              revealedText: msg.content,
              status: "done" as AssistantPipelineStatus,
              errorMessage: null,
            })
          );
          setMessages(historyMsgs);
        }

        setIsLoading(false);

        // Connect to Realtime API
        if (audioRef.current && data.systemPrompt) {
          await realtime.connect(data.systemPrompt, audioRef.current);
        }

      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to start conversation. Please refresh the page.");
        setIsLoading(false);
      }
    }

    initConnection();
  }, [week, realtime]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when ready
  useEffect(() => {
    if (!isLoading && !isRecording && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isRecording]);

  // Handle input change with barge-in
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Barge-in on typing
      if (e.target.value && streamingMessageIdRef.current) {
        const msgId = streamingMessageIdRef.current;
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        streamingMessageIdRef.current = null;
        realtime.cancelResponse();
        realtime.stopAudio();
      }
    },
    [realtime]
  );

  // Submit text message
  const submitMessage = useCallback(
    async (messageText: string) => {
      const trimmedInput = messageText.trim();
      if (!trimmedInput || isSending || !realtime.isConnected) return;

      setInput("");
      setIsSending(true);
      setError(null);

      // Add user message to UI
      const userMessageId = generateMessageId();
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        fullText: trimmedInput,
        revealedText: trimmedInput,
        status: "done",
        errorMessage: null,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Save user message to server
      saveMessageToServer("user", trimmedInput);

      // Send to Realtime API
      realtime.sendTextMessage(trimmedInput);
    },
    [isSending, realtime, saveMessageToServer]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitMessage(input);
  }

  async function handleEndWeek() {
    realtime.disconnect();
    setIsLoading(true);
    try {
      const res = await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "end_week", week }),
      });
      if (!res.ok) throw new Error("Failed to complete week");
      router.push("/home");
    } catch {
      setError("Failed to mark week complete. Please try again.");
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  async function startRecording() {
    if (!realtime.isConnected) {
      setError("Not connected. Please wait for connection.");
      return;
    }

    // Barge-in if Skippy is speaking
    if (streamingMessageIdRef.current) {
      const msgId = streamingMessageIdRef.current;
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      streamingMessageIdRef.current = null;
      realtime.cancelResponse();
      realtime.stopAudio();
    }

    setIsRecording(true);
    await realtime.startMicrophone();
  }

  function stopRecording() {
    realtime.stopMicrophone();
    setIsRecording(false);
  }

  function clearError() {
    setError(null);
  }

  function retryConnection() {
    if (audioRef.current && systemPromptRef.current) {
      setError(null);
      realtime.connect(systemPromptRef.current, audioRef.current);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-neutral-900 text-white">
      {/* Hidden audio element for WebRTC */}
      <audio ref={audioRef} autoPlay />

      {/* Debug Badge - only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-2 right-2 z-50 rounded bg-black/80 px-2 py-1 text-[10px] font-mono text-white/70 max-w-[200px]">
          <div>Week: {week}</div>
          <div>Connection: {debugInfo.connectionState}</div>
          <div>Recording: {isRecording ? "yes" : "no"}</div>
          {debugInfo.streamingMessageId && <div>Streaming: {debugInfo.streamingMessageId.slice(-6)}</div>}
          {debugInfo.lastEvent && <div>Event: {debugInfo.lastEvent}</div>}
        </div>
      )}

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
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80 disabled:opacity-50"
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
                <MessageBubble
                  key={message.id}
                  message={message}
                  showTextInstantly={showTextInstantly}
                />
              ))}
              {isSending && !streamingMessageIdRef.current && (
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

      {/* Error bar */}
      {error && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <div className="flex gap-2">
              {debugInfo.connectionState === "error" && (
                <button onClick={retryConnection} className="text-xs text-red-400/70 hover:text-red-400">
                  Retry
                </button>
              )}
              <button onClick={clearError} className="text-xs text-red-400/70 hover:text-red-400">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RecordingIndicator />
                <span className="text-sm font-medium text-red-400">Listening...</span>
              </div>
              <button
                onClick={stopRecording}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {!isRecording && (
        <div className="border-t border-white/10 px-6 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={realtime.isConnected ? "Type or tap Record..." : "Connecting..."}
                disabled={isLoading || isSending || !realtime.isConnected}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isSending || !realtime.isConnected}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <SendIcon />
              </button>
              <button
                type="button"
                onClick={startRecording}
                disabled={isLoading || isSending || !realtime.isConnected}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <MicIcon />
              </button>
              <button
                type="button"
                onClick={() => {
                  realtime.cancelResponse();
                  realtime.stopAudio();
                  if (streamingMessageIdRef.current) {
                    const msgId = streamingMessageIdRef.current;
                    setMessages((prev) => prev.filter((m) => m.id !== msgId));
                    streamingMessageIdRef.current = null;
                  }
                }}
                disabled={!streamingMessageIdRef.current}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <StopIcon />
              </button>
            </div>
            <p className="mt-2 text-xs text-white/30">
              {realtime.isConnected
                ? "Type, press Cmd+Enter, or tap Record to speak"
                : "Connecting to voice service..."}
            </p>
          </form>
        </div>
      )}
    </main>
  );
}

// =============================================================================
// MESSAGE BUBBLE
// =============================================================================

type MessageBubbleProps = {
  message: Message;
  showTextInstantly: boolean;
};

function MessageBubble({ message, showTextInstantly }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { status, revealedText, fullText } = message;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white">
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">{fullText}</div>
        </div>
      </div>
    );
  }

  // Assistant message
  const isStreaming = status === "streaming";
  const isDone = status === "done";
  const isError = status === "error";

  // Text to display
  const displayText = showTextInstantly && isDone ? fullText : revealedText;

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3 text-white/90">
        {isStreaming && !displayText && (
          <div className="flex items-center gap-2 text-white/70">
            <SpeakingIndicator />
            <span>Skippy is speaking...</span>
          </div>
        )}

        {(isStreaming || isDone) && displayText && (
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
            {displayText}
            {isStreaming && <span className="animate-pulse">▌</span>}
          </div>
        )}

        {isError && (
          <div className="space-y-2">
            <p className="text-red-400 text-sm">{message.errorMessage || "Something went wrong"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

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
  return <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />;
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

function SendIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
