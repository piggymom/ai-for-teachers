import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";
import MarkCompleteButton from "../components/mark-complete";

export default function Week2Page() {
  return (
    <WeekLayout
      eyebrow="Week 2"
      title="Planning & Prep"
      dek="Plan lessons with AI-supported outlines, differentiation options, and resource shortlists you review and refine."
      metadata={["30 min estimated", "Planning"]}
      nextWeek={{ href: "/week-3", label: "Week 3" }}
      takeawaysHref="/week-2/takeaways"
    >
      <SectionCard title="1) What you'll do">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft a lesson outline from your existing goals and standards.</li>
          <li>Generate differentiation ideas you can adapt for your students.</li>
          <li>Build a short, vetted resource list to review before sharing.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Classroom-safe examples">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Turn a unit objective into a 3-step mini-lesson plan.</li>
          <li>Ask for two supports and two extensions for the same task.</li>
          <li>Create a materials checklist aligned to a lab or project.</li>
          <li>Summarize a text into a brief background blurb for students.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Paste one of your upcoming lesson objectives and ask for a concise
            outline with time estimates. Keep the structure, then rewrite the
            wording to match your voice.
          </p>
        </aside>
      </HighlightCard>

      <div className="flex justify-start">
        <MarkCompleteButton weekNumber={2} />
      </div>
    </WeekLayout>
  );
}
