// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const u = new URL(req.url);
  const next = u.searchParams.get("next") || "/";
  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set({
    name: "admin_ok",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
