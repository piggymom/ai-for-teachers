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
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 sm:py-32 lg:py-40 animate-fade-in-up">
        {/* Hero */}
        <header className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl font-display">
            AI for Teachers
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">
            Practical AI support, shaped around how you teach.
          </p>
        </header>

        {/* Value props */}
        <section className="mt-14 flex flex-col gap-3 text-center">
          <p className="text-[15px] text-muted-foreground/70">
            A focused 2-hour course on practical AI for teaching
          </p>
          <p className="text-[15px] text-muted-foreground/70">
            Personalized guidance shaped by your role, subject, and constraints
          </p>
        </section>

        {/* Feature props */}
        <div className="mt-14 flex w-full flex-col gap-8 stagger-children">
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
          <p className="text-[13px] text-muted-foreground/40">Takes under 30 seconds.</p>
        </div>

        {/* Legal footer */}
        <div className="mt-16 text-[12px] text-muted-foreground/40 space-x-3">
          <Link href="/legal/privacy" className="hover:text-muted-foreground transition">Privacy</Link>
          <span>&middot;</span>
          <Link href="/legal/terms" className="hover:text-muted-foreground transition">Terms</Link>
          <span>&middot;</span>
          <Link href="/legal/ai-disclosure" className="hover:text-muted-foreground transition">AI Disclosure</Link>
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
      <h2 className="text-[15px] font-medium text-foreground">{title}</h2>
      <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
