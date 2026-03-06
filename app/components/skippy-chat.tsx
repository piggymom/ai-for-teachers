"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SkippyAvatar } from "./skippy-avatar";
import { ChatPhaseIndicator } from "./chat-phase-indicator";
import { LedgerDebugPanel } from "./debug/ledger-debug-panel";
import { useSpeechToText } from "@/hooks/useSpeechToText";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming: boolean;
  wasSpoken?: boolean;
};

type Phase = "discover" | "build" | "refine" | "reflect" | "save" | "bridge";
type VoiceStatus = "idle" | "thinking" | "generating" | "speaking";

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

  // Voice mode state — defaults ON
  const [voiceMode, setVoiceMode] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Speech-to-text
  const {
    isListening,
    transcript: sttTranscript,
    startListening,
    stopListening,
    clearTranscript,
    isSupported: speechSupported,
    error: speechError,
  } = useSpeechToText();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initCalledRef = useRef(false);

  const nextId = useRef(0);
  const genId = () => `msg_${++nextId.current}`;

  // Persist voice mode preference (default ON for first-time users)
  useEffect(() => {
    const saved = localStorage.getItem("skippy-voice-mode");
    setVoiceMode(saved === null ? true : saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("skippy-voice-mode", String(voiceMode));
  }, [voiceMode]);

  // Combined display value: typed input + live speech transcript
  const displayValue = input + (sttTranscript ? (input ? " " : "") + sttTranscript : "");

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
  // VOICE: Generate TTS and play audio
  // =============================================================================

  const playTTS = useCallback(async (text: string): Promise<void> => {
    setVoiceStatus("generating");

    // Detect template-heavy messages and use a short spoken summary instead
    const isTemplateMessage =
      (text.includes("CONTEXT:") && text.includes("COMMAND:")) ||
      (text.match(/\*\*/g) || []).length >= 6;

    let cleanText: string;

    if (isTemplateMessage) {
      // Extract just the conversational intro/outro, skip the template body
      const lines = text.split("\n");
      const spokenParts: string[] = [];
      let inTemplate = false;

      for (const line of lines) {
        const trimmed = line.trim();
        // Detect start of template block
        if (/^(\*\*)?CONTEXT(\*\*)?:/i.test(trimmed)) { inTemplate = true; continue; }
        // Detect end of template block (blank line after CRITERIA section)
        if (inTemplate && /^(\*\*)?CRITERIA(\*\*)?:/i.test(trimmed)) { continue; }
        if (inTemplate && trimmed === "") { inTemplate = false; continue; }
        if (inTemplate) continue;
        // Keep conversational lines
        if (trimmed) spokenParts.push(trimmed);
      }

      cleanText = spokenParts.join(" ")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .trim();

      // If we stripped too much, use a generic summary
      if (cleanText.length < 20) {
        cleanText = "Here's your prompt template. Take a look and let me know what you'd change.";
      }
    } else {
      // Standard markdown stripping for non-template messages
      cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    // Truncate for TTS — long messages cause slow generation
    const MAX_TTS_CHARS = 800;
    if (cleanText.length > MAX_TTS_CHARS) {
      const truncated = cleanText.slice(0, MAX_TTS_CHARS);
      const lastSentence = truncated.lastIndexOf(".");
      cleanText = lastSentence > MAX_TTS_CHARS * 0.5
        ? truncated.slice(0, lastSentence + 1)
        : truncated;
    }

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!res.ok) throw new Error("TTS failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudioRef.current = audio;

    return new Promise<void>((resolve) => {
      setVoiceStatus("speaking");

      audio.onended = () => {
        currentAudioRef.current = null;
        URL.revokeObjectURL(url);
        resolve();
      };

      audio.onerror = () => {
        currentAudioRef.current = null;
        URL.revokeObjectURL(url);
        resolve();
      };

      audio.play().catch(() => {
        // Autoplay blocked — resolve anyway so transcript shows
        currentAudioRef.current = null;
        URL.revokeObjectURL(url);
        resolve();
      });
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setVoiceStatus("idle");
    // Show pending transcript immediately
    if (pendingTranscript) {
      setMessages((prev) => [
        ...prev,
        { id: genId(), role: "assistant", text: pendingTranscript, isStreaming: false, wasSpoken: true },
      ]);
      setPendingTranscript(null);
    }
  }, [pendingTranscript]);

  // =============================================================================
  // TEXT-ONLY: Send message via standard API
  // =============================================================================

  const sendTextMessage = useCallback(
    async (text: string) => {
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

        if (voiceMode) {
          // VOICE MODE: play audio first, then show transcript
          setPendingTranscript(assistantText);
          setVoiceStatus("thinking");
          setIsSending(false);

          try {
            await playTTS(assistantText);
          } catch {
            // TTS failed — fall through to show transcript
          }

          // Audio finished (or failed) — show transcript
          setMessages((prev) => [
            ...prev,
            { id: genId(), role: "assistant", text: assistantText, isStreaming: false, wasSpoken: true },
          ]);
          setPendingTranscript(null);
          setVoiceStatus("idle");
        } else {
          // NORMAL TEXT MODE
          setMessages((prev) => [
            ...prev,
            { id: genId(), role: "assistant", text: assistantText, isStreaming: false },
          ]);
        }

        fetchLedger();
      } catch (err) {
        console.error("[CHAT] Send error:", err);
        setError(err instanceof Error ? err.message : "Failed to send");
        setVoiceStatus("idle");
        setPendingTranscript(null);
      } finally {
        setIsSending(false);
      }
    },
    [week, fetchLedger, voiceMode, playTTS]
  );

  // =============================================================================
  // INIT
  // =============================================================================

  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    async function init() {
      try {
        // Check AI processing consent
        const consentRes = await fetch("/api/consent?type=ai_processing");
        if (consentRes.ok) {
          const consentData = await consentRes.json();
          const hasAiConsent = consentData.consents?.length > 0;
          if (!hasAiConsent) {
            setShowAiConsent(true);
            setIsLoading(false);
            return;
          }
        }

        await startConversation();
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to start");
        setIsLoading(false);
      }
    }

    init();
  }, [week, fetchLedger]);

  async function startConversation() {
    const res = await fetch("/api/skippy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "start_week", week }),
    });

    if (!res.ok) throw new Error("Load failed");

    const data = await res.json();

    if (data.history?.length > 0) {
      setMessages(
        data.history.map((m: { role: string; content: string }, i: number) => ({
          id: `hist_${i}`,
          role: m.role as "user" | "assistant",
          text: m.content,
          isStreaming: false,
        }))
      );
    }

    setIsLoading(false);
    setIsReady(true);
    fetchLedger();

    // If new conversation, get opening message
    if (!data.resumed && data.history?.length === 0) {
      const openRes = await fetch("/api/skippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "user_message",
          week,
          message: "[Session starting — deliver your opening message for this week]",
        }),
      });
      if (openRes.ok) {
        const openData = await openRes.json();
        if (openData.response) {
          const text = openData.response;

          // If voice mode is on, play TTS for the opening message
          if (voiceMode) {
            setVoiceStatus("thinking");
            setPendingTranscript(text);
            try {
              await playTTS(text);
            } catch {
              // TTS failed — fall through to show transcript
            }
            setMessages([
              { id: genId(), role: "assistant", text, isStreaming: false, wasSpoken: true },
            ]);
            setPendingTranscript(null);
            setVoiceStatus("idle");
          } else {
            setMessages([
              { id: genId(), role: "assistant", text, isStreaming: false },
            ]);
          }
        }
      }
    }
  }

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, voiceStatus]);

  // Focus
  useEffect(() => {
    if (!isLoading && !isSending && voiceStatus === "idle") {
      inputRef.current?.focus();
    }
  }, [isLoading, isSending, voiceStatus]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitCurrentInput();
  }

  function submitCurrentInput() {
    // Stop mic if active
    if (isListening) stopListening();

    // Combine typed input + speech transcript
    const text = (input + (sttTranscript ? " " + sttTranscript : "")).trim();
    if (!text || !isReady || isSending || voiceStatus !== "idle") return;

    // Clear everything
    setInput("");
    clearTranscript();
    setIsSending(true);

    // Add user message
    setMessages((prev) => [...prev, { id: genId(), role: "user", text, isStreaming: false }]);

    if (voiceMode) {
      setVoiceStatus("thinking");
    }

    sendTextMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasContent && canSend) {
        submitCurrentInput();
      }
    }
  }

  async function handleEndWeek() {
    if (!confirm("Ready to finish this session? Your artifacts will be saved.")) return;
    stopAudio();
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
      await startConversation();
    } catch (err) {
      console.error("Consent/init error:", err);
      setError("Failed to start");
      setIsLoading(false);
    }
  }

  const canSend = isReady && !isSending && voiceStatus === "idle";
  const hasContent = !!(displayValue.trim() || isListening);
  const isVoiceActive = voiceStatus !== "idle";

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
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

          <div className="flex items-center gap-3">
            {/* Voice mode toggle */}
            <button
              onClick={() => {
                if (isVoiceActive) stopAudio();
                if (isListening) {
                  stopListening();
                  clearTranscript();
                }
                setVoiceMode(!voiceMode);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition ${
                voiceMode
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#e5e7eb] text-[#9ca3af] hover:text-[#4b5563] hover:border-[#d1d5db]"
              }`}
              title={voiceMode ? "Voice mode on" : "Voice mode off"}
            >
              <VoiceIcon on={voiceMode} />
              <span className="hidden sm:inline">{voiceMode ? "Voice On" : "Voice Off"}</span>
            </button>

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

      {/* AI Consent Banner */}
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
              <Link href="/legal/ai-disclosure" className="text-[#111827] underline hover:text-[#3B82F6]" target="_blank">
                AI Disclosure
              </Link>
              {" "}&middot;{" "}
              <Link href="/legal/privacy" className="text-[#111827] underline hover:text-[#3B82F6]" target="_blank">
                Privacy Policy
              </Link>
            </p>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aiConsentChecked}
                onChange={(e) => setAiConsentChecked(e.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db] text-[#111827] focus:ring-[#d1d5db] cursor-pointer"
              />
              <span className="text-[13px] text-[#4b5563]">I understand and want to continue</span>
            </label>
            <button
              onClick={handleAcceptAiConsent}
              disabled={!aiConsentChecked}
              className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-2.5 text-[14px] font-medium text-[#111827] hover:bg-[#f9fafb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              {messages.map((msg, idx) => {
                // Only show Finish button on the very last assistant message
                const isLastAssistant =
                  msg.role === "assistant" &&
                  idx === messages.findLastIndex((m) => m.role === "assistant");
                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onFinishSession={isLastAssistant ? handleEndWeek : undefined}
                  />
                );
              })}

              {/* Voice mode: show speaking/thinking state */}
              {isVoiceActive && (
                <VoiceStatusDisplay status={voiceStatus} onStop={stopAudio} />
              )}

              {/* Text mode: show thinking dots */}
              {!voiceMode && isSending && (
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
            <button onClick={() => setError(null)} className="text-[12px] text-red-400 hover:text-red-600">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <div className="border-t border-red-100 bg-red-50/50 px-6 py-2">
          <div className="mx-auto max-w-3xl flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-[13px] text-red-600 font-medium">Listening — click mic when done speaking</span>
          </div>
        </div>
      )}

      {/* Speech error */}
      {speechError && (
        <div className="border-t border-amber-100 bg-amber-50/50 px-6 py-2">
          <div className="mx-auto max-w-3xl flex items-center justify-center gap-2 text-[13px] text-amber-700">
            <span>
              {speechError === "Microphone access denied"
                ? "Microphone blocked — check browser permissions, or type instead"
                : speechError}
            </span>
            <button
              onClick={() => {
                // Clear error and retry
                startListening();
              }}
              className="underline hover:text-amber-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#f3f4f6] px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex gap-2 items-end">
          {/* Mic button — visible when voice mode ON and browser supports it */}
          {speechSupported && voiceMode && (
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  // Commit speech transcript to typed input, then stop
                  if (sttTranscript) {
                    setInput((prev) => (prev ? prev + " " + sttTranscript : sttTranscript).trim());
                    clearTranscript();
                  }
                  stopListening();
                } else {
                  startListening();
                }
              }}
              disabled={isLoading || isSending || isVoiceActive}
              className={`flex-shrink-0 rounded-xl p-3 transition-colors ${
                isListening
                  ? "bg-red-500 text-white"
                  : "bg-[#f3f4f6] text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#4b5563]"
              } disabled:opacity-30`}
              aria-label={isListening ? "Stop recording" : "Start recording"}
              title={isListening ? "Stop recording" : "Click to speak"}
            >
              <MicIcon listening={isListening} />
            </button>
          )}

          <textarea
            ref={inputRef}
            value={displayValue}
            onChange={(e) => {
              // Only allow typing when not listening
              if (!isListening) {
                setInput(e.target.value);
              }
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isVoiceActive
                ? "Skippy is speaking..."
                : isListening
                ? "Listening..."
                : isSending
                ? "Skippy is thinking..."
                : voiceMode
                ? "Speak or type your message..."
                : "Type your message..."
            }
            disabled={isLoading || isSending || isVoiceActive}
            readOnly={isListening}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder-[#d1d5db] focus:outline-none focus:border-[#d1d5db] disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!hasContent || !canSend}
            className={`flex-shrink-0 rounded-xl px-4 py-3 transition-colors ${
              hasContent && canSend ? "bg-[#111827] hover:bg-[#374151]" : "bg-[#f3f4f6] disabled:opacity-30"
            }`}
          >
            <SendIcon active={hasContent && canSend} />
          </button>
        </form>
        <p className="mt-2 text-[11px] text-[#d1d5db] text-center">
          {voiceMode && speechSupported
            ? "Click mic to speak, or type"
            : "Enter to send, Shift+Enter for new line"}
          &middot; Skippy is AI-powered — review responses before classroom use
        </p>
      </div>

      {/* Debug panel - only in development */}
      {process.env.NODE_ENV === "development" && <LedgerDebugPanel weekNumber={week} />}
    </main>
  );
}

// =============================================================================
// VOICE STATUS DISPLAY
// =============================================================================

function VoiceStatusDisplay({ status, onStop }: { status: VoiceStatus; onStop: () => void }) {
  return (
    <div className="flex justify-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <SkippyAvatar state={status === "speaking" ? "speaking" : "thinking"} size="sm" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-bl-md bg-[#f9fafb] px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] text-[#4b5563]">
            {status === "thinking" && "Skippy is thinking..."}
            {status === "generating" && "Preparing voice..."}
            {status === "speaking" && "Skippy is speaking..."}
          </span>

          {/* Audio waveform bars */}
          {status === "speaking" && (
            <div className="flex gap-[3px] h-4 items-end">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-[#111827]/30 animate-voice-bar"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {status === "speaking" && (
          <button
            onClick={onStop}
            className="ml-2 rounded-lg border border-[#e5e7eb] px-3 py-1 text-[12px] font-medium text-[#4b5563] hover:text-[#111827] hover:border-[#d1d5db] transition"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MESSAGE BUBBLE
// =============================================================================

function isWrapUpMessage(content: string): boolean {
  const triggers = [
    // Direct session-end signals (matches shared rules language)
    "finish session", "click finish session", "click the button below",
    "save our conversation", "save your work and continue",
    "save everything we discussed", "save what we covered", "save what we discussed",
    "saved to your artifacts", "saved this to your artifacts",
    "unlock week", "when you're ready",
    "ready to continue",
    // Artifact presentation signals (all weeks)
    "here's your prompt template", "here's your prompt",
    "here's your artifact", "here's what we built",
    "here's your completed", "here is your",
    "here's your feedback", "here's your lesson",
    "here's your differentiation", "here's your policy",
    "your template is ready", "your prompt is ready",
    "yours to keep",
    // Session wrap-up language
    "great work today", "great session", "nice work today",
    "you're all set", "you're ready to go",
    "we're finished", "we're done",
    "try it this week", "try this in chatgpt",
    "copy this and paste", "paste it into chatgpt",
    "capture this so you have it", "let me capture",
    // Bridge to next week
    "next week we", "see you next week",
    // Wrap-up indicators
    "wrap up", "wrapping up",
  ];
  const lower = content.toLowerCase();
  return triggers.some((t) => lower.includes(t));
}

function MessageBubble({ message, onFinishSession }: { message: Message; onFinishSession?: () => void }) {
  const { role, text, isStreaming, wasSpoken } = message;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#f3f4f6] px-4 py-3 text-[#111827]">
          {text.split("\n\n").map((paragraph, pIndex) => (
            <p key={pIndex} className={`text-[15px] ${pIndex > 0 ? "mt-3" : ""}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const showFinishButton = !isStreaming && text && isWrapUpMessage(text) && onFinishSession;

  return (
    <div className="flex justify-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <SkippyAvatar state="idle" size="sm" />
      </div>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-bl-md bg-[#f9fafb] px-4 py-3 text-[#111827]">
          {text ? (
            <>
              {text.split("\n\n").map((paragraph, pIndex) => (
                <p key={pIndex} className={`text-[15px] leading-relaxed ${pIndex > 0 ? "mt-3" : ""}`}>
                  {paragraph}
                </p>
              ))}
              {isStreaming && <span className="animate-pulse text-[#d1d5db]">|</span>}
              {wasSpoken && (
                <span className="mt-1 inline-block text-[11px] text-[#d1d5db]">
                  <VoiceIcon on={true} size={10} /> spoken
                </span>
              )}
            </>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 text-[#9ca3af]">
              <LoadingDots />
              <span className="text-[14px]">Skippy is speaking...</span>
            </div>
          ) : null}
        </div>

        {/* Inline Finish Session button */}
        {showFinishButton && (
          <button
            onClick={onFinishSession}
            className="mt-3 w-full rounded-xl bg-[#111827] px-5 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#374151]"
          >
            Finish Session &amp; Continue &rarr;
          </button>
        )}
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

function MicIcon({ listening }: { listening: boolean }) {
  if (listening) {
    // Mic off / stop icon
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .84-.15 1.65-.42 2.4" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function VoiceIcon({ on, size = 14 }: { on: boolean; size?: number }) {
  if (on) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="inline-block">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="inline-block">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
