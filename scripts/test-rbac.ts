import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const url = 'http://localhost:3000';

async function main() {
  console.log("🚀 Starting RBAC verification test...");

  // Get Admin and Student users from DB
  const adminUser = await prisma.user.findFirst({ where: { role: { name: 'admin' } } });
  const studentUser = await prisma.user.findFirst({ where: { role: { name: 'student' } } });

  if (!adminUser || !studentUser) {
    throw new Error("Missing admin or student user for testing");
  }

  // Create mock cookies
  const adminToken = sign(
    { sub: adminUser.id, role: "admin" },
    process.env.JWT_SECRET || "default_secret_for_development",
    { expiresIn: "1h" }
  );

  const studentToken = sign(
    { sub: studentUser.id, role: "student" },
    process.env.JWT_SECRET || "default_secret_for_development",
    { expiresIn: "1h" }
  );

  const adminCookie = `access_token=${adminToken}`;
  const studentCookie = `access_token=${studentToken}`;

  // Test 1: Student API Access -> 403 Forbidden
  console.log("\n[1] Testing Student API Access (Expected 403)...");
  let res = await fetch(url + '/api/admin/users/pending', {
    headers: { 'Cookie': studentCookie }
  });
  console.log("Status:", res.status);
  const text1 = await res.text();
  console.log("Response text:", text1);
  if (res.status !== 403 || text1 !== 'HTTP 403 Forbidden') throw new Error("Student API access did not return exact 403 Forbidden");

  // Test 2: Admin API Access -> 200 OK
  console.log("\n[2] Testing Admin API Access (Expected 200)...");
  res = await fetch(url + '/api/admin/users/pending', {
    headers: { 'Cookie': adminCookie }
  });
  console.log("Status:", res.status);
  if (res.status !== 200) throw new Error("Admin API access failed");

  // Test 3: Student Frontend Admin Route -> Redirect to dashboard
  console.log("\n[3] Testing Student Frontend Route (Expected Redirect)...");
  res = await fetch(url + '/admin', {
    headers: { 'Cookie': studentCookie },
    redirect: 'manual'
  });
  console.log("Status:", res.status);
  const location = res.headers.get('location');
  console.log("Redirect Location:", location);
  if (res.status < 300 || res.status >= 400 || !location?.includes('/dashboard?error=unauthorized')) {
    throw new Error("Student frontend access did not redirect correctly");
  }

  // Test 4: Admin Frontend Route -> 200 OK
  console.log("\n[4] Testing Admin Frontend Route (Expected 200)...");
  res = await fetch(url + '/admin', {
    headers: { 'Cookie': adminCookie }
  });
  console.log("Status:", res.status);
  if (res.status !== 200) throw new Error("Admin frontend access failed");

  console.log("\n✅ ALL RBAC TESTS PASSED!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
