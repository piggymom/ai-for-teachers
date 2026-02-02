import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";
import { PodcastPlayer } from "../../components/podcast-player";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week1TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 1);

  return (
    <main className="min-h-screen bg-[#191919] text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-16">
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Week 1 Takeaways
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl font-normal tracking-tight text-white/90">
              Understanding AI in Teaching
            </h1>
            <p className="text-[15px] font-light leading-relaxed text-white/40">
              Your quick reference for classroom-safe AI use.
            </p>
          </div>
        </header>

        {/* Personalized Podcast Player */}
        <section>
          <PodcastPlayer week={1} />
        </section>

        {/* Reference sections */}
        <div className="flex flex-col gap-6">
          <SectionCard title="What AI is (and isn't)" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li>Generates drafts and ideas from patterns, not facts or truth.</li>
              <li>Can be fast and useful, but also wrong or overconfident.</li>
              <li>Works best as a starting point you edit and verify.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe uses" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li>Draft parent messages and adjust tone (you approve final).</li>
              <li>Create lesson variations for supports or extensions.</li>
              <li>Generate practice questions you can refine.</li>
              <li>Summarize your notes into clearer feedback language.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Guardrails that matter" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li>Never paste sensitive student data or records.</li>
              <li>Check for accuracy, bias, and alignment to your goals.</li>
              <li>Keep human judgment and final decisions with you.</li>
            </ul>
          </SectionCard>

          <SectionCard title="One thing to try next" className={sectionCardClasses}>
            <p className="text-[14px] text-white/50">
              Take a lesson you already teach and ask for two alternate hooks. Keep what fits
              your students and delete the rest.
            </p>
          </SectionCard>
        </div>

        <nav>
          <form action={completeAndReturn}>
            <button
              type="submit"
              className="text-[14px] text-white/40 transition hover:text-white/70"
            >
              ← Back to course
            </button>
          </form>
        </nav>
      </div>
    </main>
  );
}
