import * as recentController from "./controller/recent.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validators from "./recent.validation.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { auth} from "../../middleware/auth.js";
import { endPoint } from "../recent/recent.endPoint.js";


const router = Router();


router.get("/",
recentController.getRecent
);

router.post("/",auth(endPoint.create),
fileUpload("recent/recentImage", fileValidation.image).single("image"),
validation(validators.createRecent),
recentController.createRecent
);

router.put("/:recentId",auth(endPoint.create),
validation(validators.updateRecent),
fileUpload("recent/recentImage", fileValidation.image).single("image"),
recentController.updateRecent
);

router.delete("/:recentId",auth(endPoint.create),
validation(validators.deleteRecent),
recentController.deleteRecent
);

export default router;
