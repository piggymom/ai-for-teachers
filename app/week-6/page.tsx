import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week6Page() {
  return (
    <WeekLayout
      eyebrow="Week 6"
      title="Safety, Policy & Norms"
      dek="Set expectations for responsible AI use and keep your classroom aligned with policy and community trust."
      metadata={["25 min estimated", "Coming soon"]}
    >
      <SectionCard title="Coming soon">
        <p>
          We’ll outline privacy guardrails, policy checklists, and student-facing norms so AI stays
          safe, transparent, and appropriate.
        </p>
      </SectionCard>

      <SectionCard title="What you’ll be able to do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Define classroom AI norms students can follow.</li>
          <li>Align usage with district policy and data privacy rules.</li>
          <li>Communicate expectations clearly with families.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
