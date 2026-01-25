import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week1TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 1);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 1 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 1: Key takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Classroom-safe, no hype, and your professional judgment stays with you. Use these as
              your quick reference before planning with AI.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What AI is (and isn't)" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Generates drafts and ideas from patterns, not facts or truth.</li>
              <li>Can be fast and useful, but also wrong or overconfident.</li>
              <li>Works best as a starting point you edit and verify.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe uses" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft parent messages and adjust tone (you approve final).</li>
              <li>Create lesson variations for supports or extensions.</li>
              <li>Generate practice questions you can refine.</li>
              <li>Summarize your notes into clearer feedback language.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Guardrails that matter" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Never paste sensitive student data or records.</li>
              <li>Check for accuracy, bias, and alignment to your goals.</li>
              <li>Keep human judgment and final decisions with you.</li>
            </ul>
          </SectionCard>

          <SectionCard title="One thing to try next" className={sectionCardClasses}>
            <p>
              Take a lesson you already teach and ask for two alternate hooks. Keep what fits
              your students and delete the rest.
            </p>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <form action={completeAndReturn}>
            <button type="submit" className={navLinkClasses}>
              ← Back to Course Index
            </button>
          </form>
        </nav>
      </div>
    </main>
  );
}
