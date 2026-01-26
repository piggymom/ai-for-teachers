"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSTT, formatTime } from "@/lib/useVoice";

// =============================================================================
// STRICT VOICE-FIRST IMPLEMENTATION
// Rules:
// 1. NEVER render assistant fullText until audio.onplay fires
// 2. revealedText starts empty and only populates during/after playback
// 3. Error state requires user action (Retry or Show Text button)
// =============================================================================

// Explicit pipeline states for assistant messages
type AssistantPipelineStatus =
  | "idle"           // Initial state, not yet processed
  | "requesting"     // Fetching Skippy response + TTS
  | "audio_ready"    // Audio URL exists, not playing yet
  | "playing"        // Audio has fired onplay, text revealing
  | "done"           // Audio ended, full text visible
  | "error";         // Error occurred, show retry UI

type Message = {
  id: string;
  role: "user" | "assistant";
  // For user messages: content is displayed directly
  // For assistant messages: ONLY revealedText is rendered, NEVER fullText
  fullText: string;
  revealedText: string;
  status: AssistantPipelineStatus;
  audioUrl: string | null;
  duration: number | null;
  errorMessage: string | null;
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

  // Recording review state
  const [isReviewingTranscript, setIsReviewingTranscript] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState("");

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    pipelineStatus: "idle" as AssistantPipelineStatus,
    audioReady: false,
    audioPlaying: false,
    revealedLength: 0,
    fullTextLength: 0,
    lastError: null as string | null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptInputRef = useRef<HTMLTextAreaElement>(null);

  // Audio management refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const currentFullTextRef = useRef<string>("");
  const playedMessageIdsRef = useRef<Set<string>>(new Set());
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // CRITICAL: Track if playback has started for current message
  // Once true, NEVER set error state - message is considered successful
  const hasStartedPlaybackRef = useRef(false);
  // Track messages that have successfully played (immune to error)
  const successfulMessageIdsRef = useRef<Set<string>>(new Set());

  // Update message by ID
  const updateMessageById = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  // Stop RAF loop
  const stopRevealLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // RAF-based text reveal synced to audio time
  const runRevealLoop = useCallback(() => {
    const audio = audioRef.current;
    const msgId = currentMessageIdRef.current;
    const fullText = currentFullTextRef.current;

    if (!audio || !msgId || !fullText) return;

    const duration = audio.duration;
    if (!duration || !isFinite(duration) || duration === 0) {
      rafIdRef.current = requestAnimationFrame(runRevealLoop);
      return;
    }

    const progress = Math.min(audio.currentTime / duration, 1);
    const revealedCharCount = Math.floor(progress * fullText.length);
    const revealedText = fullText.slice(0, revealedCharCount);

    updateMessageById(msgId, { revealedText });
    setDebugInfo((prev) => ({
      ...prev,
      revealedLength: revealedCharCount,
      fullTextLength: fullText.length,
    }));

    if (!audio.paused && !audio.ended) {
      rafIdRef.current = requestAnimationFrame(runRevealLoop);
    }
  }, [updateMessageById]);

  // Cleanup audio - DO NOT remove handlers (they have guards), just stop playback
  const cleanupAudio = useCallback(() => {
    stopRevealLoop();

    if (audioRef.current) {
      const audio = audioRef.current;
      // Mark current message as done BEFORE clearing src (prevents spurious onerror)
      const msgId = currentMessageIdRef.current;
      if (msgId && hasStartedPlaybackRef.current) {
        // Message already started playing, ensure it stays successful
        successfulMessageIdsRef.current.add(msgId);
      }
      audio.pause();
      // Clear src - onerror may fire but will be ignored due to guards
      audio.src = "";
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }

    // Reset playback tracking for next message
    hasStartedPlaybackRef.current = false;
  }, [stopRevealLoop]);

  // Initialize audio element with proper state guards
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      const msgId = currentMessageIdRef.current;
      console.log(`[AUDIO] onloadedmetadata msgId=${msgId} duration=${audio.duration}`);
      if (msgId && audio.duration) {
        updateMessageById(msgId, { duration: audio.duration });
      }
      setDebugInfo((prev) => ({ ...prev, audioReady: true }));
    };

    audio.onplay = () => {
      const msgId = currentMessageIdRef.current;
      const fullText = currentFullTextRef.current;
      console.log(`[AUDIO] onplay msgId=${msgId} hasStarted=${hasStartedPlaybackRef.current}`);

      if (msgId && fullText) {
        // CRITICAL: Mark playback as started - this message is now immune to error
        hasStartedPlaybackRef.current = true;
        successfulMessageIdsRef.current.add(msgId);

        // VOICE-FIRST: Only NOW populate fullText in state and start reveal
        updateMessageById(msgId, {
          fullText,
          status: "playing",
          revealedText: "", // Start empty, RAF will populate
        });
        setDebugInfo((prev) => ({
          ...prev,
          pipelineStatus: "playing",
          audioPlaying: true,
          fullTextLength: fullText.length,
        }));
        rafIdRef.current = requestAnimationFrame(runRevealLoop);
      }
    };

    audio.onended = () => {
      const msgId = currentMessageIdRef.current;
      const fullText = currentFullTextRef.current;
      console.log(`[AUDIO] onended msgId=${msgId}`);

      stopRevealLoop();

      if (msgId) {
        // Always transition to done, never error (playback completed)
        updateMessageById(msgId, {
          status: "done",
          revealedText: fullText,
        });
        setDebugInfo((prev) => ({
          ...prev,
          pipelineStatus: "done",
          audioPlaying: false,
          revealedLength: fullText.length,
        }));
      }
    };

    audio.onpause = () => {
      console.log(`[AUDIO] onpause`);
      stopRevealLoop();
      setDebugInfo((prev) => ({ ...prev, audioPlaying: false }));
    };

    audio.onerror = (e) => {
      const msgId = currentMessageIdRef.current;
      const hasStarted = hasStartedPlaybackRef.current;
      const isSuccessful = msgId ? successfulMessageIdsRef.current.has(msgId) : false;
      console.log(`[AUDIO] onerror msgId=${msgId} hasStarted=${hasStarted} isSuccessful=${isSuccessful} error=`, e);

      stopRevealLoop();

      // DO NOT set error state from onerror - it fires spuriously
      // Error handling is done in play().catch() which is more reliable
      // Just log for debugging
      console.log(`[AUDIO] onerror ignored - relying on play().catch() for error handling`);
    };

    return () => {
      // Cleanup on unmount - handlers already removed in cleanupAudio
      cleanupAudio();
      audioRef.current = null;
    };
  }, [updateMessageById, runRevealLoop, stopRevealLoop, cleanupAudio]);

  // Stop speaking and reveal full text
  const stopSpeaking = useCallback(() => {
    cleanupAudio();

    const msgId = currentMessageIdRef.current;
    const fullText = currentFullTextRef.current;

    if (msgId && fullText) {
      updateMessageById(msgId, {
        status: "done",
        fullText,
        revealedText: fullText,
      });
    }

    setDebugInfo((prev) => ({
      ...prev,
      pipelineStatus: "done",
      audioPlaying: false,
      audioReady: false,
    }));
  }, [cleanupAudio, updateMessageById]);

  // Process assistant message through voice-first pipeline
  const processAssistantMessage = useCallback(
    async (text: string, messageId: string) => {
      // Idempotency check
      if (playedMessageIdsRef.current.has(messageId)) {
        return;
      }
      playedMessageIdsRef.current.add(messageId);

      // Cleanup any existing audio
      cleanupAudio();

      // Store text in refs ONLY (not in message state)
      currentMessageIdRef.current = messageId;
      currentFullTextRef.current = text;

      // Update debug
      setDebugInfo((prev) => ({
        ...prev,
        pipelineStatus: "requesting",
        audioReady: false,
        audioPlaying: false,
        revealedLength: 0,
        fullTextLength: text.length,
        lastError: null,
      }));

      // If instant mode, skip voice pipeline entirely
      if (showTextInstantly) {
        updateMessageById(messageId, {
          fullText: text,
          revealedText: text,
          status: "done",
        });
        setDebugInfo((prev) => ({ ...prev, pipelineStatus: "done" }));
        return;
      }

      // Update message to requesting state (still no text visible)
      updateMessageById(messageId, { status: "requesting" });

      try {
        const abortController = new AbortController();
        ttsAbortControllerRef.current = abortController;

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error(`TTS request failed: ${res.status}`);
        }

        if (abortController.signal.aborted) return;

        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = audioUrl;

        // Verify still current message
        if (currentMessageIdRef.current !== messageId) {
          URL.revokeObjectURL(audioUrl);
          return;
        }

        // Update to audio_ready state (still no text visible!)
        updateMessageById(messageId, {
          status: "audio_ready",
          audioUrl,
        });
        setDebugInfo((prev) => ({ ...prev, pipelineStatus: "audio_ready" }));

        if (!audioRef.current) return;

        // Set source and play - onplay will trigger text reveal
        audioRef.current.src = audioUrl;

        try {
          await audioRef.current.play();
        } catch (playErr) {
          const errMsg = playErr instanceof Error ? playErr.message : String(playErr);
          console.log(`[AUDIO] play() threw: "${errMsg}" hasStarted=${hasStartedPlaybackRef.current}`);

          // Ignore "interrupted" errors - these happen when play() is called again quickly
          // or when src changes during loading. Not actual failures.
          const isInterrupted = errMsg.toLowerCase().includes("interrupted") ||
                               errMsg.toLowerCase().includes("aborted");

          // CRITICAL: Only set error if:
          // 1. Playback hasn't started (onplay never fired)
          // 2. Not already marked successful
          // 3. Not an "interrupted" error (which is benign)
          if (!hasStartedPlaybackRef.current &&
              !successfulMessageIdsRef.current.has(messageId) &&
              !isInterrupted) {
            console.log(`[AUDIO] Setting error from play().catch() for msgId=${messageId}`);
            updateMessageById(messageId, {
              status: "error",
              errorMessage: errMsg,
              fullText: text,
            });
            setDebugInfo((prev) => ({
              ...prev,
              pipelineStatus: "error",
              lastError: errMsg,
            }));
          } else {
            console.log(`[AUDIO] Ignoring play() error - hasStarted=${hasStartedPlaybackRef.current} isInterrupted=${isInterrupted}`);
          }
        }

      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        // This catch handles TTS fetch errors, not audio playback errors
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.warn("TTS fetch error:", err);

        updateMessageById(messageId, {
          status: "error",
          errorMessage,
          fullText: text, // Store for "Show Text" fallback
        });
        setDebugInfo((prev) => ({
          ...prev,
          pipelineStatus: "error",
          lastError: errorMessage,
        }));
      }
    },
    [cleanupAudio, showTextInstantly, updateMessageById]
  );

  // Create assistant message placeholder (voice-first: no text content)
  const addAssistantMessage = useCallback(
    (text: string, shouldSpeak: boolean = true) => {
      const messageId = generateMessageId();

      // VOICE-FIRST: Message starts with EMPTY fullText and revealedText
      // Text only appears after audio.onplay fires
      const newMessage: Message = {
        id: messageId,
        role: "assistant",
        fullText: "", // EMPTY - will be set on audio.onplay
        revealedText: "", // EMPTY - will be populated by RAF loop
        status: shouldSpeak && !showTextInstantly ? "requesting" : "done",
        audioUrl: null,
        duration: null,
        errorMessage: null,
      };

      // For instant mode, populate immediately
      if (!shouldSpeak || showTextInstantly) {
        newMessage.fullText = text;
        newMessage.revealedText = text;
        newMessage.status = "done";
      }

      setMessages((prev) => [...prev, newMessage]);

      if (shouldSpeak) {
        // Process through voice pipeline (will store text in refs, not state)
        setTimeout(() => processAssistantMessage(text, messageId), 0);
      }

      return messageId;
    },
    [showTextInstantly, processAssistantMessage]
  );

  // Retry failed audio
  const retryAudio = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (msg && msg.fullText) {
      // Reset state and retry
      playedMessageIdsRef.current.delete(messageId);
      updateMessageById(messageId, {
        status: "requesting",
        revealedText: "",
        errorMessage: null,
      });
      processAssistantMessage(msg.fullText, messageId);
    }
  }, [messages, updateMessageById, processAssistantMessage]);

  // Show text fallback for error state
  const showTextFallback = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (msg && msg.fullText) {
      updateMessageById(messageId, {
        status: "done",
        revealedText: msg.fullText,
      });
      setDebugInfo((prev) => ({ ...prev, pipelineStatus: "done" }));
    }
  }, [messages, updateMessageById]);

  // STT hook
  const stt = useSTT({
    onRecordingComplete: (transcript) => {
      if (transcript) {
        setEditableTranscript(transcript);
        setIsReviewingTranscript(true);
      }
    },
    onError: (err) => setError(err),
  });

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start week conversation (guarded against StrictMode)
  const startWeekCalledRef = useRef(false);

  useEffect(() => {
    if (startWeekCalledRef.current) return;
    startWeekCalledRef.current = true;

    async function startWeek() {
      try {
        const res = await fetch("/api/skippy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "start_week", week }),
        });

        if (!res.ok) throw new Error("Failed to start conversation");

        const data = await res.json();

        if (data.history && data.history.length > 0) {
          // Load history - previous messages shown as done, last assistant spoken
          const historyMsgs = data.history.slice(0, -1).map(
            (msg: { role: "user" | "assistant"; content: string }, idx: number) => ({
              id: `history_${idx}`,
              role: msg.role,
              fullText: msg.content,
              revealedText: msg.content, // History is fully revealed
              status: "done" as AssistantPipelineStatus,
              audioUrl: null,
              duration: null,
              errorMessage: null,
            })
          );

          const lastMsg = data.history[data.history.length - 1];
          setMessages(historyMsgs);

          // Speak the last assistant message through voice-first pipeline
          if (lastMsg.role === "assistant") {
            setTimeout(() => addAssistantMessage(lastMsg.content, true), 300);
          } else {
            // Last message is user, just add it
            setMessages((prev) => [
              ...prev,
              {
                id: `history_${data.history.length - 1}`,
                role: lastMsg.role,
                fullText: lastMsg.content,
                revealedText: lastMsg.content,
                status: "done" as AssistantPipelineStatus,
                audioUrl: null,
                duration: null,
                errorMessage: null,
              },
            ]);
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

  // Focus management
  useEffect(() => {
    if (!isLoading && !isReviewingTranscript && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isReviewingTranscript]);

  useEffect(() => {
    if (isReviewingTranscript && transcriptInputRef.current) {
      transcriptInputRef.current.focus();
      transcriptInputRef.current.select();
    }
  }, [isReviewingTranscript]);

  // Handle input change (barge-in)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      if (e.target.value && debugInfo.audioPlaying) {
        stopSpeaking();
      }
    },
    [debugInfo.audioPlaying, stopSpeaking]
  );

  // Submit message
  const submitMessage = useCallback(
    async (messageText: string) => {
      const trimmedInput = messageText.trim();
      if (!trimmedInput || isSending) return;

      setInput("");
      setIsSending(true);
      setError(null);

      const userMessageId = generateMessageId();
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        fullText: trimmedInput,
        revealedText: trimmedInput,
        status: "done",
        audioUrl: null,
        duration: null,
        errorMessage: null,
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

        if (!res.ok) throw new Error("Failed to send message");

        const data = await res.json();
        addAssistantMessage(data.response, true);
      } catch (err) {
        setError("Failed to send message. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
        console.error("Send message error:", err);
      } finally {
        setIsSending(false);
        inputRef.current?.focus();
      }
    },
    [week, isSending, addAssistantMessage]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitMessage(input);
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
      if (!res.ok) throw new Error("Failed to complete week");
      router.push("/home");
    } catch (err) {
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

  function startRecording() {
    stopSpeaking();
    stt.startListening();
  }

  function stopRecording() {
    stt.stopListening();
  }

  function sendTranscript() {
    const text = editableTranscript.trim();
    if (text && countWords(text) >= MIN_TRANSCRIPT_WORDS) {
      setIsReviewingTranscript(false);
      setEditableTranscript("");
      stt.resetTranscript();
      submitMessage(text);
    }
  }

  function recordAgain() {
    setIsReviewingTranscript(false);
    setEditableTranscript("");
    stt.resetTranscript();
    startRecording();
  }

  function cancelReview() {
    setIsReviewingTranscript(false);
    setEditableTranscript("");
    stt.resetTranscript();
  }

  function clearError() {
    setError(null);
    stt.clearError();
  }

  const wordCount = countWords(editableTranscript);
  const canSendTranscript = wordCount >= MIN_TRANSCRIPT_WORDS;

  return (
    <main className="flex min-h-screen flex-col bg-neutral-900 text-white">
      {/* Debug Badge */}
      <div className="fixed top-2 right-2 z-50 rounded bg-black/80 px-2 py-1 text-[10px] font-mono text-white/70">
        <div>Week: {week}</div>
        <div>Status: {debugInfo.pipelineStatus}</div>
        <div>Audio: {debugInfo.audioReady ? "ready" : "no"} | {debugInfo.audioPlaying ? "playing" : "stopped"}</div>
        <div>Text: {debugInfo.revealedLength}/{debugInfo.fullTextLength}</div>
        {debugInfo.lastError && <div className="text-red-400">Err: {debugInfo.lastError}</div>}
      </div>

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
                  onRetry={() => retryAudio(message.id)}
                  onShowText={() => showTextFallback(message.id)}
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

      {/* Error bar */}
      {(error || stt.error) && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-6 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <p className="text-sm text-red-400">{error || stt.error}</p>
            <button onClick={clearError} className="text-xs text-red-400/70 hover:text-red-400">
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
              <p className="mt-3 text-sm text-white/60 italic">"{stt.currentTranscript}"</p>
            )}
          </div>
        </div>
      )}

      {/* Transcript review */}
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
                  <span className="ml-2 text-yellow-400">(minimum {MIN_TRANSCRIPT_WORDS} words)</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={cancelReview} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/20 transition">
                  Cancel
                </button>
                <button onClick={recordAgain} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition">
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

      {/* Input */}
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
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isSending}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <SendIcon />
              </button>
              {stt.isSupported && (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isLoading || isSending}
                  className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  <MicIcon />
                </button>
              )}
              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!debugInfo.audioPlaying}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <StopIcon />
              </button>
            </div>
            <p className="mt-2 text-xs text-white/30">
              {stt.isSupported ? "Type, press Cmd+Enter, or tap Record to speak" : "Press Cmd+Enter to send"}
            </p>
          </form>
        </div>
      )}
    </main>
  );
}

// =============================================================================
// MESSAGE BUBBLE - STRICT VOICE-FIRST RENDERING
// =============================================================================

type MessageBubbleProps = {
  message: Message;
  onRetry: () => void;
  onShowText: () => void;
};

function MessageBubble({ message, onRetry, onShowText }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { status, revealedText, fullText } = message;

  // STRICT RULES:
  // - User messages: always show fullText
  // - Assistant requesting/audio_ready: show ONLY placeholder, NO text
  // - Assistant playing: show ONLY revealedText (may be empty at start)
  // - Assistant done: show revealedText (which equals fullText)
  // - Assistant error: show error UI with Retry + Show Text buttons

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white">
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">{fullText}</div>
        </div>
      </div>
    );
  }

  // Assistant message - voice-first rendering
  const showPlaceholder = status === "requesting" || status === "audio_ready";
  const isRevealing = status === "playing";
  const isError = status === "error";
  const isDone = status === "done";

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3 text-white/90">
        {showPlaceholder && (
          <div className="flex items-center gap-2 text-white/70">
            <SpeakingIndicator />
            <span>Skippy is preparing...</span>
          </div>
        )}

        {isRevealing && (
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
            {revealedText || <span className="text-white/50">...</span>}
            <span className="animate-pulse">▌</span>
          </div>
        )}

        {isDone && (
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
            {revealedText}
          </div>
        )}

        {isError && (
          <div className="space-y-2">
            <p className="text-red-400 text-sm">{message.errorMessage || "Audio failed to load"}</p>
            <div className="flex gap-2">
              <button
                onClick={onRetry}
                className="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition"
              >
                Try Again
              </button>
              <button
                onClick={onShowText}
                className="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white/70 hover:bg-white/20 transition"
              >
                Show Text
              </button>
            </div>
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

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
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
