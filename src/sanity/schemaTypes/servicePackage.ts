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
      name: "mainDescription",
      title: "Main description (≤ 360 chars)",
      type: "string",
      validation: (R) => R.required().max(360),
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
    defineField({
      name: "image",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
        sources: [mediaAssetSource],
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
      name: "includes",
      title: "What’s included",
      type: "array",
      of: [{ type: "string" }],
      options: { sortable: true },
      validation: (R) => R.max(12),
    }),
    // ✅ New: Tiered Pricing Matrix for Tint + Size
    defineField({
      name: "tieredPricing",
      title: "Tint + Size Pricing Matrix",
      type: "array",
      description: "Set prices based on tint type and vehicle size.",
      of: [
        defineField({
          name: "tier",
          type: "object",
          fields: [
            defineField({
              name: "tintType",
              title: "Tint Type",
              type: "string",
              options: {
                list: [
                  { title: "Carbon", value: "carbon" },
                  { title: "Ceramic", value: "ceramic" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "vehicleSize",
              title: "Vehicle Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                  { title: "Extra Large", value: "xl" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              validation: (R) => R.required().min(0),
            }),
            defineField({
              name: "label",
              title: "Price Label",
              type: "string",
              options: {
                list: [
                  { title: "Flat", value: "flat" },
                  { title: "From", value: "from" },
                  { title: "Per window", value: "per-window" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "from",
            }),
            defineField({
              name: "note",
              title: "Note (optional)",
              type: "string",
            }),
          ],
          preview: {
            select: {
              tintType: "tintType",
              vehicleSize: "vehicleSize",
              price: "price",
            },
            prepare({ tintType, vehicleSize, price }) {
              return {
                title: `${tintType?.toUpperCase()} · ${vehicleSize?.toUpperCase()}`,
                subtitle: price != null ? `$${price}` : "No price",
              };
            },
          },
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
      subtitle: "service.name",
      media: "image",
    },
  },
});
