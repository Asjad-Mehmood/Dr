import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
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
    defaultColumns: ["title", "type", "date", "_status"],
    description:
      "Blood donation, health awareness, outreach, patient welfare and volunteer work. (The Annual Free Medical Camp has its own section.)",
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
          options: communityTypes,
        },
        dateField(),
      ],
    },
    {
      type: "row",
      fields: [
        { name: "location", type: "text" },
        { name: "role", label: "Naima's role", type: "text" },
        { name: "organizer", label: "Organising team", type: "text" },
      ],
    },
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
    {
      name: "services",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "supporters", label: "Sponsors / supporters", type: "text" },
    { name: "summary", type: "textarea" },
    { name: "description", type: "richText" },
    photosField(),
    ...videoFields,
    pdfField("certificate", "Certificate"),
    pdfField("report", "Report"),
    privacyGroup,
    slugField(),
    yearField,
  ],
};
