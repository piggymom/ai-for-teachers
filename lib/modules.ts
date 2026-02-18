/**
 * Module prompts for each week of the AI for Teachers course.
 * These define Skippy's focus and learning objectives per week.
 *
 * Note: Diagnostic probes and readiness levels are defined in progressions.ts
 * and injected into the system prompt via the ledger system.
 */

import { getProgression, type WeekProgression } from "./progressions";
import { WEEK_0_SYSTEM_PROMPT, WEEK_0_OPENING_MESSAGE } from "./prompts/week-0";
import { WEEK_1_SYSTEM_PROMPT, WEEK_1_OPENING_MESSAGE } from "./prompts/week-1";
import { WEEK_2_SYSTEM_PROMPT, WEEK_2_OPENING_MESSAGE } from "./prompts/week-2";
import { WEEK_3_SYSTEM_PROMPT, WEEK_3_OPENING_MESSAGE } from "./prompts/week-3";
import { WEEK_4_SYSTEM_PROMPT, WEEK_4_OPENING_MESSAGE } from "./prompts/week-4";
import { WEEK_5_SYSTEM_PROMPT, WEEK_5_OPENING_MESSAGE } from "./prompts/week-5";
import { WEEK_6_SYSTEM_PROMPT, WEEK_6_OPENING_MESSAGE } from "./prompts/week-6";

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
    prompt: WEEK_0_SYSTEM_PROMPT,
    openingMessage: WEEK_0_OPENING_MESSAGE,
  },

  1: {
    week: 1,
    title: "Understanding AI in Teaching",
    prompt: WEEK_1_SYSTEM_PROMPT,
    openingMessage: WEEK_1_OPENING_MESSAGE,
  },

  2: {
    week: 2,
    title: "Prompting Fundamentals",
    prompt: WEEK_2_SYSTEM_PROMPT,
    openingMessage: WEEK_2_OPENING_MESSAGE,
  },

  3: {
    week: 3,
    title: "Lesson Planning with AI",
    prompt: WEEK_3_SYSTEM_PROMPT,
    openingMessage: WEEK_3_OPENING_MESSAGE,
  },

  4: {
    week: 4,
    title: "Feedback & Assessment",
    prompt: WEEK_4_SYSTEM_PROMPT,
    openingMessage: WEEK_4_OPENING_MESSAGE,
  },

  5: {
    week: 5,
    title: "Differentiation with AI",
    prompt: WEEK_5_SYSTEM_PROMPT,
    openingMessage: WEEK_5_OPENING_MESSAGE,
  },

  6: {
    week: 6,
    title: "Integration & Ethics",
    prompt: WEEK_6_SYSTEM_PROMPT,
    openingMessage: WEEK_6_OPENING_MESSAGE,
  },
};

/**
 * Week-specific configuration for ledger behavior.
 * Controls exchange limits, tracking features, and artifact types per week.
 */
export type WeekConfig = {
  maxExchanges: number;
  trackFourC: boolean;
  artifactType: string | null;
};

export const weekConfigs: Record<number, WeekConfig> = {
  0: { maxExchanges: 5, trackFourC: false, artifactType: null },
  1: { maxExchanges: 15, trackFourC: false, artifactType: "mental_model" },
  2: { maxExchanges: 18, trackFourC: true, artifactType: "prompt_template" },
  3: { maxExchanges: 18, trackFourC: true, artifactType: "lesson_planning_template" },
  4: { maxExchanges: 18, trackFourC: true, artifactType: "feedback_template" },
  5: { maxExchanges: 18, trackFourC: true, artifactType: "differentiation_template" },
  6: { maxExchanges: 18, trackFourC: false, artifactType: "personal_policy" },
};

const DEFAULT_WEEK_CONFIG: WeekConfig = {
  maxExchanges: 18,
  trackFourC: false,
  artifactType: null,
};

export function getWeekConfig(week: number): WeekConfig {
  return weekConfigs[week] || DEFAULT_WEEK_CONFIG;
}

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
