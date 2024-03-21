import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import partnerModel from "../../../../DB/model/Partner.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
const __dirname = fileURLToPath(import.meta.url);




export const getPartner = asyncHandler(async (req, res, next) => {
  const partnerModels = await partnerModel.find();
  return res
    .status(200)
    .json({ message: "done", partnerModels, success: true });
});

export const createPartner = asyncHandler(async (req, res, next) => {
  const partnerImage = req.file;
  const userId = req.user;
  const fullPath = partnerImage.finalDest;
  const newPartner = await partnerModel.create({
    imageToUpdate: fullPath,
    image: fullPath,
    createdBy: userId,
  });
  res
    .status(200)
    .json({
      message: "new partner created successfully!",
      newPartner,
      success: true,
    });
});

export const updatePartner = asyncHandler(async (req, res, next) => {
  const partnerId = req.params.partnerId;
  const partnerImage = req.file;
  const userId = req.user;

  const partner = await partnerModel.findById(partnerId);
  if (!partner) {
    return next(new Error("No partner found with this Id!", { cause: 400 }));
  }
  if (partner.image) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${partner.imageToUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const fullPath = partnerImage.finalDest;
  const newPartner = await partnerModel.findByIdAndUpdate(
    partner,
    {
      imageToUpdate: fullPath,
      image: fullPath,
      updatedBy: userId,
    },
    { new: true }
  );
  res
    .status(200)
    .json({
      message: "partner image updated successfully!",
      newPartner,
      success: true,
    });
});

export const deletePartner = asyncHandler(async (req, res, next) => {
  const partnerId = req.params.partnerId;
  const partner = await partnerModel.findById(partnerId);
  if (!partner) {
    return next(new Error("partner not found", { code: 404 }));
  }
  if (partner.image) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${partner.imageToUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  await partnerModel.findByIdAndDelete(partnerId);
  return res
    .status(200)
    .json({ message: `partner deleted successfully`, success: true });
});
