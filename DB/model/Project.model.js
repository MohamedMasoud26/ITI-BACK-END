import mongoose, { model, Schema, Types } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    coverImageUpdate: String,
    coverImage: String,
    projectImageUpdate: [String],
    projectImage: [String],
    Collection: { type: Types.ObjectId, ref: "Collection" },
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
projectSchema.post("init", function (doc) {
  doc.coverImage = process.env.HOST + doc.coverImageUpdate;
});

projectSchema.post("init", function (doc) {
  doc.projectImage = doc.projectImage.map((image) => process.env.HOST + image);
});

const projectModel = mongoose.models.Project || model("Project", projectSchema);

export default projectModel;
