// src/sanity/schemaTypes/services.ts
import { defineField, defineType } from "sanity";
import { mediaAssetSource } from "sanity-plugin-media";

export const services = defineType({
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
      title: "Description (≤120 chars)",
      type: "string",
      validation: (R) => R.required().max(120),
    }),

    // ⬇️ direct image
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true, sources: [mediaAssetSource] },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (R) => R.required().min(4),
        }),
      ],
      validation: (R) => R.required(),
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
    select: { title: "name", media: "image", subtitle: "slug.current" },
  },
});
