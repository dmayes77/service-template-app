// src/sanity/queries/homePageQuery.ts
import { groq } from "next-sanity";

export const homePageQuery = groq`
*[_type == "homePage"][0]{
  "logoUrl": logo.asset->url,
  "bgUrl": background.asset->url,
  "quickLinks": quickLinks[]{ label, href, icon }
}
`;
