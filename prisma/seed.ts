import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      passwordHash: "dummy_hash",
      role: "user",
      tasks: {
        create: [
          {
            title: "Learn Prisma Seeding",
            priority: "high",
          },
          {
            title: "Practise Prisma Relations",
            priority: "medium",
          },
        ],
      },
    },
  });

  console.log("Created user:", user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });