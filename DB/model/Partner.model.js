import mongoose, { model, Schema, Types } from "mongoose";

const partnerSchema = new Schema(
  {
    imageToUpdate: String,
    image: String,
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
partnerSchema.post("init", function (doc) {
  doc.image = process.env.HOST + doc.imageToUpdate;
});

const partnerModel = mongoose.models.Partner || model("Partner", partnerSchema);

export default partnerModel;
