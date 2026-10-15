import express from "express"
import { loginUser, logoutUser, registerUser } from "../controller/auth.controller.js"
export const authRouter = express.Router()

authRouter.post("/login",loginUser)
authRouter.post("/register",registerUser)
authRouter.post("/logout",logoutUser)