// src/sanity/queries/appSettingsQuery.ts
import { groq } from "next-sanity";

export const bookingUrlQuery = groq`
*[_type == "appSettings"][0]{ "bookingUrl": business.bookingUrl }
`;

export const appSettingsLiteQuery = groq`
*[_type == "appSettings" && _id == "appSettings"][0]{
  "brandName": coalesce(brand.name, "App"),
  "logoUrl": coalesce(
    brand.logos.badge.asset->url
  )
}
`;

export const appSettingsQuery = groq`
*[_type == "appSettings" && _id == "appSettings"][0]{
  "brandName": coalesce(brand.name, "App"),
  "themeTint": brand.themeTint,
  "logoUrl": coalesce(
    brand.logos.main.asset->url,
    brand.logos.mark.asset->url,
    brand.logos.badge.asset->url
  ),
  splash{
    useVideo,
    "bgImageUrl": bgImage.asset->url,
    "posterUrl":  videoPoster.asset->url,
    "webmUrl":    videoWebm.asset->url,
    "mp4Url":     videoMp4.asset->url
  }
}
`;
