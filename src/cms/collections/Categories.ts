import type { CollectionConfig } from "payload";
import { editorOnly } from "../access";
import { slugField } from "../fields";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    group: "Settings",
    defaultColumns: ["title", "section", "order"],
    description:
      "The categories used to organise events, certificates, achievements and the gallery.",
  },
  access: { read: () => true, ...editorOnly },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "section",
      type: "select",
      required: true,
      options: [
        { label: "Events", value: "events" },
        { label: "Certificates", value: "certificates" },
        { label: "Achievements", value: "achievements" },
        { label: "Gallery", value: "gallery" },
      ],
    },
    { name: "description", type: "textarea" },
    {
      name: "academic",
      label: "Academic development",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Events in this category (workshops, seminars, conferences…) are listed on the Academic page and counted as “Workshops & Seminars”.",
        condition: (data) => data?.section === "events",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers come first." },
    },
    slugField(),
  ],
};
