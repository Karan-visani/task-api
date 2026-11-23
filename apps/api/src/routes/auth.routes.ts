import express from 'express';
import { login, signup } from '../controller/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter';
export const authRouter = express.Router();

authRouter.post('/login', loginRateLimiter, login);
authRouter.post('/signup', signup);
