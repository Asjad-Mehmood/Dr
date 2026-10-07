import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import { dateField, setYearFromDate, yearField } from "../fields";

export const AcademicRecords: CollectionConfig = {
  slug: "academic-records",
  labels: { singular: "Academic record", plural: "Academic records" },
  admin: {
    useAsTitle: "title",
    group: "Journey",
    defaultColumns: ["title", "type", "date", "_status"],
    description:
      "Exams, results, academic milestones, courses and presentations.",
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
          defaultValue: "milestone",
          options: [
            { label: "Exam", value: "exam" },
            { label: "Result", value: "result" },
            { label: "Academic milestone", value: "milestone" },
            { label: "Medical course", value: "course" },
            { label: "Presentation", value: "presentation" },
            { label: "Skill", value: "skill" },
            { label: "Other", value: "other" },
          ],
        },
        dateField(),
      ],
    },
    { name: "subject", type: "text" },
    {
      type: "row",
      fields: [
        {
          name: "result",
          type: "text",
          admin: { description: "Grade, marks or position." },
        },
        {
          name: "showResult",
          label: "Show the result publicly",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    { name: "description", type: "textarea" },
    {
      name: "attachments",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    yearField,
  ],
};
