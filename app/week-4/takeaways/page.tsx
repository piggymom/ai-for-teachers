import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week4TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 4 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 4 Takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Build reliable classroom workflows so AI supports routines without adding extra work.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What you’ll be able to do" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Map a routine from planning to delivery with clear handoffs.</li>
              <li>Set up templates to reuse across units or classes.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 4.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>“Create a weekly workflow checklist for [subject] planning.”</li>
              <li>“Turn this routine into a template I can reuse next week.”</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 4.</li>
            </ul>
          </SectionCard>

          <SectionCard title="A quick check before you use it" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Confirm the workflow fits your schedule and prep time.</li>
              <li>Make sure each step aligns with your classroom expectations.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 4.</li>
            </ul>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-4" className={navLinkClasses}>
            Go to Week 4 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
