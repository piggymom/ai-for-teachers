import { HighlightCard, SectionCard, WeekLayout } from "../components/week-layout";
import MarkCompleteButton from "./mark-complete";

export default function Week1Page() {
  return (
    <WeekLayout
      eyebrow="Week 1"
      title="Understanding AI in Teaching"
      dek="Practical guidance for using AI to support your teaching practice—without hype, and with clear guardrails."
      metadata={["25 min estimated", "Classroom-safe"]}
      nextWeek={{ href: "/week-2", label: "Week 2" }}
    >
      <SectionCard title="1) What AI is (and isn’t)">
        <p>
          Generative AI predicts and produces text, images, and other outputs based on patterns in
          data. It can be helpful for drafting, summarizing, and brainstorming—but it can also be
          wrong, overly confident, or biased. Treat it like a fast assistant, not a source of
          truth.
        </p>
      </SectionCard>

      <SectionCard title="2) Real classroom-safe use cases">
        <ul className="list-disc space-y-1.5 pl-4 text-white/75 marker:text-white/30">
          <li>Draft parent-facing messages and translate tone (keep final judgment with you).</li>
          <li>Create lesson variations (supports, extensions, alternative examples).</li>
          <li>Generate practice questions and exemplar responses you can edit.</li>
          <li>Turn your notes into a tighter rubric-aligned feedback comment.</li>
        </ul>
      </SectionCard>

      <HighlightCard title="3) One simple thing to try this week">
        <aside className="rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:p-5">
          <p className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            Take a lesson you already teach and ask AI for three variations: one with more
            scaffolds, one with higher rigor, and one with a different hook. Then keep what’s
            useful and discard the rest.
          </p>
        </aside>
      </HighlightCard>

      <div className="flex justify-start">
        <MarkCompleteButton />
      </div>
    </WeekLayout>
  );
}
