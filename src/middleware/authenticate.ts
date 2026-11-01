import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";

export const authenticate = (req:Request,res:Response,next:NextFunction) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success:false,
            message:"Authorization header is missing"
        })
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format. Use Bearer <token>"
        });
    }


    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    try {
        const decoded = jwt.verify(token, secret);

    if (
        typeof decoded === "string" ||
        typeof decoded.id !== "number" ||
        typeof decoded.email !== "string" ||
        (decoded.role !== "user" && decoded.role !== "admin")
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid token payload"
        });
    }

    const user: AuthPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
    };

    req.user = user;
    next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

    next()
}