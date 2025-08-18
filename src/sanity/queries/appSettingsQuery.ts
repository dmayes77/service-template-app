// src/sanity/queries/appSettingsQuery.ts
import { groq } from "next-sanity";

export const appSettingsQuery = groq`
*[_type == "appSettings"][0]{
  "brandName": brand.name,
  themeTint,
  // main logo comes from mediaImage reference
  "logoUrl": brand.logos.main->image.asset->url,
  splash{
    useVideo,
    "bgImageUrl": bgImage.asset->url,
    "posterUrl": videoPoster.asset->url,
    "webmUrl": videoWebm.asset->url,
    "mp4Url":  videoMp4.asset->url
  }
}
`;

export const appSettingsLiteQuery = groq`
*[_type == "appSettings"][0]{
  "brandName": coalesce(brand.name, "App"),
  "logoUrl": brand.logos.main->image.asset->url
}
`;
