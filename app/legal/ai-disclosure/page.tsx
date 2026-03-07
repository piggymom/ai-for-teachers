import Link from "next/link";

export const metadata = {
  title: "AI Disclosure — AI for Teachers",
};

export default function AIDisclosurePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/"
          className="text-[13px] text-muted-foreground hover:text-foreground transition"
        >
          &larr; Back
        </Link>

        <h1 className="mt-8 text-[28px] font-semibold tracking-tight text-foreground font-display">
          AI Disclosure
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">How AI powers your learning experience</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-[17px] font-medium text-foreground">What AI Does</h2>
            <p className="mt-3">
              <strong>Skippy</strong> is powered by Claude, an AI model made by Anthropic. Skippy engages you in personalized conversations about using AI in your teaching practice, helps you build practical artifacts, and assesses your readiness level to adjust complexity.
            </p>
            <p className="mt-2">
              <strong>Audio features</strong> use OpenAI&apos;s text-to-speech service to convert AI-generated text to speech and create podcast recaps.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">What AI Does NOT Do</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Make decisions about your teaching ability or job performance</li>
              <li>Share your data with your school or district</li>
              <li>Access your students&apos; information</li>
              <li>Replace your professional judgment</li>
              <li>Guarantee accuracy — always review AI content before use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">Your Data and AI</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Your messages are sent to Anthropic&apos;s Claude API to generate responses</li>
              <li>Anthropic does not use your data to train AI models (per their API terms)</li>
              <li>Your professional profile is included in requests to personalize responses</li>
              <li>Only the last 10 messages are sent per request, not your entire history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">Identifying AI Content</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>All responses from Skippy are AI-generated</li>
              <li>Artifacts from your sessions are AI-assisted (built collaboratively)</li>
              <li>Podcast recaps are entirely AI-generated summaries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">Human Oversight</h2>
            <p className="mt-3">
              The curriculum, teaching approach, and Skippy&apos;s behavior are designed by a human educator. You maintain full control over what to save and use. You can redirect Skippy at any time and contact a human via the support form.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">Learn More</h2>
            <p className="mt-3">
              <Link href="/legal/privacy" className="text-foreground underline hover:text-primary">Privacy Policy</Link>
              {" "}&middot;{" "}
              <Link href="/legal/terms" className="text-foreground underline hover:text-primary">Terms of Service</Link>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-[12px] text-muted-foreground/40">
            This disclosure is a working draft. Consult qualified legal counsel before relying on it.
          </p>
        </div>
      </div>
    </main>
  );
}
