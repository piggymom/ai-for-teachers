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
      .then(res => res.json())
      .then(data => {
        setArtifacts(data.artifacts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <ArtifactGallerySkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#fafafa]">Your Artifacts</h2>
          <p className="text-sm text-[#737373] mt-1">
            Prompts, templates, and workflows you've built
          </p>
        </div>
        {artifacts.length > 0 && (
          <span className="text-sm text-[#525252] bg-[#1a1a1a] px-3 py-1 rounded-full">
            {artifacts.length} saved
          </span>
        )}
      </div>

      {artifacts.length === 0 ? (
        <EmptyArtifactState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              isExpanded={expandedId === artifact.id}
              isCopied={copiedId === artifact.id}
              onToggleExpand={() => setExpandedId(expandedId === artifact.id ? null : artifact.id)}
              onCopy={() => copyToClipboard(artifact.content, artifact.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArtifactCard({
  artifact,
  isExpanded,
  isCopied,
  onToggleExpand,
  onCopy
}: {
  artifact: Artifact;
  isExpanded: boolean;
  isCopied: boolean;
  onToggleExpand: () => void;
  onCopy: () => void;
}) {
  const typeLabels: Record<string, string> = {
    prompt_template: "Prompt",
    workflow: "Workflow",
    lesson_outline: "Lesson",
    draft_feedback: "Feedback",
    email_template: "Email",
    communication_template: "Template",
    reflection: "Reflection",
    other: "Artifact"
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-[#333333] transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-[#fafafa]">{artifact.title}</h3>
          <p className="text-xs text-[#525252] mt-0.5">Week {artifact.weekNumber}</p>
        </div>
        <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded-full text-[#737373] border border-[#262626]">
          {typeLabels[artifact.type] || artifact.type}
        </span>
      </div>

      {/* Description */}
      {artifact.description && (
        <p className="text-sm text-[#a1a1a1] mb-3 line-clamp-2">{artifact.description}</p>
      )}

      {/* Tags */}
      {artifact.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {artifact.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-[#1a1a1a] px-2 py-0.5 rounded text-[#525252]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-[#1a1a1a]">
        <button
          onClick={onToggleExpand}
          className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          {isExpanded ? "Hide" : "View"}
        </button>
        <button
          onClick={onCopy}
          className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#262626]">
          <pre className="p-3 bg-[#0a0a0a] rounded-lg text-sm text-[#a1a1a1] overflow-x-auto whitespace-pre-wrap font-mono">
            {artifact.content}
          </pre>
        </div>
      )}
    </div>
  );
}

function EmptyArtifactState() {
  return (
    <div className="text-center py-12 px-6 bg-[#141414] border border-[#262626] rounded-xl">
      <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-[#525252]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-[#fafafa] font-medium mb-2">Your artifact library</h3>
      <p className="text-sm text-[#737373] max-w-xs mx-auto">
        Prompts and workflows you build with Skippy will appear here.
      </p>
    </div>
  );
}

function ArtifactGallerySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-[#1a1a1a] rounded w-32 animate-pulse" />
          <div className="h-4 bg-[#1a1a1a] rounded w-48 animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#141414] border border-[#262626] rounded-xl p-4 animate-pulse">
            <div className="h-5 bg-[#1a1a1a] rounded w-3/4 mb-2" />
            <div className="h-3 bg-[#1a1a1a] rounded w-1/4 mb-3" />
            <div className="h-4 bg-[#1a1a1a] rounded w-full mb-2" />
            <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
