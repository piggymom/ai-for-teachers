"use client";

import { useState } from "react";
import { saveOnboardingProfile } from "../actions/onboarding";

const AI_LEVELS = [
  { value: "new", label: "New to AI" },
  { value: "some", label: "Tried it a few times" },
  { value: "advanced", label: "Use it regularly" },
];

const PAIN_POINTS = [
  { value: "lesson_planning", label: "Lesson planning" },
  { value: "feedback", label: "Feedback & grading" },
  { value: "differentiation", label: "Creating differentiated materials" },
  { value: "admin", label: "Admin & paperwork" },
];

export default function OnboardingPage() {
  const [teachesWhat, setTeachesWhat] = useState("");
  const [aiLevel, setAiLevel] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!teachesWhat.trim()) newErrors.teachesWhat = "Please tell us what you teach";
    if (!aiLevel) newErrors.aiLevel = "Please select one";
    if (!painPoint) newErrors.painPoint = "Please select one";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await saveOnboardingProfile({
        teachesWhat: teachesWhat.trim(),
        aiExperienceLevel: aiLevel,
        painPoint,
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-lg flex-col px-6 py-16 sm:py-20">
        <header className="mb-12 text-center">
          <h1
            className="text-[28px] font-semibold tracking-tight text-[#111827]"
            style={{ letterSpacing: "-0.025em" }}
          >
            Tell us about yourself
          </h1>
          <p className="mt-3 text-[15px] text-[#9ca3af]">
            Three quick questions so Skippy can give you relevant, practical help.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {/* Q1: What do you teach? */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-medium text-[#111827]">
              What do you teach?
            </label>
            <input
              type="text"
              value={teachesWhat}
              onChange={(e) => {
                setTeachesWhat(e.target.value);
                if (errors.teachesWhat) setErrors((p) => { const n = { ...p }; delete n.teachesWhat; return n; });
              }}
              placeholder="e.g., 7th grade Math, High school Chemistry, K-2 Reading"
              className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#111827] placeholder-[#d1d5db] outline-none transition focus:border-[#d1d5db]"
            />
            {errors.teachesWhat && (
              <p className="text-[12px] text-[#ef4444]">{errors.teachesWhat}</p>
            )}
          </div>

          {/* Q2: AI familiarity */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-medium text-[#111827]">
              How familiar are you with AI tools like ChatGPT?
            </label>
            <div className="flex flex-col gap-2">
              {AI_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => {
                    setAiLevel(level.value);
                    if (errors.aiLevel) setErrors((p) => { const n = { ...p }; delete n.aiLevel; return n; });
                  }}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[14px] transition ${
                    aiLevel === level.value
                      ? "border-[#111827]/20 bg-[#111827]/[0.03] text-[#111827]"
                      : "border-[#f3f4f6] text-[#4b5563] hover:border-[#e5e7eb] hover:bg-[#f9fafb]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      aiLevel === level.value
                        ? "border-[#111827] bg-[#111827]"
                        : "border-[#d1d5db]"
                    }`}
                  >
                    {aiLevel === level.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  {level.label}
                </button>
              ))}
            </div>
            {errors.aiLevel && (
              <p className="text-[12px] text-[#ef4444]">{errors.aiLevel}</p>
            )}
          </div>

          {/* Q3: Pain point */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-medium text-[#111827]">
              What&apos;s eating up most of your time?
            </label>
            <div className="flex flex-col gap-2">
              {PAIN_POINTS.map((point) => (
                <button
                  key={point.value}
                  type="button"
                  onClick={() => {
                    setPainPoint(point.value);
                    if (errors.painPoint) setErrors((p) => { const n = { ...p }; delete n.painPoint; return n; });
                  }}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[14px] transition ${
                    painPoint === point.value
                      ? "border-[#111827]/20 bg-[#111827]/[0.03] text-[#111827]"
                      : "border-[#f3f4f6] text-[#4b5563] hover:border-[#e5e7eb] hover:bg-[#f9fafb]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      painPoint === point.value
                        ? "border-[#111827] bg-[#111827]"
                        : "border-[#d1d5db]"
                    }`}
                  >
                    {painPoint === point.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  {point.label}
                </button>
              ))}
            </div>
            {errors.painPoint && (
              <p className="text-[12px] text-[#ef4444]">{errors.painPoint}</p>
            )}
          </div>
        </div>

        {submitError && (
          <p className="mt-6 text-center text-[13px] text-[#ef4444]">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-[#111827] px-8 py-3 text-[14px] font-medium text-white transition hover:bg-[#374151] disabled:opacity-50"
          >
            {isSubmitting ? "Starting..." : "Start my course →"}
          </button>
        </div>
      </div>
    </main>
  );
}
