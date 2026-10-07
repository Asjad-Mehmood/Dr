import type { CollectionConfig } from "payload";
import { editorOnly, publicOrLoggedIn } from "../access";
import { dateField, visibilityField } from "../fields";

export const Documents: CollectionConfig = {
  slug: "documents",
  admin: {
    useAsTitle: "title",
    group: "Media & Writing",
    defaultColumns: ["title", "type", "visibility", "date"],
    description:
      "CV, papers, reports and other documents. Private documents are kept for the record and never shown on the website.",
  },
  access: { read: publicOrLoggedIn, ...editorOnly },
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            { label: "CV", value: "cv" },
            { label: "Certificate", value: "certificate" },
            { label: "Research paper", value: "research-paper" },
            { label: "Report", value: "report" },
            { label: "Presentation", value: "presentation" },
            { label: "Conference document", value: "conference" },
            { label: "Award", value: "award" },
            { label: "Other", value: "other" },
          ],
        },
        dateField(),
      ],
    },
    { name: "description", type: "textarea" },
    { name: "file", type: "upload", relationTo: "media", required: true },
    { ...visibilityField, defaultValue: "private" },
  ],
};
