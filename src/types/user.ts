export type Role = "user" | "admin";

export interface User {
    id :Number,
    email :String ,
    password :String ,
    role : Role
}