// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "dhanusha.1608@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user) {
    console.log(`User not found: ${email}`);
    return;
  }

  const prevRole = user.role?.name || "none";

  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" }
  });

  if (!adminRole) {
    console.log("Admin role not found in database.");
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      roleId: adminRole.id,
      status: "APPROVED",
      accountActive: true,
    },
    include: { role: true }
  });

  console.log(JSON.stringify({
    email: updatedUser.email,
    previousRole: prevRole,
    newRole: updatedUser.role.name,
    status: updatedUser.status,
    accountActive: updatedUser.accountActive
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
