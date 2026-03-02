"use client";

import { useState } from "react";
import { saveOnboardingProfile } from "../actions/onboarding";

type FormData = {
  role: string;
  roleOther: string;
  gradeLevels: string[];
  subjects: string[];
  aiExperienceLevel: string;
  constraints: string;
  biggestTimeDrains: string[];
  primaryGoal: string;
  goalDetails: string;
};

const initialFormData: FormData = {
  role: "",
  roleOther: "",
  gradeLevels: [],
  subjects: [],
  aiExperienceLevel: "",
  constraints: "",
  biggestTimeDrains: [],
  primaryGoal: "",
  goalDetails: "",
};

const ROLES = [
  "Classroom teacher",
  "Special education",
  "Instructional coach",
  "Administrator",
  "Counselor",
  "Other",
];

const GRADE_LEVELS = [
  "PreK",
  "K",
  "1-2",
  "3-5",
  "6-8",
  "9-12",
  "Higher Ed",
  "Other",
];

const TIME_DRAINS = [
  "Lesson planning",
  "Differentiation",
  "Feedback",
  "IEP/admin paperwork",
  "Family comms",
  "Assessment design",
  "Classroom management",
  "Data analysis",
  "Other",
];

const AI_LEVELS = [
  { value: "new", label: "New to AI" },
  { value: "some", label: "Some experience" },
  { value: "advanced", label: "Advanced user" },
];

const PRIMARY_GOALS = [
  { value: "save_time", label: "Save time on repetitive tasks" },
  { value: "better_materials", label: "Create better differentiated materials" },
  { value: "faster_feedback", label: "Give faster, more useful feedback" },
  { value: "handle_admin", label: "Handle admin and communication tasks" },
  { value: "build_confidence", label: "Feel more confident using AI" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [subjectInput, setSubjectInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalSteps = 3;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleArrayItem = (field: "gradeLevels" | "biggestTimeDrains", item: string) => {
    setFormData((prev) => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addSubject = () => {
    const subject = subjectInput.trim();
    if (subject && !formData.subjects.includes(subject)) {
      updateField("subjects", [...formData.subjects, subject]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject: string) => {
    updateField("subjects", formData.subjects.filter((s) => s !== subject));
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.role) newErrors.role = "Please select your role";
      if (formData.role === "Other" && !formData.roleOther.trim()) {
        newErrors.roleOther = "Please describe your role";
      }
      if (formData.gradeLevels.length === 0) {
        newErrors.gradeLevels = "Please select at least one grade level";
      }
    }

    if (stepNum === 2) {
      if (!formData.aiExperienceLevel) {
        newErrors.aiExperienceLevel = "Please select your AI experience level";
      }
    }

    if (stepNum === 3) {
      if (formData.biggestTimeDrains.length === 0) {
        newErrors.biggestTimeDrains = "Please select at least one";
      }
      if (!formData.primaryGoal) {
        newErrors.primaryGoal = "Please select your main goal";
      }
      if (!formData.goalDetails.trim()) {
        newErrors.goalDetails = "Please share more details";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await saveOnboardingProfile({
        role: formData.role,
        roleOther: formData.roleOther || null,
        gradeLevels: formData.gradeLevels,
        subjects: formData.subjects,
        aiExperienceLevel: formData.aiExperienceLevel,
        constraints: formData.constraints || null,
        biggestTimeDrains: formData.biggestTimeDrains,
        primaryGoal: formData.primaryGoal,
        goalDetails: formData.goalDetails,
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-lg flex-col px-6 py-16 sm:py-20">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-[28px] font-semibold tracking-tight text-[#111827]" style={{ letterSpacing: '-0.025em' }}>
            Tell us about yourself
          </h1>
          <p className="mt-3 text-[15px] text-[#9ca3af]">
            This helps Skippy give you relevant, practical suggestions.
          </p>
        </header>

        {/* Progress */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1 w-10 rounded-full transition-colors ${
                i + 1 <= step ? "bg-[#111827]" : "bg-[#f3f4f6]"
              }`}
            />
          ))}
          <span className="ml-3 text-[12px] text-[#d1d5db]">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-8">
          {step === 1 && (
            <Step1
              formData={formData}
              errors={errors}
              updateField={updateField}
              toggleArrayItem={toggleArrayItem}
              subjectInput={subjectInput}
              setSubjectInput={setSubjectInput}
              addSubject={addSubject}
              removeSubject={removeSubject}
            />
          )}
          {step === 2 && (
            <Step2
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          )}
          {step === 3 && (
            <Step3
              formData={formData}
              errors={errors}
              updateField={updateField}
              toggleArrayItem={toggleArrayItem}
            />
          )}
        </div>

        {/* Error */}
        {submitError && (
          <p className="mt-6 text-center text-[13px] text-[#ef4444]">{submitError}</p>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-[#9ca3af] transition hover:text-[#4b5563] disabled:invisible"
          >
            Back
          </button>
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-2.5 text-[14px] font-medium text-[#111827] transition hover:bg-[#f9fafb]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-2.5 text-[14px] font-medium text-[#111827] transition hover:bg-[#f9fafb] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Start"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// Step 1: Your role
function Step1({
  formData,
  errors,
  updateField,
  toggleArrayItem,
  subjectInput,
  setSubjectInput,
  addSubject,
  removeSubject,
}: {
  formData: FormData;
  errors: Record<string, string>;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  toggleArrayItem: (field: "gradeLevels" | "biggestTimeDrains", item: string) => void;
  subjectInput: string;
  setSubjectInput: (value: string) => void;
  addSubject: () => void;
  removeSubject: (subject: string) => void;
}) {
  return (
    <>
      <FieldGroup label="Your role" error={errors.role}>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <ChipButton
              key={role}
              selected={formData.role === role}
              onClick={() => updateField("role", role)}
            >
              {role}
            </ChipButton>
          ))}
        </div>
      </FieldGroup>

      {formData.role === "Other" && (
        <FieldGroup label="Describe your role" error={errors.roleOther}>
          <TextInput
            value={formData.roleOther}
            onChange={(e) => updateField("roleOther", e.target.value)}
            placeholder="e.g., Library media specialist"
          />
        </FieldGroup>
      )}

      <FieldGroup label="Grade levels you work with" error={errors.gradeLevels}>
        <div className="flex flex-wrap gap-2">
          {GRADE_LEVELS.map((grade) => (
            <ChipButton
              key={grade}
              selected={formData.gradeLevels.includes(grade)}
              onClick={() => toggleArrayItem("gradeLevels", grade)}
            >
              {grade}
            </ChipButton>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Subjects (optional)">
        <div className="flex gap-2">
          <TextInput
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSubject();
              }
            }}
            onBlur={addSubject}
            placeholder="Type and press Enter"
            className="flex-1"
          />
          <button
            type="button"
            onClick={addSubject}
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#f9fafb]"
          >
            Add
          </button>
        </div>
        {formData.subjects.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.subjects.map((subject) => (
              <span
                key={subject}
                className="inline-flex items-center gap-1 rounded-full bg-[#f9fafb] px-3 py-1 text-[13px] text-[#4b5563]"
              >
                {subject}
                <button
                  type="button"
                  onClick={() => removeSubject(subject)}
                  className="ml-1 text-[#d1d5db] hover:text-[#9ca3af]"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </FieldGroup>
    </>
  );
}

// Step 2: Your Situation
function Step2({
  formData,
  errors,
  updateField,
}: {
  formData: FormData;
  errors: Record<string, string>;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}) {
  return (
    <>
      <FieldGroup label="AI experience level" error={errors.aiExperienceLevel}>
        <div className="flex flex-col gap-2">
          {AI_LEVELS.map((level) => (
            <RadioOption
              key={level.value}
              selected={formData.aiExperienceLevel === level.value}
              onClick={() => updateField("aiExperienceLevel", level.value)}
            >
              {level.label}
            </RadioOption>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Constraints (optional)">
        <TextArea
          value={formData.constraints}
          onChange={(e) => updateField("constraints", e.target.value)}
          placeholder="e.g., District blocks ChatGPT, no student data in AI tools, limited devices"
          rows={3}
        />
      </FieldGroup>
    </>
  );
}

// Step 3: What You Want
function Step3({
  formData,
  errors,
  updateField,
  toggleArrayItem,
}: {
  formData: FormData;
  errors: Record<string, string>;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  toggleArrayItem: (field: "gradeLevels" | "biggestTimeDrains", item: string) => void;
}) {
  return (
    <>
      <FieldGroup label="What eats up most of your time?" error={errors.biggestTimeDrains}>
        <div className="flex flex-wrap gap-2">
          {TIME_DRAINS.map((item) => (
            <ChipButton
              key={item}
              selected={formData.biggestTimeDrains.includes(item)}
              onClick={() => toggleArrayItem("biggestTimeDrains", item)}
            >
              {item}
            </ChipButton>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="What's the main thing you want from this course?" error={errors.primaryGoal}>
        <div className="flex flex-col gap-2">
          {PRIMARY_GOALS.map((goal) => (
            <RadioOption
              key={goal.value}
              selected={formData.primaryGoal === goal.value}
              onClick={() => updateField("primaryGoal", goal.value)}
            >
              {goal.label}
            </RadioOption>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Tell me more — what specifically are you hoping to change?" error={errors.goalDetails}>
        <TextArea
          value={formData.goalDetails}
          onChange={(e) => updateField("goalDetails", e.target.value)}
          placeholder="e.g., I spend 2 hours every Sunday making different versions of worksheets for my three reading groups..."
          rows={4}
        />
      </FieldGroup>
    </>
  );
}

// UI Components
function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[14px] font-medium text-[#111827]">{label}</label>
      {children}
      {error && <p className="text-[12px] text-[#ef4444]">{error}</p>}
    </div>
  );
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition ${
        selected
          ? "border-[#111827] bg-[#111827]/5 text-[#111827]"
          : "border-[#e5e7eb] text-[#4b5563] hover:border-[#d1d5db] hover:bg-[#f9fafb]"
      }`}
    >
      {children}
    </button>
  );
}

function RadioOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[14px] transition ${
        selected
          ? "border-[#111827]/20 bg-[#111827]/3 text-[#111827]"
          : "border-[#f3f4f6] text-[#4b5563] hover:border-[#e5e7eb] hover:bg-[#f9fafb]"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          selected ? "border-[#111827] bg-[#111827]" : "border-[#d1d5db]"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      {children}
    </button>
  );
}

function TextInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className={`rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#d1d5db] outline-none transition focus:border-[#d1d5db] ${className}`}
      {...props}
    />
  );
}

function TextArea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-[14px] text-[#111827] placeholder-[#d1d5db] outline-none transition focus:border-[#d1d5db] ${className}`}
      {...props}
    />
  );
}
