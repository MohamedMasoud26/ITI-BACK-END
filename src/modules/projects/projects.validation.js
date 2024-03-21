import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createProject = joi.object({
    title: joi.string().min(3).required(),
    description: joi.string(),
}).required();

export const deleteProject = joi.object({
    projectId: generalFields.id,
}).required();

export const getOneProject = joi.object({
    projectId: generalFields.id,
}).required();

export const ProjectImageCover = joi.object({
    brandId: generalFields.id,
    file: generalFields.file,
}).required();

export const ProjectImages = joi.object({
    brandId: generalFields.id,
    file: generalFields.file,
}).required();

export const updateProject = joi.object({
    userId:generalFields.id,
    title: joi.string().min(3),
    description: joi.string(),
}).required();
