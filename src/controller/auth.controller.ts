import { Request, Response } from "express";
import { LoginInput } from "../types/auth.js";
import { users } from "../data/users.js";
import { BadRequestError } from "../errors/appError.js";
import  jwt  from "jsonwebtoken";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";


export const registerUser = async(req:Request,res:Response) =>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError("All Fields are required");
    }

    const existingUser = await prisma.user.findUnique({where:{email}})
    if(existingUser){
        throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            role:"user"
        }
    })

    const token = jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn:"1h"
        }
    )


    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge:60*60*1000,
        path:"/"
    })
    
    return res.status(201).json({
        success:true,
        message:"Signup Successfull"
    })
}


export const loginUser = async(req:Request<{},{},LoginInput>,res:Response) =>{
    const {email,password} = req.body

    // const user = users.find((user)=>user.email === email)
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!user || !(await bcrypt.compare(password, user.password))){
        throw new BadRequestError("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn:"1h"
        }
    )


    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge:60*60*1000,
        path:"/"
    })
    
    return res.status(200).json({
        success:true,
        message:"Login Successfull"
    })
}


export const logoutUser = async(req:Request,res:Response) =>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        path:"/"
    })

    return res.status(200).json({
        success:true,
        message:"Logout Successfull"
    })
}