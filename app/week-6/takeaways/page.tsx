import { TakeawaysPage } from "../../components/takeaways";

export default function Week6TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={6}
      coreIdeas={[
        "Clear guardrails protect student privacy and professional trust.",
        "Transparency matters: explain when and how AI is used.",
        "Norms should be reviewed as tools or policies change.",
      ]}
      teacherMoves={[
        "List what data never goes into AI tools and share it with students.",
        "Use consistent disclosure language in family and staff communication.",
        "Revisit acceptable-use expectations at key points in the year.",
      ]}
      prompts={[
        "Draft a classroom AI acceptable-use agreement for middle school students. Keep it to 5–6 bullet points.",
        "Write a short disclosure note to families explaining how AI supports lesson prep and feedback drafts.",
        "Create a teacher privacy checklist for using AI with classroom materials.",
      ]}
    />
  );
}
