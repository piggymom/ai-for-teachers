import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week5Page() {
  return (
    <WeekLayout
      eyebrow="WEEK 5"
      title="Assessment & Feedback"
      dek="Use AI to support stronger feedback while keeping your professional judgment and tone intact."
      metadata={["35 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-6", label: "Week 6" }}
    >
      <SectionCard title="Coming soon">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Rubric-aligned feedback drafts you can revise.</li>
          <li>Exemplar responses to calibrate with your class context.</li>
          <li>Integrity checkpoints for fairness and consistency.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
