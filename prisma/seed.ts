import bcrypt from "bcryptjs"
import prisma from "../src/db/prisma.js"

const users= [{
    email:"admin@example.com",
    password:"admin123",
    role:"admin" as const
},{
    email:"dhruhi@example.com",
    password:"dhruhi123",
    role:"user" as const
},{
    email:"karan@example.com",
    password:"karan123",
    role:"user" as const
}]

const main = async() =>{
    for (const user of users){
        const hashedPassword = await bcrypt.hash(user.password,10)

        await prisma.user.upsert({
            where:{
                email:user.email
            },
            update:{
                password:hashedPassword,
                role:user.role,
            },
            create:{
                email:user.email,
                password:hashedPassword,
                role:user.role
            }
        })
    }

     // Fetch the users so we can use their actual database IDs.
    const admin = await prisma.user.findUniqueOrThrow({
        where: { email: "admin@example.com" },
    });

    const dhruhi = await prisma.user.findUniqueOrThrow({
        where: { email: "dhruhi@example.com" },
    });

    const karan = await prisma.user.findUniqueOrThrow({
        where: { email: "karan@example.com" },
    });


    const taskData = [
        {
            title: "Learn Prisma",
            completed: false,
            priority: "high" as const,
            userId: admin.id,
        },
        {
            title: "Build Task API",
            completed: true,
            priority: "medium" as const,
            userId: admin.id,
        },
        {
            completed: false,
            title: "Practice TypeScript",
            priority: "high" as const,
            userId: dhruhi.id,
        },
        {
            title: "Learn React",
            completed: false,
            priority: "low" as const,
            userId: karan.id,
        },
    ]

    for (const task of taskData){
        const existingTask = await prisma.task.findFirst({
            where:{
                title:task.title,
                userId:task.userId
            }
        })

        if(!existingTask){
            await prisma.task.create({
            data: task,
          });
        }
    }

    console.log("Database seeded successfully!");

}
 

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });