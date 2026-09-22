import express from "express"
import { taskRouter } from "./routes/task.routes"

const app = express()
app.use(express.json())

const PORT = 3000

app.use("/tasks",taskRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})