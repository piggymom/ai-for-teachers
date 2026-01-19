import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week3TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 3 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 3 Takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Write clear prompts that match your intent so outputs are usable in real classroom
              planning.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What you’ll be able to do" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Turn a teaching goal into a prompt with constraints and tone.</li>
              <li>Iterate outputs using quick follow-ups instead of rewrites.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 3.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>“Act as a middle school teacher and draft a warm-up for [topic].”</li>
              <li>“Give me 3 versions of this explanation at different reading levels.”</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 3.</li>
            </ul>
          </SectionCard>

          <SectionCard title="A quick check before you use it" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Make sure the output is accurate and matches your instructional goal.</li>
              <li>Adjust for your students’ language level and context.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 3.</li>
            </ul>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-3" className={navLinkClasses}>
            Go to Week 3 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
