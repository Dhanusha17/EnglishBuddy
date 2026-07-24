import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const url = 'http://localhost:3000';

async function main() {
  console.log("🚀 Starting end-to-end validation test...");

  const email = 'teststudent' + Date.now() + '@example.com';
  const password = 'Password123!';
  
  // 1. Register student
  console.log("\n[1] Registering student...");
  let res = await fetch(url + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Student', email, password })
  });
  const regResult = await res.json();
  console.log("Register response:", res.status, regResult.message || regResult.error);
  if (res.status !== 201) throw new Error("Registration failed");

  // 2. Verify login blocked (Pending)
  console.log("\n[2] Attempting login as unapproved student...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginBlocked = await res.json();
  console.log("Login response:", res.status, loginBlocked.error);
  if (res.status !== 403) throw new Error("Expected 403 Forbidden for pending user");

  // 3. Login as Admin
  console.log("\n[3] Logging in as Admin...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@englishbuddy.com', password: 'Admin@123' })
  });
  if (!res.ok) throw new Error('Admin login failed: ' + res.status);
  const adminCookies = res.headers.get('set-cookie');

  // 4. Approve student
  console.log("\n[4] Approving student...");
  res = await fetch(url + '/api/admin/users/pending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cookie': adminCookies! },
    body: JSON.stringify({ userId: regResult.user.id, action: "APPROVE" })
  });
  const approveResult = await res.json();
  console.log("Approve response:", res.status, approveResult.message);
  if (res.status !== 200) throw new Error("Approval failed");

  // 5. Login as student (Approved)
  console.log("\n[5] Logging in as Approved Student...");
  res = await fetch(url + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Student login failed after approval: ' + res.status);
  const studentCookies = res.headers.get('set-cookie');
  console.log("Login successful.");

  // 6. Verify dashboard starts with zero progress
  console.log("\n[6] Fetching dashboard summary...");
  res = await fetch(url + '/api/dashboard/summary', {
    headers: { 'cookie': studentCookies! }
  });
  let summary = await res.json();
  console.log("Initial Dashboard Summary:", summary);
  if (summary.xp !== 0) throw new Error("Expected initial XP to be 0");

  // 7. Complete one lesson
  console.log("\n[7] Finding a lesson to complete...");
  const lesson = await prisma.lesson.findFirst();
  if (!lesson) {
    console.log("No lessons in DB. Creating a dummy lesson...");
    const course = await prisma.course.create({
      data: {
        title: "Test Course", description: "Test",
        lessons: {
          create: {
            title: "Test Lesson", orderIndex: 1, xpReward: 50, textContent: "Test"
          }
        }
      }
    });
  }
  const lessonToComplete = await prisma.lesson.findFirst();
  
  console.log(`Completing lesson ${lessonToComplete!.id}...`);
  res = await fetch(url + `/api/learning/lessons/${lessonToComplete!.id}/complete`, {
    method: 'POST',
    headers: { 'cookie': studentCookies! }
  });
  const completeResult = await res.json();
  console.log("Complete lesson response:", res.status, completeResult.message);
  if (res.status !== 200) throw new Error("Lesson completion failed");

  // 8. Verify XP increases
  console.log("\n[8] Re-fetching dashboard summary to verify XP...");
  res = await fetch(url + '/api/dashboard/summary', {
    headers: { 'cookie': studentCookies! }
  });
  summary = await res.json();
  console.log("Updated Dashboard Summary XP:", summary.xp);
  if (summary.xp <= 0) throw new Error("Expected XP to increase after lesson completion");
  
  // Verify analytics update (chartData)
  const todayChart = summary.chartData[summary.chartData.length - 1];
  console.log("Today's Analytics Chart XP:", todayChart?.score);
  if (!todayChart || todayChart.score <= 0) throw new Error("Chart data was not updated");

  console.log("\n✅ ALL TESTS PASSED!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
