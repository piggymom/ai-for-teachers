import { TakeawaysPage } from "../../components/takeaways";

export default function Week5TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={5}
      coreIdeas={[
        "Feedback is strongest when tied to a rubric or success criteria.",
        "Exemplars help students see quality and reduce guesswork.",
        "AI can polish clarity but should not replace student voice.",
        "Integrity checks protect authentic learning.",
        "Human review ensures fairness and accuracy.",
      ]}
      teacherMoves={[
        "Paste rubric language to anchor feedback suggestions.",
        "Ask for two versions of feedback: strengths and next steps.",
        "Use exemplars to calibrate tone and expectations.",
        "Run a quick integrity check: look for style mismatches.",
      ]}
      prompts={[
        "Using this rubric, draft feedback for a 9th-grade persuasive essay: [paste rubric]. Keep it to 5 sentences.",
        "Create two anonymized exemplar responses to this prompt at different performance levels: [paste prompt].",
        "Edit this student paragraph for clarity while preserving the student’s voice and ideas: [paste paragraph].",
      ]}
    />
  );
}
