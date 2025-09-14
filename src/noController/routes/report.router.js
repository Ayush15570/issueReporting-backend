import { Router } from "express";
import { createReport,updateReportStatus,getAllReports,getMyReports } from "../../controllers/report.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT,upload.fields([
    {
        name:"photo",
        maxCount:1
    }
]),createReport)

router.route("/all-reports").get(verifyJWT,getAllReports)


router.route("/my-reports").get(verifyJWT, getMyReports);


router.route("/:id/status").patch(verifyJWT, updateReportStatus);

export default router