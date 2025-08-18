import { groq } from "next-sanity";
// full business info
export const businessInfoQuery = groq`*[_type=="appSettings"][0]{
  brand{ name, tagline, "logoUrl": logos.main->image.asset->url },
  business{
    description, phone, email, website, address, isServiceAreaBusiness,
    serviceCenter, serviceRadiusMiles, hoursSpec, socials, priceRange,
    areaServed, bookingUrl, privacyPolicyUrl, termsOfServiceUrl, designCompany
  },
  seo{ title, description, "ogImageUrl": ogImage.asset->url, canonical }
}`;
