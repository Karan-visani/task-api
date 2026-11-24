import { NextFunction, Request, Response } from 'express';

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  next();
};
