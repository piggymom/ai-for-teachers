import { useState, useCallback } from "react";

export type SkippyState = "idle" | "listening" | "thinking" | "speaking";

interface UseSkippyStateReturn {
  state: SkippyState;
  setIdle: () => void;
  setListening: () => void;
  setThinking: () => void;
  setSpeaking: () => void;
  setState: (state: SkippyState) => void;
}

export function useSkippyState(initialState: SkippyState = "idle"): UseSkippyStateReturn {
  const [state, setState] = useState<SkippyState>(initialState);

  const setIdle = useCallback(() => setState("idle"), []);
  const setListening = useCallback(() => setState("listening"), []);
  const setThinking = useCallback(() => setState("thinking"), []);
  const setSpeaking = useCallback(() => setState("speaking"), []);

  return {
    state,
    setIdle,
    setListening,
    setThinking,
    setSpeaking,
    setState,
  };
}
