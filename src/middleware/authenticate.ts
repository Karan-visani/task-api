import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth";


export const authenticate = (req:Request,res:Response,next:NextFunction) =>{

    const token = req.cookies.token

    if(!token){
        throw new AppError("Authentication required", 401);
    }
    

    try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;

    res.locals.user = decoded;

    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

}