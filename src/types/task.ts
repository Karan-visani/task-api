export interface Task  {
    id:number;
    title:string;
    completed:boolean;
    priority:"low" | "medium" | "high";
    userId: number
}

export type CreateTask = Omit<Task,"id" | "userId">