import express from "express"
import { createTask, deleteTask, getTask, getTasks, putTask } from "../controller/task.controller"
import { validateBody } from "../middleware/validateBody"
import { createTaskSchema } from "../schemas/task.schema"
export const taskRouter = express.Router()

taskRouter.get("/",getTasks)
taskRouter.get("/:id",getTask)
taskRouter.post("/",validateBody(createTaskSchema),createTask)
taskRouter.put("/:id",putTask)
taskRouter.delete("/:id",deleteTask)