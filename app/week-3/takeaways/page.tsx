import { TakeawaysPage } from "../../components/takeaways";

export default function Week3TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={3}
      coreIdeas={[
        "Clear prompts reduce drift and save editing time.",
        "Constraints (grade level, length, tone) keep outputs usable.",
        "Ask the model to surface assumptions or uncertainties.",
        "Bias can appear in examples, names, and framing.",
        "Iteration beats one-shot prompts.",
      ]}
      teacherMoves={[
        "Start with role, audience, task, and format in every prompt.",
        "Add a checklist of must-haves before generating.",
        "Request two versions and combine the best pieces.",
        "Scan for bias and adjust names, contexts, or examples.",
      ]}
      prompts={[
        "Act as a 6th-grade ELA coach. Draft a 4-sentence feedback comment on a narrative draft focusing on vivid details and clarity.",
        "Generate three exit ticket questions for a 10th-grade history lesson on the causes of World War I. Keep each under 20 words.",
        "Revise this prompt to be clearer and more constrained: [paste prompt].",
      ]}
    />
  );
}
