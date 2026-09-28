import { describe, expect, it } from "vitest";
import app from "../app";
import request from "supertest";

describe("Task API",()=>{
    it("should return 401 when getting tasks without authentication",async()=>{
         const response = await request(app).get("/tasks")

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
        success:false,
        message:"Authentication required",
    })
    })


    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Login Successfull",
      });

      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should get tasks after authentication", async () => {
      const agent = request.agent(app);

      // Login
      const loginResponse = await agent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      expect(loginResponse.status).toBe(200);

      // Access protected route
      const response = await agent
        .get("/tasks");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject invalid login credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid email or password",
      });
    });

    it("should return 403 when a normal user tries to delete a task", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "user123",
        });

      const response = await agent
        .delete("/tasks/1");

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        success: false,
        message: "Access denied",
      });
    });

    it("should allow an admin to delete a task", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      const createResponse = await agent
        .post("/tasks")
        .send({
          title: "Task to delete",
          completed: false,
          priority: "high",
        });

      expect(createResponse.status).toBe(201);

      const taskId = createResponse.body.task.id;

      const response = await agent
        .delete(`/tasks/${taskId}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          message: "Task deleted successfully",
        })
      );
    });

    it("should reject invalid task data", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      const response = await agent
        .post("/tasks")
        .send({
          title: 123,
          completed: "false",
          priority: "urgent",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toBeDefined();
    });

    it("should return 404 when task does not exist", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      const response = await agent
        .get("/tasks/99999");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Task not found",
      });
    });

    it("should return 403 when a user tries to access another user's task", async () => {
  // Create a task as admin
      const adminAgent = request.agent(app);

      await adminAgent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      const createResponse = await adminAgent
        .post("/tasks")
        .send({
          title: "Admin private task",
          completed: false,
          priority: "high",
        });

      expect(createResponse.status).toBe(201);

      const taskId = createResponse.body.task.id;

      // Login as normal user
      const userAgent = request.agent(app);

      await userAgent
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "user123",
        });

      // Try to access admin's task
      const response = await userAgent
        .get(`/tasks/${taskId}`);

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        success: false,
        message: "Access denied",
      });
    });

    it("should allow a user to access their own task", async () => {
      const agent = request.agent(app);

      await agent
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "user123",
        });

      const createResponse = await agent
        .post("/tasks")
        .send({
          title: "My own task",
          completed: false,
          priority: "medium",
        });

      expect(createResponse.status).toBe(201);

      const taskId = createResponse.body.task.id;

      const response = await agent
        .get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          task: expect.objectContaining({
            id: taskId,
            title: "My own task",
            userId: 2,
          }),
        })
      );
    });

    it("should return 403 when a user tries to update another user's task", async () => {
      const adminAgent = request.agent(app);

      await adminAgent
        .post("/auth/login")
        .send({
          email: "admin@example.com",
          password: "admin123",
        });

      const createResponse = await adminAgent
        .post("/tasks")
        .send({
          title: "Admin task",
          completed: false,
          priority: "high",
        });

      expect(createResponse.status).toBe(201);

      const taskId = createResponse.body.task.id;

      const userAgent = request.agent(app);

      await userAgent
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "user123",
        });

      const response = await userAgent
        .put(`/tasks/${taskId}`)
        .send({
          title: "Trying to modify admin task",
          completed: true,
          priority: "low",
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        success: false,
        message: "Access denied",
      });
    });

    it("should allow a user to update their own task", async () => {
      const agent = request.agent(app);
        
      await agent
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "user123",
        });
    
      const createResponse = await agent
        .post("/tasks")
        .send({
          title: "Task before update",
          completed: false,
          priority: "low",
        });
    
      expect(createResponse.status).toBe(201);
    
      const taskId = createResponse.body.task.id;
    
      const response = await agent
        .put(`/tasks/${taskId}`)
        .send({
          title: "Task after update",
          completed: true,
          priority: "high",
        });
    
      expect(response.status).toBe(200);
    
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          message: "Task updated successfully",
          task: expect.objectContaining({
            id: taskId,
            title: "Task after update",
            completed: true,
            priority: "high",
            userId: 2,
          }),
        })
      );
    });
})