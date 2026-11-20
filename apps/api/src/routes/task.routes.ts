import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  putTask,
} from '../controller/task.controller';
import { validateBody } from '../middleware/validateBody';
import { createTaskSchema } from '../validation/task.schema';
export const taskRouter = express.Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTask);
taskRouter.post('/add', validateBody(createTaskSchema), createTask);
taskRouter.put('/update/:id', validateBody(createTaskSchema), putTask);
taskRouter.delete('/delete/:id', deleteTask);
