import { Request, Response } from "express";
import { users } from "../data/users";
import { success } from "zod";
import jwt from "jsonwebtoken";

export const login = (req:Request,res:Response) =>{

    const {email,password} = req.body

    const user =  users.find((user)=>user.email === email && user.password === password)

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
    }

    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET is not configured");
    }

    const token  = jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role
        },
        secret,
        {
            expiresIn:"1h"
        }
    )

    return res.status(201).json({
        success:true,
        message:"Login Successful",
        token
    })
}