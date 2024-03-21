import mongoose, { model, Schema, Types } from "mongoose";

const collectionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    urlToUpdate: String,
    image: String,
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
collectionSchema.post("init", function (doc) {
  doc.image = process.env.HOST + doc.urlToUpdate;
});
const collectionModel = mongoose.models.Collection || model("Collection", collectionSchema);

export default collectionModel;
