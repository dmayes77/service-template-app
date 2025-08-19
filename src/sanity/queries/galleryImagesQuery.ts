// src/sanity/queries/galleryImagesQuery.ts
export const galleryImagesQuery = /* groq */ `
*[
  _type == "sanity.imageAsset" &&
  references(*[_type == "media.tag" && lower(name.current) == "gallery"]._id)
]
| order(_createdAt desc) {
  _id,
  "imageUrl": url,
  "w": metadata.dimensions.width,
  "h": metadata.dimensions.height,
  "alt": coalesce(altText, originalFilename)
}
`;
