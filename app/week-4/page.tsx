import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";
import MarkCompleteButton from "../components/mark-complete";

export default function Week4Page() {
  return (
    <WeekLayout
      eyebrow="Week 4"
      title="Classroom Workflows"
      dek="Design repeatable routines for feedback notes, family communication drafts, and classroom management supports you finalize."
      metadata={["35 min estimated", "Workflows"]}
      nextWeek={{ href: "/week-5", label: "Week 5" }}
      takeawaysHref="/week-4/takeaways"
    >
      <SectionCard title="1) What you'll do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Map a weekly task you can draft with AI and finalize yourself.</li>
          <li>Create a simple template for consistent prompts and outputs.</li>
          <li>Set a review checklist to keep quality and tone consistent.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Classroom-safe examples">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft feedback comments for a common writing rubric.</li>
          <li>Summarize student notes into a brief conference agenda.</li>
          <li>Create a weekly family update you can personalize.</li>
          <li>Generate alternatives for a classroom routine reminder.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Pick one repetitive task (like weekly updates) and build a short
            prompt template. Use it once, edit the draft, and save the final
            version for next time.
          </p>
        </aside>
      </HighlightCard>

      <div className="flex justify-start">
        <MarkCompleteButton storageKey="ai4t_week4_complete" />
      </div>
    </WeekLayout>
  );
}
