import { SectionCard, navLinkClasses } from "../../components/week-layout";
import { completeWeekAndReturn } from "../../actions/progress";

const sectionCardClasses = "rounded-2xl border-white/10 bg-white/[0.04]";

export default function Week6TakeawaysPage() {
  const completeAndReturn = completeWeekAndReturn.bind(null, 6);

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:px-12">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            Week 6 Takeaways
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Safety, Policy & Norms
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Clear guardrails protect students and support your professional judgment.
              Use these principles to set expectations for yourself and your classroom.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">
          <SectionCard title="Key ideas" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Define when AI use is appropriate and when it is not.</li>
              <li>Privacy is non-negotiable: never share student data with AI tools.</li>
              <li>Norms should be clear, simple, and easy to explain to families.</li>
              <li>Your professional judgment stays at the center of every decision.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Classroom-safe moves" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>Draft a one-paragraph family-facing AI statement.</li>
              <li>List what student data should never be shared with any tool.</li>
              <li>Write a checklist for reviewing AI-generated materials.</li>
              <li>Create simple norms for when students may use AI in class.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Non-negotiables" className={sectionCardClasses}>
            <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
              <li>No student names, grades, IEP details, or personal info in prompts.</li>
              <li>Always review and edit AI outputs before they reach students.</li>
              <li>Follow your school and district policies on technology use.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Try this" className={sectionCardClasses}>
            <p>
              Take your existing tech policy (or start fresh) and add a short AI section with
              three do's and three don'ts. Share it with a colleague for feedback before
              finalizing.
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
