import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";




export const addUser = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  email: generalFields.email,
  gender: Joi.string().valid("male", "female"),
  password: generalFields.password,
  cPassword: generalFields.cPassword.valid(Joi.ref("password")),
  role: Joi.string(),
}).required();

export const updateUser = Joi.object({
  _id: generalFields.id,
  firstName: Joi.string().min(2).max(20),
  lastName: Joi.string().min(2).max(20),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 4,
    tlds: { allow: ["com", "net"] },
  }),
  password: generalFields.password,
  role: Joi.string().valid("User", "Admin", "Manager"),
  status: Joi.string().valid("offline", "blocked", "online"),
  gender: Joi.string().valid("male", "female"),
}).required();

export const changePassword = Joi.object({
  oldPassword: generalFields.password,
  newPassword: generalFields.password,
  cPassword: generalFields.cPassword.valid(Joi.ref("newPassword")),
}).required();

export const deleteUser = Joi.object({
  userId: generalFields.id,
}).required();

export const addUserImage = Joi.object({
  profileImage: generalFields.file,
  image: generalFields.file,
}).required();
