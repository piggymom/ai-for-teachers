import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week5Page() {
  return (
    <WeekLayout
      eyebrow="Week 5"
      title="Assessment & Feedback"
      dek="Use AI to support stronger feedback while keeping your professional judgment and tone intact."
      metadata={["35 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-6", label: "Week 6" }}
    >
      <SectionCard title="Coming soon">
        <p>
          We’ll cover rubric-aligned feedback drafts, exemplar responses, and safeguards for
          maintaining grading integrity.
        </p>
      </SectionCard>

      <SectionCard title="What you’ll be able to do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft feedback aligned to your rubric language.</li>
          <li>Create exemplars you can adjust for your class context.</li>
          <li>Maintain fairness with human review checkpoints.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
