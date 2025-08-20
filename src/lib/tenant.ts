import "server-only";
import { headers as getHeaders } from "next/headers";
import { controlAdmin } from "@/lib/control-db";
import { TENANTS, type Tenant } from "./tenants.local";

type DbTenant = {
  slug: string;
  name: string;
  host: string | null;
  branding: any | null;
};

function normalizeHost(host?: string | null) {
  return host ? host.split(",")[0].replace(/:\d+$/, "").toLowerCase() : null;
}

export async function loadTenant(): Promise<Tenant> {
  const h = await getHeaders();
  const hint = h.get("x-tenant-hint") ?? undefined; // ?tenant=acme (dev)
  const host = normalizeHost(h.get("x-req-host")); // from middleware

  const db = controlAdmin();
  let row: DbTenant | null = null;

  if (hint) {
    const { data } = await db
      .from("tenants")
      .select("slug,name,host,branding")
      .eq("slug", hint)
      .maybeSingle();
    row = data;
  } else if (host) {
    const { data } = await db
      .from("tenants")
      .select("slug,name,host,branding")
      .eq("host", host)
      .maybeSingle();
    row = data;
  }

  if (row) {
    const b = row.branding ?? {};
    return {
      slug: row.slug,
      name: row.name,
      branding: {
        primary: b.primary ?? "#0ea5e9",
        accent: b.accent ?? "#34d399",
        text: b.text ?? "#0b1220",
        logoUrl: b.logoUrl ?? "https://placehold.co/200x60?text=LOGO",
      },
    };
  }
  return (hint && TENANTS[hint]) || TENANTS.acme; // safe fallback
}
