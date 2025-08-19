// src/sanity/schemaTypes/servicePackage.ts
import { defineType, defineField } from "sanity";
import { mediaAssetSource } from "sanity-plugin-media";

export default defineType({
  name: "servicePackage",
  title: "Package",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (R) => R.required().min(2).max(80),
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
      name: "service",
      title: "Service",
      type: "reference",
      to: [{ type: "service" }],
      validation: (R) => R.required(),
      options: { filter: "coalesce(enabled, true) == true" },
    }),
    defineField({
      name: "description",
      title: "Short description (≤ 120 chars)",
      type: "string",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Leave blank if variable.",
    }),
    defineField({
      name: "priceUnit",
      title: "Price label",
      type: "string",
      options: {
        list: [
          { title: "Flat", value: "flat" },
          { title: "From", value: "from" },
          { title: "Per window", value: "per-window" },
          { title: "Per sq ft", value: "per-sqft" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "from",
    }),
    defineField({
      name: "durationMinutes",
      title: "Estimated duration (minutes)",
      type: "number",
    }),

    // ✅ Single, direct image field with Media Library as a source
    defineField({
      name: "image",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
        sources: [mediaAssetSource], // <- Media Library picker
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (R) => R.min(4),
        }),
      ],
    }),

    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower shows first. Default sorts by name.",
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean" }),
    defineField({
      name: "badge",
      title: "Badge (optional)",
      type: "string",
      description: 'e.g., "Most Popular"',
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "service.name", // strings only; use name not the ref itself
      media: "image",
    },
  },
});
