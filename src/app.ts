import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express"
import { taskRouter } from "./routes/task.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express()

app.use(express.json())
app.use(cookieParser());

app.use("/tasks",taskRouter)
app.use("/auth",authRouter)

app.use(errorHandler);

export default app