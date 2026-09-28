import "dotenv/config";
import express from "express"
import { taskRouter } from "./routes/task.routes"
import { authRouter } from "./routes/auth.routes"
import { errorHandler } from "./middleware/errorHandler"
import cookieParser from "cookie-parser";
import app from "./app";

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})