import { groq } from "next-sanity";

export const appSettingsQuery = /* groq */ `
*[_type == "appSettings"][0]{
  brandName,
  themeTint,
  "logoUrl": logo.asset->url,
  splash{
    useVideo,
    "bgImageUrl": bgImage.asset->url,
    "posterUrl": videoPoster.asset->url,
    "webmUrl": videoWebm.asset->url,
    "mp4Url":  videoMp4.asset->url
  }
}
`;

// Home page content
// src/sanity/queries.ts
export const homePageQuery = /* groq */ `
*[_type == "homePage"][0]{
  "logoUrl": logo.asset->url,
  "bgUrl": background.asset->url,
  quickLinks[]{ label, href, icon }
}
`;

export const appSettingsLiteQuery = /* groq */ `
*[_type == "appSettings"][0]{ brandName, "logoUrl": logo.asset->url }`;

export const servicesQuery = `
*[_type == "service" && (defined(enabled) => enabled != false) || !defined(enabled)]
| order(coalesce(order, 999), name asc) {
  name,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  "imageAlt": coalesce(image.alt, name)
}
`;
