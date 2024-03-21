import { roles } from "../../middleware/auth.js";

export const endPoint = {
  create: [roles.Admin, roles.Manager],
  update: [roles.Admin],
  delete: [roles.Admin],
};
