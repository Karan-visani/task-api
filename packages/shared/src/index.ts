import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['user', 'admin']),
});
export type User = z.infer<typeof UserSchema>;

export const SignupResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  user: UserSchema,
});

export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, 'Title is required'),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  userId: z.number(),
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskWithUserSchema = TaskSchema.extend({
  user: z.object({
    name: z.string(),
  }),
});

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

export const TaskListResponseSchema = z.object({
  data: z.array(TaskWithUserSchema),
  nextCursor: z.number().nullable(),
});

export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;

export const DeleteTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  tasks: TaskSchema,
});

export type DeleteTaskResponse = z.infer<typeof DeleteTaskResponseSchema>;

export const LoginResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const CreateTaskResponseSchema = z.object({
  success: z.literal(true),
  task: TaskSchema,
});

export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export const UpdateTaskResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  task: TaskSchema,
});

export type UpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

export const MeResponseSchema = z.object({
  success: z.literal(true),
  user: UserSchema,
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
