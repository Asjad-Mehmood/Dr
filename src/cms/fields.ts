import type {
  CollectionBeforeChangeHook,
  Field,
  SelectField,
  UploadField,
} from "payload";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// URL part of a record's page, filled from the title when left empty.
export function slugField(from = "title"): Field {
  return {
    name: "slug",
    type: "text",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: `Used in the page address. Leave empty to create it from the ${from}.`,
    },
    hooks: {
      beforeValidate: [
        ({ value, siblingData }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const source = siblingData?.[from];
          return source ? slugify(String(source)) : value;
        },
      ],
    },
  };
}

export const dateField = (
  name = "date",
  label = "Date",
  required = false,
): Field => ({
  name,
  label,
  type: "date",
  required,
  admin: {
    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
  },
});

// The year a record belongs to on the Journey. Filled from the date.
export const yearField: Field = {
  name: "year",
  type: "number",
  index: true,
  admin: {
    position: "sidebar",
    description:
      "Which year of the journey this belongs to. Filled in from the date automatically.",
  },
};

export function yearOf(date: string | Date) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      timeZone: "Asia/Karachi",
    }).format(new Date(date)),
  );
}

export const setYearFromDate: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.date) data.year = yearOf(data.date);
  return data;
};

export const photosField = (
  name = "photos",
  label = "Photos",
): UploadField => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
  hasMany: true,
  filterOptions: { mimeType: { contains: "image" } },
});

export const videoFields: Field[] = [
  {
    name: "videoUrl",
    label: "Video link",
    type: "text",
    admin: { description: "A YouTube or other video link." },
  },
  {
    name: "videoFile",
    label: "Video file",
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "video" } },
  },
];

export const pdfField = (name: string, label: string): Field => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
});

export const visibilityField: SelectField = {
  name: "visibility",
  type: "select",
  defaultValue: "public",
  required: true,
  options: [
    { label: "Public — shown on the website", value: "public" },
    { label: "Private — only visible in the admin", value: "private" },
  ],
  admin: { position: "sidebar" },
};

// Consent controls for anything involving patients or the public.
export const privacyGroup: Field = {
  name: "privacy",
  label: "Privacy & consent",
  type: "group",
  admin: {
    description:
      "Never enter patient names, CNIC numbers, phone numbers, medical records or reports. Photos and videos are shown on the website only when both boxes are ticked.",
  },
  fields: [
    {
      name: "mediaConsent",
      label: "Photo / media consent obtained",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publicDisplayApproved",
      label: "Approved for public display",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

export const numbersVerifiedField: Field = {
  name: "numbersVerified",
  label: "Numbers verified",
  type: "checkbox",
  defaultValue: false,
  admin: {
    description:
      "Only verified numbers are shown on the website and counted in totals.",
  },
};

export const categoryField = (section: string, required = false): Field => ({
  name: "category",
  type: "relationship",
  relationTo: "categories",
  required,
  filterOptions: { section: { equals: section } },
  admin: {
    position: "sidebar",
    description: "Manage the list under Settings → Categories.",
  },
});

// "Preview" button in the admin, opening the record's page on the website.
// Only published records are visible there.
export function previewAt(
  path: (doc: Record<string, unknown>) => string | null,
) {
  return (doc: Record<string, unknown>) => {
    const target = path(doc);
    return target
      ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}${target}`
      : null;
  };
}

export const bySlug = (base: string) =>
  previewAt((doc) => (doc.slug ? `${base}/${doc.slug}` : null));
