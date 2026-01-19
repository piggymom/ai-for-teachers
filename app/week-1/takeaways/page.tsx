import { TakeawaysPage } from "../../components/takeaways";

export default function Week1TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={1}
      coreIdeas={[
        "LLMs predict language from patterns, not truth or intent.",
        "Machine learning is the broader field; generative AI is a fast-moving subset.",
        "Agents coordinate tools and steps; agentic workflows still need guardrails.",
        "Verification and citation checks keep classroom use safe.",
        "Human judgment stays in charge of final decisions.",
      ]}
      teacherMoves={[
        "Name the model as a draft partner, not a source of authority.",
        "Use AI for variations, then align outputs to your standards.",
        "Keep student data private and redact before sharing.",
        "Build a quick verification habit: check, compare, edit.",
      ]}
      prompts={[
        "You are my co-teacher. Draft two lesson hooks for a 7th-grade science lesson on ecosystems. Keep them under 60 words.",
        "Summarize the key misconceptions students have about photosynthesis and suggest one quick check for understanding.",
        "Rewrite this parent email to be clear, warm, and concise while keeping all factual details: [paste email].",
      ]}
    />
  );
}
