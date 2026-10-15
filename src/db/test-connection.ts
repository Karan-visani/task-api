import { da } from "zod/locales"
import prisma from "./prisma.js"
import { tasks } from "../data/task.js";

const main = async() =>{
//     const user = await prisma.user.findUnique({
//     where: {
//       email: "admin@example.com",
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

// const user = await prisma.user.create({
//     data: {
//       email:"user@gmail.com",
//       password:"user-hash",
//       role:"user"
//     },
//   });

  // const task = await prisma.task.create({
  //   data: {
  //     title: "Learn Django",
  //     completed: false,
  //     priority: "medium",
  //     userId: 4,
  //   },
  // });

//   console.log("Created task:", task);

  // const tasks = await prisma.task.findMany()
  // const users = await prisma.user.findMany()
//   console.log("Tasks :", tasks);


    // const task = await prisma.task.findMany({
    //     where:{
    //         id:1,
    //         completed:false
    //     }
    // })

    // console.log(task);

    // const updateTask = await prisma.task.update({
    //     where:{
    //         id:4,
    //     }, 
    //     data:{
    //         completed:true
    //     }
    // })
    // console.log(tasks);
    
    // const deleteTask = await prisma.task.delete({
    //     where:{
    //         id:5
    //     }
    // }) 
    
    
    // const usersTask = await prisma.user.findUnique({
      //   where:{
        //     email:"user@gmail.com"
        //   },
        //   include:{
          //     tasks:true
          //   }
          // })
          // console.log(usersTask);
          
          // const usersSelectedFields = await prisma.user.findUnique({
            //   where:{
              //     email:"user@gmail.com"
              //   },
              //   select:{
                //     email:true,
    //     password:false,
    //     role:true
    //   }
    // })
    // console.log(usersSelectedFields);
    
    
    
    // console.log(tasks);
    // console.log(users);

  //   const users = await prisma.user.findMany({
  //   select: {
  //     id: true,
  //     email: true,
  //     role: true,
  //   },
  // });

  // const tasks = await prisma.task.findMany({
  //   include: {
  //     user: {
  //       select: {
  //         email: true,
  //       },
  //     },
  //   },
  // });

  // console.log("Users:", users);
  // console.log("Tasks:", tasks);

  const pract = await prisma.user.findUnique({
  where:{
    email:"dhruhi@example.com",
  },
  select:{
    tasks:{
      where:{
        completed:false
      },
      select:{
        title:true,
        priority:true
      }
    }
  }
  })

  console.log(pract);
  
};

main().catch(console.error).finally(()=>prisma.$disconnect())