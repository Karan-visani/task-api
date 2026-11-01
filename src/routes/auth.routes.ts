import express from "express"
import { login } from "../controller/auth.controller"
export const authRouter = express.Router()

authRouter.post("/login",login)