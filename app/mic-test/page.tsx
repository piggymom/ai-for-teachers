"use client";

import { useState, useRef } from "react";

export default function MicTestPage() {
  const [log, setLog] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  function addLog(msg: string) {
    const ts = new Date().toLocaleTimeString();
    setLog((prev) => [...prev, `[${ts}] ${msg}`]);
    console.log("[MIC-TEST]", msg);
  }

  function startRaw() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      addLog("ERROR: SpeechRecognition not supported in this browser");
      return;
    }

    addLog("Creating SpeechRecognition instance...");
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) text += " [FINAL] ";
      }
      addLog("onresult: " + text.slice(0, 100));
      setTranscript(text);
    };

    rec.onaudiostart = () => addLog("onaudiostart — mic stream active");
    rec.onsoundstart = () => addLog("onsoundstart — sound detected");
    rec.onspeechstart = () => addLog("onspeechstart — speech detected");
    rec.onspeechend = () => addLog("onspeechend — speech stopped");
    rec.onsoundend = () => addLog("onsoundend — sound stopped");
    rec.onaudioend = () => addLog("onaudioend — mic stream ended");

    rec.onend = () => {
      addLog("onend — recognition stopped");
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      addLog(`onerror: "${e.error}" message: "${e.message || "none"}"`);
    };

    try {
      rec.start();
      recRef.current = rec;
      setIsListening(true);
      addLog("start() succeeded — listening");
    } catch (e) {
      addLog("start() THREW: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  function stopRaw() {
    if (recRef.current) {
      recRef.current.stop();
      recRef.current = null;
      addLog("stop() called");
    }
    setIsListening(false);
  }

  async function testGetUserMedia() {
    addLog("Testing navigator.mediaDevices.getUserMedia...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getTracks();
      addLog(`getUserMedia succeeded: ${tracks.length} track(s), label: "${tracks[0]?.label}"`);
      tracks.forEach((t) => t.stop());
      addLog("Tracks stopped (mic released)");
    } catch (e) {
      addLog("getUserMedia FAILED: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  function checkPermission() {
    if (!navigator.permissions) {
      addLog("Permissions API not available");
      return;
    }
    navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
      addLog(`Permission state: "${result.state}"`);
    }).catch((e) => {
      addLog("Permission query failed: " + (e instanceof Error ? e.message : String(e)));
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Mic / Speech API Test</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={checkPermission}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Check Permission
        </button>
        <button
          onClick={testGetUserMedia}
          className="px-3 py-2 bg-blue-200 rounded hover:bg-blue-300"
        >
          Test getUserMedia
        </button>
        <button
          onClick={isListening ? stopRaw : startRaw}
          className={`px-3 py-2 rounded ${
            isListening ? "bg-red-500 text-white" : "bg-green-200 hover:bg-green-300"
          }`}
        >
          {isListening ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      {transcript && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <strong>Transcript:</strong> {transcript}
        </div>
      )}

      <div className="bg-gray-900 text-green-400 p-4 rounded max-h-96 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-500">Click a button to start testing...</p>
        ) : (
          log.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>

      <p className="mt-4 text-gray-500 text-xs">
        This page tests the raw browser Speech API and mic access, independent of the app.
        Open DevTools Console (F12) for additional logs.
      </p>
    </div>
  );
}
