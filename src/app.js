import express from "express"
import cors from 'cors'
import { errorMiddleware } from "./noController/middlewares/error.middleware.js"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
import cookieParser from "cookie-parser";
app.use(cookieParser());

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
import userRouter from './noController/routes/user.router.js'

app.use("/api/auth",userRouter)

import reportRouter from "./noController/routes/report.router.js";
app.use("/api/report",reportRouter)

import chatRouter from "./noController/routes/chatbot.router.js"
app.use("/api/chatbot",chatRouter)

app.use(errorMiddleware)
export {app}
