import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week3Page() {
  return (
    <WeekLayout
      eyebrow="Week 3"
      title="Prompting Basics"
      dek="Learn to craft clear prompts and quick checks so outputs stay accurate, fair, and classroom-ready."
      metadata={["30 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-4", label: "Week 4" }}
    >
      <SectionCard title="Coming soon">
        <p>
          We’ll walk through prompt structures, context-setting, and fast verification habits that
          keep AI responses grounded and useful.
        </p>
      </SectionCard>

      <SectionCard title="What you’ll be able to do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Write prompts that stay focused and reduce ambiguity.</li>
          <li>Spot-check for bias, gaps, or hallucinations.</li>
          <li>Iterate quickly to get the tone you need.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
