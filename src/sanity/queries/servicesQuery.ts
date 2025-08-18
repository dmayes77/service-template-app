import { groq } from "next-sanity";

export const servicesQuery = groq`
*[_type == "service" && coalesce(enabled, true) == true]
| order(coalesce(order, 999), name asc){
  name,
  "slug": slug.current,
  description,
  "imageUrl": imageRef->image.asset->url,
  "imageAlt": coalesce(imageRef->image.alt, name)
}
`;
