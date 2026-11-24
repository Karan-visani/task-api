export interface AuthPayload {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
