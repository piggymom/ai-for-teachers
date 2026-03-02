import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js middleware for authentication and rate limiting.
 *
 * - Protects app routes (/home/*, /week/*) by redirecting to /auth/signin
 * - Protects API routes (except /api/auth/*) by returning 401
 * - Applies per-route rate limiting using in-memory counters
 *
 * NOTE: This app uses database sessions (not JWT), so we check for the
 * session cookie directly rather than using getToken() which only works
 * with JWT sessions.
 */

// =============================================================================
// RATE LIMITING (in-memory, edge-compatible)
// =============================================================================

interface RLEntry { count: number; resetAt: number }
const rlStore = new Map<string, RLEntry>();

function rateLimit(key: string, limit: number, windowSec: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const entry = rlStore.get(key);

  if (!entry || now > entry.resetAt) {
    rlStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (entry.count < limit) {
    entry.count++;
    return { allowed: true, remaining: limit - entry.count };
  }
  return { allowed: false, remaining: 0 };
}

// Periodic cleanup (runs on each request, but only purges if stale)
let lastPurge = Date.now();
function purgeStale() {
  const now = Date.now();
  if (now - lastPurge < 60_000) return;
  lastPurge = now;
  for (const [k, v] of rlStore.entries()) {
    if (now > v.resetAt) rlStore.delete(k);
  }
}

// Rate limit configs per API route
const RATE_LIMITS: Record<string, { limit: number; windowSec: number }> = {
  "/api/skippy":    { limit: 60,  windowSec: 3600 }, // 60 req/user/hour
  "/api/podcast":   { limit: 5,   windowSec: 3600 }, // 5 req/user/hour
  "/api/tts":       { limit: 30,  windowSec: 3600 }, // 30 req/user/hour
  "/api/contact":   { limit: 5,   windowSec: 3600 }, // 5 req/IP/hour
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Routes that don't need authentication
const PUBLIC_API_ROUTES = ["/api/auth", "/api/stats"];
const PUBLIC_PAGE_ROUTES = ["/", "/auth", "/legal"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  purgeStale();

  // Skip public page routes
  if (PUBLIC_PAGE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // Skip public API routes
  if (PUBLIC_API_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // Check for database session cookie (works with strategy: "database")
  const sessionToken =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  // For API routes: check auth and rate limits
  if (pathname.startsWith("/api/")) {
    if (!sessionToken) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    // Apply rate limiting (use IP as key since we can't decode database session in edge)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const routeKey = Object.keys(RATE_LIMITS).find((r) => pathname.startsWith(r));

    if (routeKey) {
      const config = RATE_LIMITS[routeKey];
      const limitKey = `${routeKey}:${ip}`;

      const result = rateLimit(limitKey, config.limit, config.windowSec);
      if (!result.allowed) {
        return NextResponse.json(
          { error: { message: "Too many requests. Please try again later.", code: "RATE_LIMITED" } },
          {
            status: 429,
            headers: { "Retry-After": String(config.windowSec) },
          }
        );
      }
    }

    return NextResponse.next();
  }

  // For app routes (pages): check auth via session cookie
  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
