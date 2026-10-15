import { describe, expect, it } from "vitest";
import app from "../app.js";
import request from "supertest";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Task API",()=>{
    it("should return 401 when getting tasks without authentication", async () => {
  const response = await request(app).get("/tasks");

  expect(response.status).toBe(401);

  expect(response.body).toEqual({
    success: false,
    message: "Authentication required",
  });
});

it("should return 401 when using an invalid token", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Cookie", "token=invalid-token");

  expect(response.status).toBe(401);

  expect(response.body).toEqual({
    success: false,
    message: "Invalid or expired token",
  });
});


it("should return 403 when a normal user tries to delete another user's task", async () => {
  const suffix = `${Date.now()}-${Math.random()}`;
  const password = await bcrypt.hash("test-password", 10);

  const normalUser = await prisma.user.create({
    data: {
      email: `normal-${suffix}@example.com`,
      password,
      role: "user",
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      email: `owner-${suffix}@example.com`,
      password,
      role: "user",
    },
  });

  const task = await prisma.task.create({
    data: {
      title: "Task owned by another user",
      completed: false,
      priority: "high",
      userId: otherUser.id,
    },
  });

  const token = jwt.sign(
    {
      id: normalUser.id,
      email: normalUser.email,
      role: normalUser.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  try {
    const response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: "Access denied",
    });
  } finally {
    await prisma.task.deleteMany({
      where: { id: task.id },
    });

    await prisma.user.deleteMany({
      where: {
        id: { in: [normalUser.id, otherUser.id] },
      },
    });
  }
});

})