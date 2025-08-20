// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const key = form.get("key");
  const next = (form.get("next")?.toString() || "/tenant-admin").toString();

  if (typeof key !== "string" || key !== process.env.ADMIN_KEY) {
    const url = new URL("/admin-login", req.url);
    url.searchParams.set("e", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set({
    name: "admin_ok",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
