"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// =============================================================================
// SIMPLIFIED OpenAI Realtime API WebRTC Hook
// The WebRTC API sends audio_transcript events for text - that's our source
// =============================================================================

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";
export type TurnState = "idle" | "listening" | "thinking" | "speaking";

export function useRealtimeConnection(options: {
  onTranscriptDelta?: (delta: string, fullText: string) => void;
  onResponseStart?: () => void;
  onResponseDone?: (text: string) => void;
  onUserTranscript?: (transcript: string) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
  onTurnStateChange?: (state: TurnState) => void;
} = {}) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [turnState, setTurnState] = useState<TurnState>("idle");
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [turnId, setTurnId] = useState(0);

  // Refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const microphoneTrackRef = useRef<MediaStreamTrack | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);

  // Response state
  const transcriptRef = useRef<string>("");
  const responseActiveRef = useRef<boolean>(false);
  const audioStartedRef = useRef<boolean>(false);
  const turnIdRef = useRef<number>(0);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateConnectionState = useCallback((state: ConnectionState) => {
    setConnectionState(state);
    optionsRef.current.onConnectionStateChange?.(state);
  }, []);

  const updateTurnState = useCallback((state: TurnState) => {
    setTurnState(state);
    optionsRef.current.onTurnStateChange?.(state);
  }, []);

  // =============================================================================
  // EVENT HANDLER - Keep it simple
  // =============================================================================

  const handleServerEvent = useCallback((event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);
      const type = msg.type as string;
      setLastEvent(type);

      // Log everything in dev - with full JSON for debugging
      console.log("[REALTIME]", type, JSON.stringify(msg, null, 2));

      switch (type) {
        case "session.created":
        case "session.updated":
          console.log("[REALTIME] Session ready");
          break;

        case "response.created":
          if (responseActiveRef.current) {
            console.warn("[REALTIME] Already have active response, ignoring");
            break;
          }
          transcriptRef.current = "";
          audioStartedRef.current = false;
          responseActiveRef.current = true;
          optionsRef.current.onResponseStart?.();
          updateTurnState("thinking");
          break;

        case "response.audio.delta":
          // First audio chunk
          if (!audioStartedRef.current) {
            audioStartedRef.current = true;
            updateTurnState("speaking");
            optionsRef.current.onAudioStart?.();
          }
          break;

        case "response.output_audio_transcript.delta": {
          // THIS IS THE TEXT - accumulate it
          const delta = msg.delta || "";
          if (delta) {
            transcriptRef.current += delta;
            console.log("[REALTIME] Transcript delta:", delta, "| Total:", transcriptRef.current.length);
            optionsRef.current.onTranscriptDelta?.(delta, transcriptRef.current);
          }
          break;
        }

        case "response.output_audio_transcript.done": {
          // Final transcript
          const transcript = msg.transcript || transcriptRef.current;
          transcriptRef.current = transcript;
          console.log("[REALTIME] Transcript done:", transcript.slice(0, 50));
          break;
        }

        case "response.done": {
          const finalText = transcriptRef.current;
          console.log("[REALTIME] Response done. Text length:", finalText.length);

          optionsRef.current.onResponseDone?.(finalText);
          optionsRef.current.onAudioEnd?.();

          // Reset
          transcriptRef.current = "";
          responseActiveRef.current = false;
          audioStartedRef.current = false;
          updateTurnState("idle");
          break;
        }

        case "response.cancelled":
          responseActiveRef.current = false;
          audioStartedRef.current = false;
          updateTurnState("idle");
          break;

        case "input_audio_buffer.speech_started":
          updateTurnState("listening");
          break;

        case "input_audio_buffer.speech_stopped":
          updateTurnState("thinking");
          break;

        case "conversation.item.input_audio_transcription.completed": {
          // User's speech has been transcribed
          const transcript = msg.transcript || "";
          console.log("[REALTIME] User transcript:", transcript);
          if (transcript) {
            optionsRef.current.onUserTranscript?.(transcript);
          }
          break;
        }

        case "error": {
          const errMsg = msg.error?.message || "Unknown error";
          console.error("[REALTIME] Error:", errMsg, msg);
          optionsRef.current.onError?.(new Error(errMsg));
          responseActiveRef.current = false;
          updateTurnState("idle");
          break;
        }

        default:
          // Unhandled event types are logged above
          break;
      }
    } catch (err) {
      console.error("[REALTIME] Parse error:", err);
    }
  }, [updateTurnState]);

  // =============================================================================
  // CONNECT
  // =============================================================================

  const connect = useCallback(async (week: number, audioElement: HTMLAudioElement) => {
    if (connectionState === "connecting" || connectionState === "connected") return;

    audioElementRef.current = audioElement;
    updateConnectionState("connecting");

    try {
      // Get token
      const tokenRes = await fetch("/api/realtime/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week }),
      });

      if (!tokenRes.ok) throw new Error("Token fetch failed");

      const { value: ephemeralKey } = await tokenRes.json();
      if (!ephemeralKey) throw new Error("No token");

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Handle incoming audio
      pc.ontrack = (e) => {
        console.log("[REALTIME] Got audio track");
        if (audioElementRef.current && e.streams[0]) {
          audioElementRef.current.srcObject = e.streams[0];
        }
      };

      // Data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("[REALTIME] Data channel open");
        updateConnectionState("connected");
        updateTurnState("idle");
      };

      dc.onmessage = handleServerEvent;

      dc.onerror = () => updateConnectionState("error");
      dc.onclose = () => updateConnectionState("disconnected");

      // Add audio transceiver
      pc.addTransceiver("audio", { direction: "sendrecv" });

      // Exchange SDP
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!sdpRes.ok) throw new Error("SDP exchange failed");

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      console.log("[REALTIME] Connected");

    } catch (err) {
      console.error("[REALTIME] Connection error:", err);
      updateConnectionState("error");
      optionsRef.current.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [connectionState, updateConnectionState, updateTurnState, handleServerEvent]);

  // =============================================================================
  // DISCONNECT
  // =============================================================================

  const disconnect = useCallback(() => {
    microphoneTrackRef.current?.stop();
    microphoneStreamRef.current?.getTracks().forEach(t => t.stop());
    dataChannelRef.current?.close();
    peerConnectionRef.current?.close();

    microphoneTrackRef.current = null;
    microphoneStreamRef.current = null;
    dataChannelRef.current = null;
    peerConnectionRef.current = null;

    updateConnectionState("disconnected");
    updateTurnState("idle");
  }, [updateConnectionState, updateTurnState]);

  // =============================================================================
  // SEND TEXT
  // =============================================================================

  const sendTextMessage = useCallback((text: string) => {
    const dc = dataChannelRef.current;
    if (!dc || dc.readyState !== "open") return false;
    if (responseActiveRef.current) return false;

    turnIdRef.current++;
    setTurnId(turnIdRef.current);

    dc.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    }));

    dc.send(JSON.stringify({ type: "response.create" }));

    updateTurnState("thinking");
    return true;
  }, [updateTurnState]);

  // =============================================================================
  // MICROPHONE
  // =============================================================================

  const startMicrophone = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc || responseActiveRef.current) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      microphoneStreamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      microphoneTrackRef.current = track;

      const sender = pc.getSenders().find(s => s.track?.kind === "audio" || !s.track);
      if (sender) {
        await sender.replaceTrack(track);
      } else {
        pc.addTrack(track, stream);
      }

      turnIdRef.current++;
      setTurnId(turnIdRef.current);
      updateTurnState("listening");
      return true;
    } catch (err) {
      console.error("[REALTIME] Mic error:", err);
      return false;
    }
  }, [updateTurnState]);

  const stopMicrophone = useCallback((commitAndRespond = true) => {
    const dc = dataChannelRef.current;

    microphoneTrackRef.current?.stop();
    microphoneTrackRef.current = null;

    const pc = peerConnectionRef.current;
    if (pc) {
      const sender = pc.getSenders().find(s => s.track?.kind === "audio");
      sender?.replaceTrack(null);
    }

    microphoneStreamRef.current?.getTracks().forEach(t => t.stop());
    microphoneStreamRef.current = null;

    if (commitAndRespond && dc?.readyState === "open" && !responseActiveRef.current) {
      dc.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
      dc.send(JSON.stringify({ type: "response.create" }));
      updateTurnState("thinking");
    } else {
      updateTurnState("idle");
    }
  }, [updateTurnState]);

  // =============================================================================
  // CANCEL
  // =============================================================================

  const cancelResponse = useCallback(() => {
    const dc = dataChannelRef.current;
    if (!responseActiveRef.current || !dc || dc.readyState !== "open") return false;

    dc.send(JSON.stringify({ type: "response.cancel" }));
    responseActiveRef.current = false;
    return true;
  }, []);

  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  }, []);

  const bargeIn = useCallback(async () => {
    cancelResponse();
    stopAudio();
    responseActiveRef.current = false;
    return await startMicrophone();
  }, [cancelResponse, stopAudio, startMicrophone]);

  const hasActiveResponse = useCallback(() => responseActiveRef.current, []);
  const isResponseInFlight = useCallback(() => responseActiveRef.current, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    connectionState,
    turnState,
    turnId,
    lastEvent,
    isConnected: connectionState === "connected",
    connect,
    disconnect,
    sendTextMessage,
    startMicrophone,
    stopMicrophone,
    cancelResponse,
    stopAudio,
    bargeIn,
    hasActiveResponse,
    isResponseInFlight,
  };
}
