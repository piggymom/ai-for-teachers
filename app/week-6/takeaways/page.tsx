import { TakeawaysPage } from "../../components/takeaways";

export default function Week6TakeawaysPage() {
  return (
    <TakeawaysPage
      weekNumber={6}
      coreIdeas={[
        "Privacy expectations should be explicit and consistent.",
        "Acceptable use policies guide both adults and students.",
        "Disclosure builds trust with families and colleagues.",
        "Student norms make AI use transparent and safe.",
        "Safety routines should be reviewed regularly.",
      ]}
      teacherMoves={[
        "Define what data never goes into AI tools.",
        "Post a short acceptable-use checklist for students.",
        "Model disclosure language when AI assists planning.",
        "Revisit norms after new tools or updates roll out.",
      ]}
      prompts={[
        "Draft a classroom AI acceptable-use agreement for middle school students. Keep it to 6 bullet points.",
        "Write a short disclosure note to families explaining how AI is used for lesson prep and feedback drafts.",
        "Create a privacy checklist for teachers before using AI tools with classroom materials.",
      ]}
    />
  );
}
