import "server-only";
import { headers as getHeaders } from "next/headers";
import { TENANTS, type Tenant } from "./tenants.local";

export async function loadTenant(): Promise<Tenant> {
  const h = await getHeaders(); // 👈 await here
  const hint = h.get("x-tenant-hint") ?? undefined; // set by middleware
  return (hint && TENANTS[hint]) || TENANTS.acme;
}
