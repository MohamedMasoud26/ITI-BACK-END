import * as partnerController from "./controller/partner.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validators from "./partner.validation.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { auth} from "../../middleware/auth.js";
import { endPoint } from "../partner/partner.endPoint.js";

const router = Router();




router.get("/",auth(endPoint.create),
partnerController.getPartner
);

router.post("/",auth(endPoint.create),
fileUpload("partner/partnerImage", fileValidation.image).single("image"),
validation(validators.createPartner),
partnerController.createPartner
);

router.put("/:partnerId",auth(endPoint.create),
validation(validators.updatePartner),
fileUpload("partner/partnerImage", fileValidation.image).single("image"),
partnerController.updatePartner
);

router.delete("/:partnerId",auth(endPoint.create),
validation(validators.deletePartner),
partnerController.deletePartner
);

export default router;
