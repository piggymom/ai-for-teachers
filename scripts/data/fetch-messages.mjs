import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const week = parseInt(process.argv[2] || "1");

const messages = await prisma.skippyMessage.findMany({
  where: { week: week },
  orderBy: { createdAt: 'asc' },
  select: { role: true, content: true }
});

messages.forEach((m) => {
  const role = m.role.toUpperCase();
  console.log("[" + role + "]:");
  console.log(m.content);
  console.log("");
});

await prisma.$disconnect();
