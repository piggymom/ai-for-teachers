import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";
import MarkCompleteButton from "../components/mark-complete";

export default function Week3Page() {
  return (
    <WeekLayout
      eyebrow="Week 3"
      title="Prompting Basics"
      dek="Write clear prompts, check outputs for accuracy and bias, and decide what fits your students."
      metadata={["30 min estimated", "Prompting"]}
      nextWeek={{ href: "/week-4", label: "Week 4" }}
      takeawaysHref="/week-3/takeaways"
    >
      <SectionCard title="1) What you'll do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Turn a task into a short, specific prompt with clear constraints.</li>
          <li>Review outputs for accuracy, tone, and missing context.</li>
          <li>Refine prompts so the results align to your expectations.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Classroom-safe examples">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft a parent email with a requested length and tone.</li>
          <li>Generate three exit ticket questions at varying difficulty.</li>
          <li>Create a quick glossary from a reading selection.</li>
          <li>Rewrite directions for clarity at a lower reading level.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Take a prompt you already use and add three constraints: audience,
            length, and format. Compare the results and keep the clearest
            version.
          </p>
        </aside>
      </HighlightCard>

      <div className="flex justify-start">
        <MarkCompleteButton weekNumber={3} />
      </div>
    </WeekLayout>
  );
}
