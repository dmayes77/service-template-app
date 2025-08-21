// src/app/(app)/packages/[slug]/page.tsx
import { notFound } from "next/navigation";
import { clientSafe as client } from "@/sanity/lib/client";
// import your GROQ here, e.g.:
// import { packageBySlugQuery } from "@/sanity/queries/packageBySlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

type Pkg = {
  _id: string;
  title: string;
  slug?: { current: string };
  // add whatever fields you need
};

export default async function PackagePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Replace with your query and params:
  // const data = await client.fetch<Pkg | null>(packageBySlugQuery, { slug });
  const data = await client.fetch<Pkg | null>(
    "*[_type == 'package' && slug.current == $slug][0]",
    { slug }
  );

  if (!data) notFound();

  // TODO: render your real UI here
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      {/* ...rest of your detail view... */}
    </main>
  );
}
