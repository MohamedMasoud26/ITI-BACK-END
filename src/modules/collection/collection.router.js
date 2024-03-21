import * as collectionController from "./controller/collection.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validators from "./collection.validation.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { auth} from "../../middleware/auth.js";
import { endPoint } from "../collection/collection.endPoint.js";
const router = Router();

router.get("/", collectionController.getCollection);

router.get(
  "/:collectionId",
  validation(validators.getOneCollection),
  collectionController.getOneCollection
);

router.post(
  "/",
  auth(endPoint.create),
  validation(validators.createCollection),
  collectionController.createCollection
);

router.put(
  "/:collectionId",
  auth(endPoint.update),
  validation(validators.updateCollection),
  collectionController.updateCollection
);

router.put(
  "/collectionImage/:collectionId",
  auth(endPoint.update),
  validation(validators.addCollectionImage),
  fileUpload("collections/collectionImage", fileValidation.image).single("image"),
  collectionController.addCollectionImage
);

router.delete(
  "/:collectionId",
  auth(endPoint.update),
  validation(validators.deleteCollection),
  collectionController.deleteCollection
);

export default router;
