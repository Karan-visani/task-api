export interface Task  {
    id:number;
    title:string;
    completed:boolean;
    priority:"low" | "medium" | "high";
    ownerId : number
}

export type CreateTask = Omit<Task,"id" | "ownerId">