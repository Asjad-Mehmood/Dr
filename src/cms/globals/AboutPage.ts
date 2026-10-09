import type { GlobalConfig } from "payload";
import { loggedIn } from "../access";

const list = (name: string, label: string, extra = false) => ({
  name,
  label,
  type: "array" as const,
  fields: [
    { name: "title", type: "text" as const, required: true },
    ...(extra ? [{ name: "text", type: "textarea" as const }] : []),
  ],
});

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About page",
  admin: {
    group: "Pages",
    preview: () => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}/about`,
  },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      name: "introduction",
      type: "textarea",
      defaultValue:
        "Naima Asjad is an MBBS student at Central Park Medical College, Lahore, pursuing her medical education with a strong commitment to learning, professional development and service to humanity.",
    },
    {
      name: "positioning",
      label: "Statement",
      type: "textarea",
      defaultValue:
        "An aspiring physician committed to learning medicine, contributing to healthcare, serving communities, and continuously developing through education, research, and clinical experience.",
    },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
    },
    {
      name: "education",
      type: "array",
      defaultValue: [
        {
          title: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
          institution: "Central Park Medical College, Lahore",
          period: "2026 – 2030",
        },
      ],
      fields: [
        { name: "title", type: "text", required: true },
        {
          type: "row",
          fields: [
            { name: "institution", type: "text" },
            { name: "period", type: "text" },
          ],
        },
        { name: "description", type: "textarea" },
      ],
    },
    list("interests", "Medical interests", true),
    list("researchInterests", "Research interests"),
    list("skills", "Skills"),
    {
      name: "languages",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "title", label: "Language", type: "text", required: true },
            { name: "level", type: "text" },
          ],
        },
      ],
    },
    {
      ...list("values", "Values", true),
      defaultValue: [
        {
          title: "Learning",
          text: "Medicine is learned one year, one subject and one patient at a time.",
        },
        {
          title: "Serving",
          text: "Being a doctor means serving people — beginning with the Annual Free Medical Camp.",
        },
        {
          title: "Caring",
          text: "Behind every case is a person. Compassion stays at the centre of the journey.",
        },
      ],
    },
    {
      name: "communityVision",
      label: "Community-service vision",
      type: "textarea",
    },
    { name: "careerGoals", label: "Future goals", type: "textarea" },
  ],
};
