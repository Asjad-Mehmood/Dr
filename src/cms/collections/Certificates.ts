import type { CollectionConfig } from "payload";
import { editorOnly, publicPublishedOrLoggedIn } from "../access";
import {
  bySlug,
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
    listSearchableFields: ["title", "issuer", "course"],
    description:
      "Upload a photo of the certificate (shown on the website) and the original PDF. Mark it private to keep it only in the admin.",
    preview: bySlug("/certificates"),
  },
  access: { read: publicPublishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  hooks: { beforeChange: [setYearFromDate] },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { placeholder: "e.g. Basic Life Support Workshop" },
    },
    {
      type: "row",
      fields: [
        {
          name: "issuer",
          label: "Issuing organisation",
          type: "text",
          admin: { placeholder: "e.g. CPMC Skills Lab" },
        },
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
      admin: { description: "The event where this certificate was received." },
    },
    categoryField("certificates"),
    visibilityField,
    slugField(),
    yearField,
  ],
};
