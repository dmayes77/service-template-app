// src/sanity/schemaTypes/homePage.ts
import { defineType, defineField, defineArrayMember } from "sanity";
import { mediaAssetSource } from "sanity-plugin-media";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true, sources: [mediaAssetSource] },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "background",
      title: "Background image",
      type: "image",
      options: { hotspot: true, sources: [mediaAssetSource] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "quickLinks",
      title: "Quick buttons (up to 3)",
      type: "array",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          name: "quickLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "href",
              title: "Link (start with /)",
              type: "string",
              validation: (R) =>
                R.required().regex(/^\/[^\s]*$/, { name: "path" }),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Calendar (Book)", value: "calendar-check" },
                  { title: "Package/Tag", value: "package" },
                  { title: "Gallery", value: "images" },
                  { title: "Sparkles", value: "sparkles" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "calendar-check",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href", icon: "icon" },
            prepare: ({
              title,
              subtitle,
              icon,
            }: {
              title?: string;
              subtitle?: string;
              icon?: string;
            }) => ({
              title: `${title ?? "Button"} (${icon ?? "calendar-check"})`,
              subtitle: subtitle ?? "",
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
