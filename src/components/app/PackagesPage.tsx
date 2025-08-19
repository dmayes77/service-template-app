// src/components/app/PackagesPage.tsx
import MediaCardLink from "@/components/ui/Card";

export type Pkg = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  priceUnit?: "flat" | "from" | "per-window" | "per-sqft" | string;
  durationMinutes?: number;
  featured?: boolean;
  badge?: string;
  service?: { _id?: string; name?: string; slug?: string };
  imageUrl?: string;
  imageAlt?: string;
};

export default function PackagesPage({ packages }: { packages: Pkg[] }) {
  return (
    <section className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-4">
      <h1 className="sr-only">Packages</h1>
      <ul className="grid gap-3">
        {packages.map((p) => (
          <li key={p._id}>
            <MediaCardLink
              href={`/packages/${p.slug}`}
              title={p.name}
              description={p.description ?? ""}
              media={{
                src: p.imageUrl ?? "",
                alt: p.imageAlt ?? p.name,
                aspectClass: "aspect-video",
                fit: "cover",
              }}
              mediaFraction={0.25}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
