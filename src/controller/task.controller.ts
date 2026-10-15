import { Request, Response } from "express"
import {tasks} from "../data/task.js"
import { CreateTask, Task } from "../types/task.js"
import { AppError, NotFoundError } from "../errors/appError.js"
import prisma from "../db/prisma.js"

export const getTasks =async (req:Request,res:Response)=>{
    const user = res.locals.user
    const userTasks = await prisma.task.findMany({
        where: user.role === "admin" ? {} : {userId:user.id}
    })

    res.json({
        success:true,
        tasks:userTasks
})
}

export const getTask =async  (req:Request<{id:string}>,res:Response)=>{
    
    const id = Number(req.params.id)

    const task = await prisma.task.findUnique({
        where:{
            id
        }
    })
    if(!task){
        throw new NotFoundError("Task not found");
    }

    const user = res.locals.user;

    if (user.role !== "admin" && task.userId !== user.id) {
      throw new AppError("Access denied", 403);
    }

    res.json({
        success:true,
        task
    })
}

export const createTask= async(req:Request<{},{},CreateTask>,res:Response)=>{
    const {title,completed,priority} = req.body;
    const user = res.locals.user


    const task = await prisma.task.create({
        data:{
            title,
            completed,
            priority,
            userId: user.id
        }
    })

    res.status(201).json({
    success: true,
    task,
    });
}


export const putTask = async (
  req: Request<{ id: string }, {}, CreateTask>,
  res: Response
) => {
  const id = Number(req.params.id);
  const user = res.locals.user;
  const { title, completed, priority } = req.body;

  // Admin can update any task
  if (user.role === "admin") {
    const task = await prisma.task.update({
      where: { id },
      data: { title, completed, priority },
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  }

  // Regular users can update only their own tasks
  const result = await prisma.task.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: { title, completed, priority },
  });

  if (result.count === 0) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    throw new AppError("Access denied", 403);
  }

  const updatedTask = await prisma.task.findUnique({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
};


export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);
  const user = res.locals.user;

  // Admin can delete any task
  if (user.role === "admin") {
    const task = await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  }

  // Regular users can delete only their own tasks
  const result = await prisma.task.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    throw new AppError("Access denied", 403);
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};
