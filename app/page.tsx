import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton } from "./components/sign-in-button";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 sm:py-24 lg:py-32">
        {/* Hero */}
        <header className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI for Teachers
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-white/70 sm:text-xl">
            Practical AI support, shaped around how you teach.
          </p>
        </header>

        {/* Value props */}
        <section className="mt-10 flex flex-col gap-2 text-center sm:mt-12">
          <p className="text-sm text-white/60 sm:text-base">
            A focused 2-hour course on practical AI for teaching
          </p>
          <p className="text-sm text-white/60 sm:text-base">
            Personalized guidance shaped by your role, subject, and constraints
          </p>
        </section>

        {/* Feature cards */}
        <div className="mt-10 flex w-full flex-col gap-4 sm:mt-12">
          <FeatureCard
            title="Skippy, your AI partner"
            description="Personalized ideas shaped by your subject, role, and real classroom constraints."
          />
          <FeatureCard
            title="Built for your classroom"
            description="Your responses shape the examples, practice, and takeaways. Nothing generic."
          />
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:mt-16">
          <SignInButton />
          <p className="text-xs text-white/40">Takes under 30 seconds.</p>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-white/60">
        {description}
      </p>
    </div>
  );
}
