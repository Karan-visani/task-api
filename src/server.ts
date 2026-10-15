import "dotenv/config";
import express from "express"
import { taskRouter } from "./routes/task.routes.js"
import { authRouter } from "./routes/auth.routes.js"
import { errorHandler } from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser";
import app from "./app.js";

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})