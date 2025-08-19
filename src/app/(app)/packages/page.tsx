// src/app/(app)/packages/page.tsx
import { client } from "@/sanity/lib/client";
import {
  packagesQuery,
  packagesByServiceSlugQuery,
} from "@/sanity/queries/packagesQuery";
import PackagesPage, { Pkg } from "@/components/app/PackagesPage";

export const revalidate = 60;

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = sp.service;
  const service =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  const packages: Pkg[] = service
    ? await client.fetch<Pkg[]>(packagesByServiceSlugQuery, { slug: service })
    : await client.fetch<Pkg[]>(packagesQuery);

  return <PackagesPage packages={packages} />;
}
