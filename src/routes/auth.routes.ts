import express from "express"
import { loginUser } from "../controller/auth.controller"
export const authRouter = express.Router()

authRouter.post("/login",loginUser)