import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  dateField,
  numbersVerifiedField,
  pdfField,
  photosField,
  privacyGroup,
  videoFields,
} from "../fields";

export const MedicalCamps: CollectionConfig = {
  slug: "medical-camps",
  labels: { singular: "Medical camp", plural: "Annual medical camps" },
  admin: {
    useAsTitle: "year",
    group: "Activities",
    defaultColumns: ["year", "edition", "campStatus", "date", "_status"],
    description:
      "The Annual Free Medical Camp — one record per year. Impact totals on the website are calculated from these records.",
  },
  access: { read: publishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "year",
  fields: [
    {
      type: "row",
      fields: [
        { name: "year", type: "number", required: true, unique: true },
        { name: "edition", type: "number", required: true },
        {
          name: "campStatus",
          type: "select",
          defaultValue: "planned",
          options: [
            { label: "Planned", value: "planned" },
            { label: "Held", value: "held" },
          ],
        },
      ],
    },
    {
      name: "title",
      type: "text",
      admin: {
        description:
          "Leave empty to use the series title from Page texts → Medical camps, followed by the year.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Details",
          fields: [
            {
              type: "row",
              fields: [dateField(), { name: "location", type: "text" }],
            },
            { name: "organizedBy", label: "Organised by", type: "text" },
            {
              name: "team",
              label: "Medical team",
              labels: { singular: "Team member", plural: "Medical team" },
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "role", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "services",
              label: "Medical services",
              type: "array",
              fields: [{ name: "name", type: "text", required: true }],
            },
            {
              name: "awareness",
              label: "Health awareness topics",
              type: "array",
              fields: [{ name: "topic", type: "text", required: true }],
            },
            {
              name: "medicinesSupport",
              label: "Medicines / support",
              type: "textarea",
            },
            {
              name: "sponsors",
              label: "Sponsors / supporters",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "url", label: "Website", type: "text" },
                  ],
                },
              ],
            },
            { name: "summary", type: "textarea" },
            { name: "story", label: "Report / story", type: "richText" },
          ],
        },
        {
          label: "Impact",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "patientsServed",
                  label: "Patients served",
                  type: "number",
                  min: 0,
                },
                { name: "doctors", type: "number", min: 0 },
                { name: "volunteers", type: "number", min: 0 },
              ],
            },
            numbersVerifiedField,
          ],
        },
        {
          label: "Media & documents",
          fields: [
            photosField(),
            ...videoFields,
            pdfField("certificate", "Certificate / recognition"),
            pdfField("report", "Annual report"),
            privacyGroup,
          ],
        },
      ],
    },
  ],
};
