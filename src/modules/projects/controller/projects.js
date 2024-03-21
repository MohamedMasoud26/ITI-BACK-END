import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import projectModel from "../../../../DB/model/Project.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { apiFeatures } from "../../../utils/ApiFeatures.js";
const __dirname = fileURLToPath(import.meta.url);




export const getProject = asyncHandler(async (req, res, next) => {
  const apiFeature = new apiFeatures(projectModel.find(),req.query).search().sort().filter().fields().paginate()
  const projects = await apiFeature.mongooseQuery;
  return res
    .status(200)
    .json({ message: "done", data:projects, success: true });
});

export const getOneProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await projectModel.findById(projectId);
  if (!project) {
    return next(new Error("project not found", { code: 404 }));
  }
  return res
    .status(200)
    .json({ message: "done", data: project, success: true });
});

export const createProject = asyncHandler(async (req, res, next) => {
  const title = req.body.title.toLowerCase();
  const description = req.body.description;
  const collection =req.body.collectionId
  const userId = req.user;
  if (await projectModel.findOne({ title })) {
    return next(
      new Error(`duplicated project name : ${title}`, { cause: 409 })
    );
  }
  const project = await projectModel.create({
    title,
    description,
    collection,
    createdBy: userId,
  });
  return res
    .status(201)
    .json({ message: "done ", data: project, success: true });
});

export const updateProject = asyncHandler( async (req,res,next)=>{
  const userId=req.user
  const project =await projectModel.findById(req.params.projectId)
  if(!project){
      return next(new Error('project not found',{code:404}))
  }
  
  if(req.body.title){
      req.body.title = req.body.title.toLowerCase()
      if(project.title==req.body.title){
          return next(new Error(`sorry cannot update project with the same title`,{cause:400}))
  
      }
      
     
  }
  let newProject=await projectModel.findByIdAndUpdate(project._id,{
      title:req.body.title,
      description:req.body.description,
      updatedBy : userId
  },{new:true})
  return res.status(200).json({message:"done ",newProject,success:true} )
}) 
export const ProjectImageCover = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const projectImage = req.file;
  const project = await projectModel.findById(projectId);
  if (!project) {
    return next(new Error("No project found with this Id!", { cause: 400 }));
  }
  if (project.coverImage) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${project.coverImageUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const fullPath = projectImage.finalDest;
  const newProject = await projectModel.findByIdAndUpdate(project, {
    coverImageUpdate: fullPath,
    coverImage: fullPath,
  });
  res
    .status(200)
    .json({
      message: "User image updated successfully!",
      newProject,
      success: true,
    });
});

export const ProjectImages = asyncHandler(async (req, res, next) => {
  const imagePaths = [];
  const projectId = req.params.projectId;
  const projectImages = req.files;
  const project = await projectModel.findById(projectId);
  if (!project) {
    return next(new Error("No project found with this Id!", { cause: 400 }));
  }
  if (projectImages) {
    projectImages.forEach(async (ImageUrl) => {
      const fullPath = ImageUrl.finalDest;
      imagePaths.push(fullPath);
    });
  }
  if (project.projectImage && project.projectImage.length > 0) {
    project.projectImageUpdate.forEach(async (oldImageUrl) => {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        oldImageUrl
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    });
  }
  const newProject = await projectModel.findByIdAndUpdate(
    project,
    {
      projectImageUpdate: imagePaths,
      projectImage: imagePaths,
    },
    { new: true }
  );
  res
    .status(200)
    .json({
      message: "User image updated successfully!",
      newProject,
      success: true,
    });
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const project = await projectModel.findById(projectId);
  if (!project) {
    return next(new Error("project not found", { code: 404 }));
  }
  if (project.coverImage) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      `${project.coverImageUpdate}`
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  if (project.projectImage && project.projectImage.length > 0) {
    project.projectImageUpdate.forEach(async (oldImageUrl) => {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        oldImageUrl
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    });
  }
  await projectModel.findByIdAndDelete(projectId);
  return res
    .status(200)
    .json({ message: "project deleted successfully ", project });
});
