import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  bySlug,
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
    listSearchableFields: ["title", "authors", "venue", "area"],
    preview: bySlug("/research"),
  },
  access: { read: publishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  hooks: { beforeChange: [setYearFromDate] },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { placeholder: "e.g. Prevalence of anaemia in medical students" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Details",
          fields: [
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
                  label: "Status",
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
                {
                  name: "role",
                  type: "text",
                  admin: { placeholder: "e.g. Principal investigator" },
                },
                { name: "institution", type: "text" },
                { name: "area", label: "Research area", type: "text" },
              ],
            },
            {
              name: "summary",
              type: "textarea",
              admin: { description: "One or two sentences shown in lists." },
            },
            {
              name: "abstract",
              label: "Description / abstract",
              type: "richText",
            },
          ],
        },
        {
          label: "Publication",
          description:
            "Fill in what applies once the work is presented or published.",
          fields: [
            {
              name: "authors",
              type: "text",
              admin: { placeholder: "e.g. Asjad N, Khan A, Ahmed S" },
            },
            {
              name: "venue",
              label: "Conference or journal",
              type: "text",
            },
            {
              type: "row",
              fields: [
                {
                  name: "doi",
                  label: "DOI",
                  type: "text",
                  admin: { placeholder: "10.1234/abcd.5678" },
                },
                {
                  name: "link",
                  label: "External link",
                  type: "text",
                  admin: { placeholder: "https://" },
                },
              ],
            },
            pdfField("pdf", "PDF"),
          ],
        },
      ],
    },
    slugField(),
    yearField,
  ],
};
