// src/app/(app)/packages/[slug]/page.tsx
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import PackageDetail, {
  PackageDetailDoc,
} from "@/components/app/PackageDetail";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    groq`*[_type == "servicePackage" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const data = await client.fetch(
    groq`*[_type == "servicePackage" && slug.current == $slug][0]{name}`,
    { slug: params.slug }
  );
  return { title: data?.name || "Package" };
}

export default async function PackageDetailPage({ params }: Params) {
  const data = await client.fetch<PackageDetailDoc | null>(
    groq`
      *[_type == "servicePackage" && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
        description,
        mainDescription,
        price,
        priceUnit,
        durationMinutes,
        includes,
        // ⬇️ project URL + dims + alt directly
        "imageUrl": image.asset->url,
        "w": image.asset->metadata.dimensions.width,
        "h": image.asset->metadata.dimensions.height,
        "imageAlt": coalesce(image.alt, name),
        tieredPricing,
        badge,
        service->{ _id, name, "slug": slug.current }
      }
    `,
    { slug: params.slug }
  );

  if (!data) return notFound();
  return <PackageDetail pkg={data} />;
}
