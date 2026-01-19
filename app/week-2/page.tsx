import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week2Page() {
  return (
    <WeekLayout
      eyebrow="WEEK 2"
      title="Planning & Prep"
      dek="Build simple, repeatable ways to plan lessons faster while keeping your instructional intent front and center."
      metadata={["30 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-3", label: "Week 3" }}
    >
      <SectionCard title="Coming soon">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Lightweight planning templates that keep goals visible.</li>
          <li>Differentiation ideas you can review and refine.</li>
          <li>Resource shortlists to vet for your students.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
