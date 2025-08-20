// src/lib/tenant.ts
import "server-only";
import { headers as getHeaders } from "next/headers";
import { controlAdmin } from "@/lib/control-db";
import { TENANTS, type Tenant } from "./tenants.local";

type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};

type DbTenant = {
  slug: string;
  name: string;
  host: string | null;
  branding: unknown; // we'll validate/normalize this safely
};

function normalizeHost(host?: string | null) {
  return host ? host.split(",")[0].replace(/:\d+$/, "").toLowerCase() : null;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}
/** Convert unknown JSON into a safe Branding object with fallbacks */
function normalizeBranding(input: unknown): Branding {
  const obj = isRecord(input) ? input : {};
  return {
    primary: str(obj.primary, "#0ea5e9"),
    accent: str(obj.accent, "#34d399"),
    text: str(obj.text, "#0b1220"),
    logoUrl: str(obj.logoUrl, "https://placehold.co/200x60?text=LOGO"),
  };
}

export async function loadTenant(): Promise<Tenant> {
  const h = await getHeaders();
  const hint = h.get("x-tenant-hint") ?? undefined; // dev: ?tenant=acme
  const host = normalizeHost(h.get("x-req-host")); // set by middleware

  const db = controlAdmin();
  let row: DbTenant | null = null;

  if (hint) {
    const { data } = await db
      .from("tenants")
      .select("slug,name,host,branding")
      .eq("slug", hint)
      .maybeSingle<DbTenant>();
    row = data;
  } else if (host) {
    const { data } = await db
      .from("tenants")
      .select("slug,name,host,branding")
      .eq("host", host)
      .maybeSingle<DbTenant>();
    row = data;
  }

  if (row) {
    const b = normalizeBranding(row.branding);
    return { slug: row.slug, name: row.name, branding: b };
  }

  // Safe fallback for dev
  return (hint && TENANTS[hint]) || TENANTS.acme;
}
