"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { SectionCard, navLinkClasses } from "./week-layout";

type TakeawaysPageProps = {
  weekNumber: number;
  coreIdeas: string[];
  teacherMoves: string[];
  prompts: string[];
};

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export const TakeawaysPage = ({
  weekNumber,
  coreIdeas,
  teacherMoves,
  prompts,
}: TakeawaysPageProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2200);
  }, []);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      alert("Copy failed. Please copy the prompt manually.");
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            WEEK {weekNumber} TAKEAWAYS
          </p>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Week {weekNumber} Takeaways
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80"
                  onClick={() => showToast("Audio briefings coming soon.")}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 fill-white/70"
                  >
                    <path d="M4 3.5v9l8-4.5-8-4.5z" />
                  </svg>
                  Listen
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80"
                  onClick={() => showToast("Notes library coming soon.")}
                >
                  Save to my notes
                </button>
              </div>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              A quick, classroom-safe summary of what matters from Week {weekNumber}.
            </p>
            {toastMessage ? (
              <div
                role="status"
                className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
              >
                {toastMessage}
              </div>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Core ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              {coreIdeas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Teacher moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              {teacherMoves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <div className="space-y-4">
              {prompts.map((prompt, index) => (
                <div
                  key={prompt}
                  className="rounded-xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                      Prompt {index + 1}
                    </span>
                    <button
                      type="button"
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:border-white/30 hover:text-white"
                      onClick={() => handleCopy(prompt, index)}
                    >
                      {copiedIndex === index ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-white/80">
                    {prompt}
                  </pre>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href={`/week-${weekNumber}`} className={navLinkClasses}>
            Review Week {weekNumber} →
          </Link>
        </nav>
      </div>
    </main>
  );
};
