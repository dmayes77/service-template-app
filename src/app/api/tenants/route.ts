// src/app/api/tenants/route.ts
import { NextResponse } from "next/server";
import { controlAdmin } from "@/lib/control-db";

export const runtime = "nodejs";

type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};
type Body = {
  slug: string;
  name: string;
  branding: Branding;
  plan?: string;
  status?: "active" | "past_due" | "paused" | "cancelled";
  minVersion?: string | null;
  sanity?: { projectId: string; dataset: string; readToken: string } | null;
};

function isBody(x: unknown): x is Body {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const b = o.branding as Record<string, unknown> | undefined;

  // Make sure this is a strict boolean, never undefined
  const hasBrand =
    !!b &&
    (["primary", "accent", "text", "logoUrl"] as const).every(
      (k) => typeof (b as Record<string, unknown>)[k] === "string"
    );

  return typeof o.slug === "string" && typeof o.name === "string" && hasBrand;
}

export async function POST(req: Request) {
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isBody(bodyUnknown)) {
    return NextResponse.json(
      { error: "Missing/invalid fields" },
      { status: 400 }
    );
  }

  const body = bodyUnknown as Body;

  const db = controlAdmin();
  const { error } = await db.from("tenants").upsert(
    [
      {
        slug: body.slug.trim().toLowerCase(),
        name: body.name.trim(),
        branding: body.branding,
        plan: body.plan ?? "starter",
        status: body.status ?? "active",
        sanity_project_id: body.sanity?.projectId ?? null,
        sanity_dataset: body.sanity?.dataset ?? null,
        sanity_read_token: body.sanity?.readToken ?? null,
        min_version: body.minVersion ?? null,
      },
    ],
    { onConflict: "slug" }
  );

  if (error) {
    return NextResponse.json(
      { error: "DB upsert failed", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
