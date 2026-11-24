import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import {
  CreateTaskInputSchema,
  TaskQuerySchema,
  TaskSchema,
  TaskWithUserSchema,
  UpdateTaskInputSchema,
  UserSchema,
} from '@task-api/shared';

// Shared schemas are CommonJS, so register OpenAPI extensions on that Zod instance.
const commonJsRequire = createRequire(resolve(process.cwd(), 'package.json'));
const { z } = commonJsRequire('zod') as typeof import('zod');

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.register('User', UserSchema.clone());

registry.register('Task', TaskSchema.clone());

registry.register('TaskWithUser', TaskWithUserSchema.clone());

registry.register('CreateTaskInput', CreateTaskInputSchema.clone());

registry.register('UpdateTaskInput', UpdateTaskInputSchema.clone());

registry.register(
  'TaskResponse',
  z.object({
    success: z.boolean(),
    task: TaskSchema,
  }),
);

registry.register(
  'TaskUpdateResponse',
  z.object({
    success: z.boolean(),
    message: z.string(),
    task: TaskSchema,
  }),
);

registry.register(
  'TaskDeleteResponse',
  z.object({
    success: z.boolean(),
    message: z.string(),
    tasks: TaskSchema,
  }),
);

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// GET /api/v1/tasks
registry.registerPath({
  method: 'get',
  path: '/api/v1/tasks',
  tags: ['Tasks'],
  security: [{ bearerAuth: [] }],
  summary: 'Get tasks',
  description: 'Returns a paginated list of tasks.',
  request: {
    query: TaskQuerySchema,
  },
  responses: {
    200: {
      description: 'Tasks retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TaskWithUser',
                },
              },
              nextCursor: {
                type: 'integer',
                nullable: true,
              },
            },
            required: ['data', 'nextCursor'],
          },
        },
      },
    },
  },
});

// GET /api/v1/tasks/{id}
registry.registerPath({
  method: 'get',
  path: '/api/v1/tasks/{id}',
  tags: ['Tasks'],
  security: [{ bearerAuth: [] }],
  summary: 'Get a task by ID',
  description: 'Returns a single task by its ID.',
  request: {
    params: z.object({
      id: z.coerce.number().int().positive(),
    }),
  },
  responses: {
    200: {
      description: 'Task retrieved successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TaskResponse',
          },
        },
      },
    },
    404: {
      description: 'Task not found',
    },
  },
});

// POST /api/v1/tasks/add
registry.registerPath({
  method: 'post',
  path: '/api/v1/tasks/add',
  tags: ['Tasks'],
  security: [{ bearerAuth: [] }],
  summary: 'Create a task',
  description: 'Creates a new task for the authenticated user.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTaskInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Task created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TaskResponse',
          },
        },
      },
    },
    400: {
      description: 'Validation failed',
    },
  },
});

// PUT /api/v1/tasks/update/{id}
registry.registerPath({
  method: 'put',
  path: '/api/v1/tasks/update/{id}',
  tags: ['Tasks'],
  security: [{ bearerAuth: [] }],
  summary: 'Update a task',
  description: 'Updates an existing task.',
  request: {
    params: z.object({
      id: z.coerce.number().int().positive(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateTaskInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Task updated successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TaskUpdateResponse',
          },
        },
      },
    },
    400: {
      description: 'Validation failed',
    },
    404: {
      description: 'Task not found',
    },
  },
});

export const generateOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description:
        'Task management API built with Express, TypeScript, Prisma and Zod.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  });
};

// DELETE /api/v1/tasks/delete/{id}
registry.registerPath({
  method: 'delete',
  path: '/api/v1/tasks/delete/{id}',
  tags: ['Tasks'],
  security: [{ bearerAuth: [] }],
  summary: 'Delete a task',
  description: 'Deletes an existing task.',
  request: {
    params: z.object({
      id: z.coerce.number().int().positive(),
    }),
  },
  responses: {
    200: {
      description: 'Task deleted successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TaskDeleteResponse',
          },
        },
      },
    },
    404: {
      description: 'Task not found',
    },
  },
});

registry.register(
  'LoginResponse',
  z.object({
    success: z.boolean(),
    message: z.string(),
    token: z.string(),
  }),
);

registry.register(
  'SignupResponse',
  z.object({
    success: z.boolean(),
    message: z.string(),
    user: UserSchema,
  }),
);

// POST /api/v1/auth/login
registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  tags: ['Authentication'],
  summary: 'Login',
  description: 'Authenticates a user and returns a JWT.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.email(),
            password: z.string().min(1),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginResponse',
          },
        },
      },
    },
    401: {
      description: 'Invalid email or password',
    },
    429: {
      description: 'Too many login attempts',
    },
  },
});

// POST /api/v1/auth/signup
registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/signup',
  tags: ['Authentication'],
  summary: 'Sign up',
  description: 'Creates a new user account.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(1),
            email: z.email(),
            password: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Signup successful',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/SignupResponse',
          },
        },
      },
    },
    409: {
      description: 'Email already exists',
    },
  },
});
