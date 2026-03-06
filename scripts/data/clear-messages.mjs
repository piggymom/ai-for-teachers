import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const week = parseInt(process.argv[2] || "1");

const result = await prisma.skippyMessage.deleteMany({
  where: { week: week }
});

console.log("Deleted " + result.count + " messages from Week " + week);

await prisma.$disconnect();
