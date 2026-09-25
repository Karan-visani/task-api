export interface AuthUser {
    id:number,
    email:string,
    role:"user" | "admin"
}

export interface LoginInput {
    email:string,
    password:string
}

