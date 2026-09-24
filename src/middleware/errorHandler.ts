import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (err:unknown,req:Request,res:Response,next:NextFunction) =>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message,
            ...(err.errors !== undefined &&{
                errors:err.errors,
            }) 
        })
    }

    return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

}