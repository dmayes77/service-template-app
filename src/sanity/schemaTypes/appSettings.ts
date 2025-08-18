// src/sanity/schemaTypes/appSettings.ts
import { defineType, defineField } from "sanity";

const appSettings = defineType({
  name: "appSettings",
  title: "App Settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand name", type: "string" }),
    defineField({
      name: "themeTint",
      title: "Brand tint (hex)",
      type: "string",
      description: "Example: #0A84FF",
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex" }).error(
          "Enter a valid hex color like #0A84FF"
        ),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    // Install Gate / Splash configuration
    defineField({
      name: "splash",
      title: "Install Gate / Splash",
      type: "object",
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
          options: { hotspot: true },
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
          hidden: ({ parent }: { parent?: { useVideo?: boolean } }) =>
            !parent?.useVideo,
        }),
      ],
    }),
  ],
});

export default appSettings;
export { appSettings };
