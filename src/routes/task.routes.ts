import express from "express"
import { createTask, deleteTask, getTask, getTasks, putTask } from "../controller/task.controller"
import { validateBody } from "../middleware/validateBody"
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema"
import { authenticate } from "../middleware/authenticate"
import { authorize } from "../middleware/authorize"
export const taskRouter = express.Router()

taskRouter.get("/",authenticate,getTasks)
taskRouter.get("/:id",authenticate,getTask)
taskRouter.post("/",authenticate,validateBody(createTaskSchema),createTask)
taskRouter.put("/:id",authenticate,validateBody(updateTaskSchema),putTask)
taskRouter.delete("/:id",authenticate,authorize("admin"),deleteTask)