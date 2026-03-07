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
        const valid = (data.artifacts || []).filter((a: Artifact) =>
          a.content &&
          !a.content.toLowerCase().includes("no artifact") &&
          !a.content.toLowerCase().includes("there is no")
        );
        setArtifacts(valid);
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

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-medium text-foreground">Your Artifacts</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Prompts, templates, and workflows you&apos;ve built
          </p>
        </div>
        <span className="text-[12px] text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {artifacts.length} saved
        </span>
      </div>

      {artifacts.length === 0 ? null : (
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
    <div className="border border-border rounded-xl p-5 hover:border-primary/20 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-[14px] font-medium text-foreground">{artifact.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Week {artifact.weekNumber}</p>
        </div>
        <span className="text-[11px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
          {typeLabels[artifact.type] || artifact.type}
        </span>
      </div>

      {/* Description */}
      {artifact.description && (
        <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2">{artifact.description}</p>
      )}

      {/* Tags */}
      {artifact.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {artifact.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[11px] bg-secondary px-2 py-0.5 rounded text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <button
          onClick={onToggleExpand}
          className="text-[13px] text-foreground hover:text-primary transition-colors"
        >
          {isExpanded ? "Hide" : "View"}
        </button>
        <button
          onClick={onCopy}
          className="text-[13px] text-foreground hover:text-primary transition-colors"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border">
          <pre className="p-4 bg-secondary rounded-lg text-[13px] text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono">
            {artifact.content}
          </pre>
        </div>
      )}
    </div>
  );
}

function ArtifactGallerySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-32 animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-border rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/4 mb-3" />
            <div className="h-3 bg-muted rounded w-full mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
