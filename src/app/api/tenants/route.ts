import { NextResponse } from "next/server";
import { controlAdmin } from "@/lib/control-db";

export const runtime = "nodejs";

type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};
type Body = { slug: string; name: string; branding: Branding };

function isBody(x: unknown): x is Body {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const b = o.branding as Record<string, unknown> | undefined;
  return (
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    !!b &&
    typeof b.primary === "string" &&
    typeof b.accent === "string" &&
    typeof b.text === "string" &&
    typeof b.logoUrl === "string"
  );
}

export async function POST(req: Request) {
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!isBody(bodyUnknown))
    return NextResponse.json(
      { error: "Missing/invalid fields" },
      { status: 400 }
    );
  const body = bodyUnknown;

  const db = controlAdmin();
  const { error } = await db
    .from("tenants")
    .upsert(
      [
        {
          slug: body.slug.trim().toLowerCase(),
          name: body.name.trim(),
          branding: body.branding,
          status: "active",
          plan: "starter",
        },
      ],
      { onConflict: "slug" }
    );

  if (error)
    return NextResponse.json(
      { error: "DB upsert failed", details: error.message },
      { status: 500 }
    );
  return NextResponse.json({ ok: true });
}
