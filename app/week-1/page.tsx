import type { ReactNode } from "react";
import Link from "next/link";
import MarkCompleteButton from "./mark-complete";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

const SectionCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-lg border border-white/5 bg-white/[0.03] p-5 sm:p-6">
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <div className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
        {children}
      </div>
    </div>
  </section>
);

const HighlightCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-lg border border-white/8 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-col gap-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/40">
        Highlight
      </p>
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <div className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
        {children}
      </div>
    </div>
  </section>
);

export default function Week1Page() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-14 sm:gap-14 sm:py-16 lg:px-12">
        <nav>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80"
          >
            ← Back to home
          </Link>
        </nav>

        <header className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 1 Module
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 1: Understanding AI in Teaching
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Practical guidance for using AI to support your teaching practice—without hype, and
              with clear guardrails.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
              <span>25 min estimated</span>
              <span>Classroom-safe</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="1) What AI is (and isn’t)">
            <p>
              Generative AI predicts and produces text, images, and other outputs based on patterns
              in data. It can be helpful for drafting, summarizing, and brainstorming—but it can
              also be wrong, overly confident, or biased. Treat it like a fast assistant, not a
              source of truth.
            </p>
          </SectionCard>

          <SectionCard title="2) Real classroom-safe use cases">
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft parent-facing messages and translate tone (keep final judgment with you).</li>
              <li>Create lesson variations (supports, extensions, alternative examples).</li>
              <li>Generate practice questions and exemplar responses you can edit.</li>
              <li>Turn your notes into a tighter rubric-aligned feedback comment.</li>
            </ul>
          </SectionCard>

          <HighlightCard title="3) One simple thing to try this week">
            <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
              <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
                Take a lesson you already teach and ask AI for three variations: one with more
                scaffolds, one with higher rigor, and one with a different hook. Then keep what’s
                useful and discard the rest.
              </p>
            </aside>
          </HighlightCard>
        </div>

        <div className="flex justify-start">
          <MarkCompleteButton />
        </div>
      </div>
    </main>
  );
}
