import express from "express"
import { createTask, deleteTask, getTask, getTasks, putTask } from "../controller/task.controller.js"
import { validateBody } from "../middleware/validateBody.js"
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
export const taskRouter = express.Router()

taskRouter.get("/",authenticate,getTasks)
taskRouter.get("/:id",authenticate,getTask)
taskRouter.post("/",authenticate,validateBody(createTaskSchema),createTask)
taskRouter.put("/:id",authenticate,validateBody(updateTaskSchema),putTask)
taskRouter.delete("/:id",authenticate,authorize("admin"),deleteTask)