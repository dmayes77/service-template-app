import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const tenantParam = url.searchParams.get("tenant"); // dev override only

  const res = NextResponse.next();

  // DEV: allow ?tenant=slug to override
  if (tenantParam) res.headers.set("x-tenant-hint", tenantParam);

  // Always pass the actual host for DB lookup in loadTenant()
  res.headers.set("x-req-host", host);

  return res;
}

export const config = {
  // skip static assets and (future) stripe webhook
  matcher: ["/((?!_next|.*\\..*|api/stripe/webhook).*)"],
};
