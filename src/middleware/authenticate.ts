import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError.js";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth.js";
import prisma from "../db/prisma.js";


export const authenticate =async (req:Request,res:Response,next:NextFunction) =>{

    const token = req.cookies.token

    if(!token){
        throw new AppError("Authentication required", 401);
    }
    

    try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;


    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }
    res.locals.user = user;

    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

}