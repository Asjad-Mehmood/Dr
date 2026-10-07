import type { CollectionConfig } from "payload";
import { editorOnly, publicPublishedOrLoggedIn } from "../access";
import {
  categoryField,
  dateField,
  pdfField,
  setYearFromDate,
  slugField,
  visibilityField,
  yearField,
} from "../fields";

export const Certificates: CollectionConfig = {
  slug: "certificates",
  admin: {
    useAsTitle: "title",
    group: "Achievements",
    defaultColumns: ["title", "issuer", "date", "visibility", "_status"],
  },
  access: { read: publicPublishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  hooks: { beforeChange: [setYearFromDate] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "issuer", label: "Issuing organisation", type: "text" },
        dateField(),
      ],
    },
    { name: "course", label: "Event / course", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "preview",
      label: "Certificate image",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    pdfField("file", "Original PDF"),
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
    },
    categoryField("certificates"),
    visibilityField,
    slugField(),
    yearField,
  ],
};
