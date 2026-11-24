import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const secret = env.JWT_SECRET;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'Login Successful',
  });
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'user',
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Signup successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getMe = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
