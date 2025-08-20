import "server-only";
import { createClient, type ClientConfig } from "next-sanity";
import { loadTenant } from "./tenant";

// Strict: must have per-tenant Sanity configured
export async function tenantSanityClient() {
  const tenant = await loadTenant();
  if (!tenant.sanity) {
    const e = new Error("Sanity not configured for tenant");
    (e as any).code = "SANITY_CONFIG";
    throw e;
  }

  const cfg: ClientConfig = {
    projectId: tenant.sanity.projectId,
    dataset: tenant.sanity.dataset,
    apiVersion: process.env.SANITY_API_VERSION!, // e.g. "2024-05-01"
    token: tenant.sanity.readToken, // server-only
    useCdn: true,
    perspective: "published",
  };
  return createClient(cfg);
}

// Safe: returns null if not configured so pages can render with fallbacks
export async function maybeTenantSanityClient() {
  const tenant = await loadTenant();
  if (!tenant.sanity) return null;

  const cfg: ClientConfig = {
    projectId: tenant.sanity.projectId,
    dataset: tenant.sanity.dataset,
    apiVersion: process.env.SANITY_API_VERSION!,
    token: tenant.sanity.readToken,
    useCdn: true,
    perspective: "published",
  };
  return createClient(cfg);
}
