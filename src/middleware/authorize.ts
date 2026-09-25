import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../types/auth";
import { AppError } from "../errors/appError";

export const authorize = (...roles:AuthUser["role"][]) =>{
    return (req:Request,res:Response,next:NextFunction) => {
        const user = res.locals.user
        
        if (!user) {
          throw new AppError("Authentication required", 401);
        }

        if (!roles.includes(user.role)) {
          throw new AppError("Access denied", 403);
        }

        next();
    }
}