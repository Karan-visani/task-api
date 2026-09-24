import {z} from "zod"

export const createTaskSchema = z.object({
    title : z.string().min(1,"Title must be of atleast one character"),
    completed : z.boolean(),
    priority : z.enum(["low","medium","high"])
})

export type createTaskInput = z.infer<typeof createTaskSchema>