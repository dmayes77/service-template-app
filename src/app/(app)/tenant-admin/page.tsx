// src/app/(app)/tenant-admin/page.tsx
"use client";

import { useState } from "react";

type ConnectDomainResponse = {
  ok: boolean;
  host?: string;
  vercel?: unknown;
  error?: string;
  details?: unknown;
};

export default function TenantAdmin() {
  const [slug, setSlug] = useState<string>("acme"); // change as needed
  const [host, setHost] = useState<string>("app.client-domain.com");
  const [res, setRes] = useState<ConnectDomainResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setRes(null);

    try {
      const r = await fetch(
        `/api/tenants/${encodeURIComponent(slug)}/connect-domain`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ host }),
        }
      );

      // Strip any 'ok' coming from the API payload to avoid duplicate property
      const raw = (await r.json()) as Partial<ConnectDomainResponse>;
      const { ok: _ignore, ...rest } = raw;
      setRes({ ...rest, ok: r.ok } as ConnectDomainResponse);
    } catch (err: unknown) {
      setRes({
        ok: false,
        error: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Connect Domain</h1>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Tenant slug</span>
          <input
            className="rounded border p-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="acme"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Host (CNAME)</span>
          <input
            className="rounded border p-2"
            value={host}
            onChange={(e) => setHost(e.target.value.trim())}
            placeholder="app.client-domain.com"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect Domain"}
        </button>
      </form>

      {res && (
        <pre className="mt-6 whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(res, null, 2)}
        </pre>
      )}

      <p className="mt-6 text-sm">
        Add a <strong>CNAME</strong> for your host pointing to{" "}
        <code>cname.vercel-dns.com</code>. If the response includes verification
        records (TXT/CNAME), add those first, then click <em>Connect</em> again.
      </p>
    </main>
  );
}
