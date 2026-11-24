import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorizeAdmin } from '../middleware/authorizeAdmin';
export const adminRouter = express.Router();

adminRouter.get('/test', authenticate, authorizeAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin access granted',
    user: req.user,
  });
});
