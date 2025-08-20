/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { controlAdmin } from "@/lib/control-db";

export const runtime = "nodejs";

type Body = { host: string };

function normalizeHost(host: string) {
  return host
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

export async function POST(req: Request, ctx: any) {
  const { slug } = (ctx?.params || {}) as { slug: string };

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.host)
    return NextResponse.json({ error: "Missing host" }, { status: 400 });

  const host = normalizeHost(body.host);

  // 1) Attach domain to Vercel
  const r = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: host }),
      cache: "no-store",
    }
  );
  const payload = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json(
      { error: "Vercel domain attach failed", details: payload },
      { status: 400 }
    );
  }

  // 2) Save host on tenant
  const db = controlAdmin();
  const { error } = await db.from("tenants").update({ host }).eq("slug", slug);
  if (error) {
    return NextResponse.json(
      { error: "Failed to save host in DB", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, host, vercel: payload });
}
