import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const url = 'http://localhost:3000';

async function main() {
  console.log("🚀 Starting User Management Lifecycle Test...");

  // Get Admin for auth
  const adminUser = await prisma.user.findFirst({ where: { role: { name: 'admin' } } });
  if (!adminUser) throw new Error("No admin user found for testing");

  const adminToken = sign(
    { sub: adminUser.id, role: "admin" },
    process.env.JWT_SECRET || "default_secret_for_development",
    { expiresIn: "1h" }
  );
  const adminCookie = `access_token=${adminToken}`;

  const testEmail = `test_mgmt_${Date.now()}@example.com`;

  // 1. Register a new user
  console.log(`\n[1] Registering new user: ${testEmail}`);
  let res = await fetch(url + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Mgmt Test User", email: testEmail, password: "Password123!" })
  });
  if (res.status !== 201) throw new Error(`Registration failed: ${await res.text()}`);

  const newUser = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!newUser || newUser.status !== "PENDING") throw new Error("New user is not PENDING");
  console.log("✅ User registered and is PENDING");

  // 2. Attempt login (Should fail with 403)
  console.log("\n[2] Attempting login as PENDING user...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: "Password123!" })
  });
  let data = await res.json();
  if (res.status !== 403 || !data.error.includes("waiting for administrator approval")) {
    throw new Error(`Expected 403 waiting for approval, got ${res.status}: ${data.error}`);
  }
  console.log("✅ Blocked login correctly");

  // 3. Admin approves user
  console.log("\n[3] Admin approving user to ACTIVE...");
  res = await fetch(`${url}/api/admin/users/${newUser.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({ status: 'ACTIVE' })
  });
  if (res.status !== 200) throw new Error(`Approval failed: ${await res.text()}`);
  console.log("✅ User approved");

  // 4. Attempt login (Should succeed with 200)
  console.log("\n[4] Attempting login as ACTIVE user...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: "Password123!" })
  });
  if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
  console.log("✅ Login succeeded");

  // 5. Admin suspends user
  console.log("\n[5] Admin suspending user...");
  res = await fetch(`${url}/api/admin/users/${newUser.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({ status: 'SUSPENDED' })
  });
  if (res.status !== 200) throw new Error(`Suspension failed: ${await res.text()}`);
  console.log("✅ User suspended");

  // 6. Attempt login (Should fail with 403)
  console.log("\n[6] Attempting login as SUSPENDED user...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: "Password123!" })
  });
  data = await res.json();
  if (res.status !== 403 || !data.error.includes("suspended")) {
    throw new Error(`Expected 403 suspended, got ${res.status}: ${data.error}`);
  }
  console.log("✅ Blocked login correctly");

  // 7. Admin reactivates and changes role
  console.log("\n[7] Admin reactivating user and changing role to Admin...");
  res = await fetch(`${url}/api/admin/users/${newUser.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({ status: 'ACTIVE', role: 'admin' })
  });
  data = await res.json();
  if (res.status !== 200 || data.user.role.name !== 'admin') throw new Error(`Reactivation/Role change failed`);
  console.log("✅ User reactivated and made admin");

  // 8. Admin deletes user
  console.log("\n[8] Admin deleting user...");
  res = await fetch(`${url}/api/admin/users/${newUser.id}`, {
    method: 'DELETE',
    headers: { 'Cookie': adminCookie }
  });
  if (res.status !== 200) throw new Error(`Deletion failed: ${await res.text()}`);
  
  const deletedUser = await prisma.user.findUnique({ where: { id: newUser.id } });
  if (deletedUser) throw new Error("User was not actually deleted from DB");
  console.log("✅ User completely deleted");

  console.log("\n🎉 ALL USER MANAGEMENT TESTS PASSED!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
