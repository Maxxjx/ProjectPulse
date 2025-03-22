// check-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Connected to the database. Users:', users);
}

main()
  .catch((e) => {
    console.error('Error connecting to the database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
