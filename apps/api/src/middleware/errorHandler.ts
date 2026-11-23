import { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError } from '../errors/appError';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
      });
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err instanceof Error &&
    'type' in err &&
    err.type === 'entity.too.large'
  ) {
    return res.status(413).json({
      success: false,
      message: 'Request body is too large',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
