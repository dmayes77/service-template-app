// src/sanity/lib/client.ts
// server-only tenant-aware Sanity client proxy
import "server-only";
import { tenantSanityClient, maybeTenantSanityClient } from "@/lib/sanity";

// Use a simple params shape that plays nicely with next-sanity overloads
type Params = Record<string, unknown>;

// Strict client: throws if this tenant doesn't have Sanity configured
export const client = {
  async fetch<T = unknown>(query: string, params?: Params): Promise<T> {
    const c = await tenantSanityClient(); // strict
    // Only pass params if defined to satisfy TS overloads
    return params ? c.fetch<T>(query, params) : c.fetch<T>(query);
  },
};

// Safe client: returns null if not configured (use for optional Sanity pages)
export const clientSafe = {
  async fetch<T = unknown>(query: string, params?: Params): Promise<T | null> {
    const c = await maybeTenantSanityClient(); // null if not configured
    if (!c) return null;
    return params ? c.fetch<T>(query, params) : c.fetch<T>(query);
  },
};

// Re-export groq for convenience so existing imports keep working
export { groq } from "next-sanity";
