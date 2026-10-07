import { APIError, type CollectionConfig } from "payload";
import { BLOB_STORE_MISSING, uploadsNeedBlobStore } from "@/lib/setup";
import { editorOnly, publicOrLoggedIn } from "../access";
import { dateField } from "../fields";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "File", plural: "Media library" },
  admin: {
    group: "Media & Writing",
    description:
      "Photos, videos and PDFs. Upload once, then pick them from any record.",
    defaultColumns: ["filename", "alt", "visibility", "updatedAt"],
  },
  access: { read: publicOrLoggedIn, ...editorOnly },
  upload: {
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    focalPoint: true,
    adminThumbnail: "thumbnail",
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 900 },
      { name: "large", width: 1800 },
    ],
  },
  hooks: {
    // Explain a missing Blob store instead of failing with a disk error.
    beforeOperation: [
      ({ operation, req }) => {
        const uploading = operation === "create" || Boolean(req.file);
        if (uploading && uploadsNeedBlobStore()) {
          const error = new APIError(BLOB_STORE_MISSING, 400, null, true);
          // Payload only shows messages of named errors, and minified builds
          // lose the class name.
          error.name = "StorageNotConnected";
          throw error;
        }
      },
    ],
    // Anything showing identifiable patients without consent stays private.
    beforeChange: [
      ({ data }) => {
        if (data?.showsPatients && !data?.consentObtained) {
          data.visibility = "private";
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "alt",
      label: "Description",
      type: "text",
      required: true,
      admin: {
        description:
          "What the file shows, e.g. “Orientation day, CPMC”. Read aloud by screen readers.",
      },
    },
    { name: "caption", type: "text" },
    dateField("takenOn", "Date taken"),
    {
      name: "visibility",
      type: "select",
      defaultValue: "public",
      required: true,
      options: [
        { label: "Public", value: "public" },
        { label: "Private — admin only", value: "private" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Private files are never shown on the website. Note: when files are stored on Vercel Blob, anyone with a file's exact link can still open it.",
      },
    },
    {
      name: "showsPatients",
      label: "Shows identifiable patients",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "consentObtained",
      label: "Consent obtained",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Files showing patients are kept private until consent is recorded.",
        condition: (data) => Boolean(data?.showsPatients),
      },
    },
  ],
};
