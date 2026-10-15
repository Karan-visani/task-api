import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError.js";
import { Prisma } from "@prisma/client";

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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "A record with this value already exists",
        });

      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Related record does not exist",
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
    }
  }

  // Log the internal error for debugging
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};