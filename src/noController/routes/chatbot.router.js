import { Router } from "express";
import { chatbotController } from "../../controllers/chatbot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').post(verifyJWT,chatbotController)

export default router