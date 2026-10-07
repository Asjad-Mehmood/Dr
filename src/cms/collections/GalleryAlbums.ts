import type { CollectionConfig } from "payload";
import { editorOnly, publishedOrLoggedIn } from "../access";
import {
  categoryField,
  dateField,
  photosField,
  setYearFromDate,
  slugField,
  yearField,
} from "../fields";

export const GalleryAlbums: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "Album", plural: "Gallery albums" },
  admin: {
    useAsTitle: "title",
    group: "Media & Writing",
    defaultColumns: ["title", "category", "date", "_status"],
  },
  access: { read: publishedOrLoggedIn, ...editorOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  hooks: { beforeChange: [setYearFromDate] },
  fields: [
    { name: "title", type: "text", required: true },
    dateField(),
    { name: "description", type: "textarea" },
    { ...photosField(), required: true },
    categoryField("gallery"),
    slugField(),
    yearField,
  ],
};
