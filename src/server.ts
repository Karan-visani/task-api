import express from "express"
import { taskRouter } from "./routes/task.routes"
import { errorHandler } from "./middleware/errorHandler"

const app = express()
app.use(express.json())

const PORT = 3000

app.use("/tasks",taskRouter)

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})