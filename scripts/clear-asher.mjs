import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAsherData() {
  // Find Asher's user
  const user = await prisma.user.findFirst({
    where: { name: { contains: 'Asher' } }
  });

  if (!user) {
    console.log('User Asher not found');
    return;
  }

  console.log('Found user:', user.id, user.name, user.email);

  // Delete messages
  const deletedMessages = await prisma.skippyMessage.deleteMany({
    where: { userId: user.id }
  });
  console.log('Deleted messages:', deletedMessages.count);

  // Delete ledgers
  const deletedLedgers = await prisma.conversationLedger.deleteMany({
    where: { userId: user.id }
  });
  console.log('Deleted ledgers:', deletedLedgers.count);

  // Delete progress
  const deletedProgress = await prisma.progress.deleteMany({
    where: { userId: user.id }
  });
  console.log('Deleted progress:', deletedProgress.count);

  console.log('Done! Asher has a fresh start.');
}

clearAsherData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
