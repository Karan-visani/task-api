import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../errors/appError";


export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errors: err.errors
            });
        }

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
