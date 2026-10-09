import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import { bySlug, slugField } from "../fields";

export const JourneyStages: CollectionConfig = {
  slug: "journey",
  labels: { singular: "Journey stage", plural: "Medical journey" },
  admin: {
    useAsTitle: "title",
    group: "Journey",
    defaultColumns: ["title", "periodLabel", "phase", "progress", "order"],
    preview: bySlug("/journey"),
    description:
      "Each year of MBBS, then the house job, specialization and career. Records with a matching year appear on that stage's page automatically.",
  },
  access: { read: publishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "periodLabel",
          label: "Period shown",
          type: "text",
          required: true,
          admin: { description: "e.g. 2026, 2030–31, Future" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "year",
          type: "number",
          admin: {
            description:
              "Records dated in this year are listed on this stage. Leave empty for future stages.",
          },
        },
        {
          name: "phase",
          type: "select",
          defaultValue: "mbbs",
          options: [
            { label: "MBBS", value: "mbbs" },
            { label: "House Job", value: "house-job" },
            { label: "Clinical Experience", value: "clinical" },
            { label: "Specialization", value: "specialization" },
            { label: "Residency / Training", value: "residency" },
            { label: "Medical Career", value: "career" },
          ],
        },
      ],
    },
    {
      name: "headline",
      type: "text",
      admin: {
        description:
          "Short line for the home-page timeline, e.g. “MBBS Begins”.",
      },
    },
    { name: "summary", type: "textarea" },
    { name: "content", label: "Story of this year", type: "richText" },
    {
      name: "subjects",
      type: "array",
      labels: { singular: "Subject", plural: "Subjects" },
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "milestones",
      type: "array",
      fields: [
        {
          name: "when",
          type: "text",
          admin: { description: "e.g. March 2026" },
        },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    {
      name: "progress",
      type: "select",
      defaultValue: "auto",
      options: [
        {
          label: "Automatic (from the current year in Site settings)",
          value: "auto",
        },
        { label: "Completed", value: "completed" },
        { label: "In progress", value: "current" },
        { label: "Upcoming", value: "upcoming" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers come first." },
    },
    slugField("periodLabel"),
  ],
};
