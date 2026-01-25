import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week3TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 3);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 3 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Prompting Basics
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Clear prompts get better results. Use these principles to write prompts that
              save time and produce outputs you can actually use.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Key ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Specific prompts with constraints (audience, length, format) work best.</li>
              <li>AI outputs need checking for accuracy, tone, and missing context.</li>
              <li>Iteration is normal: refine your prompt until the result fits.</li>
              <li>Save prompts that work well so you can reuse them.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft a parent email specifying length (2 paragraphs) and tone (warm, direct).</li>
              <li>Generate exit ticket questions at varying difficulty levels.</li>
              <li>Create a quick glossary from a reading selection.</li>
              <li>Rewrite directions for clarity at a lower reading level.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Check before you use" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Verify any facts, dates, or claims the AI includes.</li>
              <li>Watch for bias or assumptions that don't fit your students.</li>
              <li>Make sure the tone matches your voice and classroom culture.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Try this" className={sectionCardClasses}>
            <p>
              Take a prompt you've used before and add three constraints: audience (e.g., "5th
              graders"), length (e.g., "3 sentences"), and format (e.g., "bulleted list").
              Compare the results.
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
