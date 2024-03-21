import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import collectionModel from "../../../../DB/model/Collection.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
const __dirname = fileURLToPath(import.meta.url);

export const getCollection = asyncHandler(async (req, res, next) => {
  const collections = await collectionModel.find();
  return res.status(200).json({ message: "done", collections, success: true });
});

export const getOneCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return next(new Error("collection not found", { code: 404 }));
  }
  return res.status(200).json({ message: "done", collection, success: true });
});

export const createCollection = asyncHandler(async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const userId = req.user;
  if (await collectionModel.findOne({ name })) {
    return next(new Error(`duplicated collection name : ${name}`, { cause: 409 }));
  }
  const collection = await collectionModel.create({
    name,
    createdBy: userId,
  });
  return res.status(201).json({ message: "done ", collection, success: true });
});

export const updateCollection = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const collection = await collectionModel.findById(req.params.collectionId);
  if (!collection) {
    return next(new Error("collection not found", { code: 404 }));
  }

  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
    if (collection.name == req.body.name) {
      return next(
        new Error(`sorry cannot update collection with the same name`, {
          cause: 400,
        })
      );
    }
  }
  let newCollection = await collectionModel.findByIdAndUpdate(
    collection._id,
    {
      name: req.body.name,
      updatedBy: userId,
    },
    { new: true }
  );
  return res.status(200).json({ message: "done ", newCollection, success: true });
});

export const addCollectionImage = asyncHandler(async (req, res, next) => {
  const collectionId = req.params.collectionId;
  const collectionImage = req.file;
  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return next(new Error("No collection found with this Id!", { cause: 400 }));
  }
  if (collection.image) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${collection.urlToUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const fullPath = collectionImage.finalDest;
  const newCollection = await collectionModel.findByIdAndUpdate(
    collection,
    {
      urlToUpdate: fullPath,
      image: fullPath,
    },
    { new: true }
  );
  res
    .status(200)
    .json({
      message: "User image updated successfully!",
      newCollection,
      success: true,
    });
});

export const deleteCollection = asyncHandler(async (req, res, next) => {
  const collectionId = req.params.collectionId;
  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return next(new Error("collection not found", { code: 404 }));
  }
  if (collection.image) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${collection.urlToUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  await collectionModel.findByIdAndDelete(collectionId);
  return res
    .status(200)
    .json({
      message: `collection ${collection.name} deleted successfully`,
      success: true,
    });
});
