import "dotenv/config";
import express from "express"
import { taskRouter } from "./routes/task.routes"
import { authRouter } from "./routes/auth.routes"
import { errorHandler } from "./middleware/errorHandler"
import cookieParser from "cookie-parser";

const PORT = 3000

const app = express()
app.use(express.json())
app.use(cookieParser());

app.use("/tasks",taskRouter)
app.use("/auth",authRouter)

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})