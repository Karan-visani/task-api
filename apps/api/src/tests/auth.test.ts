import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Authentication tests", () => {
    it("should return 401 when token is missing", async () => {
        const response = await request(app).get("/tasks");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("should return 401 when token is invalid", async () => {
        const response = await request(app)
            .get("/tasks")
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("should return 404 when a user updates another user's task", async () => {
    const adminLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@example.com",
            password: "admin12345"
        });

    const userLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const adminToken = adminLogin.body.token;
    const userToken = userLogin.body.token;

    const createdTask = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            title: "Admin task for authorization test",
            completed: false,
            priority: "high"
        });

    const taskId = createdTask.body.task.id;

    const response = await request(app)
        .delete(`/tasks/delete/${taskId}`)
        .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    });


    it("should return 400 when task body is invalid", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const token = login.body.token;

    const response = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "",
            completed: "not-a-boolean",
            priority: "urgent"
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
});

it("should allow a user to create and retrieve their own task", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const token = login.body.token;

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "My test task",
            completed: false,
            priority: "medium"
        });

    expect(created.status).toBe(201);
    expect(created.body.task.userId).toBe(5);

    const taskId = created.body.task.id;

    const fetched = await request(app)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(fetched.status).toBe(200);
    expect(fetched.body.task.title).toBe("My test task");
});

it("should return 404 when a user updates another user's task", async () => {
    const adminLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@example.com",
            password: "admin12345"
        });

    const userLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const adminToken = adminLogin.body.token;
    const userToken = userLogin.body.token;

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            title: "Admin-owned task",
            completed: false,
            priority: "high"
        });

    const taskId = created.body.task.id;

    const response = await request(app)
        .put(`/tasks/update/${taskId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
            title: "Unauthorized update",
            completed: true,
            priority: "low"
        });

    expect(response.status).toBe(404);
});

it("should allow a user to delete their own task", async () => {
    const login = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const token = login.body.token;

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Task to delete",
            completed: false,
            priority: "low"
        });

    const taskId = created.body.task.id;

    const response = await request(app)
        .delete(`/tasks/delete/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
});

it("should allow admin to access another user's task", async () => {
    const userLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "newuser@example.com",
            password: "password123"
        });

    const adminLogin = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@example.com",
            password: "admin12345"
        });

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${userLogin.body.token}`)
        .send({
            title: "User-owned task",
            completed: false,
            priority: "medium"
        });

    expect(created.status).toBe(201);

    const response = await request(app)
        .get(`/tasks/${created.body.task.id}`)
        .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.task.userId).toBe(5);
});



it("should return 400 for an invalid update body", async () => {
    const login = await request(app).post("/auth/login").send({
        email: "newuser@example.com",
        password: "password123"
    });

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send({ title: "Original", completed: false, priority: "low" });

    const response = await request(app)
        .put(`/tasks/update/${created.body.task.id}`)
        .set("Authorization", `Bearer ${login.body.token}`)
        .send({ title: "", completed: "yes", priority: "urgent" });

    expect(response.status).toBe(400);
});

it("should return 401 for malformed Authorization header", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", "invalid-token");

    expect(response.status).toBe(401);
});

it("should return 401 for an expired token", async () => {
    const jwt = await import("jsonwebtoken");
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET is not configured");

    const expiredToken = jwt.default.sign(
        { id: 5, email: "newuser@example.com", role: "user" },
        secret,
        { expiresIn: -1 }
    );

    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
});

it("should return 401 for incorrect login credentials", async () => {
    const response = await request(app).post("/auth/login").send({
        email: "newuser@example.com",
        password: "wrongpassword"
    });

    expect(response.status).toBe(401);
});

it("should allow a user to update their own task", async () => {
    const login = await request(app).post("/auth/login").send({
        email: "newuser@example.com",
        password: "password123"
    });

    const created = await request(app)
        .post("/tasks/add")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send({ title: "Before update", completed: false, priority: "low" });

    const response = await request(app)
        .put(`/tasks/update/${created.body.task.id}`)
        .set("Authorization", `Bearer ${login.body.token}`)
        .send({ title: "After update", completed: true, priority: "high" });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("After update");
});

it("should return 404 for a nonexistent task", async () => {
    const login = await request(app).post("/auth/login").send({
        email: "admin@example.com",
        password: "admin12345"
    });

    const response = await request(app)
        .get("/tasks/999999")
        .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(404);
});

});