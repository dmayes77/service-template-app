// src/app/(app)/tenant-admin/page.tsx
"use client";

import { useState } from "react";

type Branding = {
  primary: string;
  accent: string;
  text: string;
  logoUrl: string;
};

type Status = "active" | "past_due" | "paused" | "cancelled";

type SanityCfg = { projectId: string; dataset: string; readToken: string };

type TenantDTO = {
  slug: string;
  name: string;
  host?: string | null;
  branding: Branding;
  plan?: string;
  status?: Status;
  minVersion?: string | null;
  sanity?: SanityCfg | null;
};

type ApiError = { error?: string; details?: unknown };

type ApiResult =
  | { ok: true; data?: unknown; message?: string }
  | { ok: false; error: string; details?: unknown };

type ConnectDomainSuccess = { ok: true; host: string; vercel?: unknown };
type ConnectDomainFailure = { ok: false; error: string; details?: unknown };
type ConnectDomainResponse = ConnectDomainSuccess | ConnectDomainFailure;

// ---------- type guards ----------
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function isBranding(x: unknown): x is Branding {
  if (!isRecord(x)) return false;
  return (
    typeof x.primary === "string" &&
    typeof x.accent === "string" &&
    typeof x.text === "string" &&
    typeof x.logoUrl === "string"
  );
}
function isStatus(x: unknown): x is Status {
  return (
    x === "active" || x === "past_due" || x === "paused" || x === "cancelled"
  );
}
function isSanityCfg(x: unknown): x is SanityCfg {
  if (!isRecord(x)) return false;
  return (
    typeof x.projectId === "string" &&
    typeof x.dataset === "string" &&
    typeof x.readToken === "string"
  );
}
function isTenantDTO(x: unknown): x is TenantDTO {
  if (!isRecord(x)) return false;
  if (typeof x.slug !== "string" || typeof x.name !== "string") return false;
  if (!isBranding(x.branding)) return false;

  const hostOk =
    x.host === undefined || x.host === null || typeof x.host === "string";
  const planOk = x.plan === undefined || typeof x.plan === "string";
  const statusOk = x.status === undefined || isStatus(x.status);
  const minOk =
    x.minVersion === undefined ||
    x.minVersion === null ||
    typeof x.minVersion === "string";
  const sanityOk =
    x.sanity === undefined || x.sanity === null || isSanityCfg(x.sanity);

  return hostOk && planOk && statusOk && minOk && sanityOk;
}

export default function TenantAdmin() {
  const [slug, setSlug] = useState<string>("mad-tints");
  const [name, setName] = useState<string>(
    "Mayes Auto Detailing and Ceramic Coatings"
  );
  const [host, setHost] = useState<string>("app.getmadpro.com");
  const [plan, setPlan] = useState<string>("starter");
  const [status, setStatus] = useState<Status>("active");
  const [minVersion, setMinVersion] = useState<string>("");

  const [branding, setBranding] = useState<Branding>({
    primary: "#0ea5e9",
    accent: "#34d399",
    text: "#0b1220",
    logoUrl: "https://placehold.co/200x60?text=MAD",
  });

  const [sanityProjectId, setSanityProjectId] = useState<string>("");
  const [sanityDataset, setSanityDataset] = useState<string>("");
  const [sanityReadToken, setSanityReadToken] = useState<string>("");

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
      const dataUnknown: unknown = await r.json();

      if (!r.ok) {
        const err = isRecord(dataUnknown) ? (dataUnknown as ApiError) : {};
        setSaveRes({
          ok: false,
          error: err.error ?? "Failed to load tenant",
          details: err.details,
        });
        return;
      }

      if (!isTenantDTO(dataUnknown)) {
        setSaveRes({ ok: false, error: "Malformed tenant response" });
        return;
      }

      const j = dataUnknown;
      setName(j.name);
      setHost(j.host ?? "");
      setBranding(j.branding);
      setPlan(j.plan ?? "starter");
      setStatus(j.status ?? "active");
      setMinVersion(j.minVersion ?? "");

      if (j.sanity) {
        setSanityProjectId(j.sanity.projectId);
        setSanityDataset(j.sanity.dataset);
        setSanityReadToken(j.sanity.readToken);
      } else {
        setSanityProjectId("");
        setSanityDataset("");
        setSanityReadToken("");
      }

      setSaveRes({ ok: true, data: j, message: "Loaded" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setSaveRes({ ok: false, error: msg });
    } finally {
      setLoadingLoad(false);
    }
  }

  async function saveTenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingSave(true);
    setSaveRes(null);
    try {
      const body: TenantDTO = {
        slug: slug.trim().toLowerCase(),
        name: name.trim(),
        branding,
        plan,
        status,
        minVersion: minVersion || null,
        sanity:
          sanityProjectId && sanityDataset && sanityReadToken
            ? {
                projectId: sanityProjectId,
                dataset: sanityDataset,
                readToken: sanityReadToken,
              }
            : null,
      };

      const r = await fetch(`/api/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const dataUnknown: unknown = await r.json();

      if (!r.ok) {
        const err = isRecord(dataUnknown) ? (dataUnknown as ApiError) : {};
        setSaveRes({
          ok: false,
          error: err.error ?? "Save failed",
          details: err.details,
        });
        return;
      }
      setSaveRes({ ok: true, data: dataUnknown, message: "Saved" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setSaveRes({ ok: false, error: msg });
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

      const payload: unknown = await r.json().catch(() => ({}) as unknown);

      if (r.ok) {
        const p = isRecord(payload) ? payload : {};
        const hostFromPayload =
          typeof p.host === "string" ? p.host : host.trim().toLowerCase();
        setConnectRes({ ok: true, host: hostFromPayload, vercel: p.vercel });
      } else {
        const p = isRecord(payload) ? payload : {};
        const msg =
          typeof p.error === "string" ? p.error : "Vercel domain attach failed";
        setConnectRes({ ok: false, error: msg, details: p.details ?? payload });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setConnectRes({ ok: false, error: msg });
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
      const payload: unknown = await r.json().catch(() => ({}) as unknown);
      const err = isRecord(payload) ? (payload as ApiError) : {};
      setDisconnectRes({
        ok: r.ok,
        error: r.ok ? undefined : (err.error ?? "Failed"),
      });
      if (r.ok) setHost("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setDisconnectRes({ ok: false, error: msg });
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

        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Plan</span>
            <select
              className="rounded border p-2"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="starter">starter</option>
              <option value="pro">pro</option>
              <option value="scale">scale</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Status</span>
            <select
              className="rounded border p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="active">active</option>
              <option value="past_due">past_due</option>
              <option value="paused">paused</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">
            Min App Version (optional)
          </span>
          <input
            className="rounded border p-2"
            value={minVersion}
            onChange={(e) => setMinVersion(e.target.value)}
            placeholder="e.g. 1.3.0"
          />
        </label>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Sanity Project ID</span>
            <input
              className="rounded border p-2"
              value={sanityProjectId}
              onChange={(e) => setSanityProjectId(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Sanity Dataset</span>
            <input
              className="rounded border p-2"
              value={sanityDataset}
              onChange={(e) => setSanityDataset(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Sanity Read Token</span>
            <input
              className="rounded border p-2"
              value={sanityReadToken}
              onChange={(e) => setSanityReadToken(e.target.value)}
            />
          </label>
        </div>

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
