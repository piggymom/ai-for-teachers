import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";
import MarkCompleteButton from "../components/mark-complete";

export default function Week6Page() {
  return (
    <WeekLayout
      eyebrow="Week 6"
      title="Safety, Policy & Norms"
      dek="Establish guardrails, privacy expectations, and classroom norms with your professional judgment at the center."
      metadata={["25 min estimated", "Safety & norms"]}
      takeawaysHref="/week-6/takeaways"
    >
      <SectionCard title="1) What you'll do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Clarify when AI use is appropriate and when it is not.</li>
          <li>Draft a short policy statement in plain language.</li>
          <li>Set expectations for privacy, data, and attribution.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Classroom-safe examples">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Create a one-paragraph family-facing AI statement.</li>
          <li>List what student data should never be shared with tools.</li>
          <li>Write a checklist for reviewing AI-generated materials.</li>
          <li>Draft norms for when students can use AI in class.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Take your existing tech policy and add a short AI section with three
            do's and three don'ts. Share it with a colleague for a quick review.
          </p>
        </aside>
      </HighlightCard>

      <div className="flex justify-start">
        <MarkCompleteButton storageKey="ai4t_week6_complete" />
      </div>
    </WeekLayout>
  );
}
