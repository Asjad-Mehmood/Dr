import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import { dateField, setYearFromDate, slugField, yearField } from "../fields";

export const Journal: CollectionConfig = {
  slug: "journal",
  labels: { singular: "Journal post", plural: "Medical journal" },
  admin: {
    useAsTitle: "title",
    group: "Media & Writing",
    defaultColumns: ["title", "topic", "date", "_status"],
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
        {
          name: "topic",
          type: "select",
          options: [
            { label: "Medical learning", value: "learning" },
            { label: "Research experience", value: "research" },
            { label: "Conference experience", value: "conference" },
            { label: "Community service", value: "community" },
            { label: "Healthcare awareness", value: "awareness" },
            { label: "Academic journey", value: "academic" },
            { label: "Professional development", value: "professional" },
          ],
        },
      ],
    },
    { name: "excerpt", type: "textarea" },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    { name: "content", type: "richText", required: true },
    slugField(),
    yearField,
  ],
};
