import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week2Page() {
  return (
    <WeekLayout
      eyebrow="Week 2"
      title="Planning & Prep"
      dek="Build simple, repeatable ways to plan lessons faster while keeping your instructional intent front and center."
      metadata={["30 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-3", label: "Week 3" }}
    >
      <SectionCard title="Coming soon">
        <p>
          We’ll cover lightweight planning templates, differentiation ideas, and ways to keep AI
          drafts aligned to your standards and students.
        </p>
      </SectionCard>

      <SectionCard title="What you’ll be able to do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft lesson outlines that match your existing routines.</li>
          <li>Generate quick extensions and scaffolds for diverse learners.</li>
          <li>Curate resources without losing your voice or priorities.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
