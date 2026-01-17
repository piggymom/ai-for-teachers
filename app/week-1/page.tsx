import Link from "next/link";

export default function Week1Page() {
  return (
    <main className="min-h-screen bg-white p-12 text-black">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Week 1: Understanding AI in Teaching</h1>

        <p className="text-lg mb-8">
          Practical guidance for using AI to support your teaching practice—without hype, and with
          clear guardrails.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">1) What AI is (and isn’t)</h2>
          <p className="text-base leading-relaxed">
            Generative AI predicts and produces text, images, and other outputs based on patterns in
            data. It can be helpful for drafting, summarizing, and brainstorming—but it can also be
            wrong, overly confident, or biased. Treat it like a fast assistant, not a source of truth.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">2) Real classroom-safe use cases</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Draft parent-facing messages and translate tone (keep final judgment with you).</li>
            <li>Create lesson variations (supports, extensions, alternative examples).</li>
            <li>Generate practice questions and exemplar responses you can edit.</li>
            <li>Turn your notes into a tighter rubric-aligned feedback comment.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">3) One simple thing to try this week</h2>
          <p className="text-base leading-relaxed">
            Take a lesson you already teach and ask AI for three variations: one with more scaffolds,
            one with higher rigor, and one with a different hook. Then keep what’s useful and discard
            the rest.
          </p>
        </section>

        <Link href="/" className="inline-block text-blue-600 underline">
          Back to home →
        </Link>
      </div>
    </main>
  );
}

