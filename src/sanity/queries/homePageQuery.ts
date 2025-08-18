import { groq } from "next-sanity";

export const homePageQuery = groq`
*[_type == "homePage"][0]{
  // Allow either a plain image field or a reference to mediaImage
  "backgroundUrl": coalesce(
    background.asset->url,
    backgroundRef->image.asset->url
  ),
  quickLinks[]{label, href, icon}
}
`;
