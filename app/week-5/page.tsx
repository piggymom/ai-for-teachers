import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";

export default function Week5Page() {
  return (
    <WeekLayout
      eyebrow="Week 5"
      title="Assessment & Feedback"
      dek="Draft rubric-aligned feedback and exemplars, then edit to match your expectations and voice."
      metadata={["35 min estimated", "Assessment"]}
      weekNumber={5}
    >
      <SectionCard title="1) What you'll do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Turn a rubric into short, reusable feedback stems.</li>
          <li>Draft exemplar responses you can edit and annotate.</li>
          <li>Check feedback for clarity, tone, and alignment.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Classroom-safe examples">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Create two sample responses at different proficiency levels.</li>
          <li>Summarize common strengths and next steps for a class set.</li>
          <li>Rewrite feedback to be shorter and more specific.</li>
          <li>Generate sentence starters for peer review.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Copy one rubric row into a prompt and ask for three feedback stems.
            Edit the stems to reflect your voice, then reuse them with students.
          </p>
        </aside>
      </HighlightCard>
    </WeekLayout>
  );
}
