"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-5 w-16 animate-pulse rounded bg-muted" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="text-[15px] text-muted-foreground">
          {session.user.name?.split(" ")[0]}
        </span>
        <span className="text-border">&middot;</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[15px] text-muted-foreground transition hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      className="text-[15px] text-muted-foreground transition hover:text-foreground"
    >
      Sign in
    </button>
  );
}
