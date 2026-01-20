import { TakeawaysPage } from "../../components/takeaways";

export default function Week5TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={5}
      coreIdeas={[
        "Feedback is most useful when it aligns to the rubric or success criteria.",
        "Exemplars clarify expectations and keep standards steady.",
        "Edits should preserve student voice and authentic learning.",
      ]}
      teacherMoves={[
        "Anchor AI drafts to your rubric language and required evidence.",
        "Separate strengths from next steps to keep feedback actionable.",
        "Check for mismatches in voice or performance level.",
      ]}
      prompts={[
        "Using this rubric, draft feedback for a 9th-grade persuasive essay. Keep it to 5 sentences: [paste rubric].",
        "Create two anonymized exemplar responses at different performance levels for this prompt: [paste prompt].",
        "Edit this student paragraph for clarity while preserving the student’s voice and ideas: [paste paragraph].",
      ]}
    />
  );
}
