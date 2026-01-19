import { SectionCard, WeekLayout } from "../components/week-layout";

export default function Week4Page() {
  return (
    <WeekLayout
      eyebrow="WEEK 4"
      title="Classroom Workflows"
      dek="Design classroom routines for communication and feedback that keep you in control of decisions."
      metadata={["35 min estimated", "Coming soon"]}
      nextWeek={{ href: "/week-5", label: "Week 5" }}
    >
      <SectionCard title="Coming soon">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Messaging templates for common classroom communications.</li>
          <li>Feedback routines you can adapt to your cadence.</li>
          <li>Boundaries that keep your voice front and center.</li>
        </ul>
      </SectionCard>
    </WeekLayout>
  );
}
