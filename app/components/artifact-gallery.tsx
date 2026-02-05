"use client";

import { useState, useEffect } from "react";

interface Artifact {
  id: string;
  weekNumber: number;
  weekTopic: string;
  title: string;
  type: string;
  content: string;
  description: string | null;
  tags: string[];
  createdAt: string;
}

export function ArtifactGallery() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/artifacts")
      .then((res) => res.json())
      .then((data) => {
        setArtifacts(data.artifacts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load artifacts:", err);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="text-white/50 text-sm">Loading your artifacts...</div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="text-white/50 text-sm">
        No artifacts yet. Complete a conversation with Skippy to save your first
        artifact!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Your Artifacts</h2>
      <p className="text-white/50 text-sm">
        Prompts, templates, and workflows you&apos;ve built with Skippy
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className="bg-white/[0.04] rounded-lg p-4 border border-white/10"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-white">{artifact.title}</h3>
                <p className="text-xs text-white/50">
                  Week {artifact.weekNumber}: {artifact.weekTopic}
                </p>
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70">
                {artifact.type.replace(/_/g, " ")}
              </span>
            </div>

            {artifact.description && (
              <p className="text-sm text-white/70 mb-3">
                {artifact.description}
              </p>
            )}

            {artifact.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-3">
                {artifact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setExpandedId(expandedId === artifact.id ? null : artifact.id)
                }
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {expandedId === artifact.id ? "Hide" : "View"}
              </button>
              <button
                onClick={() => copyToClipboard(artifact.content, artifact.id)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {copiedId === artifact.id ? "Copied!" : "Copy"}
              </button>
            </div>

            {expandedId === artifact.id && (
              <pre className="mt-3 p-3 bg-black/30 rounded text-sm text-white/80 overflow-x-auto whitespace-pre-wrap">
                {artifact.content}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
