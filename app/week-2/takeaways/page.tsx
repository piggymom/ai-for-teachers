import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week2TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 2 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 2 Takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Plan lessons and prep materials faster while keeping goals, standards, and your
              classroom context in view.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What you’ll be able to do" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Outline a lesson plan aligned to objectives and pacing.</li>
              <li>Prep differentiated supports in minutes, then refine.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 2.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>“Draft a 45-minute lesson plan for [topic] with 3 checkpoints.”</li>
              <li>“Create two scaffolds and one extension for [skill].”</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 2.</li>
            </ul>
          </SectionCard>

          <SectionCard title="A quick check before you use it" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Confirm alignment to standards and your scope and sequence.</li>
              <li>Verify materials fit your time, resources, and student needs.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 2.</li>
            </ul>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-2" className={navLinkClasses}>
            Go to Week 2 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
