// src/sanity/schemaTypes/appSettings.ts
import { defineType, defineField } from "sanity";
import hoursEntry from "./objects/hoursEntry";
import { mediaAssetSource } from "sanity-plugin-media";

const appSettings = defineType({
  name: "appSettings",
  title: "App Settings",
  type: "document",
  fields: [
    // ===== Brand ============================================================
    defineField({
      name: "brand",
      title: "Brand",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "name",
          title: "Brand name",
          type: "string",
          validation: (R) => R.required(),
        }),
        defineField({ name: "tagline", title: "Tagline", type: "string" }),
        defineField({
          name: "logos",
          title: "Logos",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({
              name: "main",
              title: "Main Logo",
              type: "image",
              options: { hotspot: true, sources: [mediaAssetSource] },
              fields: [{ name: "alt", title: "Alt text", type: "string" }],
            }),
            defineField({
              name: "badge",
              title: "Badge (optional)",
              type: "image",
              options: { hotspot: true, sources: [mediaAssetSource] },
              fields: [{ name: "alt", title: "Alt text", type: "string" }],
            }),
            defineField({
              name: "mark",
              title: "Logo Mark (favicon/app)",
              type: "image",
              options: { hotspot: true, sources: [mediaAssetSource] },
              fields: [{ name: "alt", title: "Alt text", type: "string" }],
            }),
          ],
        }),
        defineField({
          name: "themeTint",
          title: "Brand tint (hex)",
          type: "string",
          description: "Example: #0A84FF",
        }),
      ],
    }),

    // ===== Business =========================================================
    defineField({
      name: "business",
      title: "Business",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "website", title: "Website", type: "url" }),
        defineField({
          name: "address",
          title: "Address",
          type: "object",
          fields: [
            defineField({ name: "street", title: "Street", type: "string" }),
            defineField({ name: "city", title: "City", type: "string" }),
            defineField({ name: "state", title: "State", type: "string" }),
            defineField({ name: "zip", title: "Zip", type: "string" }),
            defineField({ name: "country", title: "Country", type: "string" }),
            defineField({
              name: "latitude",
              title: "Latitude",
              type: "number",
            }),
            defineField({
              name: "longitude",
              title: "Longitude",
              type: "number",
            }),
            defineField({ name: "mapUrl", title: "Map URL", type: "url" }),
          ],
        }),
        defineField({
          name: "isServiceAreaBusiness",
          title: "Service-area business",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "serviceCenter",
          title: "Service Area Center (lat/lng)",
          type: "object",
          fields: [
            defineField({
              name: "latitude",
              title: "Latitude",
              type: "number",
            }),
            defineField({
              name: "longitude",
              title: "Longitude",
              type: "number",
            }),
          ],
        }),
        defineField({
          name: "serviceRadiusMiles",
          title: "Service Radius (miles)",
          type: "number",
        }),
        defineField({
          name: "hoursSpec",
          title: "Opening Hours",
          type: "array",
          of: [{ type: "hoursEntry" }],
        }),
        defineField({
          name: "socials",
          title: "Socials",
          type: "object",
          fields: [
            defineField({ name: "google", title: "Google", type: "url" }),
            defineField({ name: "facebook", title: "Facebook", type: "url" }),
            defineField({ name: "instagram", title: "Instagram", type: "url" }),
            defineField({ name: "twitter", title: "Twitter/X", type: "url" }),
            defineField({ name: "youtube", title: "YouTube", type: "url" }),
            defineField({ name: "tiktok", title: "TikTok", type: "url" }),
          ],
        }),
        defineField({
          name: "priceRange",
          title: "Price Range",
          type: "string",
          initialValue: "$$$",
        }),
        defineField({
          name: "areaServed",
          title: "Area Served",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "bookingUrl", title: "Booking URL", type: "url" }),
        defineField({
          name: "privacyPolicyUrl",
          title: "Privacy Policy URL",
          type: "url",
        }),
        defineField({
          name: "termsOfServiceUrl",
          title: "Terms of Service URL",
          type: "url",
        }),
        defineField({
          name: "designCompany",
          title: "Design/Developer",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),

    // ===== Splash ============================================================
    defineField({
      name: "splash",
      title: "Install Gate / Splash",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "useVideo",
          title: "Use video background",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "bgImage",
          title: "Background image",
          type: "image",
          options: { hotspot: true, sources: [mediaAssetSource] },
          hidden: ({ parent }: { parent?: { useVideo?: boolean } }) =>
            !!parent?.useVideo,
        }),
        defineField({
          name: "videoWebm",
          title: "Video (WebM)",
          type: "file",
          options: { accept: "video/webm" },
          hidden: ({ parent }: { parent?: { useVideo?: boolean } }) =>
            !parent?.useVideo,
        }),
        defineField({
          name: "videoMp4",
          title: "Video (MP4)",
          type: "file",
          options: { accept: "video/mp4" },
          hidden: ({ parent }: { parent?: { useVideo?: boolean } }) =>
            !parent?.useVideo,
        }),
        defineField({
          name: "videoPoster",
          title: "Video poster",
          type: "image",
          options: { hotspot: true, sources: [mediaAssetSource] },
          hidden: ({ parent }: { parent?: { useVideo?: boolean } }) =>
            !parent?.useVideo,
        }),
      ],
    }),

    // ===== SEO ===============================================================
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          options: { hotspot: true, sources: [mediaAssetSource] },
        }),
        defineField({ name: "canonical", title: "Canonical URL", type: "url" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "App Settings" }) },
});

export default appSettings;
