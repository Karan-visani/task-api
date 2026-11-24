import { z } from 'zod';
import {
  CreateTaskInput,
  CreateTaskInputSchema,
  CreateTaskResponseSchema,
  DeleteTaskResponseSchema,
  LoginResponseSchema,
  MeResponseSchema,
  SignupResponseSchema,
  Task,
  TaskListResponseSchema,
  UpdateTaskInput,
  UpdateTaskInputSchema,
  UpdateTaskResponseSchema,
  type TaskQuery,
} from '@task-api/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

type ApiError = {
  success: false;
  message: string;
  errors?: {
    field?: string;
    message: string;
  }[];
};

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: unknown = await response.json();

  if (response.status === 401) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = data as Partial<ApiError>;

    throw new Error(
      error.message || `API request failed with status ${response.status}`,
    );
  }

  if (schema) {
    return schema.parse(data);
  }

  return data as T;
}

export async function login(
  email: string,
  password: string,
): Promise<z.infer<typeof LoginResponseSchema>> {
  return apiFetch(
    '/api/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
    LoginResponseSchema,
  );
}

export async function getTasks(
  query: Partial<TaskQuery> = {},
): Promise<z.infer<typeof TaskListResponseSchema>> {
  const params = new URLSearchParams();

  if (query?.status) {
    params.set('status', query.status);
  }

  if (query?.cursor !== undefined) {
    params.set('cursor', String(query.cursor));
  }

  params.set('limit', String(query?.limit ?? 10));

  if (query?.order) {
    params.set('order', query.order);
  }
  const queryString = params.toString();

  return apiFetch(
    `/api/v1/tasks${queryString ? `?${queryString}` : ''}`,
    {},
    TaskListResponseSchema,
  );
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const validatedInput = CreateTaskInputSchema.parse(input);

  const response = await apiFetch(
    '/api/v1/tasks',
    {
      method: 'POST',
      body: JSON.stringify(validatedInput),
    },
    CreateTaskResponseSchema,
  );

  return response.task;
}

export async function updateTask({
  id,
  input,
}: {
  id: number;
  input: UpdateTaskInput;
}): Promise<Task> {
  const validatedInput = UpdateTaskInputSchema.parse(input);

  const response = await apiFetch(
    `/api/v1/tasks/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(validatedInput),
    },
    UpdateTaskResponseSchema,
  );

  return response.task;
}

export async function deleteTask(id: number): Promise<Task> {
  const response = await apiFetch(
    `/api/v1/tasks/${id}`,
    {
      method: 'DELETE',
    },
    DeleteTaskResponseSchema,
  );

  return response.tasks;
}

export async function signup(name: string, email: string, password: string) {
  const response = await apiFetch(
    '/api/v1/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
    SignupResponseSchema,
  );

  return response.user;
}

export async function logout() {
  return apiFetch('/api/v1/auth/logout', {
    method: 'POST',
  });
}

export async function getMe() {
  const response = await apiFetch('/api/v1/auth/me', {}, MeResponseSchema);

  return response.user;
}
