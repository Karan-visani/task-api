import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/auth';
import prisma from '../config/database';
import { env } from '../config/env';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use Bearer <token>',
    });
  }

  const secret = env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string' || typeof decoded.id !== 'number') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    const authUser: AuthPayload = {
      id: user.id,
      email: user.email,
      role: user.role as 'user' | 'admin',
    };

    req.user = authUser;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
