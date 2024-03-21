import { roles } from "../../middleware/auth.js";

export const endPoint = {
  create: [roles.Admin, roles.Manager],
  update: [roles.User, roles.Admin, roles.Manager],
  delete: [roles.User, roles.Admin, roles.Manager],
};
