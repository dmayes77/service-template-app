import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-3xl px-4">
      <h1 className="mb-2 text-2xl font-semibold">Gallery</h1>
      <p className="text-gray-600">
        Before & afters and recent work (coming soon).
      </p>
    </section>
  );
}
