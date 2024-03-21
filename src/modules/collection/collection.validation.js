import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCollection = joi.object({
        name: joi.string().min(2).max(25).required(),
}).required();

export const updateCollection = joi.object({
        collectionId: generalFields.id,
        name: joi.string().min(2).max(25),
        file: generalFields.file,
}).required();

export const addCollectionImage = joi.object({
        collectionId: generalFields.id,
        name: joi.string().min(2).max(25),
        file: generalFields.file,
}).required();

export const getOneCollection = joi.object({
        collectionId: generalFields.id,
}).required();

export const deleteCollection = joi.object({
        collectionId: generalFields.id,
}).required();
