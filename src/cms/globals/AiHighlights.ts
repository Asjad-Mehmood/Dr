import type { GlobalConfig } from "payload";
import { loggedIn } from "../access";

// Collections the AI may pick records from (all have public pages).
export const highlightCollections = [
  { label: "Event", value: "events" },
  { label: "Achievement", value: "achievements" },
  { label: "Certificate", value: "certificates" },
  { label: "Research", value: "research" },
  { label: "Community service", value: "community" },
  { label: "Medical camp", value: "medical-camps" },
  { label: "Journal post", value: "journal" },
  { label: "Gallery album", value: "gallery" },
  { label: "Academic record", value: "academic-records" },
] as const;

export const highlightSections = [
  { label: "Medical journey", value: "journey" },
  { label: "Academic", value: "academic" },
  { label: "Research", value: "research" },
  { label: "Community service", value: "community" },
  { label: "Medical camps", value: "camps" },
  { label: "Events", value: "events" },
  { label: "Achievements", value: "achievements" },
  { label: "Certificates", value: "certificates" },
  { label: "Gallery", value: "gallery" },
  { label: "Journal", value: "journal" },
] as const;

export const AiHighlights: GlobalConfig = {
  slug: "ai-highlights",
  label: "AI highlights",
  admin: {
    group: "Pages",
    description:
      "Grok (xAI) reads every published, public record and suggests the strongest ones for the home page. Review or edit the picks, then tick “Show on home page”. Only public information is ever sent; drafts, private items and unverified numbers are not.",
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      name: "analyze",
      type: "ui",
      admin: {
        components: {
          Field: "/components/admin/AnalyzeButton#AnalyzeButton",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "showOnHome",
          label: "Show on home page",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Leave off until you have checked the picks below.",
          },
        },
        {
          name: "maxItems",
          label: "Number of highlights",
          type: "number",
          defaultValue: 4,
          min: 1,
          max: 8,
        },
      ],
    },
    {
      name: "title",
      label: "Section heading",
      type: "text",
      defaultValue: "Highlights",
    },
    {
      name: "intro",
      label: "Section introduction",
      type: "textarea",
    },
    {
      name: "strongestSection",
      label: "Strongest section",
      type: "group",
      admin: {
        description: "The part of the portfolio the AI found strongest.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "key",
              label: "Section",
              type: "select",
              options: [...highlightSections],
            },
            { name: "label", label: "Headline", type: "text" },
          ],
        },
        { name: "reason", type: "textarea" },
      ],
    },
    {
      name: "picks",
      label: "Highlighted records",
      type: "array",
      labels: { singular: "Highlight", plural: "Highlights" },
      admin: {
        description:
          "Drag to reorder, edit the wording or remove any pick. Records that are later unpublished or made private are skipped on the website automatically.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "collection",
              type: "select",
              required: true,
              options: [...highlightCollections],
            },
            {
              name: "docId",
              label: "Record ID",
              type: "number",
              required: true,
            },
            {
              name: "label",
              label: "Tag",
              type: "text",
              admin: { description: "e.g. Leadership, Research" },
            },
          ],
        },
        { name: "title", label: "Record title", type: "text" },
        {
          name: "reason",
          label: "Why it stands out",
          type: "textarea",
        },
      ],
    },
    {
      type: "collapsible",
      label: "Last analysis",
      admin: { initCollapsed: true },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lastAnalyzedAt",
              label: "Analysed at",
              type: "date",
              admin: {
                readOnly: true,
                date: { pickerAppearance: "dayAndTime" },
              },
            },
            {
              name: "model",
              label: "Model used",
              type: "text",
              admin: { readOnly: true },
            },
            {
              name: "recordsAnalyzed",
              label: "Records analysed",
              type: "number",
              admin: { readOnly: true },
            },
          ],
        },
        {
          name: "lastError",
          label: "Last error",
          type: "textarea",
          admin: { readOnly: true },
        },
      ],
    },
  ],
};
