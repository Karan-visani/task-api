import 'dotenv/config';
import { beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcrypt';
import prisma from '../config/database';

beforeAll(async () => {
  const adminPassword = await bcrypt.hash('admin12345', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      passwordHash: adminPassword,
      role: 'admin',
    },
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'newuser@example.com' },
    update: {
      passwordHash: userPassword,
      role: 'user',
    },
    create: {
      name: 'New User',
      email: 'newuser@example.com',
      passwordHash: userPassword,
      role: 'user',
    },
  });
});

afterAll(async () => {
  // Clean up tasks created during tests, then disconnect
  await prisma.task.deleteMany({
    where: {
      user: {
        email: { in: ['admin@example.com', 'newuser@example.com'] },
      },
    },
  });
  await prisma.$disconnect();
});
