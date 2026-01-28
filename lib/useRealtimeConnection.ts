"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// =============================================================================
// OpenAI Realtime API WebRTC Connection Hook
// =============================================================================

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

type RealtimeEvent = {
  type: string;
  [key: string]: unknown;
};

type UseRealtimeConnectionOptions = {
  onTranscriptDelta?: (delta: string, itemId: string) => void;
  onResponseStart?: (responseId: string) => void;
  onResponseDone?: (transcript: string, responseId: string) => void;
  onUserSpeechStarted?: () => void;
  onUserSpeechStopped?: () => void;
  onError?: (error: Error) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
};

export function useRealtimeConnection(options: UseRealtimeConnectionOptions = {}) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const microphoneTrackRef = useRef<MediaStreamTrack | null>(null);
  const currentTranscriptRef = useRef<string>("");
  const currentResponseIdRef = useRef<string | null>(null);

  // Callbacks ref to avoid stale closures
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateConnectionState = useCallback((state: ConnectionState) => {
    setConnectionState(state);
    optionsRef.current.onConnectionStateChange?.(state);
  }, []);

  // Handle incoming data channel messages
  const handleServerEvent = useCallback((event: MessageEvent) => {
    try {
      const msg: RealtimeEvent = JSON.parse(event.data);
      setLastEvent(msg.type);

      switch (msg.type) {
        case "session.created":
        case "session.updated":
          console.log("[REALTIME] Session configured");
          break;

        case "response.created":
          // Response started
          currentTranscriptRef.current = "";
          const responseObj = msg.response as { id?: string } | undefined;
          currentResponseIdRef.current = responseObj?.id || null;
          if (currentResponseIdRef.current) {
            optionsRef.current.onResponseStart?.(currentResponseIdRef.current);
          }
          break;

        case "response.audio_transcript.delta":
          // Streaming text chunk
          const delta = (msg.delta as string) || "";
          currentTranscriptRef.current += delta;
          if (msg.item_id) {
            optionsRef.current.onTranscriptDelta?.(delta, msg.item_id as string);
          }
          break;

        case "response.audio_transcript.done":
          // Transcript complete for this item
          console.log("[REALTIME] Transcript done:", currentTranscriptRef.current.slice(0, 50) + "...");
          break;

        case "response.done":
          // Full response complete
          const finalTranscript = currentTranscriptRef.current;
          const responseId = currentResponseIdRef.current;
          if (responseId) {
            optionsRef.current.onResponseDone?.(finalTranscript, responseId);
          }
          currentTranscriptRef.current = "";
          currentResponseIdRef.current = null;
          break;

        case "input_audio_buffer.speech_started":
          console.log("[REALTIME] User speech started");
          optionsRef.current.onUserSpeechStarted?.();
          break;

        case "input_audio_buffer.speech_stopped":
          console.log("[REALTIME] User speech stopped");
          optionsRef.current.onUserSpeechStopped?.();
          break;

        case "error":
          const errorMsg = (msg.error as { message?: string })?.message || "Unknown error";
          console.error("[REALTIME] Error:", msg.error);
          optionsRef.current.onError?.(new Error(errorMsg));
          break;

        default:
          // Log other events for debugging
          if (process.env.NODE_ENV === "development") {
            console.log("[REALTIME] Event:", msg.type);
          }
      }
    } catch (err) {
      console.error("[REALTIME] Failed to parse event:", err);
    }
  }, []);

  // Connect to OpenAI Realtime API
  const connect = useCallback(async (systemPrompt: string, audioElement: HTMLAudioElement) => {
    if (connectionState === "connecting" || connectionState === "connected") {
      console.log("[REALTIME] Already connected or connecting");
      return;
    }

    audioElementRef.current = audioElement;
    updateConnectionState("connecting");

    try {
      // 1. Get ephemeral token from our server
      const tokenRes = await fetch("/api/realtime-token", { method: "POST" });
      if (!tokenRes.ok) {
        const error = await tokenRes.json().catch(() => ({}));
        throw new Error(error.error?.message || "Failed to get realtime token");
      }
      const { client_secret } = await tokenRes.json();

      // 2. Create RTCPeerConnection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // 3. Handle incoming audio track
      pc.ontrack = (event) => {
        console.log("[REALTIME] Received audio track");
        if (audioElementRef.current && event.streams[0]) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };

      // 4. Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("[REALTIME] Connection state:", pc.connectionState);
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          updateConnectionState("error");
          optionsRef.current.onError?.(new Error("Connection lost"));
        }
      };

      // 5. Create data channel for events (must be before createOffer)
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("[REALTIME] Data channel open, sending session config");
        // Configure session with Skippy's system prompt
        dc.send(JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: systemPrompt,
            voice: "shimmer",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        }));
        updateConnectionState("connected");
      };

      dc.onmessage = handleServerEvent;

      dc.onerror = (e) => {
        console.error("[REALTIME] Data channel error:", e);
        updateConnectionState("error");
        optionsRef.current.onError?.(new Error("Data channel error"));
      };

      dc.onclose = () => {
        console.log("[REALTIME] Data channel closed");
        updateConnectionState("disconnected");
      };

      // 6. Add transceiver for receiving audio (sendrecv to enable mic later)
      pc.addTransceiver("audio", { direction: "sendrecv" });

      // 7. Create and set local offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 8. Exchange SDP with OpenAI
      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${client_secret.value}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpRes.ok) {
        throw new Error(`SDP exchange failed: ${sdpRes.status}`);
      }

      // 9. Set remote description
      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      console.log("[REALTIME] WebRTC connection established");

    } catch (err) {
      console.error("[REALTIME] Connection error:", err);
      updateConnectionState("error");
      optionsRef.current.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [connectionState, updateConnectionState, handleServerEvent]);

  // Disconnect and cleanup
  const disconnect = useCallback(() => {
    console.log("[REALTIME] Disconnecting");

    // Stop microphone if active
    if (microphoneTrackRef.current) {
      microphoneTrackRef.current.stop();
      microphoneTrackRef.current = null;
    }

    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }

    currentTranscriptRef.current = "";
    currentResponseIdRef.current = null;
    updateConnectionState("disconnected");
  }, [updateConnectionState]);

  // Send text message
  const sendTextMessage = useCallback((text: string) => {
    const dc = dataChannelRef.current;
    if (!dc || dc.readyState !== "open") {
      console.error("[REALTIME] Data channel not ready");
      return;
    }

    // Create conversation item
    dc.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    }));

    // Trigger response
    dc.send(JSON.stringify({
      type: "response.create",
    }));
  }, []);

  // Start microphone input
  const startMicrophone = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.error("[REALTIME] No peer connection");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      const track = stream.getAudioTracks()[0];
      microphoneTrackRef.current = track;

      // Find the audio sender and replace/add track
      const sender = pc.getSenders().find(s => s.track?.kind === "audio" || !s.track);
      if (sender) {
        await sender.replaceTrack(track);
      } else {
        pc.addTrack(track, stream);
      }

      console.log("[REALTIME] Microphone started");
    } catch (err) {
      console.error("[REALTIME] Failed to start microphone:", err);
      optionsRef.current.onError?.(err instanceof Error ? err : new Error("Microphone access denied"));
    }
  }, []);

  // Stop microphone input
  const stopMicrophone = useCallback(() => {
    if (microphoneTrackRef.current) {
      microphoneTrackRef.current.stop();
      microphoneTrackRef.current = null;

      // Replace track with null to stop sending
      const pc = peerConnectionRef.current;
      if (pc) {
        const sender = pc.getSenders().find(s => s.track?.kind === "audio");
        if (sender) {
          sender.replaceTrack(null);
        }
      }

      console.log("[REALTIME] Microphone stopped");
    }
  }, []);

  // Cancel current response (for barge-in)
  const cancelResponse = useCallback(() => {
    const dc = dataChannelRef.current;
    if (!dc || dc.readyState !== "open") {
      return;
    }

    dc.send(JSON.stringify({
      type: "response.cancel",
    }));

    // Clear current transcript
    currentTranscriptRef.current = "";
    currentResponseIdRef.current = null;

    console.log("[REALTIME] Response cancelled");
  }, []);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    lastEvent,
    connect,
    disconnect,
    sendTextMessage,
    startMicrophone,
    stopMicrophone,
    cancelResponse,
    stopAudio,
    isConnected: connectionState === "connected",
  };
}
