import { defineType, defineField } from "sanity";

const DAYS = [
  { title: "Monday", value: "mon" },
  { title: "Tuesday", value: "tue" },
  { title: "Wednesday", value: "wed" },
  { title: "Thursday", value: "thu" },
  { title: "Friday", value: "fri" },
  { title: "Saturday", value: "sat" },
  { title: "Sunday", value: "sun" },
];

export default defineType({
  name: "hoursEntry",
  title: "Opening Hours",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day of week",
      type: "string",
      options: { list: DAYS, layout: "dropdown" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "closed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "opens",
      title: "Opens (HH:MM, 24h)",
      type: "string",
      hidden: ({ parent }) => !!parent?.closed,
      validation: (R) =>
        R.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "time" }).warning(
          "Use 24h HH:MM (e.g. 09:00, 18:30)"
        ),
    }),
    defineField({
      name: "closes",
      title: "Closes (HH:MM, 24h)",
      type: "string",
      hidden: ({ parent }) => !!parent?.closed,
      validation: (R) =>
        R.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "time" }).warning(
          "Use 24h HH:MM (e.g. 17:00, 19:30)"
        ),
    }),
  ],
  preview: {
    select: { day: "day", closed: "closed", opens: "opens", closes: "closes" },
    prepare({ day, closed, opens, closes }) {
      const titles = {
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday",
        sun: "Sunday",
      } as Record<string, string>;
      return {
        title: titles[day as string] ?? "Day",
        subtitle: closed
          ? "Closed"
          : `${opens ?? "09:00"}–${closes ?? "17:00"}`,
      };
    },
  },
});
