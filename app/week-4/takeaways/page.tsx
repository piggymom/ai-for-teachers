import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week4TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 4);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 4 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Classroom Workflows
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Repeatable routines save the most time. Use these patterns to build workflows
              you can rely on week after week.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Key ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Identify tasks you repeat weekly that AI can draft for you.</li>
              <li>Create simple templates so your prompts stay consistent.</li>
              <li>Build a review checklist to maintain quality and tone.</li>
              <li>Save successful outputs as starting points for next time.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft feedback comments aligned to a common rubric criterion.</li>
              <li>Summarize student notes into a brief conference agenda.</li>
              <li>Create a weekly family update template you can personalize.</li>
              <li>Generate alternatives for classroom routine reminders.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Keep it sustainable" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Start with one workflow; add more only after it's reliable.</li>
              <li>Edit every draft before sending—never send AI output directly.</li>
              <li>Track what works and what doesn't so you can improve over time.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Try this" className={sectionCardClasses}>
            <p>
              Pick one repetitive task (like weekly updates or feedback comments). Write a
              short prompt template, use it once, edit the draft, and save the final version
              for next time.
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
