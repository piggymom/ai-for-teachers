import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week5TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 5);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 5 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Assessment & Feedback
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              AI can draft feedback and exemplars, but your expertise shapes the final product.
              Use these patterns to save time without losing your voice.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Key ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>AI can turn rubric criteria into reusable feedback stems.</li>
              <li>Exemplar responses are drafts—edit them to match your standards.</li>
              <li>Your voice and expectations must come through in final feedback.</li>
              <li>Calibration matters: review AI suggestions against your own judgment.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Create sample responses at different proficiency levels.</li>
              <li>Summarize common strengths and next steps for a class set.</li>
              <li>Rewrite feedback to be shorter, clearer, and more specific.</li>
              <li>Generate sentence starters for student peer review.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Maintain integrity" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Never let AI see actual student work or personal information.</li>
              <li>Use AI for patterns and templates, not for evaluating individuals.</li>
              <li>Your professional judgment determines what feedback students receive.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Try this" className={sectionCardClasses}>
            <p>
              Copy one rubric row into a prompt and ask for three feedback stems (one for
              each performance level). Edit the stems to reflect your voice, then reuse them
              when grading.
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
