// src/app/(app)/gallery/page.tsx
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { galleryImagesQuery } from "@/sanity/queries/galleryImagesQuery";

export const revalidate = 60;

type GalleryItem = {
  _id: string;
  title?: string;
  alt?: string;
  imageUrl: string;
  w: number;
  h: number;
};

const isDev = process.env.NODE_ENV !== "production";

export default async function GalleryPage() {
  const items = await client.fetch<GalleryItem[]>(galleryImagesQuery);

  return (
    <section className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-4">
      <h1 className="sr-only">Gallery</h1>
      <ul className="grid grid-cols-2 gap-3">
        {items.map(({ _id, imageUrl, alt, w, h, title }) => (
          <li key={_id} className="overflow-hidden rounded-xl bg-slate-200">
            <Image
              src={imageUrl}
              alt={alt || title || "Gallery image"}
              width={w || 1200}
              height={h || 800}
              className="h-auto w-full object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              {...(isDev ? { unoptimized: true } : {})}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
