import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  categoryField,
  dateField,
  photosField,
  setYearFromDate,
  slugField,
  videoFields,
  yearField,
} from "../fields";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    group: "Activities",
    defaultColumns: ["title", "category", "date", "_status"],
    description:
      "College events, seminars, workshops, conferences, sports and more. Events with a future date appear as upcoming; past events move to the archive automatically.",
  },
  access: { read: publishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  hooks: { beforeChange: [setYearFromDate] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        dateField("date", "Date", true),
        dateField("endDate", "End date"),
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text" },
        { name: "role", label: "Naima's role", type: "text" },
      ],
    },
    { name: "summary", type: "textarea" },
    { name: "description", type: "richText" },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    photosField(),
    ...videoFields,
    {
      name: "certificates",
      type: "relationship",
      relationTo: "certificates",
      hasMany: true,
    },
    categoryField("events"),
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    slugField(),
    yearField,
  ],
};
