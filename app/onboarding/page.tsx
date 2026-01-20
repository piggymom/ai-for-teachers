import { redirect } from "next/navigation";

import SignInButton from "@/app/onboarding/sign-in-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleOptions = ["Teacher", "Coach", "AP/Principal", "Other"];
const gradeBandOptions = ["Elementary", "Middle", "High", "K-12"];
const goalOptions = [
  "Reduce planning time",
  "Improve feedback",
  "Classroom routines",
  "Policy/safety",
  "Other",
];

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Onboarding
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Sign in to save progress and unlock personalized takeaways.
            </h1>
            <p className="max-w-xl text-base text-white/70">
              Use your Google account to keep track of completed weeks and unlock
              tailored takeaways.
            </p>
          </header>
          <SignInButton />
        </div>
      </main>
    );
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (profile?.completedAt) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Onboarding
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Sign in to save progress and unlock personalized takeaways.
          </h1>
          <p className="max-w-xl text-base text-white/70">
            Tell us a bit about your role so we can tailor prompts and takeaways.
          </p>
        </header>

        <form
          action="/api/profile"
          method="post"
          className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Role
            <select
              name="role"
              required
              className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select role
              </option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/70">
            Grade band
            <select
              name="gradeBand"
              required
              className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select grade band
              </option>
              {gradeBandOptions.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/70">
            Subject
            <input
              name="subject"
              required
              placeholder="e.g., ELA, Math, Science"
              className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-white/40"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/70">
            Primary goal
            <select
              name="goal"
              required
              className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select goal
              </option>
              {goalOptions.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </label>

          <button
            className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
            type="submit"
          >
            Save and continue
          </button>
        </form>
      </div>
    </main>
  );
}
