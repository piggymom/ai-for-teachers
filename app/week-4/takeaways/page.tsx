import { TakeawaysPage } from "../../components/takeaways";

export default function Week4TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={4}
      coreIdeas={[
        "Workflow templates make AI use repeatable and reliable.",
        "Drafting feedback or family comms is faster with clear context.",
        "Routines keep AI use consistent across a week.",
        "Human-in-the-loop checks protect tone and accuracy.",
        "Small pilots reveal what scales in your classroom.",
      ]}
      teacherMoves={[
        "Create a weekly checklist of AI-assisted tasks.",
        "Draft feedback in batches, then personalize the final lines.",
        "Use AI to draft family messages and verify details.",
        "Set a routine for reviewing AI outputs before sharing.",
      ]}
      prompts={[
        "Draft a feedback comment for a student lab report. Focus on evidence, clarity, and one next step. Keep it to 4 sentences.",
        "Write a warm, concise family update about our upcoming unit on weather. Include dates and a simple at-home conversation starter.",
        "Design a weekly AI workflow for grading short responses: steps, time estimates, and checkpoints.",
      ]}
    />
  );
}
