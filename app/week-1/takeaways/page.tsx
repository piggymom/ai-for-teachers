import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

export default function Week1TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            WEEK 1 TAKEAWAYS
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your Week 1 takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Short summary of what you learned and what to try next—adapt it to your context.
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <SectionCard title="What to remember">
            <ul className="list-disc space-y-2 pl-5 text-white/75 marker:text-white/30">
              <li>Generative AI predicts text; it can be useful and still be wrong.</li>
              <li>Use it like a fast draft partner—not a source of truth.</li>
              <li>The teacher remains the decision-maker: review, verify, and edit.</li>
            </ul>
          </SectionCard>

          <SectionCard title="What to try next">
            <ul className="list-disc space-y-2 pl-5 text-white/75 marker:text-white/30">
              <li>
                Pick one lesson you already teach and request three variations (more support / more
                rigor / new hook).
              </li>
              <li>Keep one useful improvement and discard the rest.</li>
              <li>Save the prompt that worked so you can reuse it.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Guardrails">
            <ul className="list-disc space-y-2 pl-5 text-white/75 marker:text-white/30">
              <li>Don’t paste sensitive student info; keep inputs de-identified.</li>
              <li>
                If the output will touch students/families/records, double-check it before you use
                it.
              </li>
            </ul>
          </SectionCard>
        </section>

        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-1" className={navLinkClasses}>
            Revisit Week 1 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
