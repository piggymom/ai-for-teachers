const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) { console.log('No users found'); return; }
  const uid = user.id;
  const d1 = await prisma.podcast.deleteMany({ where: { userId: uid } });
  const d2 = await prisma.artifact.deleteMany({ where: { userId: uid } });
  const d3 = await prisma.conversationLedger.deleteMany({ where: { userId: uid } });
  const d4 = await prisma.skippyMessage.deleteMany({ where: { userId: uid } });
  const d5 = await prisma.progress.deleteMany({ where: { userId: uid } });
  const d6 = await prisma.consent.deleteMany({ where: { userId: uid } });
  const d7 = await prisma.userProfile.deleteMany({ where: { userId: uid } });
  console.log('Wiped:', { podcasts: d1.count, artifacts: d2.count, ledgers: d3.count, messages: d4.count, progress: d5.count, consents: d6.count, profiles: d7.count });
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
