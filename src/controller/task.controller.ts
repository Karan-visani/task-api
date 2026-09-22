import { Request, Response } from "express"
import {tasks} from "../data/task"
import { CreateTask } from "../types/task"

export const getTasks =async (req:Request,res:Response)=>{
    res.json({
        success:true,
        tasks
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