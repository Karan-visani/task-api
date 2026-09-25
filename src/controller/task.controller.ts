import { Request, Response } from "express"
import {tasks} from "../data/task"
import { CreateTask, Task } from "../types/task"
import { AppError, NotFoundError } from "../errors/appError"

export const getTasks =async (req:Request,res:Response)=>{
    const user = res.locals.user
    const userTasks = 
    user.role === "admin" ? tasks : tasks.filter((tasks) => tasks.userId === user.id)

    res.json({
        success:true,
        tasks:userTasks
})
}

export const getTask =  (req:Request<{id:string}>,res:Response)=>{
    
    const id = Number(req.params.id)

    const task = tasks.find((task)=>task.id === id)
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
    console.log("CREATE TASK CONTROLLER HIT");
  console.log("BODY:", req.body);
  console.log("USER:", res.locals.user);
    const {title,completed,priority} = req.body;
    const user = res.locals.user


    const task:Task = {
        id : tasks.length + 1,
        title,
        completed,
        priority,
        userId : user.id
    }

    tasks.push(task)

    res.status(201).json({
    success: true,
    task,
    });
}

export const putTask = async(req:Request<{id:string},{},CreateTask>,res:Response) =>{
    const id = Number(req.params.id)

    const task = tasks.find((task)=>task.id === id)
    if(!task){
        throw new NotFoundError("Task not found");
    }

    const user = res.locals.user

    if (user.role !== "admin" && task.userId !== user.id) {
      throw new AppError("Access denied", 403);
    }

    const {title,completed,priority} = req.body;

    task.title = title
    task.completed = completed
    task.priority = priority

    return res.status(200).json({
            success:true,
            message:"Task updated successfully",
            task
        })
}

export const deleteTask = async (req:Request<{id:string}>,res:Response)=>{
    const id = Number(req.params.id)

    const index = tasks.findIndex((task) => task.id === id)

    if (index === -1) {
        throw new NotFoundError("Task not found");
    }

    tasks.splice(index,1)

    return res.status(200).json({
            success:true,
            message:"Task deleted successfully",
            tasks
        })

}