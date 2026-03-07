import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — AI for Teachers",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">Effective Date: March 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-[17px] font-medium text-foreground">1. Introduction</h2>
            <p className="mt-3">
              AI for Teachers (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Skippy AI Tutor platform (&ldquo;the Service&rdquo;), a professional development tool that helps K-12 teachers learn to use AI effectively. This Privacy Policy explains how we collect, use, share, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">2. Information We Collect</h2>
            <h3 className="mt-4 text-[15px] font-medium text-foreground">Account Information</h3>
            <p className="mt-2">Name, email address, and profile picture from your Google account.</p>

            <h3 className="mt-4 text-[15px] font-medium text-foreground">Professional Profile</h3>
            <p className="mt-2">Teaching role, grade levels, subjects, AI experience level, professional goals, and constraints you share during onboarding.</p>

            <h3 className="mt-4 text-[15px] font-medium text-foreground">Conversation Content</h3>
            <p className="mt-2">Messages you send to Skippy and artifacts you create together (prompt templates, lesson outlines, feedback workflows).</p>

            <h3 className="mt-4 text-[15px] font-medium text-foreground">Assessment Data</h3>
            <p className="mt-2">Skippy assesses your readiness level using the SOLO taxonomy to personalize your learning. This is used solely to improve your experience, not to evaluate your professional performance.</p>

            <h3 className="mt-4 text-[15px] font-medium text-foreground">What We Do NOT Collect</h3>
            <p className="mt-2">Student information, payment data, precise location, or browsing history outside our Service.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">3. How We Use Your Information</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Authenticate you and manage your account</li>
              <li>Personalize your AI tutoring experience</li>
              <li>Track your progress through the curriculum</li>
              <li>Create learning artifacts from your conversations</li>
              <li>Generate audio recaps of your sessions</li>
              <li>Respond to support requests</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your data, use it to evaluate your job performance, or share individual data with your school or district.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">4. Information Sharing</h2>
            <p className="mt-3">To provide the Service, certain data is shared with:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li><strong>Anthropic (Claude AI):</strong> Your professional context and recent messages to generate personalized tutoring responses. Anthropic does not use API data to train models.</li>
              <li><strong>OpenAI:</strong> AI-generated text for voice and podcast features.</li>
              <li><strong>Supabase:</strong> Secure database hosting for all application data (encrypted at rest).</li>
              <li><strong>Vercel:</strong> Application hosting.</li>
            </ul>
            <p className="mt-3">We do not share data with advertisers, data brokers, or your employer.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">5. Data Security</h2>
            <p className="mt-3">We use HTTPS encryption for all traffic, encrypted database storage, Google OAuth authentication, and user-scoped data access controls.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">6. Data Retention</h2>
            <p className="mt-3">Your data is retained until you delete your account. When you delete your account, all associated data (profile, conversations, assessments, artifacts, progress) is permanently removed.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">7. Your Rights</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Correction:</strong> Update your profile at any time</li>
              <li><strong>Deletion:</strong> Delete your account and all data</li>
              <li><strong>Portability:</strong> Export your data in JSON format</li>
            </ul>
            <p className="mt-3">Contact us at the email below to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">8. Children&apos;s Privacy</h2>
            <p className="mt-3">AI for Teachers is for adult educators only. We do not knowingly collect information from children under 13. Please do not share student names or identifiable student information in your conversations with Skippy.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">9. Changes to This Policy</h2>
            <p className="mt-3">We will notify you of significant changes via email or in-app notice. Continued use after notification constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-foreground">10. Contact</h2>
            <p className="mt-3">Questions about this policy: <strong>privacy@aiforteachers.com</strong></p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-[12px] text-muted-foreground/40">
            This privacy policy is a working draft. Consult qualified legal counsel before relying on it.
          </p>
        </div>
      </div>
    </main>
  );
}
