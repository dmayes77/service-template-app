// src/sanity/lib/client.ts
// server-only tenant-aware Sanity client proxy with options support
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

// --- internal helpers to satisfy TS overloads without using `any` ---
async function fetchStrict<T>(
  query: string,
  params?: Params,
  options?: FetchOptions
): Promise<T> {
  const c = await tenantSanityClient();

  if (options && params) {
    // Pass all three args
    return (
      c as unknown as {
        fetch: (q: string, p: Params, o: FetchOptions) => Promise<T>;
      }
    ).fetch(query, params, options);
  }
  if (params) {
    return c.fetch<T>(query, params);
  }
  if (options) {
    // Explicitly pass `undefined` for params to hit the correct overload
    return (
      c as unknown as {
        fetch: (q: string, p: undefined, o: FetchOptions) => Promise<T>;
      }
    ).fetch(query, undefined, options);
  }
  return c.fetch<T>(query);
}

async function fetchSafe<T>(
  query: string,
  params?: Params,
  options?: FetchOptions
): Promise<T | null> {
  const c = await maybeTenantSanityClient();
  if (!c) return null;

  if (options && params) {
    return (
      c as unknown as {
        fetch: (q: string, p: Params, o: FetchOptions) => Promise<T>;
      }
    ).fetch(query, params, options);
  }
  if (params) {
    return c.fetch<T>(query, params);
  }
  if (options) {
    return (
      c as unknown as {
        fetch: (q: string, p: undefined, o: FetchOptions) => Promise<T>;
      }
    ).fetch(query, undefined, options);
  }
  return c.fetch<T>(query);
}

// --- public API (drop-in) ---
export const client = {
  fetch: fetchStrict,
};

export const clientSafe = {
  fetch: fetchSafe,
};

// Re-export groq for convenience
export { groq } from "next-sanity";
