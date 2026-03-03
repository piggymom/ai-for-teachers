"use client";

import { useState, useEffect, useRef } from "react";
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
    title: "Differentiation with AI",
    description: "Design differentiated materials and adapt lessons for diverse learners using AI support.",
    duration: "30 min"
  },
  {
    weekNumber: 6,
    title: "Integration & Ethics",
    description: "Develop your personal AI policy and plan for ethical, sustainable integration into your practice.",
    duration: "25 min"
  }
];

interface WeekCardsGridProps {
  completedWeeks: number[];
  currentWeek: number;
  scrollToWeek?: number;
}

export function WeekCardsGrid({ completedWeeks, currentWeek, scrollToWeek }: WeekCardsGridProps) {
  const [showAll, setShowAll] = useState(scrollToWeek !== undefined);
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (scrollToWeek !== undefined) {
      setShowAll(true);
      const element = weekRefs.current.get(scrollToWeek);
      if (element) {
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

  if (!showAll) {
    return (
      <button
        onClick={() => setShowAll(true)}
        className="text-[13px] text-[#9ca3af] hover:text-[#111827] transition-colors"
      >
        View all weeks &rarr;
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
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

      <button
        onClick={() => setShowAll(false)}
        className="mt-6 text-[13px] text-[#9ca3af] hover:text-[#111827] transition-colors"
      >
        Show less
      </button>
    </div>
  );
}
