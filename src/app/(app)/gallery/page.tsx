// src/app/(app)/gallery/page.tsx
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { galleryImagesQuery } from "@/sanity/queries/galleryImagesQuery";

export const revalidate = 60;

type GalleryItem = {
  _id: string;
  title?: string | null;
  alt?: string | null;
  imageUrl: string;
  w?: number | null;
  h?: number | null;
  lqip?: string | null; // include in query if you want blur placeholders
};

const isDev = process.env.NODE_ENV !== "production";

export default async function GalleryPage() {
  const items = await client.fetch<GalleryItem[]>(galleryImagesQuery);

  if (!items?.length) {
    return (
      <section className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-4">
        <h1 className="sr-only">Gallery</h1>
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          No gallery images yet. Tag some assets “gallery” in the Media Library.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-4">
      <h1 className="sr-only">Gallery</h1>

      {/* Masonry-like columns with balanced fill */}
      <ul className="columns-2 gap-3 [column-fill:_balance] sm:columns-3">
        {items.map(({ _id, imageUrl, alt, title, w, h, lqip }) => {
          const width = w ?? 1200;
          const height = h ?? Math.round((width * 2) / 3); // fallback ~3:2
          return (
            <li
              key={_id}
              className="mb-3 break-inside-avoid overflow-hidden rounded-xl bg-slate-200"
            >
              <Image
                src={imageUrl}
                alt={alt || title || "Gallery image"}
                width={width}
                height={height}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                {...(lqip
                  ? { placeholder: "blur" as const, blurDataURL: lqip }
                  : {})}
                {...(isDev ? { unoptimized: true } : {})}
                loading="lazy"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
