import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['USER', 'ADMIN']),
});
export type User = z.infer<typeof UserSchema>;

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  userId: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = TaskSchema.omit({
  id: true,
  userId: true,
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const UpdateTaskInputSchema = TaskSchema.omit({
  id: true,
  userId: true,
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

export const TaskQuerySchema = z.object({
  status: z.enum(['completed', 'pending']).optional(),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type TaskQuery = z.infer<typeof TaskQuerySchema>;
