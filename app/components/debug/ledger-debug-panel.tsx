"use client";

import { useState, useEffect, useCallback } from "react";

interface LedgerDebugPanelProps {
  weekNumber: number;
}

interface LedgerData {
  id: string;
  weekNumber: number;
  currentPhase: string;
  diagnosticLevel: string | null;
  diagnosticAssessed: boolean;
  diagnosticEvidence: string | null;
  exchangeCount: number;
  sessionSummary: string | null;
  guidance: string | null;
  artifactInProgress: boolean;
  artifactType: string | null;
  engagementEnergy: string;
  updatedAt: string;
  createdAt: string;
}

interface MessageData {
  role: string;
  week: number;
  contentPreview: string;
  createdAt: string;
}

interface DebugData {
  userId: string;
  ledgerCount: number;
  ledgers: LedgerData[];
  recentMessages: MessageData[];
}

export function LedgerDebugPanel({ weekNumber }: LedgerDebugPanelProps) {
  const [data, setData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const fetchDebugData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/debug/ledger?weekNumber=${weekNumber}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Debug fetch failed:', e);
    }
    setLoading(false);
  }, [weekNumber]);

  const resetLedger = async () => {
    if (!confirm('Reset ledger for this week? This cannot be undone.')) return;
    setActionResult('Resetting...');
    try {
      const res = await fetch('/api/debug/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber, action: 'reset' })
      });
      const json = await res.json();
      setActionResult(json.message || json.error);
      fetchDebugData();
    } catch (e) {
      setActionResult('Reset failed: ' + String(e));
    }
  };

  const forceClassify = async () => {
    setActionResult('Running classifier...');
    try {
      const res = await fetch('/api/debug/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber, action: 'force_classify' })
      });
      const json = await res.json();
      if (json.success) {
        setActionResult(`Classified: ${json.before.phase} → ${json.after.phase}, level: ${json.after.level}`);
      } else {
        setActionResult(json.error || 'Unknown error');
      }
      fetchDebugData();
    } catch (e) {
      setActionResult('Classify failed: ' + String(e));
    }
  };

  useEffect(() => {
    if (expanded) fetchDebugData();
  }, [expanded, fetchDebugData]);

  // Auto-refresh every 10 seconds when expanded
  useEffect(() => {
    if (!expanded) return;
    const interval = setInterval(fetchDebugData, 10000);
    return () => clearInterval(interval);
  }, [expanded, fetchDebugData]);

  const currentLedger = data?.ledgers?.[0];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-mono rounded shadow-lg"
      >
        {expanded ? '▼ LEDGER DEBUG' : '▶ DEBUG'}
      </button>

      {expanded && (
        <div className="mt-2 w-[420px] max-h-[70vh] overflow-auto bg-gray-900 border border-yellow-600 rounded-lg p-4 text-xs font-mono shadow-xl">
          {/* Actions */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
            >
              {loading ? '...' : 'Refresh'}
            </button>
            <button
              onClick={forceClassify}
              className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-white"
            >
              Force Classify
            </button>
            <button
              onClick={resetLedger}
              className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-white"
            >
              Reset Ledger
            </button>
          </div>

          {/* Action result */}
          {actionResult && (
            <div className="mb-3 p-2 bg-gray-800 rounded text-gray-300 text-[10px]">
              {actionResult}
            </div>
          )}

          {/* Current Ledger */}
          {currentLedger ? (
            <div className="mb-4">
              <h3 className="text-yellow-400 mb-2 font-bold">Week {weekNumber} Ledger</h3>
              <div className="space-y-1 text-gray-300">
                <Row label="Phase" value={currentLedger.currentPhase} highlight />
                <Row label="Level" value={currentLedger.diagnosticLevel || '(not assessed)'} />
                <Row label="Assessed" value={currentLedger.diagnosticAssessed ? 'Yes' : 'No'} />
                <Row label="Exchanges" value={String(currentLedger.exchangeCount)} />
                <Row label="Energy" value={currentLedger.engagementEnergy} />
                <Row label="Artifact" value={currentLedger.artifactInProgress ? `In progress (${currentLedger.artifactType})` : 'None'} />
                <Row label="Updated" value={new Date(currentLedger.updatedAt).toLocaleTimeString()} />
              </div>

              {currentLedger.guidance && (
                <div className="mt-3 p-2 bg-blue-900/30 rounded border border-blue-800">
                  <span className="text-blue-400 text-[10px]">GUIDANCE:</span>
                  <p className="text-gray-300 mt-1">{currentLedger.guidance}</p>
                </div>
              )}

              {currentLedger.diagnosticEvidence && (
                <div className="mt-2 p-2 bg-green-900/30 rounded border border-green-800">
                  <span className="text-green-400 text-[10px]">EVIDENCE:</span>
                  <p className="text-gray-400 mt-1">{currentLedger.diagnosticEvidence}</p>
                </div>
              )}

              {currentLedger.sessionSummary && (
                <div className="mt-2 p-2 bg-purple-900/30 rounded border border-purple-800">
                  <span className="text-purple-400 text-[10px]">SUMMARY:</span>
                  <p className="text-gray-400 mt-1">{currentLedger.sessionSummary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-400 mb-4">No ledger found for week {weekNumber}</div>
          )}

          {/* Recent Messages */}
          <div>
            <h3 className="text-yellow-400 mb-2 font-bold">Recent Messages</h3>
            <div className="space-y-2 max-h-40 overflow-auto">
              {data?.recentMessages?.slice(0, 8).map((m, i) => (
                <div key={i} className="p-1.5 bg-gray-800 rounded">
                  <span className={m.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                    {m.role}:
                  </span>
                  <span className="text-gray-400 ml-2 text-[10px]">
                    {m.contentPreview}
                  </span>
                </div>
              ))}
              {(!data?.recentMessages || data.recentMessages.length === 0) && (
                <div className="text-gray-500">No messages yet</div>
              )}
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <h3 className="text-yellow-400 mb-2 font-bold">Pipeline Check</h3>
            <div className="space-y-1 text-[10px]">
              <CheckItem ok={!!currentLedger} label="Ledger exists" />
              <CheckItem ok={(currentLedger?.exchangeCount ?? 0) > 0} label="Exchanges recorded" />
              <CheckItem ok={currentLedger?.diagnosticAssessed ?? false} label="Diagnostic assessed" />
              <CheckItem ok={!!currentLedger?.guidance} label="Guidance generated" />
              <CheckItem ok={!!currentLedger?.sessionSummary} label="Summary updated" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex">
      <span className="text-gray-500 w-20">{label}:</span>
      <span className={highlight ? 'text-yellow-300 font-bold' : 'text-white'}>{value}</span>
    </div>
  );
}

function CheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={ok ? 'text-green-400' : 'text-red-400'}>
        {ok ? '✓' : '✗'}
      </span>
      <span className={ok ? 'text-gray-300' : 'text-gray-500'}>{label}</span>
    </div>
  );
}
