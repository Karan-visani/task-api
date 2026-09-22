import express from "express"
import { createTask, getTasks } from "../controller/task.controller"
export const taskRouter = express.Router()

taskRouter.get("/",getTasks)
taskRouter.post("/add",createTask)