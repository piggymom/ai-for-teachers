import { TakeawaysPage } from "../../components/takeaways";

export default function Week3TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={3}
      coreIdeas={[
        "Good prompts specify the task, audience, and format to reduce drift.",
        "Constraints surface limits and make revision faster.",
        "Bias and gaps can show up in examples, so outputs need review.",
      ]}
      teacherMoves={[
        "Use a simple prompt frame: role, task, constraints, and tone.",
        "Ask for two options, then combine the strongest parts.",
        "Check for assumptions, missing context, or biased framing.",
      ]}
      prompts={[
        "You are a 6th-grade ELA coach. Draft a 4-sentence feedback comment on a narrative focusing on vivid details and clarity.",
        "Write three exit ticket questions for a 10th-grade history lesson on causes of World War I. Keep each under 20 words.",
        "Improve this prompt by adding audience, constraints, and format: [paste prompt].",
      ]}
    />
  );
}
