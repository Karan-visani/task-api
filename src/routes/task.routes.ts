import express from "express"
import { createTask, deleteTask, getTask, getTasks, putTask } from "../controller/task.controller"
export const taskRouter = express.Router()

taskRouter.get("/",getTasks)
taskRouter.get("/:id",getTask)
taskRouter.post("/add",createTask)
taskRouter.put("/update/:id",putTask)
taskRouter.delete("/delete/:id",deleteTask)