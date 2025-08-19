import { groq } from "next-sanity";

// All packages, featured first, then order, then name.
// Works whether your schema uses `image` (asset field) or legacy `imageRef->image`.
export const packagesQuery = groq`
*[_type == "servicePackage" && coalesce(enabled, true)]
| order(featured desc, coalesce(order, 999), name asc) {
  _id,
  name,
  "slug": slug.current,
  // force strings so TS props that expect string don't get undefined
  "description": coalesce(description, ""),
  price,
  priceUnit,
  durationMinutes,
  featured,
  badge,
  "service": service->{
    _id,
    name,
    "slug": slug.current
  },
  // support both shapes
  "imageUrl": coalesce(image.asset->url, imageRef->image.asset->url),
  "imageAlt": coalesce(image.alt, imageRef->image.alt, name)
}
`;

// Filter by service slug (?service=auto-tint)
export const packagesByServiceSlugQuery = groq`
*[
  _type == "servicePackage" &&
  coalesce(enabled, true) &&
  service->slug.current == $slug
]
| order(featured desc, coalesce(order, 999), name asc) {
  _id,
  name,
  "slug": slug.current,
  "description": coalesce(description, ""),
  price,
  priceUnit,
  durationMinutes,
  featured,
  badge,
  "service": service->{
    _id,
    name,
    "slug": slug.current
  },
  "imageUrl": coalesce(image.asset->url, imageRef->image.asset->url),
  "imageAlt": coalesce(image.alt, imageRef->image.alt, name)
}
`;

export const packageBySlugQuery = groq`
*[_type == "servicePackage" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  description,
  badge,
  featured,
  price,
  priceUnit,
  durationMinutes,
  // optional tiered structures (any that exist will resolve)
  vehicleSizes[]{label, price},
  pricingTiers[]{label, price},
  priceBySize{small, medium, large, xl},
  includes,
  "imageUrl": image.asset->url,
  "w": image.asset->metadata.dimensions.width,
  "h": image.asset->metadata.dimensions.height,
  service->{
    _id, name, "slug": slug.current
  }
}
`;

