import mongoose, { model, Schema, Types } from "mongoose";

const recentSchema = new Schema(
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
recentSchema.post("init", function (doc) {
  doc.image = process.env.HOST + doc.imageToUpdate;
});

const recentModel = mongoose.models.Recent || model("Recent", recentSchema);

export default recentModel;
