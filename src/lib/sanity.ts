// src/lib/sanity.ts
import "server-only";
import { createClient, type ClientConfig } from "next-sanity";
import { loadTenant } from "./tenant";

class SanityConfigError extends Error {
  readonly code = "SANITY_CONFIG";
  constructor(message = "Sanity not configured for tenant") {
    super(message);
    this.name = "SanityConfigError";
  }
}

export async function tenantSanityClient() {
  const tenant = await loadTenant();
  if (!tenant.sanity) throw new SanityConfigError();

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
