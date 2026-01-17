import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week4Page() {
  return (
    <WeekLayout
      eyebrow="Week 4"
      title="Classroom Workflows"
      dek="Design classroom routines for communication and feedback that keep you in control of decisions."
      metadata={["35 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-5", label: "Week 5" }}
    >
      <SectionCard title="Coming soon">
        <p>
          We’ll explore messaging templates, feedback loops, and small workflow upgrades that save
          time without sacrificing relationships.
        </p>
      </SectionCard>

      <SectionCard title="What you’ll be able to do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Streamline common teacher communications with AI drafts.</li>
          <li>Create consistent routines for student feedback.</li>
          <li>Set boundaries so AI supports rather than replaces your voice.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
