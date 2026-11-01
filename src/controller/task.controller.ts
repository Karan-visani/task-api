import { Request, Response } from "express"
import {tasks} from "../data/task"
import { CreateTask } from "../types/task"
import { NotFoundError } from "../errors/appError"

export const getTasks =async (req:Request,res:Response)=>{
    const visibleTasks =
        req.user!.role === "admin"
            ? tasks
            : tasks.filter((task) => task.ownerId === req.user!.id);

    res.json({
        success:true,
        tasks:visibleTasks
})
}

export const getTask =  (req:Request<{id:string}>,res:Response)=>{
    const id = Number(req.params.id)

    const task = tasks.find((task)=>task.id === id)
    if(!task){
        throw new NotFoundError("Task not found");
    }

    if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to access this task"
        });
    }

    res.json({
        success:true,
        task
    })
}

export const createTask= async(req:Request<{},{},CreateTask>,res:Response)=>{
    const {title,completed,priority} = req.body;

    
    const ownerId = req.user!.id;
    
    const newTask = {id:tasks.length + 1 ,title,completed,priority,ownerId}

    tasks.push(newTask)

    res.status(201).json({
    success: true,
    task:newTask,
    });
}

export const putTask = async(req:Request<{id:string},{},CreateTask>,res:Response) =>{
    const id = Number(req.params.id)

    const task = tasks.find((task)=>task.id === id)
    if(!task){
        throw new NotFoundError("Task not found");
    }

    if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
    return res.status(403).json({
        success: false,
        message: "You do not have permission to update this task"
    });
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

    const task = tasks[index];

    if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
    return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this task"
    });
    }
    

    tasks.splice(index,1)

    return res.status(200).json({
            success:true,
            message:"Task deleted successfully",
            tasks
        })

}