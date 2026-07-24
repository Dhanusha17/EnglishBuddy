import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const url = 'http://localhost:3000';

async function main() {
  console.log("🚀 Starting First Admin Setup validation test...");

  // 1. Delete admin user to reset state
  console.log("\n[1] Deleting admin user...");
  await prisma.user.deleteMany({
    where: { role: { name: "admin" } }
  });
  console.log("Admin user deleted.");

  // 2. Setup GET request should succeed (we don't have a GET endpoint, just hitting the page)
  console.log("\n[2] Checking if /setup returns 200...");
  let res = await fetch(url + '/setup');
  console.log("/setup page status:", res.status);
  if (res.status !== 200) throw new Error("Expected 200 OK for setup page");

  // 3. POST to setup API
  console.log("\n[3] Creating first admin...");
  res = await fetch(url + '/api/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test.setup@example.com', password: 'Password123!' })
  });
  const setupResult = await res.json();
  console.log("Setup response:", res.status, setupResult);
  if (res.status !== 201) throw new Error("Expected 201 Created for setup");

  // 4. Try POST to setup API again (should fail)
  console.log("\n[4] Attempting to create admin again...");
  res = await fetch(url + '/api/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test2@example.com', password: 'Password123!' })
  });
  const setupResult2 = await res.json();
  console.log("Second setup response:", res.status, setupResult2.error);
  if (res.status !== 403) throw new Error("Expected 403 Forbidden for second setup attempt");

  console.log("\n✅ SETUP TESTS PASSED!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
