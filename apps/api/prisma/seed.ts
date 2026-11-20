import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
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

  console.log('Test users seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
