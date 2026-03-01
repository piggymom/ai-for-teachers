import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton } from "./components/sign-in-button";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 sm:py-32 lg:py-40">
        {/* Hero */}
        <header className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ letterSpacing: '-0.025em' }}>
            AI for Teachers
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-[#4b5563]">
            Practical AI support, shaped around how you teach.
          </p>
        </header>

        {/* Value props */}
        <section className="mt-14 flex flex-col gap-3 text-center">
          <p className="text-[15px] text-[#9ca3af]">
            A focused 2-hour course on practical AI for teaching
          </p>
          <p className="text-[15px] text-[#9ca3af]">
            Personalized guidance shaped by your role, subject, and constraints
          </p>
        </section>

        {/* Feature props — card-free, typography-driven */}
        <div className="mt-14 flex w-full flex-col gap-8">
          <FeatureItem
            title="Skippy, your AI partner"
            description="Personalized ideas shaped by your subject, role, and real classroom constraints."
          />
          <FeatureItem
            title="Built for your classroom"
            description="Your responses shape the examples, practice, and takeaways. Nothing generic."
          />
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <SignInButton />
          <p className="text-[13px] text-[#d1d5db]">Takes under 30 seconds.</p>
        </div>

        {/* Legal footer */}
        <div className="mt-16 text-[12px] text-[#d1d5db] space-x-3">
          <Link href="/legal/privacy" className="hover:text-[#9ca3af] transition">Privacy</Link>
          <span>&middot;</span>
          <Link href="/legal/terms" className="hover:text-[#9ca3af] transition">Terms</Link>
          <span>&middot;</span>
          <Link href="/legal/ai-disclosure" className="hover:text-[#9ca3af] transition">AI Disclosure</Link>
        </div>
      </div>
    </main>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-[15px] font-medium text-[#111827]">{title}</h2>
      <p className="mt-1 text-[15px] leading-relaxed text-[#9ca3af]">
        {description}
      </p>
    </div>
  );
}
