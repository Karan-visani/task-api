import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../errors/appError";

export const validateBody = (schema:ZodType) =>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const result = schema.safeParse(req.body)

        if(!result.success){
            throw new BadRequestError(
              "Validation failed",
              result.error.issues
            );
        }

        next()
    }

}