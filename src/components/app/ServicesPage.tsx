"use client";

import MediaCardLink from "@/components/ui/Card";

export type ServiceDoc = {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
};

type Props = { services: ServiceDoc[] };

export default function ServicePage({ services }: Props) {
  return (
    <section className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-4">
      <header className="mb-4 rounded-2xl bg-gradient-to-b from-black/40 to-black/20 p-4 text-white ring-1 ring-white/10">
        <h1 className="text-xl font-semibold tracking-[-0.01em]">
          Window Tint & Wraps
        </h1>
        <p className="mt-1 text-sm text-white/80">
          Heat rejection, privacy, and long-term protection—professionally
          installed for cars, homes, and businesses.
        </p>
      </header>

      {services?.length ? (
        <ul className="grid gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              <MediaCardLink
                href={`/packages?service=${encodeURIComponent(s.slug)}`}
                title={s.name}
                description={s.description}
                media={
                  s.imageUrl
                    ? {
                        src: s.imageUrl,
                        alt: s.imageAlt ?? s.name,
                        aspectClass: "aspect-video",
                        fit: "cover",
                      }
                    : undefined
                }
                mediaFraction={0.25}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
          No services yet. Add some in Studio → <strong>Service</strong>.
        </div>
      )}
    </section>
  );
}
