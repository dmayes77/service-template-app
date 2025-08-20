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

  // 1) attach domain to project
  const attachRes = await fetch(
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
  const payload = (await attachRes.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  // idempotent success if already on this project
  const errObj = (
    payload as {
      error?: {
        code?: string;
        projectId?: string;
        domain?: { projectId?: string };
      };
    }
  ).error;
  const alreadyOnThisProject =
    errObj?.code === "domain_already_in_use" &&
    (errObj.projectId === process.env.VERCEL_PROJECT_ID ||
      errObj.domain?.projectId === process.env.VERCEL_PROJECT_ID);

  if (!attachRes.ok && !alreadyOnThisProject) {
    return NextResponse.json(
      { error: "Vercel domain attach failed", details: payload },
      { status: 400 }
    );
  }

  // 2) persist host
  const db = controlAdmin();
  const { error } = await db.from("tenants").update({ host }).eq("slug", slug);
  if (error)
    return NextResponse.json(
      { error: "Failed to save host in DB", details: error.message },
      { status: 500 }
    );

  return NextResponse.json({ ok: true, host, vercel: payload });
}

export async function DELETE(_req: Request, ctx: any) {
  const { slug } = (ctx?.params || {}) as { slug: string };
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const db = controlAdmin();
  const { data: row, error: readErr } = await db
    .from("tenants")
    .select("host")
    .eq("slug", slug)
    .maybeSingle();
  if (readErr)
    return NextResponse.json(
      { error: "DB error", details: readErr.message },
      { status: 500 }
    );

  const host = row?.host;
  if (host) {
    const del = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${encodeURIComponent(host)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
        cache: "no-store",
      }
    );
    if (!del.ok && del.status !== 404) {
      const details = await del.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Vercel detach failed", details },
        { status: 400 }
      );
    }
  }

  const { error: updErr } = await db
    .from("tenants")
    .update({ host: null })
    .eq("slug", slug);
  if (updErr)
    return NextResponse.json(
      { error: "DB update failed", details: updErr.message },
      { status: 500 }
    );

  return NextResponse.json({ ok: true, hostRemoved: host ?? null });
}
