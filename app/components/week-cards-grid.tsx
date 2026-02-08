"use client";

import { useEffect, useRef } from "react";
import { WeekCard } from "./week-card";

interface WeekData {
  weekNumber: number;
  title: string;
  description: string;
  duration: string;
}

const WEEKS: WeekData[] = [
  {
    weekNumber: 0,
    title: "Getting Started",
    description: "Meet your AI tutor and set your goals for the course.",
    duration: "5 min"
  },
  {
    weekNumber: 1,
    title: "Understanding AI",
    description: "Understand what AI is (and isn't), how it can support you, and the guardrails that keep it classroom-safe.",
    duration: "25 min"
  },
  {
    weekNumber: 2,
    title: "Prompting Fundamentals",
    description: "Learn the building blocks of effective prompts using the 4C framework: Context, Constraints, Command, and Criteria.",
    duration: "30 min"
  },
  {
    weekNumber: 3,
    title: "Lesson Planning",
    description: "Use AI as a brainstorming partner for lesson design while maintaining pedagogical ownership.",
    duration: "30 min"
  },
  {
    weekNumber: 4,
    title: "Feedback & Assessment",
    description: "Generate feedback drafts, rubric-aligned comments, and practice questions you personalize and finalize.",
    duration: "30 min"
  },
  {
    weekNumber: 5,
    title: "Communication & Admin",
    description: "Handle parent communications, newsletters, and administrative tasks that eat up planning time.",
    duration: "30 min"
  },
  {
    weekNumber: 6,
    title: "Building Your Practice",
    description: "Create sustainable AI routines and build your personal prompt library for long-term success.",
    duration: "25 min"
  }
];

interface WeekCardsGridProps {
  completedWeeks: number[];
  currentWeek: number;
  scrollToWeek?: number;
}

export function WeekCardsGrid({ completedWeeks, currentWeek, scrollToWeek }: WeekCardsGridProps) {
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Auto-scroll to specified week on mount
  useEffect(() => {
    if (scrollToWeek !== undefined) {
      const element = weekRefs.current.get(scrollToWeek);
      if (element) {
        // Small delay to ensure layout is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [scrollToWeek]);

  const getStatus = (weekNumber: number): "not_started" | "in_progress" | "completed" => {
    if (completedWeeks.includes(weekNumber)) return "completed";
    if (weekNumber === currentWeek) return "in_progress";
    return "not_started";
  };

  const isLocked = (weekNumber: number): boolean => {
    if (weekNumber === 0) return false;
    return !completedWeeks.includes(weekNumber - 1);
  };

  return (
    <div className="flex flex-col gap-4">
      {WEEKS.map((week) => (
        <div
          key={week.weekNumber}
          ref={(el) => {
            if (el) weekRefs.current.set(week.weekNumber, el);
          }}
          id={`week-${week.weekNumber}`}
        >
          <WeekCard
            weekNumber={week.weekNumber}
            title={week.title}
            description={week.description}
            duration={week.duration}
            status={getStatus(week.weekNumber)}
            isLocked={isLocked(week.weekNumber)}
          />
        </div>
      ))}
    </div>
  );
}
