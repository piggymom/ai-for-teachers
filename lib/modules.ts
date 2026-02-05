/**
 * Module prompts for each week of the AI for Teachers course.
 * These define Skippy's focus and learning objectives per week.
 *
 * Note: Diagnostic probes and readiness levels are defined in progressions.ts
 * and injected into the system prompt via the ledger system.
 */

import { getProgression, type WeekProgression } from "./progressions";

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
    openingMessage: `Hey {{name}}! I'm Skippy, and I'll be your guide through this 6-week course.

We're going to build practical AI skills you can use in your classroom—no hype, just real tools. By the end, you'll have prompts, templates, and workflows you actually use.

What's one thing you're hoping to get out of this course?`,
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
    openingMessage: `Hey {{name}}! This week we're building your foundation—understanding what AI actually is, and what it's good for in the classroom.

The key insight: AI predicts patterns, it doesn't understand meaning. That makes it a fast assistant, not a source of truth. By the end of today, you'll have a prompt you can use for lesson variations.

What's one thing you'd like AI to help you with in your teaching?`,
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
    openingMessage: `Hey {{name}}! This week is the one that makes everything else click: writing prompts that actually work.

I'll teach you the 4Cs—Context, Constraints, Command, Criteria. By the end, you'll have a refined prompt you can reuse.

What's a task you've tried with AI that didn't quite give you what you wanted?`,
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
    openingMessage: `Hey {{name}}! Now we're getting practical—using AI to speed up lesson planning while you stay in the driver's seat.

The goal isn't AI-written lessons. It's AI as a brainstorming partner that helps you explore more ideas, faster. By the end, you'll have differentiated materials for an actual lesson.

What's a unit or lesson you're working on right now?`,
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
    openingMessage: `Hey {{name}}! Feedback takes forever—but it matters. This week, we'll make AI help you give better feedback, not just faster feedback.

The key: AI drafts, you finalize. Your voice and relationship with students still matters. By the end, you'll have a feedback workflow you can actually use.

What type of student work eats up most of your feedback time?`,
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
    openingMessage: `Hey {{name}}! Emails, newsletters, forms—the admin side of teaching can eat hours. This week, AI becomes your communication assistant.

Good news: these are lower-stakes than instruction, so you can let AI do more of the heavy lifting. By the end, you'll have templates for the communications that drain your time.

What communication task takes you longer than it should?`,
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
    openingMessage: `Hey {{name}}! Final week—you've learned the tools, now let's make them stick.

The teachers who get the most from AI aren't using it for everything. They've found 2-3 specific workflows where it consistently saves time. By the end, you'll have your personal AI playbook.

Looking back at the past weeks, what's been most useful for you?`,
  },
};

export function getModulePrompt(week: number): ModulePrompt | null {
  return modulePrompts[week] || null;
}

export function getWeekTitle(week: number): string {
  return modulePrompts[week]?.title || `Week ${week}`;
}

/**
 * Get combined module and progression data for a week.
 * Useful for building comprehensive context about what a week covers.
 */
export function getWeekContext(week: number): {
  module: ModulePrompt | null;
  progression: WeekProgression | undefined;
} {
  return {
    module: getModulePrompt(week),
    progression: getProgression(week),
  };
}
