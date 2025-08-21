// src/app/(app)/packages/[slug]/page.tsx
import { notFound } from "next/navigation";
import { clientSafe as client, groq } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

type Pkg = {
  _id: string;
  title: string;
  slug?: { current: string };
  // add any other fields you render
};

const packageBySlugQuery = groq`
  *[_type == "package" && slug.current == $slug][0]{
    _id,
    title,
    slug
  }
`;

export default async function PackagePage({
  params,
}: {
  // Next 15 types expect params to be a Promise
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await client.fetch<Pkg | null>(packageBySlugQuery, { slug });
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      {/* render the rest of your package details here */}
    </main>
  );
}
