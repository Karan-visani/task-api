import express from "express"
import { createTask, getTask, getTasks, putTask } from "../controller/task.controller"
export const taskRouter = express.Router()

taskRouter.get("/",getTasks)
taskRouter.get("/:id",getTask)
taskRouter.post("/add",createTask)
taskRouter.put("/update/:id",putTask)