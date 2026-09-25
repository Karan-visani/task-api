import { AuthUser } from "../types/auth";

export interface User extends AuthUser {
  password: string;
}

export const users:User[] = [{
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123",
    role: "user",
  },]