export const galleryImagesQuery = `
*[_type == "mediaImage" && coalesce(showInGallery, false) && !coalesce(archived, false)]
| order(coalesce(priority, 999), _createdAt desc){
  _id,
  title,
  "alt": coalesce(image.alt, title),
  "imageUrl": image.asset->url,
  "w": image.asset->metadata.dimensions.width,
  "h": image.asset->metadata.dimensions.height
}
`;
