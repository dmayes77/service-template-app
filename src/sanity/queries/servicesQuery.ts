// src/sanity/queries/servicesQuery.ts
import { groq } from "next-sanity";

export const servicesQuery = groq`
*[_type == "service" && coalesce(enabled, true)]
| order(coalesce(order, 999), name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  "imageAlt": coalesce(image.alt, name)
}
`;
