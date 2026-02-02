"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-5 w-16 animate-pulse rounded bg-white/5" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2.5">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-5 w-5 rounded-full opacity-80"
          />
        )}
        <span className="text-[13px] font-light text-white/40">
          {session.user.name?.split(" ")[0]}
        </span>
        <span className="text-white/20">·</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[13px] font-light text-white/25 transition hover:text-white/50"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      className="text-[13px] font-light text-white/40 transition hover:text-white/60"
    >
      Sign in
    </button>
  );
}
