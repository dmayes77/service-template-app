/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { controlAdmin } from "@/lib/control-db";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: any) {
  const { slug } = (ctx?.params || {}) as { slug: string };
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const db = controlAdmin();
  const { data, error } = await db
    .from("tenants")
    .select("slug,name,host,branding")
    .eq("slug", slug)
    .maybeSingle();

  if (error)
    return NextResponse.json(
      { error: "DB error", details: error.message },
      { status: 500 }
    );
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    slug: data.slug,
    name: data.name,
    host: data.host,
    branding: data.branding ?? {},
  });
}
