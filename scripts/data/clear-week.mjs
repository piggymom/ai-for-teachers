import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const week = parseInt(process.argv[2] || "2");

// Clear messages
const messages = await prisma.skippyMessage.deleteMany({
  where: { week: week }
});
console.log("Deleted " + messages.count + " messages from Week " + week);

// Clear ledger
const ledgers = await prisma.conversationLedger.deleteMany({
  where: { weekNumber: week }
});
console.log("Deleted " + ledgers.count + " ledger(s) from Week " + week);

await prisma.$disconnect();
