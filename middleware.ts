import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export default auth(async (request) => {
  const { pathname } = request.nextUrl;
  const isProtectedPath =
    pathname.startsWith("/week-") || pathname.includes("/takeaways");

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    return NextResponse.next();
  }

  const statusResponse = await fetch(
    new URL("/api/profile-status", request.url),
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    }
  );

  if (statusResponse.ok) {
    const { completed } = (await statusResponse.json()) as {
      completed?: boolean;
    };

    if (!completed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/week-:path*", "/takeaways/:path*"],
};
