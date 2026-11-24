import prisma from '../config/database';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Authentication tests', () => {
  it('should return 401 when token is missing', async () => {
    const response = await request(app).get('/api/v1/tasks');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Cookie', 'token=invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return 404 when a user deletes another user's task", async () => {
    const adminAgent = request.agent(app);
    const userAgent = request.agent(app);

    await adminAgent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'admin12345',
    });

    await userAgent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const createdTask = await adminAgent.post('/api/v1/tasks').send({
      title: 'Admin task for authorization test',
      completed: false,
      priority: 'high',
    });

    expect(createdTask.status).toBe(201);

    const taskId = createdTask.body.task.id;

    const response = await userAgent.delete(`/api/v1/tasks/${taskId}`);

    expect(response.status).toBe(404);
  });

  it('should return 400 when task body is invalid', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const response = await agent.post('/api/v1/tasks').send({
      title: '',
      completed: 'not-a-boolean',
      priority: 'urgent',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });

  it('should allow a user to create and retrieve their own task', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const created = await agent.post('/api/v1/tasks').send({
      title: 'My test task',
      completed: false,
      priority: 'medium',
    });

    expect(created.status).toBe(201);

    const user = await prisma.user.findUnique({
      where: { email: 'newuser@example.com' },
    });

    expect(user).not.toBeNull();
    expect(created.body.task.userId).toBe(user!.id);

    const taskId = created.body.task.id;

    const fetched = await agent.get(`/api/v1/tasks/${taskId}`);

    expect(fetched.status).toBe(200);
    expect(fetched.body.task.title).toBe('My test task');
  });

  it("should return 404 when a user updates another user's task", async () => {
    const adminAgent = request.agent(app);
    const userAgent = request.agent(app);

    await adminAgent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'admin12345',
    });

    await userAgent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const created = await adminAgent.post('/api/v1/tasks').send({
      title: 'Admin-owned task',
      completed: false,
      priority: 'high',
    });

    expect(created.status).toBe(201);

    const taskId = created.body.task.id;

    const response = await userAgent.put(`/api/v1/tasks/${taskId}`).send({
      title: 'Unauthorized update',
      completed: true,
      priority: 'low',
    });

    expect(response.status).toBe(404);
  });

  it('should allow a user to delete their own task', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const created = await agent.post('/api/v1/tasks').send({
      title: 'Task to delete',
      completed: false,
      priority: 'low',
    });

    expect(created.status).toBe(201);

    const taskId = created.body.task.id;

    const response = await agent.delete(`/api/v1/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should allow admin to access another user's task", async () => {
    const userAgent = request.agent(app);
    const adminAgent = request.agent(app);

    await userAgent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    await adminAgent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'admin12345',
    });

    const created = await userAgent.post('/api/v1/tasks').send({
      title: 'User-owned task',
      completed: false,
      priority: 'medium',
    });

    expect(created.status).toBe(201);

    const response = await adminAgent.get(
      `/api/v1/tasks/${created.body.task.id}`,
    );

    expect(response.status).toBe(200);

    const user = await prisma.user.findUnique({
      where: { email: 'newuser@example.com' },
    });

    expect(user).not.toBeNull();
    expect(response.body.task.userId).toBe(user!.id);
  });

  it('should return 400 for an invalid update body', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const created = await agent.post('/api/v1/tasks').send({
      title: 'Original',
      completed: false,
      priority: 'low',
    });

    expect(created.status).toBe(201);

    const response = await agent
      .put(`/api/v1/tasks/${created.body.task.id}`)
      .send({
        title: '',
        completed: 'yes',
        priority: 'urgent',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 for malformed authentication cookie', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Cookie', 'token=invalid-token');

    expect(response.status).toBe(401);
  });

  it('should return 401 for an expired token', async () => {
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const expiredToken = jwt.default.sign(
      { id: 5, email: 'newuser@example.com', role: 'user' },
      secret,
      { expiresIn: -1 },
    );

    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Cookie', `token=${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it('should return 401 for incorrect login credentials', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
  });

  it('should allow a user to update their own task', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const created = await agent.post('/api/v1/tasks').send({
      title: 'Before update',
      completed: false,
      priority: 'low',
    });

    expect(created.status).toBe(201);

    const response = await agent
      .put(`/api/v1/tasks/${created.body.task.id}`)
      .send({
        title: 'After update',
        completed: true,
        priority: 'high',
      });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe('After update');
  });

  it('should return 404 for a nonexistent task', async () => {
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'admin12345',
    });

    const response = await agent.get('/api/v1/tasks/999999');

    expect(response.status).toBe(404);
  });
});
