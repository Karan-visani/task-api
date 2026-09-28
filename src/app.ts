import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express"
import { taskRouter } from "./routes/task.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express()

app.use(express.json())
app.use(cookieParser());

app.use("/tasks",taskRouter)
app.use("/auth",authRouter)

app.use(errorHandler);

export default app