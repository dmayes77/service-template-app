/* eslint-disable @next/next/no-img-element */
import { loadTenant } from "@/lib/tenant";
import Image from "next/image";

export default async function TenantTest() {
  const tenant = await loadTenant();

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="flex items-center gap-4">
        <Image
          src={tenant.branding.logoUrl}
          alt={`${tenant.name} logo`}
          width={200}
          height={60}
          priority
        />
        <h1 className="text-2xl font-semibold">{tenant.name}</h1>
      </div>

      <p className="mt-4">
        Primary:{" "}
        <span className="text-[var(--brand-primary)] font-semibold">this</span>{" "}
        · Accent:{" "}
        <span className="text-[var(--brand-accent)] font-semibold">this</span>
      </p>

      <div className="mt-6 grid gap-2">
        <a className="underline" href="/tenant-test?tenant=acme">
          Switch to ACME (dev)
        </a>
        <a className="underline" href="/tenant-test?tenant=bravo">
          Switch to BRAVO (dev)
        </a>
      </div>
    </main>
  );
}
