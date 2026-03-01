import Link from "next/link";

export const metadata = {
  title: "Terms of Service — AI for Teachers",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/"
          className="text-[13px] text-[#9ca3af] hover:text-[#4b5563] transition"
        >
          &larr; Back
        </Link>

        <h1 className="mt-8 text-[28px] font-semibold tracking-tight text-[#111827]">
          Terms of Service
        </h1>
        <p className="mt-2 text-[13px] text-[#9ca3af]">Effective Date: March 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#4b5563]">
          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By creating an account or using AI for Teachers (&ldquo;the Service&rdquo;), you agree to these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">2. Description of Service</h2>
            <p className="mt-3">
              AI for Teachers provides Skippy, an AI-powered tutor that helps K-12 teachers develop practical skills for using AI in their professional practice, including a structured curriculum, personalized conversations, artifact creation, and audio recaps.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">3. User Accounts</h2>
            <p className="mt-3">You must sign in with a Google account. You are responsible for maintaining the security of your account. Each account is for a single individual.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">4. Acceptable Use</h2>
            <p className="mt-3">You may use the Service for your own professional development. You may <strong>not</strong>:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Share student personally identifiable information in conversations</li>
              <li>Generate harmful, discriminatory, or inappropriate content</li>
              <li>Attempt to access other users&apos; data</li>
              <li>Use automated tools or bots to interact with the Service</li>
              <li>Reverse-engineer the Service or extract AI prompts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">5. Intellectual Property</h2>
            <p className="mt-3">
              <strong>Your content:</strong> You retain ownership of your messages, profile, and ideas.
            </p>
            <p className="mt-2">
              <strong>Artifacts:</strong> Content created with Skippy&apos;s help is yours to use, modify, and share. You are responsible for reviewing AI-assisted content for accuracy before use.
            </p>
            <p className="mt-2">
              <strong>Our platform:</strong> The Service, curriculum, AI tutoring system, and underlying technology are owned by AI for Teachers.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">6. AI-Specific Terms</h2>
            <p className="mt-3">Skippy is powered by Anthropic&apos;s Claude AI. You acknowledge that:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>AI outputs may be inaccurate, incomplete, or inappropriate</li>
              <li>AI is not a substitute for your professional judgment</li>
              <li>You are responsible for reviewing all AI-generated content before classroom use</li>
              <li>AI availability depends on third-party providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">7. Privacy</h2>
            <p className="mt-3">
              Your privacy matters. See our{" "}
              <Link href="/legal/privacy" className="text-[#20B2AA] hover:underline">Privacy Policy</Link>{" "}
              for details on data collection, use, and sharing.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">8. Disclaimers</h2>
            <p className="mt-3">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee specific professional development outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">9. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, AI for Teachers shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed $100.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">10. Termination</h2>
            <p className="mt-3">
              You may stop using the Service at any time. You may request account deletion, which removes all your data. We may suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">11. Changes to Terms</h2>
            <p className="mt-3">
              We may update these Terms. Material changes will be communicated via email or in-app notice. Continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-[#111827]">12. Contact</h2>
            <p className="mt-3">Questions: <strong>support@aiforteachers.com</strong></p>
          </section>
        </div>

        <div className="mt-12 border-t border-[#f3f4f6] pt-6">
          <p className="text-[12px] text-[#d1d5db]">
            These terms of service are a working draft. Consult qualified legal counsel before relying on them.
          </p>
        </div>
      </div>
    </main>
  );
}
