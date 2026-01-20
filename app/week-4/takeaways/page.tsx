import { TakeawaysPage } from "../../components/takeaways";

export default function Week4TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={4}
      coreIdeas={[
        "Repeatable routines make AI support predictable and easier to review.",
        "Drafts for feedback and communication still need a teacher’s final voice.",
        "Small pilots help you decide what is worth keeping.",
      ]}
      teacherMoves={[
        "Pick 1–2 tasks to standardize (feedback drafts, family updates).",
        "Batch drafts, then personalize the last line for each student or class.",
        "Set a quick review step before anything is shared.",
      ]}
      prompts={[
        "Draft a 4-sentence feedback comment on a student lab report, focusing on evidence, clarity, and one next step.",
        "Write a warm, concise family update about our upcoming unit on weather. Include dates and one at-home conversation starter.",
        "Outline a weekly AI routine for drafting feedback on short responses, including checkpoints for teacher review.",
      ]}
    />
  );
}
