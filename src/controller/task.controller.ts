import { Request, Response } from "express"
import {tasks} from "../data/task"

export const getTasks =async (req:Request,res:Response)=>{
    res.json({
        success:true,
        tasks
})
}