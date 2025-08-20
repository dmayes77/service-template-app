// src/app/admin-login/page.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const sp = useSearchParams();

  const next = sp.get("next") ?? "/tenant-admin";
  const error = sp.get("e") === "1";

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Admin Access</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your admin key to continue.
      </p>

      <form method="POST" action="/api/admin/login" className="mt-6 grid gap-3">
        <input type="hidden" name="next" value={next} />
        <label className="grid gap-1">
          <span className="text-sm font-medium">Admin key</span>
          <input
            name="key"
            type="password"
            required
            className="w-full rounded border p-2"
            placeholder="••••••••"
            autoFocus
          />
        </label>
        {error && (
          <p className="text-sm text-red-600">Invalid key. Please try again.</p>
        )}
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </main>
  );
}
