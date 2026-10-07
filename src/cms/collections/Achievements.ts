import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  categoryField,
  dateField,
  setYearFromDate,
  slugField,
  yearField,
} from "../fields";

export const Achievements: CollectionConfig = {
  slug: "achievements",
  admin: {
    useAsTitle: "title",
    group: "Achievements",
    defaultColumns: ["title", "category", "date", "_status"],
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
        dateField(),
        { name: "awardedBy", label: "Awarded by", type: "text" },
      ],
    },
    { name: "summary", type: "textarea" },
    { name: "details", type: "richText" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    { name: "certificate", type: "relationship", relationTo: "certificates" },
    { name: "event", type: "relationship", relationTo: "events" },
    categoryField("achievements"),
    slugField(),
    yearField,
  ],
};
