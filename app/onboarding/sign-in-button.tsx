"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
      onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
      type="button"
    >
      Continue with Google
    </button>
  );
}
