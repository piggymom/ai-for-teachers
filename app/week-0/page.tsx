import Link from "next/link";
import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week0Page() {
  return (
    <WeekLayout
      eyebrow="Week 0"
      title="About This Course"
      dek="A short orientation to help you use AI as a thoughtful teaching partner—without losing your professional judgment."
      metadata={["5 min estimated", "Orientation"]}
      nextWeek={{ href: "/week-1", label: "Week 1" }}
    >
      <SectionCard title="Who this is for">
        <p>
          Educators who want practical, classroom-safe ways to use AI for planning, communication,
          and feedback—without replacing their expertise.
        </p>
      </SectionCard>

      <SectionCard title="What this course is / isn’t">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>It is short, actionable guidance you can use immediately.</li>
          <li>It is not a technical deep dive or a promise of automation.</li>
          <li>It assumes you remain the decision-maker at every step.</li>
        </ul>
      </SectionCard>

      <SectionCard title="How it’s structured">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Week 1: Understanding AI in Teaching</li>
          <li>Week 2: Planning &amp; Prep</li>
          <li>Week 3: Prompting Basics</li>
          <li>Week 4: Classroom Workflows</li>
          <li>Week 5: Assessment &amp; Feedback</li>
          <li>Week 6: Safety, Policy &amp; Norms</li>
        </ul>
      </SectionCard>

      <SectionCard title="Guardrails & professional judgment">
        <p>
          AI can draft and summarize, but it cannot know your students or context. Always review,
          verify, and adjust outputs before they touch learners, families, or records.
        </p>
      </SectionCard>

      <SectionCard title="Start Week 1">
        <p>
          Ready to begin? Jump into Week 1 for the essential grounding in what AI is and how to use
          it responsibly.
        </p>
        <div className="mt-4">
          <Link
            href="/week-1"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Go to Week 1 →
          </Link>
        </div>
      </SectionCard>
    </WeekLayout>
  );
}
