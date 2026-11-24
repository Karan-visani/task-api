import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  putTask,
} from '../controller/task.controller';
import { validateBody } from '../middleware/validateBody';
import { CreateTaskInputSchema, UpdateTaskInputSchema } from '@task-api/shared';
export const taskRouter = express.Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTask);
taskRouter.post('/', validateBody(CreateTaskInputSchema), createTask);
taskRouter.put('/:id', validateBody(UpdateTaskInputSchema), putTask);
taskRouter.delete('/:id', deleteTask);
