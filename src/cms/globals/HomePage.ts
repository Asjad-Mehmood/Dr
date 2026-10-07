import type { GlobalConfig } from "payload";
import { loggedIn } from "../access";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home page",
  admin: { group: "Pages" },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "statement",
              type: "textarea",
              defaultValue:
                "Learning Medicine with Purpose, Serving Humanity with Compassion.",
            },
            {
              name: "portrait",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
            },
            {
              name: "buttons",
              type: "array",
              maxRows: 3,
              defaultValue: [
                { label: "My MBBS Journey", href: "/journey" },
                { label: "Community Service", href: "/community" },
                { label: "Medical Camp", href: "/medical-camps" },
              ],
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    {
                      name: "href",
                      label: "Link",
                      type: "text",
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Highlights",
          fields: [
            {
              name: "highlights",
              type: "array",
              defaultValue: [
                {
                  title: "MBBS Journey",
                  text: "2026 → 2030",
                  href: "/journey",
                },
                {
                  title: "Academic Excellence",
                  text: "Education • Skills • Achievements",
                  href: "/academic",
                },
                {
                  title: "Community Service",
                  text: "Medical Camps • Health Awareness • Volunteering",
                  href: "/community",
                },
                {
                  title: "Research & Learning",
                  text: "Research • Seminars • Workshops",
                  href: "/research",
                },
              ],
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "href", label: "Link", type: "text" },
                  ],
                },
                { name: "text", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Sections",
          description:
            "Turn home-page sections on or off and change their headings.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "showTimeline",
                  label: "Journey timeline",
                  type: "checkbox",
                  defaultValue: true,
                },
                {
                  name: "showImpact",
                  label: "Impact numbers",
                  type: "checkbox",
                  defaultValue: true,
                },
                {
                  name: "showCamp",
                  label: "Medical camp",
                  type: "checkbox",
                  defaultValue: true,
                },
                {
                  name: "showUpcoming",
                  label: "Upcoming events",
                  type: "checkbox",
                  defaultValue: true,
                },
                {
                  name: "showLatest",
                  label: "Latest records",
                  type: "checkbox",
                  defaultValue: true,
                },
              ],
            },
            {
              name: "timelineTitle",
              type: "text",
              defaultValue: "From the first lecture to the first patient",
            },
            {
              name: "impactTitle",
              type: "text",
              defaultValue: "The record so far",
            },
            {
              name: "campTitle",
              type: "text",
              defaultValue: "Serving Humanity Through Healthcare",
            },
            { name: "upcomingTitle", type: "text", defaultValue: "Coming up" },
            {
              name: "latestTitle",
              type: "text",
              defaultValue: "Recently added",
            },
          ],
        },
      ],
    },
  ],
};
