import type { ReactNode } from "react";
import Link from "next/link";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

const SectionCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
    <div className="mt-4 text-base leading-relaxed text-white/80">{children}</div>
  </section>
);

export default function Week1Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Week 1 Module</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Week 1: Understanding AI in Teaching
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            Practical guidance for using AI to support your teaching practice—without hype, and with
            clear guardrails.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <SectionCard title="1) What AI is (and isn’t)">
            <p>
              Generative AI predicts and produces text, images, and other outputs based on patterns
              in data. It can be helpful for drafting, summarizing, and brainstorming—but it can
              also be wrong, overly confident, or biased. Treat it like a fast assistant, not a
              source of truth.
            </p>
          </SectionCard>

          <SectionCard title="2) Real classroom-safe use cases">
            <ul className="list-disc space-y-2 pl-5">
              <li>Draft parent-facing messages and translate tone (keep final judgment with you).</li>
              <li>Create lesson variations (supports, extensions, alternative examples).</li>
              <li>Generate practice questions and exemplar responses you can edit.</li>
              <li>Turn your notes into a tighter rubric-aligned feedback comment.</li>
            </ul>
          </SectionCard>

          <SectionCard title="3) One simple thing to try this week">
            <aside className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-base leading-relaxed text-white/80">
                Take a lesson you already teach and ask AI for three variations: one with more
                scaffolds, one with higher rigor, and one with a different hook. Then keep what’s
                useful and discard the rest.
              </p>
            </aside>
          </SectionCard>
        </div>

        <div>
          <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Back to home →
          </Link>
        </div>
      </div>
    </main>
  );
}
