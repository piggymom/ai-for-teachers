import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week5TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 5 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 5 Takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Streamline assessment and feedback while keeping your criteria and judgment intact.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What you’ll be able to do" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft rubrics or checklists aligned to learning targets.</li>
              <li>Generate feedback stems you can personalize quickly.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 5.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>“Draft a rubric with 3 levels for [skill] in student-friendly language.”</li>
              <li>“Turn these notes into 3 actionable feedback comments.”</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 5.</li>
            </ul>
          </SectionCard>

          <SectionCard title="A quick check before you use it" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Confirm feedback is accurate, fair, and tied to evidence.</li>
              <li>Review tone and adjust for student context.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 5.</li>
            </ul>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-5" className={navLinkClasses}>
            Go to Week 5 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
