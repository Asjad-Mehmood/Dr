import type { GlobalConfig } from "payload";
import { loggedIn } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Settings" },
  access: { read: () => true, update: loggedIn },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          description:
            "How Naima is named across the site. After graduation, set the prefix to “Dr.”, the post-nominals to “MBBS” and update the role.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "prefix",
                  type: "text",
                  defaultValue: "",
                  admin: { description: "e.g. Dr. (empty while a student)" },
                },
                {
                  name: "name",
                  type: "text",
                  required: true,
                  defaultValue: "Naima Asjad",
                },
                {
                  name: "postNominals",
                  label: "Post-nominals",
                  type: "text",
                  defaultValue: "",
                  admin: { description: "e.g. MBBS" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "role", type: "text", defaultValue: "MBBS Student" },
                { name: "initials", type: "text", defaultValue: "NA" },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "institution",
                  type: "text",
                  defaultValue: "Central Park Medical College",
                },
                {
                  name: "institutionShort",
                  label: "Short name",
                  type: "text",
                  defaultValue: "CPMC",
                },
                { name: "city", type: "text", defaultValue: "Lahore" },
              ],
            },
            {
              name: "tagline",
              type: "text",
              defaultValue:
                "Learning Medicine • Serving Humanity • Inspiring Health",
            },
            {
              name: "currentYear",
              label: "Current year of the journey",
              type: "number",
              required: true,
              defaultValue: 2026,
              admin: {
                description:
                  "Journey stages before this year show as completed, this year as in progress, later years as upcoming.",
              },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "email", type: "email" },
            {
              name: "website",
              type: "text",
              defaultValue: "https://naimaasjad.com",
            },
            { name: "linkedin", label: "LinkedIn", type: "text" },
            {
              name: "socialLinks",
              label: "Other links",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "url", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Navigation",
          fields: [
            {
              name: "navigation",
              label: "Main menu",
              type: "array",
              admin: {
                description: "Drag to reorder. Remove an item to hide it.",
              },
              defaultValue: [
                { label: "Journey", href: "/journey" },
                { label: "Academic", href: "/academic" },
                { label: "Research", href: "/research" },
                { label: "Community", href: "/community" },
                { label: "Camps", href: "/medical-camps" },
                { label: "Events", href: "/events" },
                { label: "Achievements", href: "/achievements" },
                { label: "About", href: "/about" },
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
            {
              name: "footerLinks",
              label: "Footer links",
              type: "array",
              defaultValue: [
                { label: "Certificates", href: "/certificates" },
                { label: "Gallery", href: "/gallery" },
                { label: "Journal", href: "/journal" },
                { label: "CV", href: "/cv" },
                { label: "Contact", href: "/contact" },
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
            { name: "footerNote", type: "textarea" },
          ],
        },
        {
          label: "Appearance & SEO",
          fields: [
            {
              name: "defaultTheme",
              type: "select",
              defaultValue: "light",
              options: [
                { label: "Light (cream)", value: "light" },
                { label: "Dark", value: "dark" },
              ],
              admin: {
                description:
                  "Visitors can still switch with the button in the header.",
              },
            },
            {
              name: "metaTitle",
              label: "Browser title",
              type: "text",
              defaultValue: "Naima Asjad | MBBS Student",
            },
            {
              name: "metaDescription",
              label: "Search description",
              type: "textarea",
              defaultValue:
                "Naima Asjad, MBBS student at Central Park Medical College, Lahore — a record of her medical journey, research, community service and the Annual Free Medical Camp.",
            },
            {
              name: "shareImage",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
            },
          ],
        },
      ],
    },
  ],
};
