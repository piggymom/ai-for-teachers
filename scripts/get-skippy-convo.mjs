import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the most recent user
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!user) {
    console.log('No users found');
    return;
  }

  console.log('User:', user.name, '(' + user.email + ')');
  console.log('---');

  // Get their most recent Skippy messages
  const messages = await prisma.skippyMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  // Reverse to show in chronological order
  messages.reverse();

  if (messages.length === 0) {
    console.log('No Skippy conversations found');
    return;
  }

  console.log('Week', messages[0].week, 'conversation:\n');

  for (const msg of messages) {
    const role = msg.role === 'user' ? 'YOU' : 'SKIPPY';
    console.log(role + ': ' + msg.content);
    console.log('');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
