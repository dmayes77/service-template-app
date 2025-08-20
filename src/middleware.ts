// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // DEV override only: allow ?tenant=acme / ?tenant=bravo
  const tenantParam = url.searchParams.get("tenant");

  const res = NextResponse.next();

  // Only set hint from the query param (DEV). Do NOT infer from subdomain in prod.
  if (tenantParam) res.headers.set("x-tenant-hint", tenantParam);

  // Always pass through the actual host for DB lookup in loadTenant()
  res.headers.set("x-req-host", host);

  return res;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/stripe/webhook).*)"],
};
