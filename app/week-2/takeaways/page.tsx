import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week2TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 2);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 2 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Planning & Prep
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              AI can help you plan faster, but you decide what fits your students. Use these
              takeaways as a quick reference when drafting lessons.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Key ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>AI drafts outlines and ideas; you shape them to your context.</li>
              <li>Differentiation options (scaffolds, extensions) are suggestions to adapt.</li>
              <li>Resource lists need your review before sharing with students.</li>
              <li>The teacher review loop keeps quality and alignment in your hands.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Turn a unit objective into a short lesson outline with time estimates.</li>
              <li>Ask for two supports and two extensions for the same task.</li>
              <li>Generate a materials checklist aligned to a lab or project.</li>
              <li>Summarize a text into a background blurb you can edit for students.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Review before you use" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Check that suggested resources actually exist and are appropriate.</li>
              <li>Adjust reading levels and vocabulary to match your class.</li>
              <li>Remove or rewrite anything that doesn't fit your teaching style.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Try this" className={sectionCardClasses}>
            <p>
              Paste one upcoming lesson objective and ask: "Give me a 3-step outline with time
              estimates and one extension activity." Keep the structure, rewrite the wording.
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
