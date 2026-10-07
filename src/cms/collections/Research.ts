import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  dateField,
  pdfField,
  setYearFromDate,
  slugField,
  yearField,
} from "../fields";

export const researchTypes = [
  { label: "Research project", value: "project" },
  { label: "Case report", value: "case-report" },
  { label: "Research poster", value: "poster" },
  { label: "Presentation", value: "presentation" },
  { label: "Publication", value: "publication" },
  { label: "Conference", value: "conference" },
];

export const Research: CollectionConfig = {
  slug: "research",
  labels: { singular: "Research item", plural: "Research & publications" },
  admin: {
    useAsTitle: "title",
    group: "Achievements",
    defaultColumns: ["title", "type", "researchStatus", "date", "_status"],
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
        {
          name: "type",
          type: "select",
          required: true,
          defaultValue: "project",
          options: researchTypes,
        },
        {
          name: "researchStatus",
          type: "select",
          defaultValue: "ongoing",
          options: [
            { label: "Ongoing", value: "ongoing" },
            { label: "Completed", value: "completed" },
            { label: "Presented", value: "presented" },
            { label: "Published", value: "published" },
          ],
        },
        dateField(),
      ],
    },
    {
      type: "row",
      fields: [
        { name: "role", type: "text" },
        { name: "institution", type: "text" },
        { name: "area", label: "Research area", type: "text" },
      ],
    },
    { name: "authors", type: "text" },
    {
      name: "venue",
      label: "Conference or journal",
      type: "text",
    },
    {
      type: "row",
      fields: [
        { name: "doi", label: "DOI", type: "text" },
        { name: "link", label: "External link", type: "text" },
      ],
    },
    { name: "summary", type: "textarea" },
    { name: "abstract", label: "Description / abstract", type: "richText" },
    pdfField("pdf", "PDF"),
    slugField(),
    yearField,
  ],
};
