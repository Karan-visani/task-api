import { Request, Response } from "express"
import {tasks} from "../data/task"
import { CreateTask } from "../types/task"
import { NotFoundError } from "../errors/appError"

export const getTasks =async (req:Request,res:Response)=>{
    res.json({
        success:true,
        tasks
})
}

export const getTask =  (req:Request<{id:string}>,res:Response)=>{
    const id = Number(req.params.id)

    const task = tasks.find((task)=>task.id === id)
    if(!task){
        throw new NotFoundError("Task not found");
    }

    res.json({
        success:true,
        task
    })
}

export const createTask= async(req:Request<{},{},CreateTask>,res:Response)=>{
    const {title,completed,priority} = req.body;

    const newTask : CreateTask = ({title,completed,priority})

    const task = {
        id : tasks.length + 1,
        ...newTask
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

    const index = tasks.findIndex((task) => task.id = id)

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