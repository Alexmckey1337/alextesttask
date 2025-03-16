export const postsSchema = {
  title: "Posts",
  description: "Posts list",
  primaryKey: "id",
  version: 0,
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100, primary: true },
    userId: { type: "number" },
    title: { type: "string" },
    body: { type: "string" },
  },
  required: ["id", "userId", "title", "body"],
};
