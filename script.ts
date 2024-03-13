//db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

//app.ts
// import prisma from './prisma/soccer/db';

async function main() {
  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      username: 'bob123',
      email: 'bob@gmail.com',
      name: 'Bob',
    },
  });

  console.log('New user created:', newUser);

  // Retrieve all users
  const users = await prisma.user.findMany();
  console.log('All users:', users);
}

main()
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
