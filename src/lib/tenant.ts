import "server-only";
import { headers as getHeaders } from "next/headers";
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

export async function loadTenant(): Promise<ResolvedTenant> {
  const h = await getHeaders();
  const hint = h.get("x-tenant-hint") ?? undefined;
  const host = normalizeHost(h.get("x-req-host"));

  const db = controlAdmin();
  let row: DbTenant | null = null;

  const baseSelect =
    "slug,name,host,plan,status,branding,sanity_project_id,sanity_dataset,sanity_read_token,min_version";

  if (hint) {
    const { data } = await db
      .from("tenants")
      .select(baseSelect)
      .eq("slug", hint)
      .maybeSingle<DbTenant>();
    row = data;
  } else if (host) {
    const { data } = await db
      .from("tenants")
      .select(baseSelect)
      .eq("host", host)
      .maybeSingle<DbTenant>();
    row = data;
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

  // dev fallback
  const dev = (hint && TENANTS[hint]) || TENANTS.acme;
  return {
    ...dev,
    plan: "starter",
    status: "active",
    sanity: null,
    minVersion: null,
  };
}
