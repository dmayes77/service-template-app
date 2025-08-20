import { tenantSanityClient } from "@/lib/sanity";

type QuickLink = { label: string; href: string; icon: string };
type HomePageDoc = {
  _id: string;
  _type: "homePage";
  logo?: { src?: string; alt?: string };
  background?: { src?: string };
  quickLinks?: QuickLink[];
};

export default async function SanityTest() {
  try {
    const client = await tenantSanityClient();

    // Query your "homePage" type and project image URLs directly from the asset
    const doc = await client.fetch<HomePageDoc | null>(/* groq */ `
      *[_type == "homePage"][0]{
        _id,
        _type,
        "logo": {
          "src": logo.asset->url,
          "alt": coalesce(logo.alt, "Logo")
        },
        "background": {
          "src": background.asset->url
        },
        "quickLinks": quickLinks[]{
          label, href, icon
        }
      }
    `);

    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-semibold mb-4">Sanity Probe (homePage)</h1>
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(doc ?? { note: "No 'homePage' doc yet" }, null, 2)}
        </pre>
      </main>
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Sanity error";
    return <pre className="p-6 text-sm text-red-600">{msg}</pre>;
  }
}
