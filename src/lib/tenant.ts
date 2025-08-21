// src/lib/tenant.ts
import "server-only";
import { headers as nextHeaders } from "next/headers";
import { controlAdmin } from "@/lib/control-db";
import { TENANTS } from "./tenants.local";

export type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};

export type ResolvedTenant = {
  slug: string;
  name: string;
  branding: Branding;
  plan?: string;
  status?: "active" | "past_due" | "paused" | "cancelled";
  sanity?: {
    projectId: string;
    dataset: string;
    readToken: string;
  } | null;
  minVersion?: string | null;
};

type DbTenant = {
  slug: string;
  name: string;
  host: string | null;
  plan: string | null;
  status: string | null;
  branding: unknown;
  sanity_project_id: string | null;
  sanity_dataset: string | null;
  sanity_read_token: string | null;
  min_version: string | null;
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
function normalizeBranding(input: unknown): Branding {
  const obj = isRecord(input) ? input : {};
  return {
    primary: str(obj.primary, "#0ea5e9"),
    accent: str(obj.accent, "#34d399"),
    text: str(obj.text, "#0b1220"),
    logoUrl: str(obj.logoUrl, "https://placehold.co/200x60?text=LOGO"),
  };
}

// Type of awaited nextHeaders()
type HeaderObj = Awaited<ReturnType<typeof nextHeaders>>;

/**
 * Get request headers if we are in a request scope; otherwise null (e.g., SSG/build).
 */
async function getReqHeadersOrNull(): Promise<HeaderObj | null> {
  try {
    return await nextHeaders(); // throws outside request scope in some modes
  } catch {
    return null;
  }
}

export async function loadTenant(): Promise<ResolvedTenant> {
  const h = await getReqHeadersOrNull();
  const hint = h?.get("x-tenant-hint") ?? undefined;
  const host = normalizeHost(h?.get("x-req-host") ?? h?.get("host"));

  // If we're in a request, try DB lookup; otherwise we’ll fall back to dev tenant
  if (hint || host) {
    const db = controlAdmin();
    const baseSelect =
      "slug,name,host,plan,status,branding,sanity_project_id,sanity_dataset,sanity_read_token,min_version";

    let row: DbTenant | null = null;
    if (hint) {
      const { data } = await db
        .from("tenants")
        .select(baseSelect)
        .eq("slug", hint)
        .maybeSingle<DbTenant>();
      row = data ?? null;
    } else if (host) {
      const { data } = await db
        .from("tenants")
        .select(baseSelect)
        .eq("host", host)
        .maybeSingle<DbTenant>();
      row = data ?? null;
    }

    if (row) {
      const b = normalizeBranding(row.branding);
      const sanity =
        row.sanity_project_id && row.sanity_dataset && row.sanity_read_token
          ? {
              projectId: row.sanity_project_id,
              dataset: row.sanity_dataset,
              readToken: row.sanity_read_token,
            }
          : null;

      return {
        slug: row.slug,
        name: row.name,
        branding: b,
        plan: row.plan ?? undefined,
        status: (row.status as ResolvedTenant["status"]) ?? "active",
        sanity,
        minVersion: row.min_version,
      };
    }
  }

  // Build/SSG or not found → dev fallback
  const dev = (hint && TENANTS[hint]) || TENANTS.acme;
  return {
    ...dev,
    plan: "starter",
    status: "active",
    sanity: null,
    minVersion: null,
  };
}
