import project from "../projects/projects.router.js";
import * as projectController from "./controller/projects.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validators from "./projects.validation.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "../projects/projects.endPoint.js";
const router = Router();

router.get("/", projectController.getProject);

router.get("/:projectId",
validation(validators.getOneProject),
projectController.getOneProject);

router.post("/",auth(endPoint.create),
validation(validators.createProject),
projectController.createProject);

router.put("/projectCover/:projectId",auth(endPoint.update),
fileUpload("projects/projectCover", fileValidation.image).single("image"),
validation(validators.ProjectImageCover),
projectController.ProjectImageCover);

router.put("/projectImages/:projectId",auth(endPoint.update),
fileUpload("projects/projectImages", fileValidation.image).array("images"),
validation(validators.ProjectImages),
projectController.ProjectImages);

router.delete("/:projectId",auth(endPoint.update),
validation(validators.deleteProject),
projectController.deleteProject);

router.put("/:projectId",auth(endPoint.update),
validation(validators.deleteProject),
projectController.updateProject);

export default router;
