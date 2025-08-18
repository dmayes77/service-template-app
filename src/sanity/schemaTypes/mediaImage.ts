import { defineType, defineField } from "sanity";

const mediaImage = defineType({
  name: "mediaImage",
  title: "Media / Images",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (R) => R.required().min(2),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (R) => R.required().min(4),
        }),
        defineField({ name: "credit", title: "Credit", type: "string" }),
        defineField({ name: "license", title: "License", type: "string" }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hero", value: "hero" },
          { title: "Gallery", value: "gallery" },
          { title: "Logo/Branding", value: "brand" },
          { title: "Service Thumbnail", value: "service-thumb" },
          { title: "UI/Background", value: "ui" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "showInGallery",
      title: "Show in Gallery",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "priority",
      title: "Priority (lower = earlier)",
      type: "number",
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", media: "image", subtitle: "category" } },
});

export default mediaImage;
