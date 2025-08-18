import { defineType, defineField, defineArrayMember } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo (center circle)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "background",
      title: "Background image (full screen)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quickLinks",
      title: "Buttons (exactly 3)",
      type: "array",
      validation: (Rule) => Rule.required().min(3).max(3),
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
                R.required()
                  .regex(/^\/[^\s]*$/, { name: "path" })
                  .error("Start with /"),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Book (Calendar)", value: "calendar-check" },
                  { title: "Packages", value: "package" },
                  { title: "Gallery", value: "images" },
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
