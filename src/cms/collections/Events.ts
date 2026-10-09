import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  bySlug,
  categoryField,
  dateField,
  photosField,
  setYearFromDate,
  slugField,
  videoFields,
  yearField,
} from "../fields";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    group: "Activities",
    defaultColumns: ["title", "category", "date", "location", "_status"],
    listSearchableFields: ["title", "location", "role", "summary"],
    description:
      "College events, seminars, workshops, conferences, sports and more. Events with a future date appear as upcoming; past events move to the archive automatically.",
    preview: bySlug("/events"),
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
      admin: { placeholder: "e.g. Orientation Day 2026" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Details",
          description: "When and where it happened, and Naima's part in it.",
          fields: [
            {
              type: "row",
              fields: [
                dateField("date", "Date", true),
                dateField("endDate", "End date"),
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "location",
                  type: "text",
                  admin: { placeholder: "e.g. CPMC Auditorium, Lahore" },
                },
                {
                  name: "role",
                  label: "Naima's role",
                  type: "text",
                  admin: {
                    placeholder: "e.g. Participant, Volunteer, Speaker",
                  },
                },
              ],
            },
            {
              name: "summary",
              type: "textarea",
              admin: {
                description: "One or two sentences shown in lists.",
              },
            },
            {
              name: "description",
              type: "richText",
              admin: {
                description: "The full story, shown on the event's page.",
              },
            },
          ],
        },
        {
          label: "Photos & video",
          fields: [
            {
              name: "cover",
              label: "Cover photo",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
            },
            photosField(),
            ...videoFields,
          ],
        },
        {
          label: "Certificates",
          fields: [
            {
              name: "certificates",
              type: "relationship",
              relationTo: "certificates",
              hasMany: true,
              admin: {
                description:
                  "Certificates received at this event. Add the certificate under Achievements → Certificates first.",
              },
            },
          ],
        },
      ],
    },
    categoryField("events"),
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    slugField(),
    yearField,
  ],
};
