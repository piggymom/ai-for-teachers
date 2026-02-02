import { SectionCard } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";
import { PodcastPlayer } from "../../components/podcast-player";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week0TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 0);

  return (
    <main className="min-h-screen bg-[#191919] text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-16">
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Week 0 Takeaways
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl font-normal tracking-tight text-white/90">
              Getting Started
            </h1>
            <p className="text-[15px] font-light leading-relaxed text-white/40">
              Your personalized intro and course preview.
            </p>
          </div>
        </header>

        {/* Personalized Podcast Player */}
        <section>
          <PodcastPlayer week={0} />
        </section>

        {/* Reference sections */}
        <div className="flex flex-col gap-6">
          <SectionCard title="What this course is about" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li>Practical AI skills you can use in your classroom—no hype.</li>
              <li>Clear guardrails so you stay in control.</li>
              <li>Personalized to your subject, grade level, and constraints.</li>
            </ul>
          </SectionCard>

          <SectionCard title="What you'll learn" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li><strong className="text-white/60">Week 1:</strong> What AI is (and isn't) — foundations and guardrails.</li>
              <li><strong className="text-white/60">Week 2:</strong> Prompting fundamentals — the 4C framework.</li>
              <li><strong className="text-white/60">Week 3:</strong> Lesson planning with AI as your thought partner.</li>
              <li><strong className="text-white/60">Week 4:</strong> Feedback & assessment — drafts you personalize.</li>
              <li><strong className="text-white/60">Week 5:</strong> Communication & admin — emails, newsletters, forms.</li>
              <li><strong className="text-white/60">Week 6:</strong> Building sustainable AI routines that stick.</li>
            </ul>
          </SectionCard>

          <SectionCard title="How to get the most out of this" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-white/50 marker:text-white/20">
              <li>Talk to Skippy like a colleague—share your real context.</li>
              <li>Try the activities with actual lessons you teach.</li>
              <li>Come back to takeaways as a quick reference.</li>
            </ul>
          </SectionCard>
        </div>

        <nav>
          <form action={completeAndReturn}>
            <button
              type="submit"
              className="text-[14px] text-white/40 transition hover:text-white/70"
            >
              ← Back to course
            </button>
          </form>
        </nav>
      </div>
    </main>
  );
}
