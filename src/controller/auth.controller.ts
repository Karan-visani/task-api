import { Request, Response } from "express";
import { LoginInput } from "../types/auth";
import { users } from "../data/users";
import { BadRequestError } from "../errors/appError";
import  jwt  from "jsonwebtoken";
import { success } from "zod";

export const loginUser = async(req:Request<{},{},LoginInput>,res:Response) =>{
    const {email,password} = req.body

    const user = users.find((user)=>user.email === email)

    if(!user || user.password !== password){
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
        maxAge:60*60*1000
    })
    
    return res.status(200).json({
        success:true,
        message:"Login Successfull"
    })

}