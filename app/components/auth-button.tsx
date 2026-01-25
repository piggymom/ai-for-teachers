"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm text-white/70">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
    >
      Sign in with Google
    </button>
  );
}
