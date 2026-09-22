import express from "express"
import { getTasks } from "../controller/task.controller"
export const taskRouter = express.Router()

taskRouter.get("/",getTasks)