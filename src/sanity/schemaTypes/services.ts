// src/sanity/schemaTypes/service.ts
import { defineField, defineType } from "sanity";

const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (R) => R.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (v: string) =>
          v
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description (≤120 chars, one sentence, no period)",
      type: "string",
      validation: (R) => R.required().max(120),
    }),

    // Keep your reference for structured reuse
    defineField({
      name: "imageRef",
      title: "Image (managed in Media / Images)",
      type: "reference",
      to: [{ type: "mediaImage" }],
      options: { filter: "coalesce(archived, false) == false" },
      validation: (R) => R.required(),
    }),

    // Add a lightweight thumbnail for list previews
    defineField({
      name: "thumb",
      title: "Thumbnail (for list preview)",
      type: "image",
      options: { hotspot: true },
      description:
        "Use “Select from library” to pick the same asset as your Image above (no re-upload).",
    }),

    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
      media: "thumb", // ← guaranteed to render in list
    },
  },
});

export default service;
