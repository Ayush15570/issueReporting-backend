import { Router } from "express"

import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/get-current-user").get(verifyJWT,getCurrentUser)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/new-access-refresh-token").post(refreshAccessToken)

export default router