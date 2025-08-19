import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import PackageDetail, {
  PackageDetailDoc,
} from "@/components/app/PackageDetail";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    groq`*[_type == "servicePackage" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await client.fetch(
    groq`*[_type == "servicePackage" && slug.current == $slug][0]{name}`,
    { slug: params.slug }
  );
  return {
    title: data?.name || "Package",
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data: PackageDetailDoc = await client.fetch(
    groq`
      *[_type == "servicePackage" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        description,
        mainDescription,
        price,
        priceUnit,
        durationMinutes,
        includes,
        image{
          asset->{url},
          alt
        },
        tieredPricing,
        badge
      }
    `,
    { slug: params.slug }
  );

  if (!data) return notFound();

  return <PackageDetail pkg={data} />;
}
