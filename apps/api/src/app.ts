import 'dotenv/config';

import express from 'express';
import { taskRouter } from './routes/task.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';

const app = express();

app.use(express.json());

app.use(requestLogger);
app.use('/auth', authRouter);
app.use('/tasks', authenticate, taskRouter);
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
  });
});
app.use(errorHandler);

export default app;
