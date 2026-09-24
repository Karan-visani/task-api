import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateBody = (schema:ZodType) =>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const result = schema.safeParse(req.body)

        if(!result.success){
            return res.status(400).json({
                message:"Validation failed",
                success:false,
                error:result.error.issues[0].message
            })
        }

        next()
    }

}