"use client";

import { useState } from "react";

type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};

type TenantDTO = {
  slug: string;
  name: string;
  host?: string | null;
  branding: Branding;
};

type ApiResult =
  | { ok: true; data?: unknown; message?: string }
  | { ok: false; error: string; details?: unknown };

type ConnectDomainSuccess = { ok: true; host: string; vercel?: unknown };
type ConnectDomainFailure = { ok: false; error: string; details?: unknown };
type ConnectDomainResponse = ConnectDomainSuccess | ConnectDomainFailure;

function isTenantDTO(x: unknown): x is TenantDTO {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const b = o.branding as Record<string, unknown> | undefined;
  return (
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    !!b &&
    typeof b.primary === "string" &&
    typeof b.accent === "string" &&
    typeof b.text === "string" &&
    typeof b.logoUrl === "string"
  );
}

export default function TenantAdmin() {
  const [slug, setSlug] = useState<string>("mad-tints");
  const [name, setName] = useState<string>(
    "Mayes Auto Detailing and Ceramic Coatings"
  );
  const [host, setHost] = useState<string>("app.getmadpro.com");

  const [branding, setBranding] = useState<Branding>({
    primary: "#0ea5e9",
    accent: "#34d399",
    text: "#0b1220",
    logoUrl: "https://placehold.co/200x60?text=MAD",
  });

  const [saveRes, setSaveRes] = useState<ApiResult | null>(null);
  const [connectRes, setConnectRes] = useState<ConnectDomainResponse | null>(
    null
  );
  const [disconnectRes, setDisconnectRes] = useState<{
    ok: boolean;
    error?: string;
  } | null>(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [loadingDisconnect, setLoadingDisconnect] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(false);

  async function loadTenant() {
    setLoadingLoad(true);
    setSaveRes(null);
    setConnectRes(null);
    setDisconnectRes(null);
    try {
      const r = await fetch(`/api/tenants/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      const j = (await r.json()) as unknown;
      if (!r.ok) {
        const err = j as { error?: string; details?: unknown };
        setSaveRes({
          ok: false,
          error: err.error ?? "Failed to load tenant",
          details: err.details,
        });
        return;
      }
      if (isTenantDTO(j)) {
        setName(j.name);
        setHost(j.host ?? "");
        setBranding(j.branding);
        setSaveRes({ ok: true, data: j, message: "Loaded" });
      } else {
        setSaveRes({ ok: false, error: "Malformed tenant response" });
      }
    } catch (e) {
      setSaveRes({
        ok: false,
        error: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setLoadingLoad(false);
    }
  }

  async function saveTenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingSave(true);
    setSaveRes(null);
    try {
      const r = await fetch(`/api/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          name: name.trim(),
          branding,
        } satisfies Omit<TenantDTO, "host">),
      });
      const j = await r.json();
      if (!r.ok) {
        const err = j as { error?: string; details?: unknown };
        setSaveRes({
          ok: false,
          error: err.error ?? "Save failed",
          details: err.details,
        });
        return;
      }
      setSaveRes({ ok: true, data: j, message: "Saved" });
    } catch (e) {
      setSaveRes({
        ok: false,
        error: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setLoadingSave(false);
    }
  }

  async function connectDomain() {
    setLoadingConnect(true);
    setConnectRes(null);
    try {
      const r = await fetch(
        `/api/tenants/${encodeURIComponent(slug)}/connect-domain`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ host: host.trim().toLowerCase() }),
        }
      );

      // We construct a valid union in both branches:
      const payload = (await r.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (r.ok) {
        const hostFromPayload =
          typeof payload?.host === "string"
            ? (payload.host as string)
            : host.trim().toLowerCase();
        setConnectRes({
          ok: true,
          host: hostFromPayload,
          vercel: payload?.vercel,
        });
      } else {
        const msg =
          typeof payload?.error === "string"
            ? (payload.error as string)
            : "Vercel domain attach failed";
        setConnectRes({
          ok: false,
          error: msg,
          details: payload?.details ?? payload,
        });
      }
    } catch (e) {
      setConnectRes({
        ok: false,
        error: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setLoadingConnect(false);
    }
  }

  async function disconnectDomain() {
    setLoadingDisconnect(true);
    setDisconnectRes(null);
    try {
      const r = await fetch(
        `/api/tenants/${encodeURIComponent(slug)}/connect-domain`,
        {
          method: "DELETE",
        }
      );
      const j = await r.json().catch(() => ({}));
      setDisconnectRes({
        ok: r.ok,
        error: r.ok ? undefined : j?.error || "Failed",
      });
      if (r.ok) setHost("");
    } catch (e) {
      setDisconnectRes({
        ok: false,
        error: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setLoadingDisconnect(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Tenant Admin</h1>

      <section className="mt-6">
        <div className="flex items-end gap-3">
          <label className="grow grid gap-1">
            <span className="text-sm font-medium">Tenant slug</span>
            <input
              className="rounded border p-2"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mad-tints"
            />
          </label>
          <button
            type="button"
            onClick={loadTenant}
            disabled={loadingLoad || !slug.trim()}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loadingLoad ? "Loading..." : "Load"}
          </button>
        </div>
      </section>

      <form onSubmit={saveTenant} className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Business name</span>
          <input
            className="rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mayes Auto Detailing and Ceramic Coatings"
          />
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Primary</span>
            <input
              type="color"
              className="h-10 w-full rounded border p-1"
              value={branding.primary}
              onChange={(e) =>
                setBranding({ ...branding, primary: e.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Accent</span>
            <input
              type="color"
              className="h-10 w-full rounded border p-1"
              value={branding.accent}
              onChange={(e) =>
                setBranding({ ...branding, accent: e.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Text</span>
            <input
              type="color"
              className="h-10 w-full rounded border p-1"
              value={branding.text}
              onChange={(e) =>
                setBranding({ ...branding, text: e.target.value })
              }
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Logo URL</span>
          <input
            className="rounded border p-2"
            value={branding.logoUrl}
            onChange={(e) =>
              setBranding({ ...branding, logoUrl: e.target.value.trim() })
            }
            placeholder="https://…"
          />
        </label>

        <button
          type="submit"
          disabled={loadingSave || !slug.trim() || !name.trim()}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loadingSave ? "Saving..." : "Save Tenant"}
        </button>
      </form>

      {saveRes && (
        <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(saveRes, null, 2)}
        </pre>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Connect / Disconnect Domain</h2>
        <div className="mt-3 grid md:grid-cols-[1fr_auto_auto] gap-3">
          <input
            className="rounded border p-2"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="app.client-domain.com"
          />
          <button
            type="button"
            onClick={connectDomain}
            disabled={loadingConnect || !slug.trim() || !host.trim()}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loadingConnect ? "Connecting..." : "Connect"}
          </button>
          <button
            type="button"
            onClick={disconnectDomain}
            disabled={loadingDisconnect || !slug.trim()}
            className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
          >
            {loadingDisconnect ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>

        {connectRes && (
          <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm">
            {JSON.stringify(connectRes, null, 2)}
          </pre>
        )}
        {disconnectRes && (
          <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm">
            {JSON.stringify(disconnectRes, null, 2)}
          </pre>
        )}

        <p className="mt-3 text-sm">
          DNS: create a <strong>CNAME</strong> to{" "}
          <code>cname.vercel-dns.com</code>. If the response shows verification
          records, add them first, then click <em>Connect</em> again.
        </p>
      </section>
    </main>
  );
}
