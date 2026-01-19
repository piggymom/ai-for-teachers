import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week3Page() {
  return (
    <WeekLayout
      eyebrow="WEEK 3"
      title="Prompting Basics"
      dek="Learn to craft clear prompts and quick checks so outputs stay accurate, fair, and classroom-ready."
      metadata={["30 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-4", label: "Week 4" }}
    >
      <SectionCard title="Coming soon">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Prompt structures that keep requests focused.</li>
          <li>Context-setting tips for clearer outputs.</li>
          <li>Fast verification habits to catch gaps or bias.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
