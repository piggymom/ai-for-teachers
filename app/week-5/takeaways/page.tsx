import Link from "next/link";
import { SectionCard, navLinkClasses } from "../../components/week-layout";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week5TakeawaysPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            WEEK 5 TAKEAWAYS
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Week 5 takeaways
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Complete the module to unlock a concise recap and reusable prompts.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Coming soon" className={sectionCardClasses}>
            <p>Takeaways will appear here once you complete this module.</p>
          </SectionCard>
        </div>

        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={navLinkClasses}>
            ← Back to course
          </Link>
          <Link href="/week-5" className={navLinkClasses}>
            Back to Week 5 →
          </Link>
        </nav>
      </div>
    </main>
  );
}
