import type { Access, Where } from "payload";

export const loggedIn: Access = ({ req }) => Boolean(req.user);

// Visitors only see published records; signed-in editors see drafts too.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };

// Published *and* marked public (certificates).
const publishedAndPublic: Where = {
  and: [
    { _status: { equals: "published" } },
    { visibility: { equals: "public" } },
  ],
};

export const publicPublishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : publishedAndPublic;

// Marked public (media, documents).
export const publicOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { visibility: { equals: "public" } };

export const editorOnly = {
  create: loggedIn,
  update: loggedIn,
  delete: loggedIn,
};
