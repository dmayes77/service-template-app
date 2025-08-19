// src/app/(app)/packages/[slug]/page.tsx
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import PackageDetail, {
  PackageDetailDoc,
} from "@/components/app/PackageDetail";

export const revalidate = 60;

// Static params for SSG
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    groq`*[_type == "servicePackage" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// Head metadata — NOTE: await params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await client.fetch<{ name?: string }>(
    groq`*[_type == "servicePackage" && slug.current == $slug][0]{name}`,
    { slug }
  );
  return { title: data?.name ?? "Package" };
}

// Page — NOTE: await params
export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await client.fetch<PackageDetailDoc | null>(
    groq`
      *[_type == "servicePackage" && slug.current == $slug][0]{
        _id,
        name,
        slug,                     // keep object shape {current}
        description,
        mainDescription,
        price,
        priceUnit,
        durationMinutes,
        includes,
        "imageUrl": image.asset->url,
        "imageAlt": coalesce(image.alt, name),
        tieredPricing,
        badge
      }
    `,
    { slug }
  );

  if (!data) notFound();
  return <PackageDetail pkg={data} />;
}
