export type Role = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
}
