import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week6Page() {
  return (
    <WeekLayout
      eyebrow="WEEK 6"
      title="Safety, Policy & Norms"
      dek="Set expectations for responsible AI use and keep your classroom aligned with policy and community trust."
      metadata={["25 min estimated", "Coming soon"]}
    >
      <SectionCard title="Coming soon">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Privacy guardrails to keep student data protected.</li>
          <li>Policy checklists to align with district guidance.</li>
          <li>Student-facing norms for transparent AI use.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
