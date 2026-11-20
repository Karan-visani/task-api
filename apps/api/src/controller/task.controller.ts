import { Request, Response } from 'express';
import { CreateTask } from '../types/task';
import { NotFoundError } from '../errors/appError';
import prisma from '../config/database';

export const getTasks = async (req: Request, res: Response) => {
  // const visibleTasks =
  //     req.user!.role === "admin"
  //         ? tasks
  //         : tasks.filter((task) => task.ownerId === req.user!.id);  normal way

  const visibleTasks = await prisma.task.findMany({
    where: req.user!.role === 'admin' ? {} : { userId: req.user!.id }, //prisma way
  });

  res.json({
    success: true,
    tasks: visibleTasks,
  });
};

export const getTask = async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);

  // const task = tasks.find((task)=>task.id === id)
  // if(!task){
  //     throw new NotFoundError("Task not found");
  // }

  // if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
  //     return res.status(403).json({
  //         success: false,
  //         message: "You do not have permission to access this task"
  //     });
  // }

  const task = await prisma.task.findFirst({
    where: req.user!.role === 'admin' ? { id } : { id, userId: req.user!.id },
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  res.json({
    success: true,
    task,
  });
};

export const createTask = async (
  req: Request<Record<string, never>, unknown, CreateTask>,
  res: Response,
) => {
  const { title, completed, priority } = req.body;
  // const ownerId = req.user!.id;

  // const newTask = {id:tasks.length + 1 ,title,completed,priority,ownerId}
  // tasks.push(newTask)

  const newTask = await prisma.task.create({
    data: {
      title,
      completed,
      priority,
      userId: req.user!.id,
    },
  });

  res.status(201).json({
    success: true,
    task: newTask,
  });
};

export const putTask = async (
  req: Request<{ id: string }, unknown, CreateTask>,
  res: Response,
) => {
  const id = Number(req.params.id);

  // const task = tasks.find((task)=>task.id === id)
  // if(!task){
  //     throw new NotFoundError("Task not found");
  // }

  // if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
  // return res.status(403).json({
  //     success: false,
  //     message: "You do not have permission to update this task"
  // });
  // }

  const task = await prisma.task.findFirst({
    where: req.user!.role === 'admin' ? { id } : { id, userId: req.user!.id },
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const { title, completed, priority } = req.body;

  // task.title = title
  // task.completed = completed
  // task.priority = priority

  const updatedTask = await prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      title,
      completed,
      priority,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    task: updatedTask,
  });
};

export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = Number(req.params.id);

  // const index = tasks.findIndex((task) => task.id === id)

  // if (index === -1) {
  //     throw new NotFoundError("Task not found");
  // }

  // const task = tasks[index];

  // if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
  // return res.status(403).json({
  //     success: false,
  //     message: "You do not have permission to delete this task"
  // });
  // }
  // tasks.splice(index,1)

  const task = await prisma.task.findFirst({
    where: req.user!.role === 'admin' ? { id } : { id, userId: req.user!.id },
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const deletedTask = await prisma.task.delete({
    where: {
      id: task.id,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    tasks: deletedTask,
  });
};
