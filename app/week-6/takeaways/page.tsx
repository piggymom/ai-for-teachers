import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week6TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 6 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 6 Takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Apply safety and policy norms so AI use stays compliant, transparent, and responsible.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="What you’ll be able to do" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Identify what data is safe to share and what is not.</li>
              <li>Document classroom norms for AI use with students.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 6.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Prompts you can reuse" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>“Summarize our district AI policy in teacher-friendly terms.”</li>
              <li>“Draft a family-facing note about how AI supports learning.”</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 6.</li>
            </ul>
          </SectionCard>

          <SectionCard title="A quick check before you use it" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Confirm compliance with your district and school policies.</li>
              <li>Ensure transparency about where AI assisted your work.</li>
              <li>This module is releasing next—takeaways will populate once you complete Week 6.</li>
            </ul>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-6" className={navLinkClasses}>
            Go to Week 6 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
