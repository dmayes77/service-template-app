// src/sanity/lib/client.ts
// server-only tenant-aware Sanity client proxy with options + withConfig support
import "server-only";
import { tenantSanityClient, maybeTenantSanityClient } from "@/lib/sanity";

// Keep params simple & permissive
type Params = Record<string, unknown>;

// Minimal Next.js-aware fetch options shape
type FetchOptions = {
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: "force-cache" | "no-store";
  // allow additional keys without fighting types across next-sanity versions
  [key: string]: unknown;
};

interface ClientLike {
  fetch<T>(query: string, params?: Params, options?: FetchOptions): Promise<T>;
  withConfig(cfg: Record<string, unknown>): ClientLike;
}

function buildStrict(_defaultCfg?: Record<string, unknown>): ClientLike {
  return {
    async fetch<T>(
      query: string,
      params?: Params,
      options?: FetchOptions
    ): Promise<T> {
      const c = await tenantSanityClient();
      if (options && params) {
        return (
          c as unknown as {
            fetch: (q: string, p: Params, o: FetchOptions) => Promise<T>;
          }
        ).fetch(query, params, options);
      }
      if (params) return c.fetch<T>(query, params);
      if (options) {
        return (
          c as unknown as {
            fetch: (q: string, p: undefined, o: FetchOptions) => Promise<T>;
          }
        ).fetch(query, undefined, options);
      }
      return c.fetch<T>(query);
    },
    // No-op: we ignore additional config here and keep tenant-aware behavior.
    withConfig(cfg: Record<string, unknown>): ClientLike {
      // If you want to honor specific cfg (e.g., apiVersion) later,
      // you can thread it through loadTenant/tenantSanityClient.
      return buildStrict({ ..._defaultCfg, ...cfg });
    },
  };
}

function buildSafe(_defaultCfg?: Record<string, unknown>): ClientLike {
  return {
    async fetch<T>(
      query: string,
      params?: Params,
      options?: FetchOptions
    ): Promise<T> {
      const c = await maybeTenantSanityClient();
      if (!c) return null as unknown as T;
      if (options && params) {
        return (
          c as unknown as {
            fetch: (q: string, p: Params, o: FetchOptions) => Promise<T>;
          }
        ).fetch(query, params, options);
      }
      if (params) return c.fetch<T>(query, params);
      if (options) {
        return (
          c as unknown as {
            fetch: (q: string, p: undefined, o: FetchOptions) => Promise<T>;
          }
        ).fetch(query, undefined, options);
      }
      return c.fetch<T>(query);
    },
    withConfig(cfg: Record<string, unknown>): ClientLike {
      return buildSafe({ ..._defaultCfg, ...cfg });
    },
  };
}

// --- public API (drop-in) ---
export const client: ClientLike = buildStrict();
export const clientSafe: ClientLike = buildSafe();

// Re-export groq for convenience
export { groq } from "next-sanity";
