/**
 * Module prompts for each week of the AI for Teachers course.
 * These define Skippy's focus and learning objectives per week.
 */

export type ModulePrompt = {
  week: number;
  title: string;
  prompt: string;
  openingMessage: string;
};

export const modulePrompts: Record<number, ModulePrompt> = {
  0: {
    week: 0,
    title: "Getting Started",
    prompt: `This is Week 0: Getting Started with the course.
Focus on helping the teacher understand what this course offers and how to get the most out of it.
Key topics:
- Course overview and structure
- What they'll learn each week
- How to use Skippy effectively
- Setting expectations for AI as a teaching assistant
Keep it welcoming and orient them to the journey ahead.`,
    openingMessage: `Welcome to AI for Teachers! I'm Skippy, and I'll be your guide through this 6-week journey.

This course is designed to help you build practical AI skills you can use in your classroom—without the hype, and with clear guardrails.

Before we dive in, I'd love to learn a bit about what brought you here. What's one thing you're hoping to accomplish with AI in your teaching?`,
  },

  1: {
    week: 1,
    title: "Understanding AI in Teaching",
    prompt: `This is Week 1: Understanding AI in Teaching.
Focus on foundational understanding of generative AI and practical classroom applications.
Key topics:
- What AI is (and isn't) - pattern matching, not understanding
- Classroom-safe use cases: drafting communications, lesson variations, practice questions, feedback
- Limitations and guardrails: hallucinations, bias, privacy concerns
- The "fast assistant, not source of truth" mental model
Help them try: Creating three variations of a lesson (scaffolds, rigor, different hook).`,
    openingMessage: `Let's start with the foundations. This week is about understanding what AI actually is—and more importantly, what it isn't.

Here's the key insight: AI predicts and produces text based on patterns. It's a fast assistant, not a source of truth.

Tell me about a lesson you teach regularly. I'll help you explore how AI could create useful variations—and where you'd still need your professional judgment.`,
  },

  2: {
    week: 2,
    title: "Prompting Fundamentals",
    prompt: `This is Week 2: Prompting Fundamentals.
Focus on the building blocks of effective prompts.
Key topics:
- The 4C framework: Context, Constraints, Command, Criteria
- Starting simple and iterating
- Providing examples (few-shot prompting)
- Being specific about format and length
Help them practice: Taking a vague request and refining it using the 4C framework.`,
    openingMessage: `This week we're diving into the skill that makes everything else work: writing effective prompts.

I'll teach you a simple framework called the 4Cs: Context, Constraints, Command, and Criteria.

Let's start with something you actually need. What's a task you've tried (or wanted to try) with AI that didn't go as well as you hoped?`,
  },

  3: {
    week: 3,
    title: "Lesson Planning with AI",
    prompt: `This is Week 3: Lesson Planning with AI.
Focus on using AI as a thought partner for lesson design.
Key topics:
- AI as a brainstorming partner, not a replacement
- Generating multiple approaches quickly
- Creating differentiated materials (scaffolds, extensions)
- Building in student voice and choice
- Quality control: what to accept, edit, or reject
Help them apply: Building out a lesson with AI support while maintaining pedagogical ownership.`,
    openingMessage: `Now we're getting practical. This week is about using AI to speed up your lesson planning—while keeping you in the driver's seat.

The goal isn't to have AI write your lessons. It's to use AI as a brainstorming partner that helps you explore more options, faster.

What's a unit or lesson you're working on right now? Let's build something together.`,
  },

  4: {
    week: 4,
    title: "Feedback & Assessment",
    prompt: `This is Week 4: Feedback & Assessment.
Focus on using AI to support (not replace) meaningful feedback.
Key topics:
- Generating feedback drafts to edit and personalize
- Creating rubric-aligned comments efficiently
- Building practice questions and answer keys
- Self and peer assessment tools
- When AI feedback helps vs. when it harms relationships
Help them practice: Taking real student work and drafting feedback with AI assistance.`,
    openingMessage: `Feedback is one of the most time-consuming parts of teaching—and one of the most important. This week, we'll explore how AI can help you give better feedback, not just faster feedback.

The key is using AI to draft, not deliver. Your voice and relationship with students still matters.

What type of student work do you spend the most time giving feedback on? Let's see how AI could support that process.`,
  },

  5: {
    week: 5,
    title: "Communication & Admin",
    prompt: `This is Week 5: Communication & Admin.
Focus on using AI to handle the communications and administrative tasks that eat up planning time.
Key topics:
- Drafting parent communications with appropriate tone
- Translating educational jargon into parent-friendly language
- Creating newsletters, permission slips, announcements
- Handling sensitive communications (with human review)
- Email templates and response drafting
Help them try: Drafting a challenging parent communication with AI support.`,
    openingMessage: `The administrative side of teaching—emails, newsletters, forms—can eat hours every week. This week, we'll make AI your communication assistant.

The best part? These tasks are lower-stakes than instruction, so they're a great place to let AI do more of the heavy lifting.

What's a communication task that tends to take you longer than you'd like? Parent updates? Newsletters? Something else?`,
  },

  6: {
    week: 6,
    title: "Building Your Practice",
    prompt: `This is Week 6: Building Your Practice.
Focus on sustainability and developing their personal AI workflow.
Key topics:
- Creating a personal prompt library
- Building sustainable routines (not trying everything at once)
- Knowing when AI helps vs. when it's overhead
- Staying current as tools evolve
- Teaching students about AI responsibly
- Connecting with other educators using AI
Help them plan: Identifying 2-3 sustainable ways to integrate AI into their practice.`,
    openingMessage: `Final week! You've learned the fundamentals—now it's about building habits that stick.

The teachers who get the most from AI aren't the ones who use it for everything. They're the ones who've identified a few specific workflows where AI consistently saves time.

Looking back at the past weeks, what's resonated most? Let's design your personal AI workflow.`,
  },
};

export function getModulePrompt(week: number): ModulePrompt | null {
  return modulePrompts[week] || null;
}

export function getWeekTitle(week: number): string {
  return modulePrompts[week]?.title || `Week ${week}`;
}
