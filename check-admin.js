// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({ where: { role: { name: 'admin' } }, include: { role: true } })
  .then(users => { console.log(JSON.stringify(users, null, 2)); prisma.$disconnect(); })
  .catch(console.error);
