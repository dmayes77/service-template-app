import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const tenantParam = url.searchParams.get("tenant");

  let tenantHint: string | null = tenantParam;
  // Prod idea: derive from subdomain; for now it’s a placeholder
  if (!tenantHint && host && !host.startsWith("localhost")) {
    tenantHint = host.split(".")[0] || null;
  }

  const res = NextResponse.next();
  if (tenantHint) res.headers.set("x-tenant-hint", tenantHint);
  res.headers.set("x-req-host", host);
  return res;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/stripe/webhook).*)"],
};
