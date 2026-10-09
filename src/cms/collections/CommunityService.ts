import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  bySlug,
  dateField,
  numbersVerifiedField,
  pdfField,
  photosField,
  privacyGroup,
  setYearFromDate,
  slugField,
  videoFields,
  yearField,
} from "../fields";

export const communityTypes = [
  { label: "Free medical camp", value: "medical-camp" },
  { label: "Blood donation", value: "blood-donation" },
  { label: "Health awareness campaign", value: "health-awareness" },
  { label: "Community outreach", value: "outreach" },
  { label: "Patient welfare", value: "patient-welfare" },
  { label: "Volunteer work", value: "volunteer" },
];

export const CommunityService: CollectionConfig = {
  slug: "community",
  labels: { singular: "Community activity", plural: "Community service" },
  admin: {
    useAsTitle: "title",
    group: "Activities",
    defaultColumns: ["title", "type", "date", "location", "_status"],
    listSearchableFields: ["title", "location", "role", "organizer"],
    preview: bySlug("/community"),
    description:
      "Blood donation, health awareness, outreach, patient welfare and volunteer work. (The Annual Free Medical Camp has its own section.)",
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
      admin: { placeholder: "e.g. Blood Donation Drive at CPMC" },
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
                  options: communityTypes,
                },
                dateField(),
              ],
            },
            {
              type: "row",
              fields: [
                { name: "location", type: "text" },
                {
                  name: "role",
                  label: "Naima's role",
                  type: "text",
                  admin: { placeholder: "e.g. Volunteer, Organiser" },
                },
                { name: "organizer", label: "Organising team", type: "text" },
              ],
            },
            {
              name: "services",
              type: "array",
              labels: { singular: "Service", plural: "Services" },
              fields: [{ name: "name", type: "text", required: true }],
            },
            {
              name: "supporters",
              label: "Sponsors / supporters",
              type: "text",
            },
            {
              name: "summary",
              type: "textarea",
              admin: { description: "One or two sentences shown in lists." },
            },
            { name: "description", type: "richText" },
          ],
        },
        {
          label: "Impact",
          description: "Numbers appear on the website only when verified.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "peopleServed",
                  label: "People served",
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
          label: "Photos & documents",
          fields: [
            privacyGroup,
            photosField(),
            ...videoFields,
            pdfField("certificate", "Certificate"),
            pdfField("report", "Report"),
          ],
        },
      ],
    },
    slugField(),
    yearField,
  ],
};
