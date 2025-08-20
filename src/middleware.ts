// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Prefer forwarded host on Vercel; fall back to Host
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";

  // Forward helpful headers to server components / routes
  const requestHeaders = new Headers(req.headers);

  // DEV override: allow ?tenant=<slug>
  const tenantParam = url.searchParams.get("tenant");
  if (tenantParam) requestHeaders.set("x-tenant-hint", tenantParam);

  requestHeaders.set("x-req-host", host);
  requestHeaders.set("x-pathname", pathname);

  // ---- Admin gate: require login cookie for protected paths ----
  const adminPaths = ["/tenant-admin", "/api/tenants"];
  const needsAdmin = adminPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (needsAdmin) {
    const ok = req.cookies.get("admin_ok")?.value === "1";
    if (!ok) {
      const loginUrl = new URL("/admin-login", url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  // --------------------------------------------------------------

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Skip static assets and the Stripe webhook route
export const config = {
  matcher: ["/((?!_next|.*\\..*|api/stripe/webhook).*)"],
};
