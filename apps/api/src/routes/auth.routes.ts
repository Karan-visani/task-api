import express from 'express';
import { getMe, login, logout, signup } from '../controller/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/authenticate';
export const authRouter = express.Router();

authRouter.post('/login', loginRateLimiter, login);
authRouter.post('/signup', signup);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
