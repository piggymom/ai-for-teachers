import { TakeawaysPage } from "../../components/takeaways";

export default function Week2TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={2}
      coreIdeas={[
        "Strong prep starts with clear outcomes and constraints.",
        "Outlines give AI the structure it needs to stay on target.",
        "Differentiation works best when you specify supports and stretch goals.",
        "A short resource list helps the model stay grounded.",
        "Teacher review remains the final filter for quality and tone.",
      ]}
      teacherMoves={[
        "Define the lesson goal, standard, and time window before prompting.",
        "Ask for tiered options (support/on-level/extension).",
        "Provide 2–3 trusted sources or examples to anchor outputs.",
        "Scan for alignment and adjust pacing or vocabulary as needed.",
      ]}
      prompts={[
        "Create a lesson outline for a 45-minute grade 5 math lesson on fractions. Include warm-up, guided practice, and exit ticket.",
        "Give me three differentiation options for a middle school reading discussion: support, on-level, and extension.",
        "Draft a short resource shortlist (3–5 items) to support a high school civics lesson on voting rights with brief annotations.",
      ]}
    />
  );
}
