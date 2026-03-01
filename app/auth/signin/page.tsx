"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="mx-auto flex max-w-md flex-col gap-10 px-6 py-14 text-center">
        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold tracking-tight text-[#111827]">
            Sign in to AI for Teachers
          </h1>
          <p className="text-[15px] text-[#9ca3af]">
            Sign in to save your progress and access your course from any device.
          </p>
        </div>

        {/* Terms acceptance */}
        <label className="flex items-start gap-3 text-left cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#d1d5db] text-[#20B2AA] focus:ring-[#20B2AA]/25 cursor-pointer"
          />
          <span className="text-[13px] leading-relaxed text-[#4b5563]">
            I have read and agree to the{" "}
            <Link href="/legal/terms" className="text-[#20B2AA] hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-[#20B2AA] hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          onClick={() => {
            if (agreed) {
              signIn("google", { callbackUrl: "/home" });
            }
          }}
          disabled={!agreed}
          className="inline-flex items-center justify-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-6 py-3 text-[15px] font-medium text-[#111827] transition-all hover:bg-[#f9fafb] hover:border-[#d1d5db] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e5e7eb]"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <Link
          href="/"
          className="text-[13px] text-[#9ca3af] transition hover:text-[#4b5563]"
        >
          Back to course
        </Link>

        {/* Legal footer */}
        <div className="text-[12px] text-[#d1d5db] space-x-3">
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
