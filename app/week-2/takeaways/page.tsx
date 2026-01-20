import { TakeawaysPage } from "../../components/takeaways";

export default function Week2TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={2}
      coreIdeas={[
        "Plan with the end in mind: goals, standards, and time limits first.",
        "Differentiation improves when you name supports and stretch targets up front.",
        "AI drafts are raw material; teacher review decides what stays.",
      ]}
      teacherMoves={[
        "Provide the lesson goal, constraints, and class context before prompting.",
        "Ask for tiered options and then edit for your students’ readiness.",
        "Request a short, annotated resource list and verify it yourself.",
      ]}
      prompts={[
        "Draft a 45-minute Grade 5 math lesson on fractions with warm-up, guided practice, and exit ticket. Note needed materials.",
        "Create support, on-level, and extension options for a middle school reading discussion on theme.",
        "Suggest 3–4 reputable resources for a high school civics lesson on voting rights, each with a one-sentence note.",
      ]}
    />
  );
}
