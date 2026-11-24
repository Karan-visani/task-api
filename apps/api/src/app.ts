import './docs/zod-openapi';
import 'dotenv/config';

import express from 'express';
import { taskRouter } from './routes/task.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { generateOpenAPIDocument } from './docs/openapi';
import cookieParser from 'cookie-parser';
import { adminRouter } from './routes/admin.routes';
const app = express();
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

const openAPIDocument = generateOpenAPIDocument();
app.use(cookieParser());
app.use('/api/v1/docs', swaggerUi.serve);
app.get('/api/v1/docs', swaggerUi.setup(openAPIDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticate, taskRouter);
app.use('/api/v1/admin', adminRouter);
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
