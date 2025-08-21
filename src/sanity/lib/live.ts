// src/sanity/lib/live.ts
// Minimal live shim that works with the tenant-aware client.
// Provides: `sanityFetch` (SSR-friendly) and `SanityLive` (no-op wrapper).

import "server-only";
import { tenantSanityClient } from "@/lib/sanity";

type Params = Record<string, unknown>;
type FetchOptions = {
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: "force-cache" | "no-store";
};

interface HasFetchWithOptions {
  fetch<T>(query: string, params?: Params, options?: FetchOptions): Promise<T>;
}

/**
 * Usage mirrors next-sanity's `sanityFetch` shape closely enough for typical code:
 *   const { data } = await sanityFetch<MyType>({ query, params, revalidate, tags });
 */
export async function sanityFetch<T>(opts: {
  query: string;
  params?: Params;
  revalidate?: number | false;
  tags?: string[];
  // passthrough if you want to send full `next`/`cache`
  options?: FetchOptions;
}): Promise<{ data: T }> {
  const { query, params, revalidate, tags, options } = opts;

  // Build Next.js fetch options if caller didn't provide a full options object
  const nextOptions: FetchOptions =
    options ??
    (revalidate !== undefined || tags
      ? { next: { revalidate: revalidate ?? undefined, tags } }
      : {});

  const client = (await tenantSanityClient()) as unknown as HasFetchWithOptions;

  // Pass options only if present to satisfy overloads at runtime
  const data = Object.keys(nextOptions).length
    ? await client.fetch<T>(query, params, nextOptions)
    : await client.fetch<T>(query, params);

  return { data };
}

/**
 * No-op wrapper to keep JSX usages compiling:
 *   <SanityLive>{children}</SanityLive>
 */
export function SanityLive(props: { children: React.ReactNode }) {
  return props.children;
}
